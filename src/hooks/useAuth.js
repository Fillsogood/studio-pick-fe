import { useRecoilState } from "recoil";
import { authState } from "../recoil/authState";

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authState);

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
