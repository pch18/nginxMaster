# 编译 golang
from golang:alpine3.20 as builder

workdir /srv

# copy ./srv/go.mod /srv
# copy ./srv/go.sum /srv
# run go mod download

copy ./srv /srv
run go build -o /app-bin .

# 构建镜像
# from nginx:stable-alpine
from nginx:stable-alpine-perl

copy --from=builder /app-bin /nginx_master_app
copy ./web/dist /nginx_master_web

copy ./entrypoint /entrypoint
copy ./nginx.conf /nginx_master/nginx.conf

run mkdir /nginx_master/servers \
    && mkdir /nginx_master/certs \
    && mkdir /nginx_master/logs \
    && chmod -R 755 /nginx_master /nginx_master_web /nginx_master_app /entrypoint

workdir /nginx_master
volume /nginx_master

entrypoint ["/entrypoint"]
cmd []