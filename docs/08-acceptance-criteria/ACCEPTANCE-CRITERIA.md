# Deliverable 8: Acceptance Criteria
## Nelson Aczon License Broker & Appraiser Platform

**Document ID:** AC-001  
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-07-22  
**Review Board:** Business Experts, QA Council, Software Architecture  

---

## 1. Document Overview

### 1.1 Purpose
This document defines the acceptance criteria for the user stories in the Nelson Aczon License Broker & Appraiser Platform. Acceptance criteria specify the conditions that must be met for a story to be considered complete.

### 1.2 Format
Each acceptance criterion follows the Given/When/Then format:
- **Given:** The initial context
- **When:** The action performed
- **Then:** The expected outcome

### 1.3 Categories
- **Functional:** What the system must do
- **Non-Functional:** How the system must perform
- **Security:** Security requirements
- **Usability:** User experience requirements

---

## 2. Authentication & User Management

### 2.1 User Registration (US-AUTH-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-AUTH-001 | Given a user is on the registration page, When they enter valid email and password, Then the account is created | Functional | P0 |
| AC-AUTH-002 | Given a user enters an existing email, When they submit registration, Then an error message is displayed | Functional | P0 |
| AC-AUTH-003 | Given a user enters a weak password, When they submit registration, Then an error message is displayed | Security | P0 |
| AC-AUTH-004 | Given a user successfully registers, When the account is created, Then a verification email is sent | Functional | P0 |
| AC-AUTH-005 | Given a user clicks the verification link, When the email is verified, Then the account is activated | Functional | P0 |
| AC-AUTH-006 | Given registration is complete, When the response is returned, Then it completes within 2 seconds | Non-Functional | P1 |

### 2.2 User Login (US-AUTH-002)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-AUTH-007 | Given a user is on the login page, When they enter valid credentials, Then they are logged in | Functional | P0 |
| AC-AUTH-008 | Given a user enters invalid credentials, When they submit login, Then an error message is displayed | Functional | P0 |
| AC-AUTH-009 | Given a user fails login 5 times, When they attempt login again, Then the account is locked for 30 minutes | Security | P0 |
| AC-AUTH-010 | Given a user successfully logs in, When the session is created, Then a JWT token is issued | Security | P0 |
| AC-AUTH-011 | Given a user is logged in, When they are inactive for 30 minutes, Then they are logged out | Security | P1 |
| AC-AUTH-012 | Given login is attempted, When the response is returned, Then it completes within 1 second | Non-Functional | P0 |

### 2.3 Password Reset (US-AUTH-004)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-AUTH-013 | Given a user requests password reset, When they enter valid email, Then a reset link is sent | Functional | P0 |
| AC-AUTH-014 | Given a user clicks reset link, When the link is valid, Then they can set a new password | Functional | P0 |
| AC-AUTH-015 | Given a user sets new password, When the password meets requirements, Then the password is updated | Security | P0 |
| AC-AUTH-016 | Given a user uses expired reset link, When they click the link, Then an error message is displayed | Functional | P1 |
| AC-AUTH-017 | Given password reset is complete, When the old password was used, Then all existing sessions are invalidated | Security | P0 |

### 2.4 Multi-Factor Authentication (US-AUTH-003)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-AUTH-018 | Given a user enables MFA, When they log in, Then they must provide a second factor | Security | P1 |
| AC-AUTH-019 | Given MFA is enabled, When a user enters correct password, Then a verification code is sent | Security | P1 |
| AC-AUTH-020 | Given a user enters valid verification code, When the code is correct, Then access is granted | Security | P1 |
| AC-AUTH-021 | Given a user enters invalid code 3 times, When they attempt again, Then they must request a new code | Security | P1 |
| AC-AUTH-022 | Given a user disables MFA, When they confirm with current MFA, Then MFA is disabled | Security | P1 |

---

## 3. License Management

### 3.1 Add License (US-LT-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-LT-001 | Given a broker is on the license page, When they enter valid license details, Then the license is added | Functional | P0 |
| AC-LT-002 | Given a broker enters duplicate license number, When they submit, Then an error message is displayed | Functional | P0 |
| AC-LT-003 | Given a broker uploads license document, When the file is valid, Then the document is stored | Functional | P1 |
| AC-LT-004 | Given a broker enters expiration date, When the date is in the past, Then a warning is displayed | Functional | P0 |
| AC-LT-005 | Given license is added, When the response is returned, Then it completes within 2 seconds | Non-Functional | P1 |

### 3.2 License Verification (US-LV-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-LV-001 | Given a license is in the system, When verification is triggered, Then the status is checked with the state board | Functional | P0 |
| AC-LV-002 | Given verification is complete, When the license is valid, Then the status is updated to "Verified" | Functional | P0 |
| AC-LV-003 | Given verification is complete, When the license is invalid, Then the status is updated to "Invalid" | Functional | P0 |
| AC-LV-004 | Given verification fails, When the state board is unavailable, Then a retry is scheduled | Functional | P1 |
| AC-LV-005 | Given verification completes, When the result is stored, Then an audit log entry is created | Functional | P0 |

### 3.3 License Compliance Dashboard (US-LC-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-LC-001 | Given a compliance officer accesses the dashboard, When data is loaded, Then compliance status is displayed | Functional | P0 |
| AC-LC-002 | Given the dashboard is displayed, When there are expiring licenses, Then they are highlighted | Functional | P0 |
| AC-LC-003 | Given the dashboard is displayed, When a license is expired, Then it shows as "Non-Compliant" | Functional | P0 |
| AC-LC-004 | Given the dashboard is displayed, When filters are applied, Then the data is filtered accordingly | Functional | P1 |
| AC-LC-005 | Given the dashboard loads, When the response is returned, Then it completes within 3 seconds | Non-Functional | P0 |

### 3.4 License Renewal Reminders (US-LC-005)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-LC-006 | Given a license expires in 90 days, When the reminder job runs, Then a reminder is sent | Functional | P0 |
| AC-LC-007 | Given a license expires in 60 days, When the reminder job runs, Then a reminder is sent | Functional | P0 |
| AC-LC-008 | Given a license expires in 30 days, When the reminder job runs, Then an urgent reminder is sent | Functional | P0 |
| AC-LC-009 | Given a license expires in 7 days, When the reminder job runs, Then a critical reminder is sent | Functional | P0 |
| AC-LC-010 | Given a reminder is sent, When the user has email enabled, Then the email is delivered | Functional | P0 |
| AC-LC-011 | Given a reminder is sent, When the user has SMS enabled, Then the SMS is delivered | Functional | P1 |

---

## 4. Appraisal Management

### 4.1 Create Appraisal Order (US-AO-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-AO-001 | Given a mortgage specialist is on the order page, When they enter valid property details, Then the order is created | Functional | P0 |
| AC-AO-002 | Given an order is created, When the details are complete, Then the order status is set to "Pending" | Functional | P0 |
| AC-AO-003 | Given an order is created, When an appraiser is assigned, Then the appraiser is notified | Functional | P0 |
| AC-AO-004 | Given an order is created, When priority is set to "Rush", Then it is flagged for urgent processing | Functional | P1 |
| AC-AO-005 | Given order creation is complete, When the response is returned, Then it completes within 2 seconds | Non-Functional | P1 |

### 4.2 Appraisal Workflow (US-AW-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-AW-001 | Given an appraiser has an assigned order, When they schedule an inspection, Then the appointment is created | Functional | P0 |
| AC-AW-002 | Given an inspection is scheduled, When the date approaches, Then a reminder is sent | Functional | P1 |
| AC-AW-003 | Given an appraiser is at the property, When they fill out the inspection form, Then the data is saved | Functional | P0 |
| AC-AW-004 | Given an appraiser takes photos, When they upload them, Then the photos are stored | Functional | P0 |
| AC-AW-005 | Given an appraiser selects comparables, When they add them to the report, Then the comparables are included | Functional | P1 |
| AC-AW-006 | Given an appraiser calculates valuation, When the formula is applied, Then the value is calculated | Functional | P0 |
| AC-AW-007 | Given an appraiser generates a report, When all data is complete, Then the report is created | Functional | P0 |
| AC-AW-008 | Given a report is generated, When the reviewer approves it, Then the status is set to "Approved" | Functional | P0 |
| AC-AW-009 | Given a report is approved, When delivery is triggered, Then the client is notified | Functional | P0 |

### 4.3 Property Data (US-PD-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-PD-001 | Given an appraiser views property details, When the data is loaded, Then all property information is displayed | Functional | P0 |
| AC-PD-002 | Given an appraiser views property history, When the history exists, Then all transactions are shown | Functional | P1 |
| AC-PD-003 | Given an appraiser views photos, When photos exist, Then they are displayed in a gallery | Functional | P1 |
| AC-PD-004 | Given an appraiser views comparables, When MLS data is available, Then comparable properties are shown | Functional | P1 |
| AC-PD-005 | Given property data is loaded, When the response is returned, Then it completes within 2 seconds | Non-Functional | P1 |

---

## 5. Document Management

### 5.1 Document Upload (US-DS-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-DS-001 | Given a user is on the document page, When they select a file, Then the file is uploaded | Functional | P0 |
| AC-DS-002 | Given a user uploads a file, When the file is under 50MB, Then the upload succeeds | Functional | P0 |
| AC-DS-003 | Given a user uploads a file, When the file is over 50MB, Then an error message is displayed | Functional | P1 |
| AC-DS-004 | Given a user uploads a file, When the format is supported, Then the file is stored | Functional | P0 |
| AC-DS-005 | Given a user uploads a file, When the format is unsupported, Then an error message is displayed | Functional | P1 |
| AC-DS-006 | Given an upload completes, When the file is stored, Then metadata is recorded | Functional | P0 |
| AC-DS-007 | Given an upload is in progress, When the file is large, Then a progress indicator is shown | Usability | P1 |

### 5.2 Document Access (US-DA-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-DA-001 | Given a user owns a document, When they access it, Then they have full permissions | Functional | P0 |
| AC-DA-002 | Given a user shares a document, When they set permissions, Then access is controlled | Functional | P1 |
| AC-DA-003 | Given a user searches for documents, When keywords match, Then relevant documents are returned | Functional | P0 |
| AC-DA-004 | Given a user views document history, When changes exist, Then the audit trail is displayed | Functional | P1 |
| AC-DA-005 | Given a user downloads a document, When the file exists, Then the download starts | Functional | P0 |

### 5.3 Document Templates (US-DT-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-DT-001 | Given an admin creates a template, When the template is saved, Then it is available to users | Functional | P1 |
| AC-DT-002 | Given a user uses a template, When they select it, Then a document is created from the template | Functional | P1 |
| AC-DT-003 | Given an admin updates a template, When the update is saved, Then existing documents are not affected | Functional | P2 |
| AC-DT-004 | Given an admin deletes a template, When the deletion is confirmed, Then it is removed from the list | Functional | P2 |

---

## 6. Reporting & Analytics

### 6.1 Compliance Reports (US-SR-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-SR-001 | Given a compliance officer requests a report, When parameters are set, Then the report is generated | Functional | P0 |
| AC-SR-002 | Given a report is generated, When data exists, Then all relevant data is included | Functional | P0 |
| AC-SR-003 | Given a report is generated, When filters are applied, Then the data is filtered | Functional | P1 |
| AC-SR-004 | Given a report is generated, When export is requested, Then PDF/CSV is available | Functional | P1 |
| AC-SR-005 | Given a report is generated, When the response is returned, Then it completes within 5 seconds | Non-Functional | P0 |

### 6.2 Dashboard (US-AN-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-AN-001 | Given a user accesses the dashboard, When data is loaded, Then real-time metrics are displayed | Functional | P0 |
| AC-AN-002 | Given the dashboard is displayed, When data updates, Then the dashboard refreshes automatically | Functional | P1 |
| AC-AN-003 | Given the dashboard is displayed, When a user clicks a metric, Then they can drill down | Functional | P2 |
| AC-AN-004 | Given the dashboard loads, When the response is returned, Then it completes within 2 seconds | Non-Functional | P0 |
| AC-AN-005 | Given the dashboard is displayed, When on mobile, Then it is responsive | Usability | P1 |

---

## 7. Integration Hub

### 7.1 State Board Integration (US-EI-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-EI-001 | Given a license needs verification, When the API call is made, Then the state board is queried | Functional | P0 |
| AC-EI-002 | Given the state board responds, When the data is valid, Then the license status is updated | Functional | P0 |
| AC-EI-003 | Given the state board is unavailable, When the call fails, Then a retry is scheduled | Functional | P1 |
| AC-EI-004 | Given the state board responds with error, When the error is logged, Then an alert is sent | Functional | P0 |
| AC-EI-005 | Given the integration runs, When the response is returned, Then it completes within 5 seconds | Non-Functional | P1 |

### 7.2 Email Integration (US-EI-004)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-EI-006 | Given a notification is triggered, When email is enabled, Then the email is sent | Functional | P0 |
| AC-EI-007 | Given an email is sent, When the delivery succeeds, Then a log entry is created | Functional | P0 |
| AC-EI-008 | Given an email fails to send, When the failure is detected, Then a retry is attempted | Functional | P1 |
| AC-EI-009 | Given an email is sent, When it contains sensitive data, Then encryption is applied | Security | P0 |

---

## 8. Multi-Tenant Architecture

### 8.1 Tenant Creation (US-TM-001)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-TM-001 | Given an admin creates a tenant, When details are valid, Then the tenant is created | Functional | P0 |
| AC-TM-002 | Given a tenant is created, When isolation is applied, Then data is isolated | Security | P0 |
| AC-TM-003 | Given a tenant is created, When branding is set, Then the tenant has custom branding | Functional | P1 |
| AC-TM-004 | Given a tenant is created, When configuration is complete, Then the tenant is ready for use | Functional | P0 |
| AC-TM-005 | Given a tenant is created, When the response is returned, Then it completes within 5 seconds | Non-Functional | P1 |

### 8.2 Tenant Isolation (US-TM-005)

| ID | Criterion | Type | Priority |
|----|-----------|------|----------|
| AC-TM-006 | Given multiple tenants exist, When a user logs in, Then they only see their tenant's data | Security | P0 |
| AC-TM-007 | Given a tenant queries data, When the query runs, Then only their data is returned | Security | P0 |
| AC-TM-008 | Given a tenant uploads documents, When the documents are stored, Then they are isolated | Security | P0 |
| AC-TM-009 | Given a tenant runs a report, When the report executes, Then only their data is included | Security | P0 |

---

## 9. Non-Functional Acceptance Criteria

### 9.1 Performance

| ID | Criterion | Metric | Target |
|----|-----------|--------|--------|
| AC-NF-001 | API response time | 95th percentile | <200ms |
| AC-NF-002 | Page load time | First Contentful Paint | <1.5s |
| AC-NF-003 | Database query time | Average | <50ms |
| AC-NF-004 | Concurrent users | Simultaneous sessions | 10,000 |
| AC-NF-005 | System uptime | Monthly | 99.9% |

### 9.2 Security

| ID | Criterion | Metric | Target |
|----|-----------|--------|--------|
| AC-NF-006 | Encryption at rest | Algorithm | AES-256 |
| AC-NF-007 | Encryption in transit | Protocol | TLS 1.3 |
| AC-NF-008 | Password complexity | Requirements | 12+ chars, mixed |
| AC-NF-009 | Session timeout | Inactivity period | 30 minutes |
| AC-NF-010 | Audit logging | Coverage | 100% |

### 9.3 Usability

| ID | Criterion | Metric | Target |
|----|-----------|--------|--------|
| AC-NF-011 | Learning curve | New user onboarding | <30 minutes |
| AC-NF-012 | Task completion rate | Core tasks | >95% |
| AC-NF-013 | User satisfaction | NPS score | >50 |
| AC-NF-014 | Accessibility | WCAG compliance | 2.1 AA |
| AC-NF-015 | Browser support | Compatibility | Latest 2 versions |

---

## 10. Review Board Assessment

### QA Council Review

| Reviewer | Status | Comments |
|----------|--------|----------|
| **QA Director** | Pending | Completeness review |
| **Automation Engineer** | Pending | Automation feasibility |
| **Security Tester** | Pending | Security validation |

### Business Experts Review

| Reviewer | Status | Comments |
|----------|--------|----------|
| **Licensed Brokers** | Pending | Business validation |
| **Compliance Officers** | Pending | Regulatory validation |

### Software Architecture Review

| Reviewer | Status | Comments |
|----------|--------|----------|
| **Staff Engineer** | Pending | Technical feasibility |
| **Solution Architect** | Pending | Architecture alignment |

---

## 11. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-22 | System | Initial draft |

---

**Next Review:** Domain Model (Deliverable 9)  
**Dependencies:** User Stories, Functional Requirements  
**Blockers:** QA Council validation required
