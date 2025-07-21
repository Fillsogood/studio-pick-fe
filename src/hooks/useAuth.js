import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { authState } from "../recoil/authState";

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

  // sessionStorage로부터 상태 초기화
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const userStr = sessionStorage.getItem("user");

    // Recoil 상태가 초기값이면 sessionStorage 값으로 세팅
    if (isLoggedIn && userStr && !auth.isLoggedIn) {
      const user = JSON.parse(userStr);
      setAuth({ isLoggedIn: true, user });
    }
  }, [auth.isLoggedIn, setAuth]);

  const login = (user) => {
    setAuth({ isLoggedIn: true, user });
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("user", JSON.stringify(user));
  };

  const logout = () => {
    setAuth({ isLoggedIn: false, user: null });
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("user");
  };

  return {
    isLoggedIn: auth.isLoggedIn,
    user: auth.user,
    login,
    logout,
  };
};
