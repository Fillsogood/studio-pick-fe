import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AddressStep from "./components/AddressStep";
import ClassInfoStep from "./components/ClassInfoStep";
import ClassImageStep from "./components/ClassImageStep";
import { useAuth } from "../../hooks/useAuth";
import LoginModal from "../../components/LoginModal";
import { applyClass } from "../../lib/classAPI";

const ClassRegisterPage = () => {
  const { isLoggedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    address: "",
    title: "",
    description: "",
    price: "",
    instructor: "",
    date: "",
    startTime: { hour: "", minute: "" },
    endTime: { hour: "", minute: "" },
  });
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 비로그인 상태 최초 진입 시 모달 띄움
  useEffect(() => {
    if (!isLoggedIn && !showLoginModal) {
      setShowLoginModal(true);
    }
  }, [isLoggedIn]);

  // 로그인 안 된 경우 → 모달만 보여줌
  if (!isLoggedIn && showLoginModal) {
    return (
      <LoginModal
        onClose={() => {
          setShowLoginModal(false);
          navigate("/"); // 모달 닫으면 메인홈 이동
        }}
        onLoginSuccess={() => {
          setShowLoginModal(false); // 로그인 성공 시 모달 닫고
          // 현재 페이지 그대로 유지
        }}
      />
    );
  }

  // 클래스 등록 완료 시 호출
  const handleSubmit = async (images) => {
    if (!images.length) {
      alert("이미지를 1장 이상 업로드해주세요.");
      return;
    }

    const payload = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      instructor: form.instructor,
      date: form.date,
      address: form.address,
      startTime: {
        hour: Number(form.startTime.hour),
        minute: Number(form.startTime.minute),
        second: 0,
        nano: 0,
      },
      endTime: {
        hour: Number(form.endTime.hour),
        minute: Number(form.endTime.minute),
        second: 0,
        nano: 0,
      },
      thumbnailUrl: images[0],
      imageUrls: images,
    };

    try {
      await applyClass(payload);
      alert("클래스가 성공적으로 등록되었습니다.");
      navigate("/"); // 등록 완료 후 메인홈으로 이동
    } catch (err) {
      console.error("클래스 등록 실패", err);
      alert("클래스 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="w-full px-4 pt-20 max-w-2xl mx-auto">
      {step === 1 && (
        <AddressStep
          onNext={(fullAddress) => {
            setForm((prev) => ({ ...prev, address: fullAddress }));
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <ClassInfoStep
          form={form}
          onChange={setForm}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <ClassImageStep
          onBack={() => setStep(2)}
          onNext={(images) => handleSubmit(images)}
        />
      )}
    </div>
  );
};

export default ClassRegisterPage;
