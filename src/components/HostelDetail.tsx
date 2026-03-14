import { Hostel } from "@/data/hostels";
import { useState } from "react";
import { ArrowLeft, Star, MapPin, Phone, Wifi, Wind, Utensils, Dumbbell, ShieldCheck, Car, Zap, Droplets, BookOpen, Home, Sparkles, Sun } from "lucide-react";

interface HostelDetailProps {
  hostel: Hostel;
  onBack: () => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi className="h-4 w-4" />,
  "AC": <Wind className="h-4 w-4" />,
  "Meals Included": <Utensils className="h-4 w-4" />,
  "Gym": <Dumbbell className="h-4 w-4" />,
  "CCTV": <ShieldCheck className="h-4 w-4" />,
  "Parking": <Car className="h-4 w-4" />,
  "Power Backup": <Zap className="h-4 w-4" />,
  "Hot Water": <Droplets className="h-4 w-4" />,
  "Study Room": <BookOpen className="h-4 w-4" />,
  "Laundry": <Sparkles className="h-4 w-4" />,
  "Housekeeping": <Home className="h-4 w-4" />,
  "Terrace": <Sun className="h-4 w-4" />,
};

const HostelDetail = ({ hostel, onBack }: HostelDetailProps) => {
  const [activePhoto, setActivePhoto] = useState(0);

  const vacancyColor =
    hostel.vacancies === 0
      ? "text-destructive"
      : hostel.vacancies <= 3
        ? "text-warning"
        : "text-success";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="rounded-lg p-2 text-foreground transition-colors hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold text-foreground truncate">{hostel.name}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-4">
        {/* Photo Gallery */}
        <div className="mb-4">
          <div className="overflow-hidden rounded-2xl aspect-[16/9]">
            <img
              src={hostel.photos[activePhoto] || hostel.image}
              alt={`${hostel.name} photo ${activePhoto + 1}`}
              className="h-full w-full object-cover transition-all duration-500"
            />
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {hostel.photos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                className={`flex-shrink-0 overflow-hidden rounded-xl transition-all duration-200 ${
                  activePhoto === i
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={photo}
                  alt={`Thumbnail ${i + 1}`}
                  className="h-16 w-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="rounded-2xl bg-card p-5 shadow-card mb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-foreground">{hostel.name}</h2>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {hostel.location}
              </div>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-sm font-semibold">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
              {hostel.rating}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <div>
              <span className="text-2xl font-bold text-primary">
                ₹{hostel.rent.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">/month</span>
            </div>
            <div className={`text-sm font-semibold ${vacancyColor}`}>
              {hostel.vacancies === 0 ? "No Vacancies" : `${hostel.vacancies} beds available`}
            </div>
          </div>

          <div className="mt-3">
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize text-secondary-foreground">
              {hostel.gender === "male" ? "👦 Boys" : "👧 Girls"}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-2xl bg-card p-5 shadow-card mb-4">
          <h3 className="text-base font-bold text-foreground mb-2">About</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {hostel.description}
          </p>
        </div>

        {/* Amenities */}
        <div className="rounded-2xl bg-card p-5 shadow-card mb-4">
          <h3 className="text-base font-bold text-foreground mb-3">Amenities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {hostel.amenities.map((amenity) => (
              <div
                key={amenity}
                className="flex items-center gap-2.5 rounded-xl bg-secondary px-3.5 py-2.5 text-sm font-medium text-foreground"
              >
                <span className="text-primary">
                  {amenityIcons[amenity] || <Sparkles className="h-4 w-4" />}
                </span>
                {amenity}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Button */}
        <div className="pb-6">
          <a
            href={`tel:${hostel.contactPhone}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            <Phone className="h-5 w-5" />
            Contact Owner — {hostel.contactPhone}
          </a>
        </div>
      </main>
    </div>
  );
};

export default HostelDetail;
