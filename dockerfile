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
copy ./web/dist /trace-gui_web

copy --from=builder /app-bin /trace-gui_app
copy ./entrypoint /trace-gui_entrypoint
run chmod 755 /trace-gui_app /trace-gui_entrypoint

workdir /trace-gui
volume /trace-gui
volume /nginx_logs

expose 9999
entrypoint ["/trace-gui_entrypoint"]
cmd []
