// 예약 상태 Enum (백엔드와 동일하게 관리)
export const RESERVATION_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCEL_REQUESTED: "cancel_requested",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
  REFUNDED: "refunded",
};

// 상태별 한글 텍스트
export const getStatusText = (status) => {
  const statusMap = {
    [RESERVATION_STATUS.PENDING]: "대기중",
    [RESERVATION_STATUS.CONFIRMED]: "확정",
    [RESERVATION_STATUS.CANCEL_REQUESTED]: "취소 요청됨",
    [RESERVATION_STATUS.CANCELLED]: "취소",
    [RESERVATION_STATUS.COMPLETED]: "완료",
    [RESERVATION_STATUS.REFUNDED]: "환불 완료",
  };
  return statusMap[status] || status;
};

// 상태별 색상 클래스
export const getStatusColor = (status) => {
  const colorMap = {
    [RESERVATION_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
    [RESERVATION_STATUS.CONFIRMED]: "bg-green-100 text-green-800",
    [RESERVATION_STATUS.CANCEL_REQUESTED]: "bg-orange-100 text-orange-800",
    [RESERVATION_STATUS.CANCELLED]: "bg-red-100 text-red-800",
    [RESERVATION_STATUS.COMPLETED]: "bg-blue-100 text-blue-800",
    [RESERVATION_STATUS.REFUNDED]: "bg-gray-100 text-gray-800",
  };
  return colorMap[status] || "bg-gray-100 text-gray-800";
};

// 상태별 액션 버튼 타입
export const getActionButtonType = (status) => {
  const actionMap = {
    [RESERVATION_STATUS.PENDING]: "cancel", // 취소 요청
    [RESERVATION_STATUS.CONFIRMED]: "cancel", // 취소 요청
    [RESERVATION_STATUS.CANCEL_REQUESTED]: null, // 액션 버튼 없음 (처리 중)
    [RESERVATION_STATUS.COMPLETED]: "review", // 리뷰 작성
    [RESERVATION_STATUS.CANCELLED]: "rebook", // 다시 예약
    [RESERVATION_STATUS.REFUNDED]: "rebook", // 다시 예약
  };
  return actionMap[status] || null;
};
