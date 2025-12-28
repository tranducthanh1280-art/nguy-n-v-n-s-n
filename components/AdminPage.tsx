
import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Search, QrCode, ShieldAlert, TrendingUp, UserCheck, Calendar } from 'lucide-react';
import { Visitor, VisitStatus } from '../types';
import { analyzeVisitPurpose } from '../services/geminiService';

interface Props {
  visitors: Visitor[];
  onUpdateStatus: (id: string, status: VisitStatus) => void;
}

const AdminPage: React.FC<Props> = ({ visitors, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'qr'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [analyses, setAnalyses] = useState<Record<string, { reliability: string, summary: string }>>({});

  const filteredVisitors = visitors.filter(v => 
    v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.phoneNumber.includes(searchTerm)
  );

  const pendingVisitors = filteredVisitors.filter(v => v.status === VisitStatus.PENDING);
  const historicalVisitors = filteredVisitors.filter(v => v.status !== VisitStatus.PENDING);

  const handleAnalyze = async (id: string, purpose: string) => {
    if (analyses[id]) return;
    const res = await analyzeVisitPurpose(purpose);
    setAnalyses(prev => ({ ...prev, [id]: res }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển Cán bộ</h1>
          <p className="text-gray-500">Quản lý và phê duyệt danh sách khách thăm.</p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl font-medium transition ${activeTab === 'pending' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Chờ duyệt ({pendingVisitors.length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl font-medium transition ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Lịch sử
          </button>
          <button 
            onClick={() => setActiveTab('qr')}
            className={`px-4 py-2 rounded-xl font-medium transition ${activeTab === 'qr' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Mã QR
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc SĐT..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingVisitors.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-dashed">
              <p className="text-gray-400">Không có yêu cầu nào đang chờ xử lý.</p>
            </div>
          ) : (
            pendingVisitors.map(v => (
              <div key={v.id} className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md transition">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-grow space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{v.fullName}</h3>
                        <p className="text-blue-600 font-medium">{v.phoneNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase">Đến thăm</p>
                        <p className="font-semibold text-gray-700">{v.hostName}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                        <Calendar size={14} /> Thời gian dự kiến: {new Date(v.visitDateTime).toLocaleString('vi-VN')}
                      </div>
                      <p className="text-gray-700 italic border-l-4 border-blue-200 pl-3">"{v.purpose}"</p>
                    </div>

                    {/* AI Insight */}
                    <div className="pt-2">
                      {!analyses[v.id] ? (
                        <button 
                          onClick={() => handleAnalyze(v.id, v.purpose)}
                          className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition"
                        >
                          <TrendingUp size={14} /> Dùng AI phân tích lý do
                        </button>
                      ) : (
                        <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-left-2">
                          <div className={`px-2 py-1 rounded-md text-[10px] font-bold text-white uppercase ${analyses[v.id].reliability === 'High' ? 'bg-green-500' : 'bg-orange-500'}`}>
                            {analyses[v.id].reliability} Reliability
                          </div>
                          <p className="text-xs text-indigo-800 leading-snug">
                            <strong>AI:</strong> {analyses[v.id].summary}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2 justify-center">
                    <button 
                      onClick={() => onUpdateStatus(v.id, VisitStatus.APPROVED)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition"
                    >
                      <CheckCircle2 size={18} /> Phê duyệt
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(v.id, VisitStatus.REJECTED)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-bold border-2 border-red-50 relative hover:bg-red-50 transition"
                    >
                      <XCircle size={18} /> Từ chối
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Khách thăm</th>
                <th className="px-6 py-4">Thời gian</th>
                <th className="px-6 py-4">Người tiếp đón</th>
                <th className="px-6 py-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {historicalVisitors.map(v => (
                <tr key={v.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{v.fullName}</div>
                    <div className="text-xs text-gray-500">{v.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(v.visitDateTime).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{v.hostName}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      v.status === VisitStatus.APPROVED ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {v.status === VisitStatus.APPROVED ? 'Đã duyệt' : 'Từ chối'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'qr' && (
        <div className="bg-white p-12 rounded-2xl border shadow-sm flex flex-col items-center space-y-6 text-center">
          <div className="p-8 bg-blue-50 rounded-3xl border-4 border-blue-100">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.origin + window.location.pathname)}`}
              alt="Visit QR" 
              className="w-48 h-48"
            />
          </div>
          <div className="max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Mã QR Đăng Ký</h3>
            <p className="text-gray-500 mb-6">In mã này đặt tại cổng bảo vệ hoặc lễ tân. Khách quét mã để truy cập trang đăng ký trực tuyến.</p>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-gray-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition mx-auto shadow-lg shadow-gray-200"
            >
              <QrCode size={20} /> Tải về/In mã QR
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
