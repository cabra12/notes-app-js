![CI](https://github.com/cabra12/notes-app-js/actions/workflows/ci.yml/badge.svg)

<div style="text-align: center;">
    <img width="650" src="images/Note-pic.png" alt="app showing a few multi-colored notes">
</div>

# Notes App

A full-stack notes app with full CRUD functionality. It's built with React + TypeScript on the frontend, Node.js/Express on the backend, and PostgreSQL (hosted on Neon) for persistence. Originally built as a vanilla JavaScript app, then migrated to a typed React architecture.

## Live Demo

[View Site](https://notes-app-jsadd.netlify.app/)

## Features

- Create, edit, and delete notes with a title, body, and category
- Filter notes by category, with dynamic category-colored UI
- Collapsible/expandable note cards with automatic overflow detection (only shows "View More" when text actually overflows)
- Persistent storage via a PostgreSQL database
- User-facing error handling for failed network requests
- Responsive grid layout

## Tech Stack

- **Frontend:** React, TypeScript, Vite, CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (Neon, serverless)
- **Testing:** Vitest, Supertest, React Testing Library
- **CI:** GitHub Actions
- **Security:** Helmet, express-rate-limit, Zod
- **Deployment:** Netlify (frontend), Render (backend)

## Architecture

```
frontend/          React + TypeScript app (Vite)
  src/
    components/    Header, FilterBar, Note, NoteModal, NotesContainer, ErrorBanner
    context/       NotesContext (shared state, avoids prop drilling)

app.js             Express app: middleware and CRUD routes for /notes
server.js          Starts the server (kept separate so tests can import app.js)
validation.js      Zod schema for note input
config/db.js       PostgreSQL connection pool (via pg)
tests/             Backend tests (Vitest + Supertest)
.github/workflows/ CI pipeline (GitHub Actions)
```

**API Endpoints:**
| Method | Route | Description |
|--------|-------|-------------|
| GET | /notes | Fetch all notes |
| GET | /notes/:id | Fetch a single note (404 if not found) |
| POST | /notes | Create a note (201 on success, 400 on invalid input) |
| PUT | /notes/:id | Update a note (400 on invalid input, 404 if not found) |
| DELETE | /notes/:id | Delete a note (404 if not found) |

Note input is validated with Zod: the title is required (max 100 characters), the category must be one of Personal, Work, Idea, or Journal, and the content is limited to 5000 characters.

## Running Locally

**Setup:**

Create a `.env` file in the project root:

```
DATABASE_URL=your_postgres_connection_string
```

Create the table in your database:

```sql
CREATE TABLE notes (
  id VARCHAR NOT NULL PRIMARY KEY,
  notetitle VARCHAR,
  notecategory VARCHAR,
  notecontent TEXT
);
```

The frontend reads its API address from `VITE_API_URL` and falls back to `http://localhost:3000` if it isn't set.

**Backend:**

```bash
npm install
npm run dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

## Testing

- **Backend (18 tests):** Vitest + Supertest cover all five routes, including failure cases (missing title, unknown ID, invalid category, oversized input), the security headers Helmet sets, and the rate limiter's 429 behavior (tested on a small standalone Express app).
- **Frontend (11 tests):** Vitest + React Testing Library cover `ErrorBanner`, `FilterBar`, and the `Note` card's "View More" overflow logic.
- Backend tests run against a separate `notes_test` Postgres database, never the production database.

```bash
# Backend (from the project root)
npm test

# Frontend
cd frontend
npm test
```

The backend tests use `TEST_DATABASE_URL` if it's set, and otherwise fall back to a local Postgres database named `notes_test`.

To create the local test database:

```bash
psql -c "CREATE DATABASE notes_test;"
psql notes_test -c "CREATE TABLE notes (id VARCHAR NOT NULL PRIMARY KEY, notetitle VARCHAR, notecategory VARCHAR, notecontent TEXT);"
```

## CI

A GitHub Actions workflow runs on every push to `main` and on every pull request, with two jobs:

- **backend:** starts a Postgres service container, creates the schema, and runs the backend tests
- **frontend:** runs the frontend tests, type-checks, and builds the app
- Render deploys the backend only after CI checks pass
- Merges to `main` require the `backend` and `frontend` checks to pass

## Security

- **Helmet** sets standard security headers
- **Rate limiting:** 100 requests per IP per 15 minutes
- **Input validation** with Zod on create and update
- **Parameterized queries** for all database access
- **CORS** restricted to an allowlist of origins
- Git history scanned with **gitleaks** (no findings)

## How it can be improved

- add message confirming if you would like to delete a card
- add auth to the project so database can be unique for each viewer
- add markdown or better formatting to the notes so bullets and headings can be featured
