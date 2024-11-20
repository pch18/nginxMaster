package main

import (
	"nginx_master/ctl"
	"nginx_master/pkg"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()

	router.Use(func(c *gin.Context) {
		if c.Request.URL.Path[:4] == "/api" {
			c.Next()
			return
		}

		path := filepath.Join(pkg.WebDir, filepath.Clean(c.Request.URL.Path))
		if _, err := filepath.Rel(pkg.WebDir, path); err == nil {
			if _, err := os.Stat(path); os.IsNotExist(err) {
				c.File(path)
			}
		}
		c.File(pkg.WebDir + "/index.html")

	})

	router.POST("/api/v1/login", ctl.Login)
	router.POST("/api/v1/logout", ctl.Logout)

	apiRouter := router.Group("/api/v1/")
	// apiRouter.Use(pkg.AuthMiddleWare)

	apiRouter.POST("/list_site", ctl.ListSite)
	apiRouter.POST("/save_site", ctl.SaveSite)
	apiRouter.POST("/verify_site", ctl.VerifySite)

	apiRouter.POST("/list_cert", ctl.ListCert)
	apiRouter.POST("/save_cert", ctl.SaveCert)
	apiRouter.POST("/del_cert", ctl.DelCert)

	apiRouter.POST("/set_auth", ctl.SetAuth)
	apiRouter.POST("/nginx_status", ctl.NginxStatus)
	apiRouter.POST("/nginx_start", ctl.NginxStart)
	apiRouter.GET("/nginx_logs", ctl.NginxLogs)

	// 启动 HTTP 服务，监听在 8080 端口
	router.Run(":9999")
}
