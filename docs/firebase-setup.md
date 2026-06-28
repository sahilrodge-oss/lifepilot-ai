# Firebase Setup

## 1. Create Project

Create a Firebase project for LifePilot AI.

## 2. Authentication

Enable:

- Email/password
- Google Sign-In

## 3. Firestore

Create Firestore in production or test mode during development.

Use these collections:

- `users`
- `tasks`
- `goals`
- `habits`
- `aiPlans`

Deploy the included rules:

```bash
firebase deploy --only firestore:rules
```

## 4. Web App Config

Create a Firebase web app and copy values into `.env`.

## 5. Hosting

Build and deploy:

```bash
npm.cmd run build
firebase deploy
```
