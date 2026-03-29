# Stampede web + mobile starter (Supabase + Vercel)

This repository now contains a full starter that runs:

- **Web app**: Next.js (deploy to Vercel).
- **Mobile app**: Expo/React Native (build and publish with EAS).
- **Backend**: Supabase Auth + Postgres profile table.

## Project structure

- `apps/web`: Next.js web signup app.
- `apps/mobile`: Expo mobile signup app.
- `supabase/schema.sql`: schema + trigger for user profile creation.
- `vercel.json`: Vercel build settings for monorepo deploy.

## 1) Create Supabase project

1. Create a project in Supabase.
2. In Supabase SQL editor, run `supabase/schema.sql`.
3. Copy:
   - `Project URL`
   - `anon public key`

## 2) Local environment variables

Create these env vars for local dev.

### Web (`apps/web/.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Mobile (`apps/mobile/.env`)

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
```

## 3) Install and run

```bash
pnpm install
pnpm dev:web
pnpm dev:mobile
```

## 4) Deploy web to Vercel

1. Import this repo into Vercel.
2. Set **Root Directory** to repo root.
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

## 5) Publish mobile app

Inside `apps/mobile`:

```bash
pnpm dlx eas-cli login
pnpm dlx eas-cli build --platform ios
pnpm dlx eas-cli build --platform android
```

For updates:

```bash
pnpm dlx eas-cli update --branch production --message "Initial signup flow"
```

## Notes

- Both clients call Supabase Auth directly using the same project.
- Signup writes user metadata (`display_name`), and DB trigger creates `profiles` row.
- This is a starter foundation you can extend to full multi-step onboarding from the spec.
