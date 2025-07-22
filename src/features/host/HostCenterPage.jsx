import { useNavigate } from "react-router-dom";

const HostCenterPage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center pt-24">
      {/* 제목 */}
      <h1 className="text-4xl font-bold mb-20">호스트 센터</h1>

      {/* 박스 두 개 */}
      <div className="flex gap-24">
        {/* 클래스 관리 */}
        <div
          onClick={() => navigate("/host/classes")}
          className="w-80 h-60 border-2 border-gray-300 bg-WarmBeige-300 rounded-xl flex items-center justify-center text-2xl font-semibold cursor-pointer hover:shadow-xl transition"
        >
          클래스 관리
        </div>

        {/* 스튜디오 관리 */}
        <div
          onClick={() => navigate("/host/studios")}
          className="w-80 h-60 border-2 border-gray-300  bg-WarmBeige-300 rounded-xl flex items-center justify-center text-2xl font-semibold cursor-pointer hover:shadow-xl transition"
        >
          스튜디오 관리
        </div>
      </div>
    </div>
  );
};

export default HostCenterPage;
