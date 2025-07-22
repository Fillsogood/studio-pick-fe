import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getClassDetail } from "../../lib/classAPI";
import { getWorkshopReviews, deleteReview } from "../../lib/reviewAPI";
import { useAuth } from "../../hooks/useAuth";
import ImageSlider from "../workshop/components/ImageSlider";
import WorkshopReservationModal from "../../components/WorkshopReservationModal";

const ClassDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const { isLoggedIn, user } = useAuth();

  // 혜은 - 리뷰 관련 상태들
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);

  // 예약 모달 관련 상태
  const [reservationModalOpen, setReservationModalOpen] = useState(false);

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
      const res = await getWorkshopReviews(id, { page: 1, size: 10 });
      setReviews(res.data?.data || []);
    } catch (error) {
      console.error("리뷰 삭제 오류:", error);
      alert("리뷰 삭제에 실패했습니다.");
    }
  };

  // 예약 관련 함수들
  const handleReservationClick = () => {
    if (!isLoggedIn) {
      alert("예약을 하시려면 로그인이 필요합니다.");
      return;
    }
    setReservationModalOpen(true);
  };

  const handleReservationSuccess = (reservationData) => {
    setReservationModalOpen(false);
    alert("공방 예약이 완료되었습니다!");
    // 필요시 예약 목록 페이지로 이동하거나 다른 처리
  };

  // 혜은 - 리뷰 데이터 가져오기
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      setReviewsLoading(true);
      setReviewsError(null);

      try {
        console.log("🔍 요청하는 classId:", id);
        console.log("🔍 요청 URL:", `/api/reviews/class/${id}`);
        const res = await getWorkshopReviews(id, { page: 1, size: 10 });
        console.log("✅ 클래스 리뷰 백엔드 응답:", res);
        console.log("✅ 리뷰 데이터:", res.data?.data);
        console.log("✅ 첫 번째 리뷰:", res.data?.data?.[0]);
        console.log(
          "✅ 첫 번째 리뷰의 imageUrls:",
          res.data?.data?.[0]?.imageUrls
        );
        setReviews(res.data?.data || []);
      } catch (err) {
        console.error("클래스 리뷰 오류:", err);
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
          setReviewsError(
            "리뷰를 불러오는 중 오류가 발생했습니다: " +
              (err.response?.data?.message || err.message || "알 수 없는 오류")
          );
        }
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    getClassDetail(id).then((res) => {
      console.log("클래스 데이터 응답:", res.data);
      setClassData(res.data.data);
    });
  }, [id]);

  if (!classData) return <div className="text-center py-20">로딩 중...</div>;

  const {
    title,
    description,
    price,
    date,
    startHour,
    startMinute,
    endHour,
    endMinute,
    instructor,
    address,
    thumbnailUrl,
    imageUrls,
  } = classData;

  return (
    <div className="max-w-[1100px] mx-auto py-10 px-4">
      {/* 상단 두 컬럼 영역 */}
      <div className="flex items-start gap-10 mb-12">
        {/* 이미지 영역 - 슬라이더 */}
        <div className="flex-shrink-0 w-[600px] h-[400px] rounded-xl overflow-hidden bg-gray-100 border shadow-md">
          {imageUrls && imageUrls.length > 0 ? (
            <ImageSlider
              images={imageUrls.map((url) => encodeURI(url.trim()))}
            />
          ) : thumbnailUrl && thumbnailUrl.trim() !== "" ? (
            <img
              src={encodeURI(thumbnailUrl.trim())}
              alt="대표 이미지"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              이미지가 없습니다.
            </div>
          )}
        </div>

        {/* 상세 정보 영역 */}
        <div className="flex-1 max-w-[480px]">
          <h1 className="text-4xl font-extrabold mb-4">{title}</h1>
          <p className="text-lg text-gray-700 mb-8">{description}</p>

          <div className="text-base text-gray-800 space-y-3 mb-8 leading-relaxed">
            <p>
              <span className="font-semibold">주소:</span> {address}
            </p>
            <p>
              <span className="font-semibold">날짜:</span> {date}
            </p>
            <p>
              <span className="font-semibold">시간:</span> {startHour}시{" "}
              {startMinute}분 ~ {endHour}시 {endMinute}분
            </p>
            <p>
              <span className="font-semibold">강사:</span> {instructor}
            </p>
          </div>

          <div className="text-3xl font-extrabold text-orange-600 mb-10">
            가격: {price ? price.toLocaleString() + "원" : "가격 미정"}
          </div>

          <button
            onClick={handleReservationClick}
            className="w-full py-4 bg-black text-white text-xl rounded-md hover:bg-gray-800 transition"
          >
            예약하기
          </button>
        </div>
      </div>

      {/* 기존 레이아웃 (병규 코드) 
      <div className="max-w-[1100px] mx-auto flex items-start gap-10 py-10 px-4">
        <div className="flex-shrink-0 w-[600px] h-[400px] rounded-xl overflow-hidden bg-gray-100 border shadow-md">
          {imageUrls && imageUrls.length > 0 ? (
            <ImageSlider images={imageUrls.map((url) => encodeURI(url.trim()))} />
          ) : thumbnailUrl && thumbnailUrl.trim() !== "" ? (
            <img
              src={encodeURI(thumbnailUrl.trim())}
              alt="대표 이미지"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              이미지가 없습니다.
            </div>
          )}
        </div>
      </div>
      */}

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

      {/* 예약 모달 */}
      {reservationModalOpen && classData && (
        <WorkshopReservationModal
          isOpen={reservationModalOpen}
          onClose={() => setReservationModalOpen(false)}
          workshop={classData}
          onReservationSuccess={handleReservationSuccess}
        />
      )}
    </div>
  );
};

export default ClassDetailPage;
