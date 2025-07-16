const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;
let kakaoMapScriptPromise = null; // 스크립트 로딩 Promise를 저장할 변수

// 주소 → 좌표 변환
export const loadKakaoMapScript = () => {
    // 이미 로딩 중이거나 로딩이 완료된 경우, 기존 Promise 반환
    if (kakaoMapScriptPromise) {
        return kakaoMapScriptPromise;
    }

    // window.kakao 객체가 이미 존재하고 maps 서비스도 로드된 경우
    if (window.kakao && window.kakao.maps) {
        // 이때도 새로운 Promise를 생성하여 일관된 반환 타입 유지
        kakaoMapScriptPromise = Promise.resolve(window.kakao);
        return kakaoMapScriptPromise;
    }

    // 스크립트 로딩 Promise 생성
    kakaoMapScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false&libraries=services`;
        script.async = true;
        script.onload = () => {
            // 스크립트 로드 후 kakao.maps.load() 호출
            window.kakao.maps.load(() => {
                resolve(window.kakao);
            });
        };
        script.onerror = (error) => {
            console.error("카카오맵 스크립트 로딩 오류:", error);
            reject(new Error("Failed to load Kakao Map Script"));
        };
        document.head.appendChild(script);
    });

    return kakaoMapScriptPromise;
};
