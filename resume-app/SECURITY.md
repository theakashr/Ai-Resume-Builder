# ResumeAI Security & Architecture Audit Documentation

This document defines the definitive security posture, threat mitigation strategies, and architectural controls implemented across the **ResumeAI** SaaS backend.

---

## 1. Authentication & Session Management

- **Auth Provider**: Built on Supabase Auth (`auth.users`) leveraging encrypted JWT bearer tokens and HTTPS-only cookie sessions.
- **Session Verification**: Every protected API route enforces `requireUser()`, deriving identity strictly from the authenticated session context (`auth.uid()`).
- **Client Identity Non-Trust**: `user_id` is **never** accepted or trusted from client request bodies or query parameters.

---

## 2. Authorization & Multi-Tenant Isolation

- **Tenant Boundaries**: All database tables (`resumes`, `resume_sections`, `resume_versions`, `job_descriptions`, `ats_analyses`, `ai_resume_suggestions`, `mock_interviews`, `subscriptions`) contain `user_id` foreign keys referencing `auth.users(id)`.
- **Resource Ownership Helper**: Server-side verification functions (`verifyResumeOwnership`, `verifyResumeSectionOwnership`, `verifyResumeVersionOwnership`, `verifyJobDescriptionOwnership`, `verifyMockInterviewOwnership`, `verifySuggestionOwnership`, `verifyAnalysisOwnership`) enforce strict tenant ownership checks.
- **Safe 404 Error Responses**: Accessing, mutating, or deleting a resource belonging to another user returns a **404 Not Found** error (matching non-existent resource behavior) to prevent disclosing resource existence across tenants.

---

## 3. Database Row-Level Security (RLS)

- **100% Policy Coverage**: Row-Level Security (RLS) is enabled on 100% of public database tables and Supabase Storage buckets.
- **Policy Enforcement**:
  - `SELECT`: `USING (auth.uid() = user_id)`
  - `INSERT`: `WITH CHECK (auth.uid() = user_id)`
  - `UPDATE`: `USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)`
  - `DELETE`: `USING (auth.uid() = user_id)`

---

## 4. Secret Management & Key Isolation

- **Server-Only Execution**: API keys (`SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GEMINI_API_KEY`) are kept **exclusively** on the server.
- **Frontend Protection**: Secret credentials are never exposed in client bundles or public environment variables (`NEXT_PUBLIC_*`).

---

## 5. Centralized Rate Limiting

Per-user sliding-window rate limiting is enforced in [`rate-limiter.ts`](file:///d:/Documents/Resume/resume-app/src/lib/security/rate-limiter.ts) to prevent abuse:

| Endpoint Category | Sliding Window | Max Requests / Window | Breached Response |
| :--- | :--- | :--- | :--- |
| **Authentication** (`login`) | 60 Seconds | 5 Requests | `429 Too Many Requests` |
| **AI Assistant** (`ai`) | 60 Seconds | 10 Requests | `429 Too Many Requests` |
| **ATS Analysis** (`ats`) | 60 Seconds | 10 Requests | `429 Too Many Requests` |
| **Mock Interviews** (`interviews`) | 60 Seconds | 10 Requests | `429 Too Many Requests` |
| **File Uploads** (`uploads`) | 60 Seconds | 5 Requests | `429 Too Many Requests` |
| **Billing Endpoints** (`billing`) | 60 Seconds | 10 Requests | `429 Too Many Requests` |

---

## 6. AI Endpoint & Prompt Injection Security

- **Prompt Injection Defense**: All user inputs undergo input sanitization in [`prompts.ts`](file:///d:/Documents/Resume/resume-app/src/lib/ai/prompts.ts) to strip systemic override keywords (`ignore previous instructions`, `DAN mode`, `developer mode`).
- **Non-Hallucination Guardrails**: Prompts explicitly command the AI to **never** fabricate employment history, degrees, certifications, or achievements.
- **Input Length Limits**: Zod schema limits `current_content` to a maximum of 10,000 characters to prevent resource exhaustion attacks.

---

## 7. Secure File Storage & Uploads

- **Private Buckets**: Resume files are stored in private Supabase Storage buckets (`resume-files`).
- **Path Isolation**: Upload paths are isolated per tenant (`${user.id}/${uuid}.${ext}`).
- **Validation**: Strict validation of MIME types (`application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`), extension whitelist (`.pdf`, `.docx`), and maximum file size (10 MB).

---

## 8. Payment Webhook Security (Stripe)

- **Webhook Source of Truth**: All subscription plan upgrades, renewals, downgrades, and cancellations are driven exclusively by verified Stripe webhook events.
- **Signature Verification**: Every incoming webhook payload is verified using `stripe-signature` headers against `STRIPE_WEBHOOK_SECRET`. Unsigned or malformed webhooks are rejected with `400 Bad Request`.
- **Client Non-Trust**: Client applications cannot fake payment status or mutate subscription fields directly.

---

## 9. Safe Server-Side Logging & Error Masking

- **Sanitized Logging**: Safe logger in [`safe-logger.ts`](file:///d:/Documents/Resume/resume-app/src/lib/logging/safe-logger.ts) redacts sensitive keys (`password`, `token`, `secret`, `authorization`, `api_key`, `stripe_secret_key`, `credit_card`).
- **Internal Error Masking**: `handleApiError` catches unhandled exceptions, logs internal details silently server-side, and returns generic `500 Internal Error` responses to clients to prevent exposing database schemas or stack traces.
