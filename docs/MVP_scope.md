MVP SCOPE DOCUMENT
Phase 1: Core Platform for Individual Practice
6-9 Months | 8+ Engineers | Ukraine MVP Launch
Version 1.0  |  February 2026
Based on TZ v3.0, Competitive Analysis & Technical Architecture Document

Table of Contents


Update after opening in Word (right-click → Update Field).

1. MVP Vision & Success Criteria
1.1 MVP Vision Statement
Deliver a production-ready platform that enables Ukrainian mental health specialists (psychologists, psychotherapists, coaches) to manage their individual practice entirely online: from client intake through video sessions to structured clinical notes — replacing the fragmented stack of Zoom + Google Docs + spreadsheets with a single, secure, HIPAA-ready system.

1.2 MVP Target User
Primary: Independent Ukrainian mental health specialists (psychologists, psychotherapists, coaches) with 5-30 active clients, currently using fragmented tools (Zoom, Telegram, Google Docs, manual scheduling).
Secondary: Their clients — Ukrainian-speaking adults seeking individual therapy/coaching online.

1.3 Success Criteria (Exit MVP)
Metric
Target
How Measured
Specialists onboarded
50+ active
Completed setup wizard + conducted ≥1 session
Sessions conducted
500+ total
Completed video sessions (not cancelled/no-show)
Retention (specialist)
>70% monthly
Active in current month / active in previous month
Time-to-first-session
<48 hours
Registration → first completed session
Session success rate
>95%
Sessions completed without critical technical issues
NPS (specialist)
>40
Monthly NPS survey
Specialist setup time
<30 minutes
Registration → ready to accept clients
Note completion rate
>80%
Notes completed within 24h of session


1.4 What MVP Is NOT
Not a marketplace with search/discovery (specialists invite their own clients in MVP)
Not a group therapy platform (groups/programs are Phase 2)
Not an insurance billing platform (US market feature, Phase 2)
Not an AI therapy tool (AI assists documentation only, behind consent)
Not a B2B/EAP platform (Phase 3)

2. Epic Overview & Dependencies
2.1 Epic Map
#
Epic
Priority
Squad
Sprint
Dependencies
E1
Identity & Access (Auth)
MUST
Core
S1-S2
—
E2
Consent Engine
MUST
Core
S1-S3
E1
E3
Case Engine
MUST
Core
S2-S4
E1, E2
E4
Scheduling & Calendar
MUST
Core
S3-S5
E1, E3
E5
Session Workspace (Video)
MUST
Experience
S2-S6
E1, E3, E4
E6
Messaging Hub (Chat)
MUST
Experience
S3-S5
E1, E2
E7
Clinical Notes & Templates
MUST
Core
S4-S6
E3, E5
E8
Payments & Billing
MUST
Core
S4-S7
E1, E3, E4
E9
Notification Engine
MUST
Experience
S3-S5
E1
E10
Crisis Protocol
MUST
Experience
S4-S6
E1, E3
E11
Specialist Onboarding
MUST
Experience
S5-S7
E1, E3, E4, E8
E12
Client Onboarding
MUST
Experience
S5-S7
E1, E3, E4
E13
Intake Forms
SHOULD
Core
S6-S8
E3, E2
E14
Basic Marketplace (Profiles)
SHOULD
Growth
S6-S8
E1, E3
E15
AI Transcription (Basic)
SHOULD
Growth
S7-S9
E5, E2
E16
Design System
MUST
Experience
S1-S3
—
E17
i18n Architecture (EN+UK)
MUST
Core
S1-S2
—
E18
Audit & Versioning
MUST
Core
S2-S4
E1, E2
E19
Mobile App (Client)
SHOULD
Experience
S6-S9
E5, E6, E9
E20
Analytics (Specialist)
COULD
Growth
S8-S9
E3, E5, E8


2.2 Sprint Timeline (2-week sprints)
MVP spans 18 sprints (9 months). The first 3 months focus on core infrastructure; months 4-6 on feature completion; months 7-9 on polish, testing, and launch preparation.
Sprint
Period
Focus
S1-S2
Month 1
Foundation: Auth, Consent Engine, Design System, i18n architecture, database schemas, CI/CD pipeline, dev environment
S3-S4
Month 2
Core workflows: Case Engine, Scheduling, Notifications, Chat (basic), Audit logging. LiveKit integration starts.
S5-S6
Month 3
Session Workspace: video sessions (1:1), pre/post session flows, clinical notes, grounding module. Payments integration.
S7-S8
Month 4
Feature completion: onboarding wizards (specialist + client), intake forms, basic marketplace profiles, AI transcription (basic).
S9-S10
Month 5
Mobile app (client): React Native build, offline grounding, push notifications. Specialist mobile (calendar + quick notes).
S11-S12
Month 6
Integration testing, E2E tests, security audit, accessibility audit. Bug fixing. Performance optimization.
S13-S14
Month 7
Beta launch with 10-15 early adopter specialists. Feedback collection. Critical bug fixes. UX refinements.
S15-S16
Month 8
Beta iteration: address top 10 feedback items. Analytics dashboard. Load testing. Documentation.
S17-S18
Month 9
Public launch preparation. Marketing site. Onboarding optimization. Monitoring & alerting. Launch!


Critical Path
E1 (Auth) → E3 (Case) → E5 (Session) → E7 (Notes) is the critical path. Any delay in Auth or Case Engine cascades to all downstream features. Prioritize these epics in the first 2 months with the strongest engineers.


3. Detailed Epic Specifications
E1: Identity & Access
Priority: MUST  |  Squad: Core  |  Sprint: S1-S2  |  Estimate: 3-4 weeks
User Story
Acceptance Criteria
As a specialist, I can register with email/password and set up my profile
Email verification, password strength validation (min 10 chars), profile fields (name, specialization, languages). JWT issued on success.
As a user, I can log in via email/password or OAuth (Google, Apple)
OAuth callback handles account linking. Session created with access + refresh tokens. Failed login attempts rate-limited (5/15min).
As a user, I can enable 2FA (TOTP)
QR code setup flow. Backup codes generated. 2FA required on new device/browser.
As a user, I can reset my password securely
Time-limited reset link (1 hour). Old sessions invalidated on password change.
As a user, I can manage my active sessions
List active sessions (device, IP, last active). Revoke individual or all sessions.
As a mobile user, I can use biometric authentication
FaceID/TouchID/PIN as secondary auth. Biometric lock on app open (configurable).


Technical Notes: Passport.js strategies for email + OAuth. bcrypt for password hashing. JWT with RS256. Refresh token rotation (one-time use). Session table in auth schema. Rate limiting via Redis.

E2: Consent Engine
Priority: MUST  |  Squad: Core  |  Sprint: S1-S3  |  Estimate: 3-4 weeks
User Story
Acceptance Criteria
As a client, I can view and manage all my active consents in Privacy Center
List of all consents with granular control: AI processing, recording, data sharing with supervisor, wearable data. Each consent shows when granted and can be revoked.
As a specialist, I cannot access AI features without client consent for that specific case
AI panel is disabled/hidden until client grants AI consent for the case. Consent is per-case, not global.
As a client, I can grant/revoke consent at any time and changes take effect immediately
Revocation creates new consent record (append-only). All downstream services check consent before data access. Real-time propagation via event bus.
As an admin, I can audit all consent changes
Full history: who, what, when, from what state to what state. Exportable for compliance audits.


E3: Case Engine
Priority: MUST  |  Squad: Core  |  Sprint: S2-S4  |  Estimate: 4-5 weeks
User Story
Acceptance Criteria
As a specialist, I can create a new Case for a client
Case created with status=draft. Fields: client info (or invite), presenting concern, goals (optional at creation). Case ID generated.
As a specialist, I can view all my active Cases with key info at a glance
Dashboard: list of Cases with client name, status, last session date, next session, risk level indicator. Sortable/filterable.
As a specialist, I can record goals for a Case using SMART format
Goal form: description, measurable target, timeline, status (not started/in progress/achieved). Goals visible in pre-session brief.
As a specialist, I can write session notes linked to a Case
Rich text editor with structured templates (free-form for MVP; SOAP/DAP in E7). Auto-save. Version history.
As a client, I can view my Case info (goals, upcoming sessions, homework)
Client view shows: goals, scheduled sessions, assigned homework, progress notes (specialist controls visibility).
Case automatically transitions: Draft → Active after first session
Status update triggered by session completion event. Paused after 30 days inactivity (configurable). Notifications on status changes.
As a client, I can request data export of my entire Case
ZIP export: JSON data + PDF summary + attached files. Generated async (BullMQ job), download link via email.
As a specialist, I can transfer a Case to another specialist
Transfer flow: select target specialist → Consent Engine checks permissions → 14-day parallel access → full handoff. Audit logged.


E4: Scheduling & Calendar
Priority: MUST  |  Squad: Core  |  Sprint: S3-S5  |  Estimate: 4-5 weeks
User Story
Acceptance Criteria
As a specialist, I can set my availability (weekly recurring slots)
Calendar UI: click to create time blocks. Support recurring (weekly) and one-off slots. Buffer time between sessions (10-15 min, configurable).
As a specialist, I can sync with Google Calendar (two-way)
OAuth to Google Calendar. Import: busy times block platform slots. Export: platform sessions appear in Google Cal. Conflict auto-resolution.
As a client, I can see available slots and book a session
Slot picker shows available times in client’s timezone. Select → confirm → payment (if applicable) → confirmation email + push.
As a specialist, I can set up recurring sessions with a client
Create recurring series (weekly/biweekly). Client confirms series with one click. Individual sessions can be rescheduled without affecting series.
As a client, I can cancel/reschedule within the cancellation policy
Cancellation rules per specialist (24/48/72h). Free cancel before cutoff. Late cancel = fee. Reschedule shows available alternatives.
Timezone handling works correctly across borders
All times stored UTC. Displayed in user’s timezone. Both timezones shown at booking. DST transitions handled for recurring slots.


E5: Session Workspace (Video)
Priority: MUST  |  Squad: Experience  |  Sprint: S2-S6  |  Estimate: 6-8 weeks (largest epic)
User Story
Acceptance Criteria
As a participant, I can join a video session with one click
Click ‘Join’ → LiveKit room token generated → video/audio connected in <3 seconds. Camera/mic auto-selected (last used device remembered).
As a client, I wait in a waiting room until the specialist admits me
Client enters waiting room 5 min before session. Pre-session diagnostics run (camera, mic, speed test). Specialist sees waiting client and admits.
As a specialist, I can see the pre-session brief while waiting for client
Brief panel: client name, last session notes (summary), active goals, homework status, recent check-in score, risk flags.
As a participant, my connection auto-recovers from network issues
Auto-reconnect up to 30 sec. Other participant sees ‘reconnecting’ message. Auto-fallback to audio if video quality drops. Background audio on mobile.
As a specialist, I can trigger a Grounding exercise during session
Grounding button → select exercise (breathing, sensory protocol) → overlay appears on client’s screen without leaving video. Controllable (start/stop/customize).
As a specialist, I can share my screen
Screen share via LiveKit. Client sees shared screen alongside video. Specialist can annotate (drawing tools).
Connection quality indicator visible to both participants
Real-time indicator (green/yellow/red). Yellow: suggest disabling video. Red: auto-fallback to audio. Recommendations shown.
Post-session: structured note template opens automatically
After session ends, note editor opens with template. Pre-filled with session metadata (date, duration, type). Timer: reminder if not completed in 30 min.
Post-session: next session booking in one click
Suggest next slot based on recurring pattern or availability. One-click confirm. Client gets confirmation notification.


LiveKit Integration Scope
MVP uses LiveKit for: 1:1 video rooms, waiting room (participant metadata states), screen sharing, data channels (grounding commands), connection quality API. Server-side recording is Phase 2 (requires explicit consent flow and additional storage infrastructure).


E6: Messaging Hub (Chat)
Priority: MUST  |  Squad: Experience  |  Sprint: S3-S5  |  Estimate: 3-4 weeks
User Story
Acceptance Criteria
As a participant, I can send/receive text messages in a Case chat
Real-time delivery via Socket.IO. Persistent storage in PostgreSQL. End-to-end encrypted display. Unread count badge.
As a participant, I can share files in chat
Upload files (images, PDFs, docs) up to 25 MB. S3 storage with pre-signed URLs. Thumbnail preview for images.
As a specialist, I can see typing indicators and read receipts
Typing: ephemeral event via Socket.IO. Read: persisted timestamp. Both shown in UI.
As a specialist, I can pin important messages
Pin message → appears at top of chat. Visible to all participants. Unpin available.
Chat works within video session as well
In-session chat panel alongside video. Same backend, different UI context. Links/files shared in session chat.


E7: Clinical Notes & Templates
Priority: MUST  |  Squad: Core  |  Sprint: S4-S6  |  Estimate: 3-4 weeks
User Story
Acceptance Criteria
As a specialist, I can create notes using structured templates (SOAP, DAP, BIRP, GIRP)
Template picker before note creation. Each template has structured sections with field labels and hints. Free-text fields within structure.
As a specialist, I can create custom note templates
Template builder: add/remove/reorder sections. Name template. Set as default for new Cases. Share with organization (if applicable).
As a specialist, my notes auto-save and have version history
Auto-save every 30 seconds. Full version history with diff view. Restore previous version with one click.
As a specialist, I can mark risk indicators in notes
Risk flag toggle (low/moderate/high/crisis) on each note. High/crisis triggers notification pipeline and updates Case risk_level.
Notes are linked to specific sessions and Cases
Each note belongs to a Case and optionally to a Session. Timeline view shows sessions + notes chronologically.


E8: Payments & Billing
Priority: MUST  |  Squad: Core  |  Sprint: S4-S7  |  Estimate: 5-6 weeks
User Story
Acceptance Criteria
As a specialist, I can connect my Stripe account for payouts
Stripe Connect onboarding flow. KYC verification. Bank account linked. Dashboard shows pending/completed payouts.
As a specialist, I can set my session prices
Price per session type (individual 60min, 90min). Support UAH, USD, EUR. Display in client’s currency.
As a client, I can pay for a session at booking time
Stripe Checkout: card payment. Receipt via email. Refund policy shown before payment.
As a client, I can purchase a session package (5/10/20)
Package pricing with discount. Sessions deducted from balance on booking. Balance visible in client dashboard.
As a specialist, I receive automatic weekly payouts
Stripe Connect payouts every Thursday. Transaction detail: session, date, amount, platform fee, net amount. Monthly summary.
Cancellation policy applies automatically
Late cancel: fee charged per specialist policy. No-show: full charge. Refund processing within 5-7 business days.
Platform commission is transparent
Commission rate visible to specialist during setup. Per-transaction breakdown in payout report. Degressive rate structure shown.


MVP Payment Scope: Pay-per-session + packages. Stripe Connect for UA/EU/US. Subscription billing, insurance claims, and EAP invoicing are Phase 2+.

E9: Notification Engine
Priority: MUST  |  Squad: Experience  |  Sprint: S3-S5  |  Estimate: 3 weeks
User Story
Acceptance Criteria
As a user, I receive session reminders via email and push
Configurable: 24h email, 1h push, 5min push. Specialist can adjust per-Case. Templates localized (EN/UK).
As a specialist, I have Quiet Hours where only critical notifications come through
Default 21:00-08:00 (configurable). During quiet hours: suppress non-critical push/email. Critical (crisis, no-show) still delivered.
As a user, I can manage notification preferences
Settings page: per-channel (email/push/in-app), per-type (sessions, payments, chat, system). Frequency cap: max 3 push/hour.
DND during active session
Auto-suppress all non-critical notifications during active video session for both participants.


E10: Crisis Protocol
Priority: MUST  |  Squad: Experience  |  Sprint: S4-S6  |  Estimate: 2-3 weeks
User Story
Acceptance Criteria
As a client, I can access crisis resources at any time via SOS button
Persistent SOS button in navigation. One tap → localized crisis hotline number + calling instructions. Based on client’s country/language.
As a client, I have access to my Safety Plan offline
Safety Plan template (Stanley-Brown model). Filled by specialist + client. Cached locally in mobile app for offline access.
As a specialist, I can mark a Case as high-risk
Risk level toggle: low/moderate/high/crisis. High/crisis triggers: check-in reminder schedule (24/48/72h), alert to org admin (if applicable), audit log entry.
Crisis resources are localized per country
Database of crisis hotlines per country. Multilingual. Updated regularly. Fallback to international resources if country not in DB.


E11: Specialist Onboarding
Priority: MUST  |  Squad: Experience  |  Sprint: S5-S7  |  Estimate: 3 weeks
User Story
Acceptance Criteria
As a new specialist, I complete a step-by-step setup wizard
Steps: Profile (name, photo, bio) → Specialization (methods, topics, languages) → Schedule (set availability) → Payments (connect Stripe) → Invite client. Progress bar. Can skip and return.
As a new specialist, I can do a test call before my first real session
Sandbox mode: test video/audio with a simulated client. Camera/mic check, screen share test, grounding test. Completion marks ‘tech-ready’ checklist item.
As a specialist, I see progressive disclosure of features
After first 3 sessions, unlock visibility of: note templates, analytics preview, AI panel (if available). Tooltip hints for new features.
As a specialist, I have a readiness checklist
Checklist: ✓ Profile complete, ✓ Availability set, ✓ Payment connected, ✓ Test call done, ✓ First client invited. Progress visible on dashboard.


E12: Client Onboarding
Priority: MUST  |  Squad: Experience  |  Sprint: S5-S7  |  Estimate: 2-3 weeks
User Story
Acceptance Criteria
As a new client, I can register in 3-4 steps
Name → Email → Consent → Verify email. Minimal friction. Warm welcome screen after verification.
As a client invited by specialist, I land directly on our Case
Deep link from invitation email → register (if new) → land on Case page with upcoming session visible.
As a client, I get contextual tooltips on first use of each feature
First time entering Session Workspace: tooltip tour (video, chat, grounding, materials). Dismissable. Can re-enable in settings.
As a client, I do a pre-session tech check before my first session
Automated: camera test, mic test, internet speed test. Clear pass/fail with resolution suggestions for each.


E13: Intake Forms (SHOULD)
Priority: SHOULD  |  Squad: Core  |  Sprint: S6-S8  |  Estimate: 3-4 weeks
Digital intake forms with e-signatures replace paper forms and PDFs. Specialists can create custom forms with conditional logic. Forms are linked to Cases and stored with consent.
Form builder: drag-and-drop fields (text, select, checkbox, date, signature, file upload)
Conditional logic: show/hide fields based on previous answers
E-signature: drawn or typed, with timestamp and IP. Legally binding format.
Pre-session form: automatically sent to client before first session
Form responses linked to Case and visible in pre-session brief

E14: Basic Marketplace (SHOULD)
Priority: SHOULD  |  Squad: Growth  |  Sprint: S6-S8  |  Estimate: 3-4 weeks
MVP marketplace is a public specialist directory — not a full matching engine. Specialists can have a public profile page that clients can find and book from directly.
Public specialist profile: name, photo, bio, specializations, methods, languages, prices, available slots
SEO-optimized profile pages (Next.js SSG) for organic discovery
Search and filter: by specialization, language, price range, availability
Direct booking from profile page (uses E4 Scheduling)
Verification badge for specialists who completed KYC

E15: AI Transcription - Basic (SHOULD)
Priority: SHOULD  |  Squad: Growth  |  Sprint: S7-S9  |  Estimate: 3-4 weeks
Basic AI transcription transforms session audio into text, saving specialists 30-60 minutes of documentation time per session. This is the entry point for the AI Add-on revenue stream.
Consent required: dual consent (specialist + client) per session before AI processing
Transcription: session audio → OpenAI Whisper API → timestamped text. Supports EN and UK.
Summary: GPT-4o generates session summary from transcript. Presented as draft for specialist review.
AI results are clearly marked as “AI-generated draft” — specialist must review and approve before saving to Case
Audio is deleted after transcription (configurable: keep/delete). Transcript stored encrypted.

E19: Mobile App - Client (COULD for full version)
Priority: SHOULD for basic / COULD for full  |  Squad: Experience  |  Sprint: S6-S9
React Native (Expo) client app. MVP mobile focuses on: session joining (video), chat, push notifications, grounding tools (offline), crisis SOS. Full CRM-like features remain web-only.

E20: Analytics Dashboard - Specialist (COULD)
Priority: COULD  |  Squad: Growth  |  Sprint: S8-S9
Basic analytics for specialists: sessions per period, revenue, no-show rate, client retention. Helps specialists manage their practice and prevent burnout (slot utilization indicator).

4. MoSCoW Priority Matrix
4.1 Feature-Level Priorities
Feature
Priority
Phase
Notes
User registration & auth (email + OAuth)
MUST
MVP
Foundation for everything
2FA / biometric
MUST
MVP
Health data = mandatory security
Consent Engine (granular, revocable)
MUST
MVP
Legal requirement
Case management (CRUD, lifecycle)
MUST
MVP
Core value proposition
Scheduling (availability, booking, recurring)
MUST
MVP
Core value proposition
Video sessions (1:1 via LiveKit)
MUST
MVP
Core value proposition
Waiting room + pre-session diagnostics
MUST
MVP
Professional experience
Grounding module (in-session)
MUST
MVP
Key differentiator
Chat (case-bound, real-time)
MUST
MVP
Essential communication
Clinical note templates (SOAP, DAP, BIRP, GIRP)
MUST
MVP
Professional requirement
Payments (pay-per-session + packages, Stripe)
MUST
MVP
Revenue enablement
Notifications (email + push + in-app)
MUST
MVP
Engagement driver
Crisis protocol (SOS, safety plan, hotlines)
MUST
MVP
Safety requirement
Specialist onboarding wizard
MUST
MVP
Activation driver
Client onboarding (minimal + invite flow)
MUST
MVP
Activation driver
Design System (WCAG 2.1 AA)
MUST
MVP
Consistency + accessibility
i18n architecture (EN + UK)
MUST
MVP
Multi-market foundation
Audit logging
MUST
MVP
Compliance requirement
Intake forms with e-signatures
SHOULD
MVP
Paperless intake
Basic marketplace (specialist profiles)
SHOULD
MVP
Growth channel
AI transcription + summary (basic)
SHOULD
MVP
Time-saving, revenue stream
Mobile app client (basic: video, chat, crisis)
SHOULD
MVP
Accessibility
Screen sharing + whiteboard
SHOULD
MVP
Enhanced sessions
Google Calendar sync (2-way)
SHOULD
MVP
Convenience
Session packages (5/10/20)
SHOULD
MVP
Revenue optimization
Analytics dashboard (specialist)
COULD
MVP
Practice management
Specialist mobile app
COULD
MVP
Convenience
Homework assignment + tracking
COULD
MVP
Between-session engagement
Custom note templates
COULD
MVP
Flexibility
Waitlist for popular specialists
COULD
MVP
Growth
Trial session (15 min)
COULD
MVP
Conversion
Session recording
WON'T (MVP)
Phase 2
Consent + storage complexity
Insurance billing (837P/835)
WON'T (MVP)
Phase 2
US market only
MBC / outcome tracking
WON'T (MVP)
Phase 2
Complex, needs clinical input
Async therapy (messaging-only)
WON'T (MVP)
Phase 2
Separate business model
Group therapy / programs
WON'T (MVP)
Phase 2
Program Engine complexity
B2B / EAP module
WON'T (MVP)
Phase 3
Enterprise sales cycle
AI clinical note generation
WON'T (MVP)
Phase 2
Needs transcription first
Wearable integration
WON'T (MVP)
Phase 4
Nice-to-have
Between-session tools (CBT, DBT)
WON'T (MVP)
Phase 2
Content development needed
E-prescribing
WON'T (MVP)
Phase 4
Regulatory complexity
White-label / API licensing
WON'T (MVP)
Phase 3
Scale feature


5. Definition of Done
5.1 Story-Level DoD
Code reviewed and approved by at least one other engineer
Unit tests written for business logic (minimum 70% coverage on critical paths)
Integration test for API endpoints (happy path + error cases)
Accessibility: WCAG 2.1 AA compliance verified (axe-core in CI)
i18n: All strings use i18n keys (no hardcoded text). EN + UK translations present.
Mobile-responsive: tested on 375px (iPhone SE) and 768px (iPad)
Error states: loading, empty, error, offline handled gracefully
Consent: any data access checks consent status (Consent Engine integration verified)
Audit: data access/modification logged to audit trail
Documentation: API endpoint documented in OpenAPI spec, README updated if applicable
Security: no secrets in code, input validation present, SQL injection prevention verified

5.2 Epic-Level DoD
All user stories accepted by product owner
E2E tests (Playwright) cover main user flows
Performance: p95 response time <200ms for critical endpoints
Load tested for 50 concurrent users (MVP target)
Security scan (OWASP ZAP or similar): 0 critical/high vulnerabilities
Deployed to staging and verified by QA
Release notes written

5.3 Launch-Level DoD
All MUST epics completed and accepted
At least 3 SHOULD epics completed (recommended: E13, E14, E15)
Beta tested with 10-15 specialists for 4+ weeks
Top 10 beta feedback items addressed
Security audit completed (external if budget allows, internal minimum)
HIPAA architecture verified (even for UA launch — prepares for US)
Monitoring and alerting operational (Grafana dashboards, Sentry, uptime checks)
Incident response runbook documented
Privacy policy and terms of service published (EN + UK)
Marketing landing page live with specialist registration flow

6. Technical Debt & Known Shortcuts
MVP will necessarily take some shortcuts. These are intentional and documented for future resolution:
Shortcut (MVP)
Impact
Resolution (Post-MVP)
Meilisearch instead of Elasticsearch
Limited search capabilities for marketplace
Migrate to ES when >1000 specialist profiles
No session recording in MVP
Specialists cannot review sessions
Phase 2: LiveKit Egress + S3 + consent flow
AI transcription post-session only (not real-time)
No live subtitles/transcription during session
Phase 2: streaming Whisper integration
Single-region deployment (EU)
US latency higher for early US users
Phase 2: add US region for insurance billing
Manual specialist verification (not automated KYC)
Slower specialist onboarding at scale
Phase 2: automated document verification API
No group video sessions
Groups/programs not supported
Phase 2: LiveKit multi-participant rooms
Basic matching (filter only, no AI)
No smart specialist recommendations
Phase 2: ML matching based on outcomes
No insurance billing
Cannot serve US insured clients
Phase 2: Change Healthcare / Claim.MD integration
No MBC / outcome tracking
No standardized progress measurement
Phase 2: PHQ-9, GAD-7 with auto-scoring
No async therapy
Missing messaging-only subscription model
Phase 2: SLA tracking, specialist workload management


7. Launch Strategy
7.1 Launch Phases
Alpha (Month 7): Internal testing. Team members use the platform as both specialists and clients. Focus: critical bug discovery, flow validation.
Closed Beta (Month 7-8): Invite 10-15 Ukrainian specialists from the existing user pool. Weekly feedback sessions. Focus: real-world workflow validation, UX refinement.
Open Beta (Month 8-9): Open registration for Ukrainian specialists. Cap at 50 to maintain support quality. Focus: scalability validation, onboarding optimization.
Public Launch (Month 9): Marketing push in Ukrainian market. SEO-optimized specialist profiles go live. Referral program activated. Support: in-app chat + email, response time <4 hours.

7.2 Beta Success Criteria
10+ specialists complete onboarding and conduct 3+ sessions each
Video session success rate >90% (no critical technical failures)
Specialist NPS >30 (beta forgiveness factor)
Mean time from registration to first session <72 hours (beta)
No critical security vulnerabilities found
Consent flows work correctly for all scenarios

7.3 Post-MVP Roadmap Preview
Phase
Key Features
Phase 2 (3-6 mo)
Insurance billing (US market), AI clinical notes (SOAP/DAP generation), MBC (PHQ-9/GAD-7), Program/Group Engine, Async therapy, Session recording, Mobile app full version, Matching AI, Between-session tools
Phase 3 (3-6 mo)
B2B/EAP module, Credentialing, White-label API, Interstate Compact integration, Data Residency (US/CA/AU), Peer consultation, CE credit tracking, Additional languages
Phase 4 (ongoing)
AI Insights (cross-session patterns), Wearable integration, E-prescribing, Peer support communities, Alter-ego app, Outcome-based pricing infrastructure, Cohort courses with drip content