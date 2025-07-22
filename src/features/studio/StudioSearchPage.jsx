import { useEffect, useState } from "react";
import StudioCard from "../../components/StudioCard";
import Sidebar from "../../components/Sidebar";
import { activeStudios } from "../../lib/studioAPI";

const regions = ["전체", "서울", "경기", "인천", "부산", "대구"];
const sorts = [
  { value: "popular", label: "인기순" },
  { value: "priceLow", label: "낮은 가격순" },
  { value: "priceHigh", label: "높은 가격순" },
];

export default function StudioSearchPage() {
  const [studios, setStudios] = useState([]);
  const [page, setPage] = useState(0); // Page는 0부터 시작
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState("전체");
  const [sort, setSort] = useState("popular");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchStudios = async (reset = false) => {
    try {
      setLoading(true);
      const res = await activeStudios({
        page,
        size: 20,
        region: region === "전체" ? null : region,
        sort,
        keyword: keyword || null,
      });

      const data = res.data.data;
      if (reset) {
        setStudios(data.content);
      } else {
        setStudios((prev) => [...prev, ...data.content]);
      }
      setHasMore(data.currentPage < data.totalPages - 1);
    } catch (e) {
      console.error("검색 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    fetchStudios(true);
  }, [region, sort, keyword]);

  useEffect(() => {
    if (page > 0) {
      fetchStudios();
    }
  }, [page]);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;
      if (bottom && !loading && hasMore) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  return (
    <div className="grid min-h-screen font-sans min-w-[1280px]">
      <Sidebar />
      <main className="p-8 bg-gray-50 overflow-y-auto w-full">
        <div className="mb-6 flex flex-col gap-3 md:flex-row justify-between">
          <h2 className="text-3xl font-bold">스튜디오 검색</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setKeyword(searchInput);
              setPage(0);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="스튜디오 이름 또는 설명 검색"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-1 w-64"
            />
            <button
              type="submit"
              className="bg-lime-300 hover:bg-lime-200 text-black font-semibold px-4 py-1 rounded"
            >
              검색
            </button>
          </form>
        </div>

        <div className="flex gap-4 items-center mb-4 flex-wrap">
          <div className="flex gap-2 items-center">
            <span className="font-bold text-sm text-black">지역:</span>
            {regions.map((r) => (
              <button
                key={r}
                className={`px-4 py-1.5 text-sm rounded-full border ${
                  region === r
                    ? "bg-lime-300 text-black border-lime-200"
                    : "bg-white hover:bg-gray-100 border-gray-300"
                }`}
                onClick={() => setRegion(r)}
              >
                {r}
              </button>
            ))}
          </div>

          <select
            className="border px-3 py-1 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-black"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-w-[1200px]">
          {studios.map((studio) => (
            <StudioCard
              key={studio.id}
              studio={studio}
              isFavorite={false} // 즐겨찾기 기능은 연결되면 적용
            />
          ))}
        </div>

        {loading && <p className="mt-4 text-center">로딩 중...</p>}
      </main>
    </div>
  );
}
