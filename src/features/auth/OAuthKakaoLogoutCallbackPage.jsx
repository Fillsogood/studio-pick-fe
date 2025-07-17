import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../lib/authAPI'

const OAuthKakaoLogoutCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logout().then(() => {
      navigate('/');
    });
  }, []);

  return <div>카카오 로그아웃 처리 중...</div>;
};

export default OAuthKakaoLogoutCallbackPage;