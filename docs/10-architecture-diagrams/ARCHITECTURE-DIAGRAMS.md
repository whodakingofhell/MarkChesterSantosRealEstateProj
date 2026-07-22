# Deliverable 10-16: Architecture Diagrams
## Nelson Aczon License Broker & Appraiser Platform

**Document ID:** AD-001  
**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2026-07-22  
**Review Board:** Software Architecture, DevOps, Database Team  

---

## 1. Document Overview

### 1.1 Purpose
This document defines the architecture diagrams for the Nelson Aczon License Broker & Appraiser Platform. It includes system context, container, component, sequence, activity, and state diagrams.

### 1.2 Notation
- **C4 Model:** System, Container, Component, Code
- **UML:** Sequence, Activity, State
- **Mermaid:** Diagram syntax for documentation

---

## 2. System Context Diagram (Level 1)

### 2.1 Overview
The system context diagram shows the high-level system and its interactions with external actors and systems.

```mermaid
graph TB
    subgraph "External Systems"
        StateBoards[State Licensing Boards]
        MLS[MLS Systems]
        PaymentGateway[Payment Gateway]
        EmailService[Email Service]
        SMSService[SMS Service]
    end
    
    subgraph "Users"
        Brokers[Licensed Brokers]
        Appraisers[Licensed Appraisers]
        Clients[Clients]
        Admins[Administrators]
        Receptionists[Receptionists]
        Inspectors[Inspectors]
        Accounting[Accounting]
        Compliance[Compliance Officers]
    end
    
    subgraph "NALBAP System"
        Platform[Nelson Aczon Platform]
    end
    
    Brokers --> Platform
    Appraisers --> Platform
    Clients --> Platform
    Admins --> Platform
    Receptionists --> Platform
    Inspectors --> Platform
    Accounting --> Platform
    Compliance --> Platform
    
    Platform --> StateBoards
    Platform --> MLS
    Platform --> PaymentGateway
    Platform --> EmailService
    Platform --> SMSService
```

### 2.2 Context Description

| Actor/System | Description | Interface |
|--------------|-------------|-----------|
| **Licensed Brokers** | Manage licenses and agents | Web/Mobile App |
| **Licensed Appraisers** | Complete appraisal orders | Web/Mobile App |
| **Clients** | View reports and track orders | Web Portal |
| **Administrators** | Manage platform and users | Web App |
| **Receptionists** | Handle office operations | Web App |
| **Inspectors** | Complete property inspections | Mobile App |
| **Accounting** | Manage finances and invoicing | Web App |
| **Compliance Officers** | Monitor regulatory compliance | Web App |
| **State Licensing Boards** | License verification | REST API |
| **MLS Systems** | Property data | REST API |
| **Payment Gateway** | Transaction processing | REST API |
| **Email Service** | Notifications | SMTP/API |
| **SMS Service** | Alerts | REST API |

---

## 3. Container Diagram (Level 2)

### 3.1 Overview
The container diagram shows the high-level technical containers that make up the system.

```mermaid
graph TB
    subgraph "Client Applications"
        WebApp[Web Application<br/>React/Next.js]
        MobileApp[Mobile App<br/>React Native]
        AdminPortal[Admin Portal<br/>React]
    end
    
    subgraph "API Layer"
        APIGateway[API Gateway<br/>Kong/AWS API Gateway]
        LoadBalancer[Load Balancer<br/>AWS ALB]
    end
    
    subgraph "Microservices"
        AuthService[Auth Service<br/>Node.js/TypeScript]
        UserService[User Service<br/>Node.js/TypeScript]
        LicenseService[License Service<br/>Node.js/TypeScript]
        AppraisalService[Appraisal Service<br/>Node.js/TypeScript]
        DocumentService[Document Service<br/>Node.js/TypeScript]
        NotificationService[Notification Service<br/>Node.js/TypeScript]
        ReportService[Report Service<br/>Node.js/TypeScript]
        IntegrationService[Integration Service<br/>Node.js/TypeScript]
    end
    
    subgraph "Data Stores"
        PostgreSQL[(PostgreSQL<br/>Primary Database)]
        Redis[(Redis<br/>Cache/Sessions)]
        Elasticsearch[(Elasticsearch<br/>Search)]
        S3[(AWS S3<br/>Object Storage)]
    end
    
    subgraph "External Integrations"
        StateBoards[State Boards API]
        MLS[MLS API]
        PaymentGateway[Payment Gateway]
        EmailService[Email Service]
        SMSService[SMS Service]
    end
    
    WebApp --> LoadBalancer
    MobileApp --> LoadBalancer
    AdminPortal --> LoadBalancer
    
    LoadBalancer --> APIGateway
    
    APIGateway --> AuthService
    APIGateway --> UserService
    APIGateway --> LicenseService
    APIGateway --> AppraisalService
    APIGateway --> DocumentService
    APIGateway --> NotificationService
    APIGateway --> ReportService
    APIGateway --> IntegrationService
    
    AuthService --> PostgreSQL
    AuthService --> Redis
    UserService --> PostgreSQL
    LicenseService --> PostgreSQL
    AppraisalService --> PostgreSQL
    DocumentService --> PostgreSQL
    DocumentService --> S3
    NotificationService --> PostgreSQL
    ReportService --> PostgreSQL
    IntegrationService --> PostgreSQL
    
    LicenseService --> StateBoards
    AppraisalService --> MLS
    ReportService --> S3
    NotificationService --> EmailService
    NotificationService --> SMSService
```

### 3.2 Container Description

| Container | Technology | Purpose | Scalability |
|-----------|------------|---------|-------------|
| **Web Application** | React/Next.js | Client-facing UI | Horizontal |
| **Mobile App** | React Native | Mobile access | Horizontal |
| **Admin Portal** | React | Administration | Horizontal |
| **API Gateway** | Kong/AWS | Request routing | Horizontal |
| **Load Balancer** | AWS ALB | Traffic distribution | Auto-scaling |
| **Auth Service** | Node.js/TypeScript | Authentication | Horizontal |
| **User Service** | Node.js/TypeScript | User management | Horizontal |
| **License Service** | Node.js/TypeScript | License management | Horizontal |
| **Appraisal Service** | Node.js/TypeScript | Appraisal workflow | Horizontal |
| **Document Service** | Node.js/TypeScript | Document management | Horizontal |
| **Notification Service** | Node.js/TypeScript | Notifications | Horizontal |
| **Report Service** | Node.js/TypeScript | Reporting | Horizontal |
| **Integration Service** | Node.js/TypeScript | External integrations | Horizontal |
| **PostgreSQL** | PostgreSQL 14+ | Primary database | Read replicas |
| **Redis** | Redis 7+ | Cache/sessions | Cluster mode |
| **Elasticsearch** | Elasticsearch 8+ | Search | Cluster mode |
| **S3** | AWS S3 | Object storage | Unlimited |

---

## 4. Component Diagram (Level 3)

### 4.1 License Service Components

```mermaid
graph TB
    subgraph "License Service"
        LicenseAPI[License API Controller]
        LicenseDomain[License Domain Service]
        LicenseRepository[License Repository]
        VerificationService[Verification Service]
        ComplianceService[Compliance Service]
        NotificationTrigger[Notification Trigger]
    end
    
    subgraph "External"
        StateBoardAPI[State Board API]
        NotificationService[Notification Service]
    end
    
    LicenseAPI --> LicenseDomain
    LicenseDomain --> LicenseRepository
    LicenseDomain --> VerificationService
    LicenseDomain --> ComplianceService
    LicenseDomain --> NotificationTrigger
    
    VerificationService --> StateBoardAPI
    NotificationTrigger --> NotificationService
    
    LicenseRepository --> PostgreSQL[(PostgreSQL)]
```

### 4.2 Appraisal Service Components

```mermaid
graph TB
    subgraph "Appraisal Service"
        AppraisalAPI[Appraisal API Controller]
        OrderDomain[Order Domain Service]
        WorkflowEngine[Workflow Engine]
        AppraisalRepository[Appraisal Repository]
        PropertyService[Property Service]
        ReportGenerator[Report Generator]
    end
    
    subgraph "External"
        MLSService[MLS Service]
        DocumentService[Document Service]
    end
    
    AppraisalAPI --> OrderDomain
    OrderDomain --> WorkflowEngine
    OrderDomain --> AppraisalRepository
    OrderDomain --> PropertyService
    OrderDomain --> ReportGenerator
    
    PropertyService --> MLSService
    ReportGenerator --> DocumentService
    
    AppraisalRepository --> PostgreSQL[(PostgreSQL)]
```

---

## 5. Sequence Diagrams

### 5.1 User Login Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant WA as Web App
    participant GW as API Gateway
    participant AS as Auth Service
    participant RD as Redis
    participant DB as PostgreSQL
    
    U->>WA: Enter credentials
    WA->>GW: POST /auth/login
    GW->>AS: Forward request
    AS->>DB: Validate credentials
    DB-->>AS: User data
    AS->>RD: Store session
    AS-->>GW: JWT token
    GW-->>WA: Token response
    WA-->>U: Login successful
    
    Note over U,DB: MFA Flow (if enabled)
    U->>WA: Enter MFA code
    WA->>GW: POST /auth/mfa/verify
    GW->>AS: Verify code
    AS->>RD: Validate code
    AS-->>GW: Access token
    GW-->>WA: Token response
    WA-->>U: Access granted
```

### 5.2 License Verification Sequence

```mermaid
sequenceDiagram
    participant LS as License Service
    participant VS as Verification Service
    participant SB as State Board API
    participant DB as PostgreSQL
    participant NS as Notification Service
    
    LS->>VS: Request verification
    VS->>SB: GET /license/{number}
    SB-->>VS: License status
    VS->>DB: Update verification status
    VS->>NS: Send notification (if status changed)
    NS-->>VS: Notification sent
    VS-->>LS: Verification complete
```

### 5.3 Appraisal Order Workflow Sequence

```mermaid
sequenceDiagram
    participant MS as Mortgage Specialist
    participant AS as Appraisal Service
    participant AP as Appraiser
    participant RS as Report Service
    participant NS as Notification Service
    
    MS->>AS: Create order
    AS->>AS: Generate order number
    AS->>NS: Notify admin
    AS-->>MS: Order created
    
    AS->>AP: Assign order
    AP->>AS: Accept order
    AS->>NS: Notify specialist
    AS-->>AP: Order accepted
    
    AP->>AS: Schedule inspection
    AS->>NS: Send reminder
    
    AP->>AS: Complete inspection
    AP->>AS: Submit report
    AS->>RS: Generate report
    RS-->>AS: Report ready
    AS->>NS: Notify specialist
    AS-->>MS: Report delivered
```

### 5.4 Document Upload Sequence

```mermaid
sequenceDiagram
    participant U as User
    participant WA as Web App
    participant DS as Document Service
    participant S3 as AWS S3
    participant DB as PostgreSQL
    
    U->>WA: Select file
    WA->>DS: Request upload URL
    DS->>S3: Generate presigned URL
    S3-->>DS: Upload URL
    DS-->>WA: Upload URL
    
    WA->>S3: Upload file
    S3-->>WA: Upload complete
    
    WA->>DS: Confirm upload
    DS->>DB: Store metadata
    DS-->>WA: Document created
    WA-->>U: Upload successful
```

---

## 6. Activity Diagrams

### 6.1 License Renewal Process

```mermaid
flowchart TD
    A[Start] --> B{License expiring?}
    B -->|Yes| C[Send 90-day reminder]
    B -->|No| Z[End]
    C --> D{Renewed?}
    D -->|Yes| E[Update license status]
    D -->|No| F{60 days left?}
    F -->|Yes| G[Send 60-day reminder]
    F -->|No| H{30 days left?}
    H -->|Yes| I[Send 30-day reminder]
    H -->|No| J{7 days left?}
    J -->|Yes| K[Send critical reminder]
    J -->|No| L{Expired?}
    L -->|Yes| M[Mark as expired]
    L -->|No| N[Continue monitoring]
    E --> O[Update compliance status]
    G --> D
    I --> D
    K --> D
    M --> P[Notify admin]
    N --> B
    O --> Z
    P --> Z
```

### 6.2 Appraisal Order Workflow

```mermaid
flowchart TD
    A[Order Created] --> B[Pending]
    B --> C[Assigned to Appraiser]
    C --> D{Appraiser accepts?}
    D -->|Yes| E[Accepted]
    D -->|No| F[Declined]
    F --> G[Reassign]
    G --> C
    E --> H[Scheduled]
    H --> I[Inspection Complete]
    I --> J[Report Draft]
    J --> K[Under Review]
    K --> L{Approved?}
    L -->|Yes| M[Approved]
    L -->|No| N[Rejected]
    N --> O[Revision Required]
    O --> J
    M --> P[Delivered]
    P --> Q[Complete]
```

### 6.3 Document Management Flow

```mermaid
flowchart TD
    A[User uploads document] --> B{Valid file?}
    B -->|Yes| C[Store in S3]
    B -->|No| D[Return error]
    C --> E[Create metadata]
    E --> F[Set permissions]
    F --> G[Document available]
    G --> H{User action?}
    H -->|Download| I[Generate download URL]
    H -->|Share| J[Update permissions]
    H -->|Delete| K[Soft delete]
    H -->|Search| L[Query Elasticsearch]
    I --> M[Log access]
    J --> N[Notify shared user]
    K --> O[Mark as deleted]
    L --> P[Return results]
    M --> H
    N --> H
    O --> H
    P --> H
```

---

## 7. State Diagrams

### 7.1 License State Machine

```mermaid
stateDiagram-v2
    [*] --> PendingVerification : Created
    PendingVerification --> Active : Verified
    PendingVerification --> Invalid : Verification Failed
    Active --> PendingRenewal : 90 days to expiry
    PendingRenewal --> Active : Renewed
    PendingRenewal --> Expired : Expiration date passed
    Active --> Suspended : Compliance violation
    Suspended --> Active : Violation resolved
    Active --> Revoked : Regulatory action
    Expired --> PendingRenewal : Renewal started
    Revoked --> [*]
```

### 7.2 Appraisal Order State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending : Created
    Pending --> Assigned : Appraiser assigned
    Assigned --> Accepted : Appraiser accepted
    Assigned --> Declined : Appraiser declined
    Declined --> Assigned : Reassigned
    Accepted --> Scheduled : Inspection scheduled
    Scheduled --> InspectionComplete : Inspection done
    InspectionComplete --> ReportDraft : Report started
    ReportDraft --> UnderReview : Report submitted
    UnderReview --> Approved : Review passed
    UnderReview --> Rejected : Review failed
    Rejected --> ReportDraft : Revision required
    Approved --> Delivered : Report delivered
    Delivered --> Complete : Client acknowledged
    Pending --> Cancelled : Order cancelled
    Assigned --> Cancelled : Order cancelled
    Accepted --> Cancelled : Order cancelled
```

### 7.3 User Account State Machine

```mermaid
stateDiagram-v2
    [*] --> PendingVerification : Registered
    PendingVerification --> Active : Email verified
    Active --> Locked : 5 failed logins
    Locked --> Active : Admin unlock
    Locked --> Locked : 30 min timeout
    Active --> Inactive : 90 days no login
    Inactive --> Active : User logs in
    Active --> Deactivated : Admin deactivates
    Deactivated --> Active : Admin reactivates
```

---

## 8. Deployment Diagram

### 8.1 AWS Deployment Architecture

```mermaid
graph TB
    subgraph "AWS Cloud"
        subgraph "VPC"
            subgraph "Public Subnet"
                ALB[Application Load Balancer]
                NAT[NAT Gateway]
            end
            
            subgraph "Private Subnet - Application"
                subgraph "EKS Cluster"
                    subgraph "Namespace: production"
                        AuthService[Auth Service]
                        UserService[User Service]
                        LicenseService[License Service]
                        AppraisalService[Appraisal Service]
                        DocumentService[Document Service]
                        NotificationService[Notification Service]
                        ReportService[Report Service]
                        IntegrationService[Integration Service]
                    end
                end
            end
            
            subgraph "Private Subnet - Data"
                RDS[(RDS PostgreSQL<br/>Multi-AZ)]
                ElastiCache[(ElastiCache Redis<br/>Cluster)]
                OpenSearch[(OpenSearch<br/>3 nodes)]
            end
            
            subgraph "Storage"
                S3[(S3 Bucket<br/>Encrypted)]
            end
        end
        
        subgraph "Services"
            CloudFront[CloudFront CDN]
            Route53[Route 53 DNS]
            WAF[WAF]
            CloudWatch[CloudWatch]
            KMS[KMS Keys]
        end
    end
    
    Route53 --> CloudFront
    CloudFront --> ALB
    WAF --> ALB
    ALB --> AuthService
    ALB --> UserService
    ALB --> LicenseService
    ALB --> AppraisalService
    ALB --> DocumentService
    ALB --> NotificationService
    ALB --> ReportService
    ALB --> IntegrationService
    
    AuthService --> RDS
    UserService --> RDS
    LicenseService --> RDS
    AppraisalService --> RDS
    DocumentService --> RDS
    NotificationService --> RDS
    ReportService --> RDS
    IntegrationService --> RDS
    
    AuthService --> ElastiCache
    UserService --> ElastiCache
    
    DocumentService --> S3
    ReportService --> S3
    
    CloudWatch --> AuthService
    CloudWatch --> UserService
    CloudWatch --> LicenseService
    CloudWatch --> AppraisalService
```

---

## 9. Architecture Decision Records

### 9.1 ADR-006: Microservices Architecture

**Decision:** Adopt microservices architecture for the platform.

**Context:**
- Multiple bounded contexts
- Different scalability requirements
- Team autonomy needed
- Technology flexibility required

**Consequences:**
+ Independent deployment
+ Technology flexibility
+ Team autonomy
+ Fine-grained scalability
- Increased complexity
- Network overhead
- Distributed transactions
- Operational overhead

**Status:** Accepted

### 9.2 ADR-007: Event-Driven Communication

**Decision:** Use event-driven architecture for inter-service communication.

**Context:**
- Async operations needed
- Decoupling required
- Audit trail important
- Real-time updates needed

**Consequences:**
+ Loose coupling
+ Scalability
+ Audit trail
+ Real-time updates
- Eventual consistency
- Complexity
- Debugging difficulty

**Status:** Accepted

### 9.3 ADR-008: Database per Service

**Decision:** Each microservice owns its data.

**Context:**
- Data isolation required
- Different data models
- Scalability needs
- Multi-tenant isolation

**Consequences:**
+ Data isolation
+ Independent scaling
+ Schema flexibility
+ Multi-tenant support
- Data consistency challenges
- Cross-service queries
- Data duplication

**Status:** Accepted

---

## 10. Review Board Assessment

### Software Architecture Review

| Reviewer | Status | Comments |
|----------|--------|----------|
| **Google Staff Engineer** | Pending | Scalability review |
| **Microsoft Principal Engineer** | Pending | Enterprise patterns |
| **Amazon Principal Engineer** | Pending | Cloud-native design |
| **Netflix Distributed Systems Engineer** | Pending | Resilience patterns |
| **Cloud Architect** | Pending | Infrastructure alignment |
| **Enterprise Architect** | Pending | Architecture governance |

### DevOps Team Review

| Reviewer | Status | Comments |
|----------|--------|----------|
| **Platform Engineer** | Pending | Platform design |
| **Kubernetes Engineer** | Pending | K8s architecture |
| **CI/CD Engineer** | Pending | Pipeline design |
| **SRE** | Pending | Reliability patterns |

---

## 11. Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-22 | System | Initial draft |

---

**Next Review:** API Specification (Deliverable 17)  
**Dependencies:** Domain Model, Non-Functional Requirements  
**Blockers:** Architecture Team validation required
