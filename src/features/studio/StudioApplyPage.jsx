import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { applyStudio } from "../../lib/studioApplicationAPI";
import { Dialog } from "@headlessui/react";
import { getMyProfile } from "../../lib/userAPI";
import DaumPostcode from "react-daum-postcode";
import { useDropzone } from "react-dropzone";

export default function StudioApplyPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [myProfile, setMyProfile] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null로 초기화
  const [showModal, setShowModal] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [businessLicenseFile, setBusinessLicenseFile] = useState(null);
  const [businessLicenseError, setBusinessLicenseError] = useState("");
  const [studioImages, setStudioImages] = useState([]);
  const [studioImagesError, setStudioImagesError] = useState("");

  const navigate = useNavigate();

  // 사업자등록증 드롭존
  const { getRootProps: getBizRootProps, getInputProps: getBizInputProps } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024, // 5MB
      onDrop: (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
          setBusinessLicenseError(
            "PDF, JPG, PNG 파일만 첨부 가능하며 5MB 이하만 가능합니다."
          );
          setBusinessLicenseFile(null);
          setValue("businessLicense", null);
          return;
        }
        setBusinessLicenseError("");
        setBusinessLicenseFile(acceptedFiles[0]);
        setValue("businessLicense", acceptedFiles[0]);
      },
    });

  // 스튜디오 사진 드롭존
  const {
    getRootProps: getStudioRootProps,
    getInputProps: getStudioInputProps,
  } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setStudioImagesError(
          "JPG, PNG 파일만 첨부 가능하며 10MB 이하, 최대 5장까지 업로드 가능합니다."
        );
        setStudioImages([]);
        setPreviewImages([]);
        setValue("studioImages", null);
        return;
      }
      setStudioImagesError("");
      setStudioImages(acceptedFiles);
      setValue("studioImages", acceptedFiles);
      // 미리보기
      setPreviewImages(acceptedFiles.map((file) => URL.createObjectURL(file)));
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowModal(true);
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      getMyProfile()
        .then((res) => setMyProfile(res.data))
        .catch((err) => console.error("프로필 조회 실패", err));
    }
  }, []);

  const handleConfirm = () => {
    navigate("/");
  };

  useEffect(() => {
    if (myProfile.name) {
      setValue("representativeName", myProfile.name);
    }
  }, [myProfile, setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "studioImages" && Array.isArray(value)) {
        value.forEach((file) => formData.append("studioImages", file));
      } else if (key === "businessLicense") {
        formData.append("businessLicense", value);
      } else {
        formData.append(key, value);
      }
    });
    try {
      await applyStudio(formData);
      alert("운영 신청이 완료되었습니다.");
      reset();
      navigate("/");
    } catch (error) {
      console.error("운영 신청 실패", error);
      alert("운영 신청 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중이거나 로그인되지 않은 경우 모달만 렌더링
  if (isLoggedIn === null) {
    // 로딩 스피너 등을 여기에 추가할 수 있습니다.
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md text-center">
          <p>정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  // 비로그인 상태라면 모달만 띄우고 페이지 내용은 안 보여줌
  if (!isLoggedIn) {
    return (
      <Dialog
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-40"
      >
        <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
          <Dialog.Title className="text-lg font-bold">
            로그인이 필요합니다
          </Dialog.Title>
          <p className="mt-2">
            스튜디오 운영 신청은 로그인 후 이용 가능합니다.
          </p>
          <div className="mt-4 text-right">
            <button
              onClick={handleConfirm} // 로그인 필요 시 홈페이지로 이동
              className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded"
            >
              확인
            </button>
          </div>
        </div>
      </Dialog>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-6">스튜디오 운영 신청</h2>

        {/* 스튜디오 이름 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">스튜디오 이름</label>
          <input
            type="text"
            {...register("studioName", { required: true })}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.studioName && (
            <p className="text-red-500 text-sm mt-1">필수 입력 항목입니다.</p>
          )}
        </div>

        {/* 대표자 이름 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">대표자명</label>
          <input
            type="text"
            {...register("representativeName")}
            value={myProfile.name || ""}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        {/* 전화번호 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">전화번호</label>
          <input
            type="text"
            {...register("phone", { required: true })}
            placeholder="예: 010-1234-5678"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              전화번호를 입력해주세요.
            </p>
          )}
        </div>

        {/* 스튜디오 설명 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">스튜디오 설명</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full border px-3 py-2 rounded h-24"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              스튜디오 설명을 입력해주세요.
            </p>
          )}
        </div>

        {/* 주소 + 우편번호 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">주소</label>
          <div className="flex gap-2">
            <input
              {...register("location", { required: true })}
              readOnly
              className="w-full border px-3 py-2 rounded bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gray-200 rounded flex-shrink-0"
            >
              주소 검색
            </button>
          </div>
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">주소를 입력해주세요.</p>
          )}
        </div>

        {/* 상세 주소 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">상세 주소</label>
          <input
            type="text"
            {...register("detailLocation", { required: true })}
            placeholder="예: 3층 301호"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.detailLocation && (
            <p className="text-red-500 text-sm mt-1">
              상세주소를 입력해주세요.
            </p>
          )}
        </div>

        {/* 사업자등록증 업로드 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">사업자 등록증</label>
          <div
            {...getBizRootProps()}
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition min-h-[120px]"
          >
            <input {...getBizInputProps()} />
            {businessLicenseFile ? (
              <div className="flex flex-col items-center">
                <span className="text-gray-700 text-sm font-medium mb-1">
                  {businessLicenseFile.name}
                </span>
                <span className="text-gray-400 text-xs">
                  {(businessLicenseFile.size / 1024 / 1024).toFixed(2)}MB
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">📄</span>
                <span className="text-gray-500 text-sm">
                  파일을 끌어다 놓거나 클릭하여 업로드하세요
                </span>
                <span className="text-gray-400 text-xs mt-1">
                  PDF, JPG, PNG 파일 (최대 5MB)
                </span>
                <span className="text-red-400 text-xs mt-1">
                  첨부된 사진이 없습니다. 파일선택에서 업로드 하세요
                </span>
              </div>
            )}
          </div>
          {businessLicenseError && (
            <p className="text-red-500 text-sm mt-1">{businessLicenseError}</p>
          )}
        </div>

        {/* 스튜디오 사진 업로드 */}
        <div className="mb-4">
          <label className="block font-semibold mb-1">
            스튜디오 사진 (최대 5장)
          </label>
          <div
            {...getStudioRootProps()}
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition min-h-[120px]"
          >
            <input {...getStudioInputProps()} multiple />
            {studioImages.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {previewImages.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`스튜디오 미리보기 ${idx + 1}`}
                    className="h-20 w-20 object-cover rounded border"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">🖼️</span>
                <span className="text-gray-500 text-sm">
                  파일을 끌어다 놓거나 클릭하여 업로드하세요
                </span>
                <span className="text-gray-400 text-xs mt-1">
                  JPG, PNG 파일 (최대 10MB, 최대 5장)
                </span>
                <span className="text-red-400 text-xs mt-1">
                  첨부된 사진이 없습니다. 파일선택에서 업로드 하세요
                </span>
              </div>
            )}
          </div>
          {studioImagesError && (
            <p className="text-red-500 text-sm mt-1">{studioImagesError}</p>
          )}
        </div>

        {/* 제출 버튼 */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-lime-500 hover:bg-lime-600 text-black px-6 py-2 rounded"
          >
            운영 신청하기
          </button>
        </div>
      </form>

      {/* 카카오 주소 검색 모달 */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[500px] max-h-[90vh] overflow-auto">
            <DaumPostcode
              onComplete={(data) => {
                const fullLocation = data.address;
                const extra = data.buildingName
                  ? ` (${data.buildingName})`
                  : "";
                setValue("location", fullLocation + extra);
                setIsModalOpen(false);
              }}
              autoClose
            />
            <div className="text-right mt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
