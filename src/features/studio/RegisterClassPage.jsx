import { useState } from "react";
import { registerClass } from "@/lib/classAPI";
import { useNavigate } from "react-router-dom";

const RegisterClassPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    date: "",
    instructor: "",
    address: "",
    startTime: "10:00:00", // LocalTime 형식 문자열
    endTime: "12:00:00",
    thumbnailUrl: "",
    imageUrls: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerClass(form);
      alert("클래스 신청이 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("에러 응답:", error.response?.data || error);
      alert("신청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">클래스 등록 신청</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium mb-1">제목 *</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">설명 *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded h-32"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">가격 (원) *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">날짜 *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium mb-1">시작 시간 *</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">종료 시간 *</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">강사명 *</label>
          <input
            type="text"
            name="instructor"
            value={form.instructor}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">주소 *</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* 썸네일 및 이미지 업로드는 추후 추가 */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            등록 신청하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterClassPage;
