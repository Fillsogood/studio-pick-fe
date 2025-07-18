import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  Download,
  CreditCard,
  Building,
  Users
} from 'lucide-react';
import { StatCard, SimpleBarChart, SimplePieChart, Table } from '../components/common/DataComponents';
import { Button, Badge } from '../components/common';
import adminSalesAPI from '../../../lib/admin/adminSalesAPI';

const SalesDashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminSalesAPI.getSalesDashboard();
      setDashboard(response.data);
      setStats(response.data.stats);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError('대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case '완료':
        return <Badge variant="success">완료</Badge>;
      case '대기':
        return <Badge variant="warning">대기</Badge>;
      case '취소':
        return <Badge variant="danger">취소</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="week">이번 주</option>
            <option value="month">이번 달</option>
            <option value="quarter">이번 분기</option>
            <option value="year">이번 연도</option>
          </select>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString()} 기준</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            매출 보고서 다운로드
          </Button>
          <Button variant="primary" onClick={fetchDashboard}>실시간 새로고침</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="총 매출" value={`₩${stats?.totalSales?.toLocaleString() || 0}`} icon={DollarSign} color="teal" />
        <StatCard title="총 거래 건수" value={`${stats?.totalTransactions?.toLocaleString() || 0}건`} icon={CreditCard} color="blue" />
        <StatCard title="참여 스튜디오" value={`${stats?.totalStudios?.toLocaleString() || 0}`} icon={Building} color="green" />
        <StatCard title="활성 사용자" value={`${stats?.activeUsers?.toLocaleString() || 0}`} icon={Users} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart 
          data={(dashboard?.weekTrend?.trends || []).map(item => ({
            label: item.label,
            value: `₩${(item.amount / 1000000).toFixed(1)}M`,
            percentage: 100
          }))}
          title="최근 7일 매출 트렌드"
        />
        <SimplePieChart 
          data={(dashboard?.methodStats?.methods || []).map(item => ({
            label: item.method,
            value: item.amount
          }))}
          title="결제 방법별 비중"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">최근 거래 내역</h3>
        </div>
        <Table
          headers={["날짜", "결제 금액", "결제 방법", "상태"]}
          data={(dashboard?.weekTrend?.trends || []).map(item => [
            item.label,
            `₩${item.amount.toLocaleString()}`,
            item.method || '-',
            getStatusBadge(item.status || '완료')
          ])}
          actions={[<Button key="receipt" variant="outline" size="small">영수증</Button>]}
        />
      </div>
    </div>
  );
};

export default SalesDashboardPage;
