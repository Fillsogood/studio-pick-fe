import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../lib/authAPI';
import logo from '../../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await login(email, password);
      const { accessToken } = response.data;

      localStorage.setItem('accessToken', accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <div className="text-center mb-6">
          <img src={logo} alt="Studio Pick" className="mx-auto w-20 h-20 mb-2" />
          <p className="mt-1 text-sm font-semibold">환영합니다</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일 주소를 입력하세요"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
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
            <a href="/forgot-password" className="text-yellow-400 hover:underline">
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
          onClick={() => navigate('/register')}
          className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-black font-medium py-2 rounded-md"
        >
          회원가입
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-gray-400">또는</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="space-y-2">
          <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 rounded-md">
            카카오로 계속하기
          </button>
          <button className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-2 rounded-md">
            네이버로 계속하기
          </button>
          <button className="w-full bg-white border hover:bg-gray-50 text-black font-semibold py-2 rounded-md">
            구글로 계속하기
          </button>
        </div>

        <div className="mt-6 text-sm text-center text-gray-500">
          계정이 없으신가요?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
