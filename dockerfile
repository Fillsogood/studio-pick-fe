# 1) 빌더 단계: Node.js 환경에서 정적 파일 생성
FROM node:18-alpine AS builder
WORKDIR /app

# 의존성 설치 (package-lock.json / yarn.lock 활용)
COPY package.json yarn.lock* ./
RUN npm ci

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# ---------------------------------------------------------------------
# 2) 런타임 단계: NGINX로 정적 파일 서빙
FROM nginx:stable-alpine AS runtime
WORKDIR /usr/share/nginx/html

# 불필요한 기본 html 제거
RUN rm -rf ./*

# 빌드 산출물 복사
COPY --from=builder /app/build .

# (선택) 커스텀 NGINX 설정이 있다면 복사
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# NGINX 포그라운드 실행
CMD ["nginx", "-g", "daemon off;"]
