import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertCircle, TrendingDown, Calendar, Filter, Download } from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import adminRefundAPI from '@/lib/admin/refundAPI';

const RefundManagementPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [failedRefunds, setFailedRefunds] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, failed, stats
  
  // 날짜 필터 상태
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // 전체 환불 내역 조회 (임시 - 백엔드에서 구현 필요)
  const fetchAllRefunds = async () => {
    try {
      // 현재 백엔드에서 미구현으로 임시 데이터 사용
      const mockRefunds = [
        {
          id: 1,
          userId: 101,
          userName: '김고객',
          reservationId: 1001,
          studioName: '아트 스튜디오',
          amount: 50000,
          status: 'COMPLETED',
          reason: '스튜디오 사정으로 취소',
          requestDate: '2024-07-10',
          processedDate: '2024-07-11'
        },
        {
          id: 2,
          userId: 102,
          userName: '이고객',
          reservationId: 1002,
          studioName: '뮤직 스튜디오',
          amount: 80000,
          status: 'PENDING',
          reason: '개인 사정',
          requestDate: '2024-07-12',
          processedDate: null
        }
      ];
      setRefunds(mockRefunds);
    } catch (err) {
      console.error('Error fetching all refunds:', err);
    }
  };

  // 환불 실패 건 조회
  const fetchFailedRefunds = async () => {
    try {
      const response = await adminRefundAPI.getFailedRefunds();
      if (response.success) {
        setFailedRefunds(response.data);
      }
    } catch (err) {
      console.error('Error fetching failed refunds:', err);
    }
  };

  // 일별 환불 통계 조회
  const fetchDailyStats = async () => {
    try {
      const response = await adminRefundAPI.getDailyRefundStats(
        dateRange.startDate,
        dateRange.endDate
      );
      if (response.success) {
        setDailyStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching daily stats:', err);
    }
  };

  // 환불 재처리
  const handleRetryRefund = async (refundId) => {
    try {
      await adminRefundAPI.retryRefund(refundId);
      alert('환불 재처리가 요청되었습니다.');
      fetchFailedRefunds(); // 목록 새로고침
    } catch (err) {
      alert('환불 재처리에 실패했습니다.');
      console.error('Error retrying refund:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchAllRefunds(),
          fetchFailedRefunds(),
          fetchDailyStats()
        ]);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // 상태 배지 렌더링
  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed':
        return <Badge variant="success">완료</Badge>;
      case 'pending':
        return <Badge variant="warning">대기</Badge>;
      case 'failed':
        return <Badge variant="danger">실패</Badge>;
      case 'processing':
        return <Badge variant="primary">처리중</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // 전체 환불 테이블 데이터
  const allRefundsTableData = refunds.map(refund => [
    refund.id,
    refund.userName,
    refund.studioName,
    `${refund.amount.toLocaleString()}원`,
    refund.reason,
    getStatusBadge(refund.status),
    refund.requestDate,
    refund.processedDate || '-'
  ]);

  // 실패한 환불 테이블 데이터
  const failedRefundsTableData = failedRefunds.map(refund => [
    refund.id,
    refund.userName || '-',
    refund.studioName || '-',
    `${refund.amount?.toLocaleString() || 0}원`,
    refund.failureReason || '알 수 없음',
    refund.requestDate || '-',
    refund.lastAttemptDate || '-'
  ]);

  // 액션 버튼
  const failedRefundsActions = failedRefunds.map(refund => [
    <Button 
      key="retry" 
      variant="primary" 
      size="small"
      onClick={() => handleRetryRefund(refund.id)}
    >
      <RefreshCw className="w-4 h-4 mr-1" />
      재처리
    </Button>
  ]);

  // 일별 통계 테이블 데이터
  const dailyStatsTableData = dailyStats.map(stat => {
    const successRate = stat.refundCount > 0 
      ? ((stat.successCount / stat.refundCount) * 100).toFixed(1) 
      : 0;
    
    return [
      stat.date,
      stat.refundCount || 0,
      `${(stat.totalAmount || 0).toLocaleString()}원`,
      stat.successCount || 0,
      stat.failureCount || 0,
      `${successRate}%`
    ];
  });

  // 통계 요약 계산
  const statsummary = dailyStats.reduce((acc, day) => ({
    totalRefunds: acc.totalRefunds + (day.refundCount || 0),
    totalAmount: acc.totalAmount + (day.totalAmount || 0),
    successCount: acc.successCount + (day.successCount || 0),
    failureCount: acc.failureCount + (day.failureCount || 0)
  }), { totalRefunds: 0, totalAmount: 0, successCount: 0, failureCount: 0 });

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
        <h1 className="text-2xl font-bold text-gray-900">환불 관리</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            엑셀 다운로드
          </Button>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {statsummary.totalRefunds}
          </div>
          <div className="text-sm text-gray-600">총 환불 건수</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {statsummary.totalAmount.toLocaleString()}원
          </div>
          <div className="text-sm text-gray-600">총 환불 금액</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {statsummary.successCount}
          </div>
          <div className="text-sm text-gray-600">성공 건수</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">
            {failedRefunds.length}
          </div>
          <div className="text-sm text-gray-600">실패 건수</div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            전체 환불 내역
          </button>
          <button
            onClick={() => setActiveTab('failed')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'failed'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            실패 건 관리 ({failedRefunds.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'stats'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            일별 통계
          </button>
        </nav>
      </div>

      {/* 날짜 범위 선택 */}
      {(activeTab === 'stats' || activeTab === 'all') && (
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <label className="text-sm font-medium text-gray-700">기간:</label>
            </div>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span className="text-gray-500">~</span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Button onClick={() => fetchDailyStats()}>조회</Button>
          </div>
        </div>
      )}

      {/* 탭 콘텐츠 */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">전체 환불 내역</h3>
            <p className="text-sm text-gray-600 mt-1">모든 환불 요청 내역을 확인할 수 있습니다.</p>
          </div>
          <Table
            headers={['ID', '고객명', '스튜디오', '환불금액', '사유', '상태', '요청일', '처리일']}
            data={allRefundsTableData}
          />
        </div>
      )}

      {activeTab === 'failed' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-lg font-medium">환불 실패 건 관리</h3>
              <p className="text-sm text-gray-600 mt-1">실패한 환불 건을 재처리할 수 있습니다.</p>
            </div>
          </div>
          {failedRefunds.length > 0 ? (
            <Table
              headers={['ID', '고객명', '스튜디오', '환불금액', '실패 사유', '요청일', '마지막 시도일']}
              data={failedRefundsTableData}
              actions={failedRefundsActions}
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              실패한 환불 건이 없습니다.
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b flex items-center">
            <TrendingDown className="w-5 h-5 text-blue-500 mr-2" />
            <div>
              <h3 className="text-lg font-medium">일별 환불 통계</h3>
              <p className="text-sm text-gray-600 mt-1">선택한 기간의 일별 환불 현황을 확인할 수 있습니다.</p>
            </div>
          </div>
          {dailyStats.length > 0 ? (
            <Table
              headers={['날짜', '환불 건수', '환불 금액', '성공', '실패', '성공률']}
              data={dailyStatsTableData}
            />
          ) : (
            <div className="p-8 text-center text-gray-500">
              선택한 기간에 환불 데이터가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RefundManagementPage;
