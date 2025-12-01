import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { Mail, Phone, Search } from 'lucide-react';

const CustomersPage: React.FC = () => {
  const { customers } = useSpa();
  const [searchTerm, setSearchTerm] = useState('');

  // Logic lọc khách hàng: Tên OR Email OR Phone chứa từ khóa tìm kiếm
  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.phone.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Cơ Sở Dữ Liệu Khách Hàng</h1>
        
        {/* Thanh tìm kiếm */}
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Tìm theo tên, SĐT hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{customer.name}</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-slate-500">
                    <Mail className="h-4 w-4 mr-2" />
                    {customer.email || 'Chưa cập nhật'}
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                    <Phone className="h-4 w-4 mr-2" />
                    {customer.phone}
                  </div>
                </div>
              </div>
              <div className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
                VIP
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className="text-center">
                <span className="block text-2xl font-bold text-slate-800">{customer.totalVisits}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wide">Lượt Ghé Thăm</span>
              </div>
              <div className="text-center">
                <span className="block text-sm font-semibold text-slate-800 mt-2">{customer.lastVisit}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wide">Ghé Lần Cuối</span>
              </div>
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            {searchTerm ? 'Không tìm thấy khách hàng nào phù hợp với từ khóa.' : 'Chưa có dữ liệu khách hàng nào.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;