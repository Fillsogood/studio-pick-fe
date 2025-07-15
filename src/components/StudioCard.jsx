export default function StudioCard({ studio }) {
    return (
        <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="h-40 bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                {/* 썸네일 없으면 대체 텍스트 */}
                {studio.thumbnailUrl ? (
                    <img src={studio.thumbnailUrl} alt={studio.name} className="w-full h-full object-cover" />
                ) : (
                    '대표 이미지 없음'
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg">{studio.name}</h3>
                <p className="text-sm text-gray-500">{studio.location}</p>
                <div className="text-sm mt-1">
                    <span className="text-blue-600 font-semibold">{studio.price.toLocaleString()}원</span> / 시간
                </div>
                <div className="text-sm text-yellow-500">⭐ {studio.rating}</div>
                <button className="mt-2 bg-lime-400 text-white text-sm px-3 py-1 rounded hover:bg-lime-500">
                    상세보기
                </button>
            </div>
        </div>
    );
}
