import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Home, Receipt } from "lucide-react";
import { confirmPayment } from "../lib/paymentAPI";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // URL 파라미터에서 결제 정보 추출
        const paymentKey = searchParams.get("paymentKey");
        const orderId = searchParams.get("orderId");
        const amount = searchParams.get("amount");

        if (!paymentKey || !orderId || !amount) {
          throw new Error("결제 정보가 올바르지 않습니다.");
        }

        // 백엔드에 결제 승인 요청
        const response = await confirmPayment({
          paymentKey,
          orderId,
          amount: parseInt(amount),
        });

        if (response.data.success) {
          setPaymentInfo(response.data.data);
        } else {
          throw new Error(response.data.message || "결제 승인에 실패했습니다.");
        }
      } catch (error) {
        console.error("결제 처리 실패:", error);
        setError(error.message || "결제 처리 중 오류가 발생했습니다.");
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams]);

  const handleGoToReservations = () => {
    navigate("/reservation");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            결제 처리 중
          </h2>
          <p className="text-gray-600">잠시만 기다려주세요...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-800 mb-2">결제 실패</h2>
            <p className="text-red-700 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={handleGoToReservations}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                예약 목록으로 이동
              </button>
              <button
                onClick={handleGoToHome}
                className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                홈으로 이동
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* 성공 아이콘 */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 완료!</h1>
          <p className="text-gray-600 mb-8">
            예약이 성공적으로 완료되었습니다.
          </p>

          {/* 결제 정보 */}
          {paymentInfo && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                결제 정보
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">주문번호</span>
                  <span className="font-medium">{paymentInfo.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제금액</span>
                  <span className="font-medium text-green-600">
                    ₩{paymentInfo.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제방법</span>
                  <span className="font-medium">
                    {paymentInfo.method === "카카오페이"
                      ? "카카오페이"
                      : "신용카드"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제시간</span>
                  <span className="font-medium">
                    {paymentInfo.approvedAt
                      ? new Date(paymentInfo.approvedAt).toLocaleString()
                      : new Date().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              예약 확인 및 관리는 <strong>예약 내역</strong>에서 확인하실 수
              있습니다.
            </p>
          </div>

          {/* 버튼 */}
          <div className="space-y-3">
            <button
              onClick={handleGoToReservations}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              예약 내역 보기
            </button>
            <button
              onClick={handleGoToHome}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              홈으로 이동
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
