AI-DRIVEN DEVELOPMENT PLAN v2.0
Therapeutic Practice Operating System
Spec-Driven Development + AI Factory + Multi-Agent Orchestration
API Contracts • ER-Diagrams • Wireframes • User Stories • SDD Workflow • AI Agent Routing
Version 2.0 | February 2026
Integrates: TZ v3.0 | MVP Scope | Technical Architecture | Competitive Analysis | SDD methodology (X5 Tech) | AI Factory (CutCode)

PART 1: SPEC-DRIVEN DEVELOPMENT (SDD) — METHODOLOGY FRAMEWORK
Vibe coding is effective for prototypes but dangerous for a HIPAA-compliant platform with 14 PostgreSQL schemas and Consent Engine as central middleware. Spec-Driven Development provides the missing control layer between AI generation speed and production reliability.
1.1 Core SDD Principle
Specification is the “artifact of intent” — it lives in the repo, is versioned like code, reviewed like a PR, and serves as stable context for both humans and AI agents.

Pipeline: Idea → Specification → Plan → Task Decomposition → Code → CI Checks → Spec-Diff Verification

Key rule: if behavior changed → specification MUST be updated. CI enforces this via spec-diff check.
1.2 SDD Artifact Structure per Epic
Every epic in the monorepo follows a strict SDD structure:

mental-health-platform/
├── docs/
│   ├── epics/
│   │   ├── E01-auth/
│   │   │   ├── specification.md    ← WHAT and WHY (Opus 4.6)
│   │   │   ├── non-goals.md        ← Negative prompt boundary
│   │   │   ├── plan.md             ← HOW: architecture decisions
│   │   │   ├── tasks.md            ← Decomposed user stories
│   │   │   └── acceptance.md       ← Testable acceptance criteria
│   │   ├── E02-consent/
│   │   ├── E03-case-engine/
│   │   └── ...
│   ├── architecture/
│   │   ├── ARCHITECTURE.md     ← System-level decisions (ADRs)
│   │   ├── er-diagrams/        ← Mermaid → SVG per schema
│   │   └── api-contracts/      ← OpenAPI 3.1 specs
├── .ai-factory/
│   ├── DESCRIPTION.md              ← Always-current project context
│   ├── patches/                    ← Self-learning from fixes
│   ├── features/                   ← Active feature plans
│   └── evolutions/                 ← Skill improvement logs
├── .claude/
│   ├── skills/                     ← Custom + skills.sh
│   └── settings.local.json         ← MCP servers config
└── .ai-factory.json                    ← AI Factory config
1.3 Non-Goals (Negative Prompts) — Critical for HIPAA
The non-goals.md file prevents AI agents from generating code outside the epic scope. This is especially critical because:
GPT-5.2 Codex sees full ТЗ v3 context with insurance billing, EAP, wearables — it WILL try to implement these
Sonnet 4.5 may add “helpful” features like AI therapy suggestions that violate our “AI assists documentation, not therapy” principle
Any agent may add data fields that break HIPAA minimum-necessary principle

Example non-goals.md for E3 (Case Engine):

# E3: Case Engine — NON-GOALS

DO NOT implement in this epic:
- Insurance billing fields (837P, ERA/835, superbill)
- EAP/B2B organization linking
- AI-generated case summaries or risk predictions
- Group/program case types (individual only)
- MBC assessment integration (PHQ-9, GAD-7)
- Cross-specialist case sharing without transfer flow
- Client self-service case creation
- Wearable data integration fields

DO NOT add database columns/tables for Phase 2+ features.
DO NOT log client names, emails, or PHI in application logs.
DO NOT create API endpoints not listed in specification.md.

1.4 SDD + AI Agent Responsibility Matrix
SDD Phase
Who Creates
Who Reviews
Who Enforces
Artifact
1. Specification
Opus 4.6 + Human
Human (approve)
Git version control
specification.md
2. Non-Goals
Opus 4.6 + Human
Human (approve)
CI spec-diff check
non-goals.md
3. Plan
Opus 4.6
Human (approve)
Git version control
plan.md
4. Task Decomposition
Opus 4.6
Human (approve)
AI Factory tracking
tasks.md
5. Implementation
Sonnet 4.5 / GPT-5.2
Sonnet 4.5 (code)
CI pipeline
Source code
6. Tests
Haiku 4.5
Sonnet 4.5 (review)
CI (Vitest/Playwright)
Test files
7. Security Review
Opus 4.6
Human (final)
OWASP ZAP + CI
Security report
8. Spec Update
Implementing agent
Opus 4.6 (verify)
CI spec-diff gate
Updated spec


PART 2: AI FACTORY — ORCHESTRATION LAYER
AI Factory (github.com/lee-to/ai-factory) serves as the operational shell for Claude Code sessions, providing project context management, structured workflows, and self-learning from accumulated patches.
2.1 AI Factory Setup for This Project

npm install -g ai-factory
cd mental-health-platform
ai-factory init

During initialization, AI Factory will scan the monorepo (package.json from Turborepo, apps/, packages/), detect the TypeScript + NestJS + Next.js + React Native stack, and auto-configure skills and MCP servers.
2.2 DESCRIPTION.md — Always-Current Project Context
This file replaces the need to re-explain the project in every Claude Code session. It contains:
Project vision: Therapeutic Practice Operating System for Ukrainian mental health specialists
Architecture: Modular Monolith (NestJS), PostgreSQL 16+ with 14 schemas, RLS, Consent Engine as central middleware
Tech stack: TypeScript full-stack, Next.js 14+, React Native (Expo), LiveKit, Stripe Connect, Redis, S3
Compliance: HIPAA architecture (even for UA MVP), GDPR, Ukrainian Law № 4223-IX
Current phase: MVP Phase 1, Sprint [N], active epic [E-X]
Key constraints: non-goals per current epic, security levels per schema

Token savings: ~2,000-4,000 input tokens per session saved by not re-explaining context. At $3/1M (Sonnet 4.5), this saves $50-100/month across ~500 sessions.
2.3 Custom Skills for This Project
Beyond skills.sh defaults, AI Factory generates project-specific skills:
Skill Name
Purpose
Source
Generator
Priority
consent-engine.md
Rules for Consent Engine integration: always check consent before data access
Custom
Opus 4.6
Critical
rls-policies.md
PostgreSQL RLS policy patterns for multi-tenant isolation
Custom
Opus 4.6
Critical
hipaa-checklist.md
PHI handling rules: encryption, audit, minimum-necessary, no-log PII
Custom
Opus 4.6
Critical
livekit-patterns.md
LiveKit room creation, token generation, data channels for grounding
Docs + Custom
Sonnet 4.5
High
stripe-connect.md
Stripe Connect marketplace payments, payouts, webhook handling
Docs + Custom
Sonnet 4.5
High
nestjs-module.md
NestJS module structure, DI patterns, guard/interceptor conventions
skills.sh
Auto
Medium
nextjs-app-router.md
Next.js 14 App Router patterns, RSC, SSG for marketplace
skills.sh
Auto
Medium
prisma-schema.md
Prisma schema conventions, migration patterns, RLS annotations
skills.sh + Custom
Sonnet 4.5
Medium
react-native-expo.md
Expo SDK 52+ patterns, offline-first, push notifications
skills.sh
Auto
Medium
testing-patterns.md
Vitest unit + Playwright E2E conventions, test data factories
Custom
Haiku 4.5
Medium
trauma-informed-ui.md
Trauma-informed design: calming colors, safe exit, grounding UX
Custom
Sonnet 4.5
High

2.4 AI Factory Commands Mapped to SDD Workflow
Command
SDD Phase
What It Does
When to Use
Agent
/ai-factory.feature
Spec → Plan → Tasks
Creates git branch + reads specification.md + generates implementation plan
Starting a new epic or large feature
Opus 4.6 (planning)
/ai-factory.task
Plan → Tasks
Quick task without branch, creates plan in .ai-factory/plan.md
Small stories within an epic
Sonnet 4.5
/ai-factory.implement
Tasks → Code
Executes plan step-by-step, reads all patches first
After plan is approved
Sonnet/GPT-5.2
/ai-factory.fix
Code → Patch
Fixes bug + creates self-learning patch document
Bug found during sprint
Sonnet 4.5
/ai-factory.evolve
Patch → Skills
Analyzes accumulated patches, improves skills
End of each sprint
Opus 4.6
/ai-factory.improve
Plan refinement
Refines existing plan without starting over
When plan needs adjustments
Sonnet 4.5
/ai-factory.skill-generator
Skills creation
Generates skill from docs URL (e.g., LiveKit docs)
Onboarding new technology
Sonnet 4.5

2.5 Self-Learning Cycle
AI Factory’s patch system creates a feedback loop that continuously improves code quality:

Cycle: /fix → bug analysis → fix applied → patch created → next /implement reads patches → better code → /evolve improves skills

Patch structure: Problem description, root cause, solution applied, prevention recommendations, search tags.

Example: if an agent forgets to add Consent Engine check on a new endpoint, the /fix creates a patch tagged [consent, middleware, security]. Next time /implement runs, it reads this patch and proactively adds consent checks.

HIPAA relevance: Patches for PHI handling mistakes, missing audit logging, or RLS policy gaps accumulate as “institutional memory” that prevents recurring compliance violations.

PART 3: UNIFIED DEVELOPMENT WORKFLOW
This section combines SDD methodology, AI Factory orchestration, and multi-agent routing into a single end-to-end workflow for each epic.
3.1 Epic Lifecycle (8 Phases)
#
Phase
Actions
Agent
Tool
Output
Time
P1
Specification
Write specification.md + non-goals.md from ТЗ v3 + MVP Scope
Opus 4.6
Claude API (Batch)
spec + non-goals
2-4h
P2
Human Review
Review spec, validate against business requirements, approve
Human
GitHub PR
Approved spec
1-2h
P3
Plan + Tasks
Create plan.md + tasks.md + acceptance.md based on approved spec
Opus 4.6
AI Factory /feature
Plan + tasks
2-3h
P4
Human Review
Review plan, validate architecture decisions, approve
Human
GitHub PR
Approved plan
1h
P5
Implementation
Execute tasks one-by-one: code + unit tests + docs
Sonnet 4.5 / GPT-5.2
AI Factory /implement
PRs per story
Days
P6
CI Validation
Automated: lint, tests, security scan, a11y, spec-diff
Haiku 4.5 + CI
GitHub Actions
Pass/Fail
5-10min
P7
Code Review
Sonnet 4.5 reviews GPT-5.2 code. Opus 4.6 reviews security-critical.
Sonnet/Opus
Claude API
Review notes
1-2h
P8
Sprint Retro
Analyze patches, evolve skills, update DESCRIPTION.md
Opus 4.6
AI Factory /evolve
Improved skills
1h

3.2 Story-Level Workflow (Within Phase P5)
Each user story follows this micro-workflow:

AI Factory reads: DESCRIPTION.md + specification.md + non-goals.md + all patches from .ai-factory/patches/
Agent selects task from tasks.md (or via /ai-factory.implement N)
Agent generates code in a feature branch, respecting non-goals boundaries
Agent writes unit tests (Haiku 4.5) and updates OpenAPI spec if API changed
Agent creates PR with conventional commit message
CI pipeline runs: ESLint → Vitest → Playwright → OWASP ZAP → axe-core → spec-diff check
If CI fails: /ai-factory.fix creates patch + applies fix + re-runs CI
Sonnet 4.5 reviews PR (or Opus 4.6 for security-critical stories)
Human spot-checks (consent flows, payment logic, crisis protocol)
Merge to main. Move to next story.
3.3 CI Pipeline with SDD Spec-Diff Gate
A new CI check ensures specification stays synchronized with code:
#
CI Step
What It Checks
Tool
Fail Action
Agent Fix
1
Lint + Format
ESLint rules, Prettier formatting, no console.log
ESLint, Prettier
Auto-fix by Haiku
Haiku 4.5
2
Type Check
TypeScript strict mode, no any types in core modules
tsc --noEmit
Block merge
Sonnet 4.5
3
Unit Tests
70%+ coverage on business logic, all critical paths
Vitest
Block merge
Haiku 4.5
4
Integration Tests
API endpoint happy path + error cases
Vitest + supertest
Block merge
Sonnet 4.5
5
E2E Tests
Critical user flows (booking → session → notes)
Playwright
Block merge
Haiku 4.5
6
Security Scan
0 critical/high vulnerabilities
OWASP ZAP
Block merge
Sonnet 4.5
7
Accessibility
WCAG 2.1 AA compliance on all new components
axe-core
Block merge
Haiku 4.5
8
Dependency Audit
No known vulnerabilities in npm packages
npm audit
Warn/Block
Haiku 4.5
9
Spec-Diff Gate [NEW]
If API endpoints changed → specification.md MUST be updated in same PR
Custom script
Block merge
Implementing agent
10
Non-Goals Check [NEW]
Verify no code references Phase 2+ features listed in non-goals.md
Custom grep + LLM
Block merge
Opus 4.6 review
11
Consent Check [NEW]
Every new data-access endpoint includes Consent Engine middleware
Custom AST check
Block merge
Sonnet 4.5

Steps 9-11 are SDD-specific additions that prevent specification drift, scope creep, and consent violations.

PART 4: UPDATED AI AGENT ROUTING (WITH SDD + AI FACTORY)
4.1 Updated Model Pricing & Roles
Agent
Model
$/1M In
$/1M Out
SDD Role
AI Factory Command
Architect
Opus 4.6
$5.00
$25.00
P1: Spec + P3: Plan + P7: Security Review + P8: Evolve
/feature, /evolve
Lead Dev
Sonnet 4.5
$3.00
$15.00
P5: Complex code + P7: Code Review
/implement, /fix
Bulk Dev
GPT-5.2 Codex
$1.75
$14.00
P5: CRUD, migrations, boilerplate
API (not AI Factory)
Junior Dev
Haiku 4.5
$1.00
$5.00
P5: Tests, i18n, docs + P6: CI fixes
/task, /fix
QA Agent
Haiku + Mini
$0.25-1
$2-5
P6: E2E tests, security scans
/task
Design
Sonnet 4.5
$3.00
$15.00
P5: UI components, wireframes
/task, /feature

4.2 Updated Monthly Cost Projection
Agent Role
Model
Min $
Max $
SDD Overhead
Net After Savings
Architect (Spec+Plan)
Opus 4.6
$180
$300
+$30 (specs)
$150-250 (batch)
Lead Developer
Sonnet 4.5
$800
$1,500
+$0 (reads specs)
$700-1,300 (cache)
Bulk Developer
GPT-5.2 Codex
$400
$800
+$0
$400-800
Junior Developer
Haiku 4.5
$200
$400
+$0
$150-350 (cache)
QA & E2E
Haiku + Mini
$100
$200
+$0
$80-180 (batch)
Design System
Sonnet 4.5
$200
$400
+$0
$180-360 (cache)
AI Factory context savings
All






-$50 to -$100/mo
Prompt caching
Anthropic






-$300 to -$600/mo
Batch API
Anthropic






-$200 to -$400/mo
Patch self-learning savings
All






-$100 to -$200/mo (fewer reworks)
TOTAL (monthly)


$1,200
$2,400


$1,200-2,400
TOTAL (9 months)


$10,800
$21,600


vs. $180K-270K traditional

Cost reduction vs traditional team: 88-94%. SDD adds ~$30/month in Opus spec generation but saves ~$200-400/month through fewer reworks and better context.

PART 5: EXAMPLE SDD ARTIFACTS — E3: CASE ENGINE
Complete example of SDD artifacts for one epic, demonstrating how specification.md, non-goals.md, plan.md, and tasks.md work together.
5.1 specification.md

# E3: Case Engine — Specification

## 1. Context
The Case Engine is the central clinical entity. A Case represents
the therapeutic relationship between one specialist and one client.
All clinical data (notes, goals, files, assessments) belongs to a Case.

## 2. Goals
1) Specialist creates a Case, linking to an existing or new client.
2) Case has lifecycle: Draft → Active → Paused → Archived → Closed.
3) All data access is gated by Consent Engine (E2).
4) Case supports treatment goals (SMART format).
5) Files can be uploaded and linked to a Case (S3 storage).
6) Cases can be transferred between specialists with audit trail.
7) Client can request full data export (GDPR right to portability).

## 3. Acceptance Criteria
- Specialist creates Case with client linked → status=Draft.
- After first session, status auto-transitions to Active.
- Paused after 30 days inactivity (configurable).
- RLS policies prevent cross-specialist data leakage.
- Consent check on every Case data access endpoint.
- Audit log entry for every create/read/update/delete.
- Data export generates ZIP (JSON + PDF + files) via async job.
5.2 non-goals.md
# E3: Case Engine — NON-GOALS

DO NOT implement:
- Insurance billing fields or claims workflow (Phase 2)
- EAP/B2B organization linking (Phase 3)
- AI-generated case summaries or risk predictions (Phase 2)
- Group/program case types — individual only (Phase 2)
- MBC assessment integration — PHQ-9, GAD-7 (Phase 2)
- Cross-specialist case sharing without formal transfer (never)
- Client self-service case creation (specialist creates)
- Wearable data integration fields (Phase 4)
- Async therapy messaging-only cases (Phase 2)

DO NOT add columns for: insurance_claim_id, eap_contract_id,
  ai_summary, group_id, assessment_scores, wearable_data.
DO NOT log client PII (name, email, phone) in application logs.
5.3 plan.md
# E3: Case Engine — Implementation Plan

## Architecture Decisions
- Schema: case_mgmt (PostgreSQL)
- Tables: cases, case_notes, case_goals, case_history, case_transfers
- RLS: specialist sees only own cases; client sees own cases
- All endpoints pass through ConsentGuard middleware
- File uploads: S3 with pre-signed URLs, max 25MB
- Case transfer: 14-day parallel access, then full handoff
- Data export: BullMQ async job, result in ZIP via email link

## Tech Stack (this epic)
- NestJS CaseModule with CaseService, CaseController
- Prisma models + migration for case_mgmt schema
- Zod validation schemas in packages/shared-types
- ConsentGuard from E2 (dependency)
- BullMQ for async export jobs
5.4 tasks.md (Story Decomposition)
#
Story
SP
Agent
Sprint
Depends
AI Factory Cmd
3.1
Prisma schema: cases, case_goals, case_history, case_transfers
3
GPT-5.2
S2
E1,E2
/task
3.2
RLS policies for case_mgmt schema
5
Sonnet 4.5
S2
3.1
/task
3.3
POST /cases — create case with ConsentGuard
5
Sonnet 4.5
S2
3.1,3.2
/implement 3.3
3.4
GET /cases, GET /cases/:id with consent check
3
GPT-5.2
S3
3.3
/implement 3.4
3.5
PATCH /cases/:id — update + lifecycle transitions
3
GPT-5.2
S3
3.3
/implement 3.5
3.6
CRUD for case goals (SMART format)
3
GPT-5.2
S3
3.3
/task
3.7
File upload to case (S3 + pre-signed URLs)
5
Sonnet 4.5
S3
3.3
/implement 3.7
3.8
Case transfer flow (14-day parallel + handoff)
5
Sonnet 4.5
S4
3.3,E2
/feature
3.9
Data export (BullMQ async → ZIP → email)
5
Sonnet 4.5
S4
3.3,3.7
/feature
3.10
Case search & filtering
2
GPT-5.2
S3
3.3
/task
3.11
Risk flags (manual set by specialist)
3
Sonnet 4.5
S4
3.3
/task
3.12
Unit + integration tests for all endpoints
5
Haiku 4.5
S2-S4
3.3-3.11
/task


TOTAL
47


S2-S4






PART 6: SPRINT 0 — PROJECT BOOTSTRAP (1 Week)
Sprint 0 sets up the entire development infrastructure, SDD artifacts, and AI Factory before any feature code is written.
6.1 Day-by-Day Sprint 0 Plan
Day
Task
Agent
Tool
Cost
Output
D1 AM
Bootstrap Turborepo monorepo (apps/web, apps/api, apps/mobile, packages/*)
GPT-5.2
Claude Code
$5-10
Working monorepo
D1 PM
ai-factory init + create DESCRIPTION.md + configure MCP servers
Sonnet 4.5
AI Factory
$3-5
.ai-factory/ setup
D2 AM
Generate custom skills: consent-engine, rls-policies, hipaa-checklist, trauma-ui
Opus 4.6
AI Factory /skill-generator
$10-15
12 skill files
D2 PM
Docker Compose: PostgreSQL, Redis, MinIO, LiveKit dev server
Haiku 4.5
Claude Code
$2-3
docker-compose.yml
D3 AM
Generate SDD artifacts for E1 (Auth): specification.md, non-goals, plan, tasks
Opus 4.6
Batch API
$8-12
E1 SDD complete
D3 PM
Generate SDD artifacts for E2 (Consent), E3 (Case Engine)
Opus 4.6
Batch API
$15-20
E2, E3 SDD complete
D4 AM
Generate OpenAPI 3.1 spec for all ~95 endpoints
Opus 4.6
Batch API
$10-15
openapi.yaml
D4 PM
Generate Mermaid ER diagrams for all 14 schemas
Opus 4.6
Batch API
$8-12
14 .mermaid files
D5 AM
Generate Prisma schema (all tables) from ER diagrams
Sonnet 4.5
Claude Code
$5-8
schema.prisma
D5 PM
CI/CD pipeline: GitHub Actions with 11-step validation (incl. spec-diff)
Haiku 4.5
Claude Code
$3-5
.github/workflows/
D5 EVE
Design System foundation: Tailwind config, base components, Storybook
Sonnet 4.5
Claude Code
$5-8
packages/ui/


SPRINT 0 TOTAL




$74-113
Ready for S1

6.2 Sprint 0 Exit Criteria
Monorepo builds and runs locally (pnpm dev starts all apps)
Docker Compose starts all infrastructure services
AI Factory initialized with DESCRIPTION.md + 12 custom skills
SDD artifacts complete for E1, E2, E3 (specification, non-goals, plan, tasks)
OpenAPI 3.1 spec covers all ~95 MVP endpoints
ER diagrams (Mermaid) generated for all 14 PostgreSQL schemas
Prisma schema file with all tables (migration pending actual data)
CI pipeline with 11 validation steps including spec-diff gate
Design System foundation with Tailwind config + 5 base components
Human has reviewed and approved all SDD specifications

PART 7: QUALITY GATES & DEFINITION OF DONE (UPDATED)
7.1 Story-Level DoD (SDD-Enhanced)
Original DoD from MVP Scope + new SDD/AI Factory requirements:
Criterion
Source
Enforced By
Agent
Code reviewed by higher-capability model
Original DoD
PR approval
Sonnet/Opus
Unit tests: 70%+ coverage on business logic
Original DoD
CI (Vitest)
Haiku 4.5
Integration test for API endpoint (happy + error)
Original DoD
CI (Vitest)
Haiku 4.5
WCAG 2.1 AA compliance verified
Original DoD
CI (axe-core)
Haiku 4.5
i18n: all strings use i18n keys (EN + UK)
Original DoD
CI (custom check)
Haiku 4.5
Consent Engine integration verified
Original DoD
CI (AST check)
Sonnet 4.5
Audit log entry for data access/modification
Original DoD
CI (custom check)
Sonnet 4.5
OpenAPI spec updated if API changed
Original DoD
CI (spec-diff)
Implementing agent
specification.md updated if behavior changed [SDD]
SDD
CI (spec-diff gate)
Implementing agent
non-goals.md verified: no Phase 2+ code [SDD]
SDD
CI (non-goals check)
Opus 4.6 review
AI Factory patch created if bug was fixed [AF]
AI Factory
Manual + /fix
Sonnet 4.5
No PHI in application logs [HIPAA]
HIPAA
CI (grep + custom)
Haiku 4.5
Conventional commit message format [AF]
AI Factory
Git hook (Husky)
All agents

[SDD] = Spec-Driven Development requirement. [AF] = AI Factory requirement. [HIPAA] = Compliance requirement.
7.2 Epic-Level DoD (SDD-Enhanced)
All user stories from tasks.md accepted
specification.md is up-to-date and matches implemented behavior
E2E tests (Playwright) cover all acceptance criteria from acceptance.md
p95 response time <200ms for critical endpoints
Load tested for 50 concurrent users
Security scan: 0 critical/high vulnerabilities
All accumulated patches from /fix reviewed and skills evolved via /evolve [NEW]
non-goals.md violations: 0 [NEW]
7.3 Sprint-Level Retro with AI Factory
At the end of each sprint (every 2 weeks):
Run /ai-factory.evolve to analyze all patches from the sprint
Opus 4.6 reviews evolved skills, human approves changes
Update DESCRIPTION.md with current project state (active epic, completed features)
Generate SDD artifacts for next sprint’s epics (pipeline ahead of implementation)
Update cost tracking: actual token spend vs. projection
Human reviews any security patches and validates HIPAA compliance

PART 8: RISK MITIGATION FOR AI-DRIVEN + SDD APPROACH
Risk
Impact
Prob.
SDD Mitigation
AI Factory Mitigation
Agent generates code outside epic scope
High
High
non-goals.md + CI non-goals check blocks merge
DESCRIPTION.md provides focused context; skills limit scope
RLS policy gap (data leakage between specialists)
Critical
Med
specification.md requires explicit RLS per endpoint
rls-policies.md skill + patches accumulate RLS patterns
Consent Engine bypass on new endpoint
Critical
Med
acceptance.md requires consent verification test per endpoint
consent-engine.md skill + CI AST check on ConsentGuard
PHI logged in application logs
Critical
Med
non-goals.md explicitly forbids PII logging
hipaa-checklist.md skill + CI grep check
Specification drift (code diverges from spec)
High
High
CI spec-diff gate blocks PR if spec not updated
N/A (SDD handles this)
GPT-5.2 generates lower quality code
Med
Med
plan.md defines architecture; acceptance.md defines tests
Sonnet 4.5 reviews all GPT-5.2 PRs before merge
AI Factory skills contain prompt injection
High
Low
N/A
v1.3 security scan: 10 threat categories, 2-level check
Recurring bugs in same area
Med
Med
Updated acceptance.md adds regression criteria
/fix creates patches; /evolve improves skills systemically
Token costs exceed budget
Med
Low
Batch API for non-urgent specs (P1, P3)
Context caching via DESCRIPTION.md saves 2-4K tokens/session
Single model provider outage
Med
Low
Plan allows GPT-5.2 fallback for non-critical tasks
AI Factory works with Claude Code; manual API fallback for GPT


PART 9: EXECUTIVE SUMMARY
Three Pillars of the Approach

1. Spec-Driven Development (SDD): Every epic starts with specification.md + non-goals.md. Specifications are version-controlled, reviewed like code, and enforced by CI. This prevents AI agents from generating code outside scope, missing consent checks, or drifting from architecture.

2. AI Factory Orchestration: DESCRIPTION.md provides always-current project context. Structured commands (/feature, /implement, /fix, /evolve) replace ad-hoc prompting. Self-learning patches create institutional memory that prevents recurring mistakes, especially critical for HIPAA compliance.

3. Multi-Agent Routing: Six AI agents with different cost/quality profiles. Opus 4.6 for architecture and specs ($5/$25). Sonnet 4.5 for core implementation ($3/$15). GPT-5.2 for bulk CRUD ($1.75/$14). Haiku 4.5 for tests and docs ($1/$5). Higher models review lower models’ outputs.
Key Numbers
Metric
Value
Monthly AI cost
$1,200–$2,400
9-month MVP cost (AI only)
$10,800–$21,600
Traditional 8-person team cost
$180,000–$270,000
Cost reduction
88–94%
Sprint 0 setup cost
$74–$113
Total API endpoints
~95
Total user stories
~120 across 20 epics
Total story points
~400 SP
CI pipeline steps
11 (including 3 SDD-specific gates)
Custom AI Factory skills
12 project-specific
SDD artifacts per epic
5 (spec, non-goals, plan, tasks, acceptance)
PostgreSQL schemas
14 with RLS policies

What Changed from v1.0 to v2.0
[NEW] SDD Framework: specification.md + non-goals.md + plan.md + tasks.md + acceptance.md per epic. Formal artifact of intent that prevents scope creep and specification drift.
[NEW] AI Factory Integration: DESCRIPTION.md as persistent context, /feature + /implement + /fix + /evolve workflow, self-learning patches, custom skills for HIPAA/consent/RLS.
[NEW] CI Spec-Diff Gate: Blocks merge if API changed but specification not updated. Prevents silent architecture drift.
[NEW] CI Non-Goals Check: Blocks merge if code references Phase 2+ features listed in non-goals.md. Prevents AI scope creep.
[NEW] CI Consent Check: AST-level check that every data-access endpoint includes ConsentGuard middleware.
[NEW] Sprint Retro with /evolve: Systematic skill improvement from accumulated patches at end of each sprint.
[UPDATED] Cost projection: Reduced from $1,350–$2,550 to $1,200–$2,400/month due to context caching savings from AI Factory and fewer reworks from SDD.
[UPDATED] Sprint 0 plan: Detailed day-by-day execution plan with specific costs per task.