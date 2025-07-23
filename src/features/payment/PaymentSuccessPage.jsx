import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPayment } from "../../lib/paymentAPI";
import { getReservationDetail } from "../../lib/reservationAPI";

const extractReservationIdFromOrderId = (orderId) => {
  if (!orderId) return null;
  const parts = orderId.split("_");
  const last = parts[parts.length - 1];
  const num = parseInt(last.replace(/\D/g, ""), 10);
  return isNaN(num) ? null : num;
};

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 한 번만 결제 승인 로직을 실행하기 위한 ref
  const hasConfirmedRef = useRef(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/reservation");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  useEffect(() => {
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    const confirmOnce = async () => {
      // 이미 호출된 경우 스킵
      if (hasConfirmedRef.current) return;
      hasConfirmedRef.current = true;

      setError("");

      if (!paymentKey || !orderId || !amount) {
        setIsProcessing(false);
        setError("결제 정보가 올바르지 않습니다.");
        console.error("[PaymentSuccessPage] 결제 정보 누락");
        return;
      }

      try {
        console.log("[PaymentSuccessPage] confirmPayment 호출");
        await confirmPayment({
          paymentKey,
          orderId,
          amount: Number(amount),
        });

        setSuccess(true);
        setIsProcessing(false);
        return;

      } catch (err) {
        console.error("[PaymentSuccessPage] confirmPayment 에러:", err);

        // 이미 완료된 결제인 경우에도 성공으로 처리
        if (
          err.response?.status === 409 ||
          err.response?.data?.message?.includes("이미 완료된 결제입니다")
        ) {
          setSuccess(true);
          setIsProcessing(false);
          return;
        }

        // fallback: 예약 상태 확인
        try {
          const reservationId = extractReservationIdFromOrderId(orderId);
          if (!reservationId) throw new Error("예약 ID 추출 실패");

          const response = await getReservationDetail(reservationId);
          const status = response.data?.data?.status;

          if (status === "CONFIRMED") {
            setSuccess(true);
            setIsProcessing(false);
            return;
          }

          throw new Error("예약 상태 CONFIRMED 아님");

        } catch (fallbackErr) {
          console.error("[PaymentSuccessPage] 예약 상태 확인 실패:", fallbackErr);
          setError("결제 승인에 실패했습니다. 잠시 후 다시 시도해주세요.");
          setIsProcessing(false);
        }
      }
    };

    confirmOnce();
  }, [searchParams]);

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-4 text-lg font-bold text-gray-700">결제 처리 중입니다...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <div className="text-gray-500 text-sm">잠시만 기다려주세요.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-4 text-2xl font-bold text-red-600">결제 실패</div>
          <div className="mb-2 text-gray-700">{error}</div>
          <a
            href="/"
            className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold inline-block"
          >
            홈으로 이동
          </a>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-4 text-2xl font-bold text-green-600">결제 성공</div>
          <div className="mb-2 text-gray-700">
            예약이 확정되었습니다! 예약 목록으로 이동합니다...
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccessPage;
