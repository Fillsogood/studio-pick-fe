import { useEffect, useMemo, useState } from "react";
import StudioCard from "../../components/StudioCard";
import Sidebar from "../../components/Sidebar.jsx";
import { getStudios } from "../../lib/studioAPI.js";

const regions = [
  "전체",
  "서울",
  "경기",
  "인천",
  "부산",
  "광주",
  "대구",
  "대전",
  "울산",
  "강원",
  "경남",
  "경북",
  "전남",
  "전북",
  "충남",
  "충북",
  "세종",
  "제주",
];

export default function StudioListPage() {
  const [studios, setStudios] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("popular");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolvedLocation =
    selectedRegion === "전체" ? undefined : selectedRegion;

  const filteredStudios =
    selectedRegion === "전체"
      ? studios
      : studios.filter(
          (studio) => studio.location?.slice(0, 2) === selectedRegion
        );

  useEffect(() => {
    setStudios([]);
    setPage(1);
  }, [selectedRegion, sortBy]);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        setLoading(true);
        const res = await getStudios({
          page,
          location: resolvedLocation,
          sort: sortBy,
        });

        const studioData = res.data.data;
        if (!studioData || !Array.isArray(studioData.content)) {
          throw new Error("잘못된 응답 형식입니다.");
        }

        if (page === 1) {
          setStudios(studioData.content);
        } else {
          setStudios((prev) => [...prev, ...studioData.content]);
        }

        setHasMore(
          studioData.pagination?.currentPage < studioData.pagination?.totalPages
        );
      } catch (err) {
        console.error("스튜디오 목록 조회 실패:", err);
        setError("스튜디오 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, [page, resolvedLocation, sortBy]); // 페이지, 지역, 정렬 기준이 변경될 때마다 호출

  useEffect(() => {
    const handleScroll = () => {
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

      // ✅ page !== 1일 때만 무한스크롤 활성화
      if (!loading && !error && hasMore && page !== 1 && reachedBottom) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, error, page]);

  // ✅ 인기 스튜디오 추출 (useMemo 유지)
  const popularStudios = useMemo(() => {
    return [...studios]
      .filter(
        (studio) => typeof studio.rating === "number" && studio.rating >= 4.8
      )
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);
  }, [studios]);

  return (
    <div className="grid min-h-screen font-sans min-w-[1280px]">
      <Sidebar />
      <main className="p-8 bg-gray-50 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">스튜디오 탐색</h2>
          <p className="text-base text-gray-500">
            다양한 스튜디오를 찾아보고 예약하세요
          </p>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4 min-w-[1280px]">
            인기 스튜디오
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-w-[1200px]">
            {popularStudios.length === 0 ? (
              <p className="col-span-full text-gray-500">
                아직 인기 스튜디오가 없어요 😢 리뷰를 남겨주세요!
              </p>
            ) : (
              popularStudios.map((studio) => (
                <StudioCard
                  key={studio.id}
                  studio={studio}
                  isFavorite={favorites.includes(studio.id)}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">전체 스튜디오</h3>
          <select
            className="border px-3 py-1 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1); // 정렬 기준 변경 시 첫 페이지로 리셋
              setStudios([]); // 스튜디오 목록 초기화 (필요시)
            }}
          >
            <option value="popular">인기순</option>
            <option value="priceLow">낮은 가격순</option>
            <option value="priceHigh">높은 가격순</option>
          </select>
        </div>

        <div className="mb-6">
          <div className="flex items-center flex-wrap gap-2 text-sm">
            <span className="mr-2 font-bold text-black whitespace-nowrap">
              지역:
            </span>
            {regions.map((region) => (
              <button
                key={region}
                className={`px-4 whitespace-nowrap py-1.5 rounded-full border text-sm ${
                  selectedRegion === region
                    ? "bg-WarmBeige-300 text-black border-WarmBeige-200"
                    : "bg-white hover:bg-gray-100 border-gray-300"
                }`}
                onClick={() => {
                  setSelectedRegion(region);
                  setPage(1); // 지역 변경 시 첫 페이지로 리셋
                }}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-w-[1200px]">
          {filteredStudios.map((studio, index) => (
            <StudioCard
              key={`${studio.id}-${index}`}
              studio={studio}
              isFavorite={favorites.includes(studio.id)}
            />
          ))}
          {loading && <div>스튜디오 목록을 불러오는 중...</div>}
          {/* 추가 로딩 스피너 */}
        </div>
      </main>
    </div>
  );
}
