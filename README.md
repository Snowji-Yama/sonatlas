# SONATLAS

Artist collection sorted by genre and subgenres. Nuxt 4 SPA, Supabase for storage.

| Route | |
|---|---|
| `/` | Home, cassette schematic |
| `/artists` | List, genre + subgenre filters, alphabetical sort |
| `/new` | Add form, sign-in required |

```bash
npm install && npm run dev
npm test                      # filter + sort, node --test
```

Genres and subgenres are hardcoded in [`genres.ts`](app/constants/genres.ts).
Remaining work is in [TODO.md](TODO.md).

## Demo mode

No `.env` → the app serves [`mockArtists.ts`](app/constants/mockArtists.ts), additions
stay in memory, and an orange **DÉMO** chip shows in every header. Fill `.env` and
everything switches to Supabase.

The chip matters: without it, deploying without env vars would show fake artists
silently.

## Database

Copy `.env.example` to `.env`, then run in the Supabase SQL Editor:

```sql
create table sonatlas_artists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  genre text not null,
  subgenres text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- No-op if the project has "Enable automatic RLS" on. Kept so the script also
-- works on a project created without it.
alter table sonatlas_artists enable row level security;

create policy "public read" on sonatlas_artists
  for select to anon using (true);

create policy "authenticated insert" on sonatlas_artists
  for insert to authenticated with check (true);
```

⚠️ **RLS on with no policy = fully closed table.** The list renders empty, no error.
Expected behaviour, surprising the first time.

⚠️ Free projects **pause after ~7 days idle** and need a manual wake from the
dashboard. Schedule a weekly ping (cron-job.org) if the app is rarely visited.

## Authentication

Read is public, write is not. `/new` shows a magic-link sign-in until a session exists.
Sessions live in `localStorage` — one sign-in per browser, then a **Déconnexion** button
appears at the bottom of `/new`.

Three dashboard settings, all required:

| Where | What |
|---|---|
| Authentication → Users | Add your user by hand. The app cannot sign up — [`useAuth.ts`](app/composables/useAuth.ts) passes `shouldCreateUser: false`. |
| Authentication → Providers → Email | Turn off *Allow new users to sign up*. Otherwise `authenticated` means anyone who registered. |
| Authentication → URL Configuration | See below. Supabase rejects any undeclared redirect. |

**Site URL** takes a single value, no wildcards. It is the fallback and the email
template variable. Use the site root — `http://localhost:3000` in dev, **the production
URL once deployed**, or live emails will point at localhost.

**Redirect URLs** is the allow list, wildcards accepted. Add `http://localhost:3000/**`,
then `https://<domain>/**` on deploy without removing localhost.
