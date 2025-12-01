export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  image: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  serviceId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string; // ISO Date string YYYY-MM-DD
  time: string; // HH:MM
  status: BookingStatus;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalVisits: number;
  lastVisit: string;
}

export interface AdminUser {
  username: string;
  isAuthenticated: boolean;
}

export interface DashboardStats {
  totalBookings: number;
  revenue: number;
  pendingBookings: number;
  activeServices: number;
}
