<<<<<<< Updated upstream:src/features/reservation/ReservationListPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginModal from "../../components/LoginModal";
import { getMyReservations, cancelReservation } from "../../lib/reservationAPI";
=======
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoginModal from "../components/LoginModal";
import { getMyReservations } from "../lib/reservationAPI";
>>>>>>> Stashed changes:src/pages/ReservationListPage.jsx
import {
  getStatusText,
  getStatusColor,
  getActionButtonType,
  RESERVATION_STATUS,
} from "../../constants/reservationStatus";
import CancelReservationModal from "../../components/CancelReservationModal";

const ReservationListPage = () => {
  const { isLoggedIn } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ✅ 현재 경로 추적

  const [activeTab, setActiveTab] = useState("studio");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  // ✅ 로그인 안 된 상태 → 모달 최초 1회 띄움
  useEffect(() => {
    if (!isLoggedIn && !showLoginModal) {
      setShowLoginModal(true);
    }
  }, [isLoggedIn]);

  // ✅ 로그인 되어있을 때만 API 호출
  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchReservations = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await getMyReservations({ page: currentPage, size: 10 });
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

<<<<<<< Updated upstream:src/features/reservation/ReservationListPage.jsx
  // 필터링된 예약 목록
=======
  // ✅ 로그인 안 된 상태일 때 모달만 렌더링
  if (!isLoggedIn && showLoginModal) {
    return (
      <LoginModal
        onClose={() => {
          setShowLoginModal(false);
          navigate("/"); // ✕ 닫기 시 메인홈으로
        }}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          // 로그인 성공 시 현재 페이지 유지 (navigate 안 함)
        }}
      />
    );
  }

>>>>>>> Stashed changes:src/pages/ReservationListPage.jsx
  const getFilteredReservations = () => {
    let filtered = reservations;

    filtered = filtered.filter((r) =>
      activeTab === "studio"
        ? r.type === "studio"
        : r.type === "workshop"
    );

    if (activeFilter !== "all") {
      filtered = filtered.filter((r) => {
        if (activeFilter === "cancelled") {
          return ["cancel_requested", "cancelled", "refunded"].includes(r.status);
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

<<<<<<< Updated upstream:src/features/reservation/ReservationListPage.jsx
  // 예약 취소 처리
  const handleCancelReservation = (reservation) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    setSelectedReservation(reservation);
    setShowCancelModal(true);
  };

  // 취소 확인 처리
  const handleCancelConfirm = async (cancelReason) => {
    setIsCancelling(true);

    try {
      const response = await cancelReservation(
        selectedReservation.id,
        cancelReason
      );

      if (response.data.success) {
        // 예약 목록에서 해당 예약의 상태 업데이트
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
=======
  const handleCancelReservation = () => {
    alert("취소 요청 기능은 준비 중입니다.");
>>>>>>> Stashed changes:src/pages/ReservationListPage.jsx
  };

  const handleWriteReview = () => {
    alert("리뷰 작성 기능은 준비 중입니다.");
  };

  const handleRebook = () => {
    alert("다시 예약 기능은 준비 중입니다.");
  };

  const getActionButtons = (reservation) => {
    const buttons = [
      <Link
        key="detail"
        to={`/reservation/${reservation.id}`}
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
      >
        상세보기
      </Link>,
    ];

    const actionType = getActionButtonType(reservation.status);
<<<<<<< Updated upstream:src/features/reservation/ReservationListPage.jsx

    switch (actionType) {
      case "cancel":
        buttons.push(
          <button
            key="cancel"
            onClick={() => handleCancelReservation(reservation)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
          >
            취소 요청
          </button>
        );
        break;

      case "review":
        buttons.push(
          <button
            key="review"
            onClick={() => handleWriteReview(reservation.id)}
            className="bg-lime-300 hover:bg-lime-200 text-black px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
          >
            리뷰 작성
          </button>
        );
        break;
      case "rebook":
        buttons.push(
          <button
            key="rebook"
            onClick={() => handleRebook(reservation)}
            className="bg-lime-300 hover:bg-lime-200 text-black px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
          >
            예약하기
          </button>
        );
        break;
=======
    if (actionType === "cancel") {
      buttons.push(
        <button
          key="cancel"
          onClick={() => handleCancelReservation(reservation.id)}
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
          onClick={() => handleWriteReview(reservation.id)}
          className="bg-lime-300 hover:bg-lime-200 text-black px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
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
          className="bg-lime-300 hover:bg-lime-200 text-black px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
        >
          예약하기
        </button>
      );
>>>>>>> Stashed changes:src/pages/ReservationListPage.jsx
    }

    return buttons;
  };

  const filteredReservations = getFilteredReservations();

  return (
    <div className="p-8 space-y-8">
<<<<<<< Updated upstream:src/features/reservation/ReservationListPage.jsx
      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* 취소 모달 */}
      <CancelReservationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedReservation(null);
        }}
        onConfirm={handleCancelConfirm}
        reservation={selectedReservation}
        isLoading={isCancelling}
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

            <div className="mb-8">
              <svg
                className="w-12 h-12 text-yellow-500 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                로그인이 필요합니다
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                예약 내역을 확인하려면
                <br />
                로그인해주세요
              </p>
            </div>

            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-block bg-lime-300 hover:bg-lime-200 text-black px-8 py-3 rounded-lg text-base font-medium transition-colors w-full"
            >
              로그인하기
            </button>
          </div>
        </div>
      )}

      {/* 페이지 제목 */}
=======
      {/* 제목 */}
>>>>>>> Stashed changes:src/pages/ReservationListPage.jsx
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {activeTab === "studio" ? "스튜디오 예약 내역" : "공방 예약 내역"}
        </h1>
        <p className="text-gray-600 text-lg">
          예약된 {activeTab === "studio" ? "스튜디오" : "공방"} 목록과 상태를 확인하실 수 있습니다.
        </p>
      </div>

      {/* 탭 */}
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

      {/* 필터 + 검색 */}
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

        {/* 검색 */}
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

      {/* 로딩 / 에러 / 목록 */}
      {isLoading ? (
        <div className="text-center py-16">불러오는 중...</div>
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
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    {activeTab === "studio"
                      ? reservation.studioName
                      : reservation.workshopTitle || reservation.studioName}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    날짜: {reservation.date}
                  </p>
                  <p className="text-gray-600 mb-1">
                    시간: {reservation.startTime} - {reservation.endTime}
                  </p>
                  <p className="text-gray-600 mb-1">
                    상태:{" "}
                    <span className={getStatusColor(reservation.status)}>
                      {getStatusText(reservation.status)}
                    </span>
                  </p>
                  <div className="mt-4 flex gap-2">{getActionButtons(reservation)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationListPage;
