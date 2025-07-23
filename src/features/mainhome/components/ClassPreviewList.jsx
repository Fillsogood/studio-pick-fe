import { useEffect, useState } from "react";
import ClassCard from "../../../components/ClassCard";
import { getClasses } from "../../../lib/classAPI";

const ClassPreviewList = () => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getClasses({ page: 1, status: "ACTIVE" });
        const all = res?.data?.data?.classes || [];
        const filtered = all
          .filter((c) => typeof c.rating === "number" && c.rating >= 4)
          .slice(0, 4);
        setClasses(filtered);
      } catch (err) {
        console.error("인기 클래스 불러오기 실패:", err);
      }
    };

    fetchClasses();
  }, []);

  if (classes.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      {classes.map((classItem) => (
        <ClassCard key={classItem.id} data={classItem} />
      ))}
    </div>
  );
};

export default ClassPreviewList;
