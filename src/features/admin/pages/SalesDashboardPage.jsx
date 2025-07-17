import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Download,
  CreditCard,
  Building,
  Users
} from 'lucide-react';
import { StatCard, SimpleBarChart, SimplePieChart, Table } from '../components/common/DataComponents';
import { Button, Badge } from '../components/common';

const SalesDashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const salesStats = [
    { 
      title: '이번 달 총 매출', 
      value: '₩45,230,000', 
      change: '+23.5%', 
      icon: DollarSign, 
      color: 'teal' 
    },
    { 
      title: '총 거래 건수', 
      value: '1,234', 
      change: '+15.2%', 
      icon: CreditCard, 
      color: 'blue' 
    },
    { 
      title: '참여 스튜디오', 
      value: '89', 
      change: '+8.1%', 
      icon: Building, 
      color: 'green' 
    },
    { 
      title: '활성 사용자', 
      value: '3,456', 
      change: '+12.3%', 
      icon: Users, 
      color: 'purple' 
    }
  ];

  const monthlySales = [
    { label: '1월', value: 32000000, percentage: 71 },
    { label: '2월', value: 28000000, percentage: 62 },
    { label: '3월', value: 35000000, percentage: 78 },
    { label: '4월', value: 42000000, percentage: 93 },
    { label: '5월', value: 38000000, percentage: 84 },
    { label: '6월', value: 45000000, percentage: 100 }
  ];

  const categoryRevenue = [
    { label: '사진 스튜디오', value: 18500000 },
    { label: '음악 스튜디오', value: 12300000 },
    { label: '댄스 스튜디오', value: 8900000 },
    { label: '기타', value: 5530000 }
  ];

  const topStudios = [
    ['포토 스튜디오 프리미엄', '₩3,200,000', '156건', '4.8⭐', '강남구'],
    ['뮤직 레코딩 스튜디오', '₩2,800,000', '89건', '4.9⭐', '홍대'],
    ['댄스 아카데미 서울', '₩2,100,000', '167건', '4.7⭐', '신촌'],
    ['아트 스튜디오 갤러리', '₩1,950,000', '78건', '4.6⭐', '이태원'],
    ['크리에이티브 스페이스', '₩1,780,000', '92건', '4.8⭐', '잠실']
  ];

  const recentTransactions = [
    ['2024-07-03 14:30', '김철수', '포토 스튜디오 A', '₩50,000', '완료'],
    ['2024-07-03 13:15', '이영희', '음악 스튜디오 B', '₩80,000', '완료'],
    ['2024-07-03 12:45', '박민수', '댄스 스튜디오 C', '₩60,000', '완료'],
    ['2024-07-03 11:20', '정수진', '포토 스튜디오 D', '₩45,000', '완료'],
    ['2024-07-03 10:30', '최음악', '음악 스튜디오 E', '₩75,000', '완료']
  ];

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

  return (
    <div className="space-y-6">
      {/* 기간 선택 */}
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
            <span>2024년 7월 기준</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            매출 보고서 다운로드
          </Button>
          <Button variant="primary">실시간 새로고침</Button>
        </div>
      </div>

      {/* 매출 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {salesStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* 매출 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleBarChart 
          data={monthlySales.map(item => ({
            label: item.label,
            value: `₩${(item.value / 1000000).toFixed(0)}M`,
            percentage: item.percentage
          }))} 
          title="월별 매출 현황" 
        />
        <SimplePieChart 
          data={categoryRevenue.map(item => ({
            label: item.label,
            value: item.value
          }))} 
          title="카테고리별 매출 분포" 
        />
      </div>

      {/* 상위 스튜디오 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            매출 상위 스튜디오
          </h3>
        </div>
        <Table
          headers={['스튜디오명', '매출액', '예약 건수', '평점', '위치']}
          data={topStudios}
          actions={[
            <Button key="detail" variant="outline" size="small">상세보기</Button>
          ]}
        />
      </div>

      {/* 최근 거래 내역 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">최근 거래 내역</h3>
        </div>
        <Table
          headers={['거래 시간', '사용자', '스튜디오', '결제 금액', '상태']}
          data={recentTransactions.map(transaction => [
            transaction[0],
            transaction[1],
            transaction[2],
            transaction[3],
            getStatusBadge(transaction[4])
          ])}
          actions={[
            <Button key="receipt" variant="outline" size="small">영수증</Button>
          ]}
        />
      </div>

      {/* 매출 트렌드 요약 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">이번 달 매출 트렌드</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">일 평균 매출</span>
              <span className="font-medium">₩1,507,667</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">최고 매출일</span>
              <span className="font-medium">₩2,350,000 (7월 15일)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">성장률</span>
              <span className="font-medium text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +23.5%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">수수료 현황</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">이번 달 수수료</span>
              <span className="font-medium">₩2,261,500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">수수료율</span>
              <span className="font-medium">5.0%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">전월 대비</span>
              <span className="font-medium text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +18.2%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboardPage;
