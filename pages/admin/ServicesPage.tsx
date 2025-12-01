import React, { useState } from 'react';
import { useSpa } from '../../context/SpaContext';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { Service } from '../../types';

const ServicesPage: React.FC = () => {
  const { services, addService, updateService, deleteService } = useSpa();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New Service Form State
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    image: 'https://picsum.photos/400/300' // Default placeholder
  });

  const handleEdit = (service: Service) => {
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      image: service.image
    });
    setEditingId(service.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewService({ name: '', description: '', price: '', duration: '', image: 'https://picsum.photos/400/300' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      name: newService.name,
      description: newService.description,
      price: Number(newService.price),
      duration: Number(newService.duration),
      image: newService.image
    };

    if (editingId) {
      updateService(editingId, serviceData);
    } else {
      addService(serviceData);
    }
    
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Danh Sách Dịch Vụ</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-rose-700 transition shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Thêm Dịch Vụ
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group">
            <div className="relative h-48">
              <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-800">{service.name}</h3>
                <span className="text-rose-600 font-bold">${service.price}</span>
              </div>
              <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.description}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-medium text-slate-400">{service.duration} phút</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleEdit(service)}
                    className="text-slate-400 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => deleteService(service.id)}
                    className="text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? 'Cập Nhật Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên Dịch Vụ</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:ring-rose-500 focus:border-rose-500"
                  value={newService.name}
                  onChange={e => setNewService({...newService, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Giá ($)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:ring-rose-500 focus:border-rose-500"
                    value={newService.price}
                    onChange={e => setNewService({...newService, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Thời Lượng (phút)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:ring-rose-500 focus:border-rose-500"
                    value={newService.duration}
                    onChange={e => setNewService({...newService, duration: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô Tả</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:ring-rose-500 focus:border-rose-500"
                  value={newService.description}
                  onChange={e => setNewService({...newService, description: e.target.value})}
                />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">URL Ảnh</label>
                 <input 
                    type="text"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 focus:ring-rose-500 focus:border-rose-500"
                    value={newService.image}
                    onChange={e => setNewService({...newService, image: e.target.value})}
                 />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-rose-600 text-white py-2 rounded-lg font-bold hover:bg-rose-700 transition">
                  {editingId ? 'Cập Nhật Dịch Vụ' : 'Tạo Dịch Vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;