// ✅ ApprovalPage.jsx 수정본 - 스튜디오/공방 분기 처리 포함

import React, { useState, useEffect } from 'react';
import { Eye, RefreshCw, AlertTriangle } from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import studioAPI from '../../../lib/admin/adminStudioAPI';
import workshopAPI from '../../../lib/admin/adminWorkShopAPI';
import { formatDate, getStatusBadgeColor, getStatusText, STATUS_CODES } from '../../../lib/admin';
import DetailModal from '../components/modals/DetailModal';

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
  const [detailItem, setDetailItem] = useState(null);

  const fetchItems = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page,
        size: 10,
        status: filterStatus === 'all' ? null : filterStatus.toUpperCase(),
        keyword: searchKeyword.trim() || null
      };
      const response = filterType === 'studio'
        ? await studioAPI.getStudioAccounts(params)
        : await workshopAPI.getWorkshops(params);

      if (response.success) {
        if (filterType === 'studio') {
          setItems(response.data.studios || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setItems(response.data.workshops || []);
          setTotalPages(response.data.pagination?.totalPages || 1);
        }
        setCurrentPage(page);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = filterType === 'studio'
        ? await studioAPI.getStudioStats()
        : await workshopAPI.getWorkshopStats();
      if (response.success) setStats(response.data);
    } catch (err) {
      console.error('통계 로드 실패:', err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchStats();
  }, [filterType]);

  useEffect(() => {
    fetchItems(1);
  }, [filterStatus]);

  const handleSearch = () => fetchItems(1);
  const handleSearchKeyDown = (e) => e.key === 'Enter' && handleSearch();
  const handleRefresh = () => {
    fetchItems(currentPage);
    fetchStats();
  };

  const handleStatusChange = async (itemId, status, reason = '관리자 처리') => {
    if (processingIds.has(itemId)) return;
    try {
      setProcessingIds((prev) => new Set(prev).add(itemId));
      let response;
      if (filterType === 'studio') {
        response = await studioAPI.changeStudioStatus(itemId, { status, reason });
      } else {
        response = await workshopAPI.changeWorkshopStatus(itemId, { action: status, reason });  // ✅ 수정됨
      }
  
      if (response.success) {
        await fetchItems(currentPage);
        await fetchStats();
        setDetailItem(null);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };
  

  const getStatusBadge = (status) => <Badge variant={getStatusBadgeColor(status)}>{getStatusText(status)}</Badge>;

  const tableData = items.map((item) => [
    filterType === 'studio' ? (item.name || '알 수 없음') : (item.title || '알 수 없음'),
    item.ownerInfo?.name || item.instructorName || '알 수 없음',
    item.category || '-',
    item.location || item.studioName || '알 수 없음',
    formatDate(item.createdAt),
    getStatusBadge(item.status)
  ]);

  const tableActions = items.map((item) => [
    <Button key="view" variant="outline" size="small" onClick={() => setDetailItem(item)}>
      <Eye className="w-4 h-4 mr-1" /> 상세보기
    </Button>
  ]);

  const getStatsCards = () => {
    return filterType === 'studio'
      ? [
          { title: '승인대기', value: stats.pendingStudios || 0, color: 'blue' },
          { title: '승인완료', value: stats.approvedStudios || 0, color: 'green' },
          { title: '승인거부', value: stats.rejectedStudios || 0, color: 'red' },
          { title: '전체', value: stats.totalStudios || 0, color: 'gray' }
        ]
      : [
          { title: '승인대기', value: stats.pendingWorkshops || 0, color: 'blue' },
          { title: '승인완료', value: stats.activeWorkshops || 0, color: 'green' },
          { title: '승인거부', value: stats.rejectedWorkshops || 0, color: 'red' },
          { title: '전체', value: stats.totalWorkshops || 0, color: 'gray' }
        ];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border rounded-lg px-3 py-2">
            <option value="studio">스튜디오</option>
            <option value="workshop">공방</option>
          </select>
          <Input placeholder="검색..." value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={handleSearchKeyDown} className="w-64" />
          <Button onClick={handleSearch} variant="outline" size="small">검색</Button>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded-lg px-3 py-2">
            <option value="all">전체 상태</option>
            <option value="pending">승인대기</option>
            <option value="active">승인완료</option>
            <option value="rejected">승인거부</option>
          </select>
        </div>
        <Button onClick={handleRefresh} variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> 새로고침</Button>
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
          <Button onClick={() => fetchItems(currentPage - 1)} disabled={currentPage <= 1} variant="outline" size="small">이전</Button>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return <Button key={page} onClick={() => fetchItems(page)} variant={currentPage === page ? 'primary' : 'outline'} size="small">{page}</Button>;
          })}
          <Button onClick={() => fetchItems(currentPage + 1)} disabled={currentPage >= totalPages} variant="outline" size="small">다음</Button>
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{filterType === 'studio' ? '스튜디오' : '공방'}가 없습니다</h3>
          <p className="mt-1 text-sm text-gray-500">{searchKeyword ? '검색 결과가 없습니다.' : `등록된 ${filterType === 'studio' ? '스튜디오' : '공방'}가 없습니다.`}</p>
        </div>
      )}

      {detailItem && (
        <DetailModal
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onApprove={(reason) => handleStatusChange(
            detailItem.id,
            filterType === 'studio'
              ? STATUS_CODES.STUDIO_APPROVED
              : STATUS_CODES.WORKSHOP_ACTIVE,
            reason
          )}
          onReject={(reason) => handleStatusChange(
            detailItem.id,
            filterType === 'studio'
              ? STATUS_CODES.STUDIO_REJECTED
              : STATUS_CODES.WORKSHOP_INACTIVE,
            reason
          )}
        />
      )}
    </div>
  );
};

export default ApprovalPage;
