import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import studioAPI from '../../../lib/admin/studioAPI';
import { formatDate, getStatusBadgeColor, getStatusText, STATUS_CODES } from '../../../lib/admin';

const StudioApprovalPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [studios, setStudios] = useState([]);
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingIds, setProcessingIds] = useState(new Set());

  // 데이터 로드
  const fetchStudios = async (page = 1, status = filterStatus, keyword = searchKeyword) => {
    try {
      setLoading(true);
      setError(null);
      
      const statusParam = status === 'all' ? null : status.toUpperCase();
      const keywordParam = keyword.trim() || null;
      
      const response = await studioAPI.getStudioAccounts(page, 10, statusParam, keywordParam);
      
      if (response.success) {
        setStudios(response.data.studios || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(page);
      } else {
        throw new Error(response.message || '스튜디오 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('스튜디오 목록 로드 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 통계 데이터 로드
  const fetchStats = async () => {
    try {
      const response = await studioAPI.getStudioStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('통계 로드 실패:', err);
    }
  };

  useEffect(() => {
    fetchStudios();
    fetchStats();
  }, []);

  // 필터 변경 시 데이터 재로드
  useEffect(() => {
    fetchStudios(1, filterStatus, searchKeyword);
  }, [filterStatus]);

  // 검색 핸들러
  const handleSearch = () => {
    fetchStudios(1, filterStatus, searchKeyword);
  };

  // 검색 입력 핸들러
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 새로고침
  const handleRefresh = () => {
    fetchStudios(currentPage, filterStatus, searchKeyword);
    fetchStats();
  };

  // 스튜디오 승인
  const handleApprove = async (studioId) => {
    if (processingIds.has(studioId)) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(studioId));
      
      const response = await studioAPI.changeStudioStatus(studioId, STATUS_CODES.STUDIO_ACTIVE, '관리자 승인');
      
      if (response.success) {
        await fetchStudios(currentPage, filterStatus, searchKeyword);
        await fetchStats();
      } else {
        throw new Error(response.message || '승인 처리에 실패했습니다.');
      }
    } catch (err) {
      console.error('스튜디오 승인 실패:', err);
      alert(err.message);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(studioId);
        return newSet;
      });
    }
  };

  // 스튜디오 거부
  const handleReject = async (studioId) => {
    if (processingIds.has(studioId)) return;
    
    const reason = prompt('거부 사유를 입력하세요:');
    if (!reason) return;
    
    try {
      setProcessingIds(prev => new Set(prev).add(studioId));
      
      const response = await studioAPI.changeStudioStatus(studioId, STATUS_CODES.STUDIO_REJECTED, reason);
      
      if (response.success) {
        await fetchStudios(currentPage, filterStatus, searchKeyword);
        await fetchStats();
      } else {
        throw new Error(response.message || '거부 처리에 실패했습니다.');
      }
    } catch (err) {
      console.error('스튜디오 거부 실패:', err);
      alert(err.message);
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(studioId);
        return newSet;
      });
    }
  };

  // 스튜디오 상세보기
  const handleViewDetail = (studioId) => {
    // TODO: 상세 모달 또는 페이지로 이동
    console.log('View studio detail:', studioId);
  };

  // 페이지 변경
  const handlePageChange = (page) => {
    fetchStudios(page, filterStatus, searchKeyword);
  };

  // 상태 배지 생성
  const getStatusBadge = (status) => {
    const color = getStatusBadgeColor(status);
    const text = getStatusText(status);
    
    return (
      <Badge 
        variant={color === 'green' ? 'success' : 
               color === 'yellow' ? 'warning' : 
               color === 'red' ? 'danger' : 'default'}
      >
        {text}
      </Badge>
    );
  };

  // 테이블 데이터 생성
  const tableData = studios.map(studio => [
    studio.name || '알 수 없음',
    studio.ownerInfo?.name || '알 수 없음',
    studio.category || '기타',
    studio.location || '알 수 없음',
    formatDate(studio.createdAt),
    getStatusBadge(studio.status)
  ]);

  // 테이블 액션 생성
  const tableActions = studios.map(studio => [
    <Button 
      key="view" 
      variant="outline" 
      size="small"
      onClick={() => handleViewDetail(studio.id)}
    >
      <Eye className="w-4 h-4 mr-1" />
      상세보기
    </Button>,
    studio.status === STATUS_CODES.STUDIO_PENDING && (
      <Button 
        key="approve" 
        variant="success" 
        size="small"
        onClick={() => handleApprove(studio.id)}
        disabled={processingIds.has(studio.id)}
      >
        {processingIds.has(studio.id) ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
        ) : (
          <Check className="w-4 h-4 mr-1" />
        )}
        승인
      </Button>
    ),
    studio.status === STATUS_CODES.STUDIO_PENDING && (
      <Button 
        key="reject" 
        variant="danger" 
        size="small"
        onClick={() => handleReject(studio.id)}
        disabled={processingIds.has(studio.id)}
      >
        {processingIds.has(studio.id) ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
        ) : (
          <X className="w-4 h-4 mr-1" />
        )}
        거부
      </Button>
    )
  ].filter(Boolean));

  // 통계 카드 데이터
  const getStatsCards = () => {
    return [
      {
        title: '승인대기',
        value: stats.pendingCount || 0,
        color: 'blue'
      },
      {
        title: '승인완료',
        value: stats.activeCount || 0,
        color: 'green'
      },
      {
        title: '승인거부',
        value: stats.rejectedCount || 0,
        color: 'red'
      },
      {
        title: '전체',
        value: stats.totalCount || 0,
        color: 'gray'
      }
    ];
  };

  // 로딩 상태
  if (loading && studios.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
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
          <RefreshCw className="w-4 h-4 mr-2" />
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 필터 및 검색 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input 
            placeholder="스튜디오명 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-64"
          />
          <Button onClick={handleSearch} variant="outline" size="small">
            검색
          </Button>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">전체 상태</option>
            <option value="pending">승인대기</option>
            <option value="active">승인완료</option>
            <option value="rejected">승인거부</option>
          </select>
        </div>
        <Button onClick={handleRefresh} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          새로고침
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {getStatsCards().map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <div className={`text-2xl font-bold text-${stat.color}-600`}>
              {stat.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* 테이블 */}
      <Table
        headers={['스튜디오명', '대표자', '카테고리', '위치', '신청일', '상태']}
        data={tableData}
        actions={tableActions}
      />

      {/* 페이징 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            variant="outline"
            size="small"
          >
            이전
          </Button>
          
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
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
          
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            variant="outline"
            size="small"
          >
            다음
          </Button>
        </div>
      )}

      {/* 빈 상태 */}
      {studios.length === 0 && !loading && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">스튜디오가 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchKeyword ? '검색 결과가 없습니다.' : '등록된 스튜디오가 없습니다.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default StudioApprovalPage;
