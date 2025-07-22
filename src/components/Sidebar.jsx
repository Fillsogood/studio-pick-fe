import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  Home,
  Camera,
  BookOpen,
  CalendarCheck,
  Heart,
  GalleryHorizontal,
  PlusSquare,
} from "lucide-react";

const menuItems = [
  { label: "홈", icon: <Home size={20} />, path: "/" },
  { label: "스튜디오 탐색", icon: <Camera size={20} />, path: "/studios" },
  { label: "클래스 탐색", icon: <BookOpen size={20} />, path: "/classes" },
  { label: "예약", icon: <CalendarCheck size={20} />, path: "/reservation" },
  { label: "즐겨찾기", icon: <Heart size={20} />, path: "/favorites" },
  { label: "작품 갤러리", icon: <GalleryHorizontal size={20} />, path: "/gallery" },
  { label: "스튜디오 등록", icon: <PlusSquare size={20} />, path: "/studios/rental" },
  { label: "클래스 등록", icon: <PlusSquare size={20} />, path: "/classes/apply" },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const isStudioOwner = user?.studioOwner;
  const isWorkshopOwner = user?.workShopOwner;

  const isActivePath = (itemPath) => {
    const pathname = location.pathname;
    if (itemPath === "/") return pathname === "/";
    if (itemPath === "/studios") return pathname === "/studios";
    if (itemPath === "/classes") return pathname === "/classes";
    if (itemPath === "/classes/apply") return pathname === "/classes/apply";
    if (itemPath === "/studios/rental") return pathname === "/studios/rental";
    return pathname.startsWith(itemPath);
  };

  return (
    <aside className="w-60 h-screen fixed top-16 left-0 bg-neutral-100 border-r pt-6 px-4 z-40">
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition ${
              isActivePath(item.path)
                ? "bg-WarmBeige-300 font-semibold"
                : "text-gray-700"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* 호스트 센터 조건부 렌더링 */}
        {(isStudioOwner || isWorkshopOwner) && (
          <NavLink
            to="/host"
            className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition ${
              isActivePath("/host")
                ? "bg-WarmBeige-300 font-semibold"
                : "text-gray-700"
            }`}
          >
            <LayoutDashboard size={20} />
            <span>호스트 센터</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
