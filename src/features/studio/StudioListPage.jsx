import { useEffect, useState } from "react";
import StudioCard from "../../components/StudioCard";
import { activeStudios } from "../../lib/studioAPI";
import { Slider } from "@mui/material";

const regionOptions = [
  "서울",
  "경기",
  "인천",
  "부산",
  "광주",
  "대구",
  "대전",
  "울산",
  "세종",
  "제주",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
];

export default function StudioListPage() {
  const [studios, setStudios] = useState([]);
  const [filteredStudios, setFilteredStudios] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState();
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [appliedFilters, setAppliedFilters] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = async () => {
    try {
      const params = {
        ...(appliedFilters.region && { region: appliedFilters.region }),
        ...(appliedFilters.keyword && {
          keyword: appliedFilters.keyword,
        }), // 백엔드에서 % 안 붙이면 이쪽에서 붙여도 됨
      };
      console.log("🔍 검색 파라미터:", params); // 디버깅용
      const res = await activeStudios(params);
      const content = res.data?.data?.content || [];
      setStudios(content);
    } catch (err) {
      console.error("스튜디오 목록 조회 실패:", err);

      if (err.response) {
        console.log("🔥 백엔드 응답 상태:", err.response.status);
        console.log("🔥 백엔드 응답 메시지:", err.response.data);
      }
    }
  };

  // 필터가 적용되면 검색 실행
  useEffect(() => {
    handleSearch();
  }, [appliedFilters]);

  useEffect(() => {
    let result = studios;

    // 지역 필터 (appliedFilters.region 사용)
    const regionArray = appliedFilters.region
      ? appliedFilters.region.split("")
      : "";

    if (regionArray.length > 0) {
      result = result.filter((studio) => {
        const region = studio.region || studio.location?.slice(0, 2);
        return regionArray.length === 0 || regionArray.includes(region);
      });
    }

    // 가격 필터
    const min = appliedFilters.priceMin ?? 0;
    const max = appliedFilters.priceMax ?? 500000;

    result = result.filter((studio) => {
      const price = studio.hourlyBaseRate || 0;
      return price >= min && price <= max;
    });

    setFilteredStudios(result);
  }, [studios, appliedFilters]);

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      region: selectedRegion || null,
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      keyword: search.trim() ? search.trim() : null,
    });
    setFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSelectedRegion(null);
    setPriceRange([0, 500000]);
    setAppliedFilters({});
    setSearch("");
  };

  return (
    <div className="min-h-screen font-sans min-w-[1280px] bg-gray-50">
      <div className="w-full max-w-[1440px] mx-auto pt-12 pb-6 px-4">
        <h2 className="text-4xl font-bold text-black mb-2">스튜디오 탐색</h2>
        <p className="text-lg text-gray-500 mb-6">
          다양한 스튜디오를 찾아보고 예약하세요
        </p>

        <div className="flex gap-3 items-center mb-10">
          <input
            type="text"
            placeholder="스튜디오 이름으로 검색"
            className="flex-1 border rounded px-4 py-3 text-base bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
          />
          <button
            type="button"
            className="px-6 py-3 rounded bg-black text-white font-semibold text-base shadow hover:bg-gray-800 transition-colors"
            onClick={handleApplyFilters}
          >
            검색
          </button>
          <button
            type="button"
            className="border bg-WarmBeige-300 text-black hover:bg-WarmBeige-200 rounded-md px-6 py-3"
            onClick={() => setFilterOpen(true)}
          >
            필터
          </button>
        </div>
      </div>

      {/* 스튜디오 카드 목록 */}
      <div className="w-full max-w-[1440px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {filteredStudios.map((studio) => (
            <div
              key={studio.id}
              className="min-w-[240px] max-w-[320px] mx-auto"
            >
              <StudioCard key={studio.id} studio={studio} />
            </div>
          ))}
        </div>
      </div>

      {/* 필터 드로어 */}
      <div
        className={`fixed top-0 right-0 h-full w-[340px] bg-white border-l z-50 transition-transform duration-300 px-8 py-10 ${
          filterOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">필터</h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            onClick={() => setFilterOpen(false)}
          >
            ×
          </button>
        </div>

        {/* 지역 */}
        <div>
          <div className="font-semibold mb-2">지역</div>
          <div className="flex flex-wrap gap-2">
            {regionOptions.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => handleRegionSelect(region)}
                className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap font-semibold transition-colors
                  ${
                    selectedRegion === region
                      ? "bg-lime-300 text-black border-lime-200"
                      : "bg-white border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* 가격 */}
        <div className="mt-6">
          <div className="font-semibold mb-2">가격</div>
          <Slider
            value={priceRange}
            onChange={(_, newValue) => setPriceRange(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={500000}
            step={1000}
            sx={{ color: "#a855f7" }}
          />
          <div className="text-xs text-gray-500 mt-1">
            가격 범위: {priceRange[0].toLocaleString()}원 ~{" "}
            {priceRange[1].toLocaleString()}원
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2 mt-8">
          <button
            type="button"
            className="flex-1 px-4 py-3 text-base font-semibold rounded-l-2xl bg-yellow-300 text-black hover:bg-yellow-200"
            onClick={handleResetFilters}
          >
            초기화
          </button>
          <button
            type="button"
            className="flex-1 px-4 py-3 text-base font-semibold rounded-r-2xl bg-purple-500 text-white hover:bg-purple-400"
            onClick={handleApplyFilters}
          >
            필터 적용하기
          </button>
        </div>
      </div>

      {filterOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-20"
          onClick={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}
