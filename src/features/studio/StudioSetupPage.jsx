import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getStudioDetail, updateStudio } from "../../lib/studioAPI";

export default function StudioSetupPage() {
  const { studioId } = useParams();
  const navigate = useNavigate();
  const [studio, setStudio] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchStudio = async () => {
      const res = await getStudioDetail(studioId);
      setStudio(res.data.data);
      const fields = [
        "name",
        "description",
        "phone",
        "size",
        "thumbnailImage",
        "location",
        "hourlyBaseRate",
        "weekendPrice",
        "perPersonRate",
        "maxPeople",
        "rules",
        "facilities",
      ];
      fields.forEach((field) => setValue(field, res.data.data[field]));
      setPreviewImage(res.data.data.thumbnailImage);
    };
    fetchStudio();
  }, [studioId, setValue]);

  const onSubmit = async (data) => {
    await updateStudio(studioId, data);
    navigate("/account/studios");
  };

  if (!studio) return <div>로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">스튜디오 개설</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="font-medium">스튜디오 이름</label>
          <input
            {...register("name", { required: "이름은 필수입니다." })}
            className="w-full p-3 border rounded-lg"
            placeholder="스튜디오 이름"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium">설명</label>
          <textarea
            {...register("description", { required: "설명은 필수입니다." })}
            className="w-full p-3 border rounded-lg h-40"
            placeholder="스튜디오 설명"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium">전화번호</label>
          <input
            {...register("phone", {
              required: "전화번호는 필수입니다.",
              pattern: {
                value: /^\d{3}-\d{4}-\d{4}$/,
                message: "전화번호 형식은 000-0000-0000 입니다.",
              },
            })}
            onChange={(e) => {
              const formatted = e.target.value
                .replace(/[^0-9]/g, "")
                .replace(/^(\d{3})(\d{0,4})(\d{0,4})$/, (_, a, b, c) =>
                  [a, b, c].filter(Boolean).join("-")
                );
              setValue("phone", formatted);
            }}
            className="w-full p-3 border rounded-lg"
            placeholder="000-0000-0000"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="font-medium">주소</label>
          <input
            value={studio.location}
            readOnly
            className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label className="font-medium">크기</label>
          <input
            {...register("size")}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="font-medium">기본 요금 (시급)</label>
          <input
            type="number"
            {...register("hourlyBaseRate")}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="font-medium">주말 요금</label>
          <input
            type="number"
            {...register("weekendPrice")}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="font-medium">인당 요금</label>
          <input
            type="number"
            {...register("perPersonRate")}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="font-medium">최대 인원</label>
          <input
            type="number"
            {...register("maxPeople")}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="font-medium">주의사항</label>
          <textarea
            {...register("rules")}
            className="w-full p-3 border rounded-lg h-32"
          />
        </div>

        <div>
          <label className="font-medium">편의시설</label>
          <textarea
            {...register("facilities")}
            className="w-full p-3 border rounded-lg h-32"
          />
        </div>

        <div>
          <label className="font-medium">대표 이미지</label>
          <input
            type="text"
            {...register("thumbnailImage")}
            className="w-full p-3 border rounded-lg"
            placeholder="이미지 URL"
          />
          {previewImage && (
            <img
              src={previewImage}
              alt="미리보기"
              className="w-48 mt-2 rounded-lg"
            />
          )}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-lime-300 hover:bg-lime-200 text-black font-semibold rounded-xl"
          >
            개설하기
          </button>
        </div>
      </form>
    </div>
  );
}
