// src/features/host/ClassManagePage.jsx

import React, { useEffect, useState, useCallback } from "react";
import SummaryCard from "./SummaryCard";
import ClassCard from "./ClassCard";
import { fetchHostClasses, toggleHostClassStatus } from "../../lib/hostAPI";
import { getDeletedClasses, addDeletedClass } from "../../lib/deletedClasses";

const ClassManagePage = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1) 데이터 불러오기 (삭제된 ID 필터링)
  const load = useCallback(() => {
    setLoading(true);
    fetchHostClasses()
      .then(res => {
        const all = res.data.data;
        const deleted = getDeletedClasses();
        setClasses(all.filter(c => !deleted.includes(c.id)));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // 2) 프론트에서만 제거 + localStorage에 ID 저장
  const handleRemove = id => {
    addDeletedClass(id);
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  if (loading) {
    return <div className="text-center py-20">로딩 중...</div>;
  }

  // 3) 요약값 계산
  const totalClasses = classes.length;
  const totalReservations = classes.reduce((sum, c) => sum + c.reservationCount, 0);
  const totalRevenue = classes.reduce((sum, c) => sum + c.totalRevenue, 0);
  const thisMonthRevenue = classes
    .filter(c => new Date(c.date).getMonth() === new Date().getMonth())
    .reduce((sum, c) => sum + c.totalRevenue, 0);

  return (
    <div className="p-10">
      <h2 className="text-4xl font-bold mb-10">클래스 관리</h2>

      {/* 요약 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        <SummaryCard label="총 클래스 수" value={`${totalClasses}개`} />
        <SummaryCard label="총 예약 수" value={`${totalReservations}건`} />
        <SummaryCard label="이번 달 매출" value={`${thisMonthRevenue.toLocaleString()}원`} />
        <SummaryCard label="총 누적 매출" value={`${totalRevenue.toLocaleString()}원`} />
      </div>

      {/* 클래스 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {classes.map(item => (
          <ClassCard
            key={item.id}
            item={item}
            onRemove={handleRemove}
            onRefresh={load}
            onToggle={newStatus =>
              toggleHostClassStatus(item.id, newStatus)
                .then(load)
                .catch(e => {
                  console.error(e);
                  alert("상태 변경에 실패했습니다.");
                })
            }
          />
        ))}
      </div>
    </div>
  );
};

export default ClassManagePage;
