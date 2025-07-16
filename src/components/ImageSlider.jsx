import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function ImageSlider({ images = [] }) {
    const [current, setCurrent] = useState(0);

    const prevSlide = () => setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    const nextSlide = () => setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

    if (!images.length) return null;

    return (
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-md">
            <img
                src={images[current]}
                alt={`slide-${current}`}
                className="w-full h-full object-cover transition duration-300"
            />

            {/* 왼쪽 버튼 */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 p-2 rounded-full hover:bg-opacity-80"
            >
                <FaChevronLeft />
            </button>

            {/* 오른쪽 버튼 */}
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-60 p-2 rounded-full hover:bg-opacity-80"
            >
                <FaChevronRight />
            </button>
        </div>
    );
}
