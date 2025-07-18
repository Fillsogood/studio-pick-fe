import { useState } from 'react';
import { sendResetPasswordEmail } from '../../lib/userAPI';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setError('올바른 이메일 주소를 입력해 주세요.');
      return;
    }

    setIsLoading(true); // 로딩 시작
    setError('');
    setMessage('');

    try {
      await sendResetPasswordEmail(email);
      setMessage('비밀번호 재설정 링크를 이메일로 보냈습니다.');
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || '이메일 전송 중 오류가 발생했습니다.';
      setError(msg);
    } finally {
      setIsLoading(false); // 로딩 끝
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <h3 className="text-sm text-lime-600 font-semibold mb-3">비밀번호 찾기</h3>
        <h1 className="text-lg font-bold mb-6 leading-tight">
          비밀번호 변경 링크를 받을<br />
          이메일을 입력해 주세요
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="your@email.com"
              className={`w-full px-4 py-2 border rounded-md ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading} // 전송 중일 땐 버튼 비활성화
            className="w-full py-2 rounded-md font-semibold text-black bg-lime-400 hover:bg-lime-300 transition"
          >
            {isLoading ? '메일 전송 중...' : '메일 전송하기'}
          </button>

          {message && (
            <p className="text-green-600 text-sm text-center mt-2">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
