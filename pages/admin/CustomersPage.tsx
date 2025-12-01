import React from 'react';
import { useSpa } from '../../context/SpaContext';
import { Mail, Phone } from 'lucide-react';

const CustomersPage: React.FC = () => {
  const { customers } = useSpa();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Cơ Sở Dữ Liệu Khách Hàng</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{customer.name}</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-slate-500">
                    <Mail className="h-4 w-4 mr-2" />
                    {customer.email}
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

        {customers.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500">
            Chưa có dữ liệu khách hàng nào.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;