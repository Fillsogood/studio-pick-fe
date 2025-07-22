import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (success) {
      // 1.5초 후 예약 목록으로 자동 이동
      const timer = setTimeout(() => {
        navigate("/reservation");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  useEffect(() => {
    if (success) return; // 이미 성공이면 더 이상 실행하지 않음
    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");
    console.log(
      "[PaymentSuccessPage] paymentKey:",
      paymentKey,
      "orderId:",
      orderId,
      "amount:",
      amount
    );
    async function confirmWithRetry() {
      setError("");
      // 1초 대기
      await new Promise((r) => setTimeout(r, 1000));
      for (let i = 0; i < 3; i++) {
        try {
          console.log(`[PaymentSuccessPage] confirmPayment 시도 ${i + 1}`);
          const res = await confirmPayment({
            paymentKey,
            orderId,
            amount: Number(amount),
          });
          console.log("[PaymentSuccessPage] confirmPayment 응답:", res);
          if (res.data && res.data.success) {
            console.log("[PaymentSuccessPage] 결제 승인 성공!");
            setSuccess(true);
            setIsProcessing(false);
            return; // 성공 시 즉시 함수 종료!
          }
        } catch (err) {
          console.error(
            `[PaymentSuccessPage] confirmPayment 에러 (시도 ${i + 1}):`,
            err
          );
          await new Promise((r) => setTimeout(r, 500));
        }
      }
      // 마지막엔 예약 상태 재확인
      try {
        const reservationId = extractReservationIdFromOrderId(orderId);
        console.log(
          "[PaymentSuccessPage] 예약 상태 재확인, reservationId:",
          reservationId
        );
        if (!reservationId) throw new Error("예약 ID 추출 실패");
        const response = await getReservationDetail(reservationId);
        console.log(
          "[PaymentSuccessPage] getReservationDetail 응답:",
          response
        );
        if (response.data?.data?.status === "CONFIRMED") {
          console.log(
            "[PaymentSuccessPage] 예약 상태 CONFIRMED, 결제 성공 처리"
          );
          setSuccess(true);
          setIsProcessing(false);
          return; // 성공 시 즉시 함수 종료!
        } else {
          console.warn(
            "[PaymentSuccessPage] 예약 상태 CONFIRMED 아님:",
            response.data?.data?.status
          );
          setError("결제 승인에 실패했습니다. 잠시 후 다시 시도해주세요.");
        }
      } catch (err) {
        console.error("[PaymentSuccessPage] 예약 상태 재확인 에러:", err);
        setError("결제 승인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
      setIsProcessing(false);
    }
    if (paymentKey && orderId && amount) {
      confirmWithRetry();
    } else {
      setIsProcessing(false);
      setError("결제 정보가 올바르지 않습니다.");
      console.error("[PaymentSuccessPage] 결제 정보가 올바르지 않습니다.");
    }
  }, [searchParams, success]);

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <div className="mb-4 text-lg font-bold text-gray-700">
            결제 처리 중입니다...
          </div>
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
          <div className="mb-4 text-2xl font-bold text-green-600">
            결제 성공
          </div>
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
