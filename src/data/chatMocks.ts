/*export interface ChatUser {
  id: string;
  firstName: string;
  avatar: string;
  bio?: string;
  arrivalDate: string;
  departureDate: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  reactions: Record<string, string[]>; // emoji -> userId[]
  isPinned?: boolean;
  isReported?: boolean;
}

export interface ChatChannel {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const CHAT_CHANNELS: ChatChannel[] = [
  { id: "lounge", name: "Hostel Lounge", icon: "💬", description: "General chat for all guests" },
  { id: "events", name: "Events", icon: "🎉", description: "Plan meetups & activities" },
];

export const mockChatUsers: ChatUser[] = [
  { id: "u1", firstName: "Arjun", avatar: "🧑‍💻", bio: "CS student, love coding & coffee", arrivalDate: "2026-03-18", departureDate: "2026-03-25", isOnline: true },
  { id: "u2", firstName: "Priya", avatar: "👩‍🎨", bio: "Design nerd. Always sketching.", arrivalDate: "2026-03-20", departureDate: "2026-03-23", isOnline: true },
  { id: "u3", firstName: "Rahul", avatar: "🏋️", bio: "Gym bro & foodie", arrivalDate: "2026-03-19", departureDate: "2026-03-26", isOnline: false },
  { id: "u4", firstName: "Sneha", avatar: "📚", bio: "Bookworm. Looking for study buddies!", arrivalDate: "2026-03-17", departureDate: "2026-03-22", isOnline: true },
  { id: "u5", firstName: "Karthik", avatar: "🎸", bio: "Music > everything", arrivalDate: "2026-03-21", departureDate: "2026-03-28", isOnline: false },
  { id: "u6", firstName: "Ananya", avatar: "🌿", bio: "", arrivalDate: "2026-03-16", departureDate: "2026-03-20", isOnline: true },
];

export const mockPinnedMessages: ChatMessage[] = [
  { id: "pin1", userId: "admin", text: "📶 WiFi: HostelMate_5G | Password: welcome2026", timestamp: "2026-03-15T10:00:00", reactions: {}, isPinned: true },
  { id: "pin2", userId: "admin", text: "🏠 House Rules: Quiet hours 11PM–7AM. No smoking indoors. Keep common areas clean!", timestamp: "2026-03-15T10:05:00", reactions: {}, isPinned: true },
  { id: "pin3", userId: "admin", text: "🎉 Rooftop BBQ this Saturday 7PM — sign up at reception!", timestamp: "2026-03-16T09:00:00", reactions: {}, isPinned: true },
];

export const mockMessages: Record<string, ChatMessage[]> = {
  lounge: [
    { id: "m1", userId: "u1", text: "Hey everyone! Just checked in. This place is 🔥", timestamp: "2026-03-17T14:30:00", reactions: { "🔥": ["u2", "u4"], "👋": ["u3"] } },
    { id: "m2", userId: "u4", text: "Welcome Arjun! The rooftop is amazing, check it out", timestamp: "2026-03-17T14:32:00", reactions: { "💯": ["u1"] } },
    { id: "m3", userId: "u2", text: "Anyone up for grabbing dinner at that place around the corner?", timestamp: "2026-03-17T15:10:00", reactions: { "🙋": ["u1", "u3", "u4"], "😋": ["u6"] } },
    { id: "m4", userId: "u6", text: "Count me in! I heard they have great biryani", timestamp: "2026-03-17T15:12:00", reactions: {} },
    { id: "m5", userId: "u3", text: "Let's go at 7:30? Need to finish my workout first 💪", timestamp: "2026-03-17T15:15:00", reactions: { "👍": ["u2", "u6"] } },
  ],
  events: [
    { id: "e1", userId: "u2", text: "Who wants to do a sunrise trek this weekend? There's a great hill nearby 🏔️", timestamp: "2026-03-17T11:00:00", reactions: { "🏔️": ["u1", "u5"], "❤️": ["u4"] } },
    { id: "e2", userId: "u5", text: "I'm in! I can bring my bluetooth speaker for the hike", timestamp: "2026-03-17T11:20:00", reactions: { "🎵": ["u2"] } },
    { id: "e3", userId: "u4", text: "Study group tonight in the common room? Exam prep 📖", timestamp: "2026-03-17T13:00:00", reactions: { "📖": ["u6"], "💪": ["u1"] } },
  ],
};

export const CURRENT_USER: ChatUser = {
  id: "u1",
  firstName: "Arjun",
  avatar: "🧑‍💻",
  bio: "CS student, love coding & coffee",
  arrivalDate: "2026-03-18",
  departureDate: "2026-03-25",
  isOnline: true,
};

export const QUICK_EMOJIS = ["👍", "❤️", "😂", "🔥", "👋", "🙋", "💯", "😋", "🎉", "👏"];

export function formatStayBadge(arrival: string, departure: string): string {
  const a = new Date(arrival);
  const d = new Date(departure);
  const fmt = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `Staying ${fmt(a)}–${fmt(d)}`;
}

export function isArrivingThisWeek(arrivalDate: string): boolean {
  const now = new Date("2026-03-17");
  const arrival = new Date(arrivalDate);
  const endOfWeek = new Date(now);
  endOfWeek.setDate(now.getDate() + 7);
  return arrival >= now && arrival <= endOfWeek;
}
*/
