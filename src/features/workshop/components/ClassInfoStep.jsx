import React from "react";

const FormField = ({ label, helper, children }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    {children}
    {helper && <p className="text-right text-xs text-gray-400">{helper}</p>}
  </div>
);

const ClassInfoStep = ({ form = {}, onChange, onBack, onNext }) => {
  const formatPrice = v => v ? Number(v.replace(/[^\d]/g, "")).toLocaleString() : "";
  const parseRawPrice = v => v.replace(/[^\d]/g, "");

  const handleChange = e => {
    const { name, value } = e.target;
    onChange(prev => ({ ...prev, [name]: value }));
  };
  const handleTimeChange = (e, field, unit) => {
    const val = parseInt(e.target.value, 10) || 0;
    onChange(prev => ({ ...prev, [field]: { ...prev[field], [unit]: val } }));
  };

  const isNextDisabled =
    !form.title?.trim() ||
    form.description?.length < 20 ||
    form.description?.length > 2000 ||
    !form.price ||
    !form.instructor ||
    !form.date ||
    form.startTime?.hour == null ||
    form.endTime?.hour == null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">클래스 정보 입력</h2>

      <FormField label="제목" helper={`${(form.title||"").length}/30자`}>
        <input
          name="title"
          maxLength={30}
          value={form.title||""}
          onChange={handleChange}
          placeholder="클래스 제목을 입력하세요"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </FormField>

      <FormField label="설명" helper={`${(form.description||"").length}/최소 20자, 최대 2000자`}>
        <textarea
          name="description"
          rows={5}
          value={form.description||""}
          onChange={handleChange}
          placeholder="클래스 설명을 입력해주세요"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </FormField>

      <FormField label="가격(원)">
        <input
          type="text"
          name="price"
          inputMode="numeric"
          value={formatPrice(form.price||"")}
          onChange={e => {
            const raw = parseRawPrice(e.target.value);
            onChange(prev => ({ ...prev, price: raw }));
          }}
          placeholder="숫자만 입력"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </FormField>

      <FormField label="강사 이름">
        <input
          name="instructor"
          value={form.instructor||""}
          onChange={handleChange}
          placeholder="강사 이름"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </FormField>

      <FormField label="날짜">
        <input
          type="date"
          name="date"
          value={form.date||""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </FormField>

      <div className="grid grid-cols-2 gap-6">
        <FormField label="시작 시간">
          <div className="flex space-x-2">
            <select
              value={form.startTime?.hour ?? ""}
              onChange={e => handleTimeChange(e, "startTime", "hour")}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">시</option>
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={i}>{i}시</option>
              ))}
            </select>
            <select
              value={form.startTime?.minute ?? ""}
              onChange={e => handleTimeChange(e, "startTime", "minute")}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">분</option>
              {Array.from({ length: 60 }).map((_, m) => (
                <option key={m} value={m}>{String(m).padStart(2, "0")}분</option>
              ))}
            </select>
          </div>
        </FormField>

        <FormField label="종료 시간">
          <div className="flex space-x-2">
            <select
              value={form.endTime?.hour ?? ""}
              onChange={e => handleTimeChange(e, "endTime", "hour")}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">시</option>
              {Array.from({ length: 24 }).map((_, i) => (
                <option key={i} value={i}>{i}시</option>
              ))}
            </select>
            <select
              value={form.endTime?.minute ?? ""}
              onChange={e => handleTimeChange(e, "endTime", "minute")}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">분</option>
              {Array.from({ length: 60 }).map((_, m) => (
                <option key={m} value={m}>{String(m).padStart(2, "0")}분</option>
              ))}
            </select>
          </div>
        </FormField>
      </div>

      <div className="flex justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          이전
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`px-6 py-2 rounded-md font-medium ${
            isNextDisabled
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ClassInfoStep;
