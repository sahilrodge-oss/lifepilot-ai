import { BrainCircuit, Gauge, Info, PlusCircle, Target, UserRound } from "lucide-react";

export const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/add-task", label: "Add Task", icon: PlusCircle },
  { to: "/ai-planner", label: "AI Planner", icon: BrainCircuit },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/about-project", label: "About Project", icon: Info },
  { to: "/profile", label: "Profile", icon: UserRound },
];
