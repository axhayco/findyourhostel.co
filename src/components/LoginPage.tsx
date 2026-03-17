import logo from "@/assets/logo.png";
import { useState } from "react";
import { Mail, Phone, ArrowRight, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

type UserRole = "student" | "owner";

interface LoginPageProps {
  onLogin: () => void;
  role: UserRole;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/;

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ input?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    const trimmed = input.trim();

    if (!trimmed) {
      newErrors.input = "Email or phone number is required";
    } else if (!emailRegex.test(trimmed) && !phoneRegex.test(trimmed)) {
      newErrors.input = "Enter a valid email or Indian phone number";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setLoading(true);
    // Simulate auth delay
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm animate-fade-up" style={{ animationFillMode: "both" }}>
        <div className="mb-8 flex flex-col items-center">
          <img src={logo} alt="Hostel Finder" className="mb-4 h-20 w-20" />
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to find your perfect hostel</p>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-card">
          {/* Email / Phone */}
          <label className="mb-2 block text-sm font-medium text-foreground">
            Email or Mobile Number
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              {input.includes("@") ? (
                <Mail className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Phone className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setErrors((p) => ({ ...p, input: undefined })); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter email or phone"
              className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:ring-2 bg-background ${
                errors.input ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-ring/20"
              }`}
            />
          </div>
          {errors.input && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" /> {errors.input}
            </div>
          )}

          {/* Password */}
          <label className="mb-2 mt-4 block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
              onKeyDown={handleKeyDown}
              placeholder="Enter password"
              className={`w-full rounded-xl border py-3 pl-10 pr-10 text-sm text-foreground outline-none transition-all focus:ring-2 bg-background ${
                errors.password ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-input focus:border-primary focus:ring-ring/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <div className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" /> {errors.password}
            </div>
          )}

          <div className="mt-2 text-right">
            <button className="text-xs text-primary hover:underline">Forgot password?</button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-input bg-background py-3 text-sm font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.98]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
