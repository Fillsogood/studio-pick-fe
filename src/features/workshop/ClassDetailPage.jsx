import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getClassDetail } from "../../lib/classAPI";
import ImageSlider from "../workshop/components/ImageSlider";

const ClassDetailPage = () => {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);

  useEffect(() => {
    getClassDetail(id).then((res) => {
      console.log("클래스 데이터 응답:", res.data);
      setClassData(res.data.data);
    });
  }, [id]);

  if (!classData) return <div className="text-center py-20">로딩 중...</div>;

  const {
    title,
    description,
    price,
    date,
    startHour,
    startMinute,
    endHour,
    endMinute,
    instructor,
    address,
    thumbnailUrl,
    imageUrls,
  } = classData;

  return (
    <div className="max-w-[1100px] mx-auto flex items-start gap-10 py-10 px-4">
      {/* 이미지 영역 - 슬라이더 */}
      <div className="flex-shrink-0 w-[600px] h-[400px] rounded-xl overflow-hidden bg-gray-100 border shadow-md">
        {imageUrls && imageUrls.length > 0 ? (
          <ImageSlider images={imageUrls.map((url) => encodeURI(url.trim()))} />
        ) : thumbnailUrl && thumbnailUrl.trim() !== "" ? (
          <img
            src={encodeURI(thumbnailUrl.trim())}
            alt="대표 이미지"
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            이미지가 없습니다.
          </div>
        )}
      </div>

      {/* 상세 정보 영역 */}
      <div className="flex-1 max-w-[480px]">
        <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
        <p className="text-lg text-gray-700 mb-8">{description}</p>

        <div className="text-base text-gray-800 space-y-3 mb-8 leading-relaxed">
          <p>
            <span className="font-semibold">주소:</span> {address}
          </p>
          <p>
            <span className="font-semibold">날짜:</span> {date}
          </p>
          <p>
            <span className="font-semibold">시간:</span> {startHour}시{" "}
            {startMinute}분 ~ {endHour}시 {endMinute}분
          </p>
          <p>
            <span className="font-semibold">강사:</span> {instructor}
          </p>
        </div>

        <div className="text-3xl font-extrabold text-orange-600 mb-10">
          가격: {price ? price.toLocaleString() + "원" : "가격 미정"}
        </div>

        <button className="w-full py-4 bg-black text-white text-xl rounded-md hover:bg-gray-800 transition">
          예약하기
        </button>
      </div>
    </div>
  );
};

export default ClassDetailPage;
