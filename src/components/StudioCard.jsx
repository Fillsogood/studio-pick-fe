import { Link } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function StudioCard({ studio, onFavoriteClick, isFavorite }) {
  const navigate = useNavigate();
  const handleFavoriteClick = (studioId) => {
    console.log("studioId", studioId);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("즐겨찾기를 하시려면 로그인이 필요합니다.");
      return;
    }

    navigate("/favorites");
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-[0.95] scale-[0.9] origin-top">
      <Link to={`/studios/${studio.id}`}>
        <img
          src={studio.thumbnailImage}
          alt={`${studio.name} 썸네일`}
          className="studio-thumbnail"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Link to={`/studios/${studio.id}`}>
            <h4 className="text-base font-semibold text-gray-800">
              {studio.name}
            </h4>
          </Link>
          <div
            className="cursor-pointer text-2xl text-red-400"
            onClick={() => handleFavoriteClick(studio.id)}
            title="즐겨찾기"
          >
            {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
          </div>
        </div>

        <p className="text-sm text-gray-500">{studio.location}</p>

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm font-bold text-black">
            {(studio.hourlyBaseRate ?? 0).toLocaleString()}원
          </span>
          <span className="text-sm text-yellow-500 flex items-center">
            ⭐{" "}
            {studio.rating !== undefined
              ? studio.rating.toFixed(0.0)
              : "평점 없음"}
          </span>
        </div>

        <Link
          to={`/studios/${studio.id}`}
          className="mt-3 block w-full bg-lime-300 text-black py-2 rounded-md text-sm font-semibold text-center hover:bg-lime-200 transition-colors"
        >
          상세보기
        </Link>
      </div>
    </div>
  );
}
