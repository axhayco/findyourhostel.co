import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import LoginPage from "@/components/LoginPage";
import StudentPage from "@/components/StudentPage";
import OwnerPage from "@/components/OwnerPage";
import HostelDetail from "@/components/HostelDetail";
import { Hostel } from "@/data/hostels";

type Page = "splash" | "login" | "student" | "owner" | "detail";

const Index = () => {
  const [page, setPage] = useState<Page>("splash");
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);

  const handleSplashFinish = useCallback(() => setPage("login"), []);

  const handleNavigate = useCallback((target: string) => {
    setPage(target as Page);
  }, []);

  const handleSelectHostel = useCallback((hostel: Hostel) => {
    setSelectedHostel(hostel);
    setPage("detail");
  }, []);

  switch (page) {
    case "splash":
      return <SplashScreen onFinish={handleSplashFinish} />;
    case "login":
      return <LoginPage onLogin={() => setPage("student")} />;
    case "student":
      return <StudentPage onNavigate={handleNavigate} onSelectHostel={handleSelectHostel} />;
    case "owner":
      return <OwnerPage onBack={() => setPage("student")} />;
    case "detail":
      return selectedHostel ? (
        <HostelDetail hostel={selectedHostel} onBack={() => setPage("student")} />
      ) : (
        <StudentPage onNavigate={handleNavigate} onSelectHostel={handleSelectHostel} />
      );
    default:
      return <SplashScreen onFinish={handleSplashFinish} />;
  }
};

export default Index;
