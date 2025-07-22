import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { logout } from "../lib/authAPI";
import { getMyProfile } from "../lib/userAPI";
import { useAuth } from "../hooks/useAuth";

const MyPageLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout: clientLogout } = useAuth();

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMyProfile();
        const data = res.data.data;

        setUserInfo(data);
      } catch (e) {
        console.error("프로필 조회 실패", e);

        // 세션 만료 시 강제 로그아웃 처리
        localStorage.removeItem("accessToken");
        localStorage.removeItem("nickname");
        localStorage.removeItem("loginType");
        navigate("/");
        window.location.reload();
      }
    };

    fetchUser();
  }, []);

  const isHost = userInfo?.studioOwner || userInfo?.workShopOwner;

  const menus = [
    { label: "알림 설정", path: "/account/notification" },
    { label: "계정 관리", path: "/account/profile" },
  ];

  const handleLogout = async () => {
    const loginType = localStorage.getItem("loginType");

    if (loginType === "kakao") {
      const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
      const LOGOUT_REDIRECT_URI = import.meta.env
        .VITE_KAKAO_LOGOUT_REDIRECT_URI;

      clientLogout();
      const kakaoLogoutUrl = `https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
      window.location.href = kakaoLogoutUrl;
    } else {
      try {
        await logout();
      } catch (e) {
        console.error("로그아웃 실패:", e);
      } finally {
        clientLogout();
        navigate("/");
        setTimeout(() => window.location.reload(), 100);
      }
    }
  };

  return (
    <div className="flex bg-gray-50">
      <aside className="w-80 h-[calc(100vh-64px)] border-r bg-white flex flex-col">
        <div className="p-6 flex-1 flex flex-col justify-start">
          <div className="flex items-center mb-10">
            <div className="w-12 h-12 rounded-full bg-gray-200 mr-4" />
            <div>
              <div className="text-base font-semibold">
                {userInfo?.nickname || "이름없음"}
              </div>
              <div className="text-sm text-gray-500">
                {isHost ? "호스트" : "게스트"}
              </div>
            </div>
          </div>

          <ul className="text-base space-y-2">
            {menus.map((menu) => (
              <li key={menu.path}>
                <Link
                  to={menu.path}
                  className={`flex justify-between items-center px-4 py-3 rounded-md hover:bg-gray-100 transition ${
                    location.pathname === menu.path
                      ? "bg-gray-100 font-semibold"
                      : ""
                  }`}
                >
                  {menu.label}
                  <span className="text-gray-400 text-xl">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-6 py-4 border-t text-base text-gray-780 flex font-medium flex justify-between">
          <span className="cursor-pointer hover:underline">고객센터</span>
          <span
            className="cursor-pointer hover:underline"
            onClick={handleLogout}
          >
            로그아웃
          </span>
        </div>
      </aside>

      <section className="flex-1 p-16 bg-white min-h-[calc(100vh-64px)] overflow-y-auto">
        <Outlet />
      </section>
    </div>
  );

};

export default MyPageLayout;
