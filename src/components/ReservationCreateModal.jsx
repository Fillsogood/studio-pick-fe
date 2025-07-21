import React, { useState } from "react";
import { MapPin, Phone, Users, Clock, Calendar } from "lucide-react";

const ReservationCreateModal = ({
  isOpen,
  onClose,
  studio,
  onReservationSuccess,
}) => {
  const [reservationDate, setReservationDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;
  const maxPeople = studio?.maxPeople || 20;

  // 결제 금액 계산
  const calcTotalAmount = () => {
    if (!startTime || !endTime || !peopleCount) return 0;
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    let hours = endH - startH + (endM - startM) / 60;
    if (hours <= 0) return 0;
    const base = studio.hourlyBaseRate || 0;
    const perPerson = studio.perPersonRate || 0;
    let total = base * hours;
    if (peopleCount > 1) total += perPerson * (peopleCount - 1);
    return Math.round(total);
  };
  const totalAmount = calcTotalAmount();

  const handleReservation = async () => {
    setLoading(true);
    setError("");
    try {
      const parseTime = (t) => {
        const [hour, minute] = t.split(":").map(Number);
        return { hour, minute, second: 0, nano: 0 };
      };
      const payload = {
        studioId: studio.id,
        reservationDate,
        startTime: parseTime(startTime),
        endTime: parseTime(endTime),
        peopleCount,
      };
      const res = await fetch("/api/reservations", {
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
          <h2 className="text-lg font-bold text-gray-900">예약 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl"
          >
            ×
          </button>
        </div>
        {/* 스튜디오 정보 카드 */}
        <div className="bg-white rounded-lg shadow-sm border mx-6 mt-6 mb-4 p-5 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            {studio.thumbnailImage && (
              <img
                src={studio.thumbnailImage}
                alt="스튜디오 썸네일"
                className="w-16 h-16 rounded-lg object-cover border"
              />
            )}
            <div className="flex-1">
              <div className="text-base font-bold text-gray-900 mb-1">
                {studio.name}
              </div>
              <div className="flex items-center text-gray-500 text-sm gap-1 mb-1">
                <MapPin className="w-4 h-4 mr-1" />
                {studio.location}
              </div>
              {studio.phone && (
                <div className="flex items-center text-gray-500 text-sm gap-1">
                  <Phone className="w-4 h-4 mr-1" />
                  {studio.phone}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1 mt-2 text-sm text-gray-700">
            <div>
              <span className="font-medium">시간당 요금</span>: ₩
              {studio.hourlyBaseRate?.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">인원당 추가</span>: ₩
              {studio.perPersonRate?.toLocaleString()}
            </div>
            <div>
              <span className="font-medium">최대 인원</span>: {maxPeople}명
            </div>
          </div>
        </div>
        {/* 예약 입력 카드 */}
        <div className="bg-white rounded-lg shadow-sm border mx-6 mb-4 p-5 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">날짜</label>
            <div className="relative">
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={reservationDate}
                onChange={(e) => setReservationDate(e.target.value)}
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
                  type="time"
                  className="w-full border rounded px-3 py-2"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
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
                  type="time"
                  className="w-full border rounded px-3 py-2"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">인원</label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={maxPeople}
                className="w-full border rounded px-3 py-2"
                value={peopleCount}
                onChange={(e) => setPeopleCount(Number(e.target.value))}
              />
              <Users className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <div className="text-xs text-gray-500 mt-1">최대 {maxPeople}명</div>
          </div>
        </div>
        {/* 결제 금액 카드 */}
        <div className="bg-white rounded-lg shadow-sm border mx-6 mb-4 p-5 flex items-center justify-between">
          <span className="text-gray-700 font-medium">결제 금액</span>
          <span className="text-green-600 font-bold text-lg">
            ₩{totalAmount.toLocaleString()}
          </span>
        </div>
        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-500 text-sm text-center mb-2">{error}</div>
        )}
        {/* 예약하기 버튼 */}
        <div className="px-6 pb-6">
          <button
            onClick={handleReservation}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold text-base shadow"
            disabled={loading}
          >
            {loading ? "예약 중..." : "예약하기"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationCreateModal;
