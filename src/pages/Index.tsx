import { useState, useCallback } from "react";
import SplashScreen from "@/components/SplashScreen";
import LoginPage from "@/components/LoginPage";
import StudentPage from "@/components/StudentPage";
import OwnerPage from "@/components/OwnerPage";

type Page = "splash" | "login" | "student" | "owner";

const Index = () => {
  const [page, setPage] = useState<Page>("splash");

  const handleSplashFinish = useCallback(() => setPage("login"), []);

  const handleNavigate = useCallback((target: string) => {
    setPage(target as Page);
  }, []);

  switch (page) {
    case "splash":
      return <SplashScreen onFinish={handleSplashFinish} />;
    case "login":
      return <LoginPage onLogin={() => setPage("student")} />;
    case "student":
      return <StudentPage onNavigate={handleNavigate} />;
    case "owner":
      return <OwnerPage onBack={() => setPage("student")} />;
    default:
      return <SplashScreen onFinish={handleSplashFinish} />;
  }
};

export default Index;
