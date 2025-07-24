import { useEffect, useState } from "react";
import KakaoMap from "../../components/KakaoMap";
import {
  getStudioDetail,
  updateStudio,
  uploadImages,
} from "../../lib/studioAPI";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone"; // 추가

import {
  Wifi,
  Tv,
  ParkingCircle,
  Utensils,
  Mic,
  LayoutGrid,
  Plug,
  Bath,
  ShowerHead,
  DoorOpen,
  Cigarette,
  PawPrint,
} from "lucide-react";

const facilityOptions = [
  { label: "와이파이", icon: <Wifi />, value: "와이파이" },
  { label: "TV/프로젝터", icon: <Tv />, value: "TV/프로젝터" },
  { label: "주차 가능", icon: <ParkingCircle />, value: "주차 가능" },
  { label: "음식물 반입 가능", icon: <Utensils />, value: "음식물 반입 가능" },
  { label: "음향/마이크", icon: <Mic />, value: "음향/마이크" },
  { label: "의자/테이블", icon: <LayoutGrid />, value: "의자/테이블" },
  { label: "전기", icon: <Plug />, value: "전기" },
  { label: "내부 화장실", icon: <Bath />, value: "내부 화장실" },
  { label: "온수", icon: <ShowerHead />, value: "온수" },
  { label: "탈의실", icon: <DoorOpen />, value: "탈의실" },
  { label: "흡연 가능", icon: <Cigarette />, value: "흡연 가능" },
  {
    label: "반려동물 동반 가능",
    icon: <PawPrint />,
    value: "반려동물 동반 가능",
  },
];

export default function StudioSetupPage() {
  const { studioId } = useParams();
  const navigate = useNavigate();
  const [studio, setStudio] = useState(null);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [newNotice, setNewNotice] = useState("");
  const [notices, setNotices] = useState([]);
  const { setValue } = useForm();
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [phone, setPhone] = useState("");
  const [thumbnailError, setThumbnailError] = useState("");
  const [studioImagesError, setStudioImagesError] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [location, setLocation] = useState("");

  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  // 대표 이미지 드롭존
  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setThumbnailError(
          "JPG, PNG 파일만 첨부 가능하며 5MB 이하만 가능합니다."
        );
        setThumbnailPreview(null);
        setThumbnailImage(null);
        return;
      }
      const file = acceptedFiles[0];
      setThumbnailPreview(URL.createObjectURL(file));
      setThumbnailImage(file); // ✅ 파일 객체 저장
    },
  });

  // 갤러리 이미지 드롭존
  const {
    getRootProps: getGalleryRootProps,
    getInputProps: getGalleryInputProps,
  } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setStudioImagesError(
          "JPG, PNG 파일만 첨부 가능하며 10MB 이하, 최대 5장까지 업로드 가능합니다."
        );
        setGalleryPreviews([]);
        setGalleryFiles([]); // ✅ 초기화
        return;
      }
      const previews = acceptedFiles.map((file) => URL.createObjectURL(file));
      setGalleryPreviews(previews);
      setGalleryFiles(acceptedFiles); // ✅ 파일만 저장
    },
  });

  // 이미지 삭제 핸들러
  const removeGalleryImage = (idx) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
  };
  const removeThumbnail = () => {
    setThumbnailPreview("");
    setThumbnailFile(null);
  };

  // DB에서 불러온 이미지 세팅
  useEffect(() => {
    if (studio) {
      setThumbnailPreview(studio.thumbnailImage || "");
      setGalleryPreviews(studio.imageUrls || []);
    }
  }, [studio]);

  const weekdayOptions = [
    { label: "월", value: "mon" },
    { label: "화", value: "tue" },
    { label: "수", value: "wed" },
    { label: "목", value: "thu" },
    { label: "금", value: "fri" },
    { label: "토", value: "sat" },
    { label: "일", value: "sun" },
  ];

  // 연락처 포맷팅
  const formatPhone = (value) => {
    const numbersOnly = value.replace(/\D/g, "");

    if (numbersOnly.startsWith("02")) {
      // 서울 지역번호 (02) -> 10자리
      if (numbersOnly.length < 3) return numbersOnly;
      if (numbersOnly.length < 6)
        return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(2)}`;
      if (numbersOnly.length < 10)
        return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(
          2,
          5
        )}-${numbersOnly.slice(5)}`;
      return `${numbersOnly.slice(0, 2)}-${numbersOnly.slice(
        2,
        6
      )}-${numbersOnly.slice(6, 10)}`;
    } else {
      // 휴대폰 또는 기타 지역번호
      if (numbersOnly.length < 4) return numbersOnly;
      if (numbersOnly.length < 7)
        return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
      if (numbersOnly.length < 11)
        return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
          3,
          6
        )}-${numbersOnly.slice(6)}`;
      return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
        3,
        7
      )}-${numbersOnly.slice(7, 11)}`;
    }
  };

  const handleChange = (e) => {
    setPhone(formatPhone(e.target.value));
  };

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
      setNotices((res.data.data.rules || "").split("\n"));
      setSelectedFacilities(
        (res.data.data.facilities || "").split(",").map((s) => s.trim())
      );
      setLocation(res.data.data.location || "");
      console.log("location", res.data.data.location);
    };
    fetchStudio();
  }, [studioId, setValue]);

  useEffect(() => {
    if (studio?.phone) {
      setPhone(studio.phone);
      setValue("phone", studio.phone);
    }
  }, [studio, setValue]);

  const handleAddNotice = () => {
    if (newNotice && notices.length < 10) {
      setNotices([...notices, newNotice]);
      setNewNotice("");
    }
  };

  const handleToggleFacility = (facility) => {
    if (selectedFacilities.includes(facility)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== facility));
    } else {
      setSelectedFacilities([...selectedFacilities, facility]);
    }
  };

  const handleActivate = async () => {
    try {
      let thumbnailUrl = studio.thumbnailImage || "";
      let uploadedImageUrls = studio.imageUrls || [];

      // 썸네일 업로드
      if (thumbnailFile instanceof File) {
        const formData = new FormData();
        formData.append("images", thumbnailFile);
        const res = await uploadImages(formData);
        thumbnailUrl = res.data.data[0]; // 첫 번째 이미지
      }

      // 갤러리 이미지 업로드
      if (galleryFiles.length > 0 && galleryFiles[0] instanceof File) {
        const formData = new FormData();
        galleryFiles.forEach((file) => formData.append("images", file));
        const res = await uploadImages(formData);
        uploadedImageUrls = res.data.data;
      }

      const payload = {
        name: studio.name,
        description: studio.description,
        phone: studio.phone,
        location: location,
        size: studio.size,
        hourlyBaseRate: studio.hourlyBaseRate,
        weekendPrice: studio.weekendPrice,
        perPersonRate: studio.perPersonRate,
        maxPeople: studio.maxPeople,
        thumbnailImage: thumbnailUrl,
        images: uploadedImageUrls,
        rules: notices.join("\n"),
        facilities: selectedFacilities.join(", "),
        status: "ACTIVE",
        operatingHours: selectedWeekdays.map((day) => ({
          weekday: day.toUpperCase(), // 예: "MON"
          openTime,
          closeTime,
        })),
      };

      await updateStudio(studioId, payload);
      alert("완료되었습니다!");
      navigate("/host/studios");
    } catch (error) {
      console.error("❌ 개설 오류:", error);
      alert("스튜디오 개설 중 오류가 발생했습니다.");
    }
  };

  const generateHourOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      options.push(String(i).padStart(2, "0")); // "00", "01", ..., "23"
    }
    return options;
  };

  if (!studio) return <div>로딩중...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      <h2 className="text-2xl font-bold mb-4">스튜디오 개설</h2>

      <div className="mb-4">
        <label className="font-semibold">이름</label>
        <input className="w-full border p-2 rounded" value={studio.name} />
      </div>

      <div className="mb-4">
        <label className="font-semibold">위치</label>
        <input
          className="w-full border p-2 rounded mb-2"
          value={location}
          readOnly
        />
        <KakaoMap
          location={location}
          onAddressSelected={(addr) => {
            setLocation(addr);
            setValue("location", addr);
          }}
        />
      </div>

      <div className="mb-4">
        <label className="font-semibold">설명</label>
        <textarea
          className="w-full border p-2 rounded h-32"
          defaultValue={studio.description || ""}
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="font-semibold">연락처</label>
        <input
          className="w-full border p-2 rounded"
          type="tel"
          inputMode="numeric"
          value={phone}
          maxLength={13}
          onChange={handleChange}
        />
      </div>

      {/* 기본 요금 */}
      <div className="mb-4">
        <label className="font-semibold">시간당 요금</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={studio.hourlyBaseRate ?? ""}
          onChange={(e) =>
            setStudio((prev) => ({
              ...prev,
              hourlyBaseRate: Number(e.target.value),
            }))
          }
        />
      </div>

      {/* 주말 요금 */}
      <div className="mb-4">
        <label className="font-semibold">주말 요금</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={studio.weekendPrice ?? ""}
          onChange={(e) =>
            setStudio((prev) => ({
              ...prev,
              weekendPrice: Number(e.target.value),
            }))
          }
        />
      </div>

      {/* 인당 요금 */}
      <div className="mb-4">
        <label className="font-semibold">인원당 추가 요금</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={studio.perPersonRate ?? ""}
          onChange={(e) =>
            setStudio((prev) => ({
              ...prev,
              perPersonRate: Number(e.target.value),
            }))
          }
        />
      </div>

      {/* 최대 인원 */}
      <div className="mb-4">
        <label className="font-semibold">최대 인원</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={studio.maxPeople ?? ""}
          onChange={(e) =>
            setStudio((prev) => ({
              ...prev,
              maxPeople: Number(e.target.value),
            }))
          }
        />
      </div>

      {/* 공간 크기 */}
      <div className="mb-4">
        <label className="font-semibold">공간 크기 (평)</label>
        <input
          type="number"
          className="w-full border p-2 rounded"
          value={studio.size ?? ""}
          onChange={(e) =>
            setStudio((prev) => ({ ...prev, size: Number(e.target.value) }))
          }
        />
      </div>

      <div className="mb-6">
        <label className="font-semibold block mb-2">운영 요일</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {weekdayOptions.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => {
                setSelectedWeekdays((prev) =>
                  prev.includes(day.value)
                    ? prev.filter((d) => d !== day.value)
                    : [...prev, day.value]
                );
              }}
              className={`px-4 py-2 rounded-full border text-sm ${
                selectedWeekdays.includes(day.value)
                  ? "bg-WarmBeige-300 text-black border-WarmBeige-200"
                  : "bg-white hover:bg-gray-100 border-gray-300"
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <label className="font-medium">운영 시간:</label>
          <select
            value={openTime}
            onChange={(e) => setOpenTime(e.target.value)}
            className="border p-2 rounded"
          >
            {generateHourOptions().map((hour) => (
              <option key={hour} value={`${hour}:00`}>
                {hour}:00
              </option>
            ))}
          </select>
          <span>~</span>
          <select
            value={closeTime}
            onChange={(e) => setCloseTime(e.target.value)}
            className="border p-2 rounded"
          >
            {generateHourOptions().map((hour) => (
              <option key={hour} value={`${hour}:00`}>
                {hour}:00
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 대표 이미지 */}
      <div className="mb-8">
        <label className="font-semibold text-lg">대표이미지</label>
        <div className="text-gray-600 mb-2">
          스튜디오의 대표 이미지를 선택해주세요 (최대 5MB)
        </div>
        <div className="flex items-center gap-4">
          <div
            {...getThumbnailRootProps()}
            className="flex-1 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-WarmBeige-200 transition"
          >
            <input {...getThumbnailInputProps()} />
            {thumbnailPreview ? (
              <div className="relative inline-block group">
                <img
                  src={thumbnailPreview}
                  alt="대표 미리보기"
                  className="w-40 h-28 object-cover mb-2 rounded"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  style={{ transform: "translate(50%,-50%)" }}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <span className="text-4xl mb-2">＋</span>
                <span>클릭하여 파일 선택 또는 여기로 파일을 드래그하세요</span>
                <span className="text-xs mt-1">JPG, PNG 파일 (최대 5MB)</span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="bg-WarmBeige-300 hover:bg-WarmBeige-200 text-black px-6 py-4 rounded-lg ml-2"
          >
            파일첨부
          </button>
        </div>
      </div>

      {/* 갤러리 이미지 */}
      <div className="mb-8">
        <label className="font-semibold text-lg">이미지</label>
        <div className="text-gray-600 mb-2">
          2048 × 1158 권장, 한 장당 최대 3MB(최대 5장)
        </div>
        <div className="flex items-center gap-4">
          <div
            {...getGalleryRootProps()}
            className="flex-1 border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-WarmBeige-200 transition"
          >
            <input {...getGalleryInputProps()} />
            {galleryPreviews.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {galleryPreviews.map((url, idx) => (
                  <div key={idx} className="relative group inline-block">
                    <img
                      src={url}
                      alt={`img-${idx}`}
                      className="w-32 h-24 object-cover border rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      style={{ transform: "translate(50%,-50%)" }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <span className="text-4xl mb-2">＋</span>
                <span>클릭하여 파일 선택 또는 여기로 파일을 드래그하세요</span>
                <span className="text-xs mt-1">
                  JPG, PNG 파일 (최대 10MB, 최대 5장)
                </span>
              </div>
            )}
          </div>
          <button
            type="button"
            className="bg-WarmBeige-300 hover:bg-WarmBeige-200 text-black px-6 py-4 rounded-lg ml-2"
          >
            파일첨부
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="font-semibold block mb-2">편의시설</label>
        <div className="grid grid-cols-4 gap-4">
          {facilityOptions.map((item) => (
            <button
              key={item.value}
              onClick={() => handleToggleFacility(item.value)}
              className={`border p-2 rounded flex items-center gap-2 justify-center text-sm ${
                selectedFacilities.includes(item.value)
                  ? "bg-WarmBeige-300 text-black"
                  : "bg-white"
              }`}
              type="button"
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="font-semibold block mb-2">예약시 주의사항</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            className="border rounded p-2 flex-grow"
            value={newNotice}
            onChange={(e) => setNewNotice(e.target.value)}
            maxLength={100}
            placeholder="최대 10개까지 작성가능합니다."
          />
          <button
            onClick={handleAddNotice}
            className="bg-WarmBeige-300 text-black px-4 rounded"
            type="button"
          >
            추가
          </button>
        </div>
        <ul className="list-decimal ml-4 text-sm text-gray-700">
          {notices.map((n, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between pr-2 group"
            >
              <span className="mr-2 font-bold">{idx + 1}.</span>
              <span className="flex-1">{n}</span>
              <button
                type="button"
                onClick={() => setNotices(notices.filter((_, i) => i !== idx))}
                className="ml-2 text-gray-400 hover:text-red-500 font-bold text-lg opacity-60 group-hover:opacity-100 transition-colors"
                aria-label="주의사항 삭제"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end mt-8">
        {console.log("현재 스튜디오 상태:", studio?.status)} {/* 추가 */}
        <button
          onClick={handleActivate}
          type="submit"
          className="bg-WarmBeige-300 text-black border border-WarmBeige-200 px-6 py-3 rounded hover:bg-WarmBeige-200 transition-colors font-medium"
        >
          {studio?.status === "ACTIVE" ? "완료" : "완료"}
        </button>
      </div>
    </div>
  );
}
