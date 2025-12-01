import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSpa } from '../../context/SpaContext';
import { Lock, User } from 'lucide-react';

// --- CẤU HÌNH TÀI KHOẢN ADMIN ---
// Bạn có thể thay đổi tên đăng nhập và mật khẩu tại đây
const ADMIN_CREDENTIALS = {
  USERNAME: 'admin',
  PASSWORD: 'password123' // Đã đổi mật khẩu mặc định
};

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useSpa();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra thông tin đăng nhập dựa trên cấu hình ở trên
    if (username === ADMIN_CREDENTIALS.USERNAME && password === ADMIN_CREDENTIALS.PASSWORD) {
      login();
      navigate('/admin/dashboard');
    } else {
      setError('Thông tin không chính xác. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Đăng Nhập Quản Trị</h1>
          <p className="text-slate-500">Truy cập bảng điều khiển quản lý</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên đăng nhập</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-rose-500 focus:border-rose-500 outline-none"
                placeholder="Nhập tên đăng nhập"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-rose-500 focus:border-rose-500 outline-none"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition"
          >
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;