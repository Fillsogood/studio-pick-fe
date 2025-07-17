import React, { useState, useEffect, useCallback } from 'react';
import { 
  Eye, UserX, Users, RefreshCw, AlertTriangle, Search, 
  Download, Upload, Filter, Lock, Unlock, MessageCircle,
  UserPlus, Edit, MoreHorizontal, Calendar, Activity,
  Shield, AlertCircle, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import userAPI from '../../../lib/admin/adminUserAPI';
import { formatDate, formatDateTime, getStatusBadgeColor, getStatusText, STATUS_CODES, USER_ROLES } from '../../../lib/admin';
import UserDetailModal from '../components/modals/UserDetailModal';
import CreateUserModal from '../components/modals/CreateUserModal';


const MemberManagementPage = () => {
  // 기본 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // 필터 및 검색 상태
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    keyword: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  
  // UI 상태
  const [processingIds, setProcessingIds] = useState(new Set());
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // 사용자 목록 가져오기
  const fetchUsers = useCallback(async (page = 1, newFilters = filters) => {
    try {
      setLoading(true);
      setError(null);
      
      const { role, status, keyword, sortBy, sortOrder } = newFilters;
      const roleParam = role === 'all' ? null : role;
      const statusParam = status === 'all' ? null : status.toUpperCase();
      const keywordParam = keyword.trim() || null;
      
      const response = await userAPI.getUserAccounts(
        page, pageSize, roleParam, statusParam, keywordParam, sortBy, sortOrder
      );
      if (response.success) {
        setUsers(response.data.data.users || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(page);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filters, pageSize]);

  // 통계 가져오기
  const fetchStats = useCallback(async () => {
    try {
      const response = await userAPI.getUserStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('통계 로드 실패:', err);
    }
  }, []);

  // 초기 로드
  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // 필터 변경 시 첫 페이지로 이동
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  
  // 페이지가 바뀔 때만 호출
  useEffect(() => {
    fetchUsers(currentPage, filters);
  }, [currentPage]);
  
  // 검색 버튼에서 호출되는 handleSearch는 페이지를 1로 초기화하고 fetch
  const handleSearch = () => {
    setCurrentPage(1);
    fetchUsers(1, filters);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 새로고침
  const handleRefresh = () => {
    fetchUsers(currentPage, filters);
    fetchStats();
    setSelectedUsers(new Set());
  };

  // 사용자 상태 변경
  const handleChangeStatus = async (userId, newStatus) => {
    if (processingIds.has(userId)) return;
    
    const statusText = getStatusText(newStatus);
    const reason = prompt(`상태를 "${statusText}"(으)로 변경하는 사유를 입력하세요:`);
    if (!reason) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(userId));
      const response = await userAPI.changeUserStatus(userId, newStatus, reason);
      
      if (response.success) {
        await fetchUsers(currentPage, filters);
        await fetchStats();
        alert(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // 사용자 역할 변경
  const handleChangeRole = async (userId, newRole) => {
    if (processingIds.has(userId)) return;
    
    const roleText = USER_ROLES[newRole] || newRole;
    const reason = prompt(`역할을 "${roleText}"(으)로 변경하는 사유를 입력하세요:`);
    if (!reason) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(userId));
      const response = await userAPI.changeUserRole(userId, newRole, reason);
      
      if (response.success) {
        await fetchUsers(currentPage, filters);
        await fetchStats();
        alert(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // 사용자 잠금/해제
  const handleLockUnlock = async (userId, isLocked) => {
    if (processingIds.has(userId)) return;
    
    const action = isLocked ? '잠금 해제' : '잠금';
    const reason = prompt(`${action} 사유를 입력하세요:`);
    if (!reason) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(userId));
      const response = isLocked 
        ? await userAPI.unlockUser(userId, reason)
        : await userAPI.lockUser(userId, reason);
      
      if (response.success) {
        await fetchUsers(currentPage, filters);
        await fetchStats();
        alert(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // 사용자 삭제
  const handleDeleteUser = async (userId) => {
    if (processingIds.has(userId)) return;
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) return;
    
    const reason = prompt('삭제 사유를 입력하세요:');
    if (!reason) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(userId));
      const response = await userAPI.deleteUserAccount(userId, reason);
      
      if (response.success) {
        await fetchUsers(currentPage, filters);
        // 현재 페이지에 사용자가 없으면 이전 페이지로
        if (users.length === 1 && currentPage > 1) {
          fetchUsers(currentPage - 1, filters);
        }
        await fetchStats();
        alert(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // 사용자 상세보기
  const handleViewDetail = async (userId) => {
    try {
      const response = await userAPI.getUserAccount(userId);
      if (response.success) {
        setSelectedUser(response.data.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert('사용자 상세정보를 불러오는데 실패했습니다.');
    }
  };

  // 대량 작업
  const handleBulkStatusChange = async (newStatus) => {
    if (selectedUsers.size === 0) return;
    
    const statusText = getStatusText(newStatus);
    const reason = prompt(`선택된 ${selectedUsers.size}명의 상태를 "${statusText}"(으)로 변경하는 사유를 입력하세요:`);
    if (!reason) return;
    
    try {
      const userIds = Array.from(selectedUsers);
      const response = await userAPI.changeUsersStatus(userIds, newStatus, reason);
      
      if (response.success) {
        await fetchUsers(currentPage, filters);
        await fetchStats();
        setSelectedUsers(new Set());
        alert(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;
    if (!confirm(`선택된 ${selectedUsers.size}명의 사용자를 정말로 삭제하시겠습니까?`)) return;
    
    const reason = prompt('일괄 삭제 사유를 입력하세요:');
    if (!reason) return;
    
    try {
      const userIds = Array.from(selectedUsers);
      const response = await userAPI.deleteMultipleUsers(userIds, reason);
      
      if (response.success) {
        await fetchUsers(currentPage, filters);
        await fetchStats();
        setSelectedUsers(new Set());
        alert(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // 데이터 내보내기
  const handleExport = async (format = 'excel') => {
    try {
      const response = await userAPI.exportUsers(format, filters);
      if (response.success) {
        // Blob 다운로드 처리
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `users_${Date.now()}.${format === 'excel' ? 'xlsx' : 'csv'}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert('데이터 내보내기에 실패했습니다.');
    }
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchUsers(page, filters);
  };

  // 사용자 선택
  const handleUserSelect = (userId) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  // 전체 선택/해제
  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user.id)));
    }
  };

  // 배지 컴포넌트들
  const getStatusBadge = (status) => {
    const color = getStatusBadgeColor(status);
    const text = getStatusText(status);
    const icon = status === STATUS_CODES.USER_ACTIVE ? <CheckCircle className="w-3 h-3 mr-1" /> :
                 status === STATUS_CODES.USER_LOCKED ? <Lock className="w-3 h-3 mr-1" /> :
                 <XCircle className="w-3 h-3 mr-1" />;
    
    return (
      <Badge variant={color} className="flex items-center">
        {icon}
        {text}
      </Badge>
    );
  };

  const getRoleBadge = (role) => {
    const roleMap = {
      USER: { text: '일반 사용자', color: 'default', icon: <Users className="w-3 h-3 mr-1" /> },
      STUDIO_OWNER: { text: '스튜디오 사장', color: 'primary', icon: <Activity className="w-3 h-3 mr-1" /> },
      CLASS_OWNER: { text: '클래스 사장', color: 'purple', icon: <Calendar className="w-3 h-3 mr-1" /> },
      ADMIN: { text: '관리자', color: 'danger', icon: <Shield className="w-3 h-3 mr-1" /> }
    };
    const roleInfo = roleMap[role] || { text: role, color: 'default', icon: null };
    
    return (
      <Badge variant={roleInfo.color} className="flex items-center">
        {roleInfo.icon}
        {roleInfo.text}
      </Badge>
    );
  };

  // 테이블 데이터 구성
  const tableData = users.map(user => [
    <div key="select" className="flex items-center">
      <input
        type="checkbox"
        checked={selectedUsers.has(user.id)}
        onChange={() => handleUserSelect(user.id)}
        className="mr-2"
      />
      <span className="font-medium">{user.name || '알 수 없음'}</span>
    </div>,
    <span className="text-sm text-gray-600">{user.email || '알 수 없음'}</span>,
    getRoleBadge(user.role),
    getStatusBadge(user.status),
    <span className="text-sm">{formatDate(user.createdAt)}</span>,
    <span className="text-sm text-gray-500">
      {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '로그인 기록 없음'}
    </span>
  ]);

  // 테이블 액션 버튼들
  const tableActions = users.map(user => {
    const isProcessing = processingIds.has(user.id);
    const isLocked = user.status === STATUS_CODES.USER_LOCKED;
    const isAdmin = user.role === USER_ROLES.ADMIN;
    
    return [
      <Button 
        key="view" 
        variant="outline" 
        size="small" 
        onClick={() => handleViewDetail(user.id)}
        className="mr-1"
      >
        <Eye className="w-4 h-4" />
      </Button>,
      
      // 상태 변경 버튼
      <div key="status" className="flex gap-1">
        {user.status === STATUS_CODES.USER_ACTIVE ? (
          <Button 
            variant="warning" 
            size="small" 
            onClick={() => handleChangeStatus(user.id, STATUS_CODES.USER_INACTIVE)} 
            disabled={isProcessing}
            title="비활성화"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            variant="success" 
            size="small" 
            onClick={() => handleChangeStatus(user.id, STATUS_CODES.USER_ACTIVE)} 
            disabled={isProcessing}
            title="활성화"
          >
            <CheckCircle className="w-4 h-4" />
          </Button>
        )}
        
        {/* 잠금/해제 버튼 */}
        <Button
          variant={isLocked ? "info" : "warning"}
          size="small"
          onClick={() => handleLockUnlock(user.id, isLocked)}
          disabled={isProcessing || isAdmin}
          title={isLocked ? "잠금 해제" : "잠금"}
        >
          {isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        </Button>
      </div>,
      
      // 역할 변경 (관리자가 아닌 경우만)
      !isAdmin && (
        <select 
          key="role" 
          value={user.role} 
          onChange={(e) => handleChangeRole(user.id, e.target.value)} 
          disabled={isProcessing} 
          className="text-xs border rounded px-2 py-1 min-w-[120px]"
        >
          <option value={USER_ROLES.USER}>일반 사용자</option>
          <option value={USER_ROLES.STUDIO_OWNER}>스튜디오 사장</option>
          <option value={USER_ROLES.CLASS_OWNER}>클래스 사장</option>
        </select>
      ),
      
      // 삭제 버튼 (관리자가 아닌 경우만)
      !isAdmin && (
        <Button 
          key="delete" 
          variant="danger" 
          size="small" 
          onClick={() => handleDeleteUser(user.id)} 
          disabled={isProcessing}
          title="삭제"
        >
          <UserX className="w-4 h-4" />
        </Button>
      )
    ].filter(Boolean);
  });

  // 통계 카드 데이터
  const getStatsCards = () => [
    { 
      title: '전체 사용자', 
      value: stats.totalUsers || 0, 
      color: 'blue',
      icon: <Users className="w-5 h-5" />
    },
    { 
      title: '활성 사용자', 
      value: stats.activeUsers || 0, 
      color: 'green',
      icon: <CheckCircle className="w-5 h-5" />
    },
    { 
      title: '일반 사용자', 
      value: stats.regularUsers || 0, 
      color: 'gray',
      icon: <Users className="w-5 h-5" />
    },
    { 
      title: '스튜디오 사장', 
      value: stats.studioOwners || 0, 
      color: 'purple',
      icon: <Activity className="w-5 h-5" />
    },
    { 
      title: '클래스 사장', 
      value: stats.classOwners || 0, 
      color: 'indigo',
      icon: <Calendar className="w-5 h-5" />
    },
    { 
      title: '관리자', 
      value: stats.admins || 0, 
      color: 'red',
      icon: <Shield className="w-5 h-5" />
    }
  ];

  // 로딩 상태
  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin h-12 w-12 border-b-2 border-teal-600 rounded-full"></div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" /> 다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 사용자 상세 모달 */}
      {selectedUser && (
        <UserDetailModal 
          isOpen={true}
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
      
      {/* 페이지 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">회원 관리</h1>
          <p className="text-gray-600">시스템 사용자들을 관리하고 모니터링합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateModal(true)} variant="primary">
            <UserPlus className="w-4 h-4 mr-2" />
            사용자 추가
          </Button>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showCreateModal && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            handleRefresh();
          }}
        />
      )}

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {getStatsCards().map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`text-${stat.color}-500`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 기본 필터 */}
          <div className="flex flex-1 gap-4">
            <div className="flex-1">
            <Input
              placeholder="이름, 이메일로 검색..."
              value={filters.keyword}
              onChange={(e) => handleFilterChange('keyword', e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full"
            />
            </div>
            
            <select 
              value={filters.role} 
              onChange={(e) => handleFilterChange('role', e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">모든 역할</option>
              <option value="USER">일반 사용자</option>
              <option value="STUDIO_OWNER">스튜디오 사장</option>
              <option value="CLASS_OWNER">클래스 사장</option>
              <option value="ADMIN">관리자</option>
            </select>
            
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">모든 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="locked">잠김</option>
            </select>
            
            <Button onClick={handleSearch} variant="primary" type="button">
              <Search className="w-4 h-4 mr-2" />
              검색
            </Button>
          </div>
          
          {/* 추가 옵션 */}
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} 
              variant="outline"
            >
              <Filter className="w-4 h-4 mr-2" />
              고급 필터
            </Button>
            
            <Button onClick={() => handleExport('excel')} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              내보내기
            </Button>
          </div>
        </div>
        
        {/* 고급 필터 (확장 시 표시) */}
        {showAdvancedFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가입일 시작</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가입일 종료</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">정렬 기준</label>
              <div className="flex gap-2">
                <select 
                  value={filters.sortBy} 
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                >
                  <option value="createdAt">가입일</option>
                  <option value="name">이름</option>
                  <option value="email">이메일</option>
                  <option value="lastLoginAt">최근 로그인</option>
                </select>
                <select 
                  value={filters.sortOrder} 
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="desc">내림차순</option>
                  <option value="asc">오름차순</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 대량 작업 */}
      {selectedUsers.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedUsers.size}명이 선택되었습니다.
            </span>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleBulkStatusChange(STATUS_CODES.USER_ACTIVE)} 
                variant="success" 
                size="small"
              >
                일괄 활성화
              </Button>
              <Button 
                onClick={() => handleBulkStatusChange(STATUS_CODES.USER_INACTIVE)} 
                variant="warning" 
                size="small"
              >
                일괄 비활성화
              </Button>
              <Button 
                onClick={handleBulkDelete} 
                variant="danger" 
                size="small"
              >
                일괄 삭제
              </Button>
              <Button 
                onClick={() => setSelectedUsers(new Set())} 
                variant="outline" 
                size="small"
              >
                선택 해제
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 사용자 테이블 */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table
            headers={[
              <div key="select" className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedUsers.size === users.length && users.length > 0}
                  onChange={handleSelectAll}
                  className="mr-2"
                />
                사용자명
              </div>,
              '이메일',
              '역할',
              '상태',
              '가입일',
              '최근 로그인',
              '작업'
            ]}
            data={tableData}
            actions={tableActions}
            loading={loading}
            emptyMessage="사용자가 없습니다."
          />
        </div>
        
        {/* 페이징 */}
        {totalPages > 1 && (
          <div className="border-t p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                페이지 당 표시:
              </span>
              <select 
                value={pageSize} 
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={10}>10개</option>
                <option value={25}>25개</option>
                <option value={50}>50개</option>
                <option value={100}>100개</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="small"
              >
                이전
              </Button>
              
              <div className="flex gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      variant={currentPage === page ? "primary" : "outline"}
                      size="small"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="small"
              >
                다음
              </Button>
            </div>
            
            <span className="text-sm text-gray-600">
              총 {(stats.totalUsers || 0).toLocaleString()}명 중 {((currentPage - 1) * pageSize + 1).toLocaleString()}-{Math.min(currentPage * pageSize, stats.totalUsers || 0).toLocaleString()}명 표시
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberManagementPage;