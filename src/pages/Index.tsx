// ─── Index.tsx — with real Supabase auth gating ──────────────────────────────
// Drop this file at:  src/pages/Index.tsx

import { useState, useCallback, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import LoginPage from "@/components/LoginPage";
import RoleSelectPage from "@/components/RoleSelectPage";
import StudentPage from "@/components/StudentPage";
import OwnerPage from "@/components/OwnerPage";
import HostelDetail from "@/components/HostelDetail";
import CommunityChat from "@/components/CommunityChat";
import ProfilePage from "@/components/ProfilePage";
import HelpPage from "@/components/HelpPage";
import ContactPage from "@/components/ContactPage";
import BottomNav from "@/components/BottomNav";
import WishlistsPage from "@/components/WishlistsPage";
import TripsPage from "@/components/TripsPage";
import MessagesPage from "@/components/MessagesPage";
import { Hostel, mockHostels } from "@/data/hostels";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Page =
  | "splash" | "role-select"
  | "login-student" | "login-owner"
  | "student" | "owner"
  | "detail" | "chat"
  | "profile" | "help" | "contact"
  | "wishlists" | "trips" | "messages";

type Tab = "explore" | "wishlists" | "trips" | "messages" | "profile";

const Index = () => {
  const { user, role, loading, signOut } = useAuth();

  const [page, setPage]                   = useState<Page>("splash");
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [hostels, setHostels]             = useState<Hostel[]>(mockHostels);
  const [activeTab, setActiveTab]         = useState<Tab>("explore");
  const [favorites, setFavorites]         = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("hostelmate-favorites") || "[]"); }
    catch { return []; }
  });

  // ── After Supabase finishes loading, decide which page to show ───────────
  useEffect(() => {
    if (loading) return; // wait for auth state

    if (user && role) {
      // User is logged in — go straight to their dashboard
      setPage(role === "owner" ? "owner" : "student");
    } else if (user && !role) {
      // OAuth user with no role yet — ask them to pick
      setPage("role-select");
    }
    // else: not logged in — stay at splash / role-select (handled below)
  }, [user, role, loading]);

  // ── Handle Google OAuth redirect: set role if pending ────────────────────
  // Must await updateUser + refreshSession so user_metadata.role is set
  // before the routing useEffect reads it.
  useEffect(() => {
    if (!user) return;

    // Don't overwrite if role already set (returning Google user)
    if (user.user_metadata?.role) return;

    // Read role from localStorage (primary) or URL param (fallback)
    const urlRole = new URLSearchParams(window.location.search).get("role");
    const pendingRole =
      localStorage.getItem("hostelmate-pending-role") || urlRole;

    if (!pendingRole) return;

    (async () => {
      await supabase.auth.updateUser({ data: { role: pendingRole } });
      // Refresh session so user_metadata reflects immediately in this tab
      await supabase.auth.refreshSession();
      localStorage.removeItem("hostelmate-pending-role");
      // Clean URL param without triggering a reload
      window.history.replaceState({}, "", "/");
      // Route to correct dashboard now that role is confirmed
      setPage(pendingRole === "owner" ? "owner" : "student");
    })();
  }, [user]);

  const handleSplashFinish = useCallback(() => {
    if (user && role) {
      setPage(role === "owner" ? "owner" : "student");
    } else {
      setPage("role-select");
    }
  }, [user, role]);

  const handleNavigate = useCallback((target: string) => {
    setPage(target as Page);
  }, []);

  const handleSelectHostel = useCallback((hostel: Hostel) => {
    setSelectedHostel(hostel);
    setPage("detail");
  }, []);

  const handleLoginSuccess = useCallback((targetPage: Page) => {
    setPage(targetPage);
    if (targetPage === "student") setActiveTab("explore");
  }, []);

  const handleSignOut = useCallback(async () => {
    await signOut();
    setPage("role-select");
    setActiveTab("explore");
  }, [signOut]);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("hostelmate-favorites", JSON.stringify(next));
      return next;
    });
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
    const pageMap: Record<Tab, Page> = {
      explore:   "student",
      wishlists: "wishlists",
      trips:     "trips",
      messages:  "messages",
      profile:   "profile",
    };
    setPage(pageMap[tab]);
  }, []);

  const showBottomNav = [
    "student", "wishlists", "trips", "messages",
    "profile", "help", "contact",
  ].includes(page);

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // ── Page switch ───────────────────────────────────────────────────────────
  switch (page) {
    case "splash":
      return <SplashScreen onFinish={handleSplashFinish} />;

    case "role-select":
      return (
        <RoleSelectPage
          onSelect={(role) =>
            setPage(role === "student" ? "login-student" : "login-owner")
          }
        />
      );

    case "login-student":
      return (
        <LoginPage
          role="student"
          onLogin={() => handleLoginSuccess("student")}
        />
      );

    case "login-owner":
      return (
        <LoginPage
          role="owner"
          onLogin={() => handleLoginSuccess("owner")}
        />
      );

    case "student":
      return (
        <>
          <StudentPage
            hostels={hostels}
            onSelectHostel={handleSelectHostel}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
          <BottomNav active={activeTab} onTabChange={handleTabChange} />
        </>
      );

    case "owner":
      return (
        <OwnerPage
          hostels={hostels}
          onHostelsChange={setHostels}
          onBack={handleSignOut}
          ownerId={user?.id ?? "unknown"}
        />
      );

    case "detail":
      return selectedHostel ? (
        <HostelDetail
          hostel={selectedHostel}
          onBack={() => setPage("student")}
          onOpenChat={() => setPage("chat")}
        />
      ) : (
        <>
          <StudentPage hostels={hostels} onSelectHostel={handleSelectHostel} favorites={favorites} onToggleFavorite={toggleFavorite} />
          <BottomNav active={activeTab} onTabChange={handleTabChange} />
        </>
      );

    case "chat":
      return selectedHostel ? (
        <CommunityChat hostel={selectedHostel} onBack={() => setPage("detail")} />
      ) : (
        <>
          <StudentPage hostels={hostels} onSelectHostel={handleSelectHostel} favorites={favorites} onToggleFavorite={toggleFavorite} />
          <BottomNav active={activeTab} onTabChange={handleTabChange} />
        </>
      );

    case "wishlists":
      return (
        <>
          <WishlistsPage favorites={favorites} hostels={hostels} onSelectHostel={handleSelectHostel} onToggleFavorite={toggleFavorite} />
          <BottomNav active={activeTab} onTabChange={handleTabChange} />
        </>
      );

    case "trips":
      return (
        <>
          <TripsPage bookings={[]} />
          <BottomNav active={activeTab} onTabChange={handleTabChange} />
        </>
      );

    case "messages":
      return (
        <>
          <MessagesPage
            hostels={hostels}
            favorites={favorites}
            onOpenChat={(h) => { setSelectedHostel(h); setPage("chat"); }}
          />
          <BottomNav active={activeTab} onTabChange={handleTabChange} />
        </>
      );

    case "profile":
      return (
        <>
          <ProfilePage
            onBack={() => { setPage("student"); setActiveTab("explore"); }}
            onNavigate={handleNavigate}
            onSignOut={handleSignOut}
          />
          <BottomNav active={activeTab} onTabChange={handleTabChange} />
        </>
      );

    case "help":
      return (
        <>
          <HelpPage onBack={() => { setPage("student"); setActiveTab("explore"); }} />
          <BottomNav active={activeTab} onTabChange={handleTabChange} />
        </>
      );

    case "contact":
      return (
        <>
          <ContactPage onBack={() => { setPage("student"); setActiveTab("explore"); }} />
          <BottomNav active={activeTab} onTabChange={handleTabChange} />
        </>
      );

    default:
      return <SplashScreen onFinish={handleSplashFinish} />;
  }
};

export default Index;