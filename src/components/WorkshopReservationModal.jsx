import React, { useState } from "react";
import { MapPin, Users, Clock, Calendar, User } from "lucide-react";

const WorkshopReservationModal = ({
  isOpen,
  onClose,
  workshop,
  onReservationSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !workshop) return null;

  const maxPeople = workshop?.maxParticipants || 8;

  // 결제 금액 계산 (공방은 고정 가격)
  const calcTotalAmount = () => {
    return workshop?.price || 0;
  };
  const totalAmount = calcTotalAmount();

  const handleReservation = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        workshopId: workshop.id,
        reservationDate: workshop.date, // 공방의 고정 날짜 사용
        startTime: {
          hour: workshop.startHour || 0,
          minute: workshop.startMinute || 0,
          second: 0,
          nano: 0,
        },
        endTime: {
          hour: workshop.endHour || 0,
          minute: workshop.endMinute || 0,
          second: 0,
          nano: 0,
        },
        peopleCount: 1, // 공방 예약은 1로 고정
      };

      const res = await fetch("/api/reservations/workshop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "예약 실패");
      onReservationSuccess(data.data);
    } catch (e) {
      setError(e.message || "예약 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-200 bg-white rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">클래스 예약하기</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
          >
            ×
          </button>
        </div>

        {/* 공방 정보 카드 */}
        <div className="bg-white rounded-lg shadow-sm border mx-6 mt-6 mb-4 p-5 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            {workshop.thumbnailUrl && (
              <img
                src={workshop.thumbnailUrl}
                alt="공방 썸네일"
                className="w-16 h-16 rounded-lg object-cover border"
              />
            )}
            <div className="flex-1">
              <div className="text-base font-bold text-gray-900 mb-1">
                {workshop.title}
              </div>
              <div className="flex items-center text-gray-500 text-sm gap-1 mb-1">
                <User className="w-4 h-4 mr-1" />
                {workshop.instructor}
              </div>
              <div className="flex items-center text-gray-500 text-sm gap-1">
                <MapPin className="w-4 h-4 mr-1" />
                {workshop.address}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2 text-sm text-gray-700">
            <div>
              <span className="font-medium">수강료</span>: ₩
              {workshop.price?.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">수업 일정</span>: {workshop.date}{" "}
              {workshop.startHour || 0}:
              {(workshop.startMinute || 0).toString().padStart(2, "0")} ~{" "}
              {workshop.endHour || 0}:
              {(workshop.endMinute || 0).toString().padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* 예약 입력 카드 */}
        <div className="bg-white rounded-lg shadow-sm border mx-6 mb-4 p-5 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">수업 날짜</label>
            <div className="relative">
              <input
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-50"
                value={workshop.date}
                readOnly
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                시작 시간
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                  value={`${workshop.startHour || 0}:${(
                    workshop.startMinute || 0
                  )
                    .toString()
                    .padStart(2, "0")}`}
                  readOnly
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                종료 시간
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-gray-50"
                  value={`${workshop.endHour || 0}:${(workshop.endMinute || 0)
                    .toString()
                    .padStart(2, "0")}`}
                  readOnly
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">신청 인원</label>
            <div className="relative">
              <input
                type="number"
                className="w-full border rounded px-3 py-2 bg-gray-50"
                value={1}
                readOnly
              />
              <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              공방 예약은 1명 단위로 신청됩니다
            </div>
          </div>
        </div>

        {/* 결제 금액 카드 */}
        <div className="bg-white rounded-lg shadow-sm border mx-6 mb-4 p-5 flex items-center justify-between">
          <span className="text-gray-700 font-medium">수강료</span>
          <span className="text-green-600 font-bold text-lg">
            ₩{totalAmount.toLocaleString()}
          </span>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-2">{error}</div>
        )}

        {/* 결제하기 버튼 */}
        <div className="px-6 pb-6">
          <button
            onClick={handleReservation}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold text-base shadow"
            disabled={loading}
          >
            {loading ? "예약 중..." : "결제하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkshopReservationModal;
