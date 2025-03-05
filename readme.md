# NginxMaster【可视化 Nginx 管理面板】

## 简介
- 支持配置: 反向代理, 静态页面, 重定向 等
- 保存自动校验，失败自动回滚，确保 Nginx 服务不中断
- 可以管理 SSL 证书，自动识别证书内容，校验合法性（自动续签待开发）
- 更多功能开发中

## 登录方式

- 默认连接地址: http://IP:9999
- 默认用户名: admin
- 默认密码: admin9999


## docker 安装命令:
```
docker run -d --name nginx-master --net=host --restart always pch18/nginx-master
```
```
docker run -d --name nginx-master -p 9999:9999 -p 443:443 -p 80:80 --restart always pch18/nginx-master
```
支持多架构，amd64, arm64 等，如果缺了某个架构的构建，请提 issue


## 构建发布
```
docker buildx create --use
docker buildx build --platform=linux/amd64,linux/arm64 -t pch18/nginx-master . --push
```
