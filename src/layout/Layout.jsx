import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import MobileNavbar from "../components/MobileNavbar.jsx";
import SetupBanner from "../components/SetupBanner.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Toast from "../components/Toast.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { navItems } from "./navigation.js";

export default function Layout() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleLogout() {
    setMobileMenuOpen(false);
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100">
      <MobileNavbar
        navItems={navItems}
        user={user}
        profile={profile}
        open={mobileMenuOpen}
        onOpen={() => setMobileMenuOpen(true)}
        onClose={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
      />

      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <Sidebar navItems={navItems} user={user} profile={profile} onLogout={handleLogout} />

        <main className="min-w-0 flex-1 px-4 py-5 sm:px-5 md:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto grid w-full max-w-7xl gap-6">
            <SetupBanner />
            <Outlet />
          </div>
        </main>
      </div>

      <Toast />
    </div>
  );
}
