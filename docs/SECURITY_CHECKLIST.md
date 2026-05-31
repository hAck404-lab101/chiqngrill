# Security Checklist

This checklist must be reviewed before deployment and before merging major features.

## Environment Variables

- Never commit `.env`, `.env.local`, or secret files.
- Add secret files to `.gitignore` before first commit.
- Keep API keys server-side only.
- Rotate any exposed keys immediately.
- Remove exposed secrets from Git history if they were pushed.

## Authentication & Authorization

When auth is added:

- Use secure auth provider or properly hashed passwords.
- Protect admin routes.
- Do not expose admin-only data to public users.
- Enforce role-based permissions server-side.

## Database Security

If Supabase is used:

- Enable RLS on every table.
- Create policies so users can only access authorized data.
- Do not rely only on frontend checks.

If PostgreSQL/MySQL API is used:

- Use parameterized queries.
- Do not concatenate raw user input into SQL.
- Validate request payloads before database writes.

## API Security

- Add rate limiting to important endpoints.
- Validate and sanitize all inputs.
- Use proper CORS allowlist for trusted domains.
- Do not expose stack traces or internal error details.
- Use server-side checks for prices and order totals.

## Payment Security

When Paystack is added:

- Verify payment on the server before marking order as paid.
- Never trust frontend payment success alone.
- Store transaction references.
- Validate amount and order ID server-side.

## Prompt Injection / AI Safety

If AI recommendations are added later:

- Treat user input as untrusted data.
- Do not place raw user text inside system prompts.
- Use delimiters around user content.
- Validate AI output before using it in business logic.

## Deployment Checks

Before production:

- Confirm no keys are in frontend code.
- Confirm `.env` files are ignored.
- Confirm rate limiting is active.
- Confirm admin pages are protected.
- Confirm custom error pages exist.
- Confirm rollback plan exists.
- Confirm logs and failure alerts are configured.
