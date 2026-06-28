const importanceWeight = {
  High: 36,
  Medium: 22,
  Low: 10,
};

export function getHoursUntil(deadline) {
  if (!deadline) return 999;
  const diff = new Date(deadline).getTime() - Date.now();
  return diff / 36e5;
}

export function getDeadlineRisk(task) {
  if (task.status === "completed") return "Safe";

  const hoursLeft = getHoursUntil(task.deadline);
  const timeNeeded = Number(task.estimatedTime || 1);

  if (hoursLeft < 0) return "Overdue";
  if (hoursLeft <= timeNeeded * 1.1) return "Critical";
  if (hoursLeft <= timeNeeded * 2.25 || hoursLeft < 24) return "High";
  if (hoursLeft < 72) return "Medium";
  return "Low";
}

export function getPriorityScore(task) {
  const hoursLeft = Math.max(0, getHoursUntil(task.deadline));
  const timeNeeded = Number(task.estimatedTime || 1);
  const urgency = hoursLeft <= 0 ? 42 : Math.max(0, 42 - hoursLeft / 2);
  const effortPressure = Math.min(22, timeNeeded * 2.7);
  const statusPenalty = task.status === "completed" ? -70 : 0;

  return Math.max(
    0,
    Math.min(100, Math.round((importanceWeight[task.importance] || 16) + urgency + effortPressure + statusPenalty)),
  );
}

export function getPriorityLabel(score) {
  if (score >= 75) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}

export function formatDeadline(deadline) {
  if (!deadline) return "No deadline";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(deadline));
}

export function getTaskInsights(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "completed").length;
  const pending = tasks.filter((task) => task.status !== "completed").length;
  const highRisk = tasks.filter((task) => ["Critical", "High", "Overdue"].includes(getDeadlineRisk(task))).length;
  const overdue = tasks.filter((task) => getDeadlineRisk(task) === "Overdue").length;
  const highPriority = tasks.filter((task) => getPriorityScore(task) >= 75).length;
  const totalEstimated = tasks
    .filter((task) => task.status !== "completed")
    .reduce((sum, task) => sum + Number(task.estimatedTime || 0), 0);

  const completionRatio = total ? completed / total : 0;
  const riskPenalty = total ? Math.min(42, (highRisk / total) * 42) : 0;
  const overduePenalty = total ? Math.min(28, (overdue / total) * 28) : 0;
  const productivityScore = Math.max(0, Math.round(78 + completionRatio * 28 - riskPenalty - overduePenalty));

  return {
    total,
    completed,
    pending,
    highRisk,
    overdue,
    highPriority,
    totalEstimated,
    productivityScore: Math.min(100, productivityScore),
  };
}

export function sortByDecisionPriority(tasks) {
  return [...tasks].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
}
