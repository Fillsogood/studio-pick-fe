import { useEffect, useRef, useState } from "react";

const AddressStep = ({ onNext }) => {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [detail, setDetail] = useState("");

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const circleInstance = useRef(null);

  // 1. 주소 검색창 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => {
      const container = document.getElementById("postcode-wrapper");
      if (container && container.childNodes.length === 0) {
        new window.daum.Postcode({
          oncomplete: function (data) {
            const fullAddress = data.address;
            setSelectedAddress(fullAddress);
          },
          width: "100%",
          height: "100%",
        }).embed(container);
      }
    };
    document.body.appendChild(script);
  }, []);

  // 2. 지도 SDK 로드
  useEffect(() => {
    const scriptId = "kakao-map-sdk";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        // 지도는 주소 선택 시 생성됨
      });
    };

    document.body.appendChild(script);
  }, []);

  // 3. 주소 선택 시 지도 렌더링
  useEffect(() => {
    if (!selectedAddress || !window.kakao?.maps?.services || !mapRef.current)
      return;

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(selectedAddress, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

        mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
          center: coords,
          level: 3,
        });

        new window.kakao.maps.Marker({
          map: mapInstance.current,
          position: coords,
        });

        if (circleInstance.current) {
          circleInstance.current.setMap(null);
        }

        circleInstance.current = new window.kakao.maps.Circle({
          map: mapInstance.current,
          center: coords,
          radius: 100,
          strokeWeight: 2,
          strokeColor: "#0048ff",
          strokeOpacity: 0.8,
          fillColor: "#a5c8ff",
          fillOpacity: 0.4,
        });
      }
    });
  }, [selectedAddress]);

  return (
    <div>
      <p className="text-xl font-bold mb-2">
        어떤 클래스가 만들어질지 기대돼요.
      </p>
      <p className="text-base mb-4">이 클래스는 어디에 있나요?</p>

      {!selectedAddress && (
        <div
          id="postcode-wrapper"
          className="h-[450px] w-full border rounded shadow-sm mb-6"
        />
      )}

      {selectedAddress && (
        <>
          <p className="text-base font-semibold mb-2">{selectedAddress}</p>

          <div
            ref={mapRef}
            id="map"
            className="w-full h-[300px] rounded shadow mb-6"
          />

          <input
            type="text"
            placeholder="상세 주소 입력"
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            className="w-full border rounded px-4 py-2 mb-3"
          />
          <p className="text-sm text-gray-500 mb-4">
            게스트는 예약 전에 지도를 통해 대략적인 위치만 확인할 수 있어요.
          </p>

          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => {
              const full = detail ? `${selectedAddress} ${detail}` : selectedAddress;
              onNext(full); // 부모에 전체 주소 전달
            }}
          >
            다음
          </button>
        </>
      )}
    </div>
  );
};

export default AddressStep;
