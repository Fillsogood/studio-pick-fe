import { useEffect, useState } from 'react';
import { getStudios } from '../../lib/studioAPI';
import StudioCard from '../../components/StudioCard';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/Sidebar.jsx";

const mockStudios = [
    {
        id: 1,
        name: '루미에르 스튜디오',
        location: '서울 강남구',
        price: 50000,
        rating: 4.9,
        thumbnailUrl: '',
    },
    {
        id: 2,
        name: '빈티지 팝업 스튜디오',
        location: '서울 성수동',
        price: 65000,
        rating: 4.7,
        thumbnailUrl: '',
    },
    {
        id: 3,
        name: '사운드웨이브 스튜디오',
        location: '서울 마포구',
        price: 80000,
        rating: 4.8,
        thumbnailUrl: '',
    }
];

const regions = ['전체', '서울', '경기', '인천', '부산', '대구'];

export default function StudioListPage() {
    const [studios, setStudios] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('전체');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState('popular');

    useEffect(() => {
        /*
        // 추후 백엔드 연결 시
        const fetchStudios = async () => {
          const res = await getStudios({
            page: 1,
            size: 10,
            region: selectedRegion === '전체' ? undefined : selectedRegion,
            category: selectedCategory === '전체' ? undefined : selectedCategory,
            sort: sortBy,
          });
          setStudios(res.data); // 백엔드 응답 구조에 따라 .data 붙일지 여부 확인
        };
        fetchStudios();
        */

        // 지금은 mock 데이터 기준으로 필터링
        // ✅ mock 필터 처리
        const filtered = mockStudios.filter(s => {
            const regionMatch = selectedRegion === '전체' || s.location.includes(selectedRegion);
            const categoryMatch = selectedCategory === '전체' || s.category === selectedCategory;
            return regionMatch && categoryMatch;
        });

        // ✅ 정렬
        const sorted = [...filtered].sort((a, b) => {
            if (sortBy === 'priceLow') return a.price - b.price;
            if (sortBy === 'priceHigh') return b.price - a.price;
            return 0; // 인기순은 정렬 스킵 (mock에 인기 데이터 없으므로)
        });

        setStudios(sorted);
        console.log('필터 조건:', selectedRegion, selectedCategory, sortBy);
    }, [selectedRegion, selectedCategory, sortBy]);

    const handleScroll = () => {
        if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
            hasMore
        ) {
            setPage(prev => prev + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    return (
        <div className="grid grid-cols-[250px_1fr] min-h-screen font-sans">
            {/* 왼쪽 사이드바 */}
            <div className="grid grid-cols-[250px_1fr] min-h-screen font-sans">
                <Sidebar />
                <main className="p-8 bg-gray-50 overflow-y-auto">
                    {/* 오른쪽 내용들 */}
                </main>
            </div>

            {/* 오른쪽 본문 */}
            <main className="p-8 bg-gray-50 overflow-y-auto">
                {/* 상단 스튜디오 탐색 헤더 */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">스튜디오 탐색</h2>
                    <p className="text-base text-gray-500">다양한 스튜디오를 찾아보고 예약하세요</p>
                </div>

                {/* 카테고리 필터 */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">카테고리 필터</h3>
                    <div className="flex flex-wrap gap-2 text-sm">
                        {['전체', '촬영 스튜디오', '공방 스튜디오', '댄스 스튜디오', '영상 스튜디오', '음향 스튜디오'].map((tag, i) => (
                            <button
                                key={i}
                                className={`border px-4 py-2 rounded-full transition-colors ${selectedCategory === tag ? 'bg-lime-400 text-white border-lime-400' : 'bg-white hover:bg-gray-100 border-gray-300'}`}
                                onClick={() => setSelectedCategory(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 지역 필터 */}
                <div className="mb-6">
                    <div className="flex items-center flex-wrap gap-2 text-sm">
                        <span className="mr-2 font-bold text-gray-700">지역:</span>
                        {regions.map(region => (
                            <button
                                key={region}
                                className={`px-4 py-2 rounded-full border transition-colors ${selectedRegion === region ? 'bg-lime-400 text-white border-lime-400' : 'bg-white hover:bg-gray-100 border-gray-300'}`}
                                onClick={() => setSelectedRegion(region)}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 인기 스튜디오 섹션 */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold">인기 스튜디오</h3>
                        {/* 🔽 정렬 셀렉트 */}
                        <select
                            className="border px-3 py-1 rounded-md bg-white text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-lime-500"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="popular">인기순</option>
                            <option value="priceLow">낮은 가격순</option>
                            <option value="priceHigh">높은 가격순</option>
                        </select>
                    </div>

                    {/* 🗂 스튜디오 카드 그리드 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* StudioCard 컴포넌트는 실제 구현이 필요합니다. */}
                        {studios.map(studio => (
                            <div key={studio.id} className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-[1.02]">
                                <img src={`https://via.placeholder.com/300x200?text=Studio+${studio.id}`} alt={studio.name} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h4 className="text-lg font-semibold text-gray-800">{studio.name}</h4>
                                    <p className="text-sm text-gray-500">{studio.location}</p>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-lg font-bold text-lime-600">{studio.price}</span>
                                        <span className="text-sm text-yellow-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                                            {studio.rating}
                    </span>
                                    </div>
                                    <button className="mt-3 w-full bg-lime-500 text-white py-2 rounded-md text-sm font-semibold hover:bg-lime-600 transition-colors">
                                        상세보기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ⬇ 페이지네이션 */}
                <div className="mt-8 flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(num => (
                        <button
                            key={num}
                            className="border rounded px-4 py-2 text-sm hover:bg-gray-200 bg-white transition-colors"
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
}
