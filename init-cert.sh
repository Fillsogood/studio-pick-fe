#!/bin/sh

DOMAIN="studios.studiopick.p-e.kr"
EMAIL="qkswkd1122@gmail.com"
CERT_PATH="/etc/letsencrypt/live/$DOMAIN/fullchain.pem"

# 인증서 발급 함수
issue_cert() {
  echo "📢 인증서 없음 → 발급 시도 중..."
  certbot certonly --non-interactive --agree-tos --standalone \
    -d $DOMAIN -m $EMAIL
}

# 인증서가 없을 경우 시도
if [ ! -f "$CERT_PATH" ]; then
  issue_cert
fi

# 인증서가 성공적으로 있으면 SSL 설정 적용
if [ -f "$CERT_PATH" ]; then
  echo "✅ 인증서 존재함 → SSL nginx.conf 적용"
  cp /etc/nginx/conf.d/ssl.conf.template /etc/nginx/conf.d/default.conf
else
  echo "❌ 인증서 발급 실패 또는 Rate Limit에 걸림. HTTP 설정으로 fallback"
  cp /etc/nginx/conf.d/http.conf.template /etc/nginx/conf.d/default.conf
fi

# nginx PID 충돌 방지 디렉토리
mkdir -p /run/nginx

# nginx 실행
nginx -g "daemon off;"
