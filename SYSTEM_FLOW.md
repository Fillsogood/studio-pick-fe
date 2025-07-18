# Studio Pick 시스템 흐름도

## 🏗️ 전체 시스템 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Spring Boot) │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 인증 시스템 흐름

### 1. 일반 사용자 로그인

```
사용자 → 로그인 페이지 → 이메일/비밀번호 입력 → AuthController.login()
→ JWT 토큰 생성 → 쿠키에 저장 → 메인 페이지로 리다이렉트
```

### 2 관리자 로그인

```
관리자 → /admin/login → 이메일/비밀번호 입력 → AuthController.login()
→ JWT 토큰 생성 (ROLE_ADMIN) → 쿠키에 저장 → /admin/dashboard로 리다이렉트
```

### 3. 권한별 접근 제어

- **일반 사용자**: `/api/reservations/*`, `/api/studios/*`, `/api/users/*`
- **관리자**: `/api/admin/*` (모든 관리자 기능)
- **스튜디오 오너**: 스튜디오 관리 기능

## 📋 예약 시스템 흐름

### 1. 사용자 예약 생성 흐름

```
1 사용자 로그인
2. 스튜디오 목록 조회 → StudioListPage
3. 스튜디오 상세 조회 → StudioDetailPage
4예약 가능 시간 조회 → /api/reservations/available-times
5. 예약 정보 입력 (날짜, 시간, 인원)
6약 생성 요청 → /api/reservations/studio (POST)
7. 예약 상태: PENDING
8. 결제 페이지로 이동
```

### 2. 예약 상태 관리 흐름

```
PENDING (대기)
    ↓ (관리자 승인)
CONFIRMED (확정)
    ↓ (사용 완료)
COMPLETED (완료)

PENDING (대기)
    ↓ (사용자 취소)
CANCEL_REQUESTED (취소 요청)
    ↓ (관리자 승인)
CANCELLED (취소)
    ↓ (환불 처리)
REFUNDED (환불)
```

### 3. 관리자 예약 승인 흐름

```
1. 관리자 로그인 → /admin/login
2. 예약 모니터링 → /admin/monitoring
3. PENDING 상태 예약 목록 조회4. 예약 상세 정보 확인5 승인/거부 결정
6. 상태 변경 → /api/admin/reservations/{id}/status (PATCH)
7 사용자에게 알림 (구현 예정)
```

## 🏢 스튜디오 관리 흐름

### 1. 스튜디오 등록 흐름

```
1. 사용자 회원가입2 스튜디오 운영 신청 → /api/studios/apply
3. 신청 정보 입력 (이름, 위치, 운영타입, 요금 등)
4 서류 업로드 (사업자등록증, 기타 서류)
5. 신청 상태: PENDING
6관리자 승인 대기
```

### 2리자 스튜디오 승인 흐름

```
1. 관리자 로그인 → /admin/login2튜디오 승인 관리 → /admin/studio
3 PENDING 상태 스튜디오 목록 조회
4. 신청 서류 검토5 승인/거부 결정
6. 상태 변경 → /api/admin/studios/{id}/status (PATCH)
7. 승인 시 사용자 권한을 STUDIO_OWNER로 변경
```

### 3. 스튜디오 상태 관리

```
PENDING (승인대기)
    ↓ (관리자 승인)
ACTIVE (활성)
    ↓ (관리자 정지)
SUSPENDED (정지)
    ↓ (관리자 재활성화)
ACTIVE (활성)

PENDING (승인대기)
    ↓ (관리자 거부)
REJECTED (거부)
```

## 💰 결제 및 환불 흐름

### 1결제 흐름

```1 예약 생성 (PENDING 상태)2요청 → /api/payments/request
3. Toss Payments 연동4완료 → /api/payments/confirm
5. 예약 상태를 CONFIRMED로 변경6 결제 정보 저장
```

### 2. 환불 흐름

```
1 사용자 예약 취소 요청
2 취소 가능 시간 검증 (12 전까지)
3취소 수수료 계산
4. 예약 상태를 CANCEL_REQUESTED로 변경
5. 관리자 환불 승인 → /api/admin/refunds/{id}/approve
6. 환불 처리 → Toss Payments 환불 API
7. 예약 상태를 REFUNDED로 변경
```

## 👥 사용자 관리 흐름

###1. 회원가입 흐름

```
1. 회원가입 페이지 → /register
2 정보 입력 (이름, 이메일, 비밀번호, 휴대폰)
3. 이메일/휴대폰 중복 검사4원가입 요청 → /api/auth/register
5. 사용자 생성 (ROLE_USER)
6인 페이지로 리다이렉트
```

###2관리자 사용자 관리 흐름

```
1. 관리자 로그인 → /admin/login2. 회원 관리 → /admin/member
3. 사용자 목록 조회 → /api/admin/users
4 사용자 상세 정보 조회
5. 계정 상태 변경 (활성/비활성/잠금)6. 권한 변경 (USER/STUDIO_OWNER/ADMIN)
```

## 🔍 신고 및 리뷰 시스템 흐름

### 1신고 처리 흐름

```
1. 사용자 신고 제출 → /api/reports
2. 신고 정보 저장 (PENDING 상태)
3. 관리자 신고 관리 → /admin/report4 신고 내용 검토
5. 처리 결정 (처리완료/거부/자동숨김)
6. 신고 상태 업데이트
```

### 2. 리뷰 시스템 흐름

```
1. 예약 완료 후 리뷰 작성 가능
2 작성 → /api/reviews
3. 리뷰 정보 저장
4 스튜디오 평점 업데이트5적절한 리뷰 신고 가능
```

## 📊 관리자 대시보드 흐름

###1 대시보드 접근

```
1. 관리자 로그인 → /admin/login2 권한 확인 (ROLE_ADMIN)
3→ /admin/dashboard
4. 통계 정보 조회
   - 전체 예약 수
   - 승인 대기 스튜디오 수
   - 신고 처리 대기 수
   - 매출 통계
```

### 2 실시간 모니터링

```
1. 예약 모니터링 → /admin/monitoring
2 실시간 예약 현황 조회3. 예약 상태 변경4. 통계 차트 표시5. 엑셀 다운로드 (구현 예정)
```

## 🔧 시스템 설정 및 제약사항

###1. 예약 제약사항

- **최소 예약 시간**: 1시간
- **최대 예약 시간**: 8시간
- **최대 예약 인원**:20명 (시스템 설정 가능)
- **예약 가능 기간**: 최대90일 후까지
- **취소 가능 시간**: 예약 시작 12간 전까지

###2. 결제 제약사항

- **최소 결제 금액**:10,00
- **결제 수단**: Toss Payments (카드, 계좌이체 등)
- **환불 수수료**: 예약 시작 24간 전까지 무료

###3 권한 제약사항

- **일반 사용자**: 예약 생성, 조회, 취소
- **스튜디오 오너**: 스튜디오 관리, 예약 확인
- **관리자**: 모든 기능 접근 가능

## 🚀 개발 우선순위

### Phase 1: 핵심 기능 (완료)

- x] 사용자 인증 (로그인/회원가입)
- x] 관리자 인증 및 권한 관리
- [x] 스튜디오 등록 및 승인
- x] 예약 생성 및 관리
- [x] 기본 결제 연동

### Phase2: 고도화 기능 (진행중)

- [x] 예약 상태 관리
- [x] 관리자 대시보드
      -x] 환불 처리
- ] 실시간 알림
- [ ] 리뷰 시스템

### Phase3: 부가 기능 (예정)

- ] 엑셀 다운로드
- ] 통계 리포트
- ] 고객 지원 시스템
- [ ] 모바일 앱

## 🔗 API 엔드포인트 구조

### 인증 관련

- `POST /api/auth/login` - 로그인
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/logout` - 로그아웃

### 예약 관련

- `GET /api/reservations/my` - 내 예약 목록
- `POST /api/reservations/studio` - 스튜디오 예약 생성
- `PATCH /api/reservations/{id}/cancel` - 예약 취소

### 관리자 예약 관리

- `GET /api/admin/reservations` - 전체 예약 목록
- `PATCH /api/admin/reservations/{id}/status` - 예약 상태 변경

### 스튜디오 관련

- `GET /api/studios` - 스튜디오 목록
- `POST /api/studios/apply` - 스튜디오 등록 신청

### 관리자 스튜디오 관리

- `GET /api/admin/studios` - 스튜디오 관리 목록
- `PATCH /api/admin/studios/[object Object]id}/status` - 스튜디오 상태 변경

## 📝 개발 가이드라인

### 1. 상태 관리

- 모든 상태 변경은 관리자 권한 필요
- 상태 변경 시 사유 기록 필수
- 상태 변경 이력 추적

###2. 보안

- JWT 토큰 기반 인증
- 권한별 API 접근 제어
- 입력값 검증 및 XSS 방지

### 3. 데이터베이스

- 트랜잭션 관리
- 외래키 제약조건
- 인덱스 최적화

### 4. 프론트엔드

- 컴포넌트 재사용성
- 상태 관리 최적화
- 반응형 디자인

이 흐름도를 참고하여 AI가 작업할 때 시스템의 전체적인 구조와 각 기능의 연관관계를 이해할 수 있습니다.
