# 编译 golang
from golang:alpine3.20 as builder

workdir /srv

copy ./srv /srv
run go build -o /app-bin .

# 构建镜像
# from nginx:stable-alpine
from nginx:stable-alpine-perl

env TZ=Asia/Shanghai

copy ./nginx.conf /etc/nginx/nginx.conf
copy ./web/dist /nginx_master_web

copy --from=builder /app-bin /nginx_master_app
copy ./entrypoint /nginx_master_entrypoint
run chmod 755 /nginx_master_app /nginx_master_entrypoint

workdir /nginx_master
volume /nginx_master
volume /nginx_logs

expose 9999
entrypoint ["/nginx_master_entrypoint"]
cmd []
