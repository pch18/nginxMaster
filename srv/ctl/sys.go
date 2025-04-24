package ctl

import (
	"net/http"
	"trace-gui/pkg"

	"github.com/gin-gonic/gin"
)

func GetSys(c *gin.Context) {
	var requestBody map[string]interface{}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid JSON",
		})
		return
	}

	auth, _ := requestBody["auth"].(string)
	if len(auth) < 8 {
		c.JSON(http.StatusOK, gin.H{
			"err": "Invalid auth",
		})
		return
	}

	hashAuth := pkg.HashAuth(auth)
	if hashAuth != pkg.CurAuthWithHash {
		c.JSON(http.StatusOK, gin.H{
			"err": "Wrong auth",
		})
		return
	}

	pkg.SignCookie(c, hashAuth)
	c.JSON(http.StatusOK, gin.H{})
}
