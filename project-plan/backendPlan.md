# Tournament Platform — Backend Plan

> This document is the source of truth for backend development.
>
> Develop the backend phase-by-phase. Do NOT create every file at the beginning.
> Create folders/files only when the corresponding phase requires them.
>
> Internal implementation logic can change, but these must NOT change without agreement:
> - API endpoint names
> - HTTP methods
> - Request field names
> - Response field names
> - Database field names
> - Field casing
> - Roles
> - API response structure

---

# 1. Backend Overview

## Backend Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- REST API
- JavaScript
- dotenv

---

# 2. Development Order

```text
PHASE 1  → Backend Setup
PHASE 2  → Global Error Handling + API Foundation
PHASE 3  → Tournament Database + Model
PHASE 4  → Create Tournament
PHASE 5  → Edit / Delete / Draft Tournament
PHASE 6  → Publish / Unpublish Tournament
PHASE 7  → Public Tournament Listing
PHASE 8  → Search + Filter + Sort + Pagination
PHASE 9  → Tournament Details
PHASE 10 → Teams
PHASE 11 → Tournament Registration
PHASE 12 → Registration Management
PHASE 13 → Complete Tournament Testing
PHASE 14 → User Authentication + Profile
PHASE 15 → Sponsor Module
PHASE 16 → Admin Module
PHASE 17 → Security + Final Integration + Deployment
```

---

# 3. Version 1 Scope

## Included

```text
Tournament creation
Tournament editing
Tournament deletion
Tournament drafts
Tournament publishing
Tournament unpublishing
Public tournament listing
Tournament search
Tournament filtering
Tournament sorting
Tournament pagination
Tournament details
Individual registration
Team registration
Team creation
Team members
Registration management
Organizer dashboard data
User authentication
User profile
Sponsors
Admin
Global error handling
Validation
Authorization
```

## NOT Included in Version 1

```text
Live tournaments
Live scores
Fixtures
Match scheduling
Leaderboards
Live streaming
Chat
Real-time notifications
AI recommendations
Advanced analytics
Payment gateway
Refund system
```

These can be added later if required.

---

# 4. Final Backend Folder Structure

Do NOT create this entire structure on Day 1.

```text
backend/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── config.js
│   │
│   ├── controllers/
│   │   ├── tournamentController.js
│   │   ├── teamController.js
│   │   ├── registrationController.js
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── sponsorController.js
│   │   └── adminController.js
│   │
│   ├── models/
│   │   ├── Tournament.js
│   │   ├── Team.js
│   │   ├── TeamMember.js
│   │   ├── Registration.js
│   │   ├── User.js
│   │   ├── Sponsor.js
│   │   └── TournamentSponsor.js
│   │
│   ├── routes/
│   │   ├── tournamentRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── sponsorRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── notFoundMiddleware.js
│   │
│   ├── utils/
│   │   ├── catchAsyncErrors.js
│   │   ├── errorHandler.js
│   │   ├── APIFilters.js
│   │   └── apiFeatures.js
│   │
│   ├── validators/
│   │   ├── tournamentValidator.js
│   │   ├── teamValidator.js
│   │   ├── registrationValidator.js
│   │   ├── authValidator.js
│   │   └── sponsorValidator.js
│   │
│   ├── services/
│   │   ├── tournamentService.js
│   │   ├── teamService.js
│   │   ├── registrationService.js
│   │   ├── authService.js
│   │   └── sponsorService.js
│   │
│   ├── app.js
│   └── server.js
│
├── seeders/
│   └── tournamentSeeder.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# PHASE 1 — Backend Project Setup

## Goal

Create the basic Express + MongoDB backend.

## Create only

```text
backend/
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── config.js
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Install

```bash
npm init -y
npm install express mongoose dotenv cors
npm install --save-dev nodemon
```

## Environment Variables

`.env`

```env
PORT=5000
NODE_ENV=DEVELOPMENT

DB_LOCAL_URI=mongodb://127.0.0.1:27017/tournament_platform

JWT_SECRET=your_secret_here
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

`.env.example`

```env
PORT=5000
NODE_ENV=DEVELOPMENT

DB_LOCAL_URI=

JWT_SECRET=
JWT_EXPIRE=7d

FRONTEND_URL=
```

## `db.js`

Responsible for:

```text
Connect to MongoDB
Handle connection errors
```

## `server.js`

Responsible for:

```text
Load environment variables
Start Express server
Connect database
Start server
```

## `app.js`

Responsible for:

```text
Create Express application
JSON middleware
CORS
Basic route
Middleware registration
```

## First Test

```http
GET /
```

Response:

```json
{
  "success": true,
  "message": "Tournament API is running"
}
```

---

# PHASE 2 — Global Error Handling + API Foundation

## Goal

Create reusable error handling before implementing tournament logic.

## Create

```text
src/
├── middleware/
│   ├── errorMiddleware.js
│   └── notFoundMiddleware.js
│
└── utils/
    ├── catchAsyncErrors.js
    └── errorHandler.js
```

## `errorHandler.js`

Create a custom error class containing:

```text
message
statusCode
```

Example:

```js
throw new ErrorHandler("Tournament not found", 404);
```

## `catchAsyncErrors.js`

Controllers should use a reusable async error wrapper instead of repeating try/catch blocks.

## `errorMiddleware.js`

Handle:

```text
Custom errors
Mongoose CastError
Mongoose ValidationError
Duplicate key errors
JWT errors
Unknown errors
```

Standard error response:

```json
{
  "success": false,
  "message": "Tournament not found",
  "error": "TOURNAMENT_NOT_FOUND"
}
```

## Common Error Codes

```text
VALIDATION_ERROR
NOT_FOUND
UNAUTHORIZED
FORBIDDEN
INTERNAL_SERVER_ERROR

TOURNAMENT_NOT_FOUND
TOURNAMENT_ALREADY_PUBLISHED
TOURNAMENT_ALREADY_UNPUBLISHED
TOURNAMENT_CLOSED
TOURNAMENT_FULL
REGISTRATION_CLOSED
REGISTRATION_DEADLINE_PASSED
ALREADY_REGISTERED

TEAM_NOT_FOUND
TEAM_FULL
ALREADY_TEAM_MEMBER
INVALID_TEAM

USER_NOT_FOUND
USER_ALREADY_EXISTS

SPONSOR_NOT_FOUND
ALREADY_SPONSORED
```

---

# PHASE 3 — Tournament Database + Model

## Goal

Create the tournament database model.

## Create

```text
src/
└── models/
    └── Tournament.js
```

## Tournament Schema

```text
Tournament
------------------------------------------------
_id
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

## Field Contract

### `organizationId`

```text
Type: ObjectId
Purpose: Identifies the organization that created the tournament.
```

### `title`

```text
Type: String
Required: Yes
```

### `game`

```text
Type: String
Examples:
Valorant
BGMI
Football
Cricket
Chess
```

### `description`

```text
Type: String
```

### `mode`

Allowed:

```text
online
offline
```

### `venue`

Required mainly when:

```text
mode = offline
```

### `date`

Tournament date.

### `startTime`

Tournament starting time.

### `endTime`

Tournament ending time.

### `teamSize`

Number of players required per team.

For individual tournaments:

```text
1
```

### `maxParticipants`

Maximum allowed participants.

### `registrationType`

Allowed:

```text
individual
team
```

### `registrationFee`

Number.

Use:

```text
0
```

for free tournaments.

### `registrationDeadline`

Last date/time for registration.

### `prizePool`

Number.

### `rules`

String containing tournament rules.

## Tournament Status

Allowed:

```text
draft
open
closed
completed
cancelled
```

Initial status:

```text
draft
```

When published:

```text
open
```

---

# PHASE 4 — Create Tournament

## Goal

Organizer can create a tournament.

## Create

```text
src/
├── controllers/
│   └── tournamentController.js
├── routes/
│   └── tournamentRoutes.js
└── validators/
    └── tournamentValidator.js
```

## API

```http
POST /api/tournaments
```

Authentication:

```text
Required
```

Role:

```text
organizer
```

## Request Body

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
  "rules": "Tournament rules"
}
```

## Backend Logic

```text
Authenticate user
        ↓
Check organizer role
        ↓
Validate request
        ↓
Validate date/time
        ↓
Validate registrationDeadline
        ↓
Create tournament
        ↓
status = draft
        ↓
Return tournament
```

Backend generates:

```text
organizationId
status
createdAt
updatedAt
```

Frontend must NOT decide these values.

## Response

```json
{
  "success": true,
  "message": "Tournament created successfully",
  "data": {
    "tournament": {}
  }
}
```

---

# PHASE 5 — Edit / Delete / Draft Tournament

## Goal

Organizer can manage tournaments before publishing.

## APIs

```http
GET    /api/tournaments/my
GET    /api/tournaments/:id
PUT    /api/tournaments/:id
DELETE /api/tournaments/:id
```

## `GET /api/tournaments/my`

Returns tournaments belonging to the authenticated organizer.

Response:

```json
{
  "success": true,
  "message": "Organizer tournaments fetched successfully",
  "data": {
    "tournaments": []
  }
}
```

## Update Logic

```text
Find tournament
        ↓
Check tournament exists
        ↓
Check organizer owns tournament
        ↓
Check tournament can be edited
        ↓
Validate data
        ↓
Update
```

## Delete Logic

```text
Find tournament
        ↓
Check ownership
        ↓
Check deletion allowed
        ↓
Delete
```

Another organizer must never be able to delete or edit this tournament.

---

# PHASE 6 — Publish / Unpublish Tournament

## Goal

Separate saving a tournament from making it visible on the platform.

## APIs

```http
PATCH /api/tournaments/:id/publish
PATCH /api/tournaments/:id/unpublish
```

## Publish Logic

```text
Find tournament
        ↓
Check ownership
        ↓
Validate all required fields
        ↓
Check registrationDeadline
        ↓
Check date
        ↓
Check maxParticipants
        ↓
status = open
        ↓
Publish
```

## Publish Validation

Before publishing:

```text
title exists
game exists
description exists
mode valid
date valid
startTime valid
endTime valid
teamSize valid
maxParticipants valid
registrationType valid
registrationFee valid
registrationDeadline valid
rules exists
```

## Publish Response

```json
{
  "success": true,
  "message": "Tournament published successfully",
  "data": {
    "tournament": {}
  }
}
```

## Unpublish Logic

```text
Find tournament
        ↓
Check ownership
        ↓
Check current status
        ↓
Change status
```

If allowed:

```text
open → draft
```

Do not allow invalid status transitions.

---

# PHASE 7 — Public Tournament Listing

## Goal

Published tournaments become visible to everyone.

## API

```http
GET /api/tournaments
```

Public endpoint.

## Important Rule

Only tournaments with:

```text
status = open
```

should appear in the normal public listing.

Draft tournaments must NOT appear.

Cancelled tournaments must NOT appear in normal public results.

## Response

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

---

# PHASE 8 — Search + Filter + Sort + Pagination

## Goal

Implement complete tournament discovery.

## Create

```text
src/
└── utils/
    ├── APIFilters.js
    └── apiFeatures.js
```

## `APIFilters.js`

Responsible for:

```text
Search
Filtering
```

## `apiFeatures.js`

Responsible for:

```text
Sorting
Pagination
```

These may be combined internally if needed, but the API behavior must remain the same.

## Search

Query:

```text
keyword
```

Example:

```http
GET /api/tournaments?keyword=valorant
```

Search primarily:

```text
title
game
```

Search is case-insensitive.

## Filters

Supported:

```text
game
mode
registrationType
minFee
maxFee
status
```

Public listing should automatically restrict results to:

```text
status=open
```

## Examples

```http
GET /api/tournaments?game=Valorant&mode=offline
```

```http
GET /api/tournaments?minFee=0&maxFee=1000
```

## Sorting

Query:

```text
sort
```

Examples:

```text
?sort=registrationFee
?sort=-registrationFee
?sort=date
?sort=-date
```

`-` means descending.

## Pagination

Query:

```text
page
limit
```

Example:

```http
GET /api/tournaments?page=2&limit=10
```

Response:

```json
{
  "success": true,
  "message": "Tournaments fetched successfully",
  "data": {
    "tournaments": [],
    "total": 50,
    "page": 2,
    "limit": 10
  }
}
```

## Combined Query

Frontend can send:

```http
GET /api/tournaments?keyword=valorant&game=Valorant&mode=offline&minFee=0&maxFee=1000&sort=date&page=1&limit=10
```

Backend processes all applicable parameters together.

---

# PHASE 9 — Tournament Details

## Goal

Allow users to view the complete tournament page.

## API

```http
GET /api/tournaments/:id
```

## Logic

```text
Find tournament by ID
        ↓
Check valid MongoDB ID
        ↓
Check tournament exists
        ↓
If public request:
    only return public tournament
        ↓
Return tournament
```

## Public Response

```json
{
  "success": true,
  "message": "Tournament fetched successfully",
  "data": {
    "tournament": {
      "id": "...",
      "title": "...",
      "game": "...",
      "description": "...",
      "mode": "offline",
      "venue": "...",
      "date": "...",
      "startTime": "...",
      "endTime": "...",
      "teamSize": 5,
      "maxParticipants": 100,
      "registrationType": "team",
      "registrationFee": 500,
      "registrationDeadline": "...",
      "prizePool": 10000,
      "rules": "...",
      "status": "open"
    }
  }
}
```

Do not expose sensitive organizer/user information unnecessarily.

---

# PHASE 10 — Teams

## Goal

Support team-based tournaments.

## Create

```text
src/
├── models/
│   ├── Team.js
│   └── TeamMember.js
├── controllers/
│   └── teamController.js
├── routes/
│   └── teamRoutes.js
├── services/
│   └── teamService.js
└── validators/
    └── teamValidator.js
```

## Team Schema

```text
Team
--------------------------------
_id
tournamentId
name
captainId
createdAt
updatedAt
```

## Team Member Schema

```text
TeamMember
--------------------------------
_id
teamId
userId
joinedAt
```

## APIs

```http
POST   /api/teams
GET    /api/teams/:id
PUT    /api/teams/:id
DELETE /api/teams/:id

POST   /api/teams/:id/members
DELETE /api/teams/:id/members/:userId
```

## Team Creation Logic

```text
Authenticate user
        ↓
Check tournament
        ↓
Check tournament registrationType = team
        ↓
Check tournament is open
        ↓
Check registration deadline
        ↓
Create team
        ↓
Authenticated user = captain
        ↓
Add captain as team member
```

Backend determines:

```text
captainId
```

from the authenticated user.

## Team Validation

Before adding member:

```text
Team exists
User exists
Tournament exists
User not already in team
Team has available slot
User is allowed to participate
```

## Team Size

Maximum team size comes from:

```text
Tournament.teamSize
```

Do not store a conflicting arbitrary team size.

---

# PHASE 11 — Tournament Registration

## Goal

Allow users to register for tournaments.

## Create

```text
src/
├── models/
│   └── Registration.js
├── controllers/
│   └── registrationController.js
├── routes/
│   └── registrationRoutes.js
├── services/
│   └── registrationService.js
└── validators/
    └── registrationValidator.js
```

## Registration Schema

```text
Registration
--------------------------------
_id
tournamentId
userId
teamId
status
registeredAt
createdAt
updatedAt
```

## Status

```text
pending
confirmed
cancelled
```

## Individual Registration Request

```json
{
  "tournamentId": "..."
}
```

Backend automatically determines:

```text
userId
```

## Team Registration Request

```json
{
  "tournamentId": "...",
  "teamId": "..."
}
```

Backend verifies:

```text
team belongs to tournament
user belongs to team
team is valid
```

## Registration API

```http
POST /api/tournaments/:id/register
```

## Registration Logic

```text
Authenticate user
        ↓
Find tournament
        ↓
Tournament exists?
        ↓
status = open?
        ↓
Registration deadline passed?
        ↓
Tournament full?
        ↓
Already registered?
        ↓
Check individual/team registration
        ↓
Validate team
        ↓
Create registration
        ↓
Return registration
```

Do NOT trust frontend values for:

```text
userId
status
registrationFee
tournament ownership
```

Backend determines these.

---

# PHASE 12 — Registration Management

## Goal

Organizer can see users/teams registered in their tournament.

## APIs

```http
GET /api/tournaments/:id/registrations
GET /api/registrations/me
GET /api/registrations/:id
PATCH /api/registrations/:id/cancel
```

## Organizer Registration Logic

```text
Authenticate organizer
        ↓
Find tournament
        ↓
Verify tournament ownership
        ↓
Get registrations
```

Organizer cannot view another organizer's private registration management endpoint.

## User Registration Logic

```text
Authenticate user
        ↓
Find registrations where userId = authenticated user
```

## Cancel Registration

```text
Find registration
        ↓
Check ownership
        ↓
Check cancellation allowed
        ↓
status = cancelled
```

---

# PHASE 13 — Complete Tournament Error Handling

Tournament errors must be tested individually.

## Tournament Errors

```text
TOURNAMENT_NOT_FOUND
INVALID_TOURNAMENT_DATA
INVALID_TOURNAMENT_ID
TOURNAMENT_ALREADY_PUBLISHED
TOURNAMENT_ALREADY_UNPUBLISHED
TOURNAMENT_CLOSED
TOURNAMENT_CANCELLED
TOURNAMENT_FULL
REGISTRATION_CLOSED
REGISTRATION_DEADLINE_PASSED
ALREADY_REGISTERED
UNAUTHORIZED_TOURNAMENT_ACCESS
```

## Team Errors

```text
TEAM_NOT_FOUND
TEAM_FULL
INVALID_TEAM
TEAM_NOT_BELONG_TO_TOURNAMENT
ALREADY_TEAM_MEMBER
USER_NOT_TEAM_MEMBER
```

## Registration Errors

```text
REGISTRATION_NOT_FOUND
ALREADY_REGISTERED
REGISTRATION_CLOSED
REGISTRATION_DEADLINE_PASSED
INVALID_REGISTRATION_TYPE
```

---

# PHASE 14 — Tournament Testing

Before moving to users, the entire tournament module must work.

```text
[ ] Create tournament
[ ] Validate invalid tournament
[ ] Save draft
[ ] Get organizer tournaments
[ ] Get tournament by ID
[ ] Edit tournament
[ ] Delete tournament
[ ] Publish tournament
[ ] Unpublish tournament
[ ] Public tournament listing
[ ] Search
[ ] Game filter
[ ] Mode filter
[ ] Registration type filter
[ ] Minimum fee
[ ] Maximum fee
[ ] Sorting
[ ] Pagination
[ ] Tournament details
[ ] Create team
[ ] Add team member
[ ] Remove team member
[ ] Individual registration
[ ] Team registration
[ ] Duplicate registration
[ ] Cancel registration
[ ] Organizer registration list
[ ] Unauthorized access
[ ] Invalid MongoDB ID
[ ] Missing required fields
[ ] Closed tournament
[ ] Full tournament
```

Only after these work should development move to the User module.

---

# PHASE 15 — User Module

## Goal

Build the user system after the tournament flow is complete.

## Create

```text
src/
├── models/
│   └── User.js
├── controllers/
│   ├── authController.js
│   └── userController.js
├── routes/
│   ├── authRoutes.js
│   └── userRoutes.js
├── services/
│   └── authService.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
└── validators/
    └── authValidator.js
```

## User Schema

```text
User
--------------------------------
_id
name
email
password
phone
role
gamingPreferences
createdAt
updatedAt
```

## Roles

```text
participant
organizer
sponsor
admin
```

Public registration must not allow:

```text
admin
```

## Authentication APIs

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## User APIs

```http
GET /api/users/me
PUT /api/users/me
```

## JWT Flow

```text
Login
 ↓
Validate credentials
 ↓
Generate JWT
 ↓
Client sends token
 ↓
authMiddleware
 ↓
Verify JWT
 ↓
req.user
```

Passwords must never be stored as plain text.

---

# PHASE 16 — Connect User With Tournament

Connect the user system to the already-built tournament system.

## Organizer

```text
User
 ↓
Organizer
 ↓
Creates tournament
```

## Participant

```text
User
 ↓
Participant
 ↓
Views tournament
 ↓
Registers
```

## Team

```text
User
 ↓
Participant
 ↓
Creates team
 ↓
Registers team
```

## Authorization

Organizer can:

```text
Create tournament
Edit own tournament
Delete own tournament
Publish own tournament
View registrations of own tournament
```

Participant can:

```text
View tournaments
Search tournaments
Filter tournaments
View details
Create team
Register
View own registrations
Cancel own registration
```

Participant cannot:

```text
Edit another organizer's tournament
Delete tournament
Publish tournament
View another organizer's private registrations
```

---

# PHASE 17 — Sponsor Module

## Goal

Add sponsorship after the complete tournament + user flow works.

## Create

```text
src/
├── models/
│   ├── Sponsor.js
│   └── TournamentSponsor.js
├── controllers/
│   └── sponsorController.js
├── routes/
│   └── sponsorRoutes.js
├── services/
│   └── sponsorService.js
└── validators/
    └── sponsorValidator.js
```

## Sponsor Schema

```text
Sponsor
--------------------------------
_id
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

## Tournament Sponsor Schema

```text
TournamentSponsor
--------------------------------
_id
tournamentId
sponsorId
sponsorshipType
amount
status
createdAt
updatedAt
```

## Sponsor APIs

```http
POST /api/sponsors
GET  /api/sponsors
GET  /api/sponsors/:id
PUT  /api/sponsors/:id
```

## Tournament Sponsorship APIs

```http
POST   /api/tournaments/:id/sponsors
GET    /api/tournaments/:id/sponsors
DELETE /api/tournaments/:id/sponsors/:sponsorId
```

---

# PHASE 18 — Admin Module

## Goal

Admin is implemented only after all main platform modules exist.

## Create

```text
src/
├── controllers/
│   └── adminController.js
├── routes/
│   └── adminRoutes.js
└── services/
    └── adminService.js
```

Admin routes require:

```text
authMiddleware
+
roleMiddleware("admin")
```

## Admin APIs

### Users

```http
GET   /api/admin/users
PATCH /api/admin/users/:id/suspend
PATCH /api/admin/users/:id/activate
```

### Tournaments

```http
GET    /api/admin/tournaments
GET    /api/admin/tournaments/:id
DELETE /api/admin/tournaments/:id
```

### Sponsors

```http
GET /api/admin/sponsors
```

### Registrations

```http
GET /api/admin/registrations
```

## Basic Dashboard Statistics

```text
totalUsers
totalOrganizers
totalTournaments
totalOpenTournaments
totalRegistrations
totalSponsors
```

Do not build complicated analytics for Version 1.

---

# PHASE 19 — API Security + Final Validation

After all modules are complete:

```text
Authentication
Authorization
Input validation
CORS
Environment variables
Password hashing
JWT validation
MongoDB validation
Error handling
Rate limiting if required
```

Never expose:

```text
password
JWT secret
database URI
private environment variables
```

---

# PHASE 20 — Final Frontend/Backend Integration

Final flow:

```text
FRONTEND
   ↓
fetch()
   ↓
BACKEND API
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Mongoose Model
   ↓
MongoDB
   ↓
Response
   ↓
FRONTEND
```

---

# 5. API Naming Contract

All JSON field names must use camelCase.

Correct:

```text
tournamentId
organizationId
teamId
registrationId
sponsorId

registrationFee
maxParticipants
registrationDeadline

startTime
endTime

captainId
userId

sponsorshipType
```

Never change them to:

```text
tournament_id
organization_id
team_id
registration_fee
max_participants
```

Case sensitivity matters.

---

# 6. Standard API Response

Every successful API:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

For lists:

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

For errors:

```json
{
  "success": false,
  "message": "Tournament not found",
  "error": "TOURNAMENT_NOT_FOUND"
}
```

---

# 7. Frontend/Backend Contract

Frontend `fetch()` requests must use the exact backend field names.

Example:

```js
fetch("/api/tournaments", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        title,
        game,
        description,
        mode,
        venue,
        date,
        startTime,
        endTime,
        teamSize,
        maxParticipants,
        registrationType,
        registrationFee,
        registrationDeadline,
        prizePool,
        rules
    })
});
```

Backend must expect exactly:

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

Do not rename fields while implementing.

---

# 8. Database Collections

Final Version 1 collections:

```text
users
organizations
tournaments
teams
teammembers
registrations
sponsors
tournamentsponsors
```

---

# 9. Database Relationships

```text
USER
 │
 ├────────────── ORGANIZATION
 │                    │
 │                    ▼
 │               TOURNAMENT
 │                    │
 │             ┌──────┴──────┐
 │             ▼             ▼
 │           TEAM       REGISTRATION
 │             │             │
 │             ▼             ▼
 │        TEAM MEMBER       USER
 │
 └────────────── SPONSOR
                       │
                       ▼
              TOURNAMENT SPONSOR
                       │
                       ▼
                   TOURNAMENT
```

---

# 10. API Route Structure

```text
/api
│
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   └── GET  /me
│
├── /users
│   ├── GET /me
│   └── PUT /me
│
├── /tournaments
│   ├── GET    /
│   ├── POST   /
│   ├── GET    /my
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── DELETE /:id
│   ├── PATCH  /:id/publish
│   ├── PATCH  /:id/unpublish
│   ├── POST   /:id/register
│   ├── GET    /:id/registrations
│   └── GET    /:id/sponsors
│
├── /teams
│   ├── POST   /
│   ├── GET    /:id
│   ├── PUT    /:id
│   ├── DELETE /:id
│   ├── POST   /:id/members
│   └── DELETE /:id/members/:userId
│
├── /registrations
│   ├── GET   /me
│   ├── GET   /:id
│   └── PATCH /:id/cancel
│
├── /sponsors
│   ├── POST /
│   ├── GET /
│   ├── GET /:id
│   └── PUT /:id
│
└── /admin
    ├── GET /users
    ├── GET /tournaments
    ├── GET /registrations
    └── GET /sponsors
```

---

# 11. Development Rule — Create Files Only When Needed

Do NOT create all future files on Day 1.

## Day 1

Create:

```text
config/
app.js
server.js
```

## Tournament database

Create:

```text
models/Tournament.js
```

## Tournament errors

Create:

```text
utils/errorHandler.js
utils/catchAsyncErrors.js
middleware/errorMiddleware.js
```

## Tournament creation

Create:

```text
controllers/tournamentController.js
routes/tournamentRoutes.js
validators/tournamentValidator.js
```

## Search/filter

Create:

```text
utils/APIFilters.js
utils/apiFeatures.js
```

## Teams

Create:

```text
models/Team.js
models/TeamMember.js
controllers/teamController.js
routes/teamRoutes.js
services/teamService.js
validators/teamValidator.js
```

## Registration

Create:

```text
models/Registration.js
controllers/registrationController.js
routes/registrationRoutes.js
services/registrationService.js
validators/registrationValidator.js
```

Continue the same approach for later phases.

---

# 12. Service Layer Rule

Services are used when business logic becomes large or reusable.

Example:

```text
registrationController.js
        ↓
registrationService.js
        ↓
Registration.js
        ↓
MongoDB
```

Controller:

```text
Receive request
Call service
Return response
```

Service:

```text
Business logic
Database operations
Complex validation
Transactions if required
```

Do not put huge business logic inside routes.

---

# 13. Tournament Definition of Complete

The tournament module is complete only when this entire flow works:

```text
ORGANIZER
    ↓
Create Tournament
    ↓
Draft
    ↓
Edit
    ↓
Validate
    ↓
Publish
    ↓
OPEN TO PUBLIC
    ↓
USER
    ↓
Search
    ↓
Filter
    ↓
Sort
    ↓
Pagination
    ↓
Tournament Details
    ↓
Register
    ↓
Registration Stored
    ↓
ORGANIZER
    ↓
View Registrations
```

---

# 14. Future Features

If the project appears too small after Version 1, possible Version 2 features:

```text
Payment gateway
Live tournaments
Fixtures
Match scheduling
Live scores
Leaderboard
Notifications
Chat
Streaming integration
AI tournament recommendations
Advanced sponsor matching
Advanced analytics
```

These must NOT be added while the core tournament flow is incomplete.

---

# 15. Definition of Done

A phase is complete only when:

```text
[ ] Required folders created
[ ] Required files created
[ ] Database model completed
[ ] API route completed
[ ] Controller completed
[ ] Service completed if required
[ ] Validation completed
[ ] Authentication checked
[ ] Authorization checked
[ ] Error handling completed
[ ] API tested
[ ] Response format verified
[ ] Field names verified
[ ] Frontend contract verified
```

---

# 16. AI Coding Agent Rules

Any AI agent working on this backend MUST:

```text
1. Read backendPlan.md before modifying code.

2. Do not rename existing fields.

3. Do not change field casing.

4. Do not change existing API endpoints without agreement.

5. Do not create unnecessary files.

6. Do not create future-phase modules early.

7. Do not add live tournament functionality.

8. Do not add fixtures unless explicitly requested.

9. Do not add payment gateway unless explicitly requested.

10. Do not trust userId from frontend.

11. Do not trust organizationId from frontend.

12. Do not trust role from frontend.

13. Do not trust registration status from frontend.

14. Do not trust tournament ownership from frontend.

15. Validate all request data.

16. Check authorization on the backend.

17. Use centralized error handling.

18. Keep API response structure consistent.

19. Use camelCase for all API fields.

20. Do not change database relationships without updating this plan.

21. When adding a new feature, first identify its phase.

22. Create only folders/files required for that phase.

23. Do not rewrite working modules unnecessarily.

24. Keep frontend/backend field names identical.

25. Test existing APIs after modifying shared code.
```

---

# 17. Final Backend Architecture

```text
                         FRONTEND
                            │
                            │ fetch()
                            ▼
                      EXPRESS API
                            │
                            ▼
                         ROUTES
                            │
                            ▼
                    MIDDLEWARE
                 ┌──────────┴──────────┐
                 │                     │
          Authentication          Validation
                 │                     │
                 └──────────┬──────────┘
                            ▼
                       CONTROLLER
                            │
                            ▼
                        SERVICE
                            │
                            ▼
                      MONGOOSE MODEL
                            │
                            ▼
                         MONGODB
```

---

# 18. Final Development Priority

The team must prioritize the project in this exact order:

```text
1. Backend setup
2. Global error handling
3. Tournament model
4. Create tournament
5. Draft tournament
6. Edit tournament
7. Delete tournament
8. Publish tournament
9. Unpublish tournament
10. Public tournament listing
11. Search
12. Filters
13. Sorting
14. Pagination
15. Tournament details
16. Teams
17. Registration
18. Registration management
19. Complete tournament testing
20. User authentication
21. User profile
22. Sponsor system
23. Admin system
24. Final integration
25. Deployment
```

---

# 19. Core Principle

The project should first prove that it works as a tournament platform.

The most important Version 1 flow is:

```text
CREATE
  ↓
DRAFT
  ↓
EDIT
  ↓
PUBLISH
  ↓
DISCOVER
  ↓
SEARCH
  ↓
FILTER
  ↓
VIEW
  ↓
REGISTER
  ↓
MANAGE REGISTRATIONS
```

Everything else is built around this core.
