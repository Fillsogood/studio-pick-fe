import { NavLink, useLocation } from "react-router-dom";
import {
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
  {
    label: "작품 갤러리",
    icon: <GalleryHorizontal size={20} />,
    path: "/gallery",
  },
  {
    label: "스튜디오 등록",
    icon: <PlusSquare size={20} />,
    path: "/studios/rental",
  },
  {
    label: "클래스 등록",
    icon: <PlusSquare size={20} />,
    path: "/classes/apply",
  },
];

const Sidebar = () => {
  const location = useLocation();

  const isActivePath = (itemPath) => {
    const pathname = location.pathname;

    // 정확히 일치해야 하는 항목들
    if (itemPath === "/") return pathname === "/";
    if (itemPath === "/studios") return pathname === "/studios";
    if (itemPath === "/classes") return pathname === "/classes";
    if (itemPath === "/classes/apply") return pathname === "/classes/apply";
    if (itemPath === "/studios/rental") return pathname === "/studios/rental";

    // 그 외는 startsWith 허용 (예: /gallery/1)
    return pathname.startsWith(itemPath);
  };

  return (
    <aside className="w-60 h-screen fixed top-16 left-0 bg-white border-r pt-6 px-4 z-40">
      <nav className="flex flex-col gap-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 transition ${
              isActivePath(item.path)
                ? "bg-lime-200 font-semibold"
                : "text-gray-700"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
