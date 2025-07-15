import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex">
      <Header />
      <Sidebar />
      <main className="pt-16 pl-60 w-full min-h-screen bg-gray-50 px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
