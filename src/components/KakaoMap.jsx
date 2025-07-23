import { useEffect, useRef } from 'react';
import { loadKakaoMapScript } from '../lib/KakaoAPI';

export default function KakaoMap({ location }) {
    const mapRef = useRef(null); // 지도 인스턴스를 저장할 ref
    const markerRef = useRef(null); // 마커 인스턴스를 저장할 ref
    const mapContainerRef = useRef(null); // 지도가 그려질 DOM 엘리먼트 ref (id 대신 ref 사용 권장)

    useEffect(() => {
        const initMap = async () => {
            try {
                const kakao = await loadKakaoMapScript();
                const geocoder = new kakao.maps.services.Geocoder();

                if (!mapContainerRef.current) return;

                if (!mapRef.current) {
                    mapRef.current = new kakao.maps.Map(mapContainerRef.current, {
                        center: new kakao.maps.LatLng(37.5665, 126.9780),
                        level: 3,
                    });
                }

                if (!location) {
                    console.warn("❗ location가 없음!");
                    return;
                }

                // 주소 전처리
                let trimmed;
                if (typeof location === 'string') {
                    trimmed = location.replace(/\s[0-9]+(층|호|동)\b/g, '');
                } else {
                    console.warn("❗ location prop이 유효한 문자열이 아닙니다:", location);
                    markerRef.current?.setMap(null); // 유효하지 않은 location이므로 마커 제거
                    return; // 주소 검색 로직 건너뛰기
                }
                    geocoder.addressSearch(trimmed, (result, status) => {
                    console.log("검색 주소:", trimmed);
                    console.log("결과:", result);
                    console.log("상태:", status);

                    if (status === kakao.maps.services.Status.OK && result.length > 0) {
                        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                        markerRef.current?.setMap(null);
                        markerRef.current = new kakao.maps.Marker({
                            map: mapRef.current,
                            position: coords,
                        });
                        mapRef.current.setCenter(coords);
                    } else {
                        console.warn('주소 검색 실패:', status);
                    }
                });
            } catch (err) {
                console.error("지도 초기화 실패:", err);
            }
        };
        initMap();
    }, [location]);

    // id 대신 ref를 사용하여 DOM 엘리먼트를 참조합니다.
    return <div ref={mapContainerRef} className="w-full h-[300px] rounded border" />;
}
