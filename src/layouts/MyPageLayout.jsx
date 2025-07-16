import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const MyPageLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menus = [
    { label: "알림 설정", path: "/account/notification" },
    { label: "계정 관리", path: "/account/profile" },
  ];

  const handleLogout = async () => {
  try {
    await logout();
  } catch (e) {
    console.error("로그아웃 실패:", e);
  } finally {
    localStorage.removeItem("accessToken");

    // ✅ 1) 홈으로 이동 후
    navigate("/");

    // ✅ 2) 조금 delay 후 새로고침
    setTimeout(() => {
      window.location.reload(); // 🔁 여기서 확실히 리렌더링
    }, 100);
  }
};

  return (
    <div className="flex bg-gray-50">
      {/* 좌측 마이페이지 메뉴 */}
      <aside className="w-64 h-[calc(100vh-64px)] border-r bg-white flex flex-col">
        {/* 상단 - 유저 정보 및 메뉴 */}
        <div className="p-6 flex-1 flex flex-col justify-start">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 rounded-full bg-gray-200 mr-3" />
            <div>
              <div className="text-sm font-semibold">Leo0723</div>
              <div className="text-xs text-gray-500">게스트</div>
            </div>
          </div>

          <ul className="text-sm space-y-1">
            {menus.map((menu) => (
              <li key={menu.path}>
                <Link
                  to={menu.path}
                  className={`flex justify-between items-center px-3 py-2 rounded-md hover:bg-gray-100 ${
                    location.pathname === menu.path
                      ? "bg-gray-100 font-semibold"
                      : ""
                  }`}
                >
                  {menu.label}
                  <span className="text-gray-400">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 하단 - 고객센터 / 로그아웃 */}
        <div className="px-6 py-4 border-t text-xs text-gray-400 flex justify-between">
          <span className="cursor-pointer hover:underline">고객센터</span>
          <span
            className="cursor-pointer hover:underline"
            onClick={handleLogout}
          >
            로그아웃
          </span>
        </div>
      </aside>

      {/* 우측 콘텐츠 */}
      <section className="flex-1 p-12 bg-white min-h-[calc(100vh-64px)] overflow-y-auto">
        <Outlet />
      </section>
    </div>
  );
};

export default MyPageLayout;
