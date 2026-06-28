import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "../config/firebase";
import {
  readDemoAiPlan,
  readDemoCollection,
  readDemoTasks,
  writeDemoAiPlan,
  writeDemoCollection,
  writeDemoTasks,
} from "./localStore";

function makeLocalId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function listenForLocalChange(callback) {
  window.addEventListener("lifepilot-local-change", callback);
  return () => window.removeEventListener("lifepilot-local-change", callback);
}

function getSortValue(value) {
  if (!value) return 0;
  if (typeof value === "string") return new Date(value).getTime();
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.seconds === "number") return value.seconds * 1000;
  return 0;
}

function sortNewestFirst(items) {
  return [...items].sort((a, b) => getSortValue(b.createdAt) - getSortValue(a.createdAt));
}

export function subscribeTasks(userId, onNext, onError) {
  if (!isFirebaseConfigured) {
    onNext(readDemoTasks());
    return listenForLocalChange(() => onNext(readDemoTasks()));
  }

  const taskQuery = query(collection(db, "tasks"), where("userId", "==", userId));
  return onSnapshot(taskQuery, (snapshot) => {
    onNext(sortNewestFirst(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
  }, onError);
}

export async function addTask(userId, task) {
  const payload = {
    ...task,
    userId,
    status: task.status || "pending",
    estimatedTime: Number(task.estimatedTime || 1),
  };

  if (!isFirebaseConfigured) {
    const tasks = readDemoTasks();
    writeDemoTasks([{ ...payload, id: makeLocalId("task"), createdAt: new Date().toISOString() }, ...tasks]);
    return;
  }

  await addDoc(collection(db, "tasks"), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateTask(userId, taskId, values) {
  if (!isFirebaseConfigured) {
    const tasks = readDemoTasks().map((task) => (task.id === taskId ? { ...task, ...values } : task));
    writeDemoTasks(tasks);
    return;
  }

  await updateDoc(doc(db, "tasks", taskId), {
    ...values,
    userId,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeUserCollection(collectionName, userId, onNext, onError) {
  if (!isFirebaseConfigured) {
    onNext(readDemoCollection(collectionName));
    return listenForLocalChange(() => onNext(readDemoCollection(collectionName)));
  }

  const userQuery = query(collection(db, collectionName), where("userId", "==", userId));
  return onSnapshot(userQuery, (snapshot) => {
    onNext(sortNewestFirst(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))));
  }, onError);
}

export async function addUserCollectionItem(collectionName, userId, item) {
  if (!isFirebaseConfigured) {
    const items = readDemoCollection(collectionName);
    writeDemoCollection(collectionName, [{ ...item, id: makeLocalId(collectionName), userId, createdAt: new Date().toISOString() }, ...items]);
    return;
  }

  await addDoc(collection(db, collectionName), {
    ...item,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateUserCollectionItem(collectionName, itemId, values) {
  if (!isFirebaseConfigured) {
    const items = readDemoCollection(collectionName).map((item) => (item.id === itemId ? { ...item, ...values } : item));
    writeDemoCollection(collectionName, items);
    return;
  }

  await updateDoc(doc(db, collectionName, itemId), {
    ...values,
    updatedAt: serverTimestamp(),
  });
}

export function subscribeLatestAiPlan(userId, onNext, onError) {
  if (!isFirebaseConfigured) {
    onNext(readDemoAiPlan());
    return listenForLocalChange(() => onNext(readDemoAiPlan()));
  }

  const planQuery = query(collection(db, "aiPlans"), where("userId", "==", userId));

  return onSnapshot(planQuery, (snapshot) => {
    const plans = sortNewestFirst(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
    onNext(plans[0] || null);
  }, onError);
}

export async function saveAiPlan(userId, plan) {
  const payload = {
    userId,
    plan,
    createdAt: new Date().toISOString(),
  };

  if (!isFirebaseConfigured) {
    writeDemoAiPlan({ id: makeLocalId("aiPlan"), ...payload });
    return;
  }

  await addDoc(collection(db, "aiPlans"), {
    userId,
    plan,
    createdAt: serverTimestamp(),
  });
}
