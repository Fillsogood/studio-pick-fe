import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Smartphone,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { requestPayment } from "../lib/paymentAPI";

const PaymentModal = ({
  isOpen,
  onClose,
  reservation,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState(null);

  // 결제 요청 데이터 생성
  useEffect(() => {
    if (isOpen && reservation) {
      const data = {
        reservationId: reservation.id,
        amount: reservation.totalAmount,
        orderName: `${
          reservation.studio?.name || reservation.workshop?.title
        } 예약`,
        customerName: reservation.user?.name || "고객",
      };
      setPaymentData(data);
    }
  }, [isOpen, reservation]);

  // 결제 방법 옵션
  const paymentMethods = [
    {
      id: "card",
      name: "신용카드",
      icon: <CreditCard className="w-5 h-5" />,
      description: "모든 신용카드 결제 가능",
    },
    {
      id: "kakaopay",
      name: "카카오페이",
      icon: <Smartphone className="w-5 h-5" />,
      description: "카카오페이로 간편 결제",
    },
  ];

  // 결제 요청 처리
  const handlePaymentRequest = async () => {
    if (!paymentData) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await requestPayment(paymentData);

      if (response.data.success) {
        const { orderId, clientKey } = response.data.data;

        // 토스페이먼츠 결제창 호출
        await loadTossPayments(clientKey, orderId, paymentData.amount);
      } else {
        throw new Error(response.data.message || "결제 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("결제 요청 실패:", error);
      setError(error.message || "결제 요청 중 오류가 발생했습니다.");
      onPaymentError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 토스페이먼츠 스크립트 로드
  const loadTossPayments = (clientKey, orderId, amount) => {
    return new Promise((resolve, reject) => {
      // 이미 로드된 경우
      if (window.TossPayments) {
        initializeTossPayments(clientKey, orderId, amount, resolve, reject);
        return;
      }

      // 스크립트 로드
      const script = document.createElement("script");
      script.src = "https://js.tosspayments.com/v1/payment";
      script.onload = () => {
        initializeTossPayments(clientKey, orderId, amount, resolve, reject);
      };
      script.onerror = () => {
        reject(new Error("토스페이먼츠 스크립트 로드에 실패했습니다."));
      };
      document.head.appendChild(script);
    });
  };

  // 토스페이먼츠 초기화 및 결제창 호출
  const initializeTossPayments = (
    clientKey,
    orderId,
    amount,
    resolve,
    reject
  ) => {
    const tossPayments = window.TossPayments(clientKey);

    const paymentMethod =
      selectedPaymentMethod === "kakaopay" ? "카카오페이" : "카드";

    tossPayments
      .requestPayment(paymentMethod, {
        amount: amount,
        orderId: orderId,
        orderName: paymentData.orderName,
        customerName: paymentData.customerName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
      .then((result) => {
        // 결제 성공 처리
        handlePaymentSuccess(result);
        resolve(result);
      })
      .catch((error) => {
        // 결제 실패 처리
        handlePaymentFailure(error);
        reject(error);
      });
  };

  // 결제 성공 처리
  const handlePaymentSuccess = (result) => {
    console.log("결제 성공:", result);
    onPaymentSuccess?.(result);
    onClose();
  };

  // 결제 실패 처리
  const handlePaymentFailure = (error) => {
    console.error("결제 실패:", error);
    setError(error.message || "결제에 실패했습니다.");
    onPaymentError?.(error);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">결제하기</h2>
              <p className="text-sm text-gray-600 mt-1">
                안전한 결제 서비스를 이용해주세요
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

        {/* 예약 정보 요약 */}
        {reservation && (
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              예약 정보
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">예약 장소</span>
                <span className="font-medium">
                  {reservation.studio?.name || reservation.workshop?.title}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">예약 일시</span>
                <span className="font-medium">
                  {reservation.date} {reservation.startTime}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">참가 인원</span>
                <span className="font-medium">{reservation.peopleCount}명</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    결제 금액
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    ₩{reservation.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 결제 방법 선택 */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            결제 방법 선택
          </h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  selectedPaymentMethod === method.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center flex-1">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg mr-4">
                    {method.icon}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {method.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {method.description}
                    </div>
                  </div>
                </div>
                {selectedPaymentMethod === method.id && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
              </label>
            ))}
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="px-6 py-4 bg-red-50 border-b border-red-200">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-900">결제 오류</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* 결제 안내 */}
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
              ℹ
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">결제 안내</p>
              <ul className="text-xs text-blue-700 mt-1 space-y-1">
                <li>• 결제 완료 후 예약이 확정됩니다.</li>
                <li>• 결제 취소는 예약 취소 정책에 따라 처리됩니다.</li>
                <li>• 결제 관련 문의는 고객센터로 연락해주세요.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 결제 버튼 */}
        <div className="p-6">
          <button
            onClick={handlePaymentRequest}
            disabled={isLoading || !paymentData}
            className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                결제 처리 중...
              </>
            ) : (
              `₩${reservation?.totalAmount?.toLocaleString()} 결제하기`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
 