# Deliverable 9: Domain Model
## Nelson Aczon License Broker & Appraiser Platform

**Document ID:** DM-001  
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-07-22  
**Review Board:** Business Experts, Software Architecture, Database Team  

---

## 1. Document Overview

### 1.1 Purpose
This document defines the domain model for the Nelson Aczon License Broker & Appraiser Platform. It identifies the core business entities, their attributes, and relationships.

### 1.2 Methodology
Domain model is based on:
- User stories and personas
- Functional requirements
- Business process analysis
- Industry best practices

### 1.3 Notation
- **Entity:** Business object with identity
- **Value Object:** Descriptive attribute without identity
- **Aggregate:** Cluster of entities treated as a unit
- **Domain Event:** Something that happened in the domain

---

## 2. Core Domain Entities

### 2.1 Tenant

```
+------------------------------------------+
|  Tenant                                  |
+------------------------------------------+
|  - id: UUID                              |
|  - name: String                          |
|  - slug: String                          |
|  - logo: URL                             |
|  - primaryColor: String                  |
|  - secondaryColor: String                |
|  - settings: JSON                        |
|  - status: TenantStatus                  |
|  - createdAt: DateTime                   |
|  - updatedAt: DateTime                   |
+------------------------------------------+
|  + create()                              |
|  + updateSettings()                      |
|  + deactivate()                          |
|  + getBranding()                         |
+------------------------------------------+
```

**Relationships:**
- Has many Users
- Has many Licenses
- Has many AppraisalOrders
- Has many Documents

---

### 2.2 User

```
+------------------------------------------+
|  User                                    |
+------------------------------------------+
|  - id: UUID                              |
|  - tenantId: UUID (FK)                   |
|  - email: String                         |
|  - passwordHash: String                  |
|  - firstName: String                     |
|  - lastName: String                      |
|  - phone: String                         |
|  - avatar: URL                           |
|  - role: UserRole                        |
|  - status: UserStatus                    |
|  - mfaEnabled: Boolean                   |
|  - lastLoginAt: DateTime                 |
|  - createdAt: DateTime                   |
|  - updatedAt: DateTime                   |
+------------------------------------------+
|  + register()                            |
|  + login()                               |
|  + logout()                              |
|  + updateProfile()                       |
|  + changePassword()                      |
|  + enableMFA()                           |
|  + disableMFA()                          |
+------------------------------------------+
```

**Enums:**
- **UserRole:** ADMIN, BROKER, APPRAISER, CLIENT, RECEPTIONIST, INSPECTOR, ACCOUNTING, COMPLIANCE_OFFICER
- **UserStatus:** ACTIVE, INACTIVE, LOCKED, PENDING_VERIFICATION

**Relationships:**
- Belongs to Tenant
- Has many Licenses
- Has many Documents
- Has many AuditLogs

---

### 2.3 License

```
+------------------------------------------+
|  License                                 |
+------------------------------------------+
|  - id: UUID                              |
|  - tenantId: UUID (FK)                   |
|  - userId: UUID (FK)                     |
|  - licenseNumber: String                 |
|  - licenseType: LicenseType              |
|  - issuingState: String                  |
|  - issuingAuthority: String              |
|  - issueDate: Date                       |
|  - expirationDate: Date                  |
|  - status: LicenseStatus                 |
|  - verificationStatus: VerificationStatus|
|  - lastVerifiedAt: DateTime              |
|  - documentUrl: URL                      |
|  - notes: Text                           |
|  - createdAt: DateTime                   |
|  - updatedAt: DateTime                   |
+------------------------------------------+
|  + addLicense()                          |
|  + updateLicense()                       |
|  + verifyLicense()                       |
|  + renewLicense()                        |
|  + suspendLicense()                      |
|  + getComplianceStatus()                 |
+------------------------------------------+
```

**Enums:**
- **LicenseType:** BROKER, APPRAISER, SALESPERSON, INSPECTOR
- **LicenseStatus:** ACTIVE, EXPIRED, SUSPENDED, REVOKED, PENDING_RENEWAL
- **VerificationStatus:** UNVERIFIED, VERIFIED, FAILED, PENDING

**Relationships:**
- Belongs to Tenant
- Belongs to User
- Has many LicenseRenewals
- Has many ContinuingEducationCredits

---

### 2.4 ContinuingEducationCredit

```
+------------------------------------------+
|  ContinuingEducationCredit               |
+------------------------------------------+
|  - id: UUID                              |
|  - licenseId: UUID (FK)                  |
|  - provider: String                      |
|  - courseName: String                    |
|  - courseNumber: String                  |
|  - creditHours: Decimal                  |
|  - completionDate: Date                  |
|  - certificateUrl: URL                   |
|  - status: CEStatus                      |
|  - createdAt: DateTime                   |
|  - updatedAt: DateTime                   |
+------------------------------------------+
|  + addCredit()                           |
|  + verifyCredit()                        |
|  + getRemainingHours()                   |
+------------------------------------------+
```

**Enums:**
- **CEStatus:** PENDING, VERIFIED, REJECTED

**Relationships:**
- Belongs to License

---

### 2.5 AppraisalOrder

```
+------------------------------------------+
|  AppraisalOrder                          |
+------------------------------------------+
|  - id: UUID                              |
|  - tenantId: UUID (FK)                   |
|  - orderNumber: String                   |
|  - propertyId: UUID (FK)                 |
|  - requestedById: UUID (FK)              |
|  - assignedToId: UUID (FK)               |
|  - orderType: OrderType                  |
|  - priority: OrderPriority               |
|  - status: OrderStatus                   |
|  - dueDate: DateTime                     |
|  - completedAt: DateTime                 |
|  - fee: Decimal                          |
|  - notes: Text                           |
|  - createdAt: DateTime                   |
|  - updatedAt: DateTime                   |
+------------------------------------------+
|  + createOrder()                         |
|  + assignAppraiser()                     |
|  + acceptOrder()                         |
|  + declineOrder()                        |
|  + updateStatus()                        |
|  + completeOrder()                       |
|  + cancelOrder()                         |
+------------------------------------------+
```

**Enums:**
- **OrderType:** PURCHASE, REFINANCE, HOME_EQUITY, ESTATE, INSURANCE, TAX
- **OrderPriority:** RUSH, STANDARD, ECONOMY
- **OrderStatus:** PENDING, ASSIGNED, ACCEPTED, IN_PROGRESS, INSPECTION_SCHEDULED, INSPECTION_COMPLETE, REPORT_DRAFT, UNDER_REVIEW, APPROVED, DELIVERED, CANCELLED

**Relationships:**
- Belongs to Tenant
- Belongs to Property
- Belongs to RequestedBy (User)
- Belongs to AssignedTo (User)
- Has one AppraisalReport
- Has many OrderNotes

---

### 2.6 Property

```
+------------------------------------------+
|  Property                                |
+------------------------------------------+
|  - id: UUID                              |
|  - tenantId: UUID (FK)                   |
|  - address: Address                      |
|  - propertyType: PropertyType            |
|  - yearBuilt: Integer                    |
|  - squareFootage: Integer                |
|  - lotSize: Decimal                      |
|  - bedrooms: Integer                     |
|  - bathrooms: Decimal                    |
|  - garageSpaces: Integer                 |
|  - mlsNumber: String                     |
|  - taxAssessment: Decimal                |
|  - lastSalePrice: Decimal                |
|  - lastSaleDate: Date                    |
|  - photos: JSON                          |
|  - documents: JSON                       |
|  - createdAt: DateTime                   |
|  - updatedAt: DateTime                   |
+------------------------------------------+
|  + addProperty()                         |
|  + updateProperty()                      |
|  + addPhoto()                            |
|  + removePhoto()                         |
|  + getHistory()                          |
|  + getComparables()                      |
+------------------------------------------+
```

**Enums:**
- **PropertyType:** SINGLE_FAMILY, CONDO, TOWNHOUSE, MULTI_FAMILY, COMMERCIAL, LAND

**Value Objects:**
- **Address:** street, city, state, zipCode, country

**Relationships:**
- Belongs to Tenant
- Has many AppraisalOrders
- Has many PropertyPhotos
- Has many PropertyDocuments

---

### 2.7 AppraisalReport

```
+------------------------------------------+
|  AppraisalReport                         |
+------------------------------------------+
|  - id: UUID                              |
|  - orderId: UUID (FK)                    |
|  - tenantId: UUID (FK)                   |
|  - appraiserId: UUID (FK)                |
|  - reportNumber: String                  |
|  - effectiveDate: Date                   |
|  - reportDate: Date                      |
|  - propertyCondition: PropertyCondition  |
|  - estimatedValue: Decimal               |
|  - comparables: JSON                     |
|  - adjustments: JSON                     |
|  - methodology: AppraisalMethodology     |
|  - status: ReportStatus                  |
|  - submittedAt: DateTime                 |
|  - reviewedAt: DateTime                  |
|  - approvedAt: DateTime                  |
|  - deliveredAt: DateTime                 |
|  - documentUrl: URL                      |
|  - notes: Text                           |
|  - createdAt: DateTime                   |
|  - updatedAt: DateTime                   |
+------------------------------------------+
|  + createReport()                        |
|  + addComparable()                       |
|  + removeComparable()                    |
|  + calculateValue()                      |
|  + submitForReview()                     |
|  + approveReport()                       |
|  + rejectReport()                        |
|  + deliverReport()                       |
+------------------------------------------+
```

**Enums:**
- **PropertyCondition:** EXCELLENT, GOOD, FAIR, POOR
- **AppraisalMethodology:** SALES_COMPARISON, COST_APPROACH, INCOME_APPROACH
- **ReportStatus:** DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, DELIVERED

**Relationships:**
- Belongs to AppraisalOrder
- Belongs to Tenant
- Belongs to Appraiser (User)
- Has many ReportPhotos

---

### 2.8 Document

```
+------------------------------------------+
|  Document                                |
+------------------------------------------+
|  - id: UUID                              |
|  - tenantId: UUID (FK)                   |
|  - ownerId: UUID (FK)                    |
|  - name: String                          |
|  - description: String                   |
|  - fileType: String                      |
|  - fileSize: Integer                     |
|  - storageKey: String                    |
|  - mimeType: String                      |
|  - folderId: UUID (FK)                   |
|  - tags: JSON                            |
|  - status: DocumentStatus                |
|  - version: Integer                      |
|  - createdAt: DateTime                   |
|  - updatedAt: DateTime                   |
+------------------------------------------+
|  + uploadDocument()                      |
|  + downloadDocument()                    |
|  + deleteDocument()                      |
|  + shareDocument()                       |
|  + getVersionHistory()                   |
+------------------------------------------+
```

**Enums:**
- **DocumentStatus:** ACTIVE, ARCHIVED, DELETED

**Relationships:**
- Belongs to Tenant
- Belongs to Owner (User)
- Belongs to Folder
- Has many DocumentPermissions
- Has many DocumentVersions

---

### 2.9 Folder

```
+------------------------------------------+
|  Folder                                  |
+------------------------------------------+
|  - id: UUID                              |
|  - tenantId: UUID (FK)                   |
|  - name: String                          |
|  - parentId: UUID (FK, self-ref)         |
|  - path: String                          |
|  - createdAt: DateTime                   |
|  - updatedAt: DateTime                   |
+------------------------------------------+
|  + createFolder()                        |
|  + renameFolder()                        |
|  + moveFolder()                          |
|  + deleteFolder()                        |
+------------------------------------------+
```

**Relationships:**
- Belongs to Tenant
- Has parent Folder (optional)
- Has many child Folders
- Has many Documents

---

### 2.10 AuditLog

```
+------------------------------------------+
|  AuditLog                                |
+------------------------------------------+
|  - id: UUID                              |
|  - tenantId: UUID (FK)                   |
|  - userId: UUID (FK)                     |
|  - action: String                        |
|  - entityType: String                    |
|  - entityId: UUID                        |
|  - oldValues: JSON                       |
|  - newValues: JSON                       |
|  - ipAddress: String                     |
|  - userAgent: String                     |
|  - createdAt: DateTime                   |
+------------------------------------------+
```

**Relationships:**
- Belongs to Tenant
- Belongs to User

---

## 3. Value Objects

### 3.1 Address

```
+------------------------------------------+
|  Address (Value Object)                  |
+------------------------------------------+
|  - street: String                        |
|  - street2: String                       |
|  - city: String                          |
|  - state: String                         |
|  - zipCode: String                       |
|  - country: String                       |
+------------------------------------------+
```

### 3.2 Money

```
+------------------------------------------+
|  Money (Value Object)                    |
+------------------------------------------+
|  - amount: Decimal                       |
|  - currency: String                      |
+------------------------------------------+
```

### 3.3 PhoneNumber

```
+------------------------------------------+
|  PhoneNumber (Value Object)              |
+------------------------------------------+
|  - countryCode: String                   |
|  - number: String                        |
|  - extension: String                     |
+------------------------------------------+
```

---

## 4. Aggregate Roots

### 4.1 Tenant Aggregate
- **Root:** Tenant
- **Entities:** User, License, AppraisalOrder, Document
- **Invariants:**
  - All entities belong to exactly one tenant
  - Tenant data is isolated from other tenants
  - Tenant settings must be valid JSON

### 4.2 AppraisalOrder Aggregate
- **Root:** AppraisalOrder
- **Entities:** AppraisalReport, OrderNote
- **Invariants:**
  - Order must have a valid property
  - Order must have a requester
  - Order status transitions must follow workflow
  - Report must be complete before delivery

### 4.3 License Aggregate
- **Root:** License
- **Entities:** ContinuingEducationCredit, LicenseRenewal
- **Invariants:**
  - License number must be unique within state
  - Expiration date must be in the future for active licenses
  - CE credits must meet state requirements

---

## 5. Domain Events

### 5.1 User Events
- UserRegistered
- UserLoggedIn
- UserLoggedOut
- UserPasswordChanged
- UserRoleChanged
- UserMFAEnabled
- UserMFADisabled

### 5.2 License Events
- LicenseAdded
- LicenseUpdated
- LicenseVerified
- LicenseRenewalStarted
- LicenseRenewalCompleted
- LicenseExpired
- LicenseSuspended
- LicenseRevoked

### 5.3 Appraisal Events
- AppraisalOrderCreated
- AppraisalOrderAssigned
- AppraisalOrderAccepted
- AppraisalOrderDeclined
- AppraisalOrderStatusChanged
- AppraisalReportSubmitted
- AppraisalReportApproved
- AppraisalReportRejected
- AppraisalReportDelivered

### 5.4 Document Events
- DocumentUploaded
- DocumentDownloaded
- DocumentShared
- DocumentDeleted
- DocumentVersionCreated

---

## 6. Domain Services

### 6.1 LicenseVerificationService
- Verifies license status with state boards
- Schedules verification jobs
- Handles verification failures
- Updates license verification status

### 6.2 AppraisalWorkflowService
- Manages order status transitions
- Assigns appraisers to orders
- Tracks order deadlines
- Handles order cancellations

### 6.3 ComplianceCalculationService
- Calculates compliance status
- Determines renewal deadlines
- Calculates CE credit requirements
- Generates compliance reports

### 6.4 DocumentStorageService
- Manages document uploads
- Handles document downloads
- Manages document versions
- Enforces access control

---

## 7. Repositories

### 7.1 TenantRepository
- findById(id)
- findBySlug(slug)
- save(tenant)
- delete(id)

### 7.2 UserRepository
- findById(id)
- findByEmail(email)
- findByTenantId(tenantId)
- save(user)
- delete(id)

### 7.3 LicenseRepository
- findById(id)
- findByUserId(userId)
- findByTenantId(tenantId)
- findByLicenseNumber(licenseNumber)
- findExpiringLicenses(daysUntilExpiration)
- save(license)
- delete(id)

### 7.4 AppraisalOrderRepository
- findById(id)
- findByTenantId(tenantId)
- findByStatus(status)
- findByAssignedTo(userId)
- findByDueDateRange(startDate, endDate)
- save(order)
- delete(id)

### 7.5 PropertyRepository
- findById(id)
- findByTenantId(tenantId)
- findByAddress(address)
- findByMlsNumber(mlsNumber)
- save(property)
- delete(id)

### 7.6 DocumentRepository
- findById(id)
- findByTenantId(tenantId)
- findByOwnerId(userId)
- findByFolderId(folderId)
- save(document)
- delete(id)

---

## 8. Review Board Assessment

### Business Experts Review

| Reviewer | Status | Comments |
|----------|--------|----------|
| **Licensed Brokers** | Pending | Domain validation |
| **Appraisers** | Pending | Domain validation |
| **Compliance Officers** | Pending | Regulatory validation |

### Software Architecture Review

| Reviewer | Status | Comments |
|----------|--------|----------|
| **Staff Engineer** | Pending | Architecture alignment |
| **Microservice Architect** | Pending | Service boundaries |

### Database Team Review

| Reviewer | Status | Comments |
|----------|--------|----------|
| **DBA** | Pending | Data model validation |
| **Data Architect** | Pending | Schema design |

---

## 9. ADR-005: Domain Model Approach

### Decision
Adopted Domain-Driven Design (DDD) with aggregates and value objects.

### Context
- Complex business domain
- Need clear boundaries
- Multi-tenant architecture required

### Consequences
+ Clear domain boundaries
+ Explicit business rules
+ Testable domain logic
- Requires DDD expertise
- More complex than traditional models

### Status
Accepted

---

## 10. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-22 | System | Initial draft |

---

**Next Review:** Database ER Diagram (Deliverable 10)  
**Dependencies:** Functional Requirements, User Stories  
**Blockers:** Domain Experts validation required
