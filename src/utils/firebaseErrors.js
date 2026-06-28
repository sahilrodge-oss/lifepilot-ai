export function getFriendlyAuthError(error) {
  const code = error?.code || "";

  const messages = {
    "auth/operation-not-allowed": "Google Sign-In is not enabled. In Firebase Console, open Authentication > Sign-in method and enable Google.",
    "auth/unauthorized-domain": "This domain is not allowed for Firebase Auth. Add only localhost in Firebase Authentication > Settings > Authorized domains, without http:// and without a port.",
    "auth/popup-blocked": "The Google popup was blocked. Allow popups for this site, or try again so the app can use redirect sign-in.",
    "auth/popup-closed-by-user": "Google sign-in was closed before it finished. Try again and complete the Google account step.",
    "auth/cancelled-popup-request": "Another Google sign-in popup was already open. Close it and try again.",
    "auth/network-request-failed": "Network error during Google sign-in. Check internet connection and try again.",
    "auth/invalid-api-key": "Firebase API key is invalid. Recheck your Firebase web app config in .env.",
    "auth/app-deleted": "Firebase app config is invalid. Recheck your Firebase project settings.",
    "auth/user-disabled": "This account is disabled in Firebase Authentication.",
    "auth/user-not-found": "No account found for this email. Create an account first.",
    "auth/wrong-password": "Incorrect password.",
    "auth/invalid-credential": "Invalid login credential. Recheck your email/password or use Google Sign-In.",
    "auth/email-already-in-use": "This email is already registered. Login instead.",
    "auth/weak-password": "Password should be at least 6 characters.",
  };

  return messages[code] || error?.message || "Authentication failed. Please try again.";
}
