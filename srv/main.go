package main

import (
	"embed"
	"io/fs"
	"net/http"
	"nginx_master/ctl"
	"nginx_master/pkg"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

//go:embed web/*
var webEmbedFs embed.FS

func main() {

	router := gin.Default()

	router.Use(gzip.Gzip(gzip.DefaultCompression))

	webFs, err := fs.Sub(webEmbedFs, "web")
	if err != nil {
		panic(err)
	}
	webHttpFs := http.FileServer(http.FS(webFs))

	router.Use(func(c *gin.Context) {
		if len(c.Request.URL.Path) >= 5 && c.Request.URL.Path[:5] == "/api/" {
			c.Next()
			return
		}

		if _, err := webFs.Open(c.Request.URL.Path[1:]); err != nil {
			c.Request.URL.Path = "/"
		}
		webHttpFs.ServeHTTP(c.Writer, c.Request)
	})

	router.POST("/api/v1/login", ctl.Login)
	router.POST("/api/v1/logout", ctl.Logout)

	apiRouter := router.Group("/api/v1/")
	apiRouter.Use(pkg.AuthMiddleWare)

	apiRouter.POST("/list_site", ctl.ListSite)
	apiRouter.POST("/save_site", ctl.SaveSite)
	apiRouter.POST("/verify_site", ctl.VerifySite)

	apiRouter.POST("/list_cert", ctl.ListCert)
	apiRouter.POST("/save_cert", ctl.SaveCert)
	apiRouter.POST("/del_cert", ctl.DelCert)

	apiRouter.POST("/set_auth", ctl.SetAuth)
	apiRouter.POST("/nginx_status", ctl.NginxStatus)
	apiRouter.POST("/nginx_start", ctl.NginxStart)
	apiRouter.POST("/nginx_reload", ctl.NginxReload)
	apiRouter.GET("/nginx_logs", ctl.NginxLogs)

	apiRouter.POST("/get_sys", ctl.GetSys)

	// 启动 HTTP 服务，监听在 8080 端口
	router.Run(":9999")
}
