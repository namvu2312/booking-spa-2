import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, ShieldCheck } from 'lucide-react';
import { useSpa } from '../../context/SpaContext';

const HomePage: React.FC = () => {
  const { services } = useSpa();
  const featuredServices = services.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Spa Background" 
            className="w-full h-full object-cover brightness-50"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Tìm Lại Sự <span className="text-rose-400">Bình Yên</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 mb-8 max-w-2xl">
            Thoát khỏi những bộn bề thường nhật và bắt đầu hành trình thư giãn. Các chuyên gia trị liệu của chúng tôi mang đến những liệu pháp đẳng cấp thế giới giúp tái tạo cơ thể và tâm trí của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/booking" 
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full text-white bg-rose-600 hover:bg-rose-700 md:py-4 md:text-xl md:px-10 transition shadow-lg hover:shadow-rose-500/30"
            >
              Đặt Lịch Ngay
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-full text-white hover:bg-white hover:text-slate-900 transition md:py-4 md:text-xl md:px-10">
              Xem Dịch Vụ
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-rose-100 p-4 rounded-full mb-4">
                <Star className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Chuyên Gia Trị Liệu</h3>
              <p className="text-slate-600">Đội ngũ của chúng tôi bao gồm các chuyên gia được chứng nhận với nhiều năm kinh nghiệm trong các liệu pháp trị liệu khác nhau.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-rose-100 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Lịch Trình Linh Hoạt</h3>
              <p className="text-slate-600">Đặt lịch trực tuyến ngay lập tức. Chúng tôi cung cấp khung giờ linh hoạt phù hợp với cuộc sống bận rộn của bạn.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-rose-100 p-4 rounded-full mb-4">
                <ShieldCheck className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sản Phẩm Cao Cấp</h3>
              <p className="text-slate-600">Chúng tôi chỉ sử dụng các sản phẩm hữu cơ chất lượng cao, an toàn cho làn da của bạn và thân thiện với môi trường.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Dịch Vụ Phổ Biến</h2>
            <p className="mt-4 text-slate-600">Lựa chọn từ các liệu pháp được yêu thích nhất.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map(service => (
              <div key={service.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden flex flex-col h-full">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.name} 
                    className="w-full h-full object-cover hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                  <p className="text-slate-500 mb-4 flex-1">{service.description}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-lg font-bold text-rose-600">${service.price}</span>
                    <span className="text-sm text-slate-400">{service.duration} phút</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/booking" className="inline-flex items-center text-rose-600 font-semibold hover:text-rose-700 transition">
              Xem tất cả dịch vụ <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;