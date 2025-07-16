# Studio Pick Frontend

Studio Pick 플랫폼의 프론트엔드 애플리케이션입니다. 사용자와 관리자를 위한 통합 인터페이스를 제공합니다.

## 기능

### 사용자 기능
- 회원가입 및 로그인
- 스튜디오 검색 및 예약
- 결제 처리
- 예약 관리
- 리뷰 작성

### 관리자 기능
- **관리자 대시보드**: 전체 현황 모니터링
- **스튜디오 승인**: 새로운 스튜디오 등록 요청 관리
- **예약 모니터링**: 실시간 예약 현황 추적
- **결제 및 정산**: 결제 내역과 정산 관리
- **환불 요청 관리**: 환불 요청 검토 및 처리
- **회원 계정 관리**: 사용자 계정 관리
- **신고 관리**: 신고된 콘텐츠 검토 및 처리
- **매출 대시보드**: 매출 현황과 트렌드 분석
- **알림 관리**: 시스템 알림 관리

## 기술 스택

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## 프로젝트 구조

```
src/
├── features/           # 기능별 모듈
│   ├── auth/          # 인증 관련
│   └── admin/         # 관리자 기능
│       ├── components/
│       │   ├── common/      # 공통 컴포넌트
│       │   └── layout/      # 레이아웃 컴포넌트
│       ├── pages/           # 관리자 페이지들
│       └── AdminApp.jsx     # 관리자 메인 앱
├── lib/               # API 및 유틸리티
│   ├── admin/         # 관리자 API
│   └── *.js          # 사용자 API들
├── router/            # 라우팅 설정
└── assets/           # 정적 자원
```

## 시작하기

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build
```

### 관리자 접근

관리자 기능에 접근하려면:

1. `/admin/login`으로 이동하여 관리자 로그인
2. 로그인 후 `/admin/dashboard`에서 관리자 대시보드 이용

### 사용 가능한 관리자 경로

- `/admin/login` - 관리자 로그인
- `/admin/dashboard` - 관리자 대시보드
- `/admin/studio` - 스튜디오 승인 관리
- `/admin/monitoring` - 예약 모니터링
- `/admin/payment` - 결제 및 정산
- `/admin/refund` - 환불 요청 관리
- `/admin/member` - 회원 계정 관리
- `/admin/report` - 신고 관리
- `/admin/sales` - 매출 대시보드
- `/admin/notification` - 알림 관리

## 개발 가이드

### 새로운 관리자 페이지 추가

1. `src/features/admin/pages/`에 새 페이지 컴포넌트 생성
2. `src/features/admin/AdminApp.jsx`에 라우트 추가
3. `src/features/admin/components/layout/Sidebar.jsx`에 메뉴 항목 추가
4. 필요한 경우 `src/lib/admin/`에 API 함수 추가

### 컴포넌트 사용

관리자 페이지에서 사용 가능한 공통 컴포넌트들:

```jsx
import { Button, Card, Input, Badge } from '../components/common';
import { StatCard, Table, SimpleBarChart, SimplePieChart } from '../components/common/DataComponents';
```

## 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Studio Pick
```

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
