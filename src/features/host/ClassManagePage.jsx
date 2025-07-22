import { useNavigate } from "react-router-dom";

const ClassManagePage = () => {
  const navigate = useNavigate();

  // ✨ 목업 데이터
  const mockClasses = [
    {
      id: 1,
      title: "캘리그라피 클래스",
      status: "ACTIVE",
      reservationCount: 12,
      totalRevenue: 360000,
      startDate: "2025-08-01",
      endDate: "2025-08-31",
    },
    {
      id: 2,
      title: "도자기 핸드빌딩 클래스",
      status: "INACTIVE",
      reservationCount: 7,
      totalRevenue: 210000,
      startDate: "2025-07-01",
      endDate: "2025-07-28",
    },
    {
      id: 3,
      title: "미노출 준비중 클래스",
      status: "PENDING",
      reservationCount: 0,
      totalRevenue: 0,
      startDate: "2025-09-01",
      endDate: "2025-09-30",
    },
  ];

  return (
    <div className="p-10">
      <h2 className="text-4xl font-bold mb-10">클래스 관리</h2>

      {/* 📊 요약 카드 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        <SummaryCard label="총 클래스 수" value="3개" />
        <SummaryCard label="총 예약 수" value="19건" />
        <SummaryCard label="이번 달 매출" value="210,000원" />
        <SummaryCard label="총 누적 매출" value="570,000원" />
      </div>

      {/* 📋 클래스 카드 리스트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {mockClasses.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 rounded-2xl shadow-md p-6 bg-neutral-50 flex flex-col justify-between hover:shadow-xl transition"
          >
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">{item.title}</h3>
              <p className="text-base text-gray-700 mb-1">예약 수: {item.reservationCount}건</p>
              <p className="text-base text-gray-700 mb-1">
                총 매출: {item.totalRevenue.toLocaleString()}원
              </p>
              <p className="text-base text-gray-700 mb-1">
                기간: {item.startDate} ~ {item.endDate}
              </p>
              <p className="text-base font-semibold">
                상태:{" "}
                <span
                  className={
                    item.status === "ACTIVE"
                      ? "text-green-600"
                      : item.status === "INACTIVE"
                      ? "text-gray-500"
                      : "text-yellow-600"
                  }
                >
                  {item.status === "ACTIVE"
                    ? "모집중"
                    : item.status === "INACTIVE"
                    ? "숨김"
                    : "승인대기"}
                </span>
              </p>
            </div>

            <div className="flex gap-3 mt-6 flex-wrap">
              <button className="text-base px-4 py-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200">
                수정
              </button>
              <button className="text-base px-4 py-1.5 rounded-md bg-red-100 text-red-700 hover:bg-red-200">
                삭제
              </button>

              {item.status === "ACTIVE" && (
                <button className="text-base px-4 py-1.5 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200">
                  숨기기
                </button>
              )}
              {item.status === "INACTIVE" && (
                <button className="text-base px-4 py-1.5 rounded-md bg-green-100 text-green-700 hover:bg-green-200">
                  다시 노출
                </button>
              )}
              {item.status === "PENDING" && (
                <span className="text-base px-4 py-1.5 rounded-md bg-yellow-100 text-yellow-700">
                  승인 대기중
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassManagePage;

// 📌 요약 카드 컴포넌트
const SummaryCard = ({ label, value }) => (
  <div className="bg-white border rounded-xl p-6 shadow-sm text-center">
    <p className="text-base text-gray-600 mb-2">{label}</p>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
  </div>
);
