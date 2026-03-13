import { Hostel } from "@/data/hostels";
import { MapPin, Star, Trash2 } from "lucide-react";

interface HostelCardProps {
  hostel: Hostel;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

const HostelCard = ({ hostel, onDelete, showDelete }: HostelCardProps) => {
  const vacancyColor =
    hostel.vacancies === 0
      ? "text-destructive"
      : hostel.vacancies <= 3
        ? "text-warning"
        : "text-success";

  return (
    <div className="group overflow-hidden rounded-2xl bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={hostel.image}
          alt={hostel.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg bg-card/90 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
          <Star className="h-3 w-3 fill-warning text-warning" />
          {hostel.rating}
        </div>
        {showDelete && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(hostel.id);
            }}
            className="absolute left-2 top-2 rounded-lg bg-destructive/90 p-1.5 text-destructive-foreground backdrop-blur-sm transition-all hover:bg-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="p-3.5">
        <h3 className="font-semibold text-foreground leading-tight">{hostel.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {hostel.location}
        </div>
        <div className="mt-2.5 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">₹{hostel.rent.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span></span>
          <span className={`text-xs font-semibold ${vacancyColor}`}>
            {hostel.vacancies === 0 ? "Full" : `${hostel.vacancies} beds left`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HostelCard;
