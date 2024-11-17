package ctl

import (
	"net/http"
	"nginx_master/pkg"

	"github.com/gin-gonic/gin"
)

func ListSiteList(c *gin.Context) {
	list, err := pkg.ListServerConfigs()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"err": "ListServerConfigs Failed"})
	}

	c.JSON(http.StatusOK, gin.H{
		"list": list,
	})
}

func VerifySite(c *gin.Context) {
	var requestBody map[string]interface{}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": "Invalid JSON"})
		return
	}

	var nginxConfig string
	var ok bool

	nginxConfig, ok = requestBody["nginxConfig"].(string)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"err": "Invalid nginxConfig"})
		return
	}

	output, err := pkg.NginxVerify(nginxConfig)
	c.JSON(http.StatusOK, gin.H{
		"err":    err,
		"output": output,
	})
}

func SaveSite(c *gin.Context) {
	var requestBody map[string]interface{}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"err": "Invalid JSON"})
		return
	}

	var id, nginxConfig string
	var serverConfig any
	var ok bool

	id, ok = requestBody["id"].(string)
	if !ok || !pkg.IsValidId(id) {
		c.JSON(http.StatusBadRequest, gin.H{"err": "Invalid id"})
		return
	}
	serverConfig = requestBody["serverConfig"]
	nginxConfig, ok = requestBody["nginxConfig"].(string)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"err": "Invalid nginxConfig"})
		return
	}
	// output, err := pkg.NginxVerify(nginxConfig)
	// if err != nil {
	// 	c.JSON(http.StatusOK, gin.H{
	// 		"err":    err,
	// 		"output": output,
	// 	})
	// 	return
	// }

	output, err := pkg.UpdateServer(id, serverConfig, nginxConfig)
	c.JSON(http.StatusOK, gin.H{
		"err":    err,
		"output": output,
	})
}