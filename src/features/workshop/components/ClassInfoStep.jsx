import React from "react";

const ClassInfoStep = ({ form = {}, onChange, onBack, onNext }) => {
  const formatPrice = (value) => {
    if (!value) return "";
    const numeric = value.toString().replace(/[^\d]/g, "");
    return Number(numeric).toLocaleString();
  };

  const parseRawPrice = (value) => {
    return value.replace(/[^\d]/g, "");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (e, field, unit) => {
    const value = parseInt(e.target.value, 10);
    onChange((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [unit]: value,
      },
    }));
  };

  const isNextDisabled =
    !form.title?.trim() ||
    form.description?.length < 20 ||
    form.description?.length > 2000 ||
    !form.price ||
    !form.instructor ||
    !form.date ||
    !form.startTime?.hour ||
    !form.endTime?.hour ||
    form.startTime.minute === "" ||
    form.endTime.minute === "";

  return (
    <div className="space-y-6">
      {/* 제목 */}
      <div>
        <input
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          placeholder="클래스 제목"
          className="w-full border rounded px-4 py-3"
          maxLength={30}
        />
        <div className="text-right text-sm text-gray-400 mt-1">
          {(form.title || "").length}/30자
        </div>
      </div>

      {/* 설명 */}
      <div>
        <textarea
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="클래스 설명을 입력해 주세요."
          rows={6}
          className="w-full border rounded px-4 py-3"
        />
        <div className="text-right text-sm text-gray-400 mt-1">
          {(form.description || "").length}/최소 20자, 최대 2000자
        </div>
      </div>

      {/* 가격 */}
      <div>
        <input
          type="text"
          name="price"
          value={formatPrice(form.price)}
          onChange={(e) => {
            const raw = parseRawPrice(e.target.value);
            onChange((prev) => ({ ...prev, price: raw }));
          }}
          placeholder="클래스 가격"
          className="w-full border rounded px-4 py-3"
          inputMode="numeric"
        />
      </div>

      {/* 강사명 */}
      <div>
        <input
          name="instructor"
          value={form.instructor || ""}
          onChange={handleChange}
          placeholder="강사 이름"
          className="w-full border rounded px-4 py-3"
        />
      </div>

      {/* 날짜 */}
      <div>
        <input
          type="date"
          name="date"
          value={form.date || ""}
          onChange={handleChange}
          className="w-full border rounded px-4 py-3"
        />
      </div>

      {/* 시간 */}
      <div className="flex gap-4">
        {/* 시작시간 */}
        <div>
          <label className="block text-sm mb-1">시작 시간</label>
          <select
            value={form.startTime?.hour ?? ""}
            onChange={(e) => handleTimeChange(e, "startTime", "hour")}
            className="border rounded px-2 py-1"
          >
            <option value="">시</option>
            {[...Array(24)].map((_, i) => (
              <option key={i} value={i}>{i}시</option>
            ))}
          </select>
          <select
            value={form.startTime?.minute ?? ""}
            onChange={(e) => handleTimeChange(e, "startTime", "minute")}
            className="border rounded px-2 py-1 ml-2"
          >
            <option value="">분</option>
            {[...Array(60)].map((_, m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, "0")}분
              </option>
            ))}
          </select>
        </div>

        {/* 종료시간 */}
        <div>
          <label className="block text-sm mb-1">종료 시간</label>
          <select
            value={form.endTime?.hour ?? ""}
            onChange={(e) => handleTimeChange(e, "endTime", "hour")}
            className="border rounded px-2 py-1"
          >
            <option value="">시</option>
            {[...Array(24)].map((_, i) => (
              <option key={i} value={i}>{i}시</option>
            ))}
          </select>
          <select
            value={form.endTime?.minute ?? ""}
            onChange={(e) => handleTimeChange(e, "endTime", "minute")}
            className="border rounded px-2 py-1 ml-2"
          >
            <option value="">분</option>
            {[...Array(60)].map((_, m) => (
              <option key={m} value={m}>
                {m.toString().padStart(2, "0")}분
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          이전
        </button>

        <button
          onClick={onNext}
          disabled={isNextDisabled}
          className={`text-sm px-4 py-2 rounded ${
            isNextDisabled
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ClassInfoStep;
