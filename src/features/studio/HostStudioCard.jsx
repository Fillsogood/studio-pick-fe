import { useNavigate } from "react-router-dom";

export default function HostStudioCard({
  studio,
  onDelete,
  onToggle,
  onNavigate,
  onCopy,
}) {
  const navigate = useNavigate();

  const statusMap = {
    PENDING: { label: "승인대기", class: "text-yellow-600" },
    APPROVED: { label: "승인됨", class: "text-green-600" },
    ACTIVE: { label: "운영중", class: "text-blue-600" },
    INACTIVE: { label: "숨김", class: "text-gray-500" },
    REJECTED: { label: "거절됨", class: "text-red-600" },
    SUSPENDED: { label: "삭제됨", class: "text-gray-400" },
  };
  const { label, class: statusClass } = statusMap[studio.status] || {
    label: "기타",
    class: "text-gray-400",
  };

  return (
    <div className="border border-gray-300 rounded-2xl shadow-md p-4 bg-white flex flex-col justify-between hover:shadow-xl transition">
      <div>
        <img
          src={studio.thumbnailImage}
          alt={`${studio.name} 썸네일`}
          className="w-full h-[180px] object-cover rounded-lg mb-4"
        />
        <h3 className="text-xl font-bold text-gray-800 mb-1">{studio.name}</h3>
        <p className="text-sm text-gray-600">{studio.location}</p>
        <p className="text-base text-gray-700 mt-1">
          {studio.hourlyBaseRate.toLocaleString()}원 / 시간
        </p>
        <p className="text-sm font-semibold mt-2">
          상태: <span className={statusClass}>{label}</span>
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {(studio.status === "APPROVED" || studio.status === "ACTIVE") && (
          <button
            onClick={() => onNavigate(studio.id)}
            className="px-4 py-1.5 rounded bg-lime-300 hover:bg-lime-200 text-black text-sm font-medium"
          >
            {studio.status === "APPROVED" ? "개설" : "수정"}
          </button>
        )}

        {(studio.status === "INACTIVE" ||
          studio.status === "ACTIVE" ||
          studio.status === "APPROVED") && (
          <button
            onClick={() => onToggle(studio.id)}
            className="px-4 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
          >
            {studio.status === "INACTIVE" ? "활성화" : "숨기기"}
          </button>
        )}

        {studio.status === "REJECTED" && (
          <button
            onClick={() => onCopy(studio.id)}
            className="px-4 py-1.5 rounded bg-lime-300 hover:bg-lime-200 text-black text-sm font-medium"
          >
            다시 신청
          </button>
        )}

        {/* 삭제 버튼은 항상 표시 */}
        <button
          onClick={() => onDelete(studio.id)}
          className="px-4 py-1.5 rounded bg-red-100 hover:bg-red-200 text-red-700 text-sm"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
