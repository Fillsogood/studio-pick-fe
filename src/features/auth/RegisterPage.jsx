import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../lib/authAPI";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNumber = value.replace(/\D/g, "");
      let formatted = onlyNumber;

      if (onlyNumber.length <= 3) {
        formatted = onlyNumber;
      } else if (onlyNumber.length <= 7) {
        formatted = `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`;
      } else {
        formatted = `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(
          3,
          7
        )}-${onlyNumber.slice(7, 11)}`;
      }

      setForm({ ...form, phone: formatted });
    } else if (name === "password") {
      setForm({ ...form, [name]: value });

      if (!passwordRegex.test(value)) {
        setPasswordError(
          "비밀번호 형식을 확인해주세요. (8~20자, 대소문자/숫자/특수문자 포함)"
        );
      } else {
        setPasswordError("");
      }

      // 비밀번호 변경 시 확인 필드와 비교도 다시 체크
      if (form.confirmPassword && form.confirmPassword !== value) {
        setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      } else {
        setConfirmPasswordError("");
      }
    } else if (name === "confirmPassword") {
      setForm({ ...form, [name]: value });

      if (form.password && form.password !== value) {
        setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      } else {
        setConfirmPasswordError("");
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const formatPhoneNumber = (number) => {
    const digitsOnly = number.replace(/\D/g, "");
    if (digitsOnly.length === 11 && digitsOnly.startsWith("010")) {
      return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(
        3,
        7
      )}-${digitsOnly.slice(7)}`;
    }
    return number;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!passwordRegex.test(form.password)) {
      setPasswordError(
        "비밀번호 형식을 확인해주세요. (8~20자, 대소문자/숫자/특수문자 포함)"
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    }

    const formattedPhone = formatPhoneNumber(form.phone);

    try {
      await register({ ...form, phone: formattedPhone });
      alert("회원가입이 완료되었습니다!");
      navigate("/");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("회원가입에 실패했습니다. 입력 내용을 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-6 text-center">회원가입</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="이름"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="이메일"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
            required
          />
          <div>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
              required
            />
            <p className="text-xs text-gray-500 mt-1 pl-2">
              비밀번호는 8~20자, 대소문자/숫자/특수문자를 모두 포함해야 합니다.
            </p>
            {passwordError && (
              <p className="text-xs text-red-500 pl-2">{passwordError}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 확인"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
              required
            />
            {confirmPasswordError && (
              <p className="text-xs text-red-500 pl-2" >{confirmPasswordError}</p>
            )}
          </div>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="전화번호 (010-0000-0000)"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-yellow-300"
            required
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full bg-WarmBeige-300 hover:bg-WarmBeige-200 text-black font-semibold py-2 rounded-md"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
