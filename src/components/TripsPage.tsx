import { CalendarDays, MapPin } from "lucide-react";

interface Booking {
  id: string;
  hostelName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  status: "upcoming" | "completed" | "cancelled";
  image: string;
}

interface TripsPageProps {
  bookings: Booking[];
}

const statusStyles = {
  upcoming: "bg-primary/10 text-primary",
  completed: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

const TripsPage = ({ bookings }: TripsPageProps) => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-5xl px-4 pt-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Trips</h1>
        <p className="text-sm text-muted-foreground mb-6">Your booking history</p>

        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <CalendarDays className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold text-foreground">No trips yet</p>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs">
              When you book a hostel, your trips will show up here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="flex gap-4 rounded-2xl bg-card p-4 shadow-card transition-all hover:shadow-card-hover">
                <img src={b.image} alt={b.hostelName} className="h-20 w-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">{b.hostelName}</h3>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {b.location}
                  </div>
                  <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {b.checkIn} → {b.checkOut}
                  </div>
                  <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize ${statusStyles[b.status]}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export type { Booking };
export default TripsPage;
