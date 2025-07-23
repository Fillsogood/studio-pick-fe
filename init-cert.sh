#!/bin/sh

if [ ! -f /etc/letsencrypt/live/studio.studiopick.p-e.kr/fullchain.pem ]; then
  echo "📢 SSL 인증서 발급 시작"
  certbot certonly --non-interactive --agree-tos --nginx \
    -d studio.studiopick.p-e.kr \
    -m your-email@example.com
else
  echo "✅ 이미 인증서가 존재합니다"
fi
