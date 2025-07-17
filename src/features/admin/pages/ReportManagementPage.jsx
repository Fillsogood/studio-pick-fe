import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, AlertTriangle, Filter, Search } from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import adminReportAPI from '../../../lib/admin/adminReportAPI';

const ReportManagementPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedReports, setSelectedReports] = useState([]);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    reportedType: '',
    status: '',
    reporterId: '',
    contentOwnerId: '',
    startDate: '',
    endDate: '',
    keyword: '',
    page: 0,
    size: 20,
    sortBy: 'createdAt',
    sortDirection: 'desc'
  });

  // 페이지네이션 정보
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: false,
    number: 0,
    size: 20
  });

  // 신고 목록 조회
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await adminReportAPI.getReportList(filters);
      
      setReports(response.content || []);
      setPagination({
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        first: response.first,
        last: response.last,
        number: response.number,
        size: response.size
      });
    } catch (err) {
      setError('신고 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  // 신고 통계 조회
  const fetchReportStats = async () => {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      
      const response = await adminReportAPI.getReportStats(
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );
      
      setStats(response);
    } catch (err) {
      console.error('Error fetching report stats:', err);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchReportStats();
  }, [filters]);

  // 신고 처리
  const handleProcessReport = async (reportId, action, reason = '') => {
    try {
      // 임시로 관리자 ID를 1로 설정 (실제로는 현재 로그인한 관리자의 ID를 사용)
      const adminId = 1;
      
      await adminReportAPI.processReport(reportId, adminId, {
        action: action,
        reason: reason
      });
      
      fetchReports(); // 목록 새로고침
      alert('신고가 처리되었습니다.');
    } catch (err) {
      alert('신고 처리에 실패했습니다.');
      console.error('Error processing report:', err);
    }
  };

  // 일괄 처리
  const handleBatchProcess = async (action, reason = '') => {
    if (selectedReports.length === 0) {
      alert('처리할 신고를 선택해주세요.');
      return;
    }

    if (!confirm(`선택한 ${selectedReports.length}개의 신고를 ${action}하시겠습니까?`)) {
      return;
    }

    try {
      const adminId = 1;
      
      await adminReportAPI.processBatchReports(selectedReports, adminId, {
        action: action,
        reason: reason
      });
      
      setSelectedReports([]);
      fetchReports();
      alert('일괄 처리가 완료되었습니다.');
    } catch (err) {
      alert('일괄 처리에 실패했습니다.');
      console.error('Error batch processing reports:', err);
    }
  };

  // 검색 및 필터 핸들러
  const handleSearch = () => {
    setFilters({ ...filters, page: 0 });
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 0 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  // 상태 배지 렌더링
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return <Badge variant="warning">대기중</Badge>;
      case 'approved':
        return <Badge variant="success">승인됨</Badge>;
      case 'rejected':
        return <Badge variant="danger">거부됨</Badge>;
      case 'resolved':
        return <Badge variant="primary">해결됨</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // 신고 타입 배지 렌더링
  const getTypeBadge = (type) => {
    switch(type?.toLowerCase()) {
      case 'user':
        return <Badge variant="primary">사용자</Badge>;
      case 'studio':
        return <Badge variant="secondary">스튜디오</Badge>;
      case 'review':
        return <Badge variant="info">리뷰</Badge>;
      case 'post':
        return <Badge variant="default">게시물</Badge>;
      default:
        return <Badge variant="default">{type}</Badge>;
    }
  };

  // 체크박스 핸들러
  const handleSelectReport = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports.map(report => report.id));
    }
  };

  // 테이블 데이터 구성
  const tableData = reports.map(report => [
    <input
      type="checkbox"
      checked={selectedReports.includes(report.id)}
      onChange={() => handleSelectReport(report.id)}
    />,
    report.id,
    getTypeBadge(report.reportedType),
    report.reporterName || '익명',
    report.contentOwnerName || '-',
    report.reason || '-',
    getStatusBadge(report.status),
    new Date(report.createdAt).toLocaleDateString('ko-KR'),
    report.processedAt ? new Date(report.processedAt).toLocaleDateString('ko-KR') : '-'
  ]);

  // 테이블 액션 버튼
  const tableActions = reports.map(report => [
    <Button key="view" variant="outline" size="small">
      <Eye className="w-4 h-4 mr-1" />
      상세
    </Button>,
    report.status === 'PENDING' && (
      <Button 
        key="approve" 
        variant="success" 
        size="small"
        onClick={() => handleProcessReport(report.id, 'APPROVE')}
      >
        <CheckCircle className="w-4 h-4 mr-1" />
        승인
      </Button>
    ),
    report.status === 'PENDING' && (
      <Button 
        key="reject" 
        variant="danger" 
        size="small"
        onClick={() => handleProcessReport(report.id, 'REJECT')}
      >
        <XCircle className="w-4 h-4 mr-1" />
        거부
      </Button>
    )
  ].filter(Boolean));

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
        <h1 className="text-2xl font-bold text-gray-900">신고 관리</h1>
        <div className="flex items-center space-x-2">
          {selectedReports.length > 0 && (
            <>
              <Button 
                variant="success" 
                onClick={() => handleBatchProcess('APPROVE')}
              >
                일괄 승인 ({selectedReports.length})
              </Button>
              <Button 
                variant="danger" 
                onClick={() => handleBatchProcess('REJECT')}
              >
                일괄 거부 ({selectedReports.length})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 통계 카드 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-orange-600">
              {stats.totalReports || 0}
            </div>
            <div className="text-sm text-gray-600">전체 신고</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pendingReports || 0}
            </div>
            <div className="text-sm text-gray-600">대기 중</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-green-600">
              {stats.resolvedReports || 0}
            </div>
            <div className="text-sm text-gray-600">해결됨</div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="text-2xl font-bold text-red-600">
              {stats.urgentReports || 0}
            </div>
            <div className="text-sm text-gray-600">긴급</div>
          </div>
        </div>
      )}

      {/* 필터 및 검색 */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input 
                placeholder="신고 내용 검색..."
                value={filters.keyword}
                onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                className="w-64"
              />
              <Button onClick={handleSearch}>검색</Button>
            </div>
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            고급 필터
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={filters.reportedType}
            onChange={(e) => handleFilterChange('reportedType', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">전체 타입</option>
            <option value="USER">사용자</option>
            <option value="STUDIO">스튜디오</option>
            <option value="REVIEW">리뷰</option>
            <option value="POST">게시물</option>
          </select>
          
          <select 
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">전체 상태</option>
            <option value="PENDING">대기중</option>
            <option value="APPROVED">승인됨</option>
            <option value="REJECTED">거부됨</option>
            <option value="RESOLVED">해결됨</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* 테이블 */}
      <div className="bg-white rounded-lg border">
        <Table
          headers={[
            <input
              type="checkbox"
              checked={selectedReports.length === reports.length && reports.length > 0}
              onChange={handleSelectAll}
            />,
            'ID', '타입', '신고자', '대상자', '신고 사유', 
            '상태', '신고일', '처리일'
          ]}
          data={tableData}
          actions={tableActions}
        />
        
        {/* 페이지네이션 */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-600">
            전체 {pagination.totalElements}개 중 {(pagination.number * pagination.size) + 1} - {Math.min((pagination.number + 1) * pagination.size, pagination.totalElements)}개 표시
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="small"
              onClick={() => handlePageChange(pagination.number - 1)}
              disabled={pagination.first}
            >
              이전
            </Button>
            <span className="text-sm text-gray-600">
              {pagination.number + 1} / {pagination.totalPages}
            </span>
            <Button 
              variant="outline" 
              size="small"
              onClick={() => handlePageChange(pagination.number + 1)}
              disabled={pagination.last}
            >
              다음
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportManagementPage;
