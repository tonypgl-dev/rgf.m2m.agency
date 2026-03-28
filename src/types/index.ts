export type Role = "tourist" | "companion";

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  city: string | null;
  created_at: string;
}

export interface Companion {
  id: string;
  profile_id: string;
  bio: string | null;
  hourly_rate: number | null;
  languages: string[];
  activities: string[];
  rating_avg: number;
  verified: boolean;
  total_reviews: number;
  stripe_account_id: string | null;
}

export interface AvailabilitySlot {
  id: string;
  companion_id: string;
  date: string; // YYYY-MM-DD
  time_start: string; // HH:MM:SS
  time_end: string; // HH:MM:SS
  is_booked: boolean;
}

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: string;
  tourist_id: string;
  companion_id: string;
  slot_id: string;
  activity: string;
  meeting_point: string;
  status: BookingStatus;
  total_price: number;
  duration_hours: number;
  stripe_payment_intent_id: string | null;
  check_in_at: string | null;
  check_out_at: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}
