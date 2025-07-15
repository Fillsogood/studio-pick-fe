import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../lib/authAPI';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
    } catch (err) {
      setError('회원가입에 실패했습니다. 입력 내용을 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-6 text-center">회원가입</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="이름"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="이메일"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="비밀번호"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
            required
          />
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="전화번호"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-lime-300 hover:bg-lime-200 text-black font-semibold py-2 rounded-md"
          >
            회원가입
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <a href="/login" className="text-blue-500 hover:underline">
            로그인
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
