import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, Booking, AdminUser, Customer } from '../types';

interface SpaContextType {
  services: Service[];
  bookings: Booking[];
  customers: Customer[];
  admin: AdminUser;
  login: () => void;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  deleteService: (id: string) => void;
  deleteBooking: (id: string) => void;
}

const SpaContext = createContext<SpaContextType | undefined>(undefined);

const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Massage Thư Giãn',
    description: 'Massage Thụy Điển nhẹ nhàng giúp giảm căng thẳng và mệt mỏi.',
    duration: 60,
    price: 80,
    image: 'https://picsum.photos/400/300?random=1'
  },
  {
    id: '2',
    name: 'Trị Liệu Chuyên Sâu',
    description: 'Tác động lực mạnh vào các lớp cơ sâu để giảm đau mãn tính.',
    duration: 90,
    price: 120,
    image: 'https://picsum.photos/400/300?random=2'
  },
  {
    id: '3',
    name: 'Chăm Sóc Da Mặt Cấp Ẩm',
    description: 'Phục hồi độ ẩm và làm sáng da với các loại serum hữu cơ.',
    duration: 45,
    price: 65,
    image: 'https://picsum.photos/400/300?random=3'
  },
  {
    id: '4',
    name: 'Tẩy Tế Bào Chết Toàn Thân',
    description: 'Liệu pháp tẩy da chết giúp loại bỏ tế bào cũ và làm mềm da.',
    duration: 60,
    price: 90,
    image: 'https://picsum.photos/400/300?random=4'
  }
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: '101',
    serviceId: '1',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    customerEmail: 'nguyenvana@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '102',
    serviceId: '3',
    customerName: 'Trần Thị B',
    customerPhone: '0987654321',
    customerEmail: 'tranthib@example.com',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '14:00',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

export const SpaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from local storage or use initial
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('spa_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('spa_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [admin, setAdmin] = useState<AdminUser>(() => {
    const saved = localStorage.getItem('spa_admin');
    return saved ? JSON.parse(saved) : { username: 'admin', isAuthenticated: false };
  });

  // Derived customers list from bookings (simplified logic)
  const customers: Customer[] = React.useMemo(() => {
    const map = new Map<string, Customer>();
    bookings.forEach(b => {
      // Use email if available, otherwise phone as key
      const key = b.customerEmail || b.customerPhone;
      
      if (!map.has(key)) {
        map.set(key, {
          id: key, // simple ID
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone,
          totalVisits: 0,
          lastVisit: b.date
        });
      }
      const c = map.get(key)!;
      c.totalVisits += 1;
      if (new Date(b.date) > new Date(c.lastVisit)) {
        c.lastVisit = b.date;
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('spa_services', JSON.stringify(services));
    localStorage.setItem('spa_bookings', JSON.stringify(bookings));
    localStorage.setItem('spa_admin', JSON.stringify(admin));
  }, [services, bookings, admin]);

  const login = () => setAdmin({ ...admin, isAuthenticated: true });
  const logout = () => setAdmin({ ...admin, isAuthenticated: false });

  const addBooking = (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: Booking = {
      ...bookingData,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...serviceData,
      id: Math.random().toString(36).substr(2, 9)
    };
    setServices(prev => [...prev, newService]);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  return (
    <SpaContext.Provider value={{
      services, bookings, customers, admin,
      login, logout, addBooking, updateBookingStatus, addService, deleteService, deleteBooking
    }}>
      {children}
    </SpaContext.Provider>
  );
};

export const useSpa = () => {
  const context = useContext(SpaContext);
  if (!context) throw new Error('useSpa must be used within a SpaProvider');
  return context;
};