#!/bin/sh

DOMAIN="studio.studiopick.p-e.kr"

# 인증서가 없으면 발급
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  echo "📢 인증서 없음 → 발급 시도 중..."
  certbot certonly --non-interactive --agree-tos --nginx \
    -d $DOMAIN \
    -m your-email@example.com
fi

# 인증서가 있으면 SSL 설정 복사
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  echo "✅ 인증 완료 → SSL nginx.conf로 교체"
  cp /etc/nginx/conf.d/ssl.conf.template /etc/nginx/conf.d/default.conf
  nginx -s reload
fi
