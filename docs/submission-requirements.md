# LifePilot AI Submission Requirements

Use this checklist before submitting LifePilot AI for evaluation.

## 1. Deployed Application Link

Submit a public, working app link deployed using Google infrastructure.

Recommended for this project:

```text
Firebase Hosting
```

Expected links after deploy:

```text
https://lifepilot-ai-7d185.web.app
https://lifepilot-ai-7d185.firebaseapp.com
```

Deployment commands:

```bash
npm.cmd run build
firebase.cmd login
firebase.cmd use lifepilot-ai-7d185
firebase.cmd deploy
```

Before submitting the link, test:

- [ ] Link opens in an incognito/private browser.
- [ ] Login page loads.
- [ ] Google Sign-In works.
- [ ] Dashboard opens after login.
- [ ] Add Task works.
- [ ] Gemini AI Planner works or shows clean fallback.
- [ ] Google Calendar connect works if OAuth origins are added.
- [ ] Mobile layout works.

Important OAuth settings after deployment:

Firebase Authentication authorized domains:

```text
lifepilot-ai-7d185.web.app
lifepilot-ai-7d185.firebaseapp.com
```

Google Cloud OAuth Authorized JavaScript origins:

```text
https://lifepilot-ai-7d185.web.app
https://lifepilot-ai-7d185.firebaseapp.com
```

## 2. GitHub Repository Link

Submit a GitHub repository containing project code and documentation.

Upload these:

```text
src/
assets/
docs/
README.md
SUBMISSION.md
package.json
package-lock.json
vite.config.js
index.html
firebase.json
firestore.rules
.firebaserc
.gitignore
```

Do not upload:

```text
.env
node_modules/
dist/
.firebase/
```

GitHub commands:

```bash
git add .
git commit -m "Prepare LifePilot AI hackathon submission"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lifepilot-ai.git
git push -u origin main
```

Before submitting the GitHub link:

- [ ] Repository is public, or judges have access.
- [ ] `.env` is not uploaded.
- [ ] README explains setup, features, and Google technologies.
- [ ] Docs folder includes report and demo material.

## 3. Project Description Google Doc Link

Create a Google Doc and paste content from:

```text
docs/google-doc-report.md
```

The Google Doc must include:

- [ ] Problem Statement Selected
- [ ] Solution Overview
- [ ] Key Features
- [ ] Technologies Used
- [ ] Google Technologies Utilized
- [ ] Screenshots
- [ ] Live app link
- [ ] GitHub repository link

Make the document accessible:

```text
Share > General access > Anyone with the link > Viewer
```

Before submitting:

- [ ] Open the Google Doc link in incognito/private browser.
- [ ] Confirm it does not ask for permission.
- [ ] Confirm screenshots are visible.
- [ ] Confirm live app and GitHub links are pasted correctly.

## Final Submission Format

```text
Deployed Application Link:
https://lifepilot-ai-7d185.web.app

GitHub Repository Link:
https://github.com/YOUR_USERNAME/lifepilot-ai

Project Description Google Doc Link:
PASTE_GOOGLE_DOC_LINK_HERE
```

## Official References

- Google AI Studio deployment docs: https://ai.google.dev/gemini-api/docs/aistudio-deploying
- Google Cloud Deploy docs: https://docs.cloud.google.com/deploy/docs
