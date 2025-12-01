import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, Booking, AdminUser, Customer } from '../types';
import { supabase } from '../lib/supabase';

interface SpaContextType {
  services: Service[];
  bookings: Booking[];
  customers: Customer[];
  admin: AdminUser;
  login: () => void;
  logout: () => void;
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  isLoading: boolean;
}

const SpaContext = createContext<SpaContextType | undefined>(undefined);

// Dữ liệu mẫu mặc định cho Dịch vụ (Vẫn giữ hardcode nếu chưa có bảng services trong DB)
const DEFAULT_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Massage Thư Giãn',
    description: 'Massage Thụy Điển nhẹ nhàng giúp giảm căng thẳng và mệt mỏi.',
    duration: 60,
    price: 80,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '2',
    name: 'Trị Liệu Chuyên Sâu',
    description: 'Tác động lực mạnh vào các lớp cơ sâu để giảm đau mãn tính.',
    duration: 90,
    price: 120,
    image: 'https://images.unsplash.com/photo-1519823551278-64ac927acdbc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '3',
    name: 'Chăm Sóc Da Mặt',
    description: 'Làm sạch sâu, tẩy tế bào chết và dưỡng ẩm cho làn da rạng rỡ.',
    duration: 60,
    price: 95,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '4',
    name: 'Liệu Pháp Đá Nóng',
    description: 'Đá nóng bazan giúp thư giãn cơ bắp và cải thiện tuần hoàn.',
    duration: 75,
    price: 110,
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '5',
    name: 'Xông Hơi Thảo Dược',
    description: 'Thanh lọc cơ thể với hơi nước hòa quyện các loại thảo mộc tự nhiên.',
    duration: 30,
    price: 45,
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: '6',
    name: 'Massage Chân',
    description: 'Tập trung vào các huyệt đạo ở chân để phục hồi năng lượng.',
    duration: 45,
    price: 55,
    image: 'https://images.unsplash.com/photo-1519415387722-a1c3ebb7cc19?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }
];

export const SpaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  // Chúng ta sẽ fetch customers từ DB thay vì derive từ bookings
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const [admin, setAdmin] = useState<AdminUser>(() => {
    try {
      const saved = localStorage.getItem('spa_admin');
      return saved ? JSON.parse(saved) : { username: 'admin', isAuthenticated: false };
    } catch (e) {
      return { username: 'admin', isAuthenticated: false };
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  // Helper: Chuyển đổi Timestamp từ DB thành Date và Time cho App
  const parseBookingTime = (timestamp: string) => {
    const dateObj = new Date(timestamp);
    const date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
    // Lấy giờ phút, lưu ý múi giờ có thể ảnh hưởng, ở đây ta giả sử ISO string chuẩn
    const time = dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false }); 
    return { date, time };
  };

  // 1. FETCH DATA (Read)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (customersError) throw customersError;

      const mappedCustomers: Customer[] = (customersData || []).map((item: any) => ({
        id: item.id.toString(),
        name: item.full_name,
        phone: item.phone_number,
        email: '', // Schema khách hàng chưa có email
        totalVisits: 0, 
        lastVisit: item.created_at
      }));

      // Fetch Appointments
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (appointmentsError) throw appointmentsError;

      // Map DB structure to App Booking type
      const mappedBookings: Booking[] = (appointmentsData || []).map((item: any) => {
        const { date, time } = parseBookingTime(item.booking_time);
        
        // Tìm serviceId dựa trên service_name (Reverse lookup)
        const service = services.find(s => s.name === item.service_name);
        
        // Lookup phone from customers list based on name match
        // Vì bảng appointments không có cột phone_number, ta phải tìm từ bảng customers
        const customer = mappedCustomers.find(c => c.name === item.customer_name);
        const phone = customer ? customer.phone : '';

        return {
          id: item.id.toString(),
          serviceId: service ? service.id : 'unknown',
          customerName: item.customer_name,
          customerPhone: phone,
          customerEmail: '',
          date: date,
          time: time,
          status: item.status || 'pending',
          createdAt: item.created_at
        };
      });
      setBookings(mappedBookings);

      // Tính toán lại totalVisits dựa trên bookings đã lấy
      const calculatedCustomers = mappedCustomers.map(cust => {
        const custBookings = mappedBookings.filter(b => b.customerName === cust.name);
        return {
          ...cust,
          totalVisits: custBookings.length,
          lastVisit: custBookings.length > 0 ? custBookings[0].date : cust.lastVisit
        };
      });

      setCustomers(calculatedCustomers);

    } catch (error) {
      console.error('Lỗi khi tải dữ liệu từ Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi fetchData khi app khởi động
  useEffect(() => {
    fetchData();
  }, []);

  // Sync Admin status with localStorage only
  useEffect(() => {
    localStorage.setItem('spa_admin', JSON.stringify(admin));
  }, [admin]);

  const login = () => setAdmin({ ...admin, isAuthenticated: true });
  const logout = () => setAdmin({ ...admin, isAuthenticated: false });

  // 2. CREATE BOOKING
  const addBooking = async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      const service = services.find(s => s.id === bookingData.serviceId);
      const serviceName = service ? service.name : 'Unknown Service';
      
      // Tạo timestamp cho booking_time (Kết hợp Date và Time)
      const bookingDateTime = new Date(`${bookingData.date}T${bookingData.time}:00`);
      
      // A. Lưu thông tin khách hàng (Upsert - Thêm mới nếu chưa có sđt)
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone_number', bookingData.customerPhone)
        .single();

      if (!existingCustomer) {
        const { error: custError } = await supabase
          .from('customers')
          .insert([
            {
              full_name: bookingData.customerName,
              phone_number: bookingData.customerPhone,
              created_at: new Date().toISOString()
            }
          ]);
        if (custError) throw custError;
      }

      // B. Tạo lịch hẹn mới
      // KHÔNG gửi phone_number vào đây vì bảng appointments không có cột này
      const { error: bookingError } = await supabase
        .from('appointments')
        .insert([
          {
            customer_name: bookingData.customerName,
            // phone_number: bookingData.customerPhone, // <-- Đã xóa dòng này
            service_name: serviceName,
            booking_time: bookingDateTime.toISOString(),
            status: 'pending',
            created_at: new Date().toISOString()
          }
        ]);

      if (bookingError) throw bookingError;

      // Refresh dữ liệu local
      await fetchData();

    } catch (error) {
      console.error('Lỗi khi thêm lịch hẹn:', error);
      alert('Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. UPDATE BOOKING
  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: status })
        .eq('id', id);

      if (error) throw error;
      
      // Cập nhật state local ngay lập tức để UI phản hồi nhanh
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  // 4. DELETE BOOKING
  const deleteBooking = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này?')) return;
    
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBookings(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa lịch hẹn:', error);
    }
  };

  // SERVICE MANAGEMENT (Vẫn giữ local vì chưa có bảng services trong DB theo yêu cầu)
  const addService = async (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...serviceData,
      id: crypto.randomUUID()
    };
    setServices(prev => [...prev, newService]);
    // TODO: Khi có bảng services, thêm code supabase.insert ở đây
  };

  const deleteService = async (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    // TODO: Khi có bảng services, thêm code supabase.delete ở đây
  };

  return (
    <SpaContext.Provider value={{
      services,
      bookings,
      customers,
      admin,
      login,
      logout,
      addBooking,
      updateBookingStatus,
      addService,
      deleteService,
      deleteBooking,
      isLoading
    }}>
      {children}
    </SpaContext.Provider>
  );
};

export const useSpa = () => {
  const context = useContext(SpaContext);
  if (context === undefined) {
    throw new Error('useSpa must be used within a SpaProvider');
  }
  return context;
};