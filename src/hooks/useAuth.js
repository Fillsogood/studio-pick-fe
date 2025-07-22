import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../recoil/authState";

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  // sessionStorage에서 상태 복구
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const userStr = sessionStorage.getItem("user");

    if (isLoggedIn && userStr && !auth.isLoggedIn) {
      const user = JSON.parse(userStr);
      setAuth({ isLoggedIn: true, user });
    }
  }, [auth.isLoggedIn, setAuth]);

  // 로그인 시 recoil + sessionStorage 저장
  const login = (user) => {
    setAuth({ isLoggedIn: true, user });
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("user", JSON.stringify(user));
  };

  // 로그아웃 시 recoil + storage 전체 정리
  const logout = () => {
    setAuth({ isLoggedIn: false, user: null });

    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("nickname");
    localStorage.removeItem("loginType");
  };

  return {
    isLoggedIn: auth.isLoggedIn,
    user: auth.user,
    login,
    logout,
  };
};
