import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getReservationDetail,
  cancelReservation,
} from "../../lib/reservationAPI";
import {
  getStatusText,
  getStatusColor,
  getActionButtonType,
  RESERVATION_STATUS,
} from "../../constants/reservationStatus";
import CancelReservationModal from "../../components/CancelReservationModal";

const ReservationDetailPage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // 예약 상세 정보 조회
  useEffect(() => {
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
        setError(
          error.message || "예약 정보를 불러오는 중 오류가 발생했습니다."
        );

        // 401 에러인 경우 로그인 페이지로 이동
        if (error.response && error.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (reservationId) {
      fetchReservationDetail();
    }
  }, [reservationId, navigate]);

  // 취소 요청 처리
  const handleCancelReservation = () => {
    setShowCancelModal(true);
  };

  // 취소 확인 처리
  const handleCancelConfirm = async (cancelReason) => {
    setIsCancelling(true);

    try {
      const response = await cancelReservation(reservation.id, cancelReason);

      if (response.data.success) {
        // 예약 상태 업데이트
        setReservation((prev) => ({
          ...prev,
          status: "cancel_requested",
        }));

        setShowCancelModal(false);
        alert("취소 요청이 완료되었습니다.");
      } else {
        throw new Error(response.data.message || "취소 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("취소 요청 실패:", error);
      alert(error.message || "취소 요청 중 오류가 발생했습니다.");
    } finally {
      setIsCancelling(false);
    }
  };

  // 리뷰 작성 처리
  const handleWriteReview = () => {
    // TODO: 리뷰 작성 페이지로 이동
    alert("리뷰 작성 기능은 준비 중입니다.");
  };

  // 다시 예약하기 처리
  const handleRebook = () => {
    // TODO: 스튜디오 상세 페이지로 이동
    alert("다시 예약 기능은 준비 중입니다.");
  };

  // 액션 버튼 렌더링
  const renderActionButtons = () => {
    if (!reservation) return null;

    const buttons = [];
    const actionType = getActionButtonType(reservation.status);

    switch (actionType) {
      case "cancel":
        buttons.push(
          <button
            key="cancel"
            onClick={handleCancelReservation}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-base font-medium transition-colors"
          >
            취소 요청
          </button>
        );
        break;

      case "review":
        buttons.push(
          <button
            key="review"
            onClick={handleWriteReview}
            className="bg-lime-300 hover:bg-lime-200 text-black px-6 py-3 rounded-lg text-base font-medium transition-colors"
          >
            리뷰 작성
          </button>
        );
        break;

      case "rebook":
        buttons.push(
          <button
            key="rebook"
            onClick={handleRebook}
            className="bg-lime-300 hover:bg-lime-200 text-black px-6 py-3 rounded-lg text-base font-medium transition-colors"
          >
            다시 예약하기
          </button>
        );
        break;
    }

    return buttons;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
          <p className="text-gray-500 text-lg mt-4">
            예약 정보를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
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
            <Link
              to="/reservations"
              className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-base font-medium transition-colors"
            >
              예약 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">예약 정보를 찾을 수 없습니다.</p>
          <Link
            to="/reservations"
            className="inline-block bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-base font-medium transition-colors mt-4"
          >
            예약 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* 취소 모달 */}
      <CancelReservationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelConfirm}
        reservation={reservation}
        isLoading={isCancelling}
      />

      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              to="/reservations"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">예약 상세 정보</h1>
          </div>
        </div>

        {/* 예약 정보 카드 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {/* 이미지 섹션 */}
          <div className="h-64 bg-gray-200 relative">
            {reservation.studioImageUrl ? (
              <img
                src={reservation.studioImageUrl}
                alt={reservation.studioName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            {/* 상태 배지 */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                  reservation.status
                )}`}
              >
                {getStatusText(reservation.status)}
              </span>
            </div>
          </div>

          {/* 정보 섹션 */}
          <div className="p-8">
            {/* 제목 */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {reservation.type === "workshop"
                  ? reservation.workshopTitle || reservation.studioName
                  : reservation.studioName}
              </h2>
              {reservation.type === "workshop" && reservation.instructor && (
                <p className="text-gray-600">강사: {reservation.instructor}</p>
              )}
            </div>

            {/* 예약 정보 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    예약 정보
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">예약일:</span>
                      <span className="font-medium">{reservation.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">이용 시간:</span>
                      <span className="font-medium">
                        {reservation.startTime} - {reservation.endTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">장소:</span>
                      <span className="font-medium">
                        {reservation.studioName}
                      </span>
                    </div>
                    {reservation.type === "workshop" && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">참가 인원:</span>
                        <span className="font-medium">
                          {reservation.participants}명
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    결제 정보
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">결제 금액:</span>
                      <span className="font-bold text-lg">
                        ₩{reservation.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">예약 번호:</span>
                      <span className="font-medium">{reservation.id}</span>
                    </div>
                    {reservation.paymentStatus && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">결제 상태:</span>
                        <span className="font-medium">
                          {reservation.paymentStatus}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 추가 정보 */}
            {reservation.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  예약 상세
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {reservation.description}
                </p>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              {renderActionButtons()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailPage;
