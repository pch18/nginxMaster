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
	if pkg.HashAuth(oldAuth) != pkg.CurUserPassHash {
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

	pkg.CurUserPassHash = pkg.HashAuth(newAuth)
	pkg.WriteFile(pkg.UserPassFile, []byte(newAuth))

	c.Status(401)
	c.Abort()
}

func Login(c *gin.Context) {
	var requestBody map[string]interface{}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid JSON",
		})
		return
	}

	var auth string

	auth, _ = requestBody["auth"].(string)
	if len(auth) < 8 || pkg.HashAuth(auth) != pkg.CurUserPassHash {
		c.JSON(http.StatusOK, gin.H{
			"err": "auth Wrong",
		})
		return
	}

	pkg.Sign(c, auth)
	c.JSON(http.StatusOK, gin.H{})
}

func Logout(c *gin.Context) {
	pkg.UnSign(c)
}
