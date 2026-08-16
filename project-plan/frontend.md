# **This is Ai Generated plan if required modify it **
**Summurize this with ai and start working with phase 1**

**Install npm module before starting with development**


> cd frontend

> npm install



# Tournament Management Platform — Frontend Development Plan

> **Document purpose:** This file is the frontend development contract for the Tournament Management Platform.
>
> This plan must be followed by all frontend team members and AI coding agents.
>
> **Important:** Internal implementation logic may change, but the folder structure, route names, API endpoints, request field names, response field names, database/API terminology, and case-sensitive naming defined in this document must not be changed without agreement between the frontend and backend teams.

---

# 1. Project Overview

The application is a web-based Tournament Management Platform.

The platform has four user roles:

1. `participant`
2. `organizer`
3. `sponsor`
4. `admin`

The Version 1 frontend will support:

* User authentication
* Participant profile
* Tournament browsing
* Tournament search
* Tournament filtering
* Tournament details
* Tournament registration
* Team creation
* Team member management
* Payment flow
* Registration history
* Organizer dashboard
* Tournament creation and management
* Participant management for organizers
* Organization profile
* Sponsor management
* Tournament sponsorship
* Admin dashboard
* User management
* Organizer management
* Tournament management
* Sponsor management
* Payment management
* Basic reports

---

# 2. Version 1 Scope

## 2.1 Included

```text
Authentication
Participant
Organizer
Sponsor
Admin
Tournaments
Teams
Registrations
Payments
Sponsors
Search
Filters
Dashboards
Profiles
Role-based access
```

## 2.2 Not Included in Version 1

Do NOT create frontend pages/components/routes for:

```text
Live tournaments
Live scores
Fixtures
Match scheduling
Match results
Leaderboards
Live streaming
Chat
Real-time notifications
ML recommendations
AI recommendations
Advanced tournament brackets
```

These can be added in a future version without changing the existing core structure.

---

# 3. Frontend Technology

Use:

```text
React
Vite
JavaScript
React Router
Fetch API
CSS / Tailwind CSS according to the UI team's decision
```

The frontend communicates with the backend through REST APIs.

---

# 4. Critical Naming Contract

This section is mandatory.

Frontend and backend developers must use the exact same names.

JavaScript is case-sensitive.

For example:

```javascript
tournamentId
```

must NOT become:

```javascript
tournamentID
tournament_id
TournamentId
tournamentid
```

The same applies to every field.

---

# 5. Canonical Field Naming Convention

Use **camelCase** for all API request and response fields.

Use these exact names:

```text
id
name
email
password
phone
role
gamingPreferences

organizationId
organizationType

title
game
description
mode
venue
date
startTime
endTime
teamSize
maxParticipants
registrationType
registrationFee
registrationDeadline
prizePool
rules
status

teamId
teamName
captainId

registrationId
paymentId
paymentStatus
registeredAt

amount
transactionId
paymentMethod

sponsorId
companyName
industry
website
preferredGames
preferredLocations
budgetRange
sponsorshipType

createdAt
updatedAt
```

Never create alternative names for these fields.

---

# 6. Standard API Response Structure

The frontend must expect the following general response format.

## Successful single object

```json
{
  "success": true,
  "message": "Tournament fetched successfully",
  "data": {
    "id": 1,
    "title": "Mumbai Gaming Championship"
  }
}
```

## Successful list

```json
{
  "success": true,
  "message": "Tournaments fetched successfully",
  "data": {
    "tournaments": [],
    "total": 0,
    "page": 1,
    "limit": 10
  }
}
```

## Error

```json
{
  "success": false,
  "message": "Tournament not found",
  "error": "TOURNAMENT_NOT_FOUND"
}
```

Frontend must not assume that an error always has a particular HTTP status only. Always check:

```javascript
response.ok
```

and then process the response body.

---

# 7. API Base URL

The frontend must never hard-code the backend URL throughout components.

Use:

```text
VITE_API_URL
```

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

All API requests must be built using the centralized API configuration.

Do NOT write this repeatedly:

```javascript
fetch("http://localhost:5000/api/tournaments")
```

Instead use the centralized API base URL.

---

# 8. Frontend Folder Structure

The frontend will eventually follow this structure:

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── tournament/
│   │   ├── team/
│   │   ├── sponsor/
│   │   └── admin/
│   │
│   ├── pages/
│   │   ├── auth/
│   │   ├── participant/
│   │   ├── organizer/
│   │   ├── sponsor/
│   │   └── admin/
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── ParticipantLayout.jsx
│   │   ├── OrganizerLayout.jsx
│   │   ├── SponsorLayout.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── tournamentService.js
│   │   ├── teamService.js
│   │   ├── registrationService.js
│   │   ├── paymentService.js
│   │   ├── sponsorService.js
│   │   └── adminService.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── vite.config.js
```

---

# 9. Folder Creation Rule

Do NOT create all folders and files at the beginning.

Create folders according to the development phases.

The repository should grow like:

```text
Phase 1
    ↓
Basic React application
    ↓
Phase 2
    ↓
Authentication folders
    ↓
Phase 3
    ↓
Tournament folders
    ↓
Phase 4
    ↓
Team + Registration folders
    ↓
Phase 5
    ↓
Payment folders
    ↓
Phase 6
    ↓
Sponsor folders
    ↓
Phase 7
    ↓
Admin folders
```

Do not create empty placeholder files just to match the final structure.

---

# 10. Phase 1 — Frontend Project Setup

## Goal

Create the basic React/Vite application and establish the common structure.

Create:

```text
frontend/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   └── common/
│   │
│   ├── layouts/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── vite.config.js
```

Initial environment:

```env
VITE_API_URL=http://localhost:5000/api
```

At this stage, only verify:

```text
React starts
↓
Vite works
↓
Frontend opens
```

Do not implement business features yet.

---

# 11. Phase 2 — Common UI

Create:

```text
src/components/common/
src/components/navbar/
src/components/footer/
src/layouts/
```

Common components may include:

```text
Button
Input
Select
Modal
Loader
ErrorMessage
EmptyState
ConfirmDialog
ProtectedRoute
```

Do not create unnecessary components.

A component should be created when it is:

* reused
* logically independent
* large enough to need separation

---

# 12. Layout Structure

## `MainLayout.jsx`

Used for public pages.

Example:

```text
Navbar
Main Content
Footer
```

## `ParticipantLayout.jsx`

```text
Navbar
Participant Content
```

## `OrganizerLayout.jsx`

```text
Organizer Sidebar
Organizer Navbar
Main Content
```

## `SponsorLayout.jsx`

```text
Sponsor Sidebar
Sponsor Navbar
Main Content
```

## `AdminLayout.jsx`

```text
Admin Sidebar
Admin Navbar
Main Content
```

---

# 13. Phase 3 — Authentication

Create:

```text
src/pages/auth/
├── Login.jsx
└── Register.jsx

src/context/
└── AuthContext.jsx

src/hooks/
└── useAuth.js

src/services/
└── authService.js
```

---

# 14. Registration Form

Fields:

```text
name
email
password
phone
role
```

For normal public registration, allowed roles should be:

```text
participant
organizer
```

Do NOT allow users to select:

```text
admin
```

from the public registration form.

The backend must also enforce this.

---

# 15. Login Form

Fields:

```text
email
password
```

Login response should contain:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Akash",
      "email": "akash@example.com",
      "phone": "9999999999",
      "role": "participant",
      "gamingPreferences": []
    },
    "token": "..."
  }
}
```

The frontend must use the exact field:

```javascript
data.user.role
```

Do not rename it.

---

# 16. Authentication State

`AuthContext.jsx` is responsible for maintaining the current authentication state.

Conceptually:

```text
user
token
isAuthenticated
loading
login()
logout()
```

Exact internal implementation may use Context, localStorage, sessionStorage, or another agreed approach.

However:

```text
user.id
user.name
user.email
user.phone
user.role
```

must remain consistent.

---

# 17. Role-Based Navigation

After login:

```text
participant → Participant Dashboard
organizer   → Organizer Dashboard
sponsor     → Sponsor Dashboard
admin       → Admin Dashboard
```

The frontend must never rely only on hiding a button for authorization.

For example:

```text
Admin button hidden
```

does NOT mean the route is protected.

Protected routes must also check the user's role.

The backend remains the final authority for authorization.

---

# 18. Frontend Route Structure

Use these routes.

## Public routes

```text
/
 /login
 /register
 /tournaments
 /tournaments/:id
```

## Participant

```text
/participant/dashboard
/participant/tournaments
/participant/tournaments/:id
/participant/my-tournaments
/participant/profile
/participant/teams
/participant/teams/:id
```

## Organizer

```text
/organizer/dashboard
/organizer/tournaments
/organizer/tournaments/create
/organizer/tournaments/:id
/organizer/tournaments/:id/edit
/organizer/tournaments/:id/participants
/organizer/organization
```

## Sponsor

```text
/sponsor/dashboard
/sponsor/profile
/sponsor/tournaments
/sponsor/tournaments/:id
```

## Admin

```text
/admin/dashboard
/admin/users
/admin/organizers
/admin/tournaments
/admin/sponsors
/admin/payments
/admin/reports
```

---

# 19. Phase 4 — Tournament Browsing

Create:

```text
src/pages/participant/
├── Dashboard.jsx
├── Tournaments.jsx
└── TournamentDetails.jsx

src/components/tournament/
├── TournamentCard.jsx
├── TournamentFilters.jsx
├── TournamentSearch.jsx
└── TournamentDetails.jsx

src/services/
└── tournamentService.js
```

---

# 20. Tournament Card Data Contract

Every tournament card should use these fields:

```text
id
title
game
mode
venue
date
startTime
registrationFee
prizePool
registrationDeadline
status
```

Example:

```json
{
  "id": 1,
  "title": "Mumbai Valorant Championship",
  "game": "Valorant",
  "mode": "offline",
  "venue": "XYZ College",
  "date": "2026-09-10",
  "startTime": "10:00",
  "registrationFee": 500,
  "prizePool": 10000,
  "registrationDeadline": "2026-09-08",
  "status": "open"
}
```

---

# 21. Tournament Search

Search query parameter:

```text
keyword
```

Example:

```text
GET /api/tournaments?keyword=valorant
```

Frontend variable:

```javascript
keyword
```

Do not change it to:

```javascript
searchTerm
search
query
```

unless the API contract is officially changed.

---

# 22. Tournament Filters

Supported filters:

```text
game
mode
registrationType
status
minFee
maxFee
```

Example:

```text
GET /api/tournaments?keyword=valorant&game=Valorant&mode=offline&minFee=0&maxFee=1000
```

Frontend filter state must use:

```javascript
{
  keyword,
  game,
  mode,
  registrationType,
  status,
  minFee,
  maxFee
}
```

---

# 23. Tournament Details

Tournament details must display:

```text
id
organizationId
title
game
description
mode
venue
date
startTime
endTime
teamSize
maxParticipants
registrationType
registrationFee
registrationDeadline
prizePool
rules
status
createdAt
updatedAt
```

UI should be organized into:

```text
Tournament Header
↓
Game / Mode / Date
↓
Registration Information
↓
Venue
↓
Prize Pool
↓
Team Information
↓
Rules
↓
Organizer Information
↓
Register Button
```

---

# 24. Tournament Registration

Participant clicks:

```text
Register
```

Frontend must send:

```json
{
  "tournamentId": 1,
  "teamId": 5
}
```

For an individual tournament:

```json
{
  "tournamentId": 1,
  "teamId": null
}
```

Do not send:

```text
tournamentID
teamID
tournament_id
team_id
```

---

# 25. Registration Response

Expected structure:

```json
{
  "success": true,
  "message": "Tournament registration created successfully",
  "data": {
    "registration": {
      "id": 10,
      "tournamentId": 1,
      "userId": 5,
      "teamId": 3,
      "status": "pending",
      "registeredAt": "2026-08-16T10:00:00Z"
    }
  }
}
```

Frontend must use:

```javascript
data.registration.id
data.registration.tournamentId
data.registration.userId
data.registration.teamId
data.registration.status
data.registration.registeredAt
```

---

# 26. Phase 5 — Team Management

Create:

```text
src/pages/participant/
└── teams/

src/components/team/
├── TeamCard.jsx
├── TeamForm.jsx
├── TeamMemberList.jsx
└── AddTeamMember.jsx

src/services/
└── teamService.js
```

Suggested pages:

```text
/participant/teams
/participant/teams/:id
```

---

# 27. Team Data Contract

Team object:

```text
id
tournamentId
name
captainId
createdAt
updatedAt
```

Example:

```json
{
  "id": 5,
  "tournamentId": 1,
  "name": "Team Alpha",
  "captainId": 10,
  "createdAt": "2026-08-16T10:00:00Z",
  "updatedAt": "2026-08-16T10:00:00Z"
}
```

---

# 28. Team Member Data Contract

Team member:

```text
id
teamId
userId
joinedAt
```

If backend returns user information with a team member, use the exact nested name:

```json
{
  "id": 1,
  "teamId": 5,
  "userId": 10,
  "joinedAt": "2026-08-16T10:00:00Z",
  "user": {
    "id": 10,
    "name": "Akash",
    "email": "akash@example.com"
  }
}
```

Do not rename:

```text
user
```

to:

```text
member
player
userData
```

---

# 29. Team Creation

Request:

```json
{
  "tournamentId": 1,
  "name": "Team Alpha"
}
```

The backend determines the authenticated user from authentication information.

Do not trust a frontend-supplied `captainId` for normal team creation.

---

# 30. Phase 6 — Participant Dashboard

Create:

```text
src/pages/participant/Dashboard.jsx
```

Dashboard can display:

```text
Upcoming Tournaments
Active Registrations
Completed Tournaments
Teams
Profile
```

Do not create live match information.

---

# 31. Participant "My Tournaments"

Create:

```text
src/pages/participant/MyTournaments.jsx
```

Tabs:

```text
Upcoming
Active
Completed
Cancelled
```

Data should come from registrations and tournament information provided by the backend.

Frontend should not directly query the database.

---

# 32. Participant Profile

Page:

```text
/participant/profile
```

Fields:

```text
name
email
phone
gamingPreferences
```

Email may be displayed as read-only depending on backend authentication rules.

---

# 33. Phase 7 — Organizer

Create:

```text
src/pages/organizer/
├── Dashboard.jsx
├── MyTournaments.jsx
├── CreateTournament.jsx
├── TournamentDetails.jsx
├── EditTournament.jsx
├── TournamentParticipants.jsx
└── OrganizationProfile.jsx

src/services/
└── tournamentService.js
```

The same tournament service can be used by participant and organizer pages.

Do not create duplicate API services such as:

```text
participantTournamentService.js
organizerTournamentService.js
```

unless there is a real architectural reason.

---

# 34. Organization Data Contract

Organization:

```text
id
userId
name
email
phone
address
organizationType
createdAt
updatedAt
```

---

# 35. Organizer Tournament Creation Form

Fields:

```text
title
game
description
mode
venue
date
startTime
endTime
teamSize
maxParticipants
registrationType
registrationFee
registrationDeadline
prizePool
rules
```

Do not change the names.

Example request:

```json
{
  "title": "Mumbai Valorant Championship",
  "game": "Valorant",
  "description": "College gaming tournament",
  "mode": "offline",
  "venue": "XYZ College",
  "date": "2026-09-10",
  "startTime": "10:00",
  "endTime": "18:00",
  "teamSize": 5,
  "maxParticipants": 100,
  "registrationType": "team",
  "registrationFee": 500,
  "registrationDeadline": "2026-09-08",
  "prizePool": 10000,
  "rules": "Standard tournament rules"
}
```

---

# 36. Tournament Status

Frontend displays the backend-provided status.

Allowed Version 1 statuses:

```text
draft
open
closed
completed
cancelled
```

Do not create:

```text
live
fixture
inProgress
matchStarted
```

for Version 1.

---

# 37. Organizer Dashboard

Dashboard should show:

```text
Total Tournaments
Open Tournaments
Completed Tournaments
Total Participants
Total Registrations
```

If the backend provides dashboard statistics, use the exact response fields defined by the backend.

Do not calculate important business statistics incorrectly on the frontend.

---

# 38. Organizer Participant List

Page:

```text
/organizer/tournaments/:id/participants
```

Display:

```text
name
email
phone
teamName
registrationId
registrationStatus
paymentStatus
registeredAt
```

If these are nested inside the API response, preserve the backend-defined structure.

---

# 39. Phase 8 — Payment

Create:

```text
src/components/payment/
src/pages/participant/Payment.jsx
src/pages/participant/PaymentSuccess.jsx
src/pages/participant/PaymentFailed.jsx

src/services/paymentService.js
```

The exact payment provider can be decided during backend implementation.

Frontend must not assume payment success merely because the user clicked a button.

The backend/payment provider is the source of truth.

---

# 40. Payment Data Contract

Payment object:

```text
id
registrationId
userId
tournamentId
amount
transactionId
paymentMethod
status
createdAt
```

Status:

```text
pending
success
failed
refunded
```

---

# 41. Payment UI

Payment page should display:

```text
Tournament
Registration ID
Amount
Payment Method
Pay button
```

After backend confirmation:

```text
success → PaymentSuccess
failed → PaymentFailed
pending → PaymentPending
```

Do not show:

```text
success
```

based only on frontend state.

---

# 42. Phase 9 — Sponsors

Create:

```text
src/pages/sponsor/
├── Dashboard.jsx
├── Profile.jsx
├── Tournaments.jsx
└── TournamentDetails.jsx

src/components/sponsor/
├── SponsorCard.jsx
└── SponsorForm.jsx

src/services/
└── sponsorService.js
```

---

# 43. Sponsor Data Contract

Sponsor:

```text
id
companyName
email
phone
industry
website
preferredGames
preferredLocations
budgetRange
description
status
createdAt
updatedAt
```

---

# 44. Sponsor Form

Fields:

```text
companyName
email
phone
industry
website
preferredGames
preferredLocations
budgetRange
description
```

---

# 45. Tournament Sponsor Data

Tournament sponsor relationship:

```text
id
tournamentId
sponsorId
sponsorshipType
amount
status
createdAt
```

Do not create a separate frontend concept called:

```text
sponsorRequest
```

unless the backend API specifically defines it.

---

# 46. Phase 10 — Admin

Create only when the core application is working.

Structure:

```text
src/pages/admin/
├── Dashboard.jsx
├── Users.jsx
├── Organizers.jsx
├── Tournaments.jsx
├── Sponsors.jsx
├── Payments.jsx
└── Reports.jsx

src/components/admin/
├── AdminTable.jsx
├── StatusBadge.jsx
└── ConfirmAction.jsx

src/services/
└── adminService.js
```

---

# 47. Admin Dashboard

Show:

```text
Total Users
Total Organizers
Total Tournaments
Total Sponsors
Total Registrations
Total Payments
```

The backend should provide these statistics.

---

# 48. Admin Users

Page:

```text
/admin/users
```

Actions:

```text
View
Suspend
Activate
```

Do not permanently delete users from the frontend unless the backend explicitly supports it.

---

# 49. Admin Organizers

Page:

```text
/admin/organizers
```

Display:

```text
name
email
phone
organizationName
organizationType
status
createdAt
```

---

# 50. Admin Tournaments

Page:

```text
/admin/tournaments
```

Actions:

```text
View
Approve if required
Suspend/cancel if allowed
Delete if backend allows
```

The frontend must follow the backend's authorization rules.

---

# 51. Admin Sponsors

Page:

```text
/admin/sponsors
```

Display:

```text
companyName
email
industry
website
status
createdAt
```

---

# 52. Admin Payments

Page:

```text
/admin/payments
```

Display:

```text
paymentId
registrationId
userId
tournamentId
amount
transactionId
paymentMethod
status
createdAt
```

---

# 53. Admin Reports

Initial reports:

```text
Tournament count
User count
Registration count
Payment count
Sponsor count
```

Charts can be added later.

Do not make the reporting system unnecessarily complicated.

---

# 54. API Service Structure

All API communication must be centralized inside:

```text
src/services/
```

Services:

```text
authService.js
tournamentService.js
teamService.js
registrationService.js
paymentService.js
sponsorService.js
adminService.js
```

Components/pages should not contain large repeated `fetch()` calls.

Bad:

```javascript
fetch(...)
fetch(...)
fetch(...)
```

inside every page.

Preferred:

```text
Page
 ↓
Service function
 ↓
Fetch API
 ↓
Backend
```

---

# 55. Fetch API Standard

Use Fetch API.

Every service should follow the same general process:

```text
Create request
↓
Attach authentication information
↓
Send request
↓
Check response
↓
Parse JSON
↓
Return useful data
↓
Component handles UI state
```

The exact implementation can vary.

---

# 56. GET Request Example Contract

Endpoint:

```text
GET /api/tournaments/:id
```

Frontend receives:

```json
{
  "success": true,
  "message": "Tournament fetched successfully",
  "data": {
    "tournament": {
      "id": 1,
      "title": "Mumbai Championship",
      "game": "Valorant",
      "mode": "offline",
      "venue": "XYZ College",
      "date": "2026-09-10",
      "startTime": "10:00",
      "endTime": "18:00",
      "teamSize": 5,
      "maxParticipants": 100,
      "registrationType": "team",
      "registrationFee": 500,
      "registrationDeadline": "2026-09-08",
      "prizePool": 10000,
      "rules": "Tournament rules",
      "status": "open"
    }
  }
}
```

Frontend:

```javascript
data.tournament
```

---

# 57. POST Request Contract

Example:

```text
POST /api/tournaments
```

Request body:

```json
{
  "title": "Mumbai Championship",
  "game": "Valorant",
  "description": "College tournament",
  "mode": "offline",
  "venue": "XYZ College",
  "date": "2026-09-10",
  "startTime": "10:00",
  "endTime": "18:00",
  "teamSize": 5,
  "maxParticipants": 100,
  "registrationType": "team",
  "registrationFee": 500,
  "registrationDeadline": "2026-09-08",
  "prizePool": 10000,
  "rules": "Tournament rules"
}
```

Do not modify the field names.

---

# 58. Authentication Request

Registration:

```json
{
  "name": "Akash",
  "email": "akash@example.com",
  "password": "password",
  "phone": "9999999999",
  "role": "participant"
}
```

Login:

```json
{
  "email": "akash@example.com",
  "password": "password"
}
```

---

# 59. API Endpoint Contract

## Authentication

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

---

## Users

```text
GET   /api/users/me
PUT   /api/users/me
```

---

## Organizations

```text
POST /api/organizations
GET  /api/organizations/me
PUT  /api/organizations/me
```

---

## Tournaments

```text
GET    /api/tournaments
GET    /api/tournaments/:id
POST   /api/tournaments
PUT    /api/tournaments/:id
DELETE /api/tournaments/:id
```

---

## Teams

```text
POST   /api/teams
GET    /api/teams
GET    /api/teams/:id
PUT    /api/teams/:id
DELETE /api/teams/:id

POST   /api/teams/:id/members
DELETE /api/teams/:id/members/:userId
```

---

## Registrations

```text
POST /api/registrations
GET  /api/registrations/me
GET  /api/registrations/:id
PUT  /api/registrations/:id/cancel
```

---

## Payments

```text
POST /api/payments
GET  /api/payments/:id
GET  /api/payments/me
```

---

## Sponsors

```text
POST /api/sponsors
GET  /api/sponsors
GET  /api/sponsors/:id
PUT  /api/sponsors/:id
```

---

## Tournament Sponsors

```text
POST   /api/tournaments/:id/sponsors
GET    /api/tournaments/:id/sponsors
DELETE /api/tournaments/:id/sponsors/:sponsorId
```

---

## Admin

```text
GET   /api/admin/users
PATCH /api/admin/users/:id/suspend
PATCH /api/admin/users/:id/activate

GET /api/admin/organizers

GET /api/admin/tournaments

GET /api/admin/sponsors

GET /api/admin/payments

GET /api/admin/reports
```

These endpoints form the initial frontend/backend contract.

If the backend team changes an endpoint, both teams must update their plans before changing frontend code.

---

# 60. Query Parameter Naming

Use these exact names:

```text
keyword
game
mode
registrationType
status
minFee
maxFee
page
limit
sort
```

Example:

```text
/api/tournaments?keyword=valorant&game=Valorant&mode=offline&page=1&limit=10
```

---

# 61. Pagination

When pagination is implemented, use:

```text
page
limit
```

Response:

```json
{
  "tournaments": [],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

Do not use:

```text
pageNumber
pageSize
currentPage
itemsPerPage
```

unless the shared contract is changed.

---

# 62. Loading State

Every API-driven page must consider:

```text
loading
success
empty
error
```

Example:

```text
Loading...
↓
Data
```

or:

```text
Loading...
↓
No tournaments found
```

or:

```text
Loading...
↓
Unable to load tournaments
```

Do not leave a blank screen during API loading.

---

# 63. Error Handling

Frontend must display user-friendly messages.

Backend error:

```json
{
  "success": false,
  "message": "Registration deadline has passed",
  "error": "REGISTRATION_CLOSED"
}
```

Frontend can display:

```text
Registration deadline has passed.
```

Do not expose technical stack traces to users.

---

# 64. Form Validation

Frontend validation should provide immediate feedback.

Examples:

```text
email → valid email format
password → minimum required length
phone → valid phone format
registrationFee → number
maxParticipants → positive number
teamSize → positive number
date → valid date
```

However:

> Frontend validation is for user experience. Backend validation is the final authority.

Never assume frontend validation is enough.

---

# 65. Date and Time

Use these API field names:

```text
date
startTime
endTime
registrationDeadline
createdAt
updatedAt
```

Frontend should format dates only for display.

Do not modify API field names because the UI displays them differently.

For example:

```text
API:
2026-09-10

UI:
10 September 2026
```

is acceptable.

But:

```text
API:
tournamentDate
```

is NOT acceptable.

---

# 66. UI State Rules

Every page should clearly separate:

```text
Server data
UI state
Form state
Authentication state
```

Example:

```text
Server data:
tournaments

UI state:
isLoading
error

Form state:
keyword
game
mode
```

Do not unnecessarily duplicate server data in multiple global states.

---

# 67. Component Naming Convention

Use PascalCase for React components.

Correct:

```text
TournamentCard.jsx
TournamentDetails.jsx
TournamentFilters.jsx
TeamCard.jsx
PaymentForm.jsx
```

Incorrect:

```text
tournamentcard.jsx
tournament_card.jsx
tournamentCard.jsx
```

---

# 68. Function Naming Convention

Use camelCase.

Examples:

```text
getTournaments()
getTournamentById()
createTournament()
updateTournament()
deleteTournament()

createTeam()
getTeamById()

registerForTournament()

createPayment()

getSponsors()
```

---

# 69. API Service Naming

Use:

```text
authService.js
tournamentService.js
teamService.js
registrationService.js
paymentService.js
sponsorService.js
adminService.js
```

Functions should correspond to backend operations.

Example:

```text
getTournaments()
getTournamentById()
createTournament()
updateTournament()
deleteTournament()
```

---

# 70. Route Protection

Create protected route logic.

Conceptually:

```text
Public Route
     ↓
Authenticated?
     ↓
No → Login
     ↓
Yes
     ↓
Role allowed?
     ↓
No → Unauthorized
     ↓
Yes → Page
```

Example:

```text
/admin/users
```

must require:

```text
authenticated = true
role = admin
```

---

# 71. Unauthorized Page

Create when route protection is implemented:

```text
src/pages/common/
└── Unauthorized.jsx
```

Optional:

```text
NotFound.jsx
```

Recommended final structure:

```text
src/pages/common/
├── Unauthorized.jsx
└── NotFound.jsx
```

---

# 72. API Authentication

All protected API requests must include the authentication mechanism agreed upon with the backend.

If JWT Bearer authentication is used:

```text
Authorization: Bearer <token>
```

Do not manually add authentication logic separately inside every page.

The API service layer should handle it centrally.

---

# 73. Never Store Secrets in Frontend

Never put:

```text
JWT_SECRET
DATABASE_PASSWORD
MYSQL_PASSWORD
PAYMENT_SECRET_KEY
PRIVATE_API_KEY
```

inside frontend `.env`.

Frontend environment variables are exposed to the browser.

Only public configuration such as:

```text
VITE_API_URL
```

belongs in the frontend environment.

---

# 74. Frontend/Backend Responsibility Boundary

## Frontend handles

```text
UI
Forms
Client-side validation
Navigation
Loading states
Displaying errors
Displaying API data
User interaction
Responsive design
```

## Backend handles

```text
Authentication verification
Authorization
Database
Business rules
Payment verification
Registration validation
Tournament ownership
Data integrity
Security
```

Frontend must not implement business rules that belong to backend.

Example:

Do NOT assume:

```text
registrationFee === 0
```

means:

```text
no payment required
```

The backend decides whether payment is required.

---

# 75. Tournament Ownership

Organizer pages must only display/manage tournaments allowed by the backend.

Frontend must not assume:

```text
organizerId === currentUser.id
```

is enough to authorize an operation.

The backend must verify ownership.

---

# 76. Sponsor Association

Frontend workflow:

```text
View Tournament
       ↓
View Sponsor Information
       ↓
Sponsor chooses tournament
       ↓
Submit sponsorship request/association
       ↓
Backend processes
       ↓
Frontend displays returned status
```

The frontend must use the exact:

```text
tournamentId
sponsorId
sponsorshipType
amount
status
```

fields.

---

# 77. No Direct Database Access

The frontend must NEVER directly connect to MySQL.

Incorrect:

```text
React → MySQL
```

Correct:

```text
React
 ↓
Fetch API
 ↓
Express API
 ↓
Service
 ↓
Prisma
 ↓
MySQL
```

---

# 78. Development Order

Follow this order.

## Phase 1

```text
Project setup
React
Vite
Environment variables
Basic routing
```

## Phase 2

```text
Common UI
Layouts
Navbar
Footer
Loader
Error handling
```

## Phase 3

```text
Register
Login
Logout
AuthContext
Protected routes
Role-based routes
```

## Phase 4

```text
Tournament listing
Search
Filters
Tournament details
```

## Phase 5

```text
Teams
Team members
Tournament registration
Participant dashboard
Participant history
```

## Phase 6

```text
Payment
Payment status
Payment history
```

## Phase 7

```text
Organizer dashboard
Organization profile
Tournament creation
Tournament editing
Participant management
```

## Phase 8

```text
Sponsor profile
Sponsor listing
Tournament sponsorship
```

## Phase 9

```text
Admin dashboard
Users
Organizers
Tournaments
Sponsors
Payments
Reports
```

## Phase 10

```text
UI polishing
Responsive design
Error handling
Testing
Performance
Deployment
```

---

# 79. Team Development Rules

Before starting a feature, the developer must check:

```text
1. Which page is required?
2. Which API endpoint is required?
3. What request fields are required?
4. What response fields are returned?
5. Which role can access it?
6. Which existing components can be reused?
7. Does a new component really need to be created?
```

---

# 80. AI Coding Agent Rules

Any AI coding agent working on this repository must follow these rules.

## Rule 1

Do not rename API fields.

## Rule 2

Do not change camelCase to snake_case.

## Rule 3

Do not create duplicate services unnecessarily.

## Rule 4

Do not create new API endpoints from the frontend.

## Rule 5

Do not directly access the database.

## Rule 6

Do not create features outside Version 1 without approval.

## Rule 7

Do not modify existing API contracts to make frontend code easier.

## Rule 8

Reuse existing components before creating new ones.

## Rule 9

Follow the existing folder structure.

## Rule 10

Create files only when the current development phase requires them.

## Rule 11

Do not introduce TypeScript if the project is defined as JavaScript.

## Rule 12

Do not replace Fetch API with another HTTP library without team approval.

## Rule 13

Do not modify backend field names.

## Rule 14

If an API response does not match this plan, report the mismatch instead of silently renaming fields.

---

# 81. API Contract Change Procedure

If the backend developer wants to change:

```text
registrationFee
```

to:

```text
fee
```

they must NOT simply change it.

The process is:

```text
Backend proposes change
        ↓
Frontend team notified
        ↓
frontendPlan.md updated
        ↓
backendPlan.md updated
        ↓
Frontend service updated
        ↓
Backend updated
        ↓
Testing
```

The same rule applies to:

```text
endpoint
request body
response structure
field name
field type
authentication
```

---

# 82. Testing Checklist

Before considering a frontend feature complete:

```text
[ ] Page loads
[ ] API request works
[ ] Correct HTTP method used
[ ] Correct endpoint used
[ ] Correct field names used
[ ] Loading state works
[ ] Empty state works
[ ] Error state works
[ ] Success state works
[ ] Form validation works
[ ] Authentication works
[ ] Role restriction works
[ ] Responsive UI works
[ ] No console errors
```

---

# 83. Git Development Rules

Frontend developers should create feature branches.

Examples:

```text
feature/frontend-auth
feature/frontend-tournaments
feature/frontend-teams
feature/frontend-payment
feature/frontend-sponsor
feature/frontend-admin
```

Do not directly work on the main branch.

Recommended workflow:

```text
main
  ↓
feature branch
  ↓
development
  ↓
Pull Request
  ↓
Review
  ↓
Merge
```

The exact Git workflow may be defined by the team's repository rules.

---

# 84. Frontend Definition of Done

A feature is complete only when:

```text
UI completed
+
API connected
+
Correct request fields
+
Correct response fields
+
Loading handled
+
Error handled
+
Validation handled
+
Authentication handled
+
Role access handled
+
Responsive design completed
+
No console errors
```

---

# 85. Final Frontend Architecture

The final architecture should look like:

```text
                    FRONTEND
                       │
                       ▼
                  React Pages
                       │
                       ▼
                React Components
                       │
                       ▼
                  Service Layer
                       │
                       ▼
                   Fetch API
                       │
                       ▼
              REST API / Backend
                       │
                       ▼
                 Authentication
                       │
                       ▼
                    Business
                     Logic
                       │
                       ▼
                     Prisma
                       │
                       ▼
                    MySQL
```

The frontend must remain responsible for presentation and user interaction, while the backend remains responsible for business logic, authorization, database operations, and data integrity.

---

# 86. Final Frontend Folder Structure

After all Version 1 features are implemented, the expected structure is:

```text
frontend/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── navbar/
│   │   ├── footer/
│   │   ├── tournament/
│   │   ├── team/
│   │   ├── sponsor/
│   │   ├── payment/
│   │   └── admin/
│   │
│   ├── pages/
│   │   ├── common/
│   │   │   ├── Unauthorized.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   │
│   │   ├── participant/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Tournaments.jsx
│   │   │   ├── TournamentDetails.jsx
│   │   │   ├── MyTournaments.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── PaymentFailed.jsx
│   │   │   └── teams/
│   │   │
│   │   ├── organizer/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyTournaments.jsx
│   │   │   ├── CreateTournament.jsx
│   │   │   ├── TournamentDetails.jsx
│   │   │   ├── EditTournament.jsx
│   │   │   ├── TournamentParticipants.jsx
│   │   │   └── OrganizationProfile.jsx
│   │   │
│   │   ├── sponsor/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Tournaments.jsx
│   │   │   └── TournamentDetails.jsx
│   │   │
│   │   └── admin/
│   │       ├── Dashboard.jsx
│   │       ├── Users.jsx
│   │       ├── Organizers.jsx
│   │       ├── Tournaments.jsx
│   │       ├── Sponsors.jsx
│   │       ├── Payments.jsx
│   │       └── Reports.jsx
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   ├── ParticipantLayout.jsx
│   │   ├── OrganizerLayout.jsx
│   │   ├── SponsorLayout.jsx
│   │   └── AdminLayout.jsx
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── tournamentService.js
│   │   ├── teamService.js
│   │   ├── registrationService.js
│   │   ├── paymentService.js
│   │   ├── sponsorService.js
│   │   └── adminService.js
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   └── useAuth.js
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── vite.config.js
```

---

# 87. Important Final Rule

This document is the **frontend source of truth**.

If a developer or AI agent is unsure about:

```text
field name
API endpoint
route
request body
response structure
folder location
component naming
feature scope
```

they must check `frontendPlan.md` first.

If the required information is not present, **do not invent a new convention**. Coordinate with the backend/team and update the plan before implementing the change.

The frontend implementation can change internally, but the **shared API/data contract must remain stable**.
