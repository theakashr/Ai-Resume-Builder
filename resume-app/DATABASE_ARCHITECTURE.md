# ResumeAI Database Architecture Specification

This document defines the production PostgreSQL database architecture, design standards, and schema roadmap for **ResumeAI**, built on **Supabase** and **PostgreSQL 15+**.

---

## 1. Core Database Technology & Principles

- **Database Engine**: PostgreSQL 15+ hosted on Supabase.
- **Authentication Integration**: Integrated with `auth.users` via foreign keys and automated trigger synchronization.
- **Security Standard**: Row-Level Security (RLS) enabled on all public tables and storage buckets to enforce tenant isolation based on `auth.uid()`.
- **Modularity**: Multi-phase version-controlled migrations stored under `supabase/migrations/`.

---

## 2. Architecture Standards & Strategies

### 2.1 Naming Conventions
- **Tables**: Use `snake_case` in plural form (e.g., `profiles`, `resumes`, `subscriptions`).
- **Columns**: Use `snake_case` in singular form (e.g., `user_id`, `stripe_customer_id`).
- **Primary Keys**: Always named `id` or `user_id` of type `UUID`.
- **Foreign Keys**: Named as `<singular_target_table_name>_id` (e.g., `resume_id`, `question_id`).
- **Indexes**: Named as `idx_<table_name>_<column(s)>` (e.g., `idx_subscriptions_user_id`).

### 2.2 UUID Strategy
- Primary keys for application domain entities utilize v4 UUIDs linked directly to `auth.users(id)` or generated via `gen_random_uuid()` / `uuid_generate_v4()`.

### 2.3 Timestamp Strategy
- Standard audit columns:
  - `created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
  - `updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()`
- Automated maintenance: Every table with `updated_at` uses a `BEFORE UPDATE` trigger attached to the shared database trigger function `update_updated_at_column()`.

---

## 3. Implemented Modules

### 3.1 `public.profiles` Table (Phase 2)
Stores user profile information synced with `auth.users`.

### 3.2 `public.resumes` Table (Phase 3 & 4)
Stores user resumes linked to `auth.users` and optional `resume_templates`.

### 3.3 `public.resume_sections` Table (Phase 3)
Stores modular resume sections with ordered index and JSONB content.

### 3.4 `public.resume_versions` Table (Phase 3)
Stores historical JSON snapshots of a resume.

### 3.5 `public.resume_templates` Table (Phase 4)
Stores global reusable template definitions.

### 3.6 `public.job_descriptions` Table (Phase 5)
Stores target job postings saved by users.

### 3.7 `public.ats_analyses`, `ats_keywords`, `ai_recommendations` (Phase 6)
Stores ATS match evaluations, extracted keywords, and scoring recommendations.

### 3.8 `public.ai_resume_suggestions` Table (Phase 7)
Stores AI-generated content rewrites and suggestions for resume sections.

### 3.9 `public.mock_interviews`, `interview_questions`, `interview_answers` (Phase 8)
Stores practice interview sessions, questions, candidate answers, and multi-dimensional scoring.

### 3.10 `public.subscriptions` & `public.user_usage` (Phase 9)
Stores Stripe subscription status and monthly usage quota metrics.

### 3.11 `storage.buckets` Configuration (Phase 10)
Defines private Supabase Storage buckets (`profile-images`, `resume-files`, `interview-recordings`).

### 3.12 Security Hardening & RLS Audit (Phase 11)
Comprehensive multi-tenant security verification, indirect access protection, and audit views.

---

## 4. Migration Roadmap

| Phase | Module | Status | Migration File |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Foundation | Completed | `20260801000001_database_foundation.sql` |
| **Phase 2** | User Profiles | Completed | `20260801000002_user_profiles.sql` |
| **Phase 3** | AI Resume Builder | Completed | `20260801000003_resume_builder.sql` |
| **Phase 4** | Resume Templates | Completed | `20260801000004_resume_templates.sql` |
| **Phase 5** | Job Descriptions | Completed | `20260801000005_job_descriptions.sql` |
| **Phase 6** | ATS Analysis | Completed | `20260801000006_ats_analysis.sql` |
| **Phase 7** | AI Resume Assistant | Completed | `20260801000007_ai_assistant.sql` |
| **Phase 8** | Mock Interviews | Completed | `20260801000008_mock_interviews.sql` |
| **Phase 9** | Subscriptions | Completed | `20260801000009_subscriptions.sql` |
| **Phase 10** | Storage | Completed | `20260801000010_storage.sql` |
| **Phase 11** | Security & RLS Audit | Completed | `20260801000011_security_hardening.sql` |
| **Phase 12** | Database Testing | Upcoming | `20260801000012_testing.sql` |
