import React, { useState } from "react";
import { Shield, User, Lock, Unlock } from "lucide-react";
import { Card, Button, Input } from "../components/common";
import { useNavigate } from "react-router-dom";
import { adminAuthAPI } from "@/lib/admin/adminAuthAPI";

const AdminLoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1️⃣ 로그인 요청
      const response = await adminAuthAPI.login(credentials);
      console.log("로그인 성공:", response);

      // 2️⃣ 권한 확인 (쿠키에서 꺼내와 확인)
      const result = await adminAuthAPI.verifyAdminAuth();
      console.log("권한 확인 결과:", result);

      // 3️⃣ 대시보드로 이동
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("로그인 또는 권한 확인 실패:", error);
      alert(error.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Studio Pick</h1>
            <p className="text-gray-600 mt-2">관리자 로그인</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                관리자 아이디
              </label>
              <Input
                type="text"
                placeholder="관리자 아이디를 입력하세요"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                icon={User}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                icon={Lock}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-600">
                  로그인 상태 유지
                </span>
              </label>
              <button
                type="button"
                className="text-sm text-teal-600 hover:text-teal-500"
              >
                비밀번호 찾기
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  로그인 중...
                </div>
              ) : (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  로그인
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Studio Pick 관리자 시스템 v1.0
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
