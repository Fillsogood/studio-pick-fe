// src/features/host/ClassCard.jsx

import React from "react";
import { useNavigate } from "react-router-dom";

const ClassCard = ({ item, onRemove, onToggle }) => {
  const navigate = useNavigate();

  // 상태별 텍스트와 스타일 매핑
  const statusMap = {
    active:   { label: "모집중",    class: "text-green-600"  },
    hide:     { label: "숨김",      class: "text-gray-500"   },
    inactive: { label: "거절됨",    class: "text-red-600"    },
    pending:  { label: "승인대기",  class: "text-yellow-600" }
  };
  const { label, class: statusClass } = statusMap[item.status] || statusMap.pending;

  const handleRemove = () => {
    if (window.confirm("정말 이 클래스를 삭제하시겠습니까?")) {
      onRemove(item.id);
    }
  };

  return (
    <div className="border border-gray-300 rounded-2xl shadow-md p-6 bg-neutral-50 flex flex-col justify-between hover:shadow-xl transition">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
        <p className="text-base text-gray-700 mb-1">예약 수: {item.reservationCount}건</p>
        <p className="text-base text-gray-700 mb-1">
          총 매출: {item.totalRevenue.toLocaleString()}원
        </p>
        <p className="text-base text-gray-700 mb-1">날짜: {item.date}</p>
        <p className="text-base font-semibold">
          상태: <span className={statusClass}>{label}</span>
        </p>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex gap-3 mt-6 flex-wrap">
        {/* 수정 */}
        <button
          className="text-base px-4 py-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
          onClick={() => navigate(`/host/classes/${item.id}/edit`)}
        >
          수정
        </button>

        {/* 삭제 (UI에서만 제거) */}
        <button
          className="text-base px-4 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200"
          onClick={handleRemove}
        >
          삭제
        </button>

        {/* 숨기기 / 다시 노출 */}
        {item.status === "active" && (
          <button
            className="text-base px-4 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={() => onToggle("HIDE")}
          >
            숨기기
          </button>
        )}
        {item.status === "hide" && (
          <button
            className="text-base px-4 py-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200"
            onClick={() => onToggle("ACTIVE")}
          >
            다시 노출
          </button>
        )}

        {/* 승인 대기중 */}
        {item.status === "pending" && (
          <span className="text-base px-4 py-1.5 rounded-md bg-yellow-100 text-yellow-700">
            승인 대기중
          </span>
        )}

        {/* 관리자 거절된 항목 */}
        {item.status === "inactive" && (
          <span className="text-base px-4 py-1.5 rounded-md bg-red-100 text-red-700">
            거절됨
          </span>
        )}
      </div>
    </div>
  );
};

export default ClassCard;
