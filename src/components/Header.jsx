import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header className="w-full h-16 bg-lime-300 flex items-center justify-between px-6 shadow-md fixed top-0 z-50">
      {/* 왼쪽 로고 (이미지만) */}
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

      {/* 로그인 버튼 */}
      <div>
        <Link
          to="/login"
          className="bg-white text-black font-semibold px-4 py-2 rounded-md hover:bg-gray-100"
        >
          로그인
        </Link>
      </div>
    </header>
  );
};

export default Header;
