import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudioDetail } from "../../lib/studioAPI";
import { getStudioReviews, deleteReview } from "../../lib/reviewAPI";
import ImageSlider from "../../components/ImageSlider";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import StudioReservationModal from "../../components/StudioReservationModal";

export default function StudioDetailPage() {
  const { studioId } = useParams();
  const navigate = useNavigate();
  const [studio, setStudio] = useState(null);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const isFavorite = studio && favorites.includes(studio.id);
  const { isLoggedIn, user } = useAuth();

  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  const handleReservation = () => {
    setReservationModalOpen(true);
  };
  const handlePayment = () => {
    alert("결제 기능은 아직 준비 중이에요");
  };

  // 혜은 - 리뷰 수정/삭제 함수들
  const handleEditReview = (review) => {
    const reviewData = encodeURIComponent(
      JSON.stringify({
        rating: review.rating,
        comment: review.comment,
        imageUrls: review.imageUrls || [],
      })
    );
    navigate(`/review/edit/${review.id}?reviewData=${reviewData}`);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await deleteReview(reviewId);
      alert("리뷰가 삭제되었습니다.");
      // 리뷰 목록 새로고침
      const res = await getStudioReviews(studioId, { page: 1, size: 10 });
      setReviews(res.data?.data || []);
    } catch (error) {
      console.error("리뷰 삭제 오류:", error);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  // 예약 성공 시 결제 모달로 연결 (임시: alert)
  const handleReservationSuccess = (reservationData) => {
    setReservationModalOpen(false);
    setPendingReservation(reservationData);
    alert("예약이 생성되었습니다! 결제 모달로 연결 예정");
    // TODO: 결제 모달 띄우기
  };

  // 혜은 - 리뷰 데이터 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      if (!studioId) return;

      setReviewsLoading(true);
      setReviewsError(null);

      try {
        console.log("🔍 요청하는 studioId:", studioId);
        console.log("🔍 요청 URL:", `/api/reviews/studio/${studioId}`);
        const res = await getStudioReviews(studioId, { page: 1, size: 10 });
        console.log("✅ 스튜디오 리뷰 백엔드 응답:", res);
        console.log("✅ 리뷰 데이터:", res.data?.data);
        console.log("✅ 첫 번째 리뷰:", res.data?.data?.[0]);
        console.log(
          "✅ 첫 번째 리뷰의 imageUrls:",
          res.data?.data?.[0]?.imageUrls
        );
        setReviews(res.data?.data || []);
      } catch (err) {
        console.error("스튜디오 리뷰 오류:", err);
        console.error("에러 응답:", err.response?.data);
        console.error("에러 상태:", err.response?.status);
        console.error("에러 헤더:", err.response?.headers);

        if (err.response?.status === 401) {
          setReviewsError("리뷰를 보려면 로그인이 필요합니다.");
        } else if (err.response?.status === 400) {
          setReviewsError(
            "잘못된 요청입니다: " +
              (err.response?.data?.message || "알 수 없는 오류")
          );
        } else {
          setReviewsError("리뷰를 불러오는데 실패했습니다.");
        }
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [studioId]);

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await getStudioDetail(studioId);
        console.log("✅ 스튜디오 리뷰 백엔드 응답:", res);
        console.log("✅ 리뷰 데이터:", res.data?.data);
        console.log("✅ 첫 번째 리뷰:", res.data?.data?.[0]);
        console.log(
          "✅ 첫 번째 리뷰의 imageUrls:",
          res.data?.data?.[0]?.imageUrls
        );
        setStudio(res.data.data);
      } catch (err) {
        console.error("스튜디오 오류:", err);
        setError("스튜디오 정보를 불러오는데 실패했습니다.");
      }
    };
    fetchStudio();
  }, [studioId]);

  const weekdayOptions = [
    { label: "월", value: "mon" },
    { label: "화", value: "tue" },
    { label: "수", value: "wed" },
    { label: "목", value: "thu" },
    { label: "금", value: "fri" },
    { label: "토", value: "sat" },
    { label: "일", value: "sun" },
  ];

  const handleFavoriteClick = () => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("즐겨찾기를 하시려면 로그인이 필요합니다.");
      return;
    }
    navigate("/favorites");
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!studio) return <div>로딩 중...</div>;

  const facilities = studio.facilities ? studio.facilities.split(",") : [];
  const rules = studio.rules ? studio.rules.split("\n") : [];

  return (
    <div className="p-8 max-w-screen-xl mx-auto relative">
      <div className="md:flex md:gap-8">
        {/* 왼쪽 메인 */}
        <div className="md:flex-1">
          {/* 이미지 슬라이더 */}
          <ImageSlider
            images={[studio.thumbnailImage, ...(studio.imageUrls || [])]}
          />

          {/* 제목/위치 */}
          <h2 className="text-3xl font-bold mt-4">{studio.name}</h2>
          <p className="text-gray-500 mb-4">{studio.location}</p>

          {/* 설명 */}
          <h3 className="text-xl font-semibold mt-6 mb-2">소개</h3>
          <p className="text-gray-700 whitespace-pre-line">
            {studio.description}
          </p>

          {/* 편의시설 */}
          <h3 className="text-xl font-semibold mt-6 mb-2">편의시설</h3>
          <ul className="grid grid-cols-2 gap-2 text-gray-700">
            {facilities.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <FaCheckCircle className="text-WarmBeige-300" />
                {item.trim()}
              </li>
            ))}
          </ul>

          {/* 주의사항 */}
          <h3 className="text-xl font-semibold mt-6 mb-2">주의사항</h3>
          <ul className="list-disc ml-6 text-gray-700">
            {rules.map((item, idx) => (
              <li key={idx}>{item.trim()}</li>
            ))}
          </ul>

          {/* 위치 */}
          <h3 className="text-xl font-semibold mt-6 mb-2">위치</h3>
          <p className="text-gray-700">{studio.location}</p>

          {/* 운영자 */}
          <h3 className="text-xl font-semibold mt-6 mb-2">운영자</h3>
          <p className="text-gray-700">
            {studio.instructorName || "정보 없음"}
          </p>
        </div>

        {/* 오른쪽 요약 박스 */}
        <div className="hidden md:block md:w-80 shrink-0">
          <div className="bg-white border shadow-md p-4 sticky top-20 rounded-lg">
            <h3 className="text-xl font-bold">{studio.name}</h3>
            <p className="text-gray-500 text-sm">{studio.location}</p>

            <div className="mt-4 space-y-1 text-sm text-gray-700">
              <p>
                <strong>요금:</strong> {studio.hourlyBaseRate?.toLocaleString()}
                원 / 시간
              </p>
              <p>
                <strong>주말:</strong> {studio.weekendPrice?.toLocaleString()}원
              </p>
              <p>
                <strong>인원:</strong> 최대 {studio.maxPeople}명
              </p>
              {studio.operatingHours?.length > 0 && (
                <div className="mt-4">
                  {/* 운영 요일 */}
                  <h3 className="text-lg font-semibold mb-1">운영 요일</h3>
                  <p className="text-gray-700">
                    {studio.operatingHours
                      .map(
                        (op) =>
                          weekdayOptions.find(
                            (w) => w.value === op.weekday.toLowerCase()
                          )?.label || op.weekday
                      )
                      .join(", ")}
                  </p>

                  {/* 운영 시간 */}
                  <h3 className="text-lg font-semibold mt-4 mb-1">운영 시간</h3>
                  <p className="text-gray-700">
                    {studio.operatingHours[0].openTime} ~{" "}
                    {studio.operatingHours[0].closeTime}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={handleFavoriteClick}
                className="flex items-center space-x-1 text-red-500"
              >
                {isFavorite ? (
                  <AiFillHeart size={24} />
                ) : (
                  <AiOutlineHeart size={24} />
                )}
              </button>
              <button
                onClick={() => setShowModal(true)} // ← 이 부분을 추가!
                className="bg-WarmBeige-300 hover:bg-WarmBeige-200 text-black px-4 py-2 rounded-lg"
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 리뷰 섹션 -혜은 */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">리뷰</h3>

        {reviewsLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-500 mt-2">리뷰를 불러오는 중...</p>
          </div>
        ) : reviewsError ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">{reviewsError}</p>
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:text-blue-600 underline"
            >
              로그인하기
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            아직 리뷰가 없습니다.
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {review.nickname?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.nickname}
                      </p>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-lg ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-500 ml-2">
                          {review.rating}점
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    {/* 로그인한 사용자가 리뷰 작성자인 경우에만 수정/삭제 버튼 표시 */}
                    {isLoggedIn && user && review.userId === user.id && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-sm text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 whitespace-pre-line">
                  {review.comment}
                </p>

                {/* 리뷰 이미지들 */}
                {(() => {
                  console.log(
                    "리뷰 ID:",
                    review.id,
                    "imageUrls:",
                    review.imageUrls
                  );
                  return review.imageUrls && review.imageUrls.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {review.imageUrls.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`리뷰 이미지 ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            console.log("이미지 로드 실패:", imageUrl);
                            e.target.src = "/default-image.jpg";
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">이미지 없음</div>
                  );
                })()}
              </div>
            ))}
          </div>
        )}
      </div>
      <StudioReservationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        studio={studio}
        onReservationSuccess={handleReservationSuccess}
      />
    </div>
  );
}
