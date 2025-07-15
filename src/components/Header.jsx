import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { User2 } from "lucide-react";
import LoginModal from "../components/LoginModal";

const Header = () => {
  const navigate = useNavigate();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // mount 시 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <header className="w-full h-16 bg-lime-300 flex items-center justify-between px-6 shadow-md fixed top-0 z-50">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Studio Pick"
            className="h-24 w-24 object-contain"
          />
        </Link>

        <div className="flex-1 px-6">
          <input
            type="text"
            placeholder="스튜디오 검색"
            className="w-full max-w-xl px-4 py-2 rounded-md border focus:outline-none focus:ring focus:ring-yellow-300"
          />
        </div>

        {/* 로그인 상태에 따라 표시 */}
        <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
          <User2 size={20} />
          {isLoggedIn ? (
            <span
              className="text-sm font-medium hover:underline"
              onClick={() => navigate("/account/profile")}
            >
              게스트
            </span>
          ) : (
            <span
              className="text-sm font-medium hover:underline"
              onClick={() => setIsLoginOpen(true)}
            >
              로그인
            </span>
          )}
        </div>
      </header>

      {/* 로그인 모달 분리된 컴포넌트로 대체 */}
      {isLoginOpen && <LoginModal onClose={() => setIsLoginOpen(false)} />}
    </>
  );
};

export default Header;
