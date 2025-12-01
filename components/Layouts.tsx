import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSpa } from '../context/SpaContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  Settings, 
  LogOut, 
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-rose-500" />
                <span className="text-xl font-bold text-slate-800">Serenity Spa</span>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-600 hover:text-rose-500 font-medium transition">Trang Chủ</Link>
              <Link to="/booking" className="text-slate-600 hover:text-rose-500 font-medium transition">Đặt Lịch</Link>
              <Link to="/admin" className="text-sm text-slate-400 hover:text-slate-600">Quản Trị</Link>
              <Link 
                to="/booking" 
                className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2 rounded-full font-medium transition shadow-md hover:shadow-lg"
              >
                Đặt Lịch Ngay
              </Link>
            </div>

            {/* Mobile Button */}
            <div className="flex items-center md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-slate-700 hover:bg-rose-50">Trang Chủ</Link>
            <Link to="/booking" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-slate-700 hover:bg-rose-50">Đặt Lịch</Link>
            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-slate-400">Quản Trị</Link>
          </div>
        )}
      </nav>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">&copy; {new Date().getFullYear()} Serenity Spa. Bảo lưu mọi quyền.</p>
          <p className="text-sm text-slate-500">Thư Giãn. Phục Hồi. Tái Tạo.</p>
        </div>
      </footer>
    </div>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useSpa();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Bảng Điều Khiển', path: '/admin/dashboard' },
    { icon: CalendarDays, label: 'Lịch Hẹn', path: '/admin/bookings' },
    { icon: Users, label: 'Khách Hàng', path: '/admin/customers' },
    { icon: Settings, label: 'Dịch Vụ', path: '/admin/services' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Sparkles className="h-6 w-6 text-rose-500 mr-2" />
          <span className="font-bold text-lg">Quản Trị Viên</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                  ? 'bg-rose-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-slate-400 hover:text-white w-full transition"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 md:px-8">
           <h2 className="text-xl font-semibold text-slate-800">
             {navItems.find(i => i.path === location.pathname)?.label || 'Quản Trị'}
           </h2>
           <div className="md:hidden">
             {/* Mobile Toggle Placeholder */}
             <span className="text-xs text-slate-400">Menu chỉ hiển thị trên máy tính</span>
           </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};