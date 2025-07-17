import React, { useState, useEffect } from 'react';
import { Settings, Save, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import adminSystemSettingAPI from '../../../lib/admin/adminSystemSettingAPI';

const SystemSettingPage = () => {
  const [settings, setSettings] = useState([]);
  const [filteredSettings, setFilteredSettings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, edit
  const [selectedSetting, setSelectedSetting] = useState(null);

  // 폼 데이터
  const [formData, setFormData] = useState({
    settingKey: '',
    settingValue: '',
    description: '',
    category: 'SYSTEM',
    isEditable: true
  });

  // 카테고리 목록
  const categories = [
    { value: 'ALL', label: '전체' },
    { value: 'SYSTEM', label: '시스템' },
    { value: 'BUSINESS', label: '비즈니스' },
    { value: 'PAYMENT', label: '결제' },
    { value: 'NOTIFICATION', label: '알림' },
    { value: 'SECURITY', label: '보안' }
  ];

  // 전체 설정 조회
  const fetchAllSettings = async () => {
    try {
      const response = await adminSystemSettingAPI.getAllSettings();
      if (response.success) {
        setSettings(response.data.settings || []);
        setFilteredSettings(response.data.settings || []);
      }
    } catch (err) {
      setError('설정을 불러오는데 실패했습니다.');
      console.error('Error fetching settings:', err);
    }
  };

  // 설정 통계 조회
  const fetchSettingsStats = async () => {
    try {
      const response = await adminSystemSettingAPI.getSettingsStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching settings stats:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchAllSettings(),
          fetchSettingsStats()
        ]);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = settings;

    // 카테고리 필터
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(setting => setting.category === selectedCategory);
    }

    // 검색 키워드 필터
    if (searchKeyword) {
      filtered = filtered.filter(setting => 
        setting.settingKey.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        setting.description?.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setFilteredSettings(filtered);
  }, [settings, selectedCategory, searchKeyword]);

  // 설정 생성
  const handleCreateSetting = async () => {
    try {
      const response = await adminSystemSettingAPI.createSetting(formData);
      if (response.success) {
        await fetchAllSettings();
        setIsModalOpen(false);
        resetForm();
        alert('설정이 생성되었습니다.');
      } else {
        alert('설정 생성에 실패했습니다.');
      }
    } catch (err) {
      alert('설정 생성에 실패했습니다.');
      console.error('Error creating setting:', err);
    }
  };

  // 설정 수정
  const handleUpdateSetting = async () => {
    try {
      const response = await adminSystemSettingAPI.updateSetting(
        selectedSetting.settingKey,
        {
          settingValue: formData.settingValue,
          description: formData.description
        }
      );
      if (response.success) {
        await fetchAllSettings();
        setIsModalOpen(false);
        resetForm();
        alert('설정이 수정되었습니다.');
      } else {
        alert('설정 수정에 실패했습니다.');
      }
    } catch (err) {
      alert('설정 수정에 실패했습니다.');
      console.error('Error updating setting:', err);
    }
  };

  // 설정 삭제
  const handleDeleteSetting = async (settingKey) => {
    if (!confirm('정말로 이 설정을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await adminSystemSettingAPI.deleteSetting(settingKey);
      await fetchAllSettings();
      alert('설정이 삭제되었습니다.');
    } catch (err) {
      alert('설정 삭제에 실패했습니다.');
      console.error('Error deleting setting:', err);
    }
  };

  // 모달 열기
  const openModal = (mode, setting = null) => {
    setModalMode(mode);
    setSelectedSetting(setting);
    
    if (mode === 'edit' && setting) {
      setFormData({
        settingKey: setting.settingKey,
        settingValue: setting.settingValue,
        description: setting.description || '',
        category: setting.category,
        isEditable: setting.isEditable
      });
    } else {
      resetForm();
    }
    
    setIsModalOpen(true);
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      settingKey: '',
      settingValue: '',
      description: '',
      category: 'SYSTEM',
      isEditable: true
    });
    setSelectedSetting(null);
  };

  // 폼 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      handleCreateSetting();
    } else {
      handleUpdateSetting();
    }
  };

  // 카테고리 배지 렌더링
  const getCategoryBadge = (category) => {
    const categoryConfig = {
      SYSTEM: { variant: 'primary', label: '시스템' },
      BUSINESS: { variant: 'success', label: '비즈니스' },
      PAYMENT: { variant: 'warning', label: '결제' },
      NOTIFICATION: { variant: 'info', label: '알림' },
      SECURITY: { variant: 'danger', label: '보안' }
    };

    const config = categoryConfig[category] || { variant: 'default', label: category };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // 테이블 데이터 구성
  const tableData = filteredSettings.map(setting => [
    setting.settingKey,
    setting.settingValue,
    setting.description || '-',
    getCategoryBadge(setting.category),
    setting.isEditable ? '✓' : '✗',
    new Date(setting.updatedAt || setting.createdAt).toLocaleDateString('ko-KR')
  ]);

  // 테이블 액션 버튼
  const tableActions = filteredSettings.map(setting => [
    <Button 
      key="edit" 
      variant="outline" 
      size="small"
      onClick={() => openModal('edit', setting)}
      disabled={!setting.isEditable}
    >
      <Edit className="w-4 h-4 mr-1" />
      수정
    </Button>,
    <Button 
      key="delete" 
      variant="danger" 
      size="small"
      onClick={() => handleDeleteSetting(setting.settingKey)}
      disabled={!setting.isEditable}
    >
      <Trash2 className="w-4 h-4 mr-1" />
      삭제
    </Button>
  ]);

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">시스템 설정 관리</h1>
        <Button variant="primary" onClick={() => openModal('create')}>
          <Plus className="w-4 h-4 mr-2" />
          설정 추가
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {settings.length}
          </div>
          <div className="text-sm text-gray-600">전체 설정</div>
        </div>
        {Object.entries(stats).map(([category, count]) => (
          <div key={category} className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {count || 0}
            </div>
            <div className="text-sm text-gray-600">
              {categories.find(c => c.value === category)?.label || category}
            </div>
          </div>
        ))}
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input 
                placeholder="설정 키 또는 설명 검색..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-64"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredSettings.length}개의 설정
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg border">
        <Table
          headers={['설정 키', '값', '설명', '카테고리', '편집 가능', '마지막 수정일']}
          data={tableData}
          actions={tableActions}
        />
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              {modalMode === 'create' ? '새 설정 추가' : '설정 수정'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설정 키
                  </label>
                  <Input
                    value={formData.settingKey}
                    onChange={(e) => setFormData({ ...formData, settingKey: e.target.value })}
                    placeholder="예: app.name"
                    disabled={modalMode === 'edit'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    값
                  </label>
                  <Input
                    value={formData.settingValue}
                    onChange={(e) => setFormData({ ...formData, settingValue: e.target.value })}
                    placeholder="설정 값을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="설정에 대한 설명을 입력하세요"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    rows={3}
                  />
                </div>

                {modalMode === 'create' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                      {categories.filter(c => c.value !== 'ALL').map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {modalMode === 'create' && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isEditable"
                      checked={formData.isEditable}
                      onChange={(e) => setFormData({ ...formData, isEditable: e.target.checked })}
                      className="mr-2"
                    />
                    <label htmlFor="isEditable" className="text-sm text-gray-700">
                      편집 가능
                    </label>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </Button>
                <Button type="submit" variant="primary">
                  <Save className="w-4 h-4 mr-2" />
                  {modalMode === 'create' ? '생성' : '수정'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettingPage;
