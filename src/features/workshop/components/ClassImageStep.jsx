import { useState } from "react";
import { uploadClassImages, deleteClassImages } from "../../../lib/classAPI";

const ClassImageStep = ({ onNext, onBack }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleDrop = async (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    await uploadFiles(files);
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    await uploadFiles(files);
  };

  const uploadFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      const res = await uploadClassImages(files);
      const urls = res.data?.data;

      console.log("📦 업로드 응답:", urls);

      if (!urls) {
        alert("업로드 응답이 비어있습니다.");
        return;
      }

      if (Array.isArray(urls)) {
        setImages((prev) => [...prev, ...urls]);
      } else if (typeof urls === "string") {
        setImages((prev) => [...prev, urls]);
      } else {
        console.error("예상치 못한 형식의 응답입니다:", urls);
      }
    } catch (err) {
      console.error("업로드 실패", err);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (url) => {
    try {
      await deleteClassImages([url]); // S3에서 실제 삭제
      setImages((prev) => prev.filter((img) => img !== url));
    } catch (err) {
      console.error("이미지 삭제 실패", err);
      alert("이미지 삭제에 실패했습니다.");
    }
  };

  const handleNext = () => {
    if (images.length === 0) return alert("이미지를 1장 이상 업로드해주세요.");
    onNext(images); // 대표 이미지 포함 이미지 목록 전달
  };

  return (
    <div className="px-4 pt-10 max-w-3xl mx-auto">
      <p className="text-sm text-gray-500 mb-2">
        <strong className="text-black">TIP</strong> 사진을 꼭 눌러 드래그하면
        순서를 바꿀 수 있어요.
      </p>

      <div
        className="grid grid-cols-3 gap-3 mb-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {images.map((url, i) => (
          <div
            key={url}
            className="relative group border rounded overflow-hidden"
          >
            <img
              src={encodeURI(url)}
              alt="uploaded"
              className="w-full h-[160px] object-cover"
            />
            <button
              onClick={() => handleRemove(url)}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs rounded px-2"
            >
              삭제
            </button>
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-yellow-500 text-white text-xs rounded px-2">
                대표사진
              </span>
            )}
          </div>
        ))}

        {images.length < 20 && (
          <label className="flex items-center justify-center h-[160px] border-2 border-dashed rounded cursor-pointer">
            <input type="file" multiple hidden onChange={handleFileSelect} />
            <span className="text-sm text-gray-500">+ {images.length}/20</span>
          </label>
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="text-sm px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          이전
        </button>

        <button
          disabled={uploading}
          onClick={handleNext}
          className="text-sm px-4 py-2 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ClassImageStep;
