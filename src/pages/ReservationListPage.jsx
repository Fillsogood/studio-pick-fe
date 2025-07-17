import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import { getMyReservations } from "../lib/reservationAPI";
import {
  getStatusText,
  getStatusColor,
  getActionButtonType,
  RESERVATION_STATUS,
} from "../constants/reservationStatus";

const ReservationListPage = () => {
  const [activeTab, setActiveTab] = useState("studio"); // 'studio' 또는 'workshop'
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'pending', 'confirmed', 'completed', 'cancelled'
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 로그인 상태 확인
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // 세션 스토리지에서 로그인 상태 확인
    return sessionStorage.getItem("isLoggedIn") === "true";
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  // API 연동을 위한 상태
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // 예약 목록 조회 API 호출
  useEffect(() => {
    const fetchReservations = async () => {
      setIsLoading(true);
      setApiError(null);

      try {
        const params = {
          page: currentPage,
          size: 10,
          // status 파라미터 제거 - 모든 예약을 받아온 후 프론트엔드에서 필터링
          // startDate, endDate, studioId는 나중에 추가
        };

        console.log("API 호출 파라미터:", params);
        const response = await getMyReservations(params);

        if (response.data.success) {
          setReservations(response.data.data.reservations);
          setIsLoggedIn(true);
          sessionStorage.setItem("isLoggedIn", "true");
        } else {
          throw new Error(response.data.message || "예약 목록 조회 실패");
        }
      } catch (error) {
        console.error("API 호출 실패:", error);
        setApiError(error.message);

        // 401 에러인 경우 로그아웃 상태로 설정
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
          sessionStorage.removeItem("isLoggedIn"); // 세션 스토리지에서 제거
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, [currentPage]); // activeFilter 의존성 제거

  // 필터링된 예약 목록
  const getFilteredReservations = () => {
    // 로그아웃 상태면 빈 배열 반환
    if (!isLoggedIn) {
      return [];
    }

    // API 데이터 사용
    let allReservations = reservations;

    // 탭에 따른 필터링
    let filtered = allReservations.filter((reservation) => {
      if (activeTab === "studio") {
        return reservation.type === "studio";
      } else {
        return reservation.type === "workshop";
      }
    });

    // 상태 필터
    if (activeFilter !== "all") {
      filtered = filtered.filter((reservation) => {
        switch (activeFilter) {
          case RESERVATION_STATUS.PENDING:
            return reservation.status === "pending";
          case RESERVATION_STATUS.CONFIRMED:
            return reservation.status === "confirmed";
          case "cancelled":
            return ["cancel_requested", "cancelled", "refunded"].includes(
              reservation.status
            );
          case RESERVATION_STATUS.COMPLETED:
            return reservation.status === "completed";
          default:
            return reservation.status === activeFilter;
        }
      });
    }

    // 검색 필터
    if (searchKeyword) {
      filtered = filtered.filter((reservation) => {
        const searchTarget =
          activeTab === "studio"
            ? reservation.studioName
            : reservation.workshopTitle || reservation.studioName;
        return searchTarget.toLowerCase().includes(searchKeyword.toLowerCase());
      });
    }

    return filtered;
  };

  // 예약 취소 처리
  const handleCancelReservation = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    alert("취소 요청 기능은 준비 중입니다.");
  };

  // 리뷰 작성 처리
  const handleWriteReview = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    alert("리뷰 작성 기능은 준비 중입니다.");
  };

  // 다시 예약하기 처리
  const handleRebook = () => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    alert("다시 예약 기능은 준비 중입니다.");
  };

  const getActionButtons = (reservation) => {
    const buttons = [];

    // 상세보기 버튼 (항상 표시)
    buttons.push(
      <Link
        key="detail"
        to={`/reservation/${reservation.id}`}
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors text-center w-24 h-9 flex items-center justify-center"
      >
        상세보기
      </Link>
    );

    // 상태별 액션 버튼 (Enum 기반)
    const actionType = getActionButtonType(reservation.status);

    switch (actionType) {
      case "cancel":
        buttons.push(
          <button
            key="cancel"
            onClick={() => handleCancelReservation(reservation.id)}
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
    }

    return buttons;
  };

  const filteredReservations = getFilteredReservations();

  return (
    <div className="p-8 space-y-8">
      {/* 로그인 모달 */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          {activeTab === "studio" ? "스튜디오 예약 내역" : "공방 예약 내역"}
        </h1>
        <p className="text-gray-600 text-lg">
          예약된 {activeTab === "studio" ? "스튜디오" : "공방"} 목록과 상태를
          확인하실 수 있습니다.
        </p>
      </div>

      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-12">
          <button
            onClick={() => setActiveTab("studio")}
            className={`py-3 px-1 border-b-2 font-medium text-base ${
              activeTab === "studio"
                ? "border-lime-500 text-lime-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            스튜디오 예약
          </button>
          <button
            onClick={() => setActiveTab("workshop")}
            className={`py-3 px-1 border-b-2 font-medium text-base ${
              activeTab === "workshop"
                ? "border-lime-500 text-lime-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            공방 예약
          </button>
        </nav>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 상태 필터 */}
        <div className="flex space-x-3">
          {[
            "all",
            RESERVATION_STATUS.PENDING,
            RESERVATION_STATUS.CONFIRMED,
            "cancelled", // 그룹화된 취소 탭
            RESERVATION_STATUS.COMPLETED,
          ].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentPage(1); // 필터 변경시 첫 페이지로
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

        {/* 검색창 */}
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

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
          <p className="text-gray-500 text-lg mt-4">
            예약 목록을 불러오는 중...
          </p>
        </div>
      )}

      {/* API 에러 메시지 */}
      {apiError && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                API 연결 실패
              </h3>
              <p className="text-sm text-red-700 mt-1">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* 예약 목록 */}
      <div className="space-y-6">
        {!isLoading && filteredReservations.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              {isLoggedIn
                ? "예약 내역이 없습니다."
                : "예약 내역을 찾을 수 없습니다."}
            </p>
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <div
              key={reservation.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row gap-6">
                {/* 이미지 */}
                <div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-gray-200">
                  {activeTab === "studio" && reservation.studioImageUrl ? (
                    <img
                      src={reservation.studioImageUrl}
                      alt={reservation.studioName}
                      className="w-full h-full object-cover"
                    />
                  ) : activeTab === "workshop" &&
                    reservation.workshopImageUrl ? (
                    <img
                      src={reservation.workshopImageUrl}
                      alt={reservation.workshopTitle}
                      className="w-full h-full object-cover"
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

                {/* 텍스트 + 버튼 */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    {/* 제목 + 상태 */}
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

                    {/* 예약 정보 */}
                    <div className="text-base text-gray-600 space-y-2">
                      <p>
                        <span className="font-medium">예약일:</span>{" "}
                        {reservation.date}
                      </p>
                      <p>
                        <span className="font-medium">장소:</span>{" "}
                        {reservation.studioName}
                      </p>
                      <p>
                        <span className="font-medium">
                          {activeTab === "studio" ? "이용" : "수업"} 시간:
                        </span>{" "}
                        {reservation.startTime} - {reservation.endTime}
                      </p>
                      {activeTab === "workshop" && reservation.instructor && (
                        <p>
                          <span className="font-medium">강사:</span>{" "}
                          {reservation.instructor}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">가격:</span> ₩
                        {reservation.totalAmount?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* 버튼 */}
                  <div className="flex justify-end mt-4">
                    <div className="flex gap-2 flex-wrap">
                      {getActionButtons(reservation)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      {filteredReservations.length > 0 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              이전
            </button>
            <button className="px-3 py-2 text-sm font-medium text-white bg-lime-300 border border-lime-300 rounded-md">
              1
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              다음
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ReservationListPage;
