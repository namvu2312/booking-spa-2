import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const BookingSuccessPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full border border-slate-100">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-4 animate-bounce">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Đặt Lịch Thành Công!</h1>
        <p className="text-slate-600 mb-8">
          Cảm ơn bạn đã lựa chọn Serenity Spa. Chúng tôi đã nhận được yêu cầu đặt chỗ của bạn và sẽ gửi email xác nhận sớm nhất.
        </p>
        <div className="space-y-4">
          <Link 
            to="/" 
            className="block w-full bg-rose-600 text-white font-medium py-3 rounded-lg hover:bg-rose-700 transition"
          >
            Về Trang Chủ
          </Link>
          <Link 
            to="/booking" 
            className="block w-full bg-slate-100 text-slate-700 font-medium py-3 rounded-lg hover:bg-slate-200 transition"
          >
            Đặt Lịch Khác
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;