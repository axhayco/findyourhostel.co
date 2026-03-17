import { useState, useCallback, useMemo } from "react";
import SplashScreen from "@/components/SplashScreen";
import LoginPage from "@/components/LoginPage";
import RoleSelectPage from "@/components/RoleSelectPage";
import StudentPage from "@/components/StudentPage";
import OwnerPage from "@/components/OwnerPage";
import HostelDetail from "@/components/HostelDetail";
import { Hostel, mockHostels } from "@/data/hostels";

type Page = "splash" | "role-select" | "login-student" | "login-owner" | "student" | "owner" | "detail";

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
    // Generate a unique owner ID per session so each owner only sees their hostels
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
        <HostelDetail hostel={selectedHostel} onBack={() => setPage("student")} />
      ) : (
        <StudentPage hostels={hostels} onNavigate={handleNavigate} onSelectHostel={handleSelectHostel} />
      );
    default:
      return <SplashScreen onFinish={handleSplashFinish} />;
  }
};

export default Index;
