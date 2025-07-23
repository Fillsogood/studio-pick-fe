#!/bin/sh

DOMAIN="studio.studiopick.p-e.kr"

# 인증서 없으면 발급
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  echo "📢 인증서 없음 → 발급 시도 중..."
  certbot certonly --non-interactive --agree-tos --nginx \
    -d $DOMAIN \
    -m qkswkd1122@gmail.com
fi

# 인증서 있으면 nginx 설정 교체
if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
  echo "✅ 인증 완료 → SSL nginx.conf로 교체"
  cp /etc/nginx/conf.d/ssl.conf.template /etc/nginx/conf.d/default.conf
fi

# 포그라운드로 nginx 실행
nginx -g "daemon off;"
