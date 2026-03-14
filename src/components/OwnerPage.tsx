import { Hostel, mockHostels } from "@/data/hostels";
import { useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import HostelCard from "./HostelCard";
import hostel1 from "@/assets/hostel1.jpg";

interface OwnerPageProps {
  onBack: () => void;
}

const OwnerPage = ({ onBack }: OwnerPageProps) => {
  const [hostels, setHostels] = useState<Hostel[]>(mockHostels);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", rent: "", vacancies: "", image: "" });

  const handleAdd = () => {
    if (!form.name || !form.rent) return;
    const img = form.image || hostel1;
    const newHostel: Hostel = {
      id: Date.now().toString(),
      name: form.name,
      location: "New Location",
      rent: Number(form.rent),
      rating: 4.0,
      vacancies: Number(form.vacancies) || 0,
      gender: "male",
      image: img,
      photos: [img],
      amenities: ["Wi-Fi"],
      description: "Newly listed hostel.",
      contactPhone: "+91 00000 00000",
      lat: 12.9716,
      lng: 77.5946,
    };
    setHostels([newHostel, ...hostels]);
    setForm({ name: "", rent: "", vacancies: "", image: "" });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setHostels(hostels.filter((h) => h.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <button onClick={onBack} className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Hostels List</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-4">
        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-md animate-fade-up rounded-2xl bg-card p-6 shadow-card-hover" style={{ animationFillMode: "both" }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">Add New Hostel</h2>
                <button onClick={() => setShowForm(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Hostel Name", key: "name", type: "text", placeholder: "e.g. Sunrise Boys Hostel" },
                  { label: "Monthly Rent (₹)", key: "rent", type: "number", placeholder: "e.g. 6500" },
                  { label: "Vacancies", key: "vacancies", type: "number", placeholder: "e.g. 5" },
                  { label: "Image URL (optional)", key: "image", type: "text", placeholder: "https://..." },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background py-2.5 px-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-ring/20"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleAdd}
                className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
              >
                Add Hostel
              </button>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {hostels.map((h, i) => (
            <div key={h.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "both" }}>
              <HostelCard hostel={h} onDelete={handleDelete} showDelete />
            </div>
          ))}
        </div>

        {hostels.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg font-medium">No hostels yet</p>
            <p className="mt-1 text-sm">Tap + to add your first hostel</p>
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all hover:scale-110 active:scale-95"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
};

export default OwnerPage;
