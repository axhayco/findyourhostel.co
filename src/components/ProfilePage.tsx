import { useState } from "react";
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Save, Check } from "lucide-react";

interface ProfilePageProps {
  onBack: () => void;
}

const ProfilePage = ({ onBack }: ProfilePageProps) => {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("hostelmate-profile") || "null") || {
        name: "Alex Johnson",
        email: "alex@example.com",
        phone: "+91 98765 43210",
        college: "BMS College of Engineering",
        bio: "Final year CS student looking for a comfortable hostel near campus.",
        avatar: "",
      };
    } catch {
      return {
        name: "Alex Johnson",
        email: "alex@example.com",
        phone: "+91 98765 43210",
        college: "BMS College of Engineering",
        bio: "Final year CS student looking for a comfortable hostel near campus.",
        avatar: "",
      };
    }
  });

  const handleSave = () => {
    localStorage.setItem("hostelmate-profile", JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputClass =
    "w-full rounded-xl border border-input bg-background py-2.5 px-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/20";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground">My Profile</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-5">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-10 w-10" />
            </div>
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-lg font-bold text-foreground">{profile.name}</p>
          <p className="text-xs text-muted-foreground">Student</p>
        </div>

        {/* Form */}
        <div className="rounded-2xl bg-card p-5 shadow-card space-y-4">
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <User className="h-3.5 w-3.5" /> Full Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> Phone
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> College / Institution
            </label>
            <input
              type="text"
              value={profile.college}
              onChange={(e) => setProfile({ ...profile, college: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Bio</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              maxLength={150}
              className={`${inputClass} resize-none`}
            />
            <p className="mt-1 text-right text-[10px] text-muted-foreground">{profile.bio.length}/150</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Saved!
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Save Changes
            </>
          )}
        </button>
      </main>
    </div>
  );
};

export default ProfilePage;
