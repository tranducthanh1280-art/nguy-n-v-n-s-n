
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { User, Search, Settings, ClipboardList, CheckCircle2, XCircle, Clock, ChevronRight, LogOut, MessageSquare } from 'lucide-react';
import { VisitStatus, Visitor } from './types';
import RegistrationPage from './components/RegistrationPage';
import LookupPage from './components/LookupPage';
import AdminPage from './components/AdminPage';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem('visitors');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('visitors', JSON.stringify(visitors));
  }, [visitors]);

  const addVisitor = (visitor: Omit<Visitor, 'id' | 'status' | 'createdAt'>) => {
    const newVisitor: Visitor = {
      ...visitor,
      id: Math.random().toString(36).substr(2, 9),
      status: VisitStatus.PENDING,
      createdAt: Date.now(),
    };
    setVisitors(prev => [newVisitor, ...prev]);
  };

  const updateStatus = (id: string, status: VisitStatus) => {
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, status } : v));
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <ClipboardList className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  SmartVisit
                </span>
              </Link>
              
              <div className="hidden md:flex space-x-8">
                <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1">
                  <User size={18} /> Đăng ký
                </Link>
                <Link to="/lookup" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1">
                  <Search size={18} /> Tra cứu
                </Link>
                <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1">
                  <Settings size={18} /> Quản lý
                </Link>
              </div>

              {isAdmin && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-md transition"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Thoát</span>
                </button>
              )}
            </div>
          </div>
        </nav>

        <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
          <Routes>
            <Route path="/" element={<RegistrationPage onAdd={addVisitor} />} />
            <Route path="/lookup" element={<LookupPage visitors={visitors} />} />
            <Route 
              path="/admin" 
              element={
                isAdmin ? 
                <AdminPage visitors={visitors} onUpdateStatus={updateStatus} /> : 
                <AdminLogin onLogin={() => { setIsAdmin(true); localStorage.setItem('isAdmin', 'true'); }} />
              } 
            />
          </Routes>
        </main>

        {/* Floating Chatbot for Visitor Help */}
        <ChatBot />

        <footer className="bg-white border-t py-6">
          <div className="text-center text-gray-500 text-sm">
            © 2024 SmartVisit AI. All rights reserved.
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Mật khẩu không đúng. Vui lòng thử lại.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-2xl shadow-sm border">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Cán bộ Đăng nhập</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu quản lý</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Nhập admin123 để thử..."
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
          Đăng nhập hệ thống
        </button>
      </form>
    </div>
  );
};

export default App;
