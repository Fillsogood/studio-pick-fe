import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { requestPayment } from "../lib/paymentAPI";

const paymentMethods = [
  {
    id: "toss",
    name: "토스페이",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#0064FF" />
        <path
          d="M7.5 13.5C7.5 11.0147 9.51472 9 12 9C14.4853 9 16.5 11.0147 16.5 13.5C16.5 15.9853 14.4853 18 12 18C9.51472 18 7.5 15.9853 7.5 13.5Z"
          fill="white"
        />
      </svg>
    ),
    description: "토스페이로 간편 결제",
    enabled: true,
  },
  {
    id: "kakaopay",
    name: "카카오페이",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#FEE500" />
        <ellipse cx="12" cy="12" rx="7" ry="5" fill="#3C1E1E" />
      </svg>
    ),
    description: "카카오페이 (준비중)",
    enabled: false,
  },
  {
    id: "naverpay",
    name: "네이버페이",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="12" fill="#03C75A" />
        <path d="M9 8H11L13 12V8H15V16H13L11 12V16H9V8Z" fill="white" />
      </svg>
    ),
    description: "네이버페이 (준비중)",
    enabled: false,
  },
];

// 예약 상태 한글 변환
const statusToKorean = (status) => {
  switch (status) {
    case "PENDING":
      return "대기중";
    case "CONFIRMED":
      return "확정";
    case "CANCEL_REQUESTED":
      return "취소 요청됨";
    case "CANCELLED":
      return "취소됨";
    case "COMPLETED":
      return "완료됨";
    case "REFUNDED":
      return "환불됨";
    default:
      return status;
  }
};

const PaymentModal = ({
  isOpen,
  onClose,
  reservation,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("toss");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState(null);

  // 결제 요청 데이터 생성
  useEffect(() => {
    if (isOpen && reservation) {
      const data = {
        reservationId: reservation.id,
        amount: reservation.totalAmount,
        orderName:
          reservation.instructor ||
          reservation.studio?.name ||
          reservation.workshop?.title ||
          "주문명 없음",
        customerName: reservation.user?.name || "고객",
        customerEmail: reservation.user?.email || "customer@example.com",
      };
      setPaymentData(data);
    }
  }, [isOpen, reservation]);

  // 결제 요청 처리
  const handlePaymentRequest = async () => {
    if (!paymentData) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await requestPayment(paymentData);
      if (response.data.success) {
        const { orderId, clientKey } = response.data.data;
        console.log("[TOSS] clientKey from backend:", clientKey); // clientKey 값 확인
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
      if (window.TossPayments) {
        initializeTossPayments(clientKey, orderId, amount, resolve, reject);
        return;
      }
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
    tossPayments
      .requestPayment("카드", {
        amount: amount,
        orderId: orderId,
        orderName: paymentData.orderName,
        customerName: paymentData.customerName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
      .then((result) => {
        handlePaymentSuccess(result);
        resolve(result);
      })
      .catch((error) => {
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
        {/* 상단: 예약 정보 및 결제 정보 */}
        <div className="p-6 border-b border-gray-200">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900">결제하기</h2>
            <p className="text-sm text-gray-600 mt-1">
              안전한 결제 서비스를 이용해주세요
            </p>
          </div>
          {reservation && (
            <div className="mb-4 text-sm text-gray-800 space-y-1">
              <div>
                예약번호: <b>{reservation.id}</b>
              </div>
              {reservation.date && reservation.startTime && (
                <div>
                  예약일시:{" "}
                  <b>
                    {reservation.date} {reservation.startTime}
                  </b>
                </div>
              )}
              {reservation.status && (
                <div>
                  상태: <b>{statusToKorean(reservation.status)}</b>
                </div>
              )}
              {reservation.instructor && (
                <div>
                  강사명: <b>{reservation.instructor}</b>
                </div>
              )}
              {(reservation.studio?.name || reservation.workshop?.title) && (
                <div>
                  예약 장소:{" "}
                  <b>
                    {reservation.studio?.name || reservation.workshop?.title}
                  </b>
                </div>
              )}
              {reservation.peopleCount !== undefined &&
                reservation.peopleCount !== null && (
                  <div>
                    참가 인원: <b>{reservation.peopleCount}명</b>
                  </div>
                )}
              {/* 결제금액은 항상 강조해서 표시 */}
              <div className="mt-2 text-2xl font-extrabold text-green-600">
                결제금액: ₩{reservation.totalAmount?.toLocaleString() || "0"}
              </div>
              {reservation.instructor && (
                <div>
                  주문이름: <b>{reservation.instructor}</b>
                </div>
              )}
              {reservation.user?.name && reservation.user?.email && (
                <div>
                  예약자: <b>{reservation.user.name}</b> (
                  {reservation.user.email})
                </div>
              )}
            </div>
          )}
        </div>

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
                } ${!method.enabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedPaymentMethod === method.id}
                  onChange={() =>
                    method.enabled && setSelectedPaymentMethod(method.id)
                  }
                  className="sr-only"
                  disabled={!method.enabled}
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
            disabled={
              isLoading || !paymentData || selectedPaymentMethod !== "toss"
            }
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
