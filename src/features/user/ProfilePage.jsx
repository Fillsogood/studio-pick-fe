import { useState } from "react";

const ProfilePage = () => {
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("비밀번호:", password);
  };

  return (
    <div className="pt-20 pl-4">
      <h2 className="text-2xl font-bold mb-10 leading-snug">
        회원 정보를 확인하기 위해<br />
        비밀번호가 필요해요
      </h2>

      <div className="flex items-center gap-2">
        <div className="flex flex-col">
          <label className="text-sm text-gray-800 mb-2">비밀번호</label>
          <input
            type="password"
            placeholder="abc12345"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-80 px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!password}
          className={`h-10 mt-6 px-4 rounded-md text-sm font-medium ${
            password
              ? "bg-gray-800 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          입력 완료
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
