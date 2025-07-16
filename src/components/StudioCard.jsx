import { Link } from 'react-router-dom';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

export default function StudioCard({ studio, onFavoriteClick, isFavorite }) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-[0.95] scale-[0.9] origin-top">
            <Link to={`/studio/${studio.id}`}>
                <img
                    src={studio.thumbnailUrl || `https://via.placeholder.com/300x200?text=Studio+${studio.id}`}
                    className="w-full h-48 object-cover"
                    alt={studio.name}
                />
            </Link>

            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <Link to={`/studio/${studio.id}`}>
                        <h4 className="text-base font-semibold text-gray-800">{studio.name}</h4>
                    </Link>
                    <div
                        className="cursor-pointer text-2xl text-red-400"
                        onClick={() => onFavoriteClick(studio.id)}
                        title="즐겨찾기"
                    >
                        {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
                    </div>
                </div>

                <p className="text-sm text-gray-500">{studio.location}</p>

                <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-bold text-lime-300">
                {studio.price.toLocaleString()}원
              </span>
                    <span className="text-sm text-yellow-500 flex items-center">⭐ {studio.rating}</span>
                </div>

                <Link
                    to={`/studio/${studio.id}`}
                    className="mt-3 block w-full bg-lime-300 text-black py-2 rounded-md text-sm font-semibold text-center hover:bg-lime-200 transition-colors"
                >
                    상세보기
                </Link>
            </div>
        </div>
    );
}
