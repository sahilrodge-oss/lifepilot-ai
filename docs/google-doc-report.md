# Google Doc Report Content

Copy this content into the final Google Doc and add screenshots where marked.

## LifePilot AI - Smart Deadline Emergency and Productivity Companion

### Problem Statement

Users often face deadline overload when assignments, office work, client tasks, bills, meetings, and personal commitments come together. Traditional to-do apps mostly store reminders, but they do not help users decide what to do first or how to recover when time is limited.

### Solution

LifePilot AI is an AI-powered deadline emergency assistant. It helps users prioritize urgent tasks, predict deadline risk, break work into steps, create a daily action plan, and stay focused during deadline overload.

### Target Users

LifePilot AI is built for students, working professionals, entrepreneurs, freelancers, creators, and general users.

### Key Features

- Firebase Auth login/signup
- Google Sign-In
- Firestore task storage
- Gemini AI priority ranking
- Gemini AI deadline risk prediction
- Gemini AI task breakdown
- Gemini AI daily planner
- Gemini AI smart reminder
- Gemini AI productivity coach
- Emergency Mode
- Role-Based Mode
- Goals and habits tracking
- Productivity score dashboard
- Voice-enabled task input
- Google Calendar event creation

### Google Technologies Used

- Google AI Studio
- Gemini API
- Firebase Authentication
- Firestore
- Firebase Hosting
- Google Identity Services
- Google Calendar API

### Gemini AI Usage

Gemini is the core AI engine. It analyzes task title, description, deadline, estimated time, importance, category, status, and user role mode. It returns structured JSON for priority, deadline risk, task breakdown, daily schedule, smart reminders, emergency planning, and productivity coaching.

Gemini also powers voice-enabled assistance. The user can speak or type a natural command, and Gemini extracts structured task data: title, description, deadline, estimated hours, importance, category, and smart reminder.

### Architecture

LifePilot AI uses Vite, React, and Tailwind CSS for the frontend. Firebase Authentication handles login and Google Sign-In. Firestore stores tasks, goals, habits, profiles, and AI plans. Gemini API generates AI productivity decisions. Google Calendar API creates calendar events from saved tasks. Firebase Hosting deploys the final web app.

### Demo Flow

1. User logs in with Google.
2. User adds five mixed deadline tasks.
3. Gemini ranks tasks by priority.
4. Gemini predicts deadline risk.
5. Gemini creates a daily plan and emergency plan.
6. User uses voice or typed command to create a task.
7. Gemini auto-fills the task form.
8. User saves task to Firestore.
9. User connects Google Calendar.
10. User adds task to Google Calendar.
11. User marks task complete.
12. Dashboard updates productivity score.

### Screenshots

Add screenshots for:

- Login page
- Dashboard
- Add Task page
- Voice command parse
- AI Planner
- Emergency Mode
- Google Calendar connected status
- Google Calendar event created
- Profile / Google technologies section

### Innovation

LifePilot AI is different from normal task managers because it acts as an AI decision-maker. It does not only remind users; it tells them what to start now, what is risky, what can be delayed, and how to complete work before deadlines.

### Challenges And Solutions

- Gemini high-demand errors were handled by using `gemini-2.5-flash-lite` and fallback behavior.
- Browser voice recognition can fail with `no-speech`, so the app includes a typed command fallback.
- Google Calendar OAuth required Authorized JavaScript origins in Google Cloud Console.

### Future Scope

- Browser notifications
- Email reminders
- Deeper Google Calendar sync
- Smart rescheduling
- Team productivity mode
- Firebase Cloud Functions for secure Gemini calls
- Mobile app version

### Submission Links

```text
Live app:
GitHub repository:
Demo video, if any:
```
