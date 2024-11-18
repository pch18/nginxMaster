package main

import (
	"nginx_master/ctl"
	"nginx_master/pkg"
	"os"

	"github.com/gin-gonic/gin"
)

func main() {

	router := gin.Default()
	router.GET("/*path", func(c *gin.Context) {
		path := pkg.WebDir + c.Param("path")
		_, err := os.Stat(path)
		if os.IsNotExist(err) {
			c.File(pkg.WebDir + "/index.html")
		} else {
			c.File(path)
		}
	})

	router.POST("/api/v1/login", ctl.Login)
	router.POST("/api/v1/logout", ctl.Logout)

	apiRouter := router.Group("/api/v1/", pkg.AuthMiddleWare)

	apiRouter.POST("/list_site", ctl.ListSite)
	apiRouter.POST("/save_site", ctl.SaveSite)
	apiRouter.POST("/verify_site", ctl.VerifySite)

	apiRouter.POST("/list_cert", ctl.ListCert)
	apiRouter.POST("/save_cert", ctl.SaveCert)
	apiRouter.POST("/del_cert", ctl.DelCert)

	apiRouter.POST("/set_auth", ctl.SetAuth)

	// 启动 HTTP 服务，监听在 8080 端口
	router.Run(":9999")
}
