
import React, { useState } from 'react';
import { Search, Clock, CheckCircle2, XCircle, Info } from 'lucide-react';
import { Visitor, VisitStatus } from '../types';

interface Props {
  visitors: Visitor[];
}

const LookupPage: React.FC<Props> = ({ visitors }) => {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState<Visitor | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = visitors.find(v => v.phoneNumber === phone);
    setResult(found || null);
    setHasSearched(true);
  };

  const getStatusBadge = (status: VisitStatus) => {
    switch (status) {
      case VisitStatus.APPROVED:
        return (
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full font-bold border border-green-200">
            <CheckCircle2 size={20} />
            ĐÃ PHÊ DUYỆT
          </div>
        );
      case VisitStatus.REJECTED:
        return (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-full font-bold border border-red-200">
            <XCircle size={20} />
            TỪ CHỐI
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-full font-bold border border-yellow-200">
            <Clock size={20} />
            ĐANG CHỜ DUYỆT
          </div>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Tra cứu trạng thái</h1>
        <p className="text-gray-500">Nhập số điện thoại đã đăng ký để xem kết quả.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="tel"
            required
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-100 focus:border-blue-500 outline-none transition text-lg"
            placeholder="09xx xxx xxx"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <button className="bg-blue-600 text-white px-8 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
          Tra cứu
        </button>
      </form>

      {hasSearched && (
        <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
          {result ? (
            <div className="bg-white rounded-3xl p-8 border shadow-sm space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{result.fullName}</h3>
                  <p className="text-gray-500">Số điện thoại: {result.phoneNumber}</p>
                </div>
                {getStatusBadge(result.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Người tiếp đón</p>
                  <p className="text-gray-800 font-semibold">{result.hostName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Thời gian dự kiến</p>
                  <p className="text-gray-800 font-semibold">{new Date(result.visitDateTime).toLocaleString('vi-VN')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Lý do thăm</p>
                  <p className="text-gray-800 leading-relaxed">{result.purpose}</p>
                </div>
              </div>

              {result.status === VisitStatus.APPROVED && (
                <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl flex gap-3 items-start border border-blue-100 mt-4">
                  <Info className="flex-shrink-0 mt-0.5" size={20} />
                  <p className="text-sm">Vui lòng xuất trình CMND/CCCD tại quầy lễ tân khi đến để hoàn tất thủ tục vào tòa nhà.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-100 rounded-3xl p-12 text-center">
              <p className="text-gray-500 text-lg">Không tìm thấy thông tin đăng ký cho số điện thoại này.</p>
              <p className="text-gray-400 text-sm mt-2">Vui lòng kiểm tra lại số điện thoại hoặc tiến hành đăng ký mới.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LookupPage;
