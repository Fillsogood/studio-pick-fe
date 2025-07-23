import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, TrendingUp, Calendar, Download, CheckCircle } from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge } from '../components/common';
import adminSettlementAPI from '../../../lib/admin/adminSettlementAPI';
import { formatDateTime } from '../../../lib/admin';

const SettlementManagementPage = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const response = await adminSettlementAPI.getSettlementTargets();
      if (response.success) {
        console.log(response.data.settlements);
        setSettlements(response.data.settlements || []);
      }
    } catch (err) {
      console.error('Error fetching settlements:', err);
      setError('정산 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSettlement = async (settlementId) => {
    if (!confirm('이 정산을 승인하시겠습니까?')) return;
    try {
      await adminSettlementAPI.approveSettlement(settlementId);
      alert('정산이 승인되었습니다.');
      fetchSettlements();
    } catch (err) {
      alert('정산 승인에 실패했습니다.');
      console.error('Error approving settlement:', err);
    }
  };

  useEffect(() => {
    fetchSettlements();
  }, []);

  const getSettlementStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
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

  const settlementTableData = settlements.map(s => [
    s.id,
    s.targetName,
    s.ownerName,
    `${(s.totalAmount || 0).toLocaleString()}원`,
    `${(s.platformFee || 0).toLocaleString()}원`,
    `${(s.payoutAmount || 0).toLocaleString()}원`,
    getSettlementStatusBadge(s.status),
    formatDateTime(s.createdAt),
    formatDateTime(s.settledAt)
  ]);

  const settlementActions = settlements.map(s => [
    s.status === 'HOLD' && (
      <Button key="approve" variant="success" size="small" onClick={() => handleApproveSettlement(s.id)}>
        <CheckCircle className="w-4 h-4 mr-1" /> 승인
      </Button>
    )
  ].filter(Boolean));

  if (loading) return <div className="text-center py-12">로딩 중...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">정산 관리</h1>
      </div>
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">정산 목록</h3>
          <p className="text-sm text-gray-600 mt-1">스튜디오별 정산 내역을 관리할 수 있습니다.</p>
        </div>
        <Table
          headers={["ID", "스튜디오", "정산기간", "매출액", "수수료", "정산액", "상태", "요청일", "처리일"]}
          data={settlementTableData}
          actions={settlementActions}
        />
      </div>
    </div>
  );
};

export default SettlementManagementPage;
