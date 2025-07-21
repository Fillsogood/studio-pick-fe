import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const ClassCard = ({ data }) => {
  const navigate = useNavigate();
  const {
    id,
    title,
    description,
    price,
    date,
    thumbnailUrl,
    category,
    rating,
  } = data;

  return (
    <div
      onClick={() => navigate(`/classes/${id}`)}
      className="cursor-pointer border rounded-xl shadow-sm hover:shadow-md bg-white transition w-full max-w-sm"
    >
      {/* 이미지 영역 */}
      <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl">
        <img
          src={thumbnailUrl || "/default-thumbnail.jpg"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 정보 영역 */}
      <div className="p-4 flex flex-col justify-between h-[190px]">
        {/* 카테고리 + 평점 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{category || "카테고리 없음"}</span>
          <div className="flex items-center text-yellow-500">
            <Star className="w-4 h-4 fill-yellow-500 mr-0.5" />
            <span className="font-medium">{(rating ?? 0).toFixed(1)}</span>
          </div>
        </div>

        {/* 타이틀 */}
        <h3 className="mt-1 font-semibold text-base text-gray-900 truncate">
          {title}
        </h3>

        {/* 설명 */}
        <p className="text-sm text-gray-700 line-clamp-2">{description}</p>

        {/* 날짜 + 가격 + 버튼 */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex flex-col text-base">
            <span className="text-gray-400">{date}</span>
            <span className="font-bold text-black">{price.toLocaleString()}원</span>
          </div>
          <button
            className="text-base bg-gray-100 border px-3 py-1.5 rounded hover:bg-gray-200"
            onClick={(e) => {
              e.stopPropagation(); // 카드 클릭 방지
              navigate(`/classes/${id}/reserve`);
            }}
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
