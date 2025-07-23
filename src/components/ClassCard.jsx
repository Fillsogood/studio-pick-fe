import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

const ClassCard = ({ data, onReserveClick }) => {
  const navigate = useNavigate();
  const { id, title, description, price, date, rating } = data;

  const handleReserveClick = (e) => {
    e.stopPropagation(); // 카드 클릭 방지
    if (onReserveClick) {
      onReserveClick(data); // 모달 열기
    } else {
      navigate(`/classes/${id}`); // 기본 동작 (상세 페이지로 이동)
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/classes/${id}`)}
    >
      <div className="relative">
        <img
          src={data.thumbnailUrl || "/placeholder-image.jpg"}
          alt={title}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-500 text-sm">{date}</span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="text-sm text-gray-700">
              {rating ? `${rating.toFixed(1)}` : "평점 없음"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-WarmBeige-600">
            {price?.toLocaleString()}원
          </span>
          <button
            className="text-base bg-WarmBeige-300 border px-3 py-1.5 rounded hover:bg-WarmBeige-200"
            onClick={handleReserveClick}
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;
