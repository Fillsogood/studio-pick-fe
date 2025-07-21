import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudioDetail } from "../../lib/studioAPI";
import ImageSlider from "../../components/ImageSlider";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

export default function StudioDetailPage() {
  const { studioId } = useParams();
  const navigate = useNavigate();
  const [studio, setStudio] = useState(null);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const isFavorite = studio && favorites.includes(studio.id);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await getStudioDetail(studioId);
        setStudio(res.data.data);
      } catch (err) {
        console.error("스튜디오 상세정보 오류:", err);
        setError("스튜디오 정보를 불러오는데 실패했습니다.");
      }
    };
    fetchStudio();
  }, [studioId]);

  const weekdayOptions = [
    { label: "월", value: "mon" },
    { label: "화", value: "tue" },
    { label: "수", value: "wed" },
    { label: "목", value: "thu" },
    { label: "금", value: "fri" },
    { label: "토", value: "sat" },
    { label: "일", value: "sun" },
  ];

  const handleFavoriteClick = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("즐겨찾기를 하시려면 로그인이 필요합니다.");
      return;
    }
    navigate("/favorites");
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!studio) return <div>로딩 중...</div>;

  const facilities = studio.facilities ? studio.facilities.split(",") : [];
  const rules = studio.rules ? studio.rules.split("\n") : [];

  return (
    <div className="p-8 max-w-screen-xl mx-auto relative">
      <div className="md:flex md:gap-8">
        {/* 왼쪽 메인 */}
        <div className="md:flex-1">
          {/* 이미지 슬라이더 */}
          <ImageSlider
            images={[studio.thumbnailImage, ...(studio.imageUrls || [])]}
          />

          {/* 제목/위치 */}
          <h2 className="text-3xl font-bold mt-4">{studio.name}</h2>
          <p className="text-gray-500 mb-4">{studio.location}</p>

          {/* 설명 */}
          <h3 className="text-xl font-semibold mt-6 mb-2">소개</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {studio.description}
          </p>

          {/* 편의시설 */}
          <h3 className="text-xl font-semibold mt-6 mb-2">편의시설</h3>
          <ul className="grid grid-cols-2 gap-2 text-gray-700">
            {facilities.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <FaCheckCircle className="text-lime-400" />
                {item.trim()}
              </li>
            ))}
          </ul>

          {/* 주의사항 */}
          <h3 className="text-xl font-semibold mt-6 mb-2">주의사항</h3>
          <ul className="list-disc ml-6 text-gray-700">
            {rules.map((item, idx) => (
              <li key={idx}>{item.trim()}</li>
            ))}
          </ul>

          {/* 위치 */}
          <h3 className="text-xl font-semibold mt-6 mb-2">위치</h3>
          <p className="text-gray-700">{studio.location}</p>

          {/* 운영자 */}
          <h3 className="text-xl font-semibold mt-6 mb-2">운영자</h3>
          <p className="text-gray-700">
            {studio.instructorName || "정보 없음"}
          </p>
        </div>

        {/* 오른쪽 요약 박스 */}
        <div className="hidden md:block md:w-80 shrink-0">
          <div className="bg-white border shadow-md p-4 sticky top-20 rounded-lg">
            <h3 className="text-xl font-bold">{studio.name}</h3>
            <p className="text-gray-500 text-sm">{studio.location}</p>

            <div className="mt-4 space-y-1 text-sm text-gray-700">
              <p>
                <strong>요금:</strong> {studio.hourlyBaseRate?.toLocaleString()}
                원 / 시간
              </p>
              <p>
                <strong>주말:</strong> {studio.weekendPrice?.toLocaleString()}원
              </p>
              <p>
                <strong>인원:</strong> 최대 {studio.maxPeople}명
              </p>
              {studio.operatingHours?.length > 0 && (
                <div className="mt-4">
                  {/* 운영 요일 */}
                  <h3 className="text-lg font-semibold mb-1">운영 요일</h3>
                  <p className="text-gray-700">
                    {studio.operatingHours
                      .map(
                        (op) =>
                          weekdayOptions.find(
                            (w) => w.value === op.weekday.toLowerCase()
                          )?.label || op.weekday
                      )
                      .join(", ")}
                  </p>

                  {/* 운영 시간 */}
                  <h3 className="text-lg font-semibold mt-4 mb-1">운영 시간</h3>
                  <p className="text-gray-700">
                    {studio.operatingHours[0].openTime} ~{" "}
                    {studio.operatingHours[0].closeTime}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleFavoriteClick}
                className="flex items-center space-x-1 text-red-500"
              >
                {isFavorite ? (
                  <AiFillHeart size={24} />
                ) : (
                  <AiOutlineHeart size={24} />
                )}
              </button>
              <button className="bg-lime-300 hover:bg-lime-200 text-black px-4 py-2 rounded-lg">
                예약하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
