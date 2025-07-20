import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { createReview } from "../../lib/reviewAPI";

const ReviewWritePage = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [reservation, setReservation] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  // URL 파라미터에서 예약 정보 가져오기
  useEffect(() => {
    const reservationData = searchParams.get("data");
    if (reservationData) {
      try {
        const parsedReservation = JSON.parse(
          decodeURIComponent(reservationData)
        );
        setReservation(parsedReservation);
        console.log("URL에서 받은 예약 정보:", parsedReservation); // 디버깅용
      } catch (error) {
        console.error("예약 정보 파싱 실패:", error);
        alert("예약 정보를 불러올 수 없습니다.");
        navigate("/reservations");
      }
    } else {
      alert("예약 정보가 없습니다.");
      navigate("/reservations");
    }
    setIsLoading(false);
  }, [searchParams, navigate]);

  // 이미지 파일 선택 처리
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);

    // 파일 개수 제한 (최대 5장)
    if (images.length + files.length > 5) {
      alert("최대 5장까지만 업로드 가능합니다.");
      return;
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        alert(`${file.name}은(는) 10MB를 초과합니다.`);
        return false;
      }
      return true;
    });

    // 이미지 파일만 허용
    const imageFiles = validFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== validFiles.length) {
      alert("이미지 파일만 업로드 가능합니다.");
    }

    // 이미지 URL 생성
    const newImageUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImageUrls]);
  };

  // 이미지 제거
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 리뷰 제출
  const handleSubmit = async () => {
    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }
    if (!comment.trim()) {
      alert("리뷰 내용을 작성해주세요.");
      return;
    }

    // 예약 정보 확인
    if (!reservation) {
      alert("예약 정보를 불러올 수 없습니다.");
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        type: isWorkshop ? "workshop" : "studio",
        targetId: isWorkshop ? reservation.workshopId : reservation.studioId,
        rating: rating,
        comment: comment.trim(),
        imageUrls: images.length > 0 ? images.join(",") : "", // 백엔드 API 스펙에 맞게 문자열로 전송
      };

      console.log("리뷰 데이터:", reviewData); // 디버깅용
      console.log("예약 정보:", reservation); // 디버깅용

      const response = await createReview(reviewData);
      console.log("리뷰 작성 응답:", response); // 디버깅용

      alert("리뷰가 작성되었습니다!");
      navigate("/reservations");
    } catch (error) {
      console.error("리뷰 작성 실패:", error);
      console.error("에러 상세:", error.response?.data); // 백엔드 에러 응답 확인

      if (error.response?.status === 401) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else if (error.response?.status === 400) {
        alert(
          "잘못된 요청입니다: " +
            (error.response?.data?.message || "알 수 없는 오류")
        );
      } else {
        alert(
          "리뷰 작성에 실패했습니다: " + (error.message || "알 수 없는 오류")
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-4">예약 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  const isWorkshop = reservation?.type === "workshop";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isWorkshop ? "공방 리뷰 작성" : "스튜디오 리뷰 작성"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {isWorkshop
                  ? reservation?.workshopTitle
                  : reservation?.studioName}{" "}
                • {reservation?.date}
              </p>
            </div>
            <button
              onClick={() => navigate("/reservations")}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* 예약 정보 카드 */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-start space-x-4">
              {/* 이미지 */}
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                {isWorkshop && reservation?.workshopImageUrl ? (
                  <img
                    src={reservation.workshopImageUrl}
                    alt={reservation.workshopTitle}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-workshop.jpg";
                    }}
                  />
                ) : !isWorkshop && reservation?.studioImageUrl ? (
                  <img
                    src={reservation.studioImageUrl}
                    alt={reservation.studioName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/default-studio.jpg";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-500"
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

              {/* 예약 정보 */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {isWorkshop
                    ? reservation?.workshopTitle
                    : reservation?.studioName}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {reservation?.date} • {reservation?.startTime} -{" "}
                  {reservation?.endTime}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {isWorkshop ? "공방 클래스" : "스튜디오"} •{" "}
                    {reservation?.peopleCount}명
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    ₩{reservation?.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              리뷰를 작성해주세요
            </h2>
            <p className="text-sm text-gray-600">
              소중한 경험을 리뷰로 남겨주세요!
            </p>
          </div>

          {/* 별점 평가 */}
          <div className="bg-white rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              별점 평가 *
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  } hover:text-yellow-400 transition-colors`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2 text-center">
              {rating > 0 && `${rating}점을 선택하셨습니다.`}
            </p>
          </div>

          {/* 리뷰 내용 */}
          <div className="bg-white rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              리뷰 내용 *
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="이용 후기를 작성해주세요..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={1000}
            />
            <p className="text-sm text-gray-500 mt-2">
              {comment.length}/1000자
            </p>
          </div>

          {/* 이미지 업로드 */}
          <div className="bg-white rounded-lg p-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              사진 첨부 (선택)
            </label>

            {/* 이미지 미리보기 */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {images.map((imageUrl, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imageUrl}
                      alt={`업로드 이미지 ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 파일 업로드 영역 */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-gray-500">
                <div className="text-3xl mb-2">📷</div>
                <p>사진을 추가해 주세요</p>
                <p className="text-sm text-gray-400 mt-1">
                  최대 5장, 10MB 이하
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting || rating === 0 || !comment.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {submitting ? "작성 중..." : "리뷰 등록"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewWritePage;
