import React, { useState, useEffect } from "react";
import { X, AlertTriangle, ChevronDown, Info } from "lucide-react";
import { cancelReservation } from "../lib/reservationAPI";
import RefundPolicyModal from "./RefundPolicyModal";

const CancelReservationModal = ({
  isOpen,
  onClose,
  reservation,
  onCancelSuccess,
}) => {
  const [cancelReason, setCancelReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [estimatedRefund, setEstimatedRefund] = useState(null);
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);

  // 예상 환불 금액 계산
  useEffect(() => {
    if (isOpen && reservation) {
      const estimatedRefundData = calculateEstimatedRefund(reservation);
      setEstimatedRefund(estimatedRefundData);
    }
  }, [isOpen, reservation]);

  // 환불 계산 로직 (백엔드 정책 기반 - 통일된 정책)
  const calculateEstimatedRefund = (reservation, currentTime = new Date()) => {
    if (!reservation) return null;

    const reservationDateTime = new Date(
      reservation.date + "T" + reservation.startTime
    );
    const hoursUntilReservation =
      (reservationDateTime - currentTime) / (1000 * 60 * 60);

    // 과거 예약이거나 유효하지 않은 날짜인 경우
    if (hoursUntilReservation < 0 || isNaN(hoursUntilReservation)) {
      return {
        rate: 0,
        amount: 0,
        policy: "과거 예약 - 취소 불가",
        hoursUntil: 0,
        canCancel: false,
        originalAmount: reservation.totalAmount,
        cancellationFee: reservation.totalAmount,
      };
    }

    let refundRate = 0;
    let policyText = "";
    let canCancel = true;

    // 백엔드와 동일한 통일된 정책 적용 (스튜디오, 클래스 모두 동일)
    if (hoursUntilReservation >= 24) {
      // 24시간 전까지 - 전액환불
      refundRate = 100;
      policyText = "24시간 전 취소 - 전액환불";
    } else if (hoursUntilReservation >= 12) {
      // 12시간 전까지 - 50% 환불
      refundRate = 50;
      policyText = "12시간 전 취소 - 50% 환불";
    } else {
      // 12시간 이내 - 취소 불가
      refundRate = 0;
      policyText = "12시간 이내 - 취소 불가";
      canCancel = false;
    }

    const estimatedAmount = Math.floor(
      (reservation.totalAmount * refundRate) / 100
    );

    return {
      rate: refundRate,
      amount: estimatedAmount,
      policy: policyText,
      hoursUntil: Math.floor(hoursUntilReservation),
      canCancel,
      originalAmount: reservation.totalAmount,
      cancellationFee: reservation.totalAmount - estimatedAmount,
    };
  };

  const handleCancelConfirm = async () => {
    if (!cancelReason.trim()) {
      setError("취소 사유를 입력해주세요.");
      return;
    }

    // 취소가 불가능한 경우 체크
    if (estimatedRefund && !estimatedRefund.canCancel) {
      setError("예약 시작 12시간 이내에는 취소할 수 없습니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await cancelReservation(reservation.id, cancelReason);

      if (response.data?.success) {
        console.log(response.data?.success)
        console.log(response.data)
        onCancelSuccess(response.data);
        onClose();
      } else {
        setError(response.message || "취소 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("취소 요청 오류:", error);
      setError("취소 요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {reservation.type === "workshop" || reservation.workshopTitle
                  ? reservation.workshopTitle || reservation.studioName
                  : reservation.studioName}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {reservation.date} {reservation.startTime} -{" "}
                {reservation.endTime}
                {reservation.type === "workshop" && reservation.instructor && (
                  <span className="block text-xs text-gray-500 mt-1">
                    강사: {reservation.instructor}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 취소/환불 규정 안내 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              취소/환불 규정 안내
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRefundPolicy(true)}
                className="text-xs text-gray-500 hover:text-lime-600 transition-colors flex items-center gap-1 underline"
              >
                <Info className="w-3 h-3" />
                환불규정 보기
              </button>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* 수수료 경고 */}
          {estimatedRefund && estimatedRefund.rate < 100 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  ①
                </div>
                <div>
                  <p className="text-sm font-medium text-red-900">
                    지금 취소 시, 수수료가 부과됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 금액 Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">결제금액 합계</span>
              <span className="font-medium text-gray-900">
                {reservation.totalAmount.toLocaleString()}원
              </span>
            </div>

            {estimatedRefund && estimatedRefund.cancellationFee > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">차감 합계</span>
                <span className="font-medium text-red-600">
                  -{estimatedRefund.cancellationFee.toLocaleString()}원
                </span>
              </div>
            )}

            {estimatedRefund && estimatedRefund.cancellationFee > 0 && (
              <div className="flex justify-between items-center pl-4">
                <span className="text-sm text-gray-600">취소수수료</span>
                <span className="text-sm text-red-600">
                  -{estimatedRefund.cancellationFee.toLocaleString()}원
                </span>
              </div>
            )}

            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  환불금액
                </span>
                <span className="text-lg font-bold text-red-600">
                  {estimatedRefund
                    ? estimatedRefund.amount.toLocaleString()
                    : 0}
                  원
                </span>
              </div>
            </div>
          </div>

          {/* 환불 방법 안내 */}
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              취소 후 즉시 결제 수단으로 환불 처리됩니다.
            </p>
          </div>
        </div>

        {/* 취소 사유 입력 */}
        <div className="p-6 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            취소하시려는 사유를 입력해주세요
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="취소하시려는 사유를 입력해주세요"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows="3"
            maxLength="500"
            disabled={isLoading}
          />
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* 취소 불가 경고 */}
        {estimatedRefund && !estimatedRefund.canCancel && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900">
                  취소가 불가능한 예약입니다
                </p>
                <p className="text-xs text-red-700 mt-1">
                  예약 시작 12시간 이내에는 취소할 수 없습니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className="p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            아니오
          </button>
          <button
            onClick={() => handleCancelConfirm(cancelReason)}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              isLoading || (estimatedRefund && !estimatedRefund.canCancel)
            }
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                처리 중...
              </div>
            ) : estimatedRefund && !estimatedRefund.canCancel ? (
              "취소 불가"
            ) : (
              "예약 취소"
            )}
          </button>
        </div>
      </div>

      {/* 환불 정책 모달 */}
      <RefundPolicyModal
        isOpen={showRefundPolicy}
        onClose={() => setShowRefundPolicy(false)}
      />
    </div>
  );
};

export default CancelReservationModal;
