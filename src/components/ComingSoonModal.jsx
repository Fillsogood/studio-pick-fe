// src/components/ComingSoonModal.jsx
import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const ComingSoonModal = ({ onClose }) => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl shadow-2xl px-8 py-6 w-[320px] text-center">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        {/* 내용 */}
        <p className="text-lg font-semibold text-gray-800 mb-5">
          해당 기능은 준비중입니다.
        </p>

        <button
          onClick={onClose}
          className="mt-2 w-full py-2 rounded-md bg-WarmBeige-500 hover:bg-WarmBeige-600 text-white font-medium transition"
        >
          확인
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ComingSoonModal;
