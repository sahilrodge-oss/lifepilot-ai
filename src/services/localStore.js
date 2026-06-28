import { demoProfile, demoTasks } from "../data/demoTasks";

const keys = {
  tasks: "lifepilot-demo-tasks",
  goals: "lifepilot-demo-goals",
  habits: "lifepilot-demo-habits",
  aiPlan: "lifepilot-demo-ai-plan",
  profile: "lifepilot-demo-profile",
};

function read(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("lifepilot-local-change", { detail: { key } }));
}

export function readDemoTasks() {
  return read(keys.tasks, demoTasks);
}

export function writeDemoTasks(tasks) {
  write(keys.tasks, tasks);
}

export function readDemoCollection(name) {
  const fallback = name === "goals" ? [] : [];
  return read(keys[name], fallback);
}

export function writeDemoCollection(name, value) {
  write(keys[name], value);
}

export function readDemoAiPlan() {
  return read(keys.aiPlan, null);
}

export function writeDemoAiPlan(value) {
  write(keys.aiPlan, value);
}

export function readDemoProfile() {
  return read(keys.profile, demoProfile);
}

export function writeDemoProfile(value) {
  write(keys.profile, value);
}
