import React from "react";

const PaymentFailPage = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
      <div className="mb-4 text-2xl font-bold text-red-600">결제 실패</div>
      <div className="mb-2 text-gray-700">
        결제에 실패했습니다. 다시 시도해 주세요.
      </div>
      <a
        href="/"
        className="mt-4 px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold inline-block"
      >
        홈으로 이동
      </a>
    </div>
  </div>
);

export default PaymentFailPage;
