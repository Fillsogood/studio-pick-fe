import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPasswordByToken } from '../../lib/userAPI';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || password !== confirm) {
      setError('비밀번호가 일치하지 않거나 비어있습니다.');
      return;
    }

    try {
      await resetPasswordByToken(token, password);
      setSuccess(true);
      setError('');
      setTimeout(() => navigate('/'), 2000); // 2초 후 홈(또는 로그인) 이동
    } catch (err) {
      const msg = err.response?.data?.message || '비밀번호 재설정에 실패했습니다.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl black font-semibold mb-3">비밀번호 재설정</h1>
        <p className="text-lg font-bold mb-6 leading-tight">새 비밀번호를 입력해 주세요</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="새 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.</p>}

          <button
            type="submit"
            className="w-full py-2 rounded-md font-semibold text-black bg-lime-400 hover:bg-lime-300"
          >
            비밀번호 재설정
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
