import { useState } from "react";

const NotificationSettingPage = () => {
  const [marketingAgree, setMarketingAgree] = useState(false);

  const handleToggle = () => {
    const newValue = !marketingAgree;
    setMarketingAgree(newValue);

    // TODO: 서버에 저장 요청
    // await axiosInstance.patch("/api/users/notification", { marketingAgree: newValue });
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        스튜디오픽만의 다양한 혜택과 이벤트를 만나보세요
      </h2>
      <p className="text-gray-500 mb-6">
        앱 푸시나 문자, 이메일 등으로 빠르게 알려드려요.
      </p>

      <div className="flex items-center justify-between border-t pt-6">
        <span className="text-base font-medium">마케팅 알림</span>
        <button
          onClick={handleToggle}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
            marketingAgree ? "bg-black" : "bg-gray-300"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
              marketingAgree ? "translate-x-6" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default NotificationSettingPage;
