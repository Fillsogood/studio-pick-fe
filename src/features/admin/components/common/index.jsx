import React from 'react';

// 공통 카드 컴포넌트
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
    {children}
  </div>
);

// 버튼 컴포넌트
export const Button = ({ 
  children, 
  variant = "primary", 
  size = "medium", 
  onClick, 
  disabled = false,
  className = "",
  type = "button"
}) => {
  const baseClasses = "font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center";
  
  const variants = {
    primary: "bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-teal-500",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-teal-500"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

// 입력 필드 컴포넌트
export const Input = ({ 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  className = "",
  icon: Icon,
  disabled = false,
  required = false
}) => (
  <div className="relative">
    {Icon && (
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
    )}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={`block w-full border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${Icon ? 'pl-10' : ''} ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
    />
  </div>
);

// 배지 컴포넌트
export const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800"
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// 로딩 스피너 컴포넌트
export const LoadingSpinner = ({ size = "medium" }) => {
  const sizes = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12"
  };
  
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-teal-600 ${sizes[size]}`} />
  );
};

// 선택 박스 컴포넌트
export const Select = ({ 
  value, 
  onChange, 
  children, 
  className = "", 
  disabled = false 
}) => (
  <select
    value={value}
    onChange={onChange}
    disabled={disabled}
    className={`block w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </select>
);

// 텍스트 영역 컴포넌트
export const Textarea = ({ 
  placeholder, 
  value, 
  onChange, 
  rows = 3, 
  className = "", 
  disabled = false,
  required = false
}) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={rows}
    disabled={disabled}
    required={required}
    className={`block w-full border border-gray-300 rounded-lg px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-vertical ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${className}`}
  />
);

// 체크박스 컴포넌트
export const Checkbox = ({ 
  checked, 
  onChange, 
  label, 
  disabled = false,
  className = ""
}) => (
  <label className={`flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
    />
    {label && <span className="ml-2 text-sm text-gray-700">{label}</span>}
  </label>
);

// 모달 컴포넌트
export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = "medium" 
}) => {
  const sizes = {
    small: "max-w-md",
    medium: "max-w-lg", 
    large: "max-w-2xl",
    xlarge: "max-w-4xl"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 w-full ${sizes[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

// 알림/토스트 컴포넌트
export const Alert = ({ 
  type = "info", 
  title, 
  message, 
  onClose,
  className = ""
}) => {
  const types = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800"
  };

  const icons = {
    info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    success: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    warning: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
    error: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
  };

  return (
    <div className={`rounded-lg border p-4 ${types[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icons[type]} />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          {message && <p className={`text-sm ${title ? 'mt-1' : ''}`}>{message}</p>}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button
              onClick={onClose}
              className="inline-flex rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 focus:outline-none"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 탭 컴포넌트
export const Tabs = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className = "" 
}) => (
  <div className={`border-b border-gray-200 ${className}`}>
    <nav className="flex space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
            activeTab === tab.id
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </nav>
  </div>
);

// 페이지네이션 컴포넌트  
export const Pagination = ({
  currentPage,
  totalPages,
  totalElements,
  pageSize,
  onPageChange,
  className = ""
}) => (
  <div className={`flex items-center justify-between ${className}`}>
    <div className="text-sm text-gray-600">
      전체 {totalElements?.toLocaleString() || 0}개 중{' '}
      {Math.min(((currentPage - 1) * pageSize) + 1, totalElements || 0)} -{' '}
      {Math.min(currentPage * pageSize, totalElements || 0)}개 표시
    </div>
    <div className="flex items-center space-x-2">
      <Button 
        variant="outline" 
        size="small"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        이전
      </Button>
      <span className="text-sm text-gray-600">
        {currentPage} / {totalPages || 1}
      </span>
      <Button 
        variant="outline" 
        size="small"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= (totalPages || 1)}
      >
        다음
      </Button>
    </div>
  </div>
);
