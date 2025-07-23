import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { Button } from '../common';
import { useNavigate } from 'react-router-dom';
import { adminAuthAPI } from '@/lib/admin/adminAuthAPI';

const Header = ({ title, subtitle, actions, showSearch = true, userName = '관리자' }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await adminAuthAPI.logout();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      navigate('/admin/login');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-700">{userName}</span>
            </div>
            <Button variant="outline" size="small" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
