import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Dialog } from "@headlessui/react";
import DaumPostcode from "react-daum-postcode";
import { useDropzone } from "react-dropzone";
import { uploadImages } from "../../lib/studioAPI";
import { applyStudio } from "../../lib/studioApplicationAPI";
import { getMyProfile } from "../../lib/userAPI";

export default function StudioApplyPage() {
  const { register, handleSubmit, setValue } = useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [myProfile, setMyProfile] = useState({});
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const [businessLicenseFile, setBusinessLicenseFile] = useState(null);
  const [bizError, setBizError] = useState("");
  const [previewImages, setPreviewImages] = useState([]);
  const [studioImagesError, setStudioImagesError] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [imageUrls, setImageUrls] = useState([]); // S3 업로드 후 받은 URL들
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [thumbnailError, setThumbnailError] = useState("");

  const navigate = useNavigate();

  const { getRootProps: getBizRootProps, getInputProps: getBizInputProps } =
    useDropzone({
      accept: {
        "application/pdf": [".pdf"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
      maxFiles: 1,
      maxSize: 5 * 1024 * 1024,
      onDrop: (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
          setBizError(
            "PDF, JPG, PNG 파일만 첨부 가능하며 5MB 이하만 가능합니다."
          );
          setBusinessLicenseFile(null);
          return;
        }
        setBizError("");
        setBusinessLicenseFile(acceptedFiles[0]);
      },
    });

  const {
    getRootProps: getThumbnailRootProps,
    getInputProps: getThumbnailInputProps,
  } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024,
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setThumbnailError(
          "JPG, PNG 파일만 첨부 가능하며 5MB 이하만 가능합니다."
        );
        setThumbnailPreview(null);
        setThumbnailImage(null);
        return;
      }

      try {
        setThumbnailError("");
        const file = acceptedFiles[0];
        const previewUrl = URL.createObjectURL(file);
        setThumbnailPreview(previewUrl);

        // S3 업로드 - 썸네일은 단일 URL만 저장
        const formData = new FormData();
        formData.append("images", file);

        const uploadResponse = await uploadImages(formData);
        console.log("썸네일 업로드 응답:", uploadResponse);

        // uploadStudioImages는 이미 response.data.data를 반환하므로 직접 사용
        const uploadedUrls = uploadResponse.data.data;
        setImageUrls(uploadedUrls);
        console.log("추출된 URL들:", uploadedUrls);

        if (uploadedUrls && uploadedUrls.length > 0) {
          setThumbnailImage(uploadedUrls);
        } else {
          throw new Error("업로드된 이미지 URL을 받지 못했습니다.");
        }
      } catch (error) {
        console.error("썸네일 업로드 실패:", error);
        setThumbnailError("썸네일 업로드에 실패했습니다.");
        setThumbnailPreview(null);
        setThumbnailImage(null);
      }
    },
  });

  const {
    getRootProps: getStudioRootProps,
    getInputProps: getStudioInputProps,
  } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
    onDrop: async (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        setStudioImagesError(
          "JPG, PNG 파일만 첨부 가능하며 10MB 이하, 최대 5장까지 업로드 가능합니다."
        );
        setPreviewImages([]);
        setImageUrls([]);
        return;
      }

      try {
        setStudioImagesError("");
        const urls = acceptedFiles.map((file) => URL.createObjectURL(file));
        setPreviewImages(urls);
        // S3 업로드
        const formData = new FormData();
        acceptedFiles.forEach((file) => formData.append("images", file));

        const uploadResponse = await uploadImages(formData);
        const uploadedUrls = uploadResponse.data.data;
        setImageUrls(uploadedUrls);
        console.log("드롭존 이미지 업로드 응답:", uploadResponse);

        // uploadStudioImages는 이미 response.data.data를 반환하므로 직접 사용
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        setStudioImagesError("이미지 업로드에 실패했습니다.");
        setPreviewImages([]);
        setImageUrls([]);
      }
    },
  });

  // 일반 input을 위한 이미지 변경 핸들러
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    try {
      setStudioImagesError("");
      const urls = files.map((file) => URL.createObjectURL(file));
      setPreviewImages(urls);
      setThumbnailImage(urls[0] || "");

      // S3 업로드
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const uploadResponse = await uploadImages(formData);
      const uploadedUrls = uploadResponse.data.data;
      console.log("이미지 업로드 응답:", uploadResponse);

      // uploadStudioImages는 이미 response.data.data를 반환하므로 직접 사용
      setImageUrls(uploadedUrls);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      setStudioImagesError("이미지 업로드에 실패했습니다.");
      setPreviewImages([]);
      setImageUrls([]);
    }
  };

  // 이미지 삭제 함수 수정
  const removeImage = (indexToRemove) => {
    setPreviewImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setImageUrls((prev) => prev.filter((_, index) => index !== indexToRemove));

    // 첫 번째 이미지가 삭제되면 다음 이미지를 대표로 설정
    if (indexToRemove === 0 && previewImages.length > 1) {
      setThumbnailImage(previewImages[1]);
    } else if (previewImages.length === 1) {
      setThumbnailImage("");
    }
  };

  // 평을 m²로 환산하는 함수 (1평 = 3.3058m²)
  const convertPyeongToSquareMeters = (pyeong) => {
    if (!pyeong || isNaN(pyeong)) return null;
    return (parseFloat(pyeong) * 3.3058).toFixed(1);
  };

  // 공간 크기 입력 처리 함수
  const handleSizeChange = (e) => {
    const value = e.target.value;
    // 숫자와 소수점만 허용
    const numericValue = value.replace(/[^0-9.]/g, "");
    setSizeInput(numericValue);
    setValue("size", numericValue);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowModal(true);
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      setIsProfileLoading(true);

      // 타임아웃 설정 (5초)
      const timeoutId = setTimeout(() => {
        setIsProfileLoading(false);
        console.warn("프로필 로딩 타임아웃");
      }, 5000);

      getMyProfile()
        .then((res) => {
          clearTimeout(timeoutId);
          console.log("프로필 정보:", res.data);
          // API 응답 구조: {success: true, data: {userInfo}}
          const userData = res.data.data;
          setMyProfile(userData);
          // 대표자명을 form에 설정
          if (userData && userData.name) {
            setValue("representativeName", userData.name);
          }
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.error("프로필 조회 실패:", error);
          // 에러가 발생해도 로그인 상태는 유지
        })
        .finally(() => {
          setIsProfileLoading(false);
        });
    }
  }, [setValue]);

  useEffect(() => {
    if (myProfile.name) {
      setValue("representativeName", myProfile.name);
    }
  }, [myProfile, setValue]);

  // 디버깅용: myProfile 상태 변화 추적
  useEffect(() => {
    console.log("myProfile 상태 변화:", myProfile);
  }, [myProfile]);

  const onSubmit = async (data) => {
    try {
      const fullAddress = address + " " + addressDetail;

      // JSON 객체로 payload 생성
      const payload = {
        name: data.name,
        description: data.description,
        location: fullAddress,
        phone: data.phone,
        size: data.size,
        thumbnailImage: thumbnailImage[0], // 단일 URL
        images: imageUrls, // 배열
      };

      console.log("전송할 데이터:", payload);
      console.log("보내기 전 썸네일:", thumbnailImage); // 🔍 null? or string?
      console.log("보내기 전 이미지 리스트:", imageUrls);

      // applyStudio 함수가 JSON으로 전송하도록 수정 필요
      await applyStudio(payload);
      alert("스튜디오 신청 완료!");
      navigate("/");
    } catch (error) {
      console.error("신청 오류:", error);
      alert("오류가 발생했어요 😢");
    }
  };

  const handleCompleteDaumPost = (data) => {
    const fullAddress =
      data.address + (data.buildingName ? ` (${data.buildingName})` : "");
    setAddress(fullAddress);
    setIsModalOpen(false);
  };

  if (isLoggedIn === null) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-md text-center">
          <p>정보를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
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
              onClick={() => navigate("/")}
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
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          스튜디오 운영 신청
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 기본 정보 섹션 */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
              기본 정보
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                스튜디오 이름
              </label>
              <input
                {...register("name", { required: true })}
                placeholder="스튜디오 이름을 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                대표자명
              </label>
              <input
                value={isProfileLoading ? "로딩 중..." : myProfile.name || ""}
                readOnly
                placeholder={
                  isProfileLoading ? "" : "프로필 정보를 불러오는 중..."
                }
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                  isProfileLoading
                    ? "bg-gray-100 text-gray-400"
                    : "bg-gray-50 text-gray-600"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                연락처
              </label>
              <input
                {...register("phone", { required: true })}
                placeholder="전화번호를 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                스튜디오 설명
              </label>
              <textarea
                {...register("description", { required: true })}
                placeholder="스튜디오에 대한 상세한 설명을 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent h-48 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                공간 크기
              </label>
              <div className="space-y-2">
                <input
                  value={sizeInput}
                  onChange={handleSizeChange}
                  placeholder="예: 10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {sizeInput && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{sizeInput}평</span>
                    {convertPyeongToSquareMeters(sizeInput) && (
                      <span className="ml-2 text-gray-500">
                        ({convertPyeongToSquareMeters(sizeInput)}m²)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 주소 섹션 */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
              주소(위치)
            </h3>

            {/* 경고 메시지 */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    ① 공간 주소는 최초 등록 이후 직접 변경할 수 없습니다.
                    <span className="text-red-600 font-medium cursor-pointer hover:underline">
                      고객센터(클릭)
                    </span>
                    을 통해 주소 변경을 요청해주세요.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3">
                <input
                  value={address}
                  readOnly
                  placeholder="실제 서비스되는 공간의 주소를 입력해주세요"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="px-6 py-3 bg-lime-300 text-black border border-lime-200 rounded-lg hover:bg-lime-200 transition-colors font-medium"
                >
                  주소등록
                </button>
              </div>

              <input
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="상세 주소"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* 대표이미지 섹션 */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
              대표이미지
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                스튜디오의 대표 이미지를 선택해주세요 (최대 5MB)
              </p>
              <div className="flex gap-3">
                <div
                  {...getThumbnailRootProps()}
                  className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-lime-400 hover:bg-lime-50 transition-colors"
                >
                  <input {...getThumbnailInputProps()} />
                  {thumbnailPreview ? (
                    <div className="space-y-3">
                      <div className="flex justify-center">
                        <div className="relative group">
                          <img
                            src={thumbnailPreview}
                            alt="대표이미지 미리보기"
                            className="h-24 w-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setThumbnailPreview("");
                              setThumbnailImage("");
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        클릭하여 다른 이미지 선택 또는 파일을 드래그하세요
                      </p>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-gray-600">
                        <span className="font-medium">클릭하여 파일 선택</span>{" "}
                        또는 여기로 파일을 드래그하세요
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PNG 파일 (최대 5MB)
                      </p>
                    </div>
                  )}
                </div>
                <div className="px-6 py-3 bg-lime-300 text-black border border-lime-200 rounded-lg hover:bg-lime-200 transition-colors font-medium cursor-pointer flex items-center whitespace-nowrap">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          setThumbnailError("");
                          const previewUrl = URL.createObjectURL(file);
                          setThumbnailPreview(previewUrl);

                          // S3 업로드
                          const formData = new FormData();
                          formData.append("images", file);

                          const thumbnailUploadResponse = await uploadImages(
                            formData
                          );
                          console.log(
                            "썸네일 업로드 응답 (파일첨부):",
                            thumbnailUploadResponse
                          );

                          // 여러 구조 대응
                          let uploadedUrl =
                            thumbnailUploadResponse.data?.imageUrls?.[0] ||
                            thumbnailUploadResponse.data?.[0] ||
                            thumbnailUploadResponse?.[0];

                          console.log("실제 추출된 썸네일 URL:", uploadedUrl);

                          if (uploadedUrl) {
                            setThumbnailImage(uploadedUrl);
                          } else {
                            throw new Error(
                              "업로드된 이미지 URL을 받지 못했습니다."
                            );
                          }
                        } catch (error) {
                          console.error("썸네일 업로드 실패:", error);
                          setThumbnailError("썸네일 업로드에 실패했습니다.");
                          setThumbnailPreview("");
                        }
                      }
                    }}
                    className="hidden"
                    id="thumbnail-file-input"
                  />
                  <label
                    htmlFor="thumbnail-file-input"
                    className="cursor-pointer"
                  >
                    파일첨부
                  </label>
                </div>
              </div>
              {thumbnailError && (
                <p className="text-red-500 text-sm">{thumbnailError}</p>
              )}
            </div>
          </div>

          {/* 이미지 업로드 섹션 */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
              이미지
            </h3>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                2048 * 1158 권장, 한 장당 최대 3MB(최대 5장)
              </p>

              {/* 드롭존 영역과 파일 첨부 버튼을 나란히 배치 */}
              <div className="flex gap-3">
                <div
                  {...getStudioRootProps()}
                  className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-lime-400 hover:bg-lime-50 transition-colors"
                >
                  <input {...getStudioInputProps()} multiple />

                  {previewImages.length > 0 ? (
                    // 이미지가 있을 때 미리보기 표시
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        {previewImages.map((src, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={src}
                              alt={`미리보기 ${idx + 1}`}
                              className="h-20 w-full object-cover rounded border"
                            />
                            {/* 삭제 버튼 */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(idx);
                              }}
                              className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        클릭하여 추가 이미지 선택 또는 파일을 드래그하세요
                      </p>
                    </div>
                  ) : (
                    // 이미지가 없을 때 업로드 안내
                    <div className="text-center space-y-2">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-gray-600">
                        <span className="font-medium">클릭하여 파일 선택</span>{" "}
                        또는 여기로 파일을 드래그하세요
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PNG 파일 (최대 10MB, 최대 5장)
                      </p>
                    </div>
                  )}
                </div>

                <div className="px-6 py-3 bg-lime-300 text-black border border-lime-200 rounded-lg hover:bg-lime-200 transition-colors font-medium cursor-pointer flex items-center whitespace-nowrap">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="studio-images-input"
                  />
                  <label
                    htmlFor="studio-images-input"
                    className="cursor-pointer"
                  >
                    파일첨부
                  </label>
                </div>
              </div>

              {studioImagesError && (
                <p className="text-red-500 text-sm">{studioImagesError}</p>
              )}
            </div>
          </div>

          {/* 사업자등록증 섹션 */}
          {/* <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
              사업자 등록증
            </h3>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                PDF, JPG, PNG 형식의 파일을 업로드하세요 (최대 5MB)
              </p>

              <div className="flex gap-3">
                <div
                  {...getBizRootProps()}
                  className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-lime-400 hover:bg-lime-50 transition-colors"
                >
                  <input {...getBizInputProps()} />

                  {businessLicenseFile ? (
                    // 파일이 있을 때 파일 아이콘과 정보 표시
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-12 w-12 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {businessLicenseFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(businessLicenseFile.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBusinessLicenseFile(null);
                        }}
                        className="flex-shrink-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    // 파일이 없을 때 업로드 안내
                    <div className="text-center space-y-2">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-gray-600">
                        <span className="font-medium">클릭하여 파일 선택</span>{" "}
                        또는 여기로 파일을 드래그하세요
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG 파일 (최대 5MB)
                      </p>
                    </div>
                  )}
                </div>

                <div
                  {...getBizRootProps()}
                  className="px-6 py-3 bg-lime-300 text-black border border-lime-200 rounded-lg hover:bg-lime-200 transition-colors font-medium cursor-pointer flex items-center whitespace-nowrap"
                >
                  <input {...getBizInputProps()} />
                  파일첨부
                </div>
              </div>

              {bizError && <p className="text-red-500 text-sm">{bizError}</p>}
            </div>
          </div> */}

          {/* 제출 버튼 */}
          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-300 text-black border border-gray-200 px-6 py-3 rounded hover:bg-gray-200 transition-colors font-medium"
            >
              취소하기
            </button>
            <button
              type="submit"
              className="bg-lime-300 text-black border border-lime-200 px-6 py-3 rounded hover:bg-lime-200 transition-colors font-medium"
            >
              신청하기
            </button>
          </div>
        </form>
      </div>

      {/* 주소 검색 모달 */}
      {isModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-auto">
            <DaumPostcode onComplete={handleCompleteDaumPost} autoClose />
            <div className="text-right mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
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
