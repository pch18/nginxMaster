# Trace 日志查询系统

## 登录方式

- 默认连接地址: http://IP:9999
- 默认用户名: admin
- 默认密码: admin9999


## docker 安装命令:
```
docker run -d --name trace-gui -p 80:80 --restart always pch18/trace-gui
```
支持多架构，amd64, arm64 等，如果缺了某个架构的构建，请提 issue

## 构建发布
```
cd web
pnpm build
cd ..
docker buildx create --use
docker buildx build --platform=linux/amd64,linux/arm64 -t pch18/trace-gui . --push
```
