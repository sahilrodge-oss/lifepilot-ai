# LifePilot AI Submission Report

## Project Name

LifePilot AI - Smart Deadline Emergency and Productivity Companion

## Problem Statement

Deadline overload and urgent task confusion. Students, professionals, entrepreneurs, freelancers, creators, and everyday users often face many tasks at the same time and struggle to decide what to do first before deadlines are missed.

## Solution

LifePilot AI is an AI-powered deadline emergency assistant that works like a decision-maker, not just a to-do list. It helps users prioritize tasks, detect deadline risk, break work into smaller steps, create a daily plan, and act immediately during deadline overload.

## Target Users

- Students handling assignments, exams, and projects
- Working professionals managing reports, meetings, and urgent deliverables
- Entrepreneurs and freelancers managing client work
- Creators and general users managing personal deadlines

## Core Features

- Firebase Auth email/password login and signup
- Google Sign-In
- Firestore task, goal, habit, profile, and AI plan storage
- Add task form with title, description, deadline, estimated time, importance, category, and status
- Gemini AI priority ranking
- Gemini AI deadline risk prediction
- Gemini AI task breakdown
- Gemini AI daily planner
- Gemini AI smart reminder
- Gemini AI productivity coach
- Emergency Mode for deadline overload
- Role-Based Mode for different user types
- Goals and habits tracking
- Productivity score dashboard
- Google Calendar event creation for saved tasks
- Voice-enabled task input with Gemini JSON extraction

## Innovation

LifePilot AI goes beyond traditional reminders by deciding what action matters most right now. Emergency Mode can identify risky deadlines, suggest what to start immediately, delay lower priority work, and create a survival plan. Voice input lets users speak a natural task command and have Gemini convert it into structured task data.

## Google Technologies Used

- Google AI Studio for Gemini API key creation
- Gemini API as the core AI engine
- Firebase Authentication for email/password and Google Sign-In
- Firestore for user data, tasks, goals, habits, and AI plans
- Firebase Hosting for public deployment
- Google Identity Services for Google Calendar OAuth
- Google Calendar API for creating task events

## Gemini AI Usage

Gemini receives task data such as title, description, deadline, estimated time, importance, category, status, and user role mode. It returns structured JSON for:

- Priority ranking
- Deadline risk warning
- Task breakdown
- Today's action plan
- Emergency survival plan
- Smart reminder
- Productivity coaching

Gemini is also used for voice-enabled assistance. When a user speaks or types a natural command, Gemini extracts structured JSON fields: title, description, deadline, estimatedHours, importance, category, and smartReminder.

## Architecture

LifePilot AI is a Vite React application styled with Tailwind CSS. Firebase Authentication manages user sessions. Firestore stores user-specific task and productivity data. Gemini API powers AI planning and voice task extraction. Google Identity Services provides a Calendar access token, and the Google Calendar API creates events from saved tasks. Firebase Hosting serves the final production build.

```text
User
  -> React UI
  -> Firebase Auth
  -> Firestore collections: users, tasks, goals, habits, aiPlans
  -> Gemini API for AI decisions and voice extraction
  -> Google Calendar API for task events
  -> Firebase Hosting for deployment
```

## Firestore Collections

- `users`
- `tasks`
- `goals`
- `habits`
- `aiPlans`

## Demo Flow

1. User signs up or logs in with Google.
2. User adds five mixed tasks.
3. Gemini ranks tasks by priority.
4. Gemini predicts deadline risk.
5. Gemini creates a daily plan and emergency plan.
6. User speaks or types a task command and Gemini auto-fills the task form.
7. User saves the task to Firestore.
8. User connects Google Calendar.
9. User adds a saved task to Google Calendar.
10. User marks one task complete.
11. Dashboard updates productivity score and task metrics.

## Suggested Demo Tasks

- Submit assignment tomorrow
- Prepare office report by Friday
- Follow up with client today
- Deliver freelance project in 2 days
- Pay electricity bill tonight

## Screenshots To Add In Google Doc

- Login page
- Dashboard with productivity score
- Add Task page
- Voice command and Gemini auto-fill
- AI Planner result
- Emergency Mode result
- Google Calendar connected badge
- Task added to Google Calendar
- Profile page showing Google technologies

## Testing Summary

- Production build passes with `npm.cmd run build`.
- Firebase config is loaded from `.env`.
- Gemini key is loaded from `.env`.
- Google Calendar OAuth client ID is loaded from `.env`.
- Calendar OAuth requires `http://localhost:5174` in Google Cloud Authorized JavaScript origins for local testing.

## Challenges Faced

- Gemini high-demand 503 errors were handled by using `gemini-2.5-flash-lite` for lightweight voice extraction and fallback behavior for demos.
- Browser speech recognition can return `no-speech`, so the app includes typed command fallback with Gemini parsing.
- Google Calendar OAuth requires a separate Google Cloud Authorized JavaScript origin, different from Firebase authorized domains.

## Future Scope

- Browser notifications
- Email reminders
- Deeper Google Calendar sync
- Smart rescheduling automation
- Mobile app version
- Team/shared task mode
- Firebase Cloud Function backend for secure Gemini calls
