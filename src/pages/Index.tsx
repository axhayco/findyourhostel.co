import { useState, useCallback } from "react";
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

type Page = "splash" | "role-select" | "login-student" | "login-owner" | "student" | "owner" | "detail" | "chat" | "profile" | "help" | "contact" | "wishlists" | "trips" | "messages";
type Tab = "explore" | "wishlists" | "trips" | "messages" | "profile";

const Index = () => {
  const [page, setPage] = useState<Page>("splash");
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>(mockHostels);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("hostelmate-favorites") || "[]"); }
    catch { return []; }
  });

  const handleSplashFinish = useCallback(() => setPage("role-select"), []);

  const handleNavigate = useCallback((target: string) => {
    setPage(target as Page);
  }, []);

  const handleSelectHostel = useCallback((hostel: Hostel) => {
    setSelectedHostel(hostel);
    setPage("detail");
  }, []);

  const handleOwnerLogin = useCallback(() => {
    const id = `owner-${Date.now()}`;
    setOwnerId(id);
    setPage("owner");
  }, []);

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
      explore: "student",
      wishlists: "wishlists",
      trips: "trips",
      messages: "messages",
      profile: "profile",
    };
    setPage(pageMap[tab]);
  }, []);

  const showBottomNav = ["student", "wishlists", "trips", "messages", "profile", "help", "contact"].includes(page);

  switch (page) {
    case "splash":
      return <SplashScreen onFinish={handleSplashFinish} />;
    case "role-select":
      return <RoleSelectPage onSelect={(role) => setPage(role === "student" ? "login-student" : "login-owner")} />;
    case "login-student":
      return <LoginPage role="student" onLogin={() => { setPage("student"); setActiveTab("explore"); }} />;
    case "login-owner":
      return <LoginPage role="owner" onLogin={handleOwnerLogin} />;
    case "student":
      return (
        <>
          <StudentPage hostels={hostels} onSelectHostel={handleSelectHostel} favorites={favorites} onToggleFavorite={toggleFavorite} />
          <BottomNav active={activeTab} onTabChange={handleTabChange} />
        </>
      );
    case "owner":
      return (
        <OwnerPage
          hostels={hostels}
          onHostelsChange={setHostels}
          onBack={() => setPage("role-select")}
          ownerId={ownerId!}
        />
      );
    case "detail":
      return selectedHostel ? (
        <HostelDetail hostel={selectedHostel} onBack={() => setPage("student")} onOpenChat={() => setPage("chat")} />
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
          <ProfilePage onBack={() => { setPage("student"); setActiveTab("explore"); }} />
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
