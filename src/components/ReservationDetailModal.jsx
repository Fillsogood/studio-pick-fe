import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Phone,
  Clock,
  Users,
  Calendar,
  ChevronUp,
  ChevronDown,
  User,
} from "lucide-react";
import { getReservationDetail } from "../lib/reservationAPI";
import {
  getStatusText,
  getStatusColor,
  getActionButtonType,
} from "../constants/reservationStatus";

const ReservationDetailModal = ({
  isOpen,
  onClose,
  reservationId,
  onCancelSuccess,
}) => {
  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    orderInfo: true,
    venueInfo: true,
    reservationInfo: true,
    statusInfo: true,
  });

  // 예약 상세 정보 조회
  useEffect(() => {
    if (isOpen && reservationId) {
      fetchReservationDetail();
    }
  }, [isOpen, reservationId]);

  const fetchReservationDetail = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getReservationDetail(reservationId);

      if (response.data.success) {
        setReservation(response.data.data);
      } else {
        throw new Error(
          response.data.message || "예약 정보를 불러올 수 없습니다."
        );
      }
    } catch (error) {
      console.error("예약 상세 조회 실패:", error);
      setError(error.message || "예약 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 시간 포맷팅
  const formatTime = (timeObj) => {
    if (
      !timeObj ||
      typeof timeObj.hour === "undefined" ||
      typeof timeObj.minute === "undefined"
    ) {
      return "";
    }
    const { hour, minute } = timeObj;

    // 숫자가 아닌 경우 0으로 처리
    const hourNum = parseInt(hour) || 0;
    const minuteNum = parseInt(minute) || 0;

    return `${hourNum.toString().padStart(2, "0")}:${minuteNum
      .toString()
      .padStart(2, "0")}`;
  };

  // 날짜 포맷팅
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
    return `${year}. ${month}. ${day} (${dayOfWeek})`;
  };

  // 시간 포맷팅 (시간:분)
  const formatTimeOnly = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // 섹션 토글
  const toggleSection = (sectionName) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  // 예약 타입 확인
  const isWorkshop = reservation?.type === "workshop";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-md mx-auto max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="bg-white p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {isWorkshop ? "공방 예약 상세정보" : "예약 상세정보"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              예약번호 {reservationId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
              <p className="text-gray-500 text-lg mt-4">
                예약 정보를 불러오는 중...
              </p>
            </div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <svg
                className="w-12 h-12 text-red-400 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-bold text-red-800 mb-2">오류 발생</h2>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={fetchReservationDetail}
                className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-base font-medium transition-colors"
              >
                다시 시도
              </button>
            </div>
          </div>
        )}

        {/* 예약 정보 */}
        {reservation && !isLoading && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* 예약 정보 섹션 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div
                className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("orderInfo")}
              >
                <h3 className="text-base font-semibold text-gray-900">
                  예약정보
                </h3>
                {expandedSections.orderInfo ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              {expandedSections.orderInfo && (
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">예약일시</span>
                    <span className="font-medium">
                      {formatDate(reservation.reservationDate)}{" "}
                      {formatTime(reservation.startTime)}~
                      {formatTime(reservation.endTime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">예약 생성</span>
                    <span className="font-medium">
                      {formatDate(reservation.createdAt)}{" "}
                      {formatTimeOnly(reservation.createdAt)}
                    </span>
                  </div>
                  {reservation.updatedAt &&
                    reservation.updatedAt !== reservation.createdAt && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">최종 수정</span>
                        <span className="font-medium">
                          {formatDate(reservation.updatedAt)}{" "}
                          {formatTimeOnly(reservation.updatedAt)}
                        </span>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* 스튜디오/공방 정보 섹션 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div
                className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("venueInfo")}
              >
                <h3 className="text-base font-semibold text-gray-900 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-lime-600" />
                  {isWorkshop ? "공방 정보" : "스튜디오 정보"}
                </h3>
                {expandedSections.venueInfo ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              {expandedSections.venueInfo && (
                <div className="p-4 space-y-3">
                  {isWorkshop ? (
                    // 공방 정보
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">공방명</span>
                        <span className="font-medium">
                          {reservation.workshop.title}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">강사</span>
                        <span className="font-medium flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {reservation.workshop.instructor}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">위치</span>
                        <span className="font-medium">
                          {reservation.workshop.address}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">공방 일정</span>
                        <span className="font-medium">
                          {formatDate(reservation.workshop.date)}{" "}
                          {formatTime(reservation.workshop.startTime)}~
                          {formatTime(reservation.workshop.endTime)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">수강료</span>
                        <span className="font-medium">
                          ₩{reservation.workshop.price?.toLocaleString()}
                        </span>
                      </div>
                    </>
                  ) : (
                    // 스튜디오 정보
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">스튜디오명</span>
                        <span className="font-medium">
                          {reservation.studio.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">연락처</span>
                        <span className="font-medium flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {reservation.studio.phone}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">위치</span>
                        <span className="font-medium">
                          {reservation.studio.location}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">시간당 요금</span>
                        <span className="font-medium">
                          ₩{reservation.studio.hourlyBaseRate?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">인원당 추가 요금</span>
                        <span className="font-medium">
                          ₩{reservation.studio.perPersonRate?.toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* 예약 상세 섹션 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div
                className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("reservationInfo")}
              >
                <h3 className="text-base font-semibold text-gray-900 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                  예약 상세
                </h3>
                {expandedSections.reservationInfo ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              {expandedSections.reservationInfo && (
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">이용 시간</span>
                    <span className="font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(reservation.startTime)} -{" "}
                      {formatTime(reservation.endTime)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">참가 인원</span>
                    <span className="font-medium flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {reservation.peopleCount}명
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">결제 금액</span>
                    <span className="font-bold text-lg text-green-600">
                      ₩{reservation.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 예약 상태 섹션 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div
                className="p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("statusInfo")}
              >
                <h3 className="text-base font-semibold text-gray-900">
                  예약 상태
                </h3>
                {expandedSections.statusInfo ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              {expandedSections.statusInfo && (
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">상태</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                  {reservation.cancelReason && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">취소 사유</span>
                      <span className="font-medium text-red-600 text-right max-w-[200px]">
                        {reservation.cancelReason}
                      </span>
                    </div>
                  )}
                  {reservation.cancelledAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">취소 시간</span>
                      <span className="font-medium">
                        {formatDate(reservation.cancelledAt)}{" "}
                        {formatTimeOnly(reservation.cancelledAt)}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex gap-3">
            {/* 완료 상태일 때만 리뷰 작성 버튼 표시 */}
            {reservation?.status === "COMPLETED" && (
              <button
                onClick={() => {
                  onClose();
                  // 리뷰 작성 페이지로 이동
                  window.location.href = `/review/write/${reservationId}`;
                }}
                className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                리뷰 남기기
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailModal;
