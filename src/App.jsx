import { Navigate, Route, Routes } from "react-router-dom";
import AddTask from "./pages/AddTask.jsx";
import AIPlanner from "./pages/AIPlanner.jsx";
import AboutProject from "./pages/AboutProject.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import GoalsHabits from "./pages/GoalsHabits.jsx";
import Layout from "./layout/Layout.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Signup from "./pages/Signup.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-600">
        Loading LifePilot AI...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-task" element={<AddTask />} />
        <Route path="tasks/new" element={<Navigate to="/add-task" replace />} />
        <Route path="ai-planner" element={<AIPlanner />} />
        <Route path="planner" element={<Navigate to="/ai-planner" replace />} />
        <Route path="goals" element={<GoalsHabits />} />
        <Route path="about-project" element={<AboutProject />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
