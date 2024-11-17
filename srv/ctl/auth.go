package ctl

import (
	"net/http"
	"nginx_master/pkg"

	"github.com/gin-gonic/gin"
)

type SetPassReq struct {
	Name string `json:"name" binding:"required"`
	Pass string `json:"pass" binding:"required"`
}

func SetAuth(c *gin.Context) {
	var requestBody map[string]interface{}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid JSON",
		})
		return
	}

	var oldAuth, newAuth string
	var ok bool

	oldAuth, _ = requestBody["oldAuth"].(string)
	if oldAuth != pkg.BasicAuthSecret {
		c.JSON(http.StatusOK, gin.H{
			"err": "oldAuth Wrong",
		})
		return
	}

	newAuth, ok = requestBody["newAuth"].(string)
	if !ok || len(newAuth) < 8 {
		c.JSON(http.StatusOK, gin.H{
			"err": "Invalid auth",
		})
		return
	}

	pkg.BasicAuthSecret = newAuth
	pkg.WriteFile(pkg.AuthFile, []byte(newAuth))

	c.JSON(http.StatusOK, gin.H{})
}

func Logout(c *gin.Context) {
	c.Header("WWW-Authenticate", `Basic realm="LoggedOut"`)
	c.AbortWithStatus(http.StatusUnauthorized)
}
