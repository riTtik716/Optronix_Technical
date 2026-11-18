# Decisions & Trade-Offs

As required by Section 6 of the Technical Interview Assignment, this document details the architectural decisions, trade-offs made during development, and key improvements planned for enterprise production.

---

## 1. Architectural Decisions & Problem Domain Assumptions

### A. Solving the Deliberately Open-Ended Design Scenario
> **Scenario:** *"A salesperson checks into a customer meeting at 10:02 AM. The meeting was scheduled for 10:00–11:00 AM. At 10:40 AM, the customer asks them to return at 3:00 PM instead. The salesperson returns at 3:10 PM and completes the meeting at 4:00 PM."*

#### 1. The Naive Approach (Rejected):
A simple flat schema stores `check_in_time` and `check_out_time` directly on the `Meeting` entity.
- If the salesperson checks in at 10:02 AM and checks out at 4:00 PM, the system calculates a total elapsed time of **5 hours and 58 minutes**.
- **Flaw:** In reality, the representative was only actively on site for **88 minutes** (38 minutes in the morning + 50 minutes in the afternoon). A flat schema corrupts salesperson billing, hourly capacity metrics, and compliance logs.

#### 2. Our Solution (Adopted):
We modeled a dedicated child entity: `MeetingSession` (`1:N` with `Meeting`).
- **10:02 AM:** The representative calls `POST /api/meetings/{id}/check-in`. `Session #1` is created with `check_in_time = 10:02`, `latitude = 44.9740`, `longitude = -93.2777`, and location name `"Target HQ Building A - West Visitor Entrance"`.
- **10:40 AM:** When interrupted, the representative clicks **Pause Visit** (`POST /api/meetings/{id}/pause`). `Session #1` records `check_out_time = 10:40`, duration is logged as **38 minutes**, and meeting status safely reverts to `CONFIRMED`.
- **3:10 PM:** Upon return, the representative clicks **Resume Visit** (`POST /api/meetings/{id}/resume`). `Session #2` is opened with `check_in_time = 15:10`.
- **4:00 PM:** Representative concludes the meeting with **Complete Visit** (`POST /api/meetings/{id}/complete`). `Session #2` records `check_out_time = 16:00` (duration **50 minutes**).
- **Result:** Exact on-site presence of **88 minutes**, discrete GPS proofs for both morning and afternoon arrivals, and a clear audit log entry explaining the customer's shift briefing request.

---

### B. Modular Monolith vs. Microservices
* **Decision:** We chose a **Modular Monolith** partitioned into domain packages (`modules/auth`, `modules/customer`, `modules/meeting`, `modules/followup`).
* **Trade-off:** Microservices introduce distributed transactions (2PC or Saga patterns), network latency overhead, and complex deployment manifests (Docker Swarm/Kubernetes). A modular monolith gives strong domain boundaries, clear interfaces, and in-memory transactional consistency. If high scale is reached, individual modules can be extracted into independent microservices with minimal friction.

---

### C. Authentication: 15-Minute JWT + Single-Use Refresh Token Rotation
* **Decision:** Stateless access tokens have a short lifespan (**15 minutes** / 900 seconds) signed with HMAC-SHA256. Refresh tokens are stored in the database as UUIDs and are strictly single-use: upon refresh, the old token is revoked and a new one is issued.
* **Trade-off:** Requiring a database lookup during token refresh incurs a minor database read every 15 minutes. In exchange, the system gains immediate token revocation capability (e.g., if an employee leaves or a device is lost) and eliminates token replay attacks.

---

### D. Liquibase for Database Evolution
* **Decision:** All database schema changes are managed through version-controlled Liquibase XML changelogs (`db/changelog/changes/*.xml`) with `ddl-auto: validate`.
* **Reasoning:** JPA entity auto-generation (`ddl-auto: update`) is risky in multi-developer environments and production databases. Liquibase guarantees immutable migration history, automatic rollback capabilities, and identical schema execution across local H2 and production PostgreSQL.

---

### E. Zero-Bloat Frontend Graphing (Custom SVG Bezier Curves)
* **Decision:** Instead of importing heavyweight charting libraries (Chart.js, Recharts, Plotly) that bloat bundle size by 300KB+, we implemented an interactive mathematical SVG Bezier curve engine (`VisitActivityCadenceChart`).
* **Benefits:** 
  - Zero external runtime dependencies.
  - Sub-millisecond mathematical recalculation on filter switches (`Today`, `Last Week`, `Last Month`).
  - Native CSS transitions, responsive coordinate normalization, and custom interactive tooltip styling matching modern SaaS design systems.

---

## 2. Deliberate Shortcuts Taken (For Assignment Scope)

1. **Embedded In-Memory H2 Database by Default:**
   - Evaluators can clone and run the application instantly with zero prerequisites (no Docker or PostgreSQL installation needed).
   - Production PostgreSQL drivers and configuration profiles are already configured in `pom.xml` and `application.yml`.
2. **Simplified Geofencing Distance Check:**
   - The application captures latitude, longitude, and location names from the browser/client, but does not enforce a rigid Haversine radial distance check against the customer's physical premises.

---

## 3. What We Would Change for Enterprise Production

1. **PostGIS Spatial Engine:**
   - Migrate latitude/longitude double columns to PostGIS `GEOMETRY(Point, 4326)` columns with spatial R-tree indexes.
   - Implement spatial boundary queries: `ST_DWithin(rep_location, customer_facility_polygon, 100)` to automatically enforce geofenced check-ins within 100 meters of the customer's gates.
2. **Distributed Redis Caching:**
   - Cache active refresh tokens, user permissions, and customer directories in Redis with TTL expirations.
   - Offload session verification from the primary relational database.
3. **Event-Driven Architecture (Kafka / RabbitMQ):**
   - Publish asynchronous domain events:
     - `MeetingCompletedEvent` ➔ Dispatches CRM webhook sync (Salesforce/HubSpot).
     - `FollowUpDueEvent` ➔ Triggers automated email reminders and manager push notifications.
     - `MeetingReopenedEvent` ➔ Sends compliance alerts to VP of Sales.
4. **Offline Mobile Synchronization (Offline-First):**
   - Field sales representatives frequently operate in basements, warehouses, or rural locations with zero cellular coverage.
   - In production, implement an offline queue with encrypted local storage (e.g., SQLite / WatermelonDB) and timestamp conflict resolution (CRDTs) to sync sessions when network connectivity resumes.
5. **Multi-Factor Authentication (MFA / WebAuthn):**
   - Enforce hardware security keys (FIDO2 / YubiKey) or TOTP authenticator apps for managerial and administrative actions (such as user deletion or meeting reopening).
