import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";

const PaymentFailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL 파라미터에서 실패 정보 추출
  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  const getErrorMessage = () => {
    if (message) return message;

    switch (code) {
      case "PAY_PROCESS_CANCELED":
        return "결제가 취소되었습니다.";
      case "PAY_PROCESS_ABORTED":
        return "결제가 중단되었습니다.";
      case "INVALID_CARD":
        return "유효하지 않은 카드입니다.";
      case "INSUFFICIENT_FUNDS":
        return "잔액이 부족합니다.";
      case "CARD_EXPIRED":
        return "만료된 카드입니다.";
      default:
        return "결제 처리 중 오류가 발생했습니다.";
    }
  };

  const handleRetry = () => {
    // 이전 페이지로 돌아가서 다시 시도
    window.history.back();
  };

  const handleGoToReservations = () => {
    navigate("/reservations");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* 실패 아이콘 */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 실패</h1>
          <p className="text-gray-600 mb-8">{getErrorMessage()}</p>

          {/* 주문 정보 */}
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">주문 정보</h3>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호</span>
                  <span className="font-medium">{orderId}</span>
                </div>
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              결제에 실패했지만 예약은 유지됩니다. 다시 시도하거나 다른 결제
              방법을 선택해주세요.
            </p>
          </div>

          {/* 버튼 */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              다시 시도
            </button>
            <button
              onClick={handleGoToReservations}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              예약 목록으로
            </button>
            <button
              onClick={handleGoToHome}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              홈으로 이동
            </button>
          </div>

          {/* 도움말 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">도움이 필요하신가요?</p>
            <p className="text-xs text-gray-500">
              고객센터: 1588-0000 (평일 09:00-18:00)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;
