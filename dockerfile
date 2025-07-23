# 1) 빌더 단계: Node.js 환경에서 정적 파일 생성
FROM node:18-alpine AS builder
WORKDIR /app

# 빌드 인자 정의
ARG VITE_API_BASE_URL
ARG VITE_KAKAO_REST_API_KEY
ARG VITE_KAKAO_REDIRECT_URI
ARG VITE_KAKAO_LOGOUT_REDIRECT_URI
ARG VITE_KAKAO_MAP_KEY

# 빌드 시 역시 ENV 로 노출 (Vite가 이 변수 읽음)
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_KAKAO_REST_API_KEY=$VITE_KAKAO_REST_API_KEY \
    VITE_KAKAO_REDIRECT_URI=$VITE_KAKAO_REDIRECT_URI \
    VITE_KAKAO_LOGOUT_REDIRECT_URI=$VITE_KAKAO_LOGOUT_REDIRECT_URI \
    VITE_KAKAO_MAP_KEY=$VITE_KAKAO_MAP_KEY
# package.json 과 lockfile 복사
COPY package.json yarn.lock* package-lock.json* ./

# lockfile 종류에 따라 설치 분기
RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# ---------------------------------------------------------------------
# 2) 런타임 단계: NGINX로 정적 파일 서빙
FROM nginx:stable-alpine AS runtime
WORKDIR /usr/share/nginx/html

# 기본 html 파일 제거
RUN rm -rf ./*

# 빌드 결과물 복사 (Vite 기본 출력: dist)
COPY --from=builder /app/dist .

# 커스텀 NGINX 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 컨테이너가 리스닝할 포트
EXPOSE 80

# NGINX 포그라운드 실행
CMD ["nginx", "-g", "daemon off;"]
