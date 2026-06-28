const defaultBoard = {
  discover: [
    "Read both official problem statements and score them by user pain, feasibility, and demo clarity.",
    "Define the primary user, their current workaround, and the moment your product changes.",
    "List three non-negotiable MVP outcomes that can be shown live."
  ],
  build: [
    "Create the core flow first: input, processing, result, and feedback.",
    "Add one AI-assisted feature only if it makes the product meaningfully better.",
    "Keep data models simple enough to explain in the final pitch."
  ],
  ship: [
    "Prepare a three-minute demo script with a before-and-after story.",
    "Record backup screenshots or a short video in case live demo conditions fail.",
    "Polish empty states, loading states, and the first-run experience."
  ],
  pitch: [
    "Problem: who is stuck and what costs them time, money, or confidence?",
    "Solution: what does the product do in one sentence?",
    "Demo: show the shortest path from user input to useful outcome.",
    "Impact: explain why this deserves to exist after the hackathon."
  ]
};

const storageKey = "vibe2ship-sprint-board";
const problemStatement = document.querySelector("#problemStatement");

function getState() {
  const stored = localStorage.getItem(storageKey);
  if (!stored) {
    return { problem: "", ...defaultBoard };
  }

  try {
    return { ...defaultBoard, ...JSON.parse(stored) };
  } catch {
    return { problem: "", ...defaultBoard };
  }
}

function saveState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function renderList(id, items) {
  const list = document.querySelector(id);
  list.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function render(state) {
  problemStatement.value = state.problem || "";
  renderList("#discoverTasks", state.discover);
  renderList("#buildTasks", state.build);
  renderList("#shipTasks", state.ship);
  renderList("#pitchList", state.pitch);
}

function createPlan(problem) {
  const trimmed = problem.trim();
  const topic = trimmed || "the selected Vibe2Ship problem statement";

  return {
    problem: trimmed,
    discover: [
      `Extract the target user, painful job, constraints, and success metric from: ${topic}`,
      "Interview or simulate three users and capture the exact workflow friction.",
      "Choose the narrowest use case that can produce a convincing live result."
    ],
    build: [
      "Ship the main flow as a clickable, data-backed prototype before adding secondary screens.",
      "Add validation, useful error messages, and one memorable product moment.",
      "Instrument a simple result summary so judges can see what changed."
    ],
    ship: [
      "Test the demo on a fresh browser profile and a mobile viewport.",
      "Write the pitch around the user transformation, not the tech stack.",
      "Prepare a fallback demo recording and final README screenshots."
    ],
    pitch: defaultBoard.pitch
  };
}

function updateDaysLeft() {
  const end = new Date("2026-06-29T14:00:00+05:30");
  const now = new Date();
  const diff = Math.max(0, end.getTime() - now.getTime());
  document.querySelector("#daysLeft").textContent = Math.ceil(diff / 86_400_000);
}

let state = getState();
render(state);
updateDaysLeft();

problemStatement.addEventListener("input", () => {
  state.problem = problemStatement.value;
  saveState(state);
});

document.querySelector("#generatePlan").addEventListener("click", () => {
  state = createPlan(problemStatement.value);
  saveState(state);
  render(state);
});

document.querySelector("#resetBoard").addEventListener("click", () => {
  state = { problem: "", ...defaultBoard };
  saveState(state);
  render(state);
});

document.querySelector("#saveSnapshot").addEventListener("click", async () => {
  const snapshot = JSON.stringify(state, null, 2);

  try {
    await navigator.clipboard.writeText(snapshot);
    document.querySelector("#saveSnapshot").textContent = "Copied";
    setTimeout(() => {
      document.querySelector("#saveSnapshot").textContent = "Save Snapshot";
    }, 1300);
  } catch {
    const blob = new Blob([snapshot], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vibe2ship-snapshot.json";
    link.click();
    URL.revokeObjectURL(url);
  }
});
