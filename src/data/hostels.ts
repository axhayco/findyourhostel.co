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
  gender: "male" | "female";
  image: string;
}

export const mockHostels: Hostel[] = [
  {
    id: "1",
    name: "Sunrise Boys Hostel",
    location: "Koramangala, Bangalore",
    rent: 6500,
    rating: 4.3,
    vacancies: 5,
    gender: "male",
    image: hostel1,
  },
  {
    id: "2",
    name: "Comfort Girls PG",
    location: "HSR Layout, Bangalore",
    rent: 7200,
    rating: 4.6,
    vacancies: 2,
    gender: "female",
    image: hostel2,
  },
  {
    id: "3",
    name: "Elite Men's Hostel",
    location: "BTM Layout, Bangalore",
    rent: 5800,
    rating: 4.1,
    vacancies: 8,
    gender: "male",
    image: hostel3,
  },
  {
    id: "4",
    name: "Grace Women's Hostel",
    location: "Indiranagar, Bangalore",
    rent: 8500,
    rating: 4.8,
    vacancies: 0,
    gender: "female",
    image: hostel4,
  },
  {
    id: "5",
    name: "Urban Stay Boys",
    location: "Marathahalli, Bangalore",
    rent: 5500,
    rating: 3.9,
    vacancies: 12,
    gender: "male",
    image: hostel1,
  },
  {
    id: "6",
    name: "Serenity Girls Hostel",
    location: "Whitefield, Bangalore",
    rent: 7800,
    rating: 4.5,
    vacancies: 3,
    gender: "female",
    image: hostel3,
  },
];
