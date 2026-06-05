# Thughrah Auth, Developer Roles, and D1 Notes

This project keeps the public website on Cloudflare Pages and protects training areas through Cloudflare Pages Functions.

## Required environment variables

Set these in Cloudflare Pages project settings:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `DEVELOPER_EMAILS` as comma-separated authorized developer/admin emails

Do not hard-code developer emails or passwords in frontend JavaScript.

## Current protection model

- `/library` and `/professional-exams` are guarded by Pages Functions.
- `/developer` and `/dashboard` require a valid session and an email listed in `DEVELOPER_EMAILS`.
- API routes that change cases or content must call `requireDeveloperApi`.

## Developer dashboard status

The dashboard now contains:

- Flexible case add/edit form.
- Optional timeline, indicators, documents, references, training questions, and professional notes.
- Real preview using Thughrah dark visual language.
- Site content manager using stable keys such as `home.hero.title` and `social.telegram`.
- Local preview of inline edit mode.

The dashboard intentionally does not perform production saving until D1 or another database is bound.

## D1 tables prepared

See `cloudflare/d1/schema.sql` for:

- `cases`
- `case_sections`
- `case_timeline`
- `case_indicators`
- `case_documents`
- `case_references`
- `case_questions`
- `case_notes`
- `site_content`
- `audit_log`

## Recommended next implementation

1. Create Cloudflare D1 database.
2. Bind it to Pages Functions as `DB`.
3. Replace 501 responses in `functions/api/cases/*` and `functions/api/content/*` with real D1 reads/writes.
4. Add audit log entries for every create/update/delete/publish operation.
5. Gradually move public case content from static code into D1 while preserving existing content and slugs.
