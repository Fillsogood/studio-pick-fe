import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginModal from "../components/LoginModal";

const ReservationListPage = () => {
  const [activeTab, setActiveTab] = useState("studio"); // 'studio' 또는 'class'
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'pending', 'confirmed', 'completed', 'cancelled'
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 로그인 상태 확인
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 임시로 true로 설정
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("현재 토큰:", token); // 디버깅용
    if (token) {
      setIsLoggedIn(true);
      console.log("로그인 상태: 로그인됨"); // 디버깅용
    } else {
      setIsLoggedIn(false);
      console.log("로그인 상태: 로그아웃됨"); // 디버깅용
    }
  }, []);

  // 목업 데이터 - 스튜디오 예약
  const mockStudioReservations = [
    {
      id: 1,
      status: "confirmed",
      studioName: "스튜디오 A",
      reservationDate: "2024-01-20",
      startTime: "14:00",
      endTime: "16:00",
      location: "서울 강남구 테헤란로 123",
      price: 50000,
      paymentStatus: "결제완료",
    },
    {
      id: 2,
      status: "pending",
      studioName: "스튜디오 B",
      reservationDate: "2024-01-25",
      startTime: "10:00",
      endTime: "12:00",
      location: "서울 마포구 홍대로 45",
      price: 80000,
      paymentStatus: "결제완료",
    },
    {
      id: 3,
      status: "completed",
      studioName: "스튜디오 C",
      reservationDate: "2024-01-15",
      startTime: "18:00",
      endTime: "20:00",
      location: "서울 성동구 왕십리로 88",
      price: 120000,
      paymentStatus: "결제완료",
    },
    {
      id: 4,
      status: "cancelled",
      studioName: "스튜디오 D",
      reservationDate: "2024-01-10",
      startTime: "09:00",
      endTime: "11:00",
      location: "경기도 가평군 청평면",
      price: 90000,
      paymentStatus: "환불완료",
    },
  ];

  // 목업 데이터 - 클래스 예약
  const mockClassReservations = [
    {
      id: 1,
      status: "confirmed",
      className: "포토그래피 기초 마스터 클래스",
      reservationDate: "2024-01-15",
      classDate: "2024-01-20",
      startTime: "14:00",
      endTime: "16:00",
      location: "서울 강남구 테헤란로 123",
      instructor: "김민준 사진작가",
      price: 55000,
      paymentStatus: "결제완료",
    },
    {
      id: 2,
      status: "pending",
      className: "제품 사진 촬영 워크샵",
      reservationDate: "2024-01-10",
      classDate: "2024-01-25",
      startTime: "10:00",
      endTime: "13:00",
      location: "서울 마포구 홍대로 45",
      instructor: "이지은 상업 사진작가",
      price: 75000,
      paymentStatus: "결제완료",
    },
    {
      id: 3,
      status: "completed",
      className: "인물 사진 포트레이트 클래스",
      reservationDate: "2024-01-05",
      classDate: "2024-01-15",
      startTime: "13:00",
      endTime: "17:00",
      location: "서울 성동구 왕십리로 88",
      instructor: "박서연 포트레이트 전문가",
      price: 120000,
      paymentStatus: "결제완료",
    },
  ];

  // 필터링된 예약 목록
  const getFilteredReservations = () => {
    // 로그아웃 상태면 빈 배열 반환
    if (!isLoggedIn) {
      return [];
    }

    const reservations =
      activeTab === "studio" ? mockStudioReservations : mockClassReservations;

    let filtered = reservations;

    // 상태 필터
    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.status === activeFilter
      );
    }

    // 검색 필터
    if (searchKeyword) {
      filtered = filtered.filter((reservation) => {
        const searchTarget =
          activeTab === "studio"
            ? reservation.studioName
            : reservation.classTitle;
        return searchTarget.toLowerCase().includes(searchKeyword.toLowerCase());
      });
    }

    return filtered;
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "대기중",
      confirmed: "확정",
      completed: "완료",
      cancelled: "취소",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colorMap[status] || "bg-gray-100 text-gray-800";
  };

  // 예약 취소 처리
  const handleCancelReservation = (reservationId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    alert("취소 요청 기능은 준비 중입니다.");
  };

  // 리뷰 작성 처리
  const handleWriteReview = (reservationId) => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    alert("리뷰 작성 기능은 준비 중입니다.");
  };

  // 다시 예약하기 처리
  const handleRebook = (reservation) => {
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
        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors text-center w-37"
      >
        상세보기
      </Link>
    );

    // 상태별 액션 버튼
    switch (reservation.status) {
      case "confirmed":
      case "pending":
        buttons.push(
          <button
            key="cancel"
            onClick={() => handleCancelReservation(reservation.id)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors text-center w-37"
          >
            취소 요청
          </button>
        );
        break;
      case "completed":
        buttons.push(
          <button
            key="review"
            onClick={() => handleWriteReview(reservation.id)}
            className="bg-lime-300 hover:bg-lime-200 text-black px-4 py-2 rounded text-sm font-medium transition-colors text-center w-37"
          >
            리뷰 작성
          </button>
        );
        break;
      case "cancelled":
        buttons.push(
          <button
            key="rebook"
            onClick={() => handleRebook(reservation)}
            className="bg-lime-300 hover:bg-lime-200 text-black px-4 py-2 rounded text-sm font-medium transition-colors text-center w-37"
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
          {activeTab === "studio" ? "스튜디오 예약 내역" : "클래스 예약 내역"}
        </h1>
        <p className="text-gray-600 text-lg">
          예약된 {activeTab === "studio" ? "스튜디오" : "클래스"} 목록과 상태를
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
            onClick={() => setActiveTab("class")}
            className={`py-3 px-1 border-b-2 font-medium text-base ${
              activeTab === "class"
                ? "border-lime-500 text-lime-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            클래스 예약
          </button>
        </nav>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* 상태 필터 */}
        <div className="flex space-x-3">
          {["all", "pending", "confirmed", "completed", "cancelled"].map(
            (filter) => (
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
                {filter === "all" ? "전체" : getStatusText(filter)}
              </button>
            )
          )}
        </div>

        {/* 검색창 */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder={`${
                activeTab === "studio" ? "스튜디오명" : "클래스명"
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

      {/* 예약 목록 */}
      <div className="space-y-6">
        {filteredReservations.length === 0 ? (
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
              className="bg-white rounded-xl shadow-md border border-gray-200 p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {getStatusText(reservation.status)}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900">
                      {activeTab === "studio"
                        ? reservation.studioName
                        : reservation.classTitle}
                    </h3>
                  </div>

                  <div className="text-base text-gray-600 space-y-2">
                    <p>
                      <span className="font-medium">예약일:</span>{" "}
                      {activeTab === "studio"
                        ? reservation.date
                        : reservation.date}
                    </p>
                    <p>
                      <span className="font-medium">장소:</span>{" "}
                      {activeTab === "studio"
                        ? reservation.studioName
                        : reservation.studioName}
                    </p>
                    <p>
                      <span className="font-medium">
                        {activeTab === "studio" ? "이용" : "수업"} 시간:
                      </span>{" "}
                      {reservation.date} ({reservation.startTime}-
                      {reservation.endTime})
                    </p>
                    {activeTab === "class" && (
                      <p>
                        <span className="font-medium">강사:</span>{" "}
                        {reservation.instructor}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">가격:</span> ₩
                      {(activeTab === "studio"
                        ? reservation.totalAmount
                        : reservation.amount
                      )?.toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">상태:</span>{" "}
                      {getStatusText(reservation.status)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {getActionButtons(reservation)}
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
