import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoginModal from "../../components/LoginModal";
import CancelReservationModal from "../../components/CancelReservationModal";
import { getMyReservations, cancelReservation } from "../../lib/reservationAPI";
import {
  getStatusText,
  getStatusColor,
  getActionButtonType,
  RESERVATION_STATUS,
} from "../../constants/reservationStatus";
import ReservationDetailModal from "../../components/ReservationDetailModal";

const ReservationListPage = () => {
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [activeTab, setActiveTab] = useState("studio");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState(null);
  const [cancelReason, setCancelReason] = useState("단순 변심"); // 혹은 기본값 없이 ""로


  // 예약 목록 조회 API 호출

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn && !showLoginModal) {
      setShowLoginModal(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchReservations = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await getMyReservations({
          page: currentPage,
          size: 10,
        });
        if (response.data.success) {
          setReservations(response.data.data.reservations);
        } else {
          throw new Error(response.data.message || "예약 목록 조회 실패");
        }
      } catch (error) {
        console.error("API 호출 실패:", error);
        setApiError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [isLoggedIn, currentPage, activeFilter]);

  if (!isLoggedIn && showLoginModal) {
    return (
      <LoginModal
        onClose={() => {
          setShowLoginModal(false);
          navigate("/");
        }}
        onLoginSuccess={() => {
          setShowLoginModal(false);
        }}
      />
    );
  }

  const getFilteredReservations = () => {
    let filtered = reservations;

    filtered = filtered.filter((r) =>
      activeTab === "studio" ? r.type === "studio" : r.type === "workshop"
    );

    if (activeFilter !== "all") {
      filtered = filtered.filter((r) => {
        if (activeFilter === "cancelled") {
          return ["cancel_requested", "cancelled", "refunded"].includes(
            r.status
          );
        }
        return r.status === activeFilter;
      });
    }

    if (searchKeyword) {
      filtered = filtered.filter((r) => {
        const target =
          activeTab === "studio"
            ? r.studioName
            : r.workshopTitle || r.studioName;
        return target?.toLowerCase().includes(searchKeyword.toLowerCase());
      });
    }

    return filtered;
  };

  const handleCancelSuccess = (updatedReservationData) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === updatedReservationData.reservationId
          ? { ...reservation, status: updatedReservationData.status }
          : reservation
      )
    );
    alert("예약이 성공적으로 취소 요청되었습니다.");
  };

  // 예약 상세보기 처리
  const handleDetailView = (reservation) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    setSelectedReservationId(reservation.id);
    setShowDetailModal(true);
  };

  const handleCancelReservation = (reservation) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async (cancelReason) => {
    setIsCancelling(true);

    try {
      const response = await cancelReservation(
        selectedReservation.id,
        cancelReason
      );

      if (response.data.success) {
        setReservations((prev) =>
          prev.map((reservation) =>
            reservation.id === selectedReservation.id
              ? { ...reservation, status: "cancel_requested" }
              : reservation
          )
        );

        setShowCancelModal(false);
        setSelectedReservation(null);
        alert("취소 요청이 완료되었습니다.");
      } else {
        throw new Error(response.data.message || "취소 요청에 실패했습니다.");
      }
    } catch (error) {
      console.error("취소 요청 실패:", error);
      alert(error.message || "취소 요청 중 오류가 발생했습니다.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleWriteReview = (reservation) => {
    // 리뷰 작성 페이지로 이동 (예약 정보 전체를 URL 파라미터로 전달)
    const reservationData = encodeURIComponent(JSON.stringify(reservation));
    window.location.href = `/review/write/${reservation.id}?data=${reservationData}`;
  };

  const handleRebook = () => {
    alert("다시 예약 기능은 준비 중입니다.");
  };

  const getActionButtons = (reservation) => {
    const buttons = [];

    // 상세보기 버튼 (항상 표시)
    buttons.push(
      <button
        key="detail"
        onClick={() => handleDetailView(reservation)}
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
      >
        상세보기
      </button>
    );

    const actionType = getActionButtonType(reservation.status);

    if (actionType === "cancel") {
      buttons.push(
        <button
          key="cancel"
          onClick={() => handleCancelReservation(reservation)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
        >
          취소 요청
        </button>
      );
    }
    if (actionType === "review") {
      buttons.push(
        <button
          key="review"
          onClick={() => handleWriteReview(reservation)}
          className="bg-neutral-100 hover:bg-neutral-300 text-black px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
        >
          리뷰 작성
        </button>
      );
    }
    if (actionType === "rebook") {
      buttons.push(
        <button
          key="rebook"
          onClick={() => handleRebook(reservation)}
          className="bg-neutral-100 hover:bg-neutral-300 text-black px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
        >
          예약하기
        </button>
      );
    }

    return buttons;
  };

  const filteredReservations = getFilteredReservations();

  return (
    <div className="p-8 space-y-8">
      <CancelReservationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedReservation(null);
        }}
        onCancelSuccess={handleCancelSuccess}
        reservation={selectedReservation}
        isLoading={isCancelling}
      />

      {/* 예약 상세 모달 */}
      <ReservationDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedReservationId(null);
        }}
        reservationId={selectedReservationId}
        onCancelSuccess={() => {
          // 예약 취소 후 목록 새로고침
          window.location.reload();
        }}
      />

      {/* 로그아웃 상태일 때 중앙 경고 메시지 */}
      {!isLoggedIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-40">
          <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-sm mx-4 relative">
            {/* X 버튼 */}
            <Link
              to="/"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Link>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {activeTab === "studio" ? "스튜디오 예약 내역" : "공방 예약 내역"}
        </h1>
        <p className="text-gray-600 text-lg">
          예약된 {activeTab === "studio" ? "스튜디오" : "공방"} 목록과 상태를
          확인하실 수 있습니다.
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-12">
          {["studio", "workshop"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 font-medium text-base ${
                activeTab === tab
                  ? "border-lime-500 text-lime-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab === "studio" ? "스튜디오 예약" : "공방 예약"}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex space-x-3">
          {[
            "all",
            RESERVATION_STATUS.PENDING,
            RESERVATION_STATUS.CONFIRMED,
            "cancelled",
            RESERVATION_STATUS.COMPLETED,
          ].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1);
              }}
              className={`px-5 py-2 rounded-lg text-base font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-lime-300 text-black shadow-sm"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter === "all"
                ? "전체"
                : filter === "cancelled"
                ? "취소"
                : getStatusText(filter)}
            </button>
          ))}
        </div>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder={`${
                activeTab === "studio" ? "스튜디오명" : "공방명"
              } 검색`}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-transparent text-base"
            />
            <svg
              className="absolute left-3 top-3 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
          <p className="text-gray-500 text-lg mt-4">
            예약 목록을 불러오는 중...
          </p>
        </div>
      ) : apiError ? (
        <div className="text-red-600 py-8 text-center">{apiError}</div>
      ) : filteredReservations.length === 0 ? (
        <div className="text-center py-16">예약 내역이 없습니다.</div>
      ) : (
        <div className="space-y-6">
          {filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* 이미지 영역 */}
                <div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {activeTab === "studio" && reservation.studioImageUrl ? (
                    <img
                      src={reservation.studioImageUrl}
                      alt={reservation.studioName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/default-studio.jpg";
                      }}
                    />
                  ) : activeTab === "workshop" &&
                    reservation.workshopImageUrl ? (
                    <img
                      src={reservation.workshopImageUrl}
                      alt={reservation.workshopTitle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/default-workshop.jpg";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* 정보 영역 */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* 제목 + 상태 배지 */}
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {activeTab === "studio"
                          ? reservation.studioName
                          : reservation.workshopTitle || reservation.studioName}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {getStatusText(reservation.status)}
                      </span>
                    </div>

                    {/* 상세한 예약 정보 */}
                    <div className="text-base text-gray-600 space-y-2">
                      <p>
                        <span className="font-medium">예약일:</span>{" "}
                        {reservation.date}
                      </p>
                      <p>
                        <span className="font-medium">장소:</span>{" "}
                        {activeTab === "studio"
                          ? reservation.studioName
                          : reservation.workshopTitle || reservation.studioName}
                      </p>
                      <p>
                        <span className="font-medium">
                          {activeTab === "studio" ? "이용" : "수업"} 시간:
                        </span>{" "}
                        {reservation.startTime} - {reservation.endTime}
                      </p>
                      {reservation.totalAmount && (
                        <p>
                          <span className="font-medium">가격:</span> ₩
                          {reservation.totalAmount.toLocaleString()}
                        </p>
                      )}
                      {activeTab === "workshop" && reservation.instructor && (
                        <p>
                          <span className="font-medium">강사:</span>{" "}
                          {reservation.instructor}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 버튼 영역 - 오른쪽 하단 */}
                  <div className="mt-4 flex gap-2 justify-end">
                    {getActionButtons(reservation)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {filteredReservations.length > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={filteredReservations.length < 10}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ReservationListPage;
