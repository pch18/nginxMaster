package ctl

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type SetPassReq struct {
	Name string `json:"name" binding:"required"`
	Pass string `json:"pass" binding:"required"`
}

func SetPass(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}
