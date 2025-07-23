// src/features/host/ClassEditPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getClassDetail, updateClass } from "../../lib/hostAPI";

const FormField = ({ label, children, helper }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
    {children}
    {helper && <p className="text-right text-xs text-gray-400">{helper}</p>}
  </div>
);

export default function ClassEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    instructor: "",
    date: "",
    startTime: { hour: 0, minute: 0, second: 0, nano: 0 },
    endTime:   { hour: 0, minute: 0, second: 0, nano: 0 },
    address: "",
    thumbnailUrl: "",
    imageUrls: []
  });

  // Fetch existing data
  useEffect(() => {
    getClassDetail(id)
      .then(res => {
        const w = res.data.data;
        setForm({
          title: w.title,
          description: w.description,
          price: w.price,
          instructor: w.instructor,
          date: w.date,
          startTime: { hour: w.startHour, minute: w.startMinute, second:0, nano:0 },
          endTime:   { hour: w.endHour,   minute: w.endMinute,   second:0, nano:0 },
          address: w.address,
          thumbnailUrl: w.thumbnailUrl,
          imageUrls: w.imageUrls
        });
      })
      .catch(err => {
        console.error(err);
        alert("상세 조회에 실패했습니다.");
      });
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  const handleTimeChange = (e, field, unit) => {
    const val = parseInt(e.target.value, 10) || 0;
    setForm(prev => ({
      ...prev,
      [field]: { ...prev[field], [unit]: val }
    }));
  };

  const isNextDisabled =
    !form.title?.trim() ||
    form.description.length < 20 ||
    form.description.length > 2000 ||
    !form.price ||
    !form.instructor ||
    !form.date ||
    form.startTime.hour == null ||
    form.endTime.hour == null;

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updateClass(id, form);
      alert("수정이 완료되었습니다.");
      navigate("/host/classes");
    } catch (err) {
      console.error(err);
      alert("수정에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">클래스 정보 수정</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormField label="제목" helper={`${form.title.length}/30자`}>
          <input
            name="title"
            maxLength={30}
            value={form.title}
            onChange={handleChange}
            placeholder="클래스 제목"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </FormField>

        <FormField label="설명" helper={`${form.description.length}/최소 20자, 최대 2000자`}>
          <textarea
            name="description"
            rows={5}
            value={form.description}
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
            value={form.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            onChange={e => {
              const raw = e.target.value.replace(/[^\d]/g, "");
              setForm(prev => ({ ...prev, price: raw }));
            }}
            placeholder="가격"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </FormField>

        <FormField label="강사 이름">
          <input
            name="instructor"
            value={form.instructor}
            onChange={handleChange}
            placeholder="강사 이름"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </FormField>

        <FormField label="날짜">
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-6">
          <FormField label="시작 시간">
            <div className="flex space-x-2">
              <select
                value={form.startTime.hour}
                onChange={e => handleTimeChange(e, "startTime", "hour")}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">시</option>
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>{i}시</option>
                ))}
              </select>
              <select
                value={form.startTime.minute}
                onChange={e => handleTimeChange(e, "startTime", "minute")}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">분</option>
                {[...Array(60)].map((_, m) => (
                  <option key={m} value={m}>{String(m).padStart(2, "0")}분</option>
                ))}
              </select>
            </div>
          </FormField>

          <FormField label="종료 시간">
            <div className="flex space-x-2">
              <select
                value={form.endTime.hour}
                onChange={e => handleTimeChange(e, "endTime", "hour")}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">시</option>
                {[...Array(24)].map((_, i) => (
                  <option key={i} value={i}>{i}시</option>
                ))}
              </select>
              <select
                value={form.endTime.minute}
                onChange={e => handleTimeChange(e, "endTime", "minute")}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">분</option>
                {[...Array(60)].map((_, m) => (
                  <option key={m} value={m}>{String(m).padStart(2, "0")}분</option>
                ))}
              </select>
            </div>
          </FormField>
        </div>

        <FormField label="주소">
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="주소를 입력하세요"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </FormField>

        <div className="flex justify-between pt-6">
          <button
            onClick={() => navigate(-1)}
            type="button"
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isNextDisabled}
            className={`px-6 py-2 rounded-md font-medium ${
              isNextDisabled
                ? "bg-gray-300 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
