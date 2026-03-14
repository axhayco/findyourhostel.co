import { Hostel, mockHostels } from "@/data/hostels";
import { useState, useMemo } from "react";
import { Search, Menu, X, ChevronDown, User, HelpCircle, Phone, LogOut, LayoutGrid, Map } from "lucide-react";
import HostelCard from "./HostelCard";
import HostelMap from "./HostelMap";

interface StudentPageProps {
  onNavigate: (page: string) => void;
  onSelectHostel?: (hostel: Hostel) => void;
}

const StudentPage = ({ onNavigate, onSelectHostel }: StudentPageProps) => {
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState<"all" | "male" | "female">("all");
  const [sortBy, setSortBy] = useState<"price" | "rating" | "vacancies">("rating");
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const filtered = useMemo(() => {
    let list = [...mockHostels];
    if (gender !== "all") list = list.filter((h) => h.gender === gender);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (h) => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (sortBy === "price") return a.rent - b.rent;
      if (sortBy === "rating") return b.rating - a.rating;
      return b.vacancies - a.vacancies;
    });
    return list;
  }, [search, gender, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-foreground">​HostelMate
 </h1>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary">
              
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            {menuOpen &&
            <div className="animate-slide-down absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-border bg-card shadow-card-hover">
                <button
                onClick={() => {setMenuOpen(false);onNavigate("owner");}}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-secondary">
                
                  <User className="h-4 w-4 text-muted-foreground" /> Owner Panel
                </button>
                <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-secondary">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" /> Help
                </button>
                <button className="flex w-full items-center gap-3 px-4 py-3 text-sm text-foreground transition-colors hover:bg-secondary">
                  <Phone className="h-4 w-4 text-muted-foreground" /> Contact
                </button>
                <div className="border-t border-border" />
                <button
                onClick={() => {setMenuOpen(false);onNavigate("login");}}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-destructive transition-colors hover:bg-secondary">
                
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            }
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location or hostel name..."
            className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/20" />
          
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {/* Gender filter */}
          {(["all", "male", "female"] as const).map((g) =>
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
            gender === g ?
            "bg-primary text-primary-foreground" :
            "bg-secondary text-secondary-foreground hover:bg-muted"}`
            }>
            
              {g === "all" ? "All" : g}
            </button>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none rounded-lg border border-input bg-card py-1.5 pl-3 pr-7 text-xs font-medium text-foreground outline-none focus:border-primary">
                
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="vacancies">Vacancies</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="mb-4 flex items-center gap-1 rounded-xl bg-secondary p-1 w-fit">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}>
            <LayoutGrid className="h-3.5 w-3.5" /> Grid
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === "map" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}>
            <Map className="h-3.5 w-3.5" /> Map
          </button>
        </div>

        {/* Content */}
        {viewMode === "map" ? (
          <HostelMap hostels={filtered} />
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg font-medium">No hostels found</p>
            <p className="mt-1 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((h, i) => (
              <div key={h.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}>
                <HostelCard hostel={h} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>);

};

export default StudentPage;