# ResumeAI Database Security & RLS Audit Report

This report documents the security audit, Row-Level Security (RLS) policies, indirect relationship protection, and database quality verification for **ResumeAI**, built on **Supabase** and **PostgreSQL 15+**.

---

## 1. Executive Summary

- **Audited Tables**: 14 domain tables + 1 storage object catalog (`storage.objects`).
- **RLS Status**: Row-Level Security is **ENABLED** across **100%** of application tables and storage buckets.
- **Tenant Isolation**: Strictly enforced using `auth.uid()`. Cross-user data leaks are prevented across direct, indirect, and joined relational pathways.
- **System Template Protection**: Read-only access granted to authenticated/anonymous users; modification (INSERT/UPDATE/DELETE) is restricted to database administrators.

---

## 2. Table-by-Table RLS Policy Audit

### 2.1 `public.profiles`
- **RLS**: Enabled
- **Policies**:
  - `SELECT`: `auth.uid() = user_id`
  - `INSERT`: `auth.uid() = user_id`
  - `UPDATE`: `auth.uid() = user_id`
  - `DELETE`: `auth.uid() = user_id`
- **Integrity**: `user_id` references `auth.users(id) ON DELETE CASCADE`. Automated trigger `on_auth_user_created` creates default profile safely.

---

### 2.2 `public.resumes`
- **RLS**: Enabled
- **Policies**: Direct tenant isolation `auth.uid() = user_id` for SELECT, INSERT, UPDATE, DELETE.
- **FK**: `template_id` references `public.resume_templates(id) ON DELETE SET NULL`.

---

### 2.3 `public.resume_sections` & `public.resume_versions`
- **RLS**: Enabled
- **Indirect Access Prevention**:
  - `SELECT`, `UPDATE`, `DELETE`: Evaluates `EXISTS (SELECT 1 FROM public.resumes WHERE id = resume_id AND user_id = auth.uid())`.
  - `INSERT`: `WITH CHECK` verifies parent resume ownership.
- **Attack Vector Verified**: An attacker guessing a `resume_section_id` or `resume_version_id` receives `0` rows and is blocked from reading or mutating the section.

---

### 2.4 `public.resume_templates`
- **RLS**: Enabled
- **Policies**:
  - `SELECT`: `is_active = TRUE` (Public read for active templates).
  - `INSERT`, `UPDATE`, `DELETE`: Disallowed for standard users. Global system templates cannot be tampered with or corrupted.

---

### 2.5 `public.job_descriptions`
- **RLS**: Enabled
- **Policies**: Direct tenant isolation `auth.uid() = user_id` across all 4 CRUD verbs.

---

### 2.6 `public.ats_analyses`, `ats_keywords`, `ai_recommendations`
- **RLS**: Enabled
- **`ats_analyses`**: Direct check `auth.uid() = user_id`.
- **`ats_keywords` & `ai_recommendations`**:
  - Checked via parent analysis: `EXISTS (SELECT 1 FROM public.ats_analyses WHERE id = analysis_id AND user_id = auth.uid())`.
  - **Indirect Access Protection**: Guessing keyword or recommendation IDs yields 0 rows for unauthorized users.

---

### 2.7 `public.ai_resume_suggestions`
- **RLS**: Enabled
- **Policies**:
  - Direct check `auth.uid() = user_id`.
  - `INSERT` check verifies referenced `resume_id` belongs to `auth.uid()`.

---

### 2.8 `public.mock_interviews`, `interview_questions`, `interview_answers`
- **RLS**: Enabled
- **`mock_interviews`**: Direct check `auth.uid() = user_id`.
- **`interview_questions`**: Verified via parent `mock_interviews` ownership.
- **`interview_answers`**: Verified via two-tier join:
  `EXISTS (SELECT 1 FROM public.interview_questions q JOIN public.mock_interviews i ON i.id = q.interview_id WHERE q.id = question_id AND i.user_id = auth.uid())`.
- **Attack Vector Verified**: Guessing an `interview_answer.id` or `interview_question.id` fails RLS evaluation completely.

---

### 2.9 `public.subscriptions` & `public.user_usage`
- **RLS**: Enabled
- **Policies**: Direct check `auth.uid() = user_id` for SELECT, INSERT, UPDATE. Users cannot view or tamper with another subscriber's billing or quota record.

---

### 2.10 `storage.objects` (Supabase Storage)
- **RLS**: Enabled
- **Buckets Protected**: `profile-images`, `resume-files`, `interview-recordings`.
- **Policy**: `(storage.foldername(name))[1] = auth.uid()::text`.
- **File Type & Size Restrictions**:
  - `profile-images`: Max 5MB (PNG, JPEG, WEBP).
  - `resume-files`: Max 10MB (PDF, DOCX, DOC).
  - `interview-recordings`: Max 50MB (WebM, WAV, MP4, MP3).

---

## 3. Verification & Quality Matrix

| Security & Quality Metric | Status | Verification Detail |
| :--- | :--- | :--- |
| **Row Level Security** | **PASS** | RLS enabled on 100% of tables and storage objects. |
| **Direct Access Isolation** | **PASS** | Verified across `profiles`, `resumes`, `job_descriptions`, `mock_interviews`, `subscriptions`. |
| **Indirect Access Protection** | **PASS** | Verified for `resume_sections`, `ats_keywords`, `ai_recommendations`, `interview_answers`. ID-guessing attacks return 0 rows. |
| **Template Immutability** | **PASS** | Non-superusers cannot insert, update, or delete system `resume_templates`. |
| **Storage Security** | **PASS** | Path-based folder policy blocks cross-tenant file downloads/uploads. |
| **Foreign Keys & Cascades** | **PASS** | All foreign keys enforce `ON DELETE CASCADE` (or `ON DELETE SET NULL` for templates). |
| **Indexes & Performance** | **PASS** | Indexes exist for all FKs, `user_id` filtering, and GIN JSONB content querying. |
| **Audit View** | **PASS** | `vw_security_audit_summary` monitors database for orphaned child records. |
