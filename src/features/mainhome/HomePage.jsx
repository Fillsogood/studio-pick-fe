import { Link } from "react-router-dom";
import mainImage from "../../assets/main.png";
import StudioPreviewList from "./components/StudioPreviewList";
import ClassPreviewList from "./components/ClassPreviewList";

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div
        className="w-full h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${mainImage})` }}
      />

      {/* Scroll Down 콘텐츠 */}
      <div className="px-4 lg:px-8 py-12 space-y-20">
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-3xl font-bold text-black">인기 스튜디오</h2>
            <Link
              to="/studios"
              className="text-xl font-semibold text-black hover:underline hover:text-gray-700"
            >
              {">>"} more
            </Link>
          </div>

          <StudioPreviewList />
        </section>

        <section className="mt-20">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-3xl font-bold text-black">인기 클래스</h2>
            <Link
              to="/classes"
              className="text-xl font-semibold text-black hover:underline hover:text-gray-700"
            >
              {">>"} more
            </Link>
          </div>
          <ClassPreviewList />
        </section>
      </div>
    </div>
  );
};

export default HomePage;
