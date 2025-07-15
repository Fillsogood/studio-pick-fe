import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getStudioDetail } from '../../lib/studioAPI';

export default function StudioDetailPage() {
    const { id } = useParams();
    const [studio, setStudio] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            const res = await getStudioDetail(id);
            console.log('📦 받은 스튜디오 상세:', res);
            setStudio(res);
        };
        fetchDetail();
    }, [id]);

    if (!studio) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{studio.name}</h1>
            <p>{studio.description}</p>
            {/* 이미지 슬라이드, 요금정보, 편의시설, 카카오맵 등 나중에 추가 */}
        </div>
    );
}
