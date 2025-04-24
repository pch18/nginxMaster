package main

import (
	"os"
	"path/filepath"
	"trace-gui/ctl"

	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
)

const (
	// webDir = "/web"
	webDir = "/Users/pch18/Codes/git.easit.jp/tracelog-gui/web/dist"
)

func main() {

	router := gin.Default()
	router.ContextWithFallback = true

	router.Use(gzip.Gzip(gzip.DefaultCompression))

	router.Use(func(c *gin.Context) {
		if len(c.Request.URL.Path) >= 4 && c.Request.URL.Path[:4] == "/api" {
			c.Next()
			return
		}

		path := filepath.Join(webDir, filepath.Clean(c.Request.URL.Path))
		if _, err := filepath.Rel(webDir, path); err == nil {
			if _, err := os.Stat(path); err == nil {
				c.File(path)
				return
			}
		}

		c.File(webDir + "/index.html")
	})

	router.POST("/api/v1/login", ctl.Login)
	router.POST("/api/v1/logout", ctl.Logout)

	apiRouter := router.Group("/api/v1/")
	// apiRouter.Use(pkg.AuthMiddleWare)

	apiRouter.POST("/search_by_id", ctl.SearchById)
	apiRouter.POST("/search_by_cond", ctl.SearchByCond)
	apiRouter.POST("/get_sys", ctl.GetSys)

	// 启动 HTTP 服务，监听在 8080 端口
	router.Run(":7777")
}
