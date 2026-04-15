# 编译 golang
from golang:alpine3.20 as builder

workdir /srv

copy ./srv /srv
run go build -o /nginx_master .

# 构建镜像
# from nginx:stable-alpine
from nginx:stable-alpine-perl

env TZ=Asia/Shanghai
env CFG_BASE=/nginx_master_data

copy --chmod=755 --from=builder /nginx_master /nginx_master
copy --chmod=755 ./entrypoint /entrypoint

volume /nginx_master_data

expose 9999
entrypoint ["/entrypoint"]
cmd []
