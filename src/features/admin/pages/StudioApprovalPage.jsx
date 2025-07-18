import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Filter, RefreshCw, AlertTriangle } from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import studioAPI from '../../../lib/admin/adminStudioAPI';
import workshopAPI from '../../../lib/admin/adminWorkShopAPI';
import { formatDate, getStatusBadgeColor, getStatusText, STATUS_CODES } from '../../../lib/admin';

const ApprovalPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('studio');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [processingIds, setProcessingIds] = useState(new Set());

  const fetchItems = async (page = 1, status = filterStatus, keyword = searchKeyword) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        status: status === 'all' ? null : status.toUpperCase(),
        keyword: keyword.trim() || null
      };

      const response =
        filterType === 'studio'
          ? await studioAPI.getStudioAccounts(params)
          : await workshopAPI.getWorkshops(params);

      if (response.success) {
        setItems(response.data.studios || response.data.workshops || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(page);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('목록 조회 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response =
        filterType === 'studio'
          ? await studioAPI.getStudioStats()
          : await workshopAPI.getWorkshopStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('통계 로드 실패:', err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, [filterType]);

  useEffect(() => {
    fetchItems(1, filterStatus, searchKeyword);
  }, [filterStatus]);

  const handleSearch = () => {
    fetchItems(1, filterStatus, searchKeyword);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRefresh = () => {
    fetchItems(currentPage, filterStatus, searchKeyword);
    fetchStats();
  };

  const handleApprove = async (itemId) => {
    if (processingIds.has(itemId)) return;

    try {
      setProcessingIds((prev) => new Set(prev).add(itemId));

      let response;
      if (filterType === 'studio') {
        response = await studioAPI.changeStudioStatus(itemId, STATUS_CODES.STUDIO_ACTIVE, '관리자 승인');
      } else {
        response = await workshopAPI.approveWorkshop(itemId, { status: STATUS_CODES.WORKSHOP_APPROVED, reason: '관리자 승인' });
      }

      if (response.success) {
        await fetchItems(currentPage, filterStatus, searchKeyword);
        await fetchStats();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('승인 실패:', err);
      alert(err.message);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleReject = async (itemId) => {
    if (processingIds.has(itemId)) return;

    const reason = prompt('거부 사유를 입력하세요:');
    if (!reason) return;

    try {
      setProcessingIds((prev) => new Set(prev).add(itemId));

      let response;
      if (filterType === 'studio') {
        response = await studioAPI.changeStudioStatus(itemId, STATUS_CODES.STUDIO_REJECTED, reason);
      } else {
        response = await workshopAPI.approveWorkshop(itemId, { status: STATUS_CODES.WORKSHOP_REJECTED, reason });
      }

      if (response.success) {
        await fetchItems(currentPage, filterStatus, searchKeyword);
        await fetchStats();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('거부 실패:', err);
      alert(err.message);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const handleViewDetail = (itemId) => {
    console.log('View detail:', itemId);
  };

  const handlePageChange = (page) => {
    fetchItems(page, filterStatus, searchKeyword);
  };

  const getStatusBadge = (status) => {
    const color = getStatusBadgeColor(status);
    const text = getStatusText(status);

    return (
      <Badge
        variant={
          color === 'green' ? 'success' : color === 'yellow' ? 'warning' : color === 'red' ? 'danger' : 'default'
        }
      >
        {text}
      </Badge>
    );
  };

  const tableData = items.map((item) => [
    item.name || '알 수 없음',
    item.ownerInfo?.name || '알 수 없음',
    item.category || '기타',
    item.location || '알 수 없음',
    formatDate(item.createdAt),
    getStatusBadge(item.status)
  ]);

  const tableActions = items.map((item) => [
    <Button key="view" variant="outline" size="small" onClick={() => handleViewDetail(item.id)}>
      <Eye className="w-4 h-4 mr-1" /> 상세보기
    </Button>,
    item.status === STATUS_CODES.STUDIO_PENDING || item.status === STATUS_CODES.WORKSHOP_PENDING ? (
      <Button
        key="approve"
        variant="success"
        size="small"
        onClick={() => handleApprove(item.id)}
        disabled={processingIds.has(item.id)}
      >
        {processingIds.has(item.id) ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
        ) : (
          <Check className="w-4 h-4 mr-1" />
        )}
        승인
      </Button>
    ) : null,
    item.status === STATUS_CODES.STUDIO_PENDING || item.status === STATUS_CODES.WORKSHOP_PENDING ? (
      <Button
        key="reject"
        variant="danger"
        size="small"
        onClick={() => handleReject(item.id)}
        disabled={processingIds.has(item.id)}
      >
        {processingIds.has(item.id) ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1"></div>
        ) : (
          <X className="w-4 h-4 mr-1" />
        )}
        거부
      </Button>
    ) : null
  ].filter(Boolean));

  const getStatsCards = () => [
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

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="studio">스튜디오</option>
            <option value="workshop">공방</option>
          </select>
          <Input
            placeholder="검색..."
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
          <RefreshCw className="w-4 h-4 mr-2" /> 새로고침
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {getStatsCards().map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value.toLocaleString()}</div>
            <div className="text-sm text-gray-600">{stat.title}</div>
          </div>
        ))}
      </div>

      <Table headers={[filterType === 'studio' ? '스튜디오명' : '공방명', '대표자', '카테고리', '위치', '신청일', '상태']} data={tableData} actions={tableActions} />

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
                variant={currentPage === page ? 'primary' : 'outline'}
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

      {items.length === 0 && !loading && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{filterType === 'studio' ? '스튜디오' : '공방'}가 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchKeyword ? '검색 결과가 없습니다.' : `등록된 ${filterType === 'studio' ? '스튜디오' : '공방'}가 없습니다.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApprovalPage;
