import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../config/firebase";
import { demoProfile } from "../data/demoTasks";
import { readDemoProfile, writeDemoProfile } from "./localStore";

export async function ensureUserProfile(user, extra = {}) {
  if (!user) return null;

  if (!isFirebaseConfigured) {
    const profile = { ...readDemoProfile(), ...extra };
    writeDemoProfile(profile);
    return profile;
  }

  const ref = doc(db, "users", user.uid);
  const existing = await getDoc(ref);

  if (!existing.exists()) {
    const profile = {
      displayName: user.displayName || extra.displayName || "LifePilot User",
      email: user.email || "",
      roleMode: extra.roleMode || "General",
      dailyFocusHours: 6,
      stressLevel: "Medium",
      workWindow: "9:00 AM - 8:00 PM",
      goal: "Finish urgent work without panic.",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(ref, profile);
    return profile;
  }

  return existing.data();
}

export async function getUserProfile(userId) {
  if (!isFirebaseConfigured) return readDemoProfile();

  const ref = doc(db, "users", userId);
  const existing = await getDoc(ref);
  return existing.exists() ? existing.data() : demoProfile;
}

export async function updateUserProfile(userId, profile) {
  if (!isFirebaseConfigured) {
    writeDemoProfile(profile);
    return profile;
  }

  await setDoc(
    doc(db, "users", userId),
    {
      ...profile,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return profile;
}
