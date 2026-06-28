import { useEffect, useState } from "react";
import { subscribeLatestAiPlan, subscribeTasks, subscribeUserCollection } from "../services/taskService";

export function useTasks(userId) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return undefined;

    setLoading(true);
    return subscribeTasks(
      userId,
      (items) => {
        setTasks(items);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
  }, [userId]);

  return { tasks, loading, error };
}

export function useUserCollection(collectionName, userId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(userId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return undefined;

    setLoading(true);
    return subscribeUserCollection(
      collectionName,
      userId,
      (nextItems) => {
        setItems(nextItems);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );
  }, [collectionName, userId]);

  return { items, loading, error };
}

export function useLatestAiPlan(userId) {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    if (!userId) return undefined;
    return subscribeLatestAiPlan(userId, setPlan, () => setPlan(null));
  }, [userId]);

  return plan;
}
