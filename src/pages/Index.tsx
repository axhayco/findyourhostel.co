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
import { Hostel, mockHostels } from "@/data/hostels";

type Page = "splash" | "role-select" | "login-student" | "login-owner" | "student" | "owner" | "detail" | "chat" | "profile" | "help" | "contact";

const Index = () => {
  const [page, setPage] = useState<Page>("splash");
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>(mockHostels);
  const [ownerId, setOwnerId] = useState<string | null>(null);

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

  switch (page) {
    case "splash":
      return <SplashScreen onFinish={handleSplashFinish} />;
    case "role-select":
      return <RoleSelectPage onSelect={(role) => setPage(role === "student" ? "login-student" : "login-owner")} />;
    case "login-student":
      return <LoginPage role="student" onLogin={() => setPage("student")} />;
    case "login-owner":
      return <LoginPage role="owner" onLogin={handleOwnerLogin} />;
    case "student":
      return <StudentPage hostels={hostels} onNavigate={handleNavigate} onSelectHostel={handleSelectHostel} />;
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
        <StudentPage hostels={hostels} onNavigate={handleNavigate} onSelectHostel={handleSelectHostel} />
      );
    case "chat":
      return selectedHostel ? (
        <CommunityChat hostel={selectedHostel} onBack={() => setPage("detail")} />
      ) : (
        <StudentPage hostels={hostels} onNavigate={handleNavigate} onSelectHostel={handleSelectHostel} />
      );
    case "profile":
      return <ProfilePage onBack={() => setPage("student")} />;
    case "help":
      return <HelpPage onBack={() => setPage("student")} />;
    case "contact":
      return <ContactPage onBack={() => setPage("student")} />;
    default:
      return <SplashScreen onFinish={handleSplashFinish} />;
  }
};

export default Index;
