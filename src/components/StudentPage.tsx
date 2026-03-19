import { Hostel } from "@/data/hostels";
import { useState, useMemo } from "react";
import { Search, Heart, ChevronDown, ChevronRight, Star, LayoutGrid, Map } from "lucide-react";
import HostelCard from "./HostelCard";
import HostelMap from "./HostelMap";

interface StudentPageProps {
  hostels: Hostel[];
  onSelectHostel?: (hostel: Hostel) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const CATEGORIES = [
  { id: "all", label: "All", emoji: "🏠" },
  { id: "male", label: "Boys", emoji: "👦" },
  { id: "female", label: "Girls", emoji: "👧" },
  { id: "budget", label: "Budget", emoji: "💰" },
  { id: "premium", label: "Premium", emoji: "✨" },
];

const StudentPage = ({ hostels: allHostels, onSelectHostel, favorites, onToggleFavorite }: StudentPageProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"price" | "rating" | "vacancies">("rating");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const filtered = useMemo(() => {
    let list = [...allHostels];
    if (category === "male") list = list.filter((h) => h.gender === "male");
    else if (category === "female") list = list.filter((h) => h.gender === "female");
    else if (category === "budget") list = list.filter((h) => h.rent <= 6500);
    else if (category === "premium") list = list.filter((h) => h.rent > 7000);
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
  }, [search, category, sortBy, allHostels]);

  // Group hostels by location for horizontal sections
  const groupedByLocation = useMemo(() => {
    const groups: Record<string, Hostel[]> = {};
    filtered.forEach((h) => {
      const area = h.location.split(",")[0].trim();
      if (!groups[area]) groups[area] = [];
      groups[area].push(h);
    });
    return Object.entries(groups);
  }, [filtered]);

  const topRated = useMemo(
    () => [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 6),
    [filtered]
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Search Bar */}
      <div className="px-4 pt-5 pb-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Start your search"
            className="w-full rounded-full border border-border bg-card py-3.5 pl-11 pr-4 text-sm text-foreground shadow-card outline-none transition-all focus:shadow-card-hover focus:border-primary"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-1 overflow-x-auto px-4 py-3 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 flex-shrink-0 transition-all ${
                category === cat.id
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-[10px] font-semibold whitespace-nowrap">{cat.label}</span>
            </button>
          ))}

          {/* Sort & View Toggle */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0 pl-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none rounded-lg border border-input bg-card py-1.5 pl-3 pr-7 text-[10px] font-semibold text-foreground outline-none"
              >
                <option value="rating">Rating</option>
                <option value="price">Price</option>
                <option value="vacancies">Beds</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            </div>
            <button
              onClick={() => setViewMode(viewMode === "grid" ? "map" : "grid")}
              className="rounded-lg border border-input bg-card p-2 text-foreground transition-colors hover:bg-secondary"
            >
              {viewMode === "grid" ? <Map className="h-3.5 w-3.5" /> : <LayoutGrid className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === "map" ? (
        <div className="px-4 pt-4">
          <HostelMap hostels={filtered} />
        </div>
      ) : search.trim() ? (
        /* Search results: flat grid */
        <div className="px-4 pt-4">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <p className="text-lg font-medium">No hostels found</p>
              <p className="mt-1 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((h, i) => (
                <div key={h.id} className="relative animate-fade-up" style={{ animationDelay: `${i * 0.06}s`, animationFillMode: "both" }}>
                  <div className="cursor-pointer" onClick={() => onSelectHostel?.(h)}>
                    <HostelCard hostel={h} />
                  </div>
                  {h.rating >= 4.5 && (
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur-sm">
                      Guest favourite
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); onToggleFavorite(h.id); }}
                    className="absolute right-3 top-3 z-10 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Heart
                      className={`h-6 w-6 drop-shadow-md ${
                        favorites.includes(h.id)
                          ? "fill-primary text-primary"
                          : "fill-foreground/30 text-card stroke-[1.5]"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Browse mode: Airbnb-style horizontal sections */
        <div className="pt-4">
          {/* Top Rated Section */}
          {topRated.length > 0 && (
            <section className="mb-6">
              <div className="flex items-center justify-between px-4 mb-3">
                <h2 className="text-lg font-bold text-foreground">Top rated hostels</h2>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-secondary">
                  <ChevronRight className="h-4 w-4 text-foreground" />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {topRated.map((h) => (
                  <div key={h.id} className="relative flex-shrink-0 w-[200px] sm:w-[220px]">
                    <div className="cursor-pointer" onClick={() => onSelectHostel?.(h)}>
                      <div className="aspect-square overflow-hidden rounded-xl">
                        <img src={h.image} alt={h.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-foreground truncate">{h.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{h.location}</p>
                        <p className="mt-0.5 text-sm text-foreground">
                          <span className="font-semibold">₹{h.rent.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">/mo</span>
                          <span className="text-xs text-muted-foreground"> · </span>
                          <Star className="inline h-3 w-3 fill-foreground text-foreground mb-0.5" />
                          <span className="text-xs font-medium"> {h.rating}</span>
                        </p>
                      </div>
                    </div>
                    {h.rating >= 4.5 && (
                      <span className="absolute left-2 top-2 z-10 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur-sm shadow-sm">
                        Guest favourite
                      </span>
                    )}
                    <button
                      onClick={() => onToggleFavorite(h.id)}
                      className="absolute right-2 top-2 z-10 transition-transform hover:scale-110 active:scale-95"
                    >
                      <Heart
                        className={`h-6 w-6 drop-shadow-md ${
                          favorites.includes(h.id)
                            ? "fill-primary text-primary"
                            : "fill-foreground/30 text-card stroke-[1.5]"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Grouped by area */}
          {groupedByLocation.map(([area, hostels]) => (
            <section key={area} className="mb-6">
              <div className="flex items-center justify-between px-4 mb-3">
                <h2 className="text-lg font-bold text-foreground">Hostels in {area}</h2>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card transition-colors hover:bg-secondary">
                  <ChevronRight className="h-4 w-4 text-foreground" />
                </button>
              </div>
              <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {hostels.map((h) => (
                  <div key={h.id} className="relative flex-shrink-0 w-[200px] sm:w-[220px]">
                    <div className="cursor-pointer" onClick={() => onSelectHostel?.(h)}>
                      <div className="aspect-square overflow-hidden rounded-xl">
                        <img src={h.image} alt={h.name} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-foreground truncate">{h.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{h.location}</p>
                        <p className="mt-0.5 text-sm text-foreground">
                          <span className="font-semibold">₹{h.rent.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground">/mo</span>
                          <span className="text-xs text-muted-foreground"> · </span>
                          <Star className="inline h-3 w-3 fill-foreground text-foreground mb-0.5" />
                          <span className="text-xs font-medium"> {h.rating}</span>
                        </p>
                      </div>
                    </div>
                    {h.rating >= 4.5 && (
                      <span className="absolute left-2 top-2 z-10 rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur-sm shadow-sm">
                        Guest favourite
                      </span>
                    )}
                    <button
                      onClick={() => onToggleFavorite(h.id)}
                      className="absolute right-2 top-2 z-10 transition-transform hover:scale-110 active:scale-95"
                    >
                      <Heart
                        className={`h-6 w-6 drop-shadow-md ${
                          favorites.includes(h.id)
                            ? "fill-primary text-primary"
                            : "fill-foreground/30 text-card stroke-[1.5]"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPage;
