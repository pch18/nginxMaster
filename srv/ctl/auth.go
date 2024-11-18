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
	if pkg.HashAuth(oldAuth) != pkg.CurAuthWithHash {
		c.JSON(http.StatusOK, gin.H{
			"err": "Wrong oldAuth",
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

	pkg.CurAuthWithHash = pkg.HashAuth(newAuth)
	pkg.WriteFile(pkg.AuthFile, []byte(newAuth))

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

func Logout(c *gin.Context) {
	pkg.SignCookie(c, "")
	c.Status(401)
	c.Abort()
}
