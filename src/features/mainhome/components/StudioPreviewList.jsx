import { useEffect, useState } from "react";
import StudioCard from "../../../components/StudioCard";
import { getStudios } from "../../../lib/studioAPI";

const StudioPreviewList = () => {
  const [studios, setStudios] = useState([]);

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const res = await getStudios({ page: 1, status: "ACTIVE" });
        const all = res?.data?.data?.content || [];

        const highRated = all
          .filter((studio) => typeof studio.rating === "number" && studio.rating >= 4)
          .slice(0, 4);

        setStudios(highRated);
      } catch (err) {
        console.error("인기 스튜디오 불러오기 실패:", err);
      }
    };

    fetchStudios();
  }, []);

  if (studios.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {studios.map((studio) => (
        <StudioCard key={studio.id} studio={studio} isFavorite={false} />
      ))}
    </div>
  );
};

export default StudioPreviewList;
