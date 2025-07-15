import { Link, Outlet, useLocation } from "react-router-dom";

const MyPageLayout = () => {
  const location = useLocation();

  const menus = [
    { label: "알림 설정", path: "/account/notification" },
    { label: "계정 관리", path: "/account/profile" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 좌측 메뉴 */}
      <aside className="w-64 border-r bg-white flex flex-col justify-between">
        <div className="p-6">
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
                    location.pathname === menu.path ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  {menu.label}
                  <span className="text-gray-400">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between text-xs text-gray-400 px-6 py-4 border-t">
          <span>고객센터</span>
          <span>로그아웃</span>
        </div>
      </aside>

      {/* 우측 콘텐츠 영역 */}
      <section className="flex-1 p-12 bg-white">
        <Outlet />
      </section>
    </div>
  );
};

export default MyPageLayout;
