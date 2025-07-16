import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import KakaoMap from '../../components/KakaoMap';
import ImageSlider from '../../components/ImageSlider';
import { AiFillStar } from 'react-icons/ai';

export default function StudioDetailPage() {
    const { id } = useParams();
    const [studio, setStudio] = useState(null);

    useEffect(() => {
        const fetchStudio = async () => {
            // TODO: 백엔드 API 연결 시 아래 코드로 교체
            // const res = await getStudioDetail(id);
            // setStudio(res.data);

            // 🔹 더미 데이터 기반 세팅
            setStudio({
                id: 3,
                name: '화양재 스튜디오',
                category: '자연광 스튜디오',
                location: '서울특별시 서초구 양재동 257-4 4층',
                shortLocation: '서울시 서초구',
                rating: 4.8,
                description: '화양재 스튜디오는 강동구 화양동에 위치한 자연광 스튜디오로, 제품 촬영과 인물 촬영에 적합한 다양한 공간을 제공합니다.',
                size: '150평',
                openTime: '09:00',
                closeTime: '22:00',
                maxPeople: 200,
                floor: 5,
                price: {
                    base2H: 50000,
                    extraRate: 5000,
                    weekendRate: 70000,
                },
                rules: [
                    '예약 시간 준수 (초과 시 추가 요금 발생)',
                    '음식물 반입 시 사전 협의 필요',
                    '퇴실 시 정리정돈 필수'
                ],
                facilities: [
                    '조명 장비 (스트로보, 소프트박스)',
                    '촬영 장비',
                    '에어컨',
                    '화장실',
                    '테이블, 의자',
                    '배경지 (화이트, 블랙, 그레이)',
                ],
                images: [
                    'https://formeqly4682.edge.naverncp.com/service/175196614_e5a8e7d40d7aa1a88ba0da4842b9919c.jpeg?type=m&w=900&h=900&autorotate=true&quality=90',
                    'https://formeqly4682.edge.naverncp.com/service/175196545_9b4a1f3e22640dff60cb8870bd4a6a37.jpeg?type=m&w=900&h=900&autorotate=true&quality=90',
                    'https://formeqly4682.edge.naverncp.com/service/175196549_004e598f5446a81cb0cb0b502b123b7a.jpeg?type=m&w=900&h=900&autorotate=true&quality=90',
                    'https://formeqly4682.edge.naverncp.com/service/175196552_c86c4d74ea22b30236d62eb808c9cee5.jpeg?type=m&w=900&h=900&autorotate=true&quality=90'
                ],
                owner: {
                    name: '정승호',
                    intro: '10년 이상의 사진작가 경험을 바탕으로 최적의 촬영 환경을 제공하기 위해 노력하고 있습니다.',
                    contact: '응답률 98%, 평균 응답 시간 10분 이내'
                },
            });
        };
        fetchStudio();
    }, [id]);

    if (!studio) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8 max-w-screen-xl mx-auto">
            {/* 이미지 슬라이더 */}
            <ImageSlider images={studio.images} />

            {/* 기본 정보 */}
            <div className="mt-6">
                <h1 className="text-3xl font-bold mb-2">{studio.name}</h1>
                <p className="text-gray-500">{studio.shortLocation} · {studio.category}</p>
                <div className="flex items-center text-yellow-500 mt-1">
                    <AiFillStar className="mr-1" />
                    <span>{studio.rating}</span>
                </div>
            </div>

            {/* 소개 */}
            <section className="mt-8">
                <h2 className="text-xl font-semibold mb-2">스튜디오 소개</h2>
                <p className="text-gray-700 whitespace-pre-line">{studio.description}</p>
            </section>

            {/* 상세 정보 */}
            <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold mb-2">상세 정보</h3>
                    <ul className="text-gray-700 list-disc list-inside">
                        <li>크기: {studio.size}</li>
                        <li>운영 시간: {studio.openTime} - {studio.closeTime}</li>
                        <li>최대 인원: {studio.maxPeople}명</li>
                        <li>층수: {studio.floor}층</li>
                    </ul>

                    <h3 className="text-lg font-semibold mt-4 mb-2">시설 및 장비</h3>
                    <ul className="text-gray-700 list-disc list-inside">
                        {studio.facilities.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>

                    <h3 className="text-lg font-semibold mt-4 mb-2">이용 규칙</h3>
                    <ul className="text-gray-700 list-disc list-inside">
                        {studio.rules.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                </div>

                {/* 요금 정보 */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">요금 정보</h3>
                    <ul className="text-gray-700">
                        <li>기본 대여 (1시간): {studio.price.base2H.toLocaleString()}원</li>
                        <li>추가 인원당: {studio.price.extra1H.toLocaleString()}원</li>
                        <li>주말 대여 (1시간): {studio.price.fullDay.toLocaleString()}원</li>
                    </ul>
                </div>
            </section>

            {/* 위치 */}
            <section className="mt-10">
                <h3 className="text-lg font-semibold mb-2">위치 정보</h3>
                <p className="text-gray-700">{studio.location}</p>
                <p className="text-sm text-gray-500">{studio.transport}</p>
                <div className="mt-4">
                    {/* KakaoMap 컴포넌트 사용법은 동일 */}
                    <KakaoMap location={studio.location} />
                </div>
            </section>

            {/* 운영자 정보 */}
            <section className="mt-10">
                <h3 className="text-lg font-semibold mb-2">스튜디오 운영자</h3>
                <p className="font-semibold">{studio.owner.name}</p>
                <p className="text-gray-700 mb-1">{studio.owner.intro}</p>
                <p className="text-sm text-gray-500">{studio.owner.contact}</p>
            </section>
        </div>
    );
}
