import hostel1 from "@/assets/hostel1.jpg";
import hostel2 from "@/assets/hostel2.jpg";
import hostel3 from "@/assets/hostel3.jpg";
import hostel4 from "@/assets/hostel4.jpg";

export interface Hostel {
  id: string;
  name: string;
  location: string;
  rent: number;
  rating: number;
  vacancies: number;
  totalCapacity: number;
  gender: "male" | "female";
  image: string;
  photos: string[];
  amenities: string[];
  description: string;
  contactPhone: string;
  lat: number;
  lng: number;
  ownerId?: string;
}

export const ALL_AMENITIES = [
  "Wi-Fi", "AC", "Laundry", "Power Backup", "CCTV", "Parking",
  "Meals Included", "Gym", "Housekeeping", "Hot Water", "Study Room", "Terrace",
];

export const mockHostels: Hostel[] = [
  {
    id: "1",
    name: "Sunrise Boys Hostel",
    location: "Koramangala, Bangalore",
    rent: 6500,
    rating: 4.3,
    vacancies: 5,
    totalCapacity: 30,
    gender: "male",
    image: hostel1,
    photos: [hostel1, hostel2, hostel3],
    amenities: ["Wi-Fi", "AC", "Laundry", "Power Backup", "CCTV", "Parking"],
    description: "A well-maintained boys hostel in the heart of Koramangala with spacious rooms, 24/7 water supply, and excellent connectivity to major IT parks.",
    contactPhone: "+91 98765 43210",
    lat: 12.9352,
    lng: 77.6245,
  },
  {
    id: "2",
    name: "Comfort Girls PG",
    location: "HSR Layout, Bangalore",
    rent: 7200,
    rating: 4.6,
    vacancies: 2,
    totalCapacity: 20,
    gender: "female",
    image: hostel2,
    photos: [hostel2, hostel4, hostel1],
    amenities: ["Wi-Fi", "AC", "Meals Included", "Gym", "CCTV", "Housekeeping"],
    description: "Premium women's PG with home-cooked meals, modern gym facilities, and a safe environment with 24/7 security and warden.",
    contactPhone: "+91 98765 43211",
    lat: 12.9116,
    lng: 77.6389,
  },
  {
    id: "3",
    name: "Elite Men's Hostel",
    location: "BTM Layout, Bangalore",
    rent: 5800,
    rating: 4.1,
    vacancies: 8,
    totalCapacity: 40,
    gender: "male",
    image: hostel3,
    photos: [hostel3, hostel1, hostel4],
    amenities: ["Wi-Fi", "Hot Water", "Power Backup", "Study Room", "Parking"],
    description: "Affordable and clean hostel near BTM Layout metro station. Ideal for students and working professionals looking for budget-friendly accommodation.",
    contactPhone: "+91 98765 43212",
    lat: 12.9166,
    lng: 77.6101,
  },
  {
    id: "4",
    name: "Grace Women's Hostel",
    location: "Indiranagar, Bangalore",
    rent: 8500,
    rating: 4.8,
    vacancies: 0,
    totalCapacity: 25,
    gender: "female",
    image: hostel4,
    photos: [hostel4, hostel2, hostel3],
    amenities: ["Wi-Fi", "AC", "Meals Included", "Laundry", "Gym", "Terrace", "CCTV"],
    description: "Luxury women's hostel in upscale Indiranagar with rooftop terrace, fully equipped kitchen, and proximity to cafes and shopping areas.",
    contactPhone: "+91 98765 43213",
    lat: 12.9784,
    lng: 77.6408,
  },
  {
    id: "5",
    name: "Urban Stay Boys",
    location: "Marathahalli, Bangalore",
    rent: 5500,
    rating: 3.9,
    vacancies: 12,
    totalCapacity: 50,
    gender: "male",
    image: hostel1,
    photos: [hostel1, hostel3, hostel2],
    amenities: ["Wi-Fi", "Power Backup", "Laundry", "Parking"],
    description: "Budget-friendly boys hostel near Marathahalli bridge with easy access to Outer Ring Road tech parks. Basic amenities with clean rooms.",
    contactPhone: "+91 98765 43214",
    lat: 12.9591,
    lng: 77.6974,
  },
  {
    id: "6",
    name: "Serenity Girls Hostel",
    location: "Whitefield, Bangalore",
    rent: 7800,
    rating: 4.5,
    vacancies: 3,
    totalCapacity: 35,
    gender: "female",
    image: hostel3,
    photos: [hostel3, hostel4, hostel1],
    amenities: ["Wi-Fi", "AC", "Meals Included", "Housekeeping", "CCTV", "Power Backup"],
    description: "Peaceful women's hostel in Whitefield with excellent food, regular housekeeping, and a quiet study environment close to ITPL.",
    contactPhone: "+91 98765 43215",
    lat: 12.9698,
    lng: 77.7500,
  },
];
