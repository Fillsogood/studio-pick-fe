### 🔧 1단계: Vite 정적 파일 빌드
FROM node:18-alpine AS builder
WORKDIR /app

# 빌드 인자
ARG VITE_API_BASE_URL
ARG VITE_KAKAO_REST_API_KEY
ARG VITE_KAKAO_REDIRECT_URI
ARG VITE_KAKAO_LOGOUT_REDIRECT_URI
ARG VITE_KAKAO_MAP_KEY

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_KAKAO_REST_API_KEY=$VITE_KAKAO_REST_API_KEY \
    VITE_KAKAO_REDIRECT_URI=$VITE_KAKAO_REDIRECT_URI \
    VITE_KAKAO_LOGOUT_REDIRECT_URI=$VITE_KAKAO_LOGOUT_REDIRECT_URI \
    VITE_KAKAO_MAP_KEY=$VITE_KAKAO_MAP_KEY

# 종속성 설치
COPY package.json yarn.lock* package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# 소스 복사 및 빌드
COPY . .
RUN npm run build


### 🔐 2단계: Nginx + Certbot + 정적 파일 배포

FROM nginx:stable-alpine

# certbot 설치
RUN apk add --no-cache certbot certbot-nginx bash curl

# Nginx 설정 복사
COPY nginx.http.conf /etc/nginx/conf.d/default.conf         # 최초 HTTP-only
COPY nginx.ssl.conf.template /etc/nginx/conf.d/ssl.conf.template

# 인증서 발급 스크립트 복사
COPY init-cert.sh /init-cert.sh
RUN chmod +x /init-cert.sh

# 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80 443

# 컨테이너 실행 시 인증서 발급 및 Nginx 실행
CMD ["/bin/sh", "-c", "/init-cert.sh && nginx -g 'daemon off;'"]
