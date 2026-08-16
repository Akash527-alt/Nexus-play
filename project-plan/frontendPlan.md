# Tournament Management Platform — Frontend Development Plan (v2)

> This is the frontend source of truth for the project. It replaces the earlier draft with a leaner structure: a **Global Contract** (read once, never changes mid-phase) followed by **10 self-contained phases**.
>
> **How your team should use this file:**
> 1. Everyone reads Section 1–3 (Overview, Scope, Global Contract) once, at the start.
> 2. When a developer picks up work, they open only their current **Phase** section.
> 3. That Phase section can be copy-pasted on its own into an AI coding agent (Claude, Cursor, Copilot, etc.) and will produce output consistent with every other phase, because the naming/endpoint/response rules are restated inside each phase block.
> 4. Nobody invents new field names, endpoints, or folder names. If something's missing, it gets added here first — not improvised in code.

---

## 1. Project Overview

A web-based Tournament Management Platform with four roles:

| Role | Description |
|---|---|
| `participant` | Browses tournaments, registers, forms teams, pays fees |
| `organizer` | Creates/manages tournaments, reviews participants |
| `sponsor` | Manages sponsor profile, sponsors tournaments |
| `admin` | Manages users, organizers, tournaments, sponsors, payments, reports |

**Stack:** React + Vite + JavaScript (no TypeScript) + React Router + Fetch API + CSS/Tailwind (per UI team decision). Frontend talks to the backend only through REST APIs — never directly to the database.

---

## 2. Version 1 Scope

**Build:** Auth · Participant profile · Tournament browsing/search/filter/details · Registration · Teams · Payments · Registration history · Organizer dashboard & tournament management · Sponsor profile & tournament sponsorship · Admin dashboard, user/organizer/tournament/sponsor/payment management, basic reports.

**Do NOT build (future version):** Live tournaments, live scores, fixtures, match scheduling/results, leaderboards, live streaming, chat, real-time notifications, AI/ML recommendations, advanced brackets.

If a ticket asks for anything in the "do not build" list, flag it — don't implement it silently.

---

## 3. Global Contract

*(This section applies to every phase below. It doesn't change unless the frontend and backend teams agree and update this file.)*

### 3.1 Naming Rule — Non-Negotiable

JavaScript is case-sensitive. Use the **exact** field names below everywhere: in requests, responses, variables, and state. Never convert case or invent synonyms.

```
tournamentId   ✅       tournamentID / tournament_id / TournamentId  ❌
```

### 3.2 Canonical Field Names (camelCase only)

```
id, name, email, password, phone, role, gamingPreferences
organizationId, organizationType
title, game, description, mode, venue, date, startTime, endTime,
teamSize, maxParticipants, registrationType, registrationFee,
registrationDeadline, prizePool, rules, status
teamId, teamName, captainId
registrationId, paymentId, paymentStatus, registeredAt
amount, transactionId, paymentMethod
sponsorId, companyName, industry, website, preferredGames,
preferredLocations, budgetRange, sponsorshipType
createdAt, updatedAt
```

### 3.3 Standard API Response Shape

**Single object**
```json
{ "success": true, "message": "Tournament fetched successfully", "data": { "id": 1, "title": "Mumbai Gaming Championship" } }
```

**List**
```json
{ "success": true, "message": "Tournaments fetched successfully", "data": { "tournaments": [], "total": 0, "page": 1, "limit": 10 } }
```

**Error**
```json
{ "success": false, "message": "Tournament not found", "error": "TOURNAMENT_NOT_FOUND" }
```

Never assume an error is signaled by HTTP status alone — always check `response.ok`, then read the body.

### 3.4 API Base URL

Never hard-code the backend URL in components. Use an env var and a centralized API config:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3.5 API Service Layer

All network calls live in `src/services/`, one file per domain:

```
authService.js  tournamentService.js  teamService.js  registrationService.js
paymentService.js  sponsorService.js  adminService.js
```

Pattern: `Page → Service function → Fetch API → Backend`. No raw `fetch()` calls scattered inside pages/components. Don't create duplicate services (e.g. `participantTournamentService.js` + `organizerTournamentService.js`) unless there's a real architectural reason — participant and organizer share `tournamentService.js`.

### 3.6 Authentication

Protected requests use:
```
Authorization: Bearer <token>
```
handled centrally in the service layer — not re-implemented per page. `AuthContext.jsx` owns `user`, `token`, `isAuthenticated`, `loading`, `login()`, `logout()`. `user.id / user.name / user.email / user.phone / user.role` must stay consistent everywhere.

Route protection must check **both** authentication and role — hiding a button is never sufficient authorization. The backend is always the final authority.

### 3.7 Security

Never put secrets (`JWT_SECRET`, DB passwords, payment secret keys, private API keys) in the frontend `.env`. Only public config (`VITE_API_URL`) belongs there — frontend env vars are exposed to the browser.

The frontend never talks to MySQL directly:
```
React → Fetch API → Express API → Service → Prisma → MySQL   ✅
React → MySQL                                                 ❌
```

### 3.8 Frontend vs Backend Responsibility

| Frontend | Backend |
|---|---|
| UI, forms, client-side validation | Auth verification & authorization |
| Navigation, loading states | Database, business rules |
| Displaying API data & errors | Payment verification, registration rules |
| Responsive design | Tournament ownership checks, data integrity, security |

Never assume business logic client-side — e.g. `registrationFee === 0` does **not** mean "no payment required"; the backend decides. Never assume `organizerId === currentUser.id` is enough to authorize an action — backend verifies ownership.

### 3.9 UI Standards (every API-driven page)

- Cover four states: `loading → success / empty / error`. Never leave a blank screen while loading.
- Show user-friendly error text (map backend `message`, never expose stack traces).
- Client-side validation is for UX only — backend validation is final authority. Typical checks: email format, password min length, phone format, numeric/positive fields (`registrationFee`, `maxParticipants`, `teamSize`), valid `date`.
- Keep `Server data`, `UI state`, `Form state`, and `Auth state` separate — don't duplicate server data across multiple global stores.
- Components: PascalCase (`TournamentCard.jsx`). Functions: camelCase (`getTournamentById()`, `createTeam()`, `registerForTournament()`).
- Dates/times: display-format only, never rename the underlying field (`date`, `startTime`, `endTime`, `registrationDeadline`, `createdAt`, `updatedAt` stay as-is; "10 September 2026" as *displayed text* is fine, `tournamentDate` as a *field name* is not).

### 3.10 Rules for Every AI Coding Agent Working on This Repo

1. Do not rename API fields.
2. Do not change camelCase to snake_case.
3. Do not create duplicate services unnecessarily.
4. Do not create new API endpoints from the frontend.
5. Do not directly access the database.
6. Do not build features outside Version 1 without approval.
7. Do not modify existing API contracts to make frontend code "easier."
8. Reuse existing components before creating new ones.
9. Follow the existing folder structure.
10. Create files only when the current phase requires them — no empty placeholder files ahead of time.
11. Do not introduce TypeScript.
12. Do not replace Fetch API with another HTTP library without team approval.
13. Do not modify backend field names.
14. If a real API response doesn't match this plan, **report the mismatch** — don't silently rename fields to make it fit.

### 3.11 Definition of Done (template — used at the end of every phase)

```
[] Page loads                         [ ] Loading state works
[ ] API request works                  [ ] Empty state works
[ ] Correct HTTP method used           [ ] Error state works
[ ] Correct endpoint used              [ ] Success state works
[ ] Correct field names used           [ ] Form validation works
[ ] Authentication works               [ ] Role restriction works
[ ] Responsive UI works                [ ] No console errors
```

### 3.12 Changing the Contract

If the backend wants to rename e.g. `registrationFee` → `fee`, the change must go through:

```
Backend proposes → Frontend notified → this file updated → frontend service updated → backend updated → tested
```

Nobody changes a field name, endpoint, request/response shape, or auth mechanism unilaterally.

### 3.13 Git Workflow

Feature branches per domain, never commit straight to `main`:
```
feature/frontend-auth  feature/frontend-tournaments  feature/frontend-teams
feature/frontend-payment  feature/frontend-sponsor  feature/frontend-admin
```
Flow: `main → feature branch → PR → review → merge`.

---

## 4. Full API Endpoint Reference

```
Auth
POST /api/auth/register        POST /api/auth/login
POST /api/auth/logout          GET  /api/auth/me

Users
GET /api/users/me              PUT /api/users/me

Organizations
POST /api/organizations        GET /api/organizations/me      PUT /api/organizations/me

Tournaments
GET /api/tournaments           GET /api/tournaments/:id
POST /api/tournaments          PUT /api/tournaments/:id       DELETE /api/tournaments/:id

Teams
POST /api/teams                GET /api/teams                 GET /api/teams/:id
PUT /api/teams/:id             DELETE /api/teams/:id
POST /api/teams/:id/members    DELETE /api/teams/:id/members/:userId

Registrations
POST /api/registrations        GET /api/registrations/me
GET /api/registrations/:id     PUT /api/registrations/:id/cancel

Payments
POST /api/payments             GET /api/payments/:id          GET /api/payments/me

Sponsors
POST /api/sponsors             GET /api/sponsors              GET /api/sponsors/:id
PUT /api/sponsors/:id

Tournament Sponsors
POST /api/tournaments/:id/sponsors     GET /api/tournaments/:id/sponsors
DELETE /api/tournaments/:id/sponsors/:sponsorId

Admin
GET /api/admin/users           PATCH /api/admin/users/:id/suspend
PATCH /api/admin/users/:id/activate
GET /api/admin/organizers      GET /api/admin/tournaments
GET /api/admin/sponsors        GET /api/admin/payments        GET /api/admin/reports
```

Query params (tournament listing): `keyword, game, mode, registrationType, status, minFee, maxFee, page, limit, sort`
Example: `/api/tournaments?keyword=valorant&game=Valorant&mode=offline&page=1&limit=10`
Pagination fields: `page`, `limit` only — not `pageNumber` / `pageSize` / `currentPage`.

---

## 5. Phase-by-Phase Plan

> Fold rule: only build the folders/files listed in the **current** phase. Don't scaffold future phases early.

---

### PHASE 1 — Project Setup

**Goal:** Working React/Vite shell. No business features yet.

**Create:**
```
frontend/
├── src/
│   ├── assets/{images,icons}/
│   ├── components/common/
│   ├── layouts/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx, main.jsx, index.css
├── .env  (VITE_API_URL=http://localhost:5000/api)
├── .env.example, .gitignore, package.json, vite.config.js
```

**Verify only:** React starts → Vite works → app opens in browser.

**Definition of Done:** app boots with no console errors; `.env` wired to `VITE_API_URL`; no feature code yet.

---

### PHASE 2 — Common UI & Layouts

**Goal:** Shared building blocks every later phase reuses.

**Create:**
```
src/components/common/   (Button, Input, Select, Modal, Loader, ErrorMessage,
                           EmptyState, ConfirmDialog, ProtectedRoute)
src/components/navbar/
src/components/footer/
src/layouts/  (MainLayout.jsx, ParticipantLayout.jsx, OrganizerLayout.jsx,
               SponsorLayout.jsx, AdminLayout.jsx)
```

**Layout shapes:**
- `MainLayout` → Navbar / Content / Footer (public pages)
- `ParticipantLayout` → Navbar / Content
- `OrganizerLayout`, `SponsorLayout`, `AdminLayout` → Sidebar / Navbar / Content

**Rule:** only build a component if it's reused, logically independent, or big enough to warrant separation — don't create components speculatively.

**Definition of Done:** apply the [template](#311-definition-of-done-template--used-at-the-end-of-every-phase) plus: all five layouts render with placeholder content, no console errors.

---

### PHASE 3 — Authentication

**Goal:** Register, login, logout, session state, protected/role-based routing.

**Create:**
```
src/pages/auth/{Login.jsx, Register.jsx}
src/context/AuthContext.jsx
src/hooks/useAuth.js
src/services/authService.js
src/pages/common/{Unauthorized.jsx, NotFound.jsx}
```

**Endpoints:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`

**Register request** — fields: `name, email, password, phone, role`. Public form only allows `role: participant | organizer` — **never** show `admin` as an option (frontend hides it; backend must also enforce it).
```json
{ "name": "Akash", "email": "akash@example.com", "password": "password", "phone": "9999999999", "role": "participant" }
```

**Login request:**
```json
{ "email": "akash@example.com", "password": "password" }
```

**Login response:**
```json
{
  "success": true, "message": "Login successful",
  "data": {
    "user": { "id": 1, "name": "Akash", "email": "akash@example.com", "phone": "9999999999", "role": "participant", "gamingPreferences": [] },
    "token": "..."
  }
}
```
Use `data.user.role` exactly — don't rename it. After login, route by role: `participant → /participant/dashboard`, `organizer → /organizer/dashboard`, `sponsor → /sponsor/dashboard`, `admin → /admin/dashboard`.

**Route protection logic:** `Public → authenticated? → no: Login → yes → role allowed? → no: Unauthorized → yes: Page`. E.g. `/admin/users` requires `authenticated = true AND role = admin`.

**Full route map (for `AppRoutes.jsx`, filled in progressively across phases):**
```
Public:      /  /login  /register  /tournaments  /tournaments/:id
Participant: /participant/dashboard  /participant/tournaments  /participant/tournaments/:id
             /participant/my-tournaments  /participant/profile
             /participant/teams  /participant/teams/:id
Organizer:   /organizer/dashboard  /organizer/tournaments  /organizer/tournaments/create
             /organizer/tournaments/:id  /organizer/tournaments/:id/edit
             /organizer/tournaments/:id/participants  /organizer/organization
Sponsor:     /sponsor/dashboard  /sponsor/profile  /sponsor/tournaments  /sponsor/tournaments/:id
Admin:       /admin/dashboard  /admin/users  /admin/organizers  /admin/tournaments
             /admin/sponsors  /admin/payments  /admin/reports
```

**Definition of Done:** template + register/login/logout work end to end, `AuthContext` persists session, protected routes redirect correctly by auth+role.

---

### PHASE 4 — Tournament Browsing

**Goal:** List, search, filter, view tournament details (no registration yet).

**Create:**
```
src/pages/participant/{Dashboard.jsx, Tournaments.jsx, TournamentDetails.jsx}
src/components/tournament/{TournamentCard.jsx, TournamentFilters.jsx,
                            TournamentSearch.jsx, TournamentDetails.jsx}
src/services/tournamentService.js
```

**Endpoints:** `GET /api/tournaments`, `GET /api/tournaments/:id`

**Search:** query param is `keyword` (never `searchTerm` / `search` / `query`): `GET /api/tournaments?keyword=valorant`

**Filters:** `game, mode, registrationType, status, minFee, maxFee`. Filter state object:
```js
{ keyword, game, mode, registrationType, status, minFee, maxFee }
```
Example: `GET /api/tournaments?keyword=valorant&game=Valorant&mode=offline&minFee=0&maxFee=1000`

**Card fields:** `id, title, game, mode, venue, date, startTime, registrationFee, prizePool, registrationDeadline, status`
```json
{ "id": 1, "title": "Mumbai Valorant Championship", "game": "Valorant", "mode": "offline", "venue": "XYZ College", "date": "2026-09-10", "startTime": "10:00", "registrationFee": 500, "prizePool": 10000, "registrationDeadline": "2026-09-08", "status": "open" }
```

**Details fields:** `id, organizationId, title, game, description, mode, venue, date, startTime, endTime, teamSize, maxParticipants, registrationType, registrationFee, registrationDeadline, prizePool, rules, status, createdAt, updatedAt`

Details page order: Header → Game/Mode/Date → Registration Info → Venue → Prize Pool → Team Info → Rules → Organizer Info → Register button.

`GET /api/tournaments/:id` response is nested under `data.tournament`.

Allowed `status` values for V1: `draft, open, closed, completed, cancelled` — never `live / fixture / inProgress / matchStarted`.

**Definition of Done:** template + search & filters hit correct query params, details page renders all listed fields, empty/error states covered.

---

### PHASE 5 — Team Management & Registration

**Goal:** Register for a tournament (individual or team), create/manage teams.

**Create:**
```
src/pages/participant/teams/
src/components/team/{TeamCard.jsx, TeamForm.jsx, TeamMemberList.jsx, AddTeamMember.jsx}
src/services/{teamService.js, registrationService.js}
```
Routes: `/participant/teams`, `/participant/teams/:id`

**Endpoints:**
```
POST /api/teams   GET /api/teams   GET /api/teams/:id   PUT /api/teams/:id   DELETE /api/teams/:id
POST /api/teams/:id/members   DELETE /api/teams/:id/members/:userId
POST /api/registrations   GET /api/registrations/me   GET /api/registrations/:id   PUT /api/registrations/:id/cancel
```

**Team object:** `id, tournamentId, name, captainId, createdAt, updatedAt`

**Team creation request** — do NOT send `captainId` from the frontend; backend derives it from the authenticated user:
```json
{ "tournamentId": 1, "name": "Team Alpha" }
```

**Team member object:** `id, teamId, userId, joinedAt`, with nested user info always keyed as `user` (never `member` / `player` / `userData`):
```json
{ "id": 1, "teamId": 5, "userId": 10, "joinedAt": "2026-08-16T10:00:00Z", "user": { "id": 10, "name": "Akash", "email": "akash@example.com" } }
```

**Registration request:**
```json
{ "tournamentId": 1, "teamId": 5 }
```
Individual tournament: `{ "tournamentId": 1, "teamId": null }`. Never send `tournamentID / teamID / tournament_id / team_id`.

**Registration response:**
```json
{
  "success": true, "message": "Tournament registration created successfully",
  "data": { "registration": { "id": 10, "tournamentId": 1, "userId": 5, "teamId": 3, "status": "pending", "registeredAt": "2026-08-16T10:00:00Z" } }
}
```
Use `data.registration.{id, tournamentId, userId, teamId, status, registeredAt}` exactly.

**Definition of Done:** template + team CRUD works, member add/remove works, registration flow produces a `registration` object with correct status handling.

---

### PHASE 6 — Participant Dashboard, History & Profile

**Goal:** Participant home base — dashboard, tournament history, profile.

**Create:**
```
src/pages/participant/{Dashboard.jsx, MyTournaments.jsx, Profile.jsx}
```

**Dashboard shows:** Upcoming Tournaments, Active Registrations, Completed Tournaments, Teams, Profile summary. No live-match info (out of scope).

**My Tournaments tabs:** Upcoming, Active, Completed, Cancelled — sourced from `registrations` + `tournaments` data the backend returns; frontend never queries a database directly.

**Profile fields:** `name, email, phone, gamingPreferences` — `email` may be read-only depending on backend auth rules.

**Definition of Done:** template + dashboard aggregates real registration/team data, all four MyTournaments tabs populate correctly, profile edits round-trip through the API.

---

### PHASE 7 — Organizer

**Goal:** Organizer can create/manage tournaments, view participants, manage org profile.

**Create:**
```
src/pages/organizer/{Dashboard.jsx, MyTournaments.jsx, CreateTournament.jsx,
                      TournamentDetails.jsx, EditTournament.jsx,
                      TournamentParticipants.jsx, OrganizationProfile.jsx}
```
Reuses `tournamentService.js` from Phase 4 — don't create a separate organizer-only tournament service.

Routes: `/organizer/dashboard  /organizer/tournaments  /organizer/tournaments/create
/organizer/tournaments/:id  /organizer/tournaments/:id/edit
/organizer/tournaments/:id/participants  /organizer/organization`

**Endpoints:** `POST/PUT/DELETE /api/tournaments(/:id)`, `POST /api/organizations`, `GET/PUT /api/organizations/me`

**Organization object:** `id, userId, name, email, phone, address, organizationType, createdAt, updatedAt`

**Tournament creation form fields (exact names, no renaming):**
`title, game, description, mode, venue, date, startTime, endTime, teamSize, maxParticipants, registrationType, registrationFee, registrationDeadline, prizePool, rules`
```json
{
  "title": "Mumbai Valorant Championship", "game": "Valorant", "description": "College gaming tournament",
  "mode": "offline", "venue": "XYZ College", "date": "2026-09-10", "startTime": "10:00", "endTime": "18:00",
  "teamSize": 5, "maxParticipants": 100, "registrationType": "team", "registrationFee": 500,
  "registrationDeadline": "2026-09-08", "prizePool": 10000, "rules": "Standard tournament rules"
}
```

**Dashboard stats** (backend-provided, don't compute business numbers on the frontend): Total Tournaments, Open Tournaments, Completed Tournaments, Total Participants, Total Registrations.

**Participant list page** (`/organizer/tournaments/:id/participants`) displays: `name, email, phone, teamName, registrationId, registrationStatus, paymentStatus, registeredAt` — preserve whatever nesting the backend returns.

**Ownership rule:** frontend must not assume `organizerId === currentUser.id` is sufficient authorization — always defer to what the backend allows/returns.

**Definition of Done:** template + create/edit tournament round-trips exact field names, participant list renders backend-provided fields as-is, org profile CRUD works.

---

### PHASE 8 — Payment

**Goal:** Registration fee payment flow, driven by backend/payment-provider confirmation — never by frontend state alone.

**Create:**
```
src/components/payment/
src/pages/participant/{Payment.jsx, PaymentSuccess.jsx, PaymentFailed.jsx}
src/services/paymentService.js
```

**Endpoints:** `POST /api/payments`, `GET /api/payments/:id`, `GET /api/payments/me`

**Payment object:** `id, registrationId, userId, tournamentId, amount, transactionId, paymentMethod, status, createdAt`
Status values: `pending, success, failed, refunded`

**Payment page shows:** Tournament, Registration ID, Amount, Payment Method, Pay button. After backend confirmation route to: `success → PaymentSuccess`, `failed → PaymentFailed`, `pending → PaymentPending`. **Never** show a success screen based only on a button click — wait for backend/provider confirmation.

**Definition of Done:** template + all four payment states (pending/success/failed/refunded) render correctly and only from backend-confirmed status.

---

### PHASE 9 — Sponsors

**Goal:** Sponsor profile management and tournament sponsorship.

**Create:**
```
src/pages/sponsor/{Dashboard.jsx, Profile.jsx, Tournaments.jsx, TournamentDetails.jsx}
src/components/sponsor/{SponsorCard.jsx, SponsorForm.jsx}
src/services/sponsorService.js
```

**Endpoints:**
```
POST /api/sponsors   GET /api/sponsors   GET /api/sponsors/:id   PUT /api/sponsors/:id
POST /api/tournaments/:id/sponsors   GET /api/tournaments/:id/sponsors   DELETE /api/tournaments/:id/sponsors/:sponsorId
```

**Sponsor object:** `id, companyName, email, phone, industry, website, preferredGames, preferredLocations, budgetRange, description, status, createdAt, updatedAt`

**Sponsor form fields:** `companyName, email, phone, industry, website, preferredGames, preferredLocations, budgetRange, description`

**Tournament–sponsor relationship object:** `id, tournamentId, sponsorId, sponsorshipType, amount, status, createdAt` — use these exact names; don't invent a separate `sponsorRequest` concept unless the backend defines one.

**Workflow:** View Tournament → View Sponsor Info → Sponsor picks tournament → submit sponsorship (`tournamentId, sponsorId, sponsorshipType, amount, status`) → backend processes → frontend displays returned status.

**Definition of Done:** template + sponsor profile CRUD works, sponsorship submission/list/removal round-trips exact field names.

---

### PHASE 10 — Admin

**Goal:** Admin oversight — users, organizers, tournaments, sponsors, payments, reports. Build this only once Phases 1–9 are stable.

**Create:**
```
src/pages/admin/{Dashboard.jsx, Users.jsx, Organizers.jsx, Tournaments.jsx,
                  Sponsors.jsx, Payments.jsx, Reports.jsx}
src/components/admin/{AdminTable.jsx, StatusBadge.jsx, ConfirmAction.jsx}
src/services/adminService.js
```

**Endpoints:**
```
GET /api/admin/users   PATCH /api/admin/users/:id/suspend   PATCH /api/admin/users/:id/activate
GET /api/admin/organizers   GET /api/admin/tournaments   GET /api/admin/sponsors
GET /api/admin/payments   GET /api/admin/reports
```

| Page | Route | Displays / Actions |
|---|---|---|
| Dashboard | `/admin/dashboard` | Total Users, Organizers, Tournaments, Sponsors, Registrations, Payments (backend-provided) |
| Users | `/admin/users` | View / Suspend / Activate. No hard delete unless backend explicitly supports it. |
| Organizers | `/admin/organizers` | `name, email, phone, organizationName, organizationType, status, createdAt` |
| Tournaments | `/admin/tournaments` | View / Approve (if required) / Suspend-cancel (if allowed) / Delete (if backend allows) |
| Sponsors | `/admin/sponsors` | `companyName, email, industry, website, status, createdAt` |
| Payments | `/admin/payments` | `paymentId, registrationId, userId, tournamentId, amount, transactionId, paymentMethod, status, createdAt` |
| Reports | `/admin/reports` | Tournament count, User count, Registration count, Payment count, Sponsor count. Charts can come later — keep it simple for V1. |

All admin actions follow whatever authorization the backend enforces — the frontend never grants itself extra permission.

**Definition of Done:** template + every admin table reflects live backend data, suspend/activate actions call the correct endpoints and update state only after a confirmed response.

---

## 6. Final Architecture (reference)

```
React Pages → React Components → Service Layer → Fetch API → REST API/Backend
            → Authentication → Business Logic → Prisma → MySQL
```
Frontend owns presentation and interaction; backend owns business logic, authorization, database, and data integrity — always.

## 7. Closing Rule

If anyone — human or AI agent — is unsure about a field name, endpoint, route, request/response shape, folder location, component name, or feature scope: **check this file first.** If it's not here, don't invent a convention — raise it with the team and update this document before writing code.
