import { AiFillHome, AiFillCalendar, AiFillHeart, AiFillStar } from 'react-icons/ai';
import { FaCamera, FaMusic, FaUser } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { BiHelpCircle } from 'react-icons/bi';
import sidelogo from '../assets/sidelogo.png';

export default function Sidebar() {
    return (
        <aside className="bg-white border-r p-4 space-y-6 flex flex-col items-center">
            {/* 로고 */}
            <div className="flex space-y-0 items-center justify-center mb-0.5">
                <img src={sidelogo} alt="Studio Pick Logo" className="h-45 w-auto" />
            </div>

            {/* 로그인/회원가입 */}
            <button className="w-full py-2 bg-lime-500 text-white rounded-md text-sm font-semibold hover:bg-lime-600 transition-colors mb-6">
                로그인 / 회원가입
            </button>

            {/* 네비게이션 */}
            <nav className="w-full space-y-3 text-sm text-gray-700">
                <SidebarItem icon={<AiFillHome />} label="홈" />
                <SidebarItem icon={<FaCamera />} label="스튜디오 탐색" active />
                <SidebarItem icon={<FaMusic />} label="클래스" />
                <SidebarItem icon={<AiFillCalendar />} label="예약 관리" />
                <SidebarItem icon={<FaUser />} label="마이페이지" />
                <SidebarItem icon={<AiFillHeart />} label="즐겨찾기" />
                <SidebarItem icon={<AiFillStar />} label="리뷰 관리" />
            </nav>

            {/* 하단 메뉴 */}
            <div className="mt-auto w-full border-t pt-4 space-y-3 text-sm text-gray-700">
                <SidebarItem icon={<FiSettings />} label="설정" />
                <SidebarItem icon={<BiHelpCircle />} label="도움말" />
            </div>
        </aside>
    );
}

function SidebarItem({ icon, label, active }) {
    return (
        <div className={`flex items-center cursor-pointer p-2 rounded-md transition-colors ${active ? 'text-lime-600 font-semibold bg-lime-50' : 'hover:text-lime-500 text-gray-700'}`}>
            <div className="mr-3 text-lg">{icon}</div>
            {label}
        </div>
    );
}