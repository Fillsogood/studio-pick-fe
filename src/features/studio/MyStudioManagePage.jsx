import { useEffect, useState } from "react";
import { deleteStudio, getMyStudios } from "../../lib/studioAPI";
import { useNavigate } from "react-router-dom";

export default function MyStudioManagePage() {
  const [studios, setStudios] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const navigate = useNavigate();

  const filteredStudios =
    statusFilter === "ALL"
      ? studios
      : studios.filter(
          (studio) =>
            studio.status?.toUpperCase().trim() ===
            statusFilter.toUpperCase().trim()
        );
  console.log("전체 스튜디오 목록:", studios);
  console.log("현재 필터:", statusFilter);
  console.log("필터링된 스튜디오:", filteredStudios);
  // 내부에서 상태 enum 정의
  // const StudioStatus = {
  //   APPROVED: "개설대기",
  //   ACTIVE: "활동중",
  // };

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const res = await getMyStudios();
        setStudios(res.data.data);
      } catch (err) {
        console.error("내 스튜디오 불러오기 실패 ❌", err);
      }
    };

    fetchStudios();
  }, []);

  const handleDelete = async (studioId) => {
    const confirmDelete = window.confirm("정말 삭제하시겠어요?");
    if (!confirmDelete) return;
    try {
      await deleteStudio(studioId);
      setStudios((prev) => prev.filter((s) => s.id !== studioId));
    } catch (e) {
      alert("삭제 실패");
      console.error(e);
    }
  };

  return (
    <div className="px-6 py-10">
      <h2 className="text-3xl font-bold mb-6">내 스튜디오 관리</h2>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-4 py-2 rounded-lg border transition
            ${
              statusFilter === "ALL"
                ? "bg-WarmBeige-300 text-black border-WarmBeige-200"
                : "bg-white text-gray-700 border-gray-300 hover:bg-WarmBeige-100"
            }
          `}
        >
          전체
        </button>
        <button
          onClick={() => setStatusFilter("APPROVED")}
          className={`px-4 py-2 rounded-lg border transition
            ${
              statusFilter === "APPROVED"
                ? "bg-WarmBeige-300 text-black border-WarmBeige-200"
                : "bg-white text-gray-700 border-gray-300 hover:bg-WarmBeige-100"
            }
          `}
        >
          개설대기
        </button>
        <button
          onClick={() => setStatusFilter("ACTIVE")}
          className={`px-4 py-2 rounded-lg border transition
            ${
              statusFilter === "ACTIVE"
                ? "bg-WarmBeige-300 text-black border-WarmBeige-200"
                : "bg-white text-gray-700 border-gray-300 hover:bg-WarmBeige-100"
            }
          `}
        >
          활동중
        </button>
      </div>

      <div className="space-y-4">
        {filteredStudios.map((studio) => (
          <div
            key={studio.id}
            className="flex items-center justify-between p-4 rounded-xl shadow bg-white"
          >
            <div className="flex items-center gap-4">
              <img
                src={studio.thumbnailImage}
                alt={studio.name}
                className="w-44 h-36 rounded-xl object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">{studio.name}</h3>
                <p className="text-gray-600">{studio.location}</p>
                <p>₩ {studio.hourlyBaseRate.toLocaleString()}</p>
                <p className="text-gray-500">
                  평점{" "}
                  {studio.averageRating
                    ? `${studio.averageRating} (${studio.reviewCount} 리뷰)`
                    : "0 (0 리뷰)"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {studio.status === "APPROVED" && (
                <button
                  className="bg-WarmBeige-300 hover:bg-WarmBeige-200 text-black px-3 py-1 rounded"
                  onClick={() =>
                    navigate(`/account/studios/${studio.id}/setup`)
                  }
                >
                  개설
                </button>
              )}
              {studio.status === "ACTIVE" && (
                <button
                  className="bg-WarmBeige-300 hover:bg-WarmBeige-200 text-black px-3 py-1 rounded"
                  onClick={() =>
                    navigate(`/account/studios/${studio.id}/setup`)
                  }
                >
                  수정
                </button>
              )}
              <button
                className="bg-red-300 hover:bg-red-200 text-black px-3 py-1 rounded"
                onClick={() => handleDelete(studio.id)}
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
