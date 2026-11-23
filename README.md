# Meet.AI

## Authentication

Authentication uses Better Auth with Prisma/PostgreSQL. The server config is in
`src/lib/auth.ts`; the App Router endpoint is
`src/app/api/auth/[...all]/route.ts`.

### Environment

Copy `.env.example` to `.env` for local development. Set these values in every
deployment environment:

- `DATABASE_URL`: PostgreSQL connection string.
- `BETTER_AUTH_SECRET`: at least 32 random characters; generate with
  `npx auth secret`.
- `BETTER_AUTH_URL`: the exact application origin, including `https://` in
  production.
- `BETTER_AUTH_TRUSTED_ORIGINS`: optional comma-separated additional origins;
  only add domains you control.
- `RESEND_API_KEY` and `AUTH_EMAIL_FROM`: Resend credentials and a verified
  sender address.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` and
  `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: OAuth credentials. A provider is
  enabled only when both of its values are set.

Configure each OAuth app with these callback URLs:

- Google: `${BETTER_AUTH_URL}/api/auth/callback/google`
- GitHub: `${BETTER_AUTH_URL}/api/auth/callback/github`

Never commit `.env` or provider credentials. The app requires HTTPS origins in
production. In development, the auth URL defaults to `http://localhost:3000`
when `BETTER_AUTH_URL` is unset.

### Database

The Prisma schema contains Better Auth core models, TOTP 2FA tables, and a
database-backed rate-limit table. Generate the client after schema changes:

```bash
npm run db:generate
```

Apply committed migrations in deployment (not during application startup):

```bash
npm run db:migrate:deploy
```

Do not use `prisma migrate reset` against a shared or production database.

### Security behavior

- Email/password sign-up requires a verified email. Verification and password
  reset messages are sent through Resend.
- Passwords must be at least 12 characters. Password reset tokens expire after
  30 minutes and reset revokes existing sessions.
- Sessions are database-backed, rate limiting uses the database, and Better
  Auth's CSRF/origin checks remain enabled.
- TOTP enrollment is available at `/account/security` and requires a password.
  Store the generated backup codes securely.
- Better Auth's 2FA plugin challenges password sign-ins. To prevent OAuth from
  bypassing 2FA, OAuth sign-in is rejected for accounts with TOTP enabled; use
  email/password plus the authenticator code for those accounts.
- Protected pages must call `requireServerSession()` from
  `src/lib/auth-session.ts` in their server-side layout or route. Do not rely on
  client-side session state or a Proxy cookie check for authorization.
