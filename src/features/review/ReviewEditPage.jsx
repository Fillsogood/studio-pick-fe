import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { uploadReviewImages, updateReview } from "../../lib/reviewAPI";

export default function ReviewEditPage() {
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 폼 상태
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // URL 파라미터에서 리뷰 데이터 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reviewDataStr = urlParams.get("reviewData");

    if (reviewDataStr) {
      try {
        const reviewData = JSON.parse(decodeURIComponent(reviewDataStr));
        setRating(reviewData.rating);
        setComment(reviewData.comment);
        setImageUrls(reviewData.imageUrls || []);
      } catch (err) {
        console.error("리뷰 데이터 파싱 오류:", err);
        setError("리뷰 데이터를 불러오는데 실패했습니다.");
      }
    } else {
      setError("리뷰 데이터가 없습니다.");
    }
  }, [reviewId]);

  // 새 이미지 선택 처리
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);

    // 미리보기 URL 생성
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // 이미지 제거
  const removeImage = (index, isNew = false) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // 리뷰 수정 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    setSubmitting(true);

    try {
      // 새 이미지들 업로드
      let uploadedImageUrls = [];
      if (newImages.length > 0) {
        const uploadResponse = await uploadReviewImages(newImages);
        uploadedImageUrls = uploadResponse.data.data;
      }

      // 기존 이미지 URL들과 새로 업로드된 이미지 URL들 합치기
      const allImageUrls = [...imageUrls, ...uploadedImageUrls];

      // 리뷰 수정
      await updateReview(reviewId, {
        rating,
        comment,
        imageUrl: allImageUrls.join(","), // 백엔드에서 단수형으로 받으므로 콤마로 구분
      });

      alert("리뷰가 수정되었습니다.");
      navigate(-1); // 이전 페이지로 돌아가기
    } catch (err) {
      console.error("리뷰 수정 오류:", err);
      alert("리뷰 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-2">리뷰를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6">리뷰 수정</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 평점 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                평점
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">{rating}점</p>
            </div>

            {/* 리뷰 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                리뷰 내용
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="리뷰 내용을 입력해주세요..."
                required
              />
            </div>

            {/* 기존 이미지들 */}
            {imageUrls.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기존 이미지
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`기존 이미지 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, false)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 새 이미지 업로드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                새 이미지 추가
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* 새 이미지 미리보기 */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`새 이미지 ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, true)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 버튼들 */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {submitting ? "수정 중..." : "수정하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
