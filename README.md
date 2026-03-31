# Stampede deployment runbook (Web on Vercel + Backend on Supabase)

Use this as an **execute-in-order checklist**.

---

## Prerequisites

Install these tools locally:

- Node.js 20+
- pnpm 9+
- Git
- Supabase CLI
- Vercel CLI

```bash
npm i -g pnpm supabase vercel
```

Log in once:

```bash
supabase login
vercel login
```

---

## 1) Create and configure Supabase project

### 1.1 Create a Supabase project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard).
2. Click **New project**.
3. Choose org, name, region, and database password.
4. Wait until project status is healthy.

### 1.2 Get project credentials

In **Project Settings → API**, copy:

- `Project URL`
- `anon public key`
- `service_role key` (server-only, never expose to client)

### 1.3 Apply schema in this repo

Run this in Supabase SQL Editor:

- File: `supabase/schema.sql`

This creates:

- `public.profiles`
- RLS policies for self-read/self-insert
- trigger `on_auth_user_created` to auto-create profiles from auth users

### 1.4 Configure auth URL settings

In **Authentication → URL Configuration**:

- Site URL: your future Vercel production URL (example: `https://your-app.vercel.app`)
- Additional Redirect URLs:
  - `http://localhost:3000`
  - any preview domains you use (`https://*-your-team.vercel.app`)

---

## 2) Configure local environment

### 2.1 Web env (`apps/web/.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### 2.2 Mobile env (`apps/mobile/.env`)

```bash
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

## 3) Run locally (sanity check before deploy)

From repo root:

```bash
pnpm install
pnpm dev:web
```

In another terminal:

```bash
pnpm dev:mobile
```

Validate signup works in both apps and user rows appear in Supabase Auth + `public.profiles`.

---

## 4) Deploy web app to Vercel

> This repo is configured for monorepo deployment via `vercel.json`.

### 4.1 First-time project link and deploy

From repo root:

```bash
vercel
```

Recommended answers:

- Set up and deploy? **yes**
- Scope: your account/team
- Link to existing project? **no** (first run)
- Project name: `stampede-web` (or your preferred name)
- Directory: `.` (repo root)

### 4.2 Set required environment variables in Vercel

Run after project is linked:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
```

Paste your Supabase values when prompted.

### 4.3 Deploy production build

```bash
vercel --prod
```

After deploy, copy your production URL and update Supabase **Site URL** if needed.

---

## 5) Optional: Supabase CLI linking (for DB migrations workflow)

If you want to manage DB changes in code going forward:

```bash
supabase init
supabase link --project-ref YOUR_PROJECT_REF
```

Create migration from current schema manually (recommended next step):

```bash
supabase migration new init_profiles
```

Then paste SQL from `supabase/schema.sql` into generated migration file and run:

```bash
supabase db push
```

---

## 6) Mobile publishing (Expo/EAS)

From `apps/mobile`:

```bash
pnpm dlx eas-cli login
pnpm dlx eas-cli build --platform ios
pnpm dlx eas-cli build --platform android
```

For OTA update:

```bash
pnpm dlx eas-cli update --branch production --message "Initial signup flow"
```

---


## Troubleshooting: Vercel `DEP0169 url.parse()` warning

If you see this in Vercel logs:

```text
[DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized...
```

this is usually emitted by a transitive dependency in the Vercel/Node toolchain and is **a warning, not a deployment blocker**.

What to do:

1. Ignore the warning unless the build actually fails later in logs.
2. Ensure Vercel project settings are:
   - Framework preset: **Next.js**
   - Root Directory: repository root (`.`)
3. Keep `vercel.json` minimal (no `outputDirectory` override for Next.js).
4. If build still fails, check the first real `Error:` line after the warning; that line is the actionable failure.


### If Vercel fails with `ERR_PNPM_META_FETCH_FAIL`

If logs show:

```text
ERR_PNPM_META_FETCH_FAIL ... Value of "this" must be of type URLSearchParams
```

use **npm on Vercel** instead of pnpm for this repo deployment (already configured in `vercel.json`):

- Install command: `npm install`
- Build command: `npm run build:web:vercel`

This bypasses transient pnpm metadata fetch/runtime issues in some Vercel environments.

## 7) Production checklist

- [ ] Vercel deployment is green.
- [ ] Web app can sign up new user.
- [ ] Supabase sends verification email.
- [ ] `public.profiles` row is auto-created after signup.
- [ ] Supabase Auth redirect URLs include production and localhost.
- [ ] No `service_role` key is exposed in client code.

---

## Repo paths used by deployment

- Vercel config: `vercel.json`
- Supabase schema: `supabase/schema.sql`
- Web client: `apps/web`
- Mobile client: `apps/mobile`
