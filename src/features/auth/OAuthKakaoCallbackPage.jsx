// src/features/auth/OAuthKakaoCallbackPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { kakaoLogin } from '../../lib/authAPI'; 
import { getMyProfile } from '../../lib/userAPI';
import { useAuth } from '../../hooks/useAuth';

const OAuthKakaoCallbackPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Recoil 상태 업데이트 함수

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    console.log('카카오 로그인 code 감지:', code);

    if (!code) return;
    if (window.__kakaoLoginStarted__) return;
    window.__kakaoLoginStarted__ = true;

    kakaoLogin({ code })
      .then(async (res) => {
        if (res.data.success) {
          const accessToken = res.data.accessToken;
          const refreshToken = res.data.refreshToken;

          // 토큰 저장
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("loginType", "kakao");

          // 사용자 정보 받아오기
          try {
            const profileRes = await getMyProfile(); // axiosInstance 기반 호출
            console.log("getMyProfile 응답:", profileRes);

            const user = profileRes.data.data;

            // 세션 저장 및 상태 반영
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("user", JSON.stringify(user));
            login(user);

            navigate("/");
          } catch (profileError) {
            console.error("사용자 정보 불러오기 실패:", profileError);
            alert("사용자 정보를 불러오지 못했습니다.");
            navigate("/login");
          }
        } else {
          alert("로그인 실패: " + res.data.message);
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("카카오 로그인 에러:", err);
        alert("카카오 로그인 중 문제가 발생했습니다.");
        navigate("/login");
      });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      카카오 로그인 처리 중...
    </div>
  );
};

export default OAuthKakaoCallbackPage;
