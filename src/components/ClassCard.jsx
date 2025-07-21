// components/ClassCard.jsx
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const ClassCard = ({ data }) => {
  const navigate = useNavigate();
  const { id, title, thumbnailUrl, price, date, rating } = data;

  return (
    <div
      onClick={() => navigate(`/classes/${id}`)}
      className="cursor-pointer border rounded-xl shadow-sm hover:shadow-md overflow-hidden bg-white transition"
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img
          src={thumbnailUrl || '/default-thumbnail.jpg'}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm truncate">{title}</h3>

          {/* ⭐ 평점 표시 */}
          {rating !== undefined && (
            <div className="flex items-center text-yellow-500 text-xs">
              <Star className="w-4 h-4 fill-yellow-500" />
              <span className="ml-0.5 font-medium">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500">{date}</p>
        <p className="text-sm font-bold mt-1">{price.toLocaleString()}원</p>
      </div>
    </div>
  );
};

export default ClassCard;
