import {useEffect, useMemo, useState} from 'react';
import StudioCard from '../../components/StudioCard';
import Sidebar from "../../components/Sidebar.jsx";
import {addFavorite} from "../../lib/reviewAPI.js";
import { useNavigate } from 'react-router-dom';

const mockStudios = [
    {
        id: 1,
        name: '드림메이커 스튜디오',
        location: '서울 강동구',
        price: 55000,
        rating: 4.9,
        thumbnailUrl: 'https://formeqly4682.edge.naverncp.com/service/174473035_399b1646e1e4ceb9c25012dd89a445c4.jpg?type=m&w=900&h=900&autorotate=true&quality=90',
    },
    {
        id: 2,
        name: '종로자연광 스튜디오',
        location: '서울 송인동',
        price: 25000,
        rating: 4.6,
        thumbnailUrl: 'https://formeqly4682.edge.naverncp.com/service/175000138_9c6703f4f9eb9414b1581c9f9c75c3c0.jpg?type=m&w=900&h=900&autorotate=true&quality=90',
    },
    {
        id: 3,
        name: '화양재 스튜디오',
        location: '서울 양재동',
        price: 120000,
        rating: 4.8,
        thumbnailUrl: 'https://formeqly4682.edge.naverncp.com/service/175196614_e5a8e7d40d7aa1a88ba0da4842b9919c.jpeg?type=m&w=900&h=900&autorotate=true&quality=90',
    },
    {
        id: 4,
        name: '서울 LED럭스 스튜디오',
        location: '서울 신사동',
        price: 90000,
        rating: 4.6,
        thumbnailUrl: 'https://formeqly4682.edge.naverncp.com/service/171178440_1556a293f51b5cc549c568674bc13241.jpeg?type=m&w=900&h=900&autorotate=true&quality=90',
    },
    {
        id: 5,
        name: '촬영스튜디오 뮤크',
        location: '서울 영등포구',
        price: 30000,
        rating: 4.6,
        thumbnailUrl: 'https://formeqly4682.edge.naverncp.com/service/173815356_98afb8bd59f8e5b4b4aca154bbfff220.jpg?type=m&w=900&h=900&autorotate=true&quality=90',
    },
    {
        id: 6,
        name: '블루락 게임PC8대 영등포구점',
        location: '서울 영등포구',
        price: 90000,
        rating: 4.9,
        thumbnailUrl: 'https://formeqly4682.edge.naverncp.com/service/173286760_50476b2787d9d2e12a2b30d0e86492b5.jpg?type=m&w=900&h=900&autorotate=true&quality=90',
    },
    {
        id: 7,
        name: '필더그린 스튜디오',
        location: '서울 성동구',
        price: 90000,
        rating: 4.5,
        thumbnailUrl: 'https://formeqly4682.edge.naverncp.com/service/171197561_c52109ce4e00443b13934f6046752895.jpeg?type=m&w=900&h=900&autorotate=true&quality=90',
    },
    {
        id: 8,
        name: '무슨 스튜디오',
        location: '서울 용산구',
        price: 99000,
        rating: 4.4,
        thumbnailUrl: 'https://formeqly4682.edge.naverncp.com/service/165163646_9bc733f89c3d8af01b1802b666845f12.jpeg?type=m&w=900&h=900&autorotate=true&quality=90',
    },
];

const regions = ['전체', '서울', '경기', '인천', '부산', '대구'];

export default function StudioListPage() {
    const [studios, setStudios] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('전체');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [sortBy, setSortBy] = useState('popular');
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('accessToken');

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

    // 인기 스튜디오 추출
    const popularStudios = useMemo(() => {
        return [...studios]
            .filter(studio => studio.rating >= 4.8)
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
    }, [studios]);

    const handleFavoriteClick = async (studioId) => {
        if (!isLoggedIn) {
            alert('로그인이 필요합니다.');
            navigate('/login'); // 로그인 페이지로 이동
            return;
        }

        try {
            await addFavorite('STUDIO', studioId);
            setFavorites(prev => [...prev, studioId]);
        } catch (error) {
            console.error('즐겨찾기 등록 실패:', error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
                hasMore
            ) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    return (
        <div className="grid min-h-screen font-sans min-w-[1280px]">
            {/* 왼쪽 사이드바 */}
            <Sidebar />

            {/* 오른쪽 본문 */}
            <main className="p-8 bg-gray-50 overflow-y-auto">
                {/* 상단 스튜디오 탐색 헤더 */}
                <div className="mb-6">
                    <h2 className="text-3xl font-bold mb-2">스튜디오 탐색</h2>
                    <p className="text-base text-gray-500">다양한 스튜디오를 찾아보고 예약하세요</p>
                </div>

                {/* 인기 스튜디오 */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold mb-4 min-w-[1280px]">인기 스튜디오</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-w-[1200px]">
                        {popularStudios.map(studio => (
                            <StudioCard
                                key={studio.id}
                                studio={studio}
                                onFavoriteClick={handleFavoriteClick}
                                isFavorite={favorites.includes(studio.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* 전체 스튜디오 헤더 */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">전체 스튜디오</h3>
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

                {/* 필터: 카테고리 & 지역 */}
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex gap-2">
                        {['전체', '촬영 스튜디오', '공방 스튜디오', '댄스 스튜디오', '영상 스튜디오', '음향 스튜디오'].map((tag, i) => (
                            <button
                                key={i}
                                className={`whitespace-nowrap border px-4 py-1.5 rounded-full text-sm ${selectedCategory === tag ? 'bg-lime-300 text-black border-lime-200' : 'bg-white hover:bg-gray-100 border-gray-300'}`}
                                onClick={() => setSelectedCategory(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center flex-wrap gap-2 text-sm">
                        <span className="mr-2 font-bold text-black whitespace-nowrap">지역:</span>
                        {regions.map(region => (
                            <button
                                key={region}
                                className={`px-4 whitespace-nowrap py-1.5 rounded-full border text-sm ${selectedRegion === region ? 'bg-lime-300 text-black border-lime-200' : 'bg-white hover:bg-gray-100 border-gray-300'}`}
                                onClick={() => setSelectedRegion(region)}
                            >
                                {region}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 전체 스튜디오 리스트 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 min-w-[1200px]">
                    {studios.map(studio => (
                        <StudioCard
                            key={studio.id}
                            studio={studio}
                            onFavoriteClick={handleFavoriteClick}
                            isFavorite={favorites.includes(studio.id)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );

}
