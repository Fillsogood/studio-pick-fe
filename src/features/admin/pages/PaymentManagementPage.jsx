import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, TrendingUp, Calendar, Filter, Download, CheckCircle } from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge, Input } from '../components/common';
import adminSalesAPI from '@/lib/admin/adminSalesAPI';
import adminSettlementAPI from '@/lib/admin/settlementAPI';

const PaymentManagementPage = () => {
  const [salesData, setSalesData] = useState(null);
  const [salesDetails, setSalesDetails] = useState([]);
  const [paymentMethodStats, setPaymentMethodStats] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, payments, settlements
  
  // 필터 상태
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    method: '',
    status: '',
    page: 1,
    size: 20
  });

  // 페이지네이션 정보
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalElements: 0,
    totalPages: 0
  });

  // 매출 통계 조회
  const fetchSalesStats = async () => {
    try {
      const response = await adminSalesAPI.getSalesStats();
      if (response.success) {
        setSalesData(response.data);
      }
    } catch (err) {
      console.error('Error fetching sales stats:', err);
    }
  };

  // 결제 방법별 통계 조회
  const fetchPaymentMethodStats = async () => {
    try {
      const response = await adminSalesAPI.getPaymentMethodStats({
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      if (response.success) {
        setPaymentMethodStats(response.data);
      }
    } catch (err) {
      console.error('Error fetching payment method stats:', err);
    }
  };

  // 매출 상세 내역 조회
  const fetchSalesDetails = async () => {
    try {
      const response = await adminSalesAPI.getSalesDetails(filters);
      if (response.success) {
        setSalesDetails(response.data.sales || []);
        setPagination(response.data.pagination || {});
      }
    } catch (err) {
      console.error('Error fetching sales details:', err);
    }
  };

  // 정산 목록 조회 (임시 데이터 - 백엔드 구현 필요)
  const fetchSettlements = async () => {
    try {
      // 임시 데이터
      const mockSettlements = [
        {
          id: 1,
          studioName: '아트 스튜디오',
          amount: 450000,
          commission: 45000,
          netAmount: 405000,
          status: 'HOLD',
          period: '2024-07',
          requestDate: '2024-07-01',
          processedDate: null
        },
        {
          id: 2,
          studioName: '뮤직 스튜디오',
          amount: 320000,
          commission: 32000,
          netAmount: 288000,
          status: 'PAID',
          period: '2024-06',
          requestDate: '2024-06-01',
          processedDate: '2024-06-15'
        }
      ];
      setSettlements(mockSettlements);
    } catch (err) {
      console.error('Error fetching settlements:', err);
    }
  };

  // 정산 승인
  const handleApproveSettlement = async (settlementId) => {
    if (!confirm('이 정산을 승인하시겠습니까?')) {
      return;
    }

    try {
      await adminSettlementAPI.approveSettlement(settlementId);
      alert('정산이 승인되었습니다.');
      fetchSettlements(); // 목록 새로고침
    } catch (err) {
      alert('정산 승인에 실패했습니다.');
      console.error('Error approving settlement:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSalesStats(),
          fetchPaymentMethodStats(),
          fetchSalesDetails(),
          fetchSettlements()
        ]);
      } catch (err) {
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  // 필터 변경 핸들러
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
  };

  // 상태 배지 렌더링
  const getPaymentStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid':
        return <Badge variant="success">완료</Badge>;
      case 'pending':
        return <Badge variant="warning">대기</Badge>;
      case 'failed':
        return <Badge variant="danger">실패</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">취소</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getSettlementStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid':
        return <Badge variant="success">지급완료</Badge>;
      case 'hold':
        return <Badge variant="warning">보류</Badge>;
      case 'pending':
        return <Badge variant="primary">대기</Badge>;
      case 'rejected':
        return <Badge variant="danger">거부</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  // 결제 상세 테이블 데이터
  const paymentDetailsTableData = salesDetails.map(sale => [
    sale.id,
    sale.userName || '-',
    sale.studioName || '-',
    `${(sale.amount || 0).toLocaleString()}원`,
    sale.paymentMethod || '-',
    getPaymentStatusBadge(sale.status),
    sale.paidAt ? new Date(sale.paidAt).toLocaleDateString('ko-KR') : '-'
  ]);

  // 정산 테이블 데이터
  const settlementTableData = settlements.map(settlement => [
    settlement.id,
    settlement.studioName,
    settlement.period,
    `${settlement.amount.toLocaleString()}원`,
    `${settlement.commission.toLocaleString()}원`,
    `${settlement.netAmount.toLocaleString()}원`,
    getSettlementStatusBadge(settlement.status),
    settlement.requestDate,
    settlement.processedDate || '-'
  ]);

  // 정산 액션 버튼
  const settlementActions = settlements.map(settlement => [
    settlement.status === 'HOLD' && (
      <Button 
        key="approve" 
        variant="success" 
        size="small"
        onClick={() => handleApproveSettlement(settlement.id)}
      >
        <CheckCircle className="w-4 h-4 mr-1" />
        승인
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
        <h1 className="text-2xl font-bold text-gray-900">결제 및 정산 관리</h1>
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
      {salesData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {(salesData.totalSales || 0).toLocaleString()}원
                </div>
                <div className="text-sm text-gray-600">총 매출</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {salesData.totalTransactions || 0}
                </div>
                <div className="text-sm text-gray-600">총 거래</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {(salesData.avgTransactionAmount || 0).toLocaleString()}원
                </div>
                <div className="text-sm text-gray-600">평균 거래액</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {settlements.filter(s => s.status === 'HOLD').length}
                </div>
                <div className="text-sm text-gray-600">정산 대기</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            결제 현황
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payments'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            결제 상세 내역
          </button>
          <button
            onClick={() => setActiveTab('settlements')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settlements'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            정산 관리
          </button>
        </nav>
      </div>

      {/* 날짜 필터 */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <label className="text-sm font-medium text-gray-700">기간:</label>
          </div>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <span className="text-gray-500">~</span>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          {activeTab === 'payments' && (
            <>
              <select 
                value={filters.method}
                onChange={(e) => handleFilterChange('method', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">전체 결제방법</option>
                <option value="CARD">카드</option>
                <option value="ACCOUNT">계좌이체</option>
                <option value="VIRTUAL_ACCOUNT">가상계좌</option>
              </select>
              <select 
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">전체 상태</option>
                <option value="PAID">완료</option>
                <option value="PENDING">대기</option>
                <option value="FAILED">실패</option>
                <option value="CANCELLED">취소</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 결제 방법별 통계 */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">결제 방법별 통계</h3>
              <p className="text-sm text-gray-600 mt-1">선택한 기간의 결제 방법별 현황</p>
            </div>
            <div className="p-4">
              {paymentMethodStats ? (
                <div className="space-y-4">
                  {paymentMethodStats.methods?.map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-blue-500 mr-3" />
                        <div>
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.count}건</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{method.amount?.toLocaleString()}원</div>
                        <div className="text-sm text-gray-600">{method.percentage}%</div>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center text-gray-500 py-4">
                      데이터가 없습니다.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  데이터를 불러오는 중...
                </div>
              )}
            </div>
          </div>

          {/* 최근 거래 */}
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">최근 거래</h3>
              <p className="text-sm text-gray-600 mt-1">최근 결제된 거래 내역</p>
            </div>
            <div className="p-4">
              {salesDetails.slice(0, 5).length > 0 ? (
                <div className="space-y-3">
                  {salesDetails.slice(0, 5).map((sale, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{sale.studioName || '스튜디오'}</div>
                        <div className="text-sm text-gray-600">{sale.userName || '고객'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{(sale.amount || 0).toLocaleString()}원</div>
                        {getPaymentStatusBadge(sale.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  최근 거래가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">결제 상세 내역</h3>
            <p className="text-sm text-gray-600 mt-1">모든 결제 거래의 상세 내역을 확인할 수 있습니다.</p>
          </div>
          <Table
            headers={['ID', '고객명', '스튜디오', '결제금액', '결제방법', '상태', '결제일']}
            data={paymentDetailsTableData}
          />
          
          {/* 페이지네이션 */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-600">
              전체 {pagination.totalElements || 0}개 중 {((pagination.currentPage - 1) * filters.size) + 1} - {Math.min(pagination.currentPage * filters.size, pagination.totalElements || 0)}개 표시
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="small"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage <= 1}
              >
                이전
              </Button>
              <span className="text-sm text-gray-600">
                {pagination.currentPage} / {pagination.totalPages || 1}
              </span>
              <Button 
                variant="outline" 
                size="small"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage >= (pagination.totalPages || 1)}
              >
                다음
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settlements' && (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">정산 관리</h3>
            <p className="text-sm text-gray-600 mt-1">스튜디오별 정산 현황을 관리할 수 있습니다.</p>
          </div>
          <Table
            headers={['ID', '스튜디오', '정산기간', '매출액', '수수료', '정산액', '상태', '요청일', '처리일']}
            data={settlementTableData}
            actions={settlementActions}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentManagementPage;
