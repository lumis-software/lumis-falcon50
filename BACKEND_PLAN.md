# Lumis Falcon Trainer — Backend Integration Plan

The current app is a fully-functional static PWA — works offline, no server needed. Profile and logbook live in `localStorage` on each device.

To enable Lumis Smart Score sync, cross-device profile sync, admin dashboards, and per-pilot completion reporting, the following backend wiring is needed.

## Recommended stack

- **Auth:** Supabase Auth (email + magic link) or Clerk (broader social/SSO if needed)
- **Database:** Supabase Postgres (also handles row-level security per pilot)
- **File storage:** Supabase Storage (logbook PDF / CSV uploads)
- **API:** Supabase Edge Functions OR a thin Vercel serverless wrapper if Smart Score API is at a different domain
- **Frontend integration:** Replace the `localStorage` reads/writes in `Profile/Logbook` with Supabase queries; wire `submitToSmartScore()` to a real fetch

## Frontend integration points already in the code

Search for these markers in `index.html`:

### `submitToSmartScore(profile, completion)`
Currently a stub that logs to console. Expected real shape:

```js
const submitToSmartScore = async (profile, completion) => {
  const session = await supabase.auth.getSession();
  const r = await fetch("https://api.lumis.com/smartscore/submit", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${session.data.session.access_token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      profile,        // { name, email, phone, certs, ratings, totalTime, picTime, typeTime }
      completion,     // { aircraft, modules_completed, scores, last_session }
      source: "lumis-falcon50-trainer"
    })
  });
  return await r.json();
};
```

### `loadProfile() / saveProfile()` and `loadLogbook() / saveLogbook()`
Replace with Supabase reads/writes:

```js
const loadProfile = async () => {
  const { data } = await supabase.from("profiles").select("*").single();
  return data;
};
const saveProfile = async (p) => {
  await supabase.from("profiles").upsert(p);
};
```

### Logbook file upload
Currently parses CSV in the browser. For PDF: store in Supabase Storage, run server-side text extraction (Edge Function with `pdf-parse` or similar), normalize to logbook rows.

## Database schema (Supabase Postgres)

```sql
create table profiles (
  user_id uuid primary key references auth.users on delete cascade,
  name text not null,
  email text not null,
  phone text,
  certs text,
  ratings text,
  total_time numeric,
  pic_time numeric,
  type_time numeric,
  updated_at timestamptz default now()
);

create table logbook_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  date date not null,
  aircraft text not null,
  route text,
  duration numeric not null,
  remarks text,
  created_at timestamptz default now()
);

create table module_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  aircraft text not null,           -- f50, f50ex, f900, f900easy
  module text not null,             -- quiz, trainer, oral, phases
  module_id text,                   -- procedure id, quiz session id
  score numeric,
  duration_sec integer,
  completed_at timestamptz default now()
);

-- Row-level security: pilots see only their own data
alter table profiles enable row level security;
create policy "pilots see own profile" on profiles for all using (auth.uid() = user_id);

alter table logbook_entries enable row level security;
create policy "pilots see own logbook" on logbook_entries for all using (auth.uid() = user_id);

alter table module_completions enable row level security;
create policy "pilots see own progress" on module_completions for all using (auth.uid() = user_id);
```

## Smart Score API contract (proposed)

`POST https://api.lumis.com/smartscore/submit`

Request:
```json
{
  "profile": { "...": "see profile shape above" },
  "completion": {
    "aircraft": "f50",
    "modules_completed": ["preflight", "engine_start", "engine_fire"],
    "scores": { "quiz_overall": 87, "trainer_avg": 92 },
    "last_session": "2026-06-08T20:00:00Z"
  },
  "source": "lumis-falcon50-trainer"
}
```

Response:
```json
{
  "ok": true,
  "smart_score": 4.3,
  "percentile": 78,
  "next_recommended_module": "antiskid_fail"
}
```

## Cost estimate

- Supabase Free tier: 500 MB DB, 1 GB storage, 50 K monthly active users — fine for first 100 pilots
- When you exceed: Supabase Pro = $25/mo
- Vercel for hosting if you move off GitHub Pages: free for hobby, $20/mo for team

## Migration plan (when ready to enable backend)

1. Set up Supabase project at supabase.com (15 min)
2. Run the schema SQL above (5 min)
3. Add Supabase JS client to the app (`npm install @supabase/supabase-js`)
4. Replace `localStorage` calls with Supabase calls (1-2 hours)
5. Add real auth screen (sign-in / sign-up flow) (2-3 hours)
6. Implement Smart Score API endpoint (Lumis side, separate project)
7. Wire `submitToSmartScore()` to the real endpoint (30 min)
8. Test end-to-end with a few pilots
9. Migrate existing pilots from localStorage on first login (one-time migration banner)

Total: ~1 week of development time when you're ready.

---

— Lumis
