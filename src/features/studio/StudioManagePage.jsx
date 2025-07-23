import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyStudios,
  deleteStudio,
  toggleStudioVisibility,
} from "../../lib/studioAPI";
import SummaryCard from "../host/SummaryCard";
import HostStudioCard from "./HostStudioCard";

export default function MyStudioManagePage() {
  const [studios, setStudios] = useState([]);
  const navigate = useNavigate();

  const loadStudios = useCallback(() => {
    getMyStudios()
      .then((res) => {
        console.log("🎯 내 스튜디오 데이터:", res.data.data);
        setStudios(res.data.data);
      })
      .catch((e) => console.error("❌ 내 스튜디오 목록 로딩 실패", e));
  }, []);

  const handleDelete = async (studioId) => {
    if (!window.confirm("정말 삭제하시겠어요?")) return;
    try {
      await deleteStudio(studioId);
      setStudios((prev) => prev.filter((s) => s.id !== studioId));
    } catch (e) {
      alert("삭제 실패");
      console.error(e);
    }
  };

  const handleToggleStatus = async (studioId) => {
    try {
      await toggleStudioVisibility(studioId);
      loadStudios();
    } catch (e) {
      alert("상태 변경 실패");
      console.error(e);
    }
  };

  const totalStudios = studios.length;
  const totalReservations = studios.reduce(
    (sum, c) => sum + c.reservationCount,
    0
  );
  const totalRevenue = studios.reduce((sum, c) => sum + c.totalRevenue, 0);
  const thisMonthRevenue = studios
    .filter((c) => new Date(c.date).getMonth() === new Date().getMonth())
    .reduce((sum, c) => sum + c.totalRevenue, 0);

  return (
    <div className="p-10">
      <h2 className="text-4xl font-bold mb-10">스튜디오 관리</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        <SummaryCard label="총 스튜디오 수" value={`${totalStudios}개`} />
        <SummaryCard label="총 예약 수" value={`${totalReservations}건`} />
        <SummaryCard
          label="이번 달 매출"
          value={`${thisMonthRevenue.toLocaleString()}원`}
        />
        <SummaryCard
          label="총 누적 매출"
          value={`${totalRevenue.toLocaleString()}원`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {studios.map((studio) => (
          <HostStudioCard
            key={studio.id}
            studio={studio}
            onDelete={handleDelete}
            onToggle={handleToggleStatus}
            onNavigate={(id) => navigate(`/host/studios/${id}/setup`)}
            onCopy={(id) => navigate(`/host/studios/rental?copyFrom=${id}`)}
          />
        ))}
      </div>
    </div>
  );
}
