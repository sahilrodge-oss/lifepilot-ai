# Google Calendar Setup

LifePilot AI uses Google Identity Services and the Google Calendar API.

## Steps

1. Open Google Cloud Console.
2. Select the same project used for Firebase if possible.
3. Enable the Google Calendar API.
4. Configure the OAuth consent screen.
5. Create an OAuth Client ID for a Web application.
6. Add authorized JavaScript origins:
   - `http://localhost:5174`
   - Your Firebase Hosting URL after deployment, for example `https://your-project.web.app`
   - Only add `http://127.0.0.1:5174` if you open the app with `127.0.0.1` instead of `localhost`.
7. Copy the OAuth client ID into `.env`:

```text
VITE_GOOGLE_CLIENT_ID=your_web_oauth_client_id
```

## Scope Used

```text
https://www.googleapis.com/auth/calendar.events
```

## Behavior

- User clicks **Connect Google Calendar**.
- Google Identity Services returns a short-lived access token.
- LifePilot stores that token only in app state and `sessionStorage`.
- User clicks **Add to Google Calendar** on a task card.
- LifePilot creates a Calendar event with popup reminders 30 minutes and 1 day before the task.
