import React from 'react';
import { useSpa } from '../../context/SpaContext';
import { Check, X, Trash2, Search } from 'lucide-react';
import { BookingStatus } from '../../types';

const BookingsPage: React.FC = () => {
  const { bookings, services, updateBookingStatus, deleteBooking } = useSpa();
  const [filter, setFilter] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const getServiceName = (id: string) => services.find(s => s.id === id)?.name || 'Dịch vụ không xác định';

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const StatusBadge = ({ status }: { status: BookingStatus }) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700'
    };
    
    const statusText = {
      pending: 'Chờ duyệt',
      confirmed: 'Đã xác nhận',
      cancelled: 'Đã hủy',
      completed: 'Hoàn thành'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colors[status]}`}>
        {statusText[status]}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Quản Lý Lịch Hẹn</h1>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
             <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
             <input 
              type="text" 
              placeholder="Tìm khách hàng..." 
              className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm bg-white text-slate-900 focus:ring-rose-500 focus:border-rose-500 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <select 
            className="border border-slate-300 rounded-lg px-4 py-2 text-sm bg-white text-slate-900 outline-none focus:ring-2 focus:ring-rose-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ duyệt</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Khách Hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dịch Vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ngày & Giờ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    Không tìm thấy lịch hẹn nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{booking.customerName}</div>
                      <div className="text-sm text-slate-500">{booking.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {getServiceName(booking.serviceId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      <div>{booking.date}</div>
                      <div className="text-xs text-slate-400">{booking.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900 bg-green-50 p-1.5 rounded"
                              title="Xác nhận"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900 bg-red-50 p-1.5 rounded"
                              title="Từ chối"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => deleteBooking(booking.id)}
                          className="text-slate-400 hover:text-red-600 p-1.5"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;