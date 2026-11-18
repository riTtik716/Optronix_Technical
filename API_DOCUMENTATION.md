# REST API Documentation

Base URL: `http://localhost:8080/api`

All protected endpoints require the following HTTP Authorization Header:
```http
Authorization: Bearer <access_token>
```

---

## 1. Authentication & User Management Endpoints (`/api/auth`)

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates credentials, returns 15-min JWT + Refresh Token. |
| `POST` | `/api/auth/register` | Public | Registers a new user account with assigned role. |
| `POST` | `/api/auth/refresh` | Public | Rotates single-use refresh token and issues new 15-min access token. |
| `POST` | `/api/auth/logout` | Authenticated | Revokes active refresh token and logs user logout timestamp. |
| `GET` | `/api/auth/me` | Authenticated | Fetches current authenticated user profile with role and manager info. |
| `GET` | `/api/auth/sales-employees` | Authenticated | Returns all active sales reps (used for meeting scheduling dropdowns). |
| `GET` | `/api/auth/users` | `ROLE_ADMIN` | Retrieves all users across the organization. |
| `POST` | `/api/auth/users` | `ROLE_ADMIN` | Dynamically creates a new Sales Rep or Sales Manager account. |
| `DELETE` | `/api/auth/users/{userId}` | `ROLE_ADMIN` | Deletes a user account. |
| `PUT` | `/api/auth/users/{userId}/password` | `ROLE_ADMIN` | Resets/updates a salesperson or manager password. |
| `POST` | `/api/auth/activity` | Authenticated | Logs client event (e.g., `DASHBOARD_CLOSED`, `LOGOUT`). |
| `GET` | `/api/auth/activities` | `ROLE_ADMIN` | Retrieves audit logs of user activities. |

#### Sample Login Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "employee@optronix.com",
  "password": "password123"
}
```

#### Sample Login Response (`200 OK`)
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlbXBsb3llZUBvcHRyb25peC5jb20iLCJyb2xlIjoiUk9MRV9TQUxFU19FTVBMT1lFRSJ9...",
  "refreshToken": "4c45b809-5a52-4467-93ff-2a0753d3309a",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "id": 4,
    "name": "Alex Rivera (Senior Account Executive)",
    "email": "employee@optronix.com",
    "role": "ROLE_SALES_EMPLOYEE",
    "managerId": 2,
    "managerName": "Sarah Jenkins (VP Enterprise Sales)"
  }
}
```

---

## 2. Customer Directory (`/api/customers`)

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/customers` | Authenticated | Creates a new enterprise customer account. |
| `GET` | `/api/customers` | Authenticated | Lists all registered customer accounts. |
| `GET` | `/api/customers/{id}` | Authenticated | Fetches single customer details. |

#### Sample Create Customer Request
```http
POST /api/customers
Content-Type: application/json

{
  "companyName": "Siemens Healthineers",
  "contactPerson": "Dr. Thomas Becker",
  "contactEmail": "t.becker@siemens-healthineers.com",
  "contactPhone": "+1 (617) 555-0182",
  "address": "400 Commonwealth Ave, Boston, MA 02215"
}
```

---

## 3. Meeting Lifecycle & Visit Management (`/api/meetings`)

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/meetings` | Authenticated | Schedules a new visit against an account. Status: `SCHEDULED`. |
| `GET` | `/api/meetings` | Authenticated | Gets personal visits for logged-in rep, or team visits for manager. |
| `GET` | `/api/meetings/team` | Manager / Admin | Supervised team visits for managers. |
| `GET` | `/api/meetings/all` | `ROLE_ADMIN` | Global visit stream across all reps and managers. |
| `GET` | `/api/meetings/{id}` | Authenticated | Retrieves detailed meeting data, sessions, and audit history. |
| `PATCH` | `/api/meetings/{id}/confirm` | Authenticated | State transition: `SCHEDULED` ➔ `CONFIRMED`. |
| `POST` | `/api/meetings/{id}/check-in` | Authenticated | GPS check-in: opens `Session #1`, status: `CHECKED_IN`. |
| `PATCH` | `/api/meetings/{id}/start` | Authenticated | State transition: `CHECKED_IN` ➔ `IN_PROGRESS`. |
| `POST` | `/api/meetings/{id}/pause` | Authenticated | Pauses visit (checks out session, status: `CONFIRMED`). |
| `POST` | `/api/meetings/{id}/resume` | Authenticated | Resumes visit (opens `Session #2`, status: `IN_PROGRESS`). |
| `POST` | `/api/meetings/{id}/check-out` | Authenticated | Records check-out GPS timestamp for active session. |
| `POST` | `/api/meetings/{id}/complete` | Authenticated | Finalizes meeting with mandatory outcome (`INTERESTED`, `FOLLOW_UP_REQUIRED`, etc.). |
| `POST` | `/api/meetings/{id}/reopen` | Manager / Admin | Reopens completed meeting with mandatory audit reason. |
| `GET` | `/api/meetings/{id}/audit-logs` | Authenticated | Retrieves managerial audit logs for the meeting. |

#### Sample Create Meeting Request
```http
POST /api/meetings
Content-Type: application/json

{
  "customerId": 1,
  "assignedEmployeeId": 4,
  "purpose": "Enterprise Medical Telemetry Architecture Demo",
  "scheduledStartTime": "2026-11-20T10:00:00",
  "scheduledEndTime": "2026-11-20T11:30:00",
  "meetingLocation": "Siemens Healthineers - Boston Campus",
  "meetingLink": "https://meet.google.com/optronix-sie-demo",
  "notes": "Presentation of low-latency telemetry streaming architecture."
}
```

#### Sample Check-In Request
```http
POST /api/meetings/1/check-in
Content-Type: application/json

{
  "latitude": 42.3496,
  "longitude": -71.0997,
  "locationName": "Siemens Main Innovation Reception",
  "notes": "Checked in on site with security badge"
}
```

#### Sample Complete Meeting Request (With Follow-up Requirement)
```http
POST /api/meetings/1/complete
Content-Type: application/json

{
  "outcome": "FOLLOW_UP_REQUIRED",
  "outcomeNotes": "Client approved pilot scope. Requested finalized multi-year SLA and security questionnaire.",
  "followUpActionItem": "Submit revised multi-year SLA matrix and SOC-2 questionnaire",
  "followUpDueDate": "2026-11-22",
  "followUpOwnerId": 4,
  "latitude": 42.3496,
  "longitude": -71.0997,
  "locationName": "Siemens Main Reception"
}
```

#### Sample Manager Reopen Request
```http
POST /api/meetings/1/reopen
Content-Type: application/json

{
  "reason": "Customer called requesting an additional executive presentation for European clinical sites."
}
```

---

## 4. Follow-Up Task Management (`/api/follow-ups`)

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/follow-ups` | Authenticated | Creates a manual follow-up action. |
| `GET` | `/api/follow-ups` | Authenticated | Lists follow-ups (filterable by `ownerId` or `meetingId`). |
| `PATCH` | `/api/follow-ups/{id}/complete` | Authenticated | Marks a follow-up action as completed. |

#### Sample Follow-Up Response
```json
{
  "id": 1,
  "meetingId": 3,
  "ownerId": 4,
  "ownerName": "Alex Rivera (Senior Account Executive)",
  "actionItem": "Submit revised multi-year SLA matrix and SOC-2 questionnaire for Infosys",
  "dueDate": "2026-11-20",
  "status": "PENDING",
  "notes": "High priority: procurement lead requires signed SLA before Friday budget committee.",
  "createdAt": "2026-11-18T10:30:00"
}
```

---

## 5. HTTP Status Codes & Error Contract

| Code | Meaning | Example Scenario |
| :--- | :--- | :--- |
| `200 OK` | Success | Retrieved list of visits, checked in successfully. |
| `201 Created` | Resource Created | User registered, meeting scheduled. |
| `400 Bad Request` | Validation Failure | Outcome `FOLLOW_UP_REQUIRED` passed without an action item and due date. |
| `401 Unauthorized` | Missing / Invalid Token | Missing `Authorization: Bearer` token or expired JWT. |
| `403 Forbidden` | Access Denied | Sales Rep trying to reopen a completed meeting or delete a user. |
| `404 Not Found` | Resource Missing | Meeting ID or Customer ID does not exist. |

#### Standard Error Response Body
```json
{
  "timestamp": "2026-11-18T14:15:00",
  "status": 400,
  "error": "Bad Request",
  "message": "When outcome is FOLLOW_UP_REQUIRED, follow-up action item and due date are mandatory.",
  "path": "/api/meetings/1/complete"
}
```
