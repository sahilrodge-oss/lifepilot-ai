# Deployment And GitHub Guide

## 1. Verify Environment

Make sure `.env` has these values:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_GEMINI_API_KEY=
VITE_GEMINI_MODEL=gemini-2.5-flash-lite
VITE_GEMINI_FALLBACK_MODELS=gemini-2.5-flash-lite,gemini-2.5-flash
VITE_GEMINI_VOICE_MODEL=gemini-2.5-flash-lite
VITE_GEMINI_VOICE_FALLBACK_MODELS=gemini-2.5-flash-lite
VITE_GOOGLE_CLIENT_ID=
```

Do not commit `.env`.

## 2. Build

```bash
npm.cmd run build
```

## 3. Deploy To Firebase Hosting

Make sure Firebase CLI is logged in:

```bash
firebase login
```

Select the Firebase project:

```bash
firebase use lifepilot-ai-7d185
```

Deploy hosting and Firestore rules:

```bash
firebase deploy
```

Expected live links:

```text
https://lifepilot-ai-7d185.web.app
https://lifepilot-ai-7d185.firebaseapp.com
```

## 4. Update Google/Firebase Authorized URLs

After deployment, update Firebase and Google Cloud.

Firebase Authentication authorized domains:

```text
lifepilot-ai-7d185.web.app
lifepilot-ai-7d185.firebaseapp.com
```

Google Cloud OAuth Authorized JavaScript origins:

```text
http://localhost:5174
https://lifepilot-ai-7d185.web.app
https://lifepilot-ai-7d185.firebaseapp.com
```

## 5. Push To GitHub

Create a GitHub repository named:

```text
lifepilot-ai
```

Then run:

```bash
git add .
git commit -m "Prepare LifePilot AI hackathon submission"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lifepilot-ai.git
git push -u origin main
```

If remote already exists:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/lifepilot-ai.git
git push -u origin main
```

## 6. Final Submission

Submit:

- Firebase Hosting live app link
- GitHub repository link
- Google Doc report link
