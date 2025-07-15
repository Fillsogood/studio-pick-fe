import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { login } from "../lib/authAPI";

const Header = () => {
  const navigate = useNavigate();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); //  로그인 여부 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  //  mount 시 토큰 확인 (자동 로그인 유지)
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await login(email, password);
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      setIsLoggedIn(true); // 상태 업데이트
      setIsLoginOpen(false);
      navigate("/"); // 홈으로 이동
    } catch (err) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

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

        {/*  로그인 상태에 따라 버튼 분기 */}
        <div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-white text-black font-semibold px-4 py-2 rounded-md hover:bg-gray-100"
            >
              로그아웃
            </button>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-white text-black font-semibold px-4 py-2 rounded-md hover:bg-gray-100"
            >
              로그인
            </button>
          )}
        </div>
      </header>
      {/* 로그인 모달 */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg relative">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-3 right-4 text-xl text-gray-400 hover:text-black"
            >
              ✕
            </button>

            {/* 로고 + 텍스트 */}
            <div className="text-center mb-6">
              <img
                src={logo}
                alt="Studio Pick"
                className="mx-auto w-24 h-24 mb-2"
              />
              <p className="text-sm font-semibold mt-1">환영합니다</p>
            </div>

            {/* 로그인 폼 */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  이메일
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소를 입력하세요"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-yellow-400"
                  />
                  로그인 상태 유지
                </label>
                <a
                  href="/forgot-password"
                  className="text-lime-400 hover:underline"
                >
                  비밀번호를 잊으셨나요?
                </a>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                className="w-full bg-lime-300 hover:bg-lime-200 text-black font-semibold py-2 rounded-md"
              >
                로그인
              </button>
            </form>

            <button
              onClick={() => {
                setIsLoginOpen(false);
                navigate("/register");
              }}
              className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-md"
            >
              회원가입
            </button>

            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-2 text-sm text-gray-400">또는</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* 카카오 로그인만 남기기 */}
            <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-md">
              카카오로 계속하기
            </button>

            <div className="mt-6 text-sm text-center text-gray-500">
              계정이 없으신가요?{" "}
              <a href="/register" className="text-blue-500 hover:underline">
                회원가입
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
