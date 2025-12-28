
import React, { useState } from 'react';
import { User, Phone, UserCheck, Calendar, FileText, Send } from 'lucide-react';
import { Visitor } from '../types';

interface Props {
  onAdd: (visitor: Omit<Visitor, 'id' | 'status' | 'createdAt'>) => void;
}

const RegistrationPage: React.FC<Props> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    hostName: '',
    purpose: '',
    visitDateTime: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setSubmitted(true);
    setFormData({ fullName: '', phoneNumber: '', hostName: '', purpose: '', visitDateTime: '' });
  };

  if (submitted) {
    return (
      <div className="text-center py-12 bg-white rounded-3xl shadow-xl p-8 max-w-xl mx-auto border animate-in fade-in zoom-in duration-300">
        <div className="bg-green-100 text-green-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Đăng ký thành công!</h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thông tin của bạn đã được gửi đi. Vui lòng sử dụng số điện thoại của bạn để tra cứu trạng thái phê duyệt trong mục <strong>Tra cứu</strong>.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Đăng ký thêm người mới
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-10 text-white">
        <h1 className="text-3xl font-bold mb-2">Đăng Ký Khách Thăm</h1>
        <p className="opacity-90">Vui lòng điền đầy đủ thông tin để được phê duyệt nhanh chóng.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <User size={16} /> Họ và tên khách
          </label>
          <input
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Nguyễn Văn A"
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Phone size={16} /> Số điện thoại
          </label>
          <input
            required
            type="tel"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="09xx xxx xxx"
            value={formData.phoneNumber}
            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <UserCheck size={16} /> Người muốn gặp
          </label>
          <input
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Cán bộ, phòng ban..."
            value={formData.hostName}
            onChange={e => setFormData({...formData, hostName: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Calendar size={16} /> Ngày giờ dự kiến
          </label>
          <input
            required
            type="datetime-local"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={formData.visitDateTime}
            onChange={e => setFormData({...formData, visitDateTime: e.target.value})}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FileText size={16} /> Lý do thăm
          </label>
          <textarea
            required
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Ví dụ: Liên hệ công tác về việc..."
            value={formData.purpose}
            onChange={e => setFormData({...formData, purpose: e.target.value})}
          ></textarea>
        </div>

        <div className="md:col-span-2 pt-4">
          <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transform active:scale-95 transition shadow-lg shadow-blue-200">
            Gửi yêu cầu phê duyệt
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
