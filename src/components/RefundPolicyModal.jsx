import React, { useState } from "react";
import { X, Info, AlertTriangle, Clock, Calendar } from "lucide-react";

const RefundPolicyModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("studio");

  if (!isOpen) return null;

  const studioRefundPolicy = [
    {
      period: "예약일 7일 전까지",
      refund: "100% 환불",
      description: "전액 환불 가능",
      color: "text-green-600",
    },
    {
      period: "예약일 3일 전까지",
      refund: "70% 환불",
      description: "30% 수수료 차감",
      color: "text-yellow-600",
    },
    {
      period: "예약일 1일 전까지",
      refund: "50% 환불",
      description: "50% 수수료 차감",
      color: "text-orange-600",
    },
    {
      period: "예약일 당일",
      refund: "환불 불가",
      description: "환불 불가능",
      color: "text-red-600",
    },
  ];

  const workshopRefundPolicy = [
    {
      period: "수업일 7일 전까지",
      refund: "100% 환불",
      description: "전액 환불 가능",
      color: "text-green-600",
    },
    {
      period: "수업일 3일 전까지",
      refund: "80% 환불",
      description: "20% 수수료 차감",
      color: "text-yellow-600",
    },
    {
      period: "수업일 1일 전까지",
      refund: "50% 환불",
      description: "50% 수수료 차감",
      color: "text-orange-600",
    },
    {
      period: "수업일 당일",
      refund: "환불 불가",
      description: "환불 불가능",
      color: "text-red-600",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden flex flex-col">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Info className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">환불 정책</h2>
                <p className="text-sm text-gray-600 mt-1">
                  예약 취소 시 적용되는 환불 정책입니다
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("studio")}
              className={`py-3 px-6 border-b-2 font-medium text-sm ${
                activeTab === "studio"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              스튜디오 예약
            </button>
            <button
              onClick={() => setActiveTab("workshop")}
              className={`py-3 px-6 border-b-2 font-medium text-sm ${
                activeTab === "workshop"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              공방 수업
            </button>
          </nav>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 환불 정책 테이블 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              {activeTab === "studio" ? "스튜디오" : "공방"} 환불 정책
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      취소 기간
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      환불 금액
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">
                      비고
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === "studio"
                    ? studioRefundPolicy
                    : workshopRefundPolicy
                  ).map((policy, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium">{policy.period}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${policy.color}`}>
                          {policy.refund}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {policy.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-2">주의사항</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• 환불은 결제 수단으로만 가능합니다.</li>
                  <li>• 환불 처리에는 3-5일이 소요될 수 있습니다.</li>
                  <li>
                    • 천재지변, 공방 사정으로 인한 취소는 전액 환불됩니다.
                  </li>
                  <li>• 환불 관련 문의는 고객센터로 연락해주세요.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 환불 절차 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">환불 절차</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    예약 취소 신청
                  </p>
                  <p className="text-xs text-blue-700">
                    예약 내역에서 취소 요청
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    환불 금액 확인
                  </p>
                  <p className="text-xs text-blue-700">
                    환불 정책에 따른 금액 계산
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">환불 처리</p>
                  <p className="text-xs text-blue-700">
                    3-5일 내 결제 수단으로 환불
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="bg-white p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicyModal;
