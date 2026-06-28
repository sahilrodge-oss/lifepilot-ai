# LifePilot AI

LifePilot AI is an AI-powered deadline emergency and productivity companion for students, professionals, entrepreneurs, freelancers, creators, and everyday users.

It uses Google AI Studio and the Gemini API as the core AI tool to prioritize tasks, predict deadline risk, create emergency plans, break work into steps, and guide users toward finishing on time.

## Core Stack

- Vite + React
- Tailwind CSS
- Firebase Auth
- Firestore
- Gemini API from Google AI Studio
- Firebase Hosting

## MVP Features

- Real Firebase email/password auth
- Google Sign-In
- Firestore task storage
- Add task form with title, description, deadline, estimated time, importance, category, and status
- Gemini AI priority ranking
- Gemini AI daily planner
- Gemini AI task breakdown
- Gemini AI deadline risk prediction
- Gemini AI smart reminders
- AI productivity coach
- Google Calendar event creation
- Voice-enabled task input
- Emergency Mode
- Role-Based Mode
- Goals and habits
- Productivity score dashboard

## Setup

Install dependencies:

```bash
npm.cmd install
```

Create `.env` from `.env.example`:

```bash
copy .env.example .env
```

Add Firebase values from your Firebase project:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Add your Google AI Studio Gemini API key:

```text
VITE_GEMINI_API_KEY=
VITE_GEMINI_MODEL=gemini-2.5-flash-lite
VITE_GEMINI_FALLBACK_MODELS=gemini-2.5-flash-lite,gemini-2.5-flash
VITE_GEMINI_VOICE_MODEL=gemini-2.5-flash-lite
VITE_GEMINI_VOICE_FALLBACK_MODELS=gemini-2.5-flash-lite
VITE_GOOGLE_CLIENT_ID=
```

Run locally:

```bash
npm.cmd run dev
```

Build:

```bash
npm.cmd run build
```

Deploy to Firebase Hosting:

```bash
firebase login
firebase init hosting firestore
firebase deploy
```

## Firebase Collections

- `users`
- `tasks`
- `goals`
- `habits`
- `aiPlans`

## Demo Flow

1. User signs up.
2. User adds five mixed tasks.
3. Gemini gives priority ranking.
4. Gemini creates daily plan.
5. Gemini predicts deadline risk.
6. User marks a task complete.
7. Dashboard updates productivity score and alerts.
8. User connects Google Calendar and adds a task as an event.
9. User speaks a task and Gemini auto-fills the task form.

## Submission Docs

- [Submission checklist](SUBMISSION.md)
- [Submission requirements](docs/submission-requirements.md)
- [Hackathon report](docs/submission-report.md)
- [Google Doc report content](docs/google-doc-report.md)
- [Demo script](docs/demo-script.md)
- [Screenshot checklist](docs/screenshot-checklist.md)
- [Deployment and GitHub guide](docs/deployment-and-github.md)

## Notes

The app has a local demo preview when `.env` is missing so the UI can be reviewed immediately. Real hackathon judging should use Firebase and Gemini keys from your own Google AI Studio and Firebase projects.

For production, move Gemini calls to a trusted backend or Firebase Cloud Function so the API key is not exposed in browser code.
