# Progress Log

A running record of work on GMC Tracker V1. Add a new entry at the top of the
log after each working session so the project history stays current.

## How to use this file
- Add one entry per session, newest first.
- Keep entries short: what changed, why, and anything left open.
- Use the template below. Commit this file along with the session's work.

### Entry template
```
## YYYY-MM-DD — <short title>
**Done**
- ...

**In progress / next**
- ...

**Notes / decisions**
- ...
```

---

## 2026-06-18 — Project baseline & progress tracking
**Done**
- Captured the current state of the app (Next.js + Supabase) as the starting baseline.
- Added this `PROGRESS.md` to document work after every session.

**In progress / next**
- No feature work in flight.

**Notes / decisions**
- Progress is tracked manually: update this file at the end of each session and
  commit it with that session's changes.

### Baseline snapshot
- **Stack:** Next.js (App Router, TypeScript) + Supabase.
- **Scope (V1):** Customer Service submits room requests (one room per line),
  £3.99/room standard setup charge, optional lunch details/cost, Hospitality
  marks Delivered, Manager/Supervisor marks Approved, weekly/monthly reporting
  from approved records.
- **Pages:** `/` Dashboard, `/new-request` form, `/queue` queue + approval,
  `/reports` reports.
- **Key files:** `app/actions.ts`, `lib/calculations.ts`, `lib/supabase.ts`,
  `supabase/schema.sql`.
