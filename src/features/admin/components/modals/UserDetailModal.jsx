import React, { useState, useEffect } from 'react';
import { 
  User, Edit, Save, X, AlertCircle,
  Lock, Unlock,
} from 'lucide-react';
import { Button, Badge, Input } from '../common';
import userAPI from '../../../../lib/admin/adminUserAPI';
import { formatDateTime, getStatusBadgeColor, getStatusText, STATUS_CODES, USER_ROLES } from '../../../../lib/admin';

const UserDetailModal = ({ user, isOpen, onClose, onUserUpdated }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // 사용자 정보
  const [userInfo, setUserInfo] = useState(user);
  const [editedInfo, setEditedInfo] = useState({});
  

  useEffect(() => {
    if (user && isOpen) {
      setUserInfo(user);
      setEditedInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        birthDate: user.birthDate || '',
        bio: user.bio || ''
      });
    }
  }, [user, isOpen]);


  // 사용자 정보 수정
  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userAPI.updateUserAccount(user.id, editedInfo);
      if (response.success) {
        setUserInfo({ ...userInfo, ...editedInfo });
        setIsEditing(false);
        if (onUserUpdated) onUserUpdated();
        alert('사용자 정보가 성공적으로 수정되었습니다.');
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 상태 변경
  const handleStatusChange = async (newStatus) => {
    const reason = prompt(`상태를 "${getStatusText(newStatus)}"(으)로 변경하는 사유를 입력하세요:`);
    if (!reason) return;

    try {
      setLoading(true);
      const response = await userAPI.changeUserStatus(user.id, newStatus, reason);
      if (response.success) {
        setUserInfo({ ...userInfo, status: newStatus });
        if (onUserUpdated) onUserUpdated();
        alert(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 사용자 잠금/해제
  const handleLockUnlock = async () => {
    const isLocked = userInfo.status === STATUS_CODES.USER_LOCKED;
    const action = isLocked ? '잠금 해제' : '잠금';
    const reason = prompt(`${action} 사유를 입력하세요:`);
    if (!reason) return;

    try {
      setLoading(true);
      const response = isLocked 
        ? await userAPI.unlockUser(user.id, reason)
        : await userAPI.lockUser(user.id, reason);
        
      if (response.success) {
        setUserInfo({ 
          ...userInfo, 
          status: isLocked ? STATUS_CODES.USER_ACTIVE : STATUS_CODES.USER_LOCKED 
        });
        if (onUserUpdated) onUserUpdated();
        alert(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const color = getStatusBadgeColor(status);
    const text = getStatusText(status);
    return <Badge variant={color}>{text}</Badge>;
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      USER: { text: '일반 사용자', color: 'default' },
      STUDIO_OWNER: { text: '스튜디오 사장', color: 'primary' },
      CLASS_OWNER: { text: '클래스 사장', color: 'purple' },
      ADMIN: { text: '관리자', color: 'danger' }
    };
    const roleInfo = roleMap[role] || { text: role, color: 'default' };
    return <Badge variant={roleInfo.color}>{roleInfo.text}</Badge>;
  };

  const tabs = [
    { id: 'info', label: '기본 정보', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{userInfo.name || '알 수 없음'}</h3>
              <div className="flex items-center gap-2 mt-1">
                {getRoleBadge(userInfo.role)}
                {getStatusBadge(userInfo.status)}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            {userInfo.role !== USER_ROLES.ADMIN && (
              <>
                <Button 
                  onClick={handleLockUnlock} 
                  variant={userInfo.status === STATUS_CODES.USER_LOCKED ? "info" : "warning"}
                  size="small"
                  disabled={loading}
                >
                  {userInfo.status === STATUS_CODES.USER_LOCKED ? (
                    <><Unlock className="w-4 h-4 mr-1" /> 잠금 해제</>
                  ) : (
                    <><Lock className="w-4 h-4 mr-1" /> 잠금</>
                  )}
                </Button>
              </>
            )}
            
            {activeTab === 'info' && (
              <Button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                variant={isEditing ? "success" : "primary"}
                size="small"
                disabled={loading}
              >
                {isEditing ? (
                  <><Save className="w-4 h-4 mr-1" /> 저장</>
                ) : (
                  <><Edit className="w-4 h-4 mr-1" /> 편집</>
                )}
              </Button>
            )}
            
            {isEditing && (
              <Button 
                onClick={() => {
                  setIsEditing(false);
                  setEditedInfo({
                    name: userInfo.name || '',
                    email: userInfo.email || '',
                    phone: userInfo.phone || '',
                    address: userInfo.address || '',
                    birthDate: userInfo.birthDate || '',
                    bio: userInfo.bio || ''
                  });
                }}
                variant="outline"
                size="small"
              >
                <X className="w-4 h-4 mr-1" /> 취소
              </Button>
            )}
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 탭 네비게이션 */}
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">개인 정보</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                    {isEditing ? (
                      <Input
                        value={editedInfo.name}
                        onChange={(e) => setEditedInfo({...editedInfo, name: e.target.value})}
                        placeholder="이름을 입력하세요"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{userInfo.name || '없음'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editedInfo.email}
                        onChange={(e) => setEditedInfo({...editedInfo, email: e.target.value})}
                        placeholder="이메일을 입력하세요"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{userInfo.email || '없음'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                    {isEditing ? (
                      <Input
                        value={editedInfo.phone}
                        onChange={(e) => setEditedInfo({...editedInfo, phone: e.target.value})}
                        placeholder="전화번호를 입력하세요"
                      />
                    ) : (
                      <p className="text-sm text-gray-900">{userInfo.phone || '없음'}</p>
                    )}
                  </div>
                  
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900">계정 정보</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">사용자 ID</label>
                    <p className="text-sm text-gray-900">{userInfo.id}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">역할</label>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(userInfo.role)}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(userInfo.status)}
                      {userInfo.role !== USER_ROLES.ADMIN && (
                        <div className="flex gap-1">
                          {userInfo.status === STATUS_CODES.USER_ACTIVE ? (
                            <Button 
                              size="small" 
                              variant="warning"
                              onClick={() => handleStatusChange(STATUS_CODES.USER_INACTIVE)}
                            >
                              비활성화
                            </Button>
                          ) : (
                            <Button 
                              size="small" 
                              variant="success"
                              onClick={() => handleStatusChange(STATUS_CODES.USER_ACTIVE)}
                            >
                              활성화
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">가입일</label>
                    <p className="text-sm text-gray-900">{formatDateTime(userInfo.createdAt)}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">최근 수정일</label>
                    <p className="text-sm text-gray-900">
                      {userInfo.updatedAt ? formatDateTime(userInfo.updatedAt) : '없음'}
                    </p>
                  </div>
                  
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;