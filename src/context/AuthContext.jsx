import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "../config/firebase";
import { demoProfile } from "../data/demoTasks";
import { ensureUserProfile } from "../services/userService";

const AuthContext = createContext(null);

const demoUser = {
  uid: "demo-user",
  displayName: "Demo Builder",
  email: "demo@lifepilot.ai",
  isDemo: true,
};

function shouldUseRedirectFallback(error) {
  return [
    "auth/popup-blocked",
    "auth/popup-closed-by-user",
    "auth/cancelled-popup-request",
  ].includes(error?.code);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(isFirebaseConfigured ? null : demoUser);
  const [profile, setProfile] = useState(isFirebaseConfigured ? null : demoProfile);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setProfile(currentUser ? await ensureUserProfile(currentUser) : null);
      setLoading(false);
    });
  }, []);

  async function login(email, password) {
    if (!isFirebaseConfigured) {
      throw new Error("Add Firebase environment variables to enable real login.");
    }

    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(name, email, password) {
    if (!isFirebaseConfigured) {
      throw new Error("Add Firebase environment variables to enable real signup.");
    }

    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    const nextProfile = await ensureUserProfile(credential.user, { displayName: name });
    setProfile(nextProfile);
  }

  async function loginWithGoogle() {
    if (!isFirebaseConfigured) {
      throw new Error("Add Firebase environment variables to enable Google Sign-In.");
    }

    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const nextProfile = await ensureUserProfile(credential.user);
      setProfile(nextProfile);
    } catch (error) {
      if (shouldUseRedirectFallback(error)) {
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      throw error;
    }
  }

  async function logout() {
    if (!isFirebaseConfigured) {
      setUser(demoUser);
      setProfile(demoProfile);
      return;
    }

    await signOut(auth);
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      setProfile,
      loading,
      login,
      signup,
      loginWithGoogle,
      logout,
      isFirebaseConfigured,
    }),
    [user, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
