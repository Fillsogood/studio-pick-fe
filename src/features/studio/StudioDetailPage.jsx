import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudioDetail } from "../../lib/studioAPI";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationTriangle, FaHeart } from "react-icons/fa";

export default function StudioDetailPage() {
  const { studioId } = useParams();
  const [studio, setStudio] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const isFavorite = studio && favorites.includes(studio.id);
  const handleReservation = () => {
    alert("예약 기능은 아직 준비 중이에요");
  };
  const handlePayment = () => {
    alert("결제 기능은 아직 준비 중이에요");
  };

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await getStudioDetail(studioId);
        console.log("✅ 스튜디오 상세정보 백엔드 응답:", res);
        console.log("✅ 응답의 data:", res.data);
        console.log("✅ 응답의 data.data:", res.data.data);
        setStudio(res.data.data);
      } catch (err) {
        console.error("스튜디오 상세정보 오류:", err);
        setError("스튜디오 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchStudio();
  }, [studioId]);

  const handleFavoriteClick = (studioId) => {
    console.log("studioId", studioId);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("즐겨찾기를 하시려면 로그인이 필요합니다.");
      return;
    }

    navigate("/favorites");
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!studio) return <div>로딩 중...</div>;

  return (
    <div className="p-8 max-w-screen-xl mx-auto relative">
      <div className="md:flex md:gap-6">
        {/* 왼쪽 메인 영역 */}
        <div className="md:flex-1">
          {/* 이미지 */}
          <img
            src={studio.thumbnailImage}
            alt="스튜디오 썸네일"
            className="w-full rounded-xl object-cover max-h-[400px] mb-4"
          />

          {/* 제목 및 위치 */}
          <h2 className="text-3xl font-bold mb-1">{studio.name}</h2>
          <p className="text-gray-500 mb-4">{studio.location}</p>

          {/* 설명 */}
          <h3 className="text-lg font-semibold mt-4 mb-2">소개</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {studio.description}
          </p>

          {/* 시설 안내 */}
          <h3 className="text-lg font-semibold mt-6 mb-2">시설 안내</h3>
          <ul className="text-gray-700">
            {studio.facilities?.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 mb-1">
                <FaCheckCircle className="text-green-500" />
                {item}
              </li>
            ))}
          </ul>

          {/* 주의사항 */}
          <h3 className="text-lg font-semibold mt-6 mb-2">주의사항</h3>
          <ul className="text-gray-700">
            {studio.rules?.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 mb-1">
                <FaExclamationTriangle className="text-yellow-500" />
                {item}
              </li>
            ))}
          </ul>

          {/* 위치 */}
          <h3 className="text-lg font-semibold mt-6 mb-2">위치</h3>
          <p className="text-gray-700">{studio.location}</p>

          {/* 운영자 */}
          <h3 className="text-lg font-semibold mt-6 mb-2">운영자</h3>
          <p className="text-gray-700">{studio.instructor}</p>
        </div>

        {/* 오른쪽 요약 박스 */}
        <div className="hidden md:block md:w-80 md:shrink-0 md:relative">
          <div className="bg-white shadow-lg rounded-lg p-4 border sticky top-20">
            <h3 className="text-xl font-bold mb-2">{studio.name}</h3>
            <p className="text-gray-500 text-sm">{studio.location}</p>
            <p className="text-black font-semibold text-lg mt-2">
              ₩ {studio?.hourlyBaseRate?.toLocaleString()}원 / 시간
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-sm">최대 인원: {studio.maxPeople}명</p>
              <p className="text-sm">
                주말 요금: ₩ {studio.weekendPrice?.toLocaleString()}
              </p>
              <p className="text-sm">
                운영시간: {studio.operatingHours?.openTime} ~{" "}
                {studio.operatingHours?.closeTime}
              </p>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => handleFavoriteClick(studio.id)}
                className="flex items-center space-x-1 text-red-500"
              >
                {isFavorite ? (
                  <AiFillHeart className="text-red-500 inline" size={25} />
                ) : (
                  <AiOutlineHeart className="text-red-500 inline" size={25} />
                )}
              </button>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  onClick={handleReservation}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  예약하기
                </button>
                <button
                  onClick={handlePayment}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  결제하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
