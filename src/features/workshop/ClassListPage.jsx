import { useEffect, useState } from "react";
import { getClasses } from "@/lib/classAPI";
import ClassCard from "@/components/ClassCard";
import WorkshopReservationModal from "@/components/WorkshopReservationModal";

const ClassListPage = () => {
  const [classList, setClassList] = useState([]);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getClasses({ status: "ACTIVE" });
      setClassList(result.data.data.classes);
    };
    fetchData();
  }, []);

  const handleReserveClick = (classData) => {
    console.log("예약하기 클릭됨:", classData);
    setSelectedClass(classData);
    setReservationModalOpen(true);
  };

  return (
    <div className="px-6 py-6">
      {/* 상단 타이틀 및 설명 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">클래스 탐색</h2>
        <p className="text-sm text-gray-600 mt-1">
          다양한 클래스를 탐색해보세요. 원하는 주제의 워크숍을 쉽게 찾아볼 수
          있습니다.
        </p>

        {/* 정렬 / 카테고리 / 검색바 */}
        <div className="flex items-center gap-3 mt-4">
          <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
            <option>최신순</option>
            <option>가격 낮은순</option>
            <option>가격 높은순</option>
          </select>
          <select className="border border-gray-300 rounded-md px-2 py-1 text-sm">
            <option>모든 카테고리</option>
            <option>사진</option>
            <option>영상</option>
            <option>디자인</option>
          </select>
          <input
            type="text"
            placeholder="클래스 이름으로 검색"
            className="border border-gray-300 rounded-md px-3 py-1 w-[360px]"
          />
          <button className="bg-black text-white text-sm px-4 py-1.5 rounded-md">
            필터 적용
          </button>
        </div>
      </div>

      {/* 클래스 카드 목록 */}
      <div className="grid grid-cols-5 gap-[6px]">
        {classList.map((item) => (
          <ClassCard
            key={item.id}
            data={item}
            onReserveClick={handleReserveClick}
          />
        ))}
      </div>

      {/* 페이지네이션 (임시) */}
      <div className="mt-8 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((page) => (
          <button
            key={page}
            className="w-8 h-8 rounded-full border border-gray-300 text-sm text-gray-600 hover:bg-lime-100"
          >
            {page}
          </button>
        ))}
      </div>

      {/* 예약 모달 */}
      {reservationModalOpen && selectedClass && (
        <WorkshopReservationModal
          isOpen={reservationModalOpen}
          onClose={() => {
            console.log("모달 닫기");
            setReservationModalOpen(false);
          }}
          workshop={selectedClass}
          onReservationSuccess={() => {
            setReservationModalOpen(false);
            alert("클래스 예약이 완료되었습니다!");
          }}
        />
      )}
    </div>
  );
};

export default ClassListPage;
