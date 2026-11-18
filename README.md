# Optronix Sales Meeting & Visit Management System

[![Java](https://img.shields.io/badge/Java-23-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-6.3-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)](https://spring.io/projects/spring-security)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Liquibase](https://img.shields.io/badge/Liquibase-4.27-2962FF?style=for-the-badge&logo=liquibase&logoColor=white)](https://www.liquibase.com/)

A production-grade **Modular Monolith** full-stack application built for managing enterprise sales visits, customer accounts, GPS-verified check-in/out lifecycles, split-session meetings, post-visit outcomes, and automated follow-up workflows.

---

## 📋 Table of Contents
1. [Core Features & Problem Domain](#-core-features--problem-domain)
2. [User Roles & Strict Access Control (RBAC)](#-user-roles--strict-access-control-rbac)
3. [Meeting Lifecycle & Open-Ended Scenario Solution](#-meeting-lifecycle--open-ended-scenario-solution)
4. [System Architecture & Engineering Principles](#-system-architecture--engineering-principles)
5. [Tech Stack](#-tech-stack)
6. [Pre-Seeded Real Enterprise Accounts](#-pre-seeded-real-enterprise-accounts)
7. [Quick Start & Setup Instructions](#-quick-start--setup-instructions)
8. [Automated Testing & Business Rules Verification](#-automated-testing--business-rules-verification)
9. [Companion Documentation](#-companion-documentation)

---

## 🎯 Core Features & Problem Domain

- **Customer & Account Directory:** Full CRM catalog of enterprise accounts (e.g., Siemens Healthineers, Schneider Electric, Novartis, Stripe, Boeing, Target) with contact personnel, direct emails, phone lines, and physical headquarters locations.
- **Meeting Lifecycle Management:** Rich state machine supporting `SCHEDULED` ➔ `CONFIRMED` ➔ `CHECKED_IN` ➔ `IN_PROGRESS` ➔ `COMPLETED` (plus managerial `REOPENED`).
- **GPS Check-In & Multi-Session Tracking:** Captures device latitude, longitude, and physical entrance names. Fully supports the open-ended split-visit scenario via multiple sessions per meeting.
- **Meeting Outcomes & Follow-Up Automation:** On completion, requires one of 5 outcomes:
  - `INTERESTED`
  - `FOLLOW_UP_REQUIRED` (Strictly enforces an action item, assigned owner, and due date)
  - `PROPOSAL_REQUESTED`
  - `NOT_INTERESTED`
  - `UNABLE_TO_MEET`
- **Manager Oversight & Reopening:** Sales Managers can review their team's meetings and reopen completed visits with mandatory justification and audit logging.
- **Executive Analytics & Cadence Charts:** Real-time dynamic SVG Bezier trend curves across `Today`, `Last Week` (rolling 7 days with calendar dates), and `Last Month` (rolling 4 weeks), complete with interactive hover tooltips and outcome percentage progress bars.
- **Virtual Meeting Support:** Integrated Google Meet launcher generating instant conferencing rooms with 1-click clipboard copy.
- **Admin User Management:** Administrators can dynamically create new Sales Reps and Managers, delete accounts, reset passwords, and inspect real-time user activity logs (logins, logouts, dashboard window closures).

---

## 👥 User Roles & Strict Access Control (RBAC)

The system enforces strict role-based access control backed by Spring Security `@PreAuthorize` annotations and custom SQL repository filters:

| Role | Default Demo Email | Password | Access Scope & Capabilities |
| :--- | :--- | :--- | :--- |
| **Sales Employee** (`ROLE_SALES_EMPLOYEE`) | `employee@optronix.com` | `password123` | **Personal Scope:** Strictly views and manages their own assigned meetings, performs GPS check-in/out, pauses/resumes sessions, logs outcomes, and tracks personal follow-ups. |
| **Sales Manager** (`ROLE_SALES_MANAGER`) | `manager@optronix.com` | `password123` | **Team Scope:** Complete oversight of all representatives reporting to them. Can view team visits, filter by individual rep, and execute manager-level actions (e.g., reopening a completed meeting with audit logging). |
| **System Admin** (`ROLE_ADMIN`) | `admin@optronix.com` | `password123` | **Global Scope:** System-wide administration across all company accounts, meetings, and users. Dynamically creates/deletes users, resets passwords, and monitors real-time user activity logs. |

*(Note: The login page includes quick-fill chips for these 3 primary roles, and the top navigation includes an instant 1-click role switcher for convenience during technical evaluation.)*

---

## 🔄 Meeting Lifecycle & Open-Ended Scenario Solution

### 1. State Machine Transitions
```
   [ SCHEDULED ] 
         │
         ▼ (confirm)
   [ CONFIRMED ] ◄──────────────────────┐ (pause session)
         │                              │
         ▼ (check-in)                   │
   [ CHECKED_IN ]                       │
         │                              │
         ▼ (start)                      │
   [ IN_PROGRESS ] ───► (pause visit) ──┘
         │
         ▼ (complete + outcome)
   [ COMPLETED ]
         │
         ▼ (manager reopen with reason)
   [ REOPENED ]
```

### 2. The Deliberately Open-Ended Scenario
> **Scenario:** *"A salesperson checks into a customer meeting at 10:02 AM. The meeting was scheduled for 10:00–11:00 AM. At 10:40 AM, the customer asks them to return at 3:00 PM instead. The salesperson returns at 3:10 PM and completes the meeting at 4:00 PM."*

**Our Architectural Solution:**
Instead of storing flat `check_in_time` and `check_out_time` timestamps directly on the meeting record (which would incorrectly log a 6-hour meeting), visits are modeled as a **1:N relationship with `meeting_sessions`**:
1. **10:02 AM:** Rep checks in. `Session #1` opens with coordinates `(44.9740, -93.2777)` and entrance name. Meeting status becomes `CHECKED_IN` / `IN_PROGRESS`.
2. **10:40 AM:** Rep calls `POST /api/meetings/{id}/pause`. `Session #1` closes with 38 minutes duration. Status reverts to `CONFIRMED`.
3. **3:10 PM:** Rep returns and calls `POST /api/meetings/{id}/resume`. `Session #2` opens with fresh check-in timestamp.
4. **4:00 PM:** Rep completes the meeting via `POST /api/meetings/{id}/complete`. `Session #2` closes with 50 minutes duration.
5. **Outcome:** Total verified on-site duration is recorded as **88 minutes** (38m + 50m), preserving total auditing fidelity and mileage accuracy.

---

## 🏛️ System Architecture & Engineering Principles

1. **Modular Monolith Pattern:**
   The backend is cleanly structured into domain modules:
   - `modules/auth`: User registration, dynamic management, JWT authentication, refresh token rotation, and activity tracking.
   - `modules/customer`: Client accounts and contact directories.
   - `modules/meeting`: Meeting entity, multi-session visit tracking, GPS check-in/out, state transitions, and audit logs.
   - `modules/followup`: Action items, assigned owners, and task completion lifecycles.
   - `shared`: Global exception handling, standard error contracts (`ErrorResponse`), and seed initializers.

2. **SOLID Principles:**
   - **SRP:** Dedicated components for token generation (`JwtTokenProvider`), state transitions (`MeetingServiceImpl`), and token rotation (`RefreshTokenService`).
   - **OCP:** State machine transitions and audit log listeners designed for extension without altering core logic.
   - **LSP:** User details contracts adhere strictly to Spring Security interfaces.
   - **ISP:** Lean, purpose-specific repository and service interfaces.
   - **DIP:** Web controllers inject service interfaces rather than concrete implementations.

3. **Liquibase Versioned Migrations:**
   All tables, relationships, constraints, and audit logs are versioned under `backend/src/main/resources/db/changelog`:
   - `01-create-users-table.xml`: `users` & `refresh_tokens`
   - `02-create-customers-table.xml`: `customers`
   - `03-create-meetings-and-sessions.xml`: `meetings`, `meeting_sessions`, `follow_ups`, and `meeting_audit_logs`
   - `04-create-user-activity-logs.xml`: `user_activity_logs`, added `last_login_at` and `last_logout_at` to `users`
   - `05-add-meeting-link.xml`: added `meeting_link` (500 chars) for Google Meet virtual conferencing

---

## 🛠️ Tech Stack

- **Backend:** Java 23 (compatible with Java 17-23), Spring Boot 3.3.5, Spring Data JPA, Spring Security 6, Liquibase, JJWT (HMAC-SHA256), H2 Database (In-Memory default) / PostgreSQL ready.
- **Frontend:** React 19, Vite, Lucide Icons, Modern Native CSS, Responsive Grid & Flexbox, SVG Bezier Mathematical Graphing.
- **Testing:** JUnit 5, MockMvc, AssertJ, Spring Boot Test.

---

## 🔑 Pre-Seeded Real Enterprise Accounts

The system automatically initializes 26 realistic enterprise meetings, multi-session visits, and follow-ups with **non-zero counts across all 5 outcomes**:

| Account Name | Contact Person | Industry |
| :--- | :--- | :--- |
| **Siemens Healthineers** | Dr. Thomas Becker | Medical Technology & Telemetry |
| **Schneider Electric** | Mark Van Der Bilt | Smart Grid & Infrastructure |
| **Novartis Pharmaceuticals** | Clara Dubois | Biotech & Clinical Cold-Chain |
| **Infosys Technologies** | Rajesh Sundaram | Cloud Migration & Multi-Cloud SLA |
| **Stripe Financial Corp** | Maya Lin | Core Banking Event Streaming |
| **Boeing Aerospace & Defense** | James C. Holloway | Avionics Real-Time Sensor Telemetry |
| **Delta Air Lines Enterprise** | Rachel Vance | Fleet Logistics & BLE Asset Tracking |
| **Target Retail Corporation** | Kenneth O'Connor | Omnichannel DC Robotic Automation |

---

## 🏃 Quick Start & Setup Instructions

### Prerequisites
- **Java 17+** (`java -version`)
- **Maven 3.8+** (`mvn -version`)
- **Node.js 18+ & npm** (`node -v`)

### 1. Run the Backend
```bash
cd backend
mvn clean spring-boot:run
```
- Backend starts at: `http://localhost:8080`
- H2 Console available at: `http://localhost:8080/h2-console`
  - **JDBC URL:** `jdbc:h2:mem:salesdb`
  - **User:** `sa`
  - **Password:** *(leave empty)*

### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```
- Frontend application starts at: `http://localhost:5173`

---

## 🧪 Automated Testing & Business Rules Verification

The test suite covers all critical security, authorization, and business rules:

```bash
cd backend
mvn test
```

### Verified Test Cases:
1. `AuthFlowTest.testLoginIssuesValidJwtAndRefreshToken`: Verifies 15-minute access token generation, HMAC validation, and refresh token issuance.
2. `AuthFlowTest.testRegisterNewUserWithRole`: Verifies registration with specific RBAC role.
3. `AuthFlowTest.testRotateRefreshToken`: Verifies refresh token rotation (old token revoked, new token issued).
4. `AuthFlowTest.testProtectedEndpointRejection`: Verifies unauthenticated requests are blocked (401 Unauthorized).
5. `MeetingFlowTest.testStandardMeetingLifecycle`: Validates full state flow `SCHEDULED` ➔ `CONFIRMED` ➔ `CHECKED_IN` ➔ `IN_PROGRESS` ➔ `COMPLETED`.
6. `MeetingFlowTest.testOpenEndedMultiSessionVisitScenario`: Tests the 10:02 AM check-in, 10:40 AM pause, 3:10 PM resume, and 4:00 PM completion with 2 distinct sessions.
7. `MeetingFlowTest.testFollowUpMandatoryValidation`: Enforces business rule that `FOLLOW_UP_REQUIRED` fails without action item, owner, and due date, and succeeds when provided.
8. `MeetingFlowTest.testManagerOnlyReopenWithAudit`: Verifies sales employee cannot reopen a completed meeting (403 Forbidden), but sales manager can reopen with audit trail (200 OK).

---

## 📑 Companion Documentation

- [ER Diagram & Database Model](file:///c:/Users/MK/OneDrive/Desktop/New%20folder%20(2)/ER_DIAGRAM.md)
- [REST API Documentation](file:///c:/Users/MK/OneDrive/Desktop/New%20folder%20(2)/API_DOCUMENTATION.md)
- [Decisions & Trade-offs](file:///c:/Users/MK/OneDrive/Desktop/New%20folder%20(2)/DECISIONS_AND_TRADEOFFS.md)
