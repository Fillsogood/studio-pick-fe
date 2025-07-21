import { useState } from "react";

const ImageSlider = ({ images }) => {
  const [index, setIndex] = useState(0);

  if (!Array.isArray(images) || images.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
        이미지가 없습니다.
      </div>
    );
  }

  const next = () => setIndex((index + 1) % images.length);
  const prev = () => setIndex((index - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <img
        src={images[index]}
        alt={`slide-${index}`}
        className="w-full h-full object-cover"
        onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-white text-3xl font-bold bg-black bg-opacity-30 p-2 rounded-full"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-white text-3xl font-bold bg-black bg-opacity-30 p-2 rounded-full"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
