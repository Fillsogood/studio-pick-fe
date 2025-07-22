// ✅ 환불 관리 페이지 - 기존 환불 목록 조회만 사용하는 최소화 버전

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Table } from '../components/common/DataComponents';
import { Button, Badge } from '../components/common';
import adminRefundAPI from '../../../lib/admin/adminRefundAPI';

const RefundManagementPage = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRefunds = async () => {
    try {
      const response = await adminRefundAPI.getRefunds(1, 100);
      if (response.success) setRefunds(response.data.refunds);
    } catch (err) {
      console.error(err);
      setError('환불 데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return <Badge variant="success">완료</Badge>;
      case 'pending': return <Badge variant="warning">대기</Badge>;
      case 'failed': return <Badge variant="danger">실패</Badge>;
      case 'processing': return <Badge variant="primary">처리중</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) return <div className="text-center py-12">로딩 중...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">환불 관리</h1>
      </div>

      <Table
        headers={["ID", "고객명", "금액", "상태", "요청/처리일"]}
        data={refunds.map(r => [
          r.refundId,
          r.userName ?? '-',
          (typeof r.refundAmount === 'number') ? `${r.refundAmount.toLocaleString()}원` : '-',
          getStatusBadge(r.status),
          r.requestedAt ? new Date(r.requestedAt).toLocaleString() : '-'
        ])}
      />


    </div>
  );
};

export default RefundManagementPage;
