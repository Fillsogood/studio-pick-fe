import { Link } from "react-router-dom";

export default function StudioCard({ studio }) {

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
        <p className="text-sm text-gray-500">
          {" "}
          {studio.location?.split(" ").slice(0, 2).join(" ")}
        </p>

        <div className="flex items-center gap-1">
          <span className="text-sm text-yellow-500">
            {studio.averageRating === null
              ? "★ 0.0"
              : `★ ${studio.averageRating.toFixed(1)}`}
          </span>
        </div>

        <p className="text-sm text-gray-700">
          {studio.hourlyBaseRate?.toLocaleString()}원 / 시간
        </p>

        <Link
          to={`/studios/${studio.id}`}
          className="mt-3 block w-full bg-WarmBeige-300 text-black py-2 rounded-md text-sm font-semibold text-center hover:bg-WarmBeige-200 transition-colors"
        >
          상세보기
        </Link>
      </div>
    </div>
  );
}
