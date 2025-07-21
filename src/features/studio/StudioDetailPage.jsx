import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudioDetail } from "../../lib/studioAPI";
import { getStudioReviews, deleteReview } from "../../lib/reviewAPI";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationTriangle, FaHeart } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import ReservationCreateModal from "../../components/ReservationCreateModal";

export default function StudioDetailPage() {
  const { studioId } = useParams();
  const [studio, setStudio] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const isFavorite = studio && favorites.includes(studio.id);
  const { isLoggedIn, user } = useAuth();

  // 리뷰 관련 상태 추가
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(null); // 예약 성공 시 결제 모달로 전달

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

  useEffect(() => {
    const fetchStudio = async () => {
      try {
        const res = await getStudioDetail(studioId);
        console.log("✅ 스튜디오 상세정보 백엔드 응답:", res);
        console.log("✅ 응답의 data:", res.data);
        console.log("✅ 응답의 data.data:", res.data.data);
        setStudio(res.data.data);
      } catch (err) {
        console.error("스튜디오 상세정보 오류:", err);
        setError("스튜디오 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchStudio();
  }, [studioId]);

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

  const handleFavoriteClick = (studioId) => {
    console.log("studioId", studioId);
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      alert("즐겨찾기를 하시려면 로그인이 필요합니다.");
      return;
    }

    navigate("/favorites");
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!studio) return <div>로딩 중...</div>;

  return (
    <div className="p-8 max-w-screen-xl mx-auto relative">
      <div className="md:flex md:gap-6">
        {/* 왼쪽 메인 영역 */}
        <div className="md:flex-1">
          {/* 이미지 */}
          <img
            src={studio.thumbnailImage}
            alt="스튜디오 썸네일"
            className="w-full rounded-xl object-cover max-h-[400px] mb-4"
          />

          {/* 제목 및 위치 */}
          <h2 className="text-3xl font-bold mb-1">{studio.name}</h2>
          <p className="text-gray-500 mb-4">{studio.location}</p>

          {/* 설명 */}
          <h3 className="text-lg font-semibold mt-4 mb-2">소개</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {studio.description}
          </p>

          {/* 시설 안내 */}
          <h3 className="text-lg font-semibold mt-6 mb-2">시설 안내</h3>
          <ul className="text-gray-700">
            {studio.facilities?.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 mb-1">
                <FaCheckCircle className="text-green-500" />
                {item}
              </li>
            ))}
          </ul>

          {/* 주의사항 */}
          <h3 className="text-lg font-semibold mt-6 mb-2">주의사항</h3>
          <ul className="text-gray-700">
            {studio.rules?.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 mb-1">
                <FaExclamationTriangle className="text-yellow-500" />
                {item}
              </li>
            ))}
          </ul>

          {/* 위치 */}
          <h3 className="text-lg font-semibold mt-6 mb-2">위치</h3>
          <p className="text-gray-700">{studio.location}</p>

          {/* 운영자 */}
          <h3 className="text-lg font-semibold mt-6 mb-2">운영자</h3>
          <p className="text-gray-700">{studio.instructor}</p>
        </div>

        {/* 오른쪽 요약 박스 */}
        <div className="hidden md:block md:w-80 md:shrink-0 md:relative">
          <div className="bg-white shadow-lg rounded-lg p-4 border sticky top-20">
            <h3 className="text-xl font-bold mb-2">{studio.name}</h3>
            <p className="text-gray-500 text-sm">{studio.location}</p>
            <p className="text-black font-semibold text-lg mt-2">
              ₩ {studio?.hourlyBaseRate?.toLocaleString()}원 / 시간
            </p>

            <div className="mt-4 space-y-2">
              <p className="text-sm">최대 인원: {studio.maxPeople}명</p>
              <p className="text-sm">
                주말 요금: ₩ {studio.weekendPrice?.toLocaleString()}
              </p>
              <p className="text-sm">
                운영시간: {studio.operatingHours?.openTime} ~{" "}
                {studio.operatingHours?.closeTime}
              </p>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => handleFavoriteClick(studio.id)}
                className="flex items-center space-x-1 text-red-500"
              >
                {isFavorite ? (
                  <AiFillHeart className="text-red-500 inline" size={25} />
                ) : (
                  <AiOutlineHeart className="text-red-500 inline" size={25} />
                )}
              </button>
              <div className="flex gap-2 justify-end mt-4">
                <button
                  onClick={handleReservation}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  예약하기
                </button>
              </div>
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
      <ReservationCreateModal
        isOpen={reservationModalOpen}
        onClose={() => setReservationModalOpen(false)}
        studio={studio}
        onReservationSuccess={handleReservationSuccess}
      />
    </div>
  );
}
