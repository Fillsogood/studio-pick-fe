// src/components/Header.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { User2 } from "lucide-react";
import LoginModal from "../components/LoginModal";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { isLoggedIn, user, logout } = useAuth(); 
  const nickname = user?.nickname || "게스트";

  return (
    <>
      <header className="w-full h-16 bg-WarmBeige-300  flex items-center justify-between px-6 shadow-md fixed top-0 z-50">
        {/* 로고 */}
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Studio Pick"
            className="h-24 w-24 object-contain"
          />
        </Link>

        {/* 검색창 */}
        <div className="flex-1 px-6">
          <input
            type="text"
            placeholder="스튜디오 검색"
            className="w-full max-w-xl px-4 py-2 rounded-md border focus:outline-none focus:ring focus:ring-yellow-300"
          />
        </div>

        {/* 로그인/닉네임 */}
        <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
          <User2 size={20} />
          {isLoggedIn ? (
            <span
              className="text-base font-semibold hover:underline"
              onClick={() => navigate("/account/profile")}
            >
              {nickname}
            </span>
          ) : (
            <span
              className="text-base font-semibold hover:underline"
              onClick={() => setIsLoginOpen(true)}
            >
              로그인
            </span>
          )}
        </div>
      </header>

      {/* 로그인 모달 */}
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
        />
      )}
    </>
  );
};

export default Header;
