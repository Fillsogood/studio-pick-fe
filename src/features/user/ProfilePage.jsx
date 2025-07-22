import { useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  verifyPassword,
  updateEmail,
  updatePassword,
} from "../../lib/userAPI";

const ProfilePage = () => {
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");

  const [userInfo, setUserInfo] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    nickname: "",
    email: "",
  });

  const [emailChanged, setEmailChanged] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // 비밀번호 변경용 상태
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  const handleVerify = async () => {
    const res = await verifyPassword(password);
    if (!res.data?.success) {
      setErrorMessage(res.data?.message || "비밀번호가 일치하지 않습니다.");
      return;
    }
    setErrorMessage("");
    setVerified(true);
  };

  useEffect(() => {
    if (!verified) return;
    const fetchUser = async () => {
      const res = await getMyProfile();
      const data = res.data.data;
      setUserInfo(data);
      setForm({
        name: data.name,
        phone: data.phone,
        nickname: data.nickname,
        email: data.email,
      });
    };
    fetchUser();
  }, [verified]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "email") {
        setEmailChanged(value !== userInfo.email);
        setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
      }
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      await updateMyProfile({
        name: form.name,
        phone: form.phone,
        nickname: form.nickname,
      });
      localStorage.setItem("nickname", form.nickname);
      alert("회원 정보가 수정되었습니다.");
    } catch (e) {
      console.error(e);
      alert("수정 실패");
    }
  };

  const handleEmailChange = async () => {
    try {
      await updateEmail(form.email);
      alert("이메일이 변경되었습니다.");
      setEmailChanged(false);
    } catch (e) {
      console.error(e);
      alert("이메일 변경 실패");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await updatePassword({
        currentPassword,
        newPassword,
      });
      alert("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordChange(false);
    } catch (e) {
      console.error("비밀번호 변경 실패:", e.response?.data || e.message);
      alert("비밀번호 변경 실패");
    }
  };

  return (
    <div>
      {!verified ? (
        <div className="max-w-md mx-auto">
          <p className="mb-2 text-lg font-semibold">
            회원 정보를 확인하기 위해
            <br /> 비밀번호가 필요해요
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="border px-3 py-2 w-full rounded mb-4"
          />
          {errorMessage && (
            <p className="text-sm text-red-500 mt-[-12px] mb-4">
              {errorMessage}
            </p>
          )}
          <button
            onClick={handleVerify}
            className="px-4 py-2 bg-WarmBeige-300 text-black rounded w-full"
          >
            입력 완료
          </button>
        </div>
      ) : (
        <div className="w-full px-10 pt-10">
          <h2 className="text-2xl font-bold mb-8">계정 관리</h2>

          <div className="flex gap-10">
            {/* 회원 정보 영역 */}
            <div className="flex-1 border-r border-neutral-200 pr-10">
              <h3 className="text-base font-semibold mb-4">회원 정보</h3>

              <div className="space-y-5">
                <div>
                  <label className="text-sm text-gray-500 block mb-1">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="이름"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">전화번호</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="전화번호"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-500 block mb-1">닉네임</label>
                  <input
                    type="text"
                    name="nickname"
                    value={form.nickname}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="닉네임"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-lime-300 text-black px-6 py-2 rounded hover:opacity-90 transition"
                  >
                    저장하기
                  </button>
                </div>
              </div>
            </div>

            {/* 계정 정보 영역 */}
            <div className="flex-1 pl-10">
              <h3 className="text-base font-semibold mb-4">계정 정보</h3>

              {/* 이메일 변경 */}
              <div className="mb-6">
                <label className="text-sm text-gray-500 block mb-1">이메일</label>
                <div className="flex items-center gap-2">
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-4 py-2"
                    placeholder="이메일"
                  />
                  <button
                    disabled={!isEmailValid || !emailChanged}
                    onClick={handleEmailChange}
                    className={`px-4 h-[42px] min-w-[90px] whitespace-nowrap text-sm font-medium rounded-[6px] flex items-center justify-center ${
                      isEmailValid && emailChanged
                        ? "bg-lime-300 text-black"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    변경하기
                  </button>
                </div>
              </div>

              {/* 비밀번호 변경 */}
              <div className="mt-2">
                {!showPasswordChange ? (
                  <button
                    onClick={() => setShowPasswordChange(true)}
                    className="text-sm text-blue-500 font-medium"
                  >
                    비밀번호 변경 &gt;
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        현재 비밀번호
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full border px-4 py-2 rounded"
                        placeholder="현재 비밀번호"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        새 비밀번호
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          const value = e.target.value;
                          setNewPassword(value);
                          if (!passwordRegex.test(value)) {
                            setPasswordError(
                              "비밀번호 형식을 확인해주세요. (8~20자, 대소문자/숫자/특수문자 포함)"
                            );
                          } else {
                            setPasswordError("");
                          }

                          if (confirmPassword && confirmPassword !== value) {
                            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
                          } else {
                            setConfirmPasswordError("");
                          }
                        }}
                        className="w-full border px-4 py-2 rounded"
                        placeholder="새 비밀번호"
                      />
                      {passwordError && (
                        <p className="text-sm text-red-500 mt-1">{passwordError}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">
                        새 비밀번호 확인
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          const value = e.target.value;
                          setConfirmPassword(value);
                          if (newPassword && newPassword !== value) {
                            setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
                          } else {
                            setConfirmPasswordError("");
                          }
                        }}
                        className="w-full border px-4 py-2 rounded"
                        placeholder="비밀번호 재입력"
                      />
                      {confirmPasswordError && (
                        <p className="text-sm text-red-500 mt-1">
                          {confirmPasswordError}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPasswordChange(false)}
                        className="px-4 py-2 border rounded"
                      >
                        이전
                      </button>
                      <button
                        onClick={handlePasswordChange}
                        disabled={
                          !currentPassword ||
                          !newPassword ||
                          !confirmPassword ||
                          newPassword !== confirmPassword ||
                          !passwordRegex.test(newPassword)
                        }
                        className={`px-4 py-2 rounded ${
                          currentPassword &&
                          newPassword &&
                          confirmPassword &&
                          newPassword === confirmPassword &&
                          passwordRegex.test(newPassword)
                            ? "bg-lime-300 text-black"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        변경하기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
