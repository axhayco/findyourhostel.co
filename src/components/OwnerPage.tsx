import { Hostel, mockHostels, ALL_AMENITIES } from "@/data/hostels";
import { useState, useMemo, useEffect } from "react";
import {
  ArrowLeft, Plus, X, Pencil, Trash2, Users, BedDouble, IndianRupee,
  Building2, Eye, ChevronDown, Check, MapPin, Phone, Star, Wifi, WifiOff
} from "lucide-react";
import hostel1 from "@/assets/hostel1.jpg";

interface OwnerPageProps {
  onBack: () => void;
}

type ModalMode = "add" | "edit" | "occupancy" | null;

interface HostelForm {
  name: string;
  location: string;
  rent: string;
  vacancies: string;
  totalCapacity: string;
  gender: "male" | "female";
  description: string;
  contactPhone: string;
  image: string;
  amenities: string[];
}

const emptyForm: HostelForm = {
  name: "",
  location: "",
  rent: "",
  vacancies: "",
  totalCapacity: "",
  gender: "male",
  description: "",
  contactPhone: "",
  image: "",
  amenities: [],
};

const OwnerPage = ({ onBack }: OwnerPageProps) => {
  const [hostels, setHostels] = useState<Hostel[]>(mockHostels);
  const [modal, setModal] = useState<ModalMode>(null);
  const [form, setForm] = useState<HostelForm>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewHostel, setViewHostel] = useState<Hostel | null>(null);
  const [hwOnline, setHwOnline] = useState(true);
  const [lastPing, setLastPing] = useState(new Date());

  // Simulate hardware ping every 30s with random online/offline
  useEffect(() => {
    const interval = setInterval(() => {
      const online = Math.random() > 0.15; // 85% chance online
      setHwOnline(online);
      setLastPing(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    const totalBeds = hostels.reduce((s, h) => s + h.totalCapacity, 0);
    const occupied = hostels.reduce((s, h) => s + (h.totalCapacity - h.vacancies), 0);
    const vacant = hostels.reduce((s, h) => s + h.vacancies, 0);
    return { totalBeds, occupied, vacant, occupancyRate: totalBeds ? Math.round((occupied / totalBeds) * 100) : 0 };
  }, [hostels]);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setModal("add");
  };

  const openEdit = (h: Hostel) => {
    setForm({
      name: h.name,
      location: h.location,
      rent: String(h.rent),
      vacancies: String(h.vacancies),
      totalCapacity: String(h.totalCapacity),
      gender: h.gender,
      description: h.description,
      contactPhone: h.contactPhone,
      image: h.image,
      amenities: [...h.amenities],
    });
    setEditId(h.id);
    setModal("edit");
  };

  const openOccupancy = (h: Hostel) => {
    setViewHostel(h);
    setModal("occupancy");
  };

  const handleSave = () => {
    if (!form.name || !form.rent) return;
    const img = form.image || hostel1;
    const hostelData: Hostel = {
      id: editId || Date.now().toString(),
      name: form.name,
      location: form.location || "New Location",
      rent: Number(form.rent),
      rating: 4.0,
      vacancies: Math.min(Number(form.vacancies) || 0, Number(form.totalCapacity) || 0),
      totalCapacity: Number(form.totalCapacity) || 10,
      gender: form.gender,
      image: img,
      photos: [img],
      amenities: form.amenities,
      description: form.description || "No description provided.",
      contactPhone: form.contactPhone || "+91 00000 00000",
      lat: 12.9716,
      lng: 77.5946,
    };

    if (editId) {
      setHostels(hostels.map((h) => (h.id === editId ? { ...h, ...hostelData } : h)));
    } else {
      setHostels([hostelData, ...hostels]);
    }
    setModal(null);
    setForm(emptyForm);
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    setHostels(hostels.filter((h) => h.id !== id));
  };

  const toggleAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const inputClass =
    "w-full rounded-xl border border-input bg-background py-2.5 px-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/20";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Owner Dashboard</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-4 space-y-5">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Hostels", value: hostels.length, icon: <Building2 className="h-5 w-5" />, color: "text-primary" },
            { label: "Total Beds", value: stats.totalBeds, icon: <BedDouble className="h-5 w-5" />, color: "text-accent-foreground" },
            { label: "Occupied", value: stats.occupied, icon: <Users className="h-5 w-5" />, color: "text-success" },
            { label: "Occupancy Rate", value: `${stats.occupancyRate}%`, icon: <Eye className="h-5 w-5" />, color: "text-warning" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-4 shadow-card">
              <div className={`mb-2 ${s.color}`}>{s.icon}</div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Hostel List */}
        <div className="space-y-3">
          {hostels.map((h) => {
            const occupied = h.totalCapacity - h.vacancies;
            const occupancyPct = h.totalCapacity ? Math.round((occupied / h.totalCapacity) * 100) : 0;
            return (
              <div key={h.id} className="rounded-2xl bg-card shadow-card overflow-hidden">
                <div className="flex gap-3 p-3">
                  <img src={h.image} alt={h.name} className="h-24 w-24 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{h.name}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="h-3 w-3 flex-shrink-0" /> <span className="truncate">{h.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold">
                        <Star className="h-3 w-3 fill-warning text-warning" /> {h.rating}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-xs">
                      <span className="font-bold text-primary">₹{h.rent.toLocaleString()}<span className="font-normal text-muted-foreground">/mo</span></span>
                      <span className="capitalize rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">{h.gender}</span>
                    </div>

                    {/* Mini occupancy bar */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
                        <span>{occupied}/{h.totalCapacity} occupied</span>
                        <span className="font-semibold">{occupancyPct}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            occupancyPct >= 90 ? "bg-destructive" : occupancyPct >= 60 ? "bg-warning" : "bg-success"
                          }`}
                          style={{ width: `${occupancyPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex border-t border-border divide-x divide-border">
                  <button
                    onClick={() => openEdit(h)}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => openOccupancy(h)}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                  >
                    <Eye className="h-3.5 w-3.5" /> Occupancy
                  </button>
                  <button
                    onClick={() => handleDelete(h.id)}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {hostels.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <Building2 className="mx-auto h-12 w-12 mb-3 opacity-40" />
            <p className="text-lg font-medium">No hostels yet</p>
            <p className="mt-1 text-sm">Tap + to add your first hostel</p>
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={openAdd}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/40 backdrop-blur-sm px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-lg animate-fade-up rounded-2xl bg-card p-6 shadow-card-hover" style={{ animationFillMode: "both" }}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {modal === "add" ? "Add New Hostel" : "Edit Hostel"}
              </h2>
              <button onClick={() => setModal(null)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
              {/* Basic Info */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Hostel Name *</label>
                <input type="text" placeholder="e.g. Sunrise Boys Hostel" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Location</label>
                <input type="text" placeholder="e.g. Koramangala, Bangalore" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Monthly Rent (₹) *</label>
                  <input type="number" placeholder="6500" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Gender</label>
                  <div className="flex gap-2">
                    {(["male", "female"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setForm({ ...form, gender: g })}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-semibold capitalize transition-all ${
                          form.gender === g ? "bg-primary text-primary-foreground" : "border border-input bg-background text-foreground hover:bg-secondary"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Total Capacity (beds)</label>
                  <input type="number" placeholder="30" value={form.totalCapacity} onChange={(e) => setForm({ ...form, totalCapacity: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Vacant Beds</label>
                  <input type="number" placeholder="5" value={form.vacancies} onChange={(e) => setForm({ ...form, vacancies: e.target.value })} className={inputClass} />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your hostel..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Contact Phone</label>
                <input type="tel" placeholder="+91 98765 43210" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} className={inputClass} />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground">Image URL (optional)</label>
                <input type="text" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className={inputClass} />
              </div>

              {/* Amenities */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-muted-foreground">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITIES.map((a) => {
                    const active = form.amenities.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => toggleAmenity(a)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "border border-input bg-background text-foreground hover:bg-secondary"
                        }`}
                      >
                        {active && <Check className="h-3 w-3" />}
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
            >
              {modal === "add" ? "Add Hostel" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* Occupancy Modal */}
      {modal === "occupancy" && viewHostel && (() => {
        const occupied = viewHostel.totalCapacity - viewHostel.vacancies;
        const pct = viewHostel.totalCapacity ? Math.round((occupied / viewHostel.totalCapacity) * 100) : 0;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-md animate-fade-up rounded-2xl bg-card p-6 shadow-card-hover" style={{ animationFillMode: "both" }}>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Occupancy Details</h2>
                <button onClick={() => setModal(null)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="text-center mb-5">
                <h3 className="font-semibold text-foreground">{viewHostel.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{viewHostel.location}</p>
              </div>

              {/* Circular-like visual */}
              <div className="flex justify-center mb-5">
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-secondary">
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 128 128">
                    <circle cx="64" cy="64" r="58" fill="none" strokeWidth="6"
                      className={pct >= 90 ? "stroke-destructive" : pct >= 60 ? "stroke-warning" : "stroke-success"}
                      strokeDasharray={`${(pct / 100) * 364} 364`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground">{pct}%</div>
                    <div className="text-[10px] text-muted-foreground">Occupied</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-secondary p-3">
                  <div className="text-lg font-bold text-foreground">{viewHostel.totalCapacity}</div>
                  <div className="text-[10px] text-muted-foreground">Total Beds</div>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <div className="text-lg font-bold text-success">{occupied}</div>
                  <div className="text-[10px] text-muted-foreground">Occupied</div>
                </div>
                <div className="rounded-xl bg-secondary p-3">
                  <div className="text-lg font-bold text-primary">{viewHostel.vacancies}</div>
                  <div className="text-[10px] text-muted-foreground">Vacant</div>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-muted-foreground">
                Monthly Rent: <span className="font-semibold text-primary">₹{viewHostel.rent.toLocaleString()}</span>
                {" · "}
                Revenue Potential: <span className="font-semibold text-foreground">₹{(occupied * viewHostel.rent).toLocaleString()}/mo</span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default OwnerPage;
