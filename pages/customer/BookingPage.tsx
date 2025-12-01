import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpa } from '../../context/SpaContext';
import { Check, ChevronRight, ChevronLeft, Calendar, Loader2, UserCheck } from 'lucide-react';

const STEPS = ['Dịch vụ', 'Ngày & Giờ', 'Thông tin', 'Xác nhận'];

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { services, addBooking, getCustomerByPhone } = useSpa();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  
  // States cho việc Auto-fill
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [foundCustomer, setFoundCustomer] = useState(false);

  const selectedService = services.find(s => s.id === selectedServiceId);

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    if (selectedService && date && time) {
      addBooking({
        serviceId: selectedService.id,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        date,
        time,
      });
      navigate('/success');
    }
  };

  // Helper validation to disable Next button
  const isStepValid = () => {
    if (currentStep === 1) return !!selectedServiceId;
    if (currentStep === 2) return !!date && !!time;
    if (currentStep === 3) return !!formData.name && !!formData.phone; // Email is now optional
    return true;
  };

  // Xử lý khi nhập số điện thoại (Auto-fill)
  const handlePhoneBlur = async () => {
    // Chỉ check nếu sđt có độ dài hợp lệ (ví dụ > 9 số)
    if (formData.phone.length > 9) {
      setIsCheckingPhone(true);
      try {
        const customer = await getCustomerByPhone(formData.phone);
        if (customer) {
          setFormData(prev => ({
            ...prev,
            name: customer.name,
            // email: customer.email || prev.email // Nếu DB có email thì điền luôn
          }));
          setFoundCustomer(true);
        } else {
          setFoundCustomer(false);
        }
      } catch (e) {
        console.error("Lỗi khi tìm khách hàng", e);
      } finally {
        setIsCheckingPhone(false);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, phone: e.target.value});
    // Reset trạng thái tìm thấy nếu người dùng sửa sđt
    if (foundCustomer) setFoundCustomer(false);
  };

  // Generate simple time slots
  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-slate-200 -z-10"></div>
          {STEPS.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === currentStep;
            const isCompleted = stepNum < currentStep;

            return (
              <div key={step} className="flex flex-col items-center bg-slate-50 px-2">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300
                    ${isActive ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}
                  `}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNum}
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive ? 'text-rose-600' : 'text-slate-500'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden min-h-[500px] flex flex-col">
        {/* Step Content */}
        <div className="p-8 flex-grow">
          
          {/* STEP 1: SELECT SERVICE */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Chọn Dịch Vụ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map(service => (
                  <div 
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`cursor-pointer rounded-xl border-2 p-4 flex gap-4 transition-all hover:shadow-md
                      ${selectedServiceId === service.id ? 'border-rose-500 bg-rose-50' : 'border-slate-100 hover:border-rose-200'}
                    `}
                  >
                    <img src={service.image} alt={service.name} className="w-24 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800">{service.name}</h3>
                        <span className="font-semibold text-rose-600">${service.price}</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-1 line-clamp-2">{service.description}</p>
                      <span className="text-xs text-slate-400 mt-2 block">{service.duration} phút</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: DATE & TIME */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">Chọn Ngày & Giờ</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Chọn Ngày</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                  />
                  <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                    <Calendar className="inline-block h-4 w-4 mr-2" />
                    Chúng tôi mở cửa Thứ 2 - Chủ Nhật, 9:00 - 18:00.
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Khung Giờ Còn Trống</label>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition
                          ${time === slot 
                            ? 'bg-rose-600 text-white shadow-md' 
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
                        `}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: INFO */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-lg mx-auto">
              <h2 className="text-2xl font-bold text-slate-800 text-center">Thông Tin Của Bạn</h2>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700">Số Điện Thoại</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      onBlur={handlePhoneBlur}
                      className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none"
                      placeholder="(090) 123-4567"
                    />
                    {isCheckingPhone && (
                      <div className="absolute right-3 top-4">
                        <Loader2 className="h-5 w-5 text-rose-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Nhập số điện thoại để hệ thống tự động điền thông tin nếu bạn là khách hàng cũ.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Họ và Tên
                    {foundCustomer && <span className="ml-2 text-xs text-green-600 font-medium flex-inline items-center"><UserCheck className="inline h-3 w-3 mr-1"/>Đã tìm thấy thông tin cũ</span>}
                  </label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className={`mt-1 w-full px-4 py-3 rounded-lg border bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none
                      ${foundCustomer ? 'border-green-300 bg-green-50' : 'border-slate-300'}
                    `}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Địa Chỉ Email <span className="text-slate-400 font-normal">(Tùy chọn)</span>
                  </label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="mt-1 w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-rose-500 outline-none"
                    placeholder="nguyenvana@example.com"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRM */}
          {currentStep === 4 && selectedService && (
            <div className="space-y-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-slate-800 text-center">Xác Nhận Đặt Lịch</h2>
              
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4">
                <div className="flex justify-between border-b border-slate-200 pb-4">
                  <span className="text-slate-500">Dịch Vụ</span>
                  <span className="font-semibold text-slate-800 text-right">{selectedService.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-4">
                  <span className="text-slate-500">Ngày & Giờ</span>
                  <span className="font-semibold text-slate-800">{date} lúc {time}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-4">
                  <span className="text-slate-500">Khách Hàng</span>
                  <div className="text-right">
                    <div className="font-semibold text-slate-800">{formData.name}</div>
                    <div className="text-sm text-slate-500">{formData.phone}</div>
                    {formData.email && <div className="text-sm text-slate-500">{formData.email}</div>}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-slate-700">Tổng Cộng</span>
                  <span className="text-2xl font-bold text-rose-600">${selectedService.price}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 flex justify-between">
          <button 
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-2 rounded-lg font-medium transition
              ${currentStep === 1 
                ? 'opacity-0 cursor-default' 
                : 'text-slate-600 hover:bg-slate-200'}
            `}
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Quay Lại
          </button>
          <button 
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center px-8 py-2 rounded-lg font-medium shadow-md transition
              ${!isStepValid() 
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                : 'bg-rose-600 text-white hover:bg-rose-700 hover:shadow-lg'}
            `}
          >
            {currentStep === 4 ? 'Xác Nhận Đặt' : 'Tiếp Tục'} 
            {currentStep !== 4 && <ChevronRight className="h-4 w-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;