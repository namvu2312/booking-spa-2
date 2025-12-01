import React from 'react';
import { useSpa } from '../../context/SpaContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, DollarSign, Users, Clock } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { bookings, services } = useSpa();

  // Calculate Stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const revenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((acc, curr) => {
      const service = services.find(s => s.id === curr.serviceId);
      return acc + (service?.price || 0);
    }, 0);
  
  // Prepare Chart Data
  const bookingsByStatus = [
    { name: 'Chờ duyệt', count: pendingBookings },
    { name: 'Đã duyệt', count: bookings.filter(b => b.status === 'confirmed').length },
    { name: 'Hoàn thành', count: bookings.filter(b => b.status === 'completed').length },
    { name: 'Đã hủy', count: bookings.filter(b => b.status === 'cancelled').length },
  ];

  // Dummy monthly data for demo
  const revenueData = [
    { name: 'Th1', revenue: 1200 },
    { name: 'Th2', revenue: 2100 },
    { name: 'Th3', revenue: 1800 },
    { name: 'Th4', revenue: 2400 },
    { name: 'Th5', revenue: revenue + 1500 }, // Dynamic element
  ];

  const StatCard = ({ icon: Icon, title, value, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
      <div className={`p-4 rounded-full ${color} bg-opacity-10 mr-4`}>
        <Icon className={`h-8 w-8 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Tổng Quan Bảng Điều Khiển</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Calendar} 
          title="Tổng Lịch Hẹn" 
          value={totalBookings} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={DollarSign} 
          title="Doanh Thu" 
          value={`$${revenue}`} 
          color="bg-green-500" 
        />
        <StatCard 
          icon={Clock} 
          title="Đang Chờ" 
          value={pendingBookings} 
          color="bg-orange-500" 
        />
        <StatCard 
          icon={Users} 
          title="Dịch Vụ" 
          value={services.length} 
          color="bg-purple-500" 
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings Status Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Trạng Thái Lịch Hẹn</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingsByStatus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Xu Hướng Doanh Thu (YTD)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#be123c" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;