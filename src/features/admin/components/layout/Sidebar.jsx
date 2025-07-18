import React from 'react';
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  BarChart3, 
  TrendingUp,
  Bell,
  Shield,
  Settings
} from 'lucide-react';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { id: 'dashboard', name: '관리자 대시보드', icon: BarChart3 },
    { id: 'studio', name: '스튜디오 승인', icon: Building },
    { id: 'monitoring', name: '예약 모니터링', icon: Calendar },
    { id: 'settlement', name: '정산 관리', icon: DollarSign },
    { id: 'refund', name: '환불 요청 리뷰', icon: AlertTriangle },
    { id: 'member', name: '회원 계정 관리', icon: Users },
    { id: 'report', name: '신고 관리', icon: AlertTriangle },
    { id: 'sales', name: '매출 대시보드', icon: TrendingUp },
    { id: 'settings', name: '시스템 설정', icon: Settings }
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex-shrink-0">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-teal-400">Studio Pick</h1>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg mb-2 transition-colors ${
                currentPage === item.id 
                  ? 'bg-teal-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.name}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
