# 编译 golang
from golang:alpine3.20 as builder

workdir /srv

copy ./srv /srv
run go build -o /app-bin .

# 构建镜像
# from nginx:stable-alpine
from nginx:stable-alpine-perl

copy --from=builder /app-bin /nginx_master_app
copy ./web/dist /nginx_master_web

copy ./entrypoint /nginx_master_entrypoint
copy ./nginx.conf /etc/nginx/nginx.conf

run mkdir -p /nginx_logs \
    && mkdir -p /nginx_master/servers \
    && mkdir -p /nginx_master/certs \
    && chmod -R 755 /nginx_master /nginx_master_web /nginx_master_app /nginx_master_entrypoint

workdir /nginx_master
volume /nginx_master
volume /nginx_logs

entrypoint ["/nginx_master_entrypoint"]
cmd []
