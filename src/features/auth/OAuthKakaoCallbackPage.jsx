// src/features/auth/OAuthKakaoCallbackPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../lib/axiosInstance';
import { kakaoLogin } from '../../lib/authAPI'; 

const OAuthKakaoCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    console.log('카카오 로그인 code 감지:', code);

    if (!code) return;

    // 중복 호출 방지 (전역 변수 활용)
    if (window.__kakaoLoginStarted__) return;
    window.__kakaoLoginStarted__ = true;

    kakaoLogin({ code })
      .then((res) => {
        if (res.data.success) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("loginType", "kakao");
          navigate("/");
        } else {
          alert("로그인 실패: " + res.data.message);
          navigate("/");
        }
      })
      .catch((err) => {
        console.error("카카오 로그인 에러:", err);
        alert("카카오 로그인 중 문제가 발생했습니다.");
        navigate("/");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      카카오 로그인 처리 중...
    </div>
  );
};

export default OAuthKakaoCallbackPage;
