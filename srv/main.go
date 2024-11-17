package main

import (
	"nginx_master/ctl"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	apiRouter := router.Group("/api/v1/")
	apiRouter.POST("/list_site_list", ctl.ListSiteList)
	apiRouter.POST("/verify_site", ctl.VerifySite)
	apiRouter.POST("/save_site", ctl.SaveSite)
	apiRouter.POST("/set_pass", ctl.SetPass)

	// 启动 HTTP 服务，监听在 8080 端口
	router.Run(":9999")
}
