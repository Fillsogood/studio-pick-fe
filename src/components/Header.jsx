import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { User2 } from "lucide-react";
import LoginModal from "../components/LoginModal";

const Header = () => {
  const navigate = useNavigate();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const nickname = localStorage.getItem("nickname");

    if (token && nickname) {
      setIsLoggedIn(true);
      setNickname(nickname);
    } else {
      setIsLoggedIn(false);
      setNickname("");
    }
  }, []);

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

        <div className="flex items-center gap-2 text-gray-600 cursor-pointer">
          <User2 size={20} />
          {isLoggedIn ? (
            <span
              className="text-sm font-medium hover:underline"
              onClick={() => navigate("/account/profile")}
            >
              {nickname || "게스트"}
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

      {/* 모달에 로그인 성공 콜백 전달 */}
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            const nick = localStorage.getItem("nickname");
            if (nick) setNickname(nick);
          }}
        />
      )}
    </>
  );
};

export default Header;
