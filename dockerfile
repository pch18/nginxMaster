# 编译 golang
from golang:alpine3.20 as builder

workdir /srv

copy ./srv /srv
run go build -o /nginx_master_app .

# 构建镜像
# from nginx:stable-alpine
from nginx:stable-alpine-perl

env NGINX_MASTER_BASE=/nginx_master_data
copy --chmod=755 --from=builder /nginx_master_app /nginx_master_app
volume /nginx_master_data
expose 9999

entrypoint ["/nginx_master_app"]
cmd []
