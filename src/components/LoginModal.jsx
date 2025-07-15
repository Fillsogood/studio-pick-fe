import { useState } from 'react';
import { login } from '../lib/authAPI';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const LoginModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      onClose(); // 모달 닫기
      navigate('/dashboard');
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-lg relative">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* 로고 */}
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-20 h-20 mb-2" />
          <p className="text-sm font-semibold">환영합니다</p>
        </div>

        {/* 로그인 폼 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              로그인 상태 유지
            </label>
            <a href="/forgot-password" className="text-yellow-500 hover:underline">
              비밀번호 찾기
            </a>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-lime-400 hover:bg-lime-300 py-2 font-semibold rounded-md"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
