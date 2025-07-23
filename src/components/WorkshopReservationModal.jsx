import React, { useState } from "react";
import { MapPin, Users, Clock, Calendar, User } from "lucide-react";
import PaymentModal from "./PaymentModal";
import axiosInstance from "../lib/axiosInstance";
import { useAuth } from "../hooks/useAuth";

const WorkshopReservationModal = ({
  isOpen,
  onClose,
  workshop,
  onReservationSuccess,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [createdReservation, setCreatedReservation] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleReservation = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        studioId: null,
        workshopId: workshop.id,
        userId: user?.id,
        reservationDate: workshop.date,
        startTime: workshop.startTime,
        endTime: workshop.endTime,
        peopleCount: 1,
      };
      const response = await axiosInstance.post(
        "/api/reservations/workshop",
        payload
      );
      const data = response.data;
      if (!data.success) throw new Error(data.message || "예약 실패");
      setCreatedReservation(data.data);
      console.log("예약 응답:", data.data);  // ✅ 여기 확인
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowPaymentModal(true);
      }, 1000);
    } catch (e) {
      setError(e.response?.data?.message || e.message || "예약 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (result) => {
    setShowPaymentModal(false);
    onReservationSuccess?.(result);
    onClose();
  };

  const handlePaymentError = (error) => {
    setShowPaymentModal(false);
    onClose();
  };

  if (!isOpen) return null;

  // 시간 파싱 유틸
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: "00", minute: "00" };
    const [hour, minute] = timeStr.split(":");
    return {
      hour: hour.padStart(2, "0"),
      minute: minute.padStart(2, "0"),
    };
  };

  const { hour: startHour, minute: startMinute } = parseTime(workshop.startTime);
  const { hour: endHour, minute: endMinute } = parseTime(workshop.endTime);

  return (
    <>
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

          {/* 예약 완료 안내 */}
          {showSuccess ? (
            <div className="p-6 text-center">
              <div className="text-green-600 text-2xl font-bold mb-2">
                공방 예약이 완료되었습니다!
              </div>
              <div className="text-gray-600 text-sm">곧 결제창이 열립니다...</div>
            </div>
          ) : (
            <>
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
                    <span className="font-medium">수업 일정</span>:{" "}
                    {workshop.date} {startHour}:{startMinute} ~ {endHour}:{endMinute}
                  </div>
                </div>
              </div>

              {/* 예약 입력 */}
              <div className="bg-white rounded-lg shadow-sm border mx-6 mb-4 p-5 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    수업 날짜
                  </label>
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
                        value={`${startHour}:${startMinute}`}
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
                        value={`${endHour}:${endMinute}`}
                        readOnly
                      />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    신청 인원
                  </label>
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

              {/* 결제 요약 */}
              <div className="bg-white rounded-lg shadow-sm border mx-6 mb-4 p-5 flex items-center justify-between">
                <span className="text-gray-700 font-medium">수강료</span>
                <span className="text-green-600 font-bold text-lg">
                  ₩{workshop.price?.toLocaleString()}
                </span>
              </div>

              {/* 에러 및 버튼 */}
              {error && (
                <div className="text-red-500 text-sm text-center mb-2">
                  {error}
                </div>
              )}
              <div className="px-6 pb-6">
                <button
                  onClick={handleReservation}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold text-base shadow"
                  disabled={loading}
                >
                  {loading ? "예약 중..." : "예약하기"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {showPaymentModal && createdReservation && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          reservation={createdReservation}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
        />
      )}
    </>
  );
};

export default WorkshopReservationModal;
