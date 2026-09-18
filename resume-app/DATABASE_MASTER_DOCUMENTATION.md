# ResumeAI Database Master Technical Documentation

This is the definitive production documentation for the **ResumeAI** PostgreSQL database architecture built on **Supabase** and **PostgreSQL 15+**. The database layer is fully verified, production-ready, and hardened for future backend API integration.

---

## 1. Executive Summary & Architecture Overview

- **Database Engine**: PostgreSQL 15+ hosted on Supabase.
- **Authentication System**: Supabase Auth (`auth.users`) with automated trigger synchronization to `public.profiles`.
- **Security Standard**: Row-Level Security (RLS) enabled across 100% of tables and storage objects (`auth.uid()` tenant isolation).
- **Migration System**: 12 modular, version-controlled SQL migration scripts under `supabase/migrations/`.
- **Backend Readiness**: Complete schema coverage for Resumes, Templates, Job Descriptions, ATS Analysis, AI Assistant, Mock Interviews, Subscriptions, and Supabase Storage.

---

## 2. Complete Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    auth_users ||--o| profiles : "has profile (1:1)"
    auth_users ||--o{ resumes : "owns (1:N)"
    auth_users ||--o{ job_descriptions : "saves (1:N)"
    auth_users ||--o{ mock_interviews : "takes (1:N)"
    auth_users ||--o{ ai_resume_suggestions : "requests (1:N)"
    auth_users ||--o{ subscriptions : "maintains (1:N)"
    auth_users ||--o| user_usage : "tracks quota (1:1)"
    auth_users ||--o{ storage_objects : "stores files (1:N)"

    resume_templates ||--o{ resumes : "styles (1:N)"
    resumes ||--o{ resume_sections : "contains (1:N)"
    resumes ||--o{ resume_versions : "tracks (1:N)"
    resumes ||--o{ ats_analyses : "evaluated by (1:N)"
    job_descriptions ||--o{ ats_analyses : "targeted by (1:N)"

    ats_analyses ||--o{ ats_keywords : "extracts (1:N)"
    ats_analyses ||--o{ ai_recommendations : "generates (1:N)"

    mock_interviews ||--o{ interview_questions : "includes (1:N)"
    interview_questions ||--o| interview_answers : "answered by (1:1)"

    profiles {
        uuid user_id PK_FK
        string full_name
        string email
        string professional_title
        string target_role
        string experience_level
    }

    resumes {
        uuid id PK
        uuid user_id FK
        uuid template_id FK
        string title
        string status
        int ats_score
        int completion_percentage
    }

    resume_sections {
        uuid id PK
        uuid resume_id FK
        string section_type
        int section_order
        jsonb content
    }

    resume_templates {
        uuid id PK
        string name
        string slug
        string template_type
        boolean is_ats_friendly
        boolean is_active
    }

    job_descriptions {
        uuid id PK
        uuid user_id FK
        string title
        string company
        text description
    }

    ats_analyses {
        uuid id PK
        uuid user_id FK
        uuid resume_id FK
        uuid job_description_id FK
        int overall_score
        int keyword_score
        int skills_score
        int formatting_score
        int experience_score
    }

    ats_keywords {
        uuid id PK
        uuid analysis_id FK
        string keyword
        string keyword_type
        string importance
        boolean is_matched
    }

    ai_recommendations {
        uuid id PK
        uuid analysis_id FK
        string category
        string title
        string priority
        boolean is_resolved
    }

    ai_resume_suggestions {
        uuid id PK
        uuid user_id FK
        uuid resume_id FK
        uuid resume_section_id FK
        string action_type
        text original_content
        text suggested_content
        string status
    }

    mock_interviews {
        uuid id PK
        uuid user_id FK
        string target_role
        string interview_type
        string difficulty
        string status
        int overall_score
    }

    interview_questions {
        uuid id PK
        uuid interview_id FK
        text question
        int question_order
        string category
    }

    interview_answers {
        uuid id PK
        uuid question_id FK_UNIQUE
        text answer_text
        string audio_url
        int technical_score
        int communication_score
        int confidence_score
        int relevance_score
        int overall_score
        jsonb ai_feedback
    }

    subscriptions {
        uuid id PK
        uuid user_id FK
        string plan_id
        string status
        timestamp current_period_end
    }

    user_usage {
        uuid id PK
        uuid user_id FK_UNIQUE
        int ats_scans_count
        int ai_generations_count
        int mock_interviews_count
    }
```

---

## 3. Database Schema & Tables Inventory

### 3.1 Core User & Foundation Tables
1. **`public.profiles`**: Mapped 1:1 with `auth.users(id)`. Auto-populated via `on_auth_user_created` trigger.
2. **`public.subscriptions`**: Stores user subscription plan (`free`, `pro`, `enterprise`), Stripe IDs, and billing status.
3. **`public.user_usage`**: Monthly quota tracking (`ats_scans_count`, `ai_generations_count`, `mock_interviews_count`).

### 3.2 Resume Builder Module
4. **`public.resumes`**: Master resume entity with status (`draft`, `completed`, `archived`) and scores.
5. **`public.resume_sections`**: Ordered resume sections with structured JSONB schemas (`summary`, `experience`, `education`, `skills`, `projects`, `certifications`, `achievements`).
6. **`public.resume_versions`**: Version snapshot catalog for resume restoration.
7. **`public.resume_templates`**: Global template catalog seeded with `minimal`, `modern`, `professional`, and `ats_friendly` designs.

### 3.3 Job Descriptions & ATS Module
8. **`public.job_descriptions`**: Target job postings saved by users.
9. **`public.ats_analyses`**: ATS match evaluation linking resume and job description with 5 score metrics (0..100).
10. **`public.ats_keywords`**: Matched, missing, and recommended keywords with importance ratings (`low`, `medium`, `high`).
11. **`public.ai_recommendations`**: Actionable ATS feedback items with resolution status (`is_resolved`).

### 3.4 AI Assistant & Mock Interviews Module
12. **`public.ai_resume_suggestions`**: AI bullet rewrites and skill suggestions with status (`generated`, `accepted`, `rejected`).
13. **`public.mock_interviews`**: Practice interview sessions (`technical`, `behavioral`, `hr`) with difficulty (`easy`, `medium`, `hard`) and status (`setup`, `in_progress`, `completed`, `cancelled`).
14. **`public.interview_questions`**: Questions generated per mock interview.
15. **`public.interview_answers`**: Candidate answers with multi-dimensional scoring (`technical`, `communication`, `confidence`, `relevance`, `overall`) and JSON feedback.

---

## 4. Supabase Storage Configuration

| Bucket ID | Access | File Limit | Permitted MIME Types | Path Convention |
| :--- | :--- | :--- | :--- | :--- |
| **`profile-images`** | Private | 5 MB | PNG, JPEG, WEBP | `<user_id>/avatar.<ext>` |
| **`resume-files`** | Private | 10 MB | PDF, DOCX, DOC | `<user_id>/<resume_id>/<file_name>` |
| **`interview-recordings`** | Private | 50 MB | WebM, WAV, MP4, MP3 | `<user_id>/<interview_id>/<recording_id>.<ext>` |

---

## 5. Security & Row-Level Security (RLS) Matrix

- **RLS Status**: Enabled on 100% of tables and storage objects.
- **Tenant Isolation**:
  - Direct tables: `auth.uid() = user_id`.
  - Child tables (`resume_sections`, `resume_versions`, `ats_keywords`, `ai_recommendations`, `interview_questions`): Parent ownership verification via `EXISTS`.
  - Two-level child tables (`interview_answers`): Verified via joined relationship to parent interview.
  - Storage objects: Path check `(storage.foldername(name))[1] = auth.uid()::text`.
- **System Protection**: `resume_templates` read-only for public/authenticated users; mutations prohibited.

---

## 6. Version-Controlled Migration Manifest

| Migration File | Description |
| :--- | :--- |
| [20260801000001_database_foundation.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000001_database_foundation.sql) | Extensions (`uuid-ossp`, `pgcrypto`) & `update_updated_at_column()` trigger. |
| [20260801000002_user_profiles.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000002_user_profiles.sql) | `profiles` table, experience ENUM constraints, and `auth.users` sync trigger. |
| [20260801000003_resume_builder.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000003_resume_builder.sql) | `resumes`, `resume_sections`, `resume_versions`, JSONB indexes, and RLS. |
| [20260801000004_resume_templates.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000004_resume_templates.sql) | `resume_templates` catalog, FK constraints, seed templates, and read-only RLS. |
| [20260801000005_job_descriptions.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000005_job_descriptions.sql) | `job_descriptions` table, indexes, updated_at trigger, and RLS. |
| [20260801000006_ats_analysis.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000006_ats_analysis.sql) | `ats_analyses`, `ats_keywords`, `ai_recommendations`, score checks, and RLS. |
| [20260801000007_ai_assistant.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000007_ai_assistant.sql) | `ai_resume_suggestions` table, action types, status triggers, and RLS. |
| [20260801000008_mock_interviews.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000008_mock_interviews.sql) | `mock_interviews`, `interview_questions`, `interview_answers`, multi-scores, and RLS. |
| [20260801000009_subscriptions.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000009_subscriptions.sql) | `subscriptions` and `user_usage` tables, plan constraints, and RLS. |
| [20260801000010_storage.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000010_storage.sql) | Supabase Storage buckets registration and path-based storage RLS policies. |
| [20260801000011_security_hardening.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000011_security_hardening.sql) | Global RLS audit, public grant revocation, and health audit views. |
| [20260801000012_testing.sql](file:///d:/Documents/Resume/resume-app/supabase/migrations/20260801000012_testing.sql) | `fn_validate_database_health()` verification function suite. |

---

## 7. End-to-End Test Suite Verification Results

The database was validated by executing a complete simulated end-to-end user lifecycle test in `supabase/tests/12_test_end_to_end_journey.sql`:

1. **User Registration & Profile Trigger**: `auth.users` insert automatically provisioned `public.profiles` row.
2. **Resume & Section Creation**: Resume created and linked to `ats-friendly` seed template. Structured JSONB sections inserted and updated cleanly.
3. **Resume Versioning**: Resume version snapshot 1 created and retrieved.
4. **Job Description & ATS Analysis**: Job description created. ATS analysis run with 5 sub-scores (0..100). Matched/missing keywords and recommendations recorded.
5. **AI Suggestion & Acceptance**: Experience rewrite suggestion generated and marked `accepted`.
6. **Mock Interview Lifecycle**: Technical hard interview created, 2 questions added, candidate answers scored across 4 dimensions, and session marked `completed`.
7. **Subscription & Quota**: Pro subscription created and user usage counters initialized.
8. **Cascade Cleanups**: Deleting a master resume cleanly cascaded and purged child `resume_sections`, `resume_versions`, `ats_analyses`, `ats_keywords`, and `ai_resume_suggestions` with **0 orphaned records remaining**.
9. **Health Check Function**: `fn_validate_database_health()` returned `PASS` across all 15 tables, foreign keys, seed data, and storage buckets.

---

## 8. Readiness Confirmation

> [!IMPORTANT]
> The database architecture is **100% complete, fully verified, secure, and production-ready**. You may now safely proceed to the next phase: **BACKEND API DEVELOPMENT**.
