import { FirebaseError } from "firebase/app";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/email-already-in-use":
    "An account with this email already exists. Try signing in instead.",
  "auth/invalid-email": "Enter a valid email address to continue.",
  "auth/weak-password": "Choose a password with at least 6 characters.",
  "auth/invalid-credential": "Incorrect email or password. Please try again.",
  "auth/user-not-found": "We couldn't find an account with that email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/too-many-requests":
    "Too many sign-in attempts. Please wait a moment and try again.",
  "auth/operation-not-allowed":
    "Email sign-in is not enabled. Contact the site administrator.",
  "auth/unauthorized-domain":
    "This domain is not authorized for sign-in. Add satwinder777.github.io in Firebase Authentication settings.",
  "auth/permission-denied":
    "Unable to access your vault. Verify Firestore security rules are configured correctly.",
  "auth/network-request-failed":
    "Connection issue detected. Check your network and try again.",
  "auth/invalid-api-key":
    "Authentication service is misconfigured. Rebuild with valid Firebase credentials.",
  "failed-precondition":
    "Vault query requires additional setup. Refresh the page after the latest deployment.",
};

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof FirebaseError && AUTH_ERROR_MESSAGES[error.code]) {
    return AUTH_ERROR_MESSAGES[error.code];
  }
  if (error instanceof Error) {
    if (error.message === "Firebase not configured") {
      return "Authentication is unavailable on this deployment.";
    }
    return error.message.replace(/^Firebase:\s*/i, "");
  }
  return "Authentication failed. Please try again.";
}
