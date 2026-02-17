TECHNICAL ARCHITECTURE DOCUMENT
Platform-Operating System for Online Therapy Practice


Version 1.0  |  February 2026
Based on TZ v3.0 & Competitive Analysis
Target Markets	Ukraine (MVP), USA, EU
Team Size	8+ developers
Video Infrastructure	LiveKit (open-source SFU)
Real-time Layer	LiveKit Data Channels + Socket.IO
Architecture Style	Modular Monolith → Microservices
Primary Language	TypeScript (full-stack)
 
Table of Contents


Note: Update this table of contents after opening in Word (right-click → Update Field).
 
1. Executive Summary
This document defines the technical architecture for the Mental Health Practice Operating System — a modular platform that unifies clinical documentation, session delivery, marketplace, payment processing, and client engagement tools for mental health professionals. The architecture is designed to serve three markets (Ukraine, USA, EU) with a phased approach: launching MVP in Ukraine where early adopters are available, then expanding to the US and European markets.
The architecture follows a Modular Monolith pattern that enables rapid MVP development by a team of 8+ engineers, with clear module boundaries that support future decomposition into microservices as the platform scales. Key architectural decisions include:
•	LiveKit for all real-time video/audio with SFU architecture, recording, and screen sharing
•	TypeScript full-stack (Next.js + NestJS) for maximum code sharing and type safety
•	PostgreSQL as primary database with row-level security for multi-tenant data isolation
•	Privacy-by-design with HIPAA/GDPR compliance baked into the data layer from day one
•	Multi-region readiness with data residency support for EU, Canada, and Australia expansion

Architecture Principle
Build for Ukraine first, architect for global. Every component must support multi-tenancy, multi-language, and multi-jurisdiction from the start — even if only Ukrainian and English are active in MVP.

 
2. Architecture Principles
Modular Monolith First: Start with a monolith containing well-defined module boundaries (separate NestJS modules with clear APIs). Each module can be extracted into a standalone service when scale demands it. This avoids premature microservices complexity for a team of 8.
Privacy by Design: HIPAA and GDPR compliance at the data layer: encryption at rest (AES-256), in transit (TLS 1.3), field-level encryption for PII, audit logging for every data access, and consent-gated data sharing. Build the strictest standard (HIPAA) first — GDPR and Ukrainian law are subsets.
Consent as First-Class Citizen: No data access, AI processing, or third-party sharing without explicit, granular, revocable consent. The Consent Engine governs all cross-module data flow.
Multi-Tenant from Day One: Organization-level data isolation using PostgreSQL Row-Level Security (RLS). Specialist data never leaks between organizations. Client data never leaks between specialists (except via explicit consent/referral).
Offline-First for Critical Functions: Safety plans, grounding exercises, and crisis resources must work without internet. Mobile apps use local-first data with background sync.
API-First Design: Every feature is built as an API first, consumed by web and mobile clients. This enables future white-label, B2B integrations, and third-party plugins.
Observable & Resilient: Structured logging, distributed tracing, health checks, circuit breakers, and graceful degradation. A video session must continue even if AI services are down.
Jurisdiction-Aware Architecture: Data storage location, retention policies, consent templates, and crisis resources adapt based on organization/client jurisdiction.
 
3. Technology Stack
3.1 Core Stack Overview
Layer	Technology	Rationale
Frontend (Web)	Next.js 14+ (App Router), React, TypeScript	SSR/SSG for SEO (marketplace), RSC for performance, massive ecosystem
Frontend (Mobile)	React Native + Expo	Code sharing with web (70%+ shared logic), native performance, OTA updates
Backend (API)	NestJS (TypeScript)	Modular architecture, dependency injection, built-in validation, OpenAPI gen
Database	PostgreSQL 16+ (primary)	JSONB for flexible schemas, RLS for multi-tenancy, full-text search, proven HIPAA track record
Cache / Real-time	Redis 7+ (Valkey)	Session cache, pub/sub for real-time events, rate limiting, job queues
Search	Meilisearch (MVP) → Elasticsearch	Fast, typo-tolerant search for marketplace. Meilisearch is simpler to operate for MVP
Video / Audio	LiveKit (self-hosted or cloud)	Open-source SFU, recording, screen share, group calls, web + mobile SDKs
Real-time Events	LiveKit Data Channels + Socket.IO	LiveKit for in-session events, Socket.IO for platform-wide real-time (chat, notifications)
File Storage	S3-compatible (AWS S3 / MinIO)	HIPAA-eligible, encrypted at rest, pre-signed URLs for secure access
AI / ML	OpenAI API (GPT-4o) + Whisper	Transcription (Whisper), note generation (GPT-4o), semantic search embeddings
Queue / Jobs	BullMQ (Redis-backed)	Background jobs: claim processing, AI tasks, notifications, report generation
Email	AWS SES / Resend	Transactional email with high deliverability
SMS	Twilio	SMS notifications, 2FA codes
Payments	Stripe Connect	Multi-party payments, international payouts, recurring billing, Connect for marketplace
Auth	Custom (Passport.js) + NextAuth	JWT + refresh tokens, OAuth, SAML for B2B, 2FA/biometric
Monitoring	Grafana + Prometheus + Loki	Open-source observability stack. Sentry for error tracking
CI/CD	GitHub Actions	Build, test, deploy automation with environment promotion
Infrastructure	AWS (primary) / Hetzner (EU/UA cost optimization)	Multi-region support, HIPAA BAA available, extensive service catalog
IaC	Terraform + Pulumi	Infrastructure as code for reproducible deployments across regions
Containers	Docker + Kubernetes (EKS/k3s)	Container orchestration, auto-scaling, rolling deployments

3.2 Why TypeScript Full-Stack
Choosing TypeScript across the entire stack (Next.js, NestJS, React Native) provides critical advantages for a team of 8+:
•	Shared types: API contracts, validation schemas (Zod), and domain models are defined once and used by frontend, backend, and mobile. This eliminates an entire class of integration bugs.
•	Shared logic: Business rules (consent validation, scheduling conflict detection, MBC scoring) are written once as pure functions, imported by any layer.
•	Developer velocity: Any developer can work on any part of the system. No context-switching between languages.
•	Hiring: TypeScript developers are abundant in Ukraine and internationally. No need for separate Python/Go/Swift specialists.

3.3 Why Modular Monolith (Not Microservices)
For a team of 8 developers building MVP in 6-9 months, microservices would add operational complexity (service mesh, distributed transactions, deployment coordination) without proportional benefit. The Modular Monolith approach means:
•	Single deployable unit with clear internal module boundaries (NestJS modules)
•	Modules communicate through well-defined internal APIs (service interfaces), not direct database access
•	Shared PostgreSQL database with schema-per-module isolation (case_management.*, payments.*, sessions.*)
•	When a module needs independent scaling (e.g., AI processing, video recording), it can be extracted with minimal refactoring
•	Target: extract first microservice (AI/ML pipeline) at ~50 concurrent sessions; second (video recording) at ~200

3.4 Why LiveKit for Video
LiveKit was selected over alternatives (Twilio, Daily.co, 100ms) based on the platform requirements:
Criteria	LiveKit	Twilio Video	Daily.co
Pricing	Self-hosted: infra cost only; Cloud: $0.006/min	$0.004/min + HIPAA surcharge	$0.04/min participant
Open Source	Yes (Apache 2.0)	No	No
Self-Hosting	Full control, data residency	Not possible	Not possible
HIPAA	Self-hosted = full control; Cloud = BAA available	BAA available	BAA available
Recording	Server-side, egress API	Composition recording	Cloud recording
Screen Share	Native support + data channels	Native support	Native support
Group Calls	Up to 200+ participants (SFU)	Up to 50 (Group Rooms)	Up to 1000
Data Channels	Built-in (grounding, interactives)	Not native	Not native
Mobile SDKs	React Native, Swift, Kotlin	React Native, native	React Native, native
Lock-in Risk	None (OSS)	High	Medium

LiveKit Strategy
Start with LiveKit Cloud for MVP to minimize DevOps overhead. Migrate to self-hosted when: (a) video costs exceed $3K/month, (b) data residency requirements demand it, or (c) custom recording pipelines are needed. The client SDK code remains identical.
 
4. High-Level System Architecture
4.1 Architecture Layers
The system is organized into four architectural layers, each with clear responsibilities:
Layer	Components	Responsibility
Presentation	Next.js Web, React Native Mobile, Design System	UI rendering, routing, local state, offline caching, accessibility
API Gateway	NestJS REST/GraphQL API, WebSocket Gateway	Authentication, authorization, rate limiting, request validation, API versioning
Domain Services	Core Modules (Case, Session, Payment, AI, etc.)	Business logic, domain events, consent enforcement, workflow orchestration
Infrastructure	PostgreSQL, Redis, S3, LiveKit, BullMQ, Stripe	Data persistence, caching, media, video, async jobs, payments

4.2 Module Dependency Map
The following diagram shows the dependency relationships between core modules. Arrows indicate “depends on”:

┌─────────────────────── PRESENTATION LAYER ───────────────────────┐
│  Next.js Web    |    React Native Mobile    |    Design System  │
└──────────────────────────────────────────────────────────────────┘
                           │ REST / GraphQL / WebSocket
┌───────────────────────── API GATEWAY ─────────────────────────┐
│  Auth  |  Rate Limiter  |  Validation  |  RBAC/ABAC Gateway  │
└──────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────── DOMAIN SERVICES ───────────────────────┐
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Identity │  │  Consent  │  │  Case     │  │ Session  │  │
│  │ & Access │  │  Engine   │  │  Engine   │  │  Engine   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Payment  │  │ Schedul. │  │ Messag.  │  │ Notific. │  │
│  │ & Billing│  │ Engine   │  │  Hub     │  │  Engine   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Program  │  │  AI      │  │  MBC /   │  │ Marketpl.│  │
│  │  Engine  │  │  Add-on  │  │ Outcomes │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────── INFRASTRUCTURE ────────────────────────┐
│  PostgreSQL  |  Redis  |  S3  |  LiveKit  |  BullMQ  |  Stripe │
└──────────────────────────────────────────────────────────────────┘

4.3 Cross-Cutting Concerns
These concerns span all modules and are implemented as shared infrastructure:
Concern	Implementation
Authentication	JWT access tokens (15 min) + refresh tokens (7 days) in HTTP-only cookies. OAuth 2.0 (Google, Apple, Facebook). SAML for B2B/EAP SSO. 2FA via TOTP + SMS fallback. Biometric on mobile.
Authorization	RBAC for role-level access + ABAC for object-level (Case, Program, Activity). PostgreSQL RLS policies enforce data isolation at the database layer. Consent Engine acts as authorization middleware.
Audit Logging	Immutable append-only log for every data access, modification, export, and deletion. Stored in separate audit schema with 7-year retention. Queryable by admin for compliance audits.
i18n / L10n	All UI strings via i18n keys (next-intl). ICU MessageFormat for pluralization. Intl API for dates/currencies. UTC storage with client-side timezone display.
Error Handling	Structured error codes (domain.module.error), correlation IDs for tracing, graceful degradation (AI down = session continues), client-friendly error messages.
Feature Flags	LaunchDarkly or Unleash for gradual rollouts. Per-organization, per-cohort, and percentage-based targeting.
 
5. Data Model
5.1 Database Schema Strategy
PostgreSQL schemas provide module isolation within a single database:
Schema	Core Tables	Owner Module
auth	users, sessions, tokens, oauth_connections, mfa_config	Identity & Access
case_mgmt	cases, case_notes, case_goals, case_history, case_transfers	Case Engine
clinical	note_templates, intake_forms, form_submissions, treatment_plans	Clinical Documentation
consent	consent_records, consent_templates, consent_audit	Consent Engine
scheduling	availability_slots, appointments, recurring_rules, waitlist	Scheduling Engine
sessions	session_records, session_participants, session_artifacts	Session Engine
messaging	conversations, messages, message_attachments	Messaging Hub
payments	transactions, invoices, payouts, subscriptions, stripe_accounts	Payment & Billing
marketplace	specialist_profiles, program_listings, reviews, matching_scores	Marketplace
programs	programs, activities, cycles, enrollments, activity_hubs	Program Engine
mbc	assessments, assessment_results, outcome_tracking, alert_rules	MBC / Outcomes
notifications	notification_queue, preferences, delivery_log	Notification Engine
ai	transcripts, generated_notes, embeddings, ai_consent	AI Add-on
analytics	events, aggregations, dashboards	Analytics Engine
audit	audit_log, data_access_log, export_log	Audit & Versioning
files	file_metadata, file_versions, upload_tokens	Content / Files
crisis	safety_plans, crisis_resources, high_risk_flags, escalation_log	Crisis Protocol

5.2 Core Entity Relationships
The central entities and their relationships (simplified ER):
User (1) ----&lt; (N) Case &gt;---- (1) Specialist
  |                  |                  |
  |                  |-- Notes          |-- SpecialistProfile
  |                  |-- Goals          |-- Availability
  |                  |-- Files          |-- Programs (owner)
  |                  |-- Consents       |
  |                  |-- Assessments    |
  |                  |-- Appointments   |
  |                                     |
  |---&lt; Enrollments &gt;---&lt; Programs      |
  |                         |            |
  |                         |-- Cycles   |
  |                         |-- Activities
  |                         |-- ActivityHubs
  |                                     
  |---&lt; Transactions &gt;--- Stripe        
  |---&lt; Messages                        
  |---&lt; Notifications                   
  |---&lt; ConsentRecords                  

5.3 Key Entity Details
5.3.1 User
Field	Type	Notes
id	UUID (v7)	Time-sortable, globally unique
email	varchar(255)	Encrypted at rest (AES-256-GCM). Unique index on hash.
role	enum	client, specialist, co_specialist, supervisor, org_admin, eap_manager, platform_admin
organization_id	UUID (nullable)	Foreign key to organizations. Nullable for independent practitioners.
jurisdiction	varchar(10)	Primary jurisdiction code (US-CA, UA, DE, etc.). Determines compliance rules.
language	varchar(5)	Preferred UI language (en, uk, de, etc.)
timezone	varchar(50)	IANA timezone (e.g., Europe/Kyiv, America/New_York)
mfa_enabled	boolean	Required for specialists handling insurance data
created_at	timestamptz	Always UTC
deleted_at	timestamptz	Soft delete for GDPR right-to-erasure audit trail

5.3.2 Case
Field	Type	Notes
id	UUID (v7)	
client_id	UUID	FK to users
specialist_id	UUID	FK to users (role=specialist)
organization_id	UUID (nullable)	FK to organizations
status	enum	draft, active, paused, closed, archived, transferred
intake_form_id	UUID (nullable)	FK to form_submissions
treatment_plan_id	UUID (nullable)	FK to treatment_plans
insurance_info	jsonb (encrypted)	Payer ID, member ID, group number, copay. Field-level encryption.
jurisdiction	varchar(10)	Client jurisdiction for this case (may differ from user default)
risk_level	enum	low, moderate, high, crisis. Updated by MBC + specialist markers.
created_at / updated_at	timestamptz	
closed_at	timestamptz (nullable)	When case was closed
auto_pause_at	timestamptz (nullable)	Computed: last_session + 30 days

5.3.3 Session Record
Field	Type	Notes
id	UUID (v7)	
case_id	UUID (nullable)	FK to cases (null for group sessions)
program_id	UUID (nullable)	FK to programs (null for individual)
activity_id	UUID (nullable)	FK to activities
specialist_id	UUID	FK to users
session_type	enum	individual, group, standup, closing
modality	enum	video, audio, async_messaging, in_person
status	enum	scheduled, in_progress, completed, cancelled, no_show
scheduled_start	timestamptz	
actual_start / actual_end	timestamptz	
client_location	jsonb	Jurisdiction verification: {country, state, verified_at, method}
livekit_room_name	varchar	LiveKit room identifier
recording_url	varchar (nullable)	S3 path to recording (if consent given)
ai_consent	jsonb	Per-session AI consent: {transcription: bool, notes: bool, recording: bool}
 
6. API Architecture
6.1 API Strategy
The platform uses a hybrid API approach:
•	REST API for CRUD operations, webhooks, and third-party integrations. OpenAPI 3.1 spec auto-generated from NestJS decorators.
•	GraphQL (optional, Phase 3+) for marketplace queries where clients need flexible data fetching and white-label API consumers.
•	WebSocket (Socket.IO) for real-time platform events: chat messages, notifications, presence indicators.
•	LiveKit Data Channels for in-session real-time: grounding triggers, interactive exercises, session state sync.

6.2 API Versioning
URL-based versioning: /api/v1/cases, /api/v2/cases. Breaking changes require a new version. Non-breaking additions (new optional fields) do not increment version. Minimum 12-month support for deprecated versions.

6.3 Core API Endpoints (MVP)
Method	Endpoint	Description	Auth
POST	/api/v1/auth/register	User registration	Public
POST	/api/v1/auth/login	Login (email/pass, OAuth)	Public
POST	/api/v1/auth/refresh	Refresh access token	Refresh token
GET	/api/v1/cases	List cases for current user	Specialist/Client
POST	/api/v1/cases	Create new case	Specialist
GET	/api/v1/cases/:id	Get case details	Case participant + consent
PATCH	/api/v1/cases/:id	Update case	Specialist (owner)
POST	/api/v1/cases/:id/notes	Create clinical note	Specialist
GET	/api/v1/cases/:id/notes	List notes for case	Specialist + consent
POST	/api/v1/sessions	Schedule session	Specialist/Client
POST	/api/v1/sessions/:id/join	Join session (get LiveKit token)	Participant
POST	/api/v1/sessions/:id/end	End session	Specialist
GET	/api/v1/scheduling/slots	Get available slots	Client
POST	/api/v1/scheduling/book	Book appointment	Client
GET	/api/v1/marketplace/specialists	Search specialists	Public
GET	/api/v1/marketplace/programs	Search programs	Public
POST	/api/v1/payments/checkout	Create payment session	Client
POST	/api/v1/payments/webhook	Stripe webhook handler	Stripe signature
GET	/api/v1/notifications	Get notifications	Authenticated
POST	/api/v1/consent	Grant/revoke consent	Client/Specialist
POST	/api/v1/crisis/sos	Trigger crisis protocol	Client

6.4 Request/Response Standards
All API responses follow a consistent envelope:
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 142,
    "request_id": "req_abc123"
  }
}

// Error response:
{
  "success": false,
  "error": {
    "code": "CASE.NOT_FOUND",
    "message": "Case not found",
    "request_id": "req_abc123"
  }
}
 
7. Real-Time & Video Architecture
7.1 LiveKit Integration Architecture
LiveKit serves as the unified real-time infrastructure for all synchronous interactions:
Use Case	LiveKit Feature	Implementation
1:1 Video Sessions	Room with 2 participants, tracks	Backend creates room via LiveKit Server SDK, issues participant tokens with metadata (case_id, role)
Group Sessions	Room with N participants (up to 50 for therapy groups)	Room with participant limits, moderator controls via Data Channels
Screen Sharing	Screen share tracks	Specialist initiates screen share for treatment planning, worksheets, interactive exercises
Session Recording	Egress API (room composite or track-based)	Server-side recording to S3. Triggered only with explicit consent. Encrypted at rest.
Grounding Exercises	Data Channels (reliable)	Specialist sends grounding command via data channel; client app renders breathing guide/animation overlay
Interactive Exercises	Data Channels (reliable)	Real-time sync of therapeutic tools (scales, worksheets) between specialist and client
Connection Quality	Connection quality API	Real-time quality indicator for both participants. Auto-fallback: video → audio at low quality.
Waiting Room	Room with metadata + participant events	Client joins room in ‘waiting’ state. Specialist admits when ready. Pre-session diagnostics run in waiting room.

7.2 Session Lifecycle (Technical Flow)
1.	Session Scheduled: Backend creates appointment record, schedules reminder jobs (BullMQ: -24h email, -1h push, -15min check-in, -5min diagnostics).
2.	Pre-Session (-5 min): Client opens Session Workspace. Frontend calls POST /sessions/:id/join. Backend creates LiveKit room, generates participant token with permissions and metadata. Client enters waiting room.
3.	Diagnostics: While in waiting room, client app tests camera, microphone, and connection speed. Results stored in session record. Issues shown with resolution suggestions.
4.	Specialist Joins: Specialist receives pre-session brief (last notes, goals, check-in result, MBC alerts). Joins room. Client is admitted from waiting room.
5.	Session Active: Video/audio tracks exchanged via LiveKit SFU. Data channels available for grounding and interactives. If AI consent is active, audio track is streamed to Whisper for real-time transcription/subtitles.
6.	Connection Issues: LiveKit reconnects automatically (up to 30 sec). Other participant sees ‘reconnecting’ message. If video quality drops, auto-fallback to audio-only. Client app supports background audio on mobile.
7.	Session End: Specialist ends session. Post-session flow triggers: note template opens, AI summary generated (if consented), homework assignment UI, next session booking, client feedback prompt.
8.	Post-Processing: BullMQ jobs: finalize transcription, generate AI note draft, update case status, send post-session notifications, process payment/claim.

7.3 Chat & Messaging Architecture
Platform-wide messaging (outside of video sessions) uses Socket.IO for real-time delivery with PostgreSQL as the persistent store:
•	Message Storage: All messages persisted in messaging.messages table with full encryption at rest. Messages reference a conversation (case-chat, program-chat, activity-chat, direct).
•	Real-time Delivery: Socket.IO rooms map to conversation IDs. When a message is sent, it is persisted first, then broadcast via Socket.IO to all connected participants.
•	Offline Delivery: If participant is not connected, message queues for push notification (via Notification Engine) and appears on next load.
•	Async Therapy: Messaging-only subscriptions use the same infrastructure with additional SLA tracking (response time monitoring, specialist workload balancing).
•	Typing Indicators & Read Receipts: Ephemeral events via Socket.IO (not persisted). Typing: broadcast to room. Read: persisted for SLA tracking.
 
8. Security & Compliance Architecture
8.1 Encryption Strategy
Layer	Method	Details
In Transit	TLS 1.3 (minimum 1.2)	All HTTP, WebSocket, LiveKit, database connections. HSTS enabled. Certificate pinning on mobile.
At Rest (Database)	AES-256-GCM (column-level)	PII fields (email, name, phone) encrypted at application layer before storage. Keys managed by AWS KMS.
At Rest (Files)	S3 Server-Side Encryption (SSE-KMS)	All uploaded files and recordings encrypted. Per-organization keys for isolation.
At Rest (Backups)	AES-256 encrypted backups	Database and file backups encrypted with separate keys. Cross-region replication for DR.
Field-Level	Application-level encryption	Insurance data, session recordings, psychotherapy notes use dedicated encryption keys per organization.
Key Management	AWS KMS / HashiCorp Vault	Key rotation every 90 days. Separate keys per: data type, organization, region.

8.2 HIPAA Compliance Architecture
HIPAA compliance is architected from the data layer up, even though MVP launches in Ukraine. This ensures US market readiness without retrofitting:
•	BAA Chain: Business Associate Agreements with all subprocessors: AWS (HIPAA-eligible services only), Stripe (HIPAA BAA), LiveKit Cloud (BAA available), Twilio (BAA), email provider.
•	Access Controls: Role-based (RBAC) + attribute-based (ABAC) access. Minimum necessary principle enforced by Consent Engine. Every data access logged.
•	Audit Trail: Immutable audit log for all PHI access. Who accessed what, when, why (purpose). 7-year retention. Queryable for compliance audits.
•	Psychotherapy Notes: Stored in separate encrypted partition (clinical.psychotherapy_notes). Requires specific authorization for any access. Not included in standard data exports.
•	Breach Notification: Automated breach detection (unusual access patterns, bulk exports). Notification workflow: detect → assess → notify (within 72h for GDPR, 60 days for HIPAA).
•	Data Retention: Configurable per jurisdiction: HIPAA minimum 6 years, GDPR right-to-erasure, 42 CFR Part 2 SUD segregation.

8.3 Consent Engine Architecture
The Consent Engine is the central authorization gateway for all data sharing across the platform:
•	Every cross-module data access passes through the Consent Engine
•	Consents are granular: per data type (notes, recordings, AI processing), per purpose (treatment, billing, research), per recipient
•	Dual consent for AI ambient listening (specialist + client must both consent per session)
•	Consent records are immutable (append-only). Revocation creates a new record; old consent remains for audit
•	Jurisdiction-specific consent templates (language, legal requirements, age-of-consent rules)
•	API: POST /consent (grant/revoke), GET /consent/status (check), GET /consent/history (audit)

8.4 Multi-Region & Data Residency
Architecture supports data residency requirements for international expansion:
Region	Infrastructure	Data Stored	Phase
Ukraine / EU	Hetzner Cloud (Falkenstein/Helsinki) or AWS eu-central-1	Ukrainian users, EU users	MVP
USA	AWS us-east-1 (HIPAA-eligible)	US users, insurance data	Phase 2
Canada	AWS ca-central-1	Canadian users (PIPEDA/PHIPA)	Phase 3
Australia	AWS ap-southeast-2	Australian users (Privacy Act)	Phase 3+

Organization-level configuration determines data region. Cross-region references (e.g., specialist in EU with client in US) handled via encrypted data proxying — client data stays in client’s region; specialist receives decrypted view during active session.
 
9. Infrastructure & Deployment
9.1 Infrastructure Strategy
MVP deployment optimizes for cost efficiency while maintaining production-grade reliability. The strategy leverages Hetzner for cost-effective EU/UA hosting with AWS reserved for US market HIPAA requirements:
9.1.1 MVP Infrastructure (Estimated Monthly Cost)
Component	Provider	Spec	Est. Cost/mo
Application Server	Hetzner Cloud	2x CCX33 (8 vCPU, 32GB)	€80 x 2 = €160
Database (PostgreSQL)	Hetzner Cloud	CCX43 (16 vCPU, 64GB) + managed backup	€160 + backup
Redis	Hetzner Cloud	CX22 (2 vCPU, 4GB)	€6
Object Storage (S3)	Hetzner Cloud / Backblaze B2	500 GB initial	€10-25
LiveKit	LiveKit Cloud (start) → self-hosted	Pay-per-minute	$50-200 (usage)
CDN	Cloudflare (Pro)	Caching, DDoS protection, WAF	$20
Email (transactional)	Resend / AWS SES	10K emails/month	$0-20
Monitoring	Grafana Cloud (free tier) + self-hosted	Prometheus, Loki, Grafana	$0-50
CI/CD	GitHub Actions	2,000 min/month included	$0
Domain + SSL	Cloudflare	Automatic SSL	$15/year
		TOTAL (estimated)	€400-700/month

Cost Optimization
Starting with Hetzner (EU datacenter) reduces infrastructure costs by 60-70% compared to AWS for equivalent specs. When US market launch requires HIPAA BAA, only the US-serving components migrate to AWS. This hybrid approach can save $30K-50K/year during the first 18 months.

9.2 Deployment Strategy
•	Containerization: Docker containers for all services. Multi-stage builds for minimal image size.
•	Orchestration: k3s (lightweight Kubernetes) for MVP on Hetzner. Migrate to EKS when moving to AWS.
•	CI/CD Pipeline: GitHub Actions: lint → test → build → security scan → deploy to staging → manual approval → deploy to production.
•	Environments: Development (local), Staging (1:1 replica of prod), Production. Feature branches auto-deploy preview environments.
•	Blue-Green Deploys: Zero-downtime deployments. New version deployed alongside old; traffic switches after health checks pass.
•	Database Migrations: Prisma (or TypeORM) migrations. All migrations must be backward-compatible (expand-contract pattern). No locking migrations on production tables.
•	Rollback: Automated rollback if health checks fail within 5 minutes of deployment. Manual rollback available at any time via CI/CD.

9.3 Backup & Disaster Recovery
Component	Backup Strategy	Recovery Target
PostgreSQL	Daily full backup + continuous WAL archiving. Cross-region replication.	RPO: 1 minute, RTO: 30 minutes
Redis	Periodic RDB snapshots. Non-critical: reconstructable from PostgreSQL.	RPO: 15 minutes, RTO: 5 minutes
File Storage (S3)	Cross-region replication. Versioning enabled.	RPO: 0 (realtime replication), RTO: instant
LiveKit Recordings	Stored in S3 with cross-region replication.	RPO: 0, RTO: instant
Application State	Stateless containers. Redeployable in minutes.	RPO: N/A, RTO: 5 minutes
Encryption Keys	AWS KMS with automatic key rotation. Backup keys in separate account.	RPO: 0, RTO: 15 minutes
 
10. Build vs. Buy Decisions
For each major component, the decision balances cost, time-to-market, control, and compliance requirements:
Component	Decision	Solution	Rationale	Migrate When
Video Conferencing	Buy → Build	LiveKit Cloud → self-hosted	Start with cloud for speed; self-host for cost/control at scale	Video cost &gt;$3K/mo
Payments	Buy	Stripe Connect	PCI compliance, multi-party payouts, international. Too complex to build.	Never (unless blocked)
AI Transcription	Buy	OpenAI Whisper API	Best accuracy for multilingual. Self-host when volume justifies GPU cost.	100+ concurrent sessions
AI Note Generation	Buy	OpenAI GPT-4o API	Fine-tune prompts for clinical formats. Monitor for dedicated model.	When proprietary model trained
Email	Buy	Resend / AWS SES	Deliverability is critical. Cost-effective.	Never
SMS	Buy	Twilio	Global reach, 2FA, reliability.	Never
Search	Build (simple)	Meilisearch (self-hosted)	Simple, fast, typo-tolerant. Migrate to ES for complex queries.	Complex search needs
Auth	Build + Buy	Custom + NextAuth/Passport	Need full control for consent-gated access. OAuth via library.	Never
EHR / Case Mgmt	Build	Custom (NestJS)	Core differentiator. No existing solution matches TZ requirements.	Never
Scheduling	Build	Custom (NestJS)	Deep integration with case, consent, timezone. Cal.com too limited.	Never
Chat / Messaging	Build	Custom + Socket.IO	Consent-aware, context-bound, SLA-tracked. No off-shelf solution fits.	Never
Insurance Claims	Buy + Build	Claim.MD / Change Healthcare API + custom workflow	API for EDI 837P/835. Custom workflow for UX/consent.	Phase 2 (US market)
Feature Flags	Buy	Unleash (self-hosted)	Open-source, GDPR-friendly, self-hosted.	Never
Monitoring	Buy (OSS)	Grafana + Prometheus + Sentry	Industry standard. Grafana Cloud free tier for start.	Never
 
11. Non-Functional Requirements
Requirement	Target (MVP)	Target (Scale)
API Response Time (p95)	&lt;200ms	&lt;100ms
Video Join Time	&lt;3 seconds	&lt;2 seconds
Video Latency (p95)	&lt;150ms	&lt;100ms
Chat Message Delivery	&lt;500ms	&lt;200ms
Search Response (Marketplace)	&lt;300ms	&lt;150ms
Concurrent Video Sessions	50	1,000+
Concurrent Users (Platform)	500	50,000+
Uptime SLA	99.5%	99.95%
Recovery Point Objective (RPO)	1 minute	0 (real-time replication)
Recovery Time Objective (RTO)	30 minutes	5 minutes
Database Size (Year 1)	50 GB	1 TB+
File Storage (Year 1)	500 GB	10 TB+
Max File Upload	100 MB	500 MB
Session Recording Storage	2 GB/hour (compressed)	Same (optimized codec)
Accessibility	WCAG 2.1 AA	WCAG 2.2 AAA (target)
Mobile App Size	&lt;50 MB	&lt;50 MB
Lighthouse Score	&gt;85 (all categories)	&gt;95 (all categories)
Test Coverage	&gt;70% (critical paths 100%)	&gt;85%
Security Scan	0 critical/high vulnerabilities	0 critical/high/medium
 
12. Development Environment & Team Structure
12.1 Monorepo Structure
mental-health-platform/
├── apps/
│   ├── web/              # Next.js web application
│   ├── mobile/           # React Native (Expo) app
│   └── api/              # NestJS backend
├── packages/
│   ├── shared-types/     # Zod schemas, TypeScript types, API contracts
│   ├── shared-utils/     # Pure functions (validation, MBC scoring, timezone)
│   ├── ui/               # Design System (React components, Tailwind)
│   └── config/           # Shared configs (ESLint, TSConfig, Prettier)
├── infrastructure/
│   ├── terraform/        # IaC definitions
│   ├── docker/           # Dockerfiles, compose for local dev
│   └── k8s/              # Kubernetes manifests
├── docs/                 # Architecture docs, API specs, runbooks
├── .github/workflows/    # CI/CD pipelines
└── turbo.json            # Turborepo config for build orchestration

12.2 Recommended Team Structure (8+ Engineers)
Squad	Size	Scope
Platform Core	3 engineers	Case Engine, Consent Engine, Auth, Scheduling, Payments, Audit. The ‘plumbing’ squad.
Experience	3 engineers	Session Workspace (LiveKit integration), Chat, Notifications, Grounding, Activity Hub. Client-facing real-time features.
Growth & AI	2 engineers	Marketplace, Matching, AI pipeline (transcription, notes), MBC, Analytics. Data-intensive features.
DevOps (shared)	0.5-1 engineer	Infrastructure, CI/CD, monitoring, security. Can be shared with Platform Core.
Design	1 designer	Design System, UX research, accessibility, user flows. Critical for therapy-specific UI.
QA	1 engineer	E2E testing, accessibility testing, security testing, compliance validation.

12.3 Local Development Setup
•	Docker Compose for local infrastructure: PostgreSQL, Redis, MinIO (S3), LiveKit dev server
•	Turborepo for monorepo build orchestration (parallel builds, caching)
•	pnpm for package management (faster, disk-efficient)
•	Prisma for database schema management and migrations
•	Storybook for Design System component development in isolation
•	Playwright for E2E tests, Vitest for unit/integration tests
•	Husky + lint-staged for pre-commit hooks (lint, format, type-check)
 
13. Monitoring & Observability
13.1 Observability Stack
Layer	Tool	What It Captures
Metrics	Prometheus + Grafana	API latency, error rates, video quality, concurrent sessions, queue depth, DB connections
Logs	Loki (Grafana)	Structured JSON logs from all services. Correlation IDs for request tracing.
Traces	OpenTelemetry + Tempo	Distributed traces across API → DB → Redis → LiveKit → AI calls
Errors	Sentry	Exception tracking with source maps, breadcrumbs, user context (anonymized)
Uptime	Grafana Synthetic Monitoring	Endpoint health checks from multiple regions every 60 seconds
Security	Falco + custom alerts	Unusual data access patterns, failed auth attempts, bulk exports

13.2 Critical Alerts
•	Video service degradation (join time &gt;5s or quality drops for &gt;10% of sessions)
•	API error rate &gt;1% (5xx responses)
•	Database replication lag &gt;10 seconds
•	Payment webhook processing delay &gt;5 minutes
•	Crisis protocol triggered (SOS button or high-risk language detected) — immediate alert to on-call
•	Audit anomaly: single user accessing &gt;50 case records in 1 hour
•	Certificate expiration &lt;14 days
•	Storage utilization &gt;80%
 
14. Technical Risk Register
Risk	Impact	Probability	Mitigation
LiveKit Cloud outage during sessions	Critical	Low	Graceful degradation to audio-only. Offline grounding tools. Session state persisted on client.
OpenAI API unavailable	Medium	Low	AI features degrade gracefully. Manual note-taking always available. Queue transcription for retry.
Data breach (HIPAA/GDPR)	Critical	Low	Defense in depth: encryption, RLS, audit, breach detection. Incident response plan. Cyber insurance.
Stripe Connect limitations for UA market	Medium	Medium	Research Ukrainian payment processors (LiqPay, Fondy) as alternative. Abstract payment interface.
Team scaling beyond 8	Medium	High	Modular monolith boundaries enable team splitting. Each squad owns clear modules.
Multi-region data sync complexity	High	Medium	Start single-region (EU). Add regions incrementally. Avoid cross-region joins.
Regulatory changes (HIPAA, GDPR)	Medium	Medium	Jurisdiction-configurable compliance rules. Legal advisory relationship. Monitor regulatory landscape.
LiveKit self-hosting complexity	Medium	Medium	Start with LiveKit Cloud. Document self-hosting runbook before migration. Gradual rollout.
 
15. Appendices
A. Technology Version Matrix
Technology	Version (MVP)	Upgrade Path
Node.js	22 LTS	Follow LTS releases
TypeScript	5.4+	Follow stable releases
Next.js	14.2+ (App Router)	15.x when stable
React	18.3+	19.x when stable in Next.js
React Native / Expo	Expo SDK 52+	Follow Expo releases
NestJS	10.x	Follow major releases
PostgreSQL	16.x	17.x (when available on hosting)
Redis	7.x (Valkey compatible)	Follow LTS
LiveKit Server	1.7+	Follow releases
Prisma	5.x	Follow releases
Docker	24+	Follow stable
Kubernetes	1.29+ (k3s)	Follow k3s releases

B. Glossary
Term	Definition
SFU	Selective Forwarding Unit — video architecture where server forwards streams without encoding, enabling low latency group calls
RLS	Row-Level Security — PostgreSQL feature that restricts which rows a user can access based on policies
MBC	Measurement-Based Care — systematic use of standardized outcome measures to track treatment progress
ABAC	Attribute-Based Access Control — access decisions based on attributes of user, resource, and environment
PHI	Protected Health Information — any health information that can identify an individual (HIPAA term)
BAA	Business Associate Agreement — HIPAA-required contract between covered entities and their vendors
EDI 837P	Electronic Data Interchange format for professional healthcare claims
ERA/835	Electronic Remittance Advice — electronic explanation of benefits from insurance payers
PEPM	Per-Employee-Per-Month — pricing model for employer-sponsored programs
WAL	Write-Ahead Log — PostgreSQL transaction log used for replication and point-in-time recovery

— End of Document —
