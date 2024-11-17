package ctl

import (
	"net/http"
	"nginx_master/pkg"

	"github.com/gin-gonic/gin"
)

func ListCert(c *gin.Context) {
	var requestBody map[string]interface{}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid JSON",
		})
		return
	}

	list, err := pkg.ListCert()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"err": "ListCertConfigs Failed",
		})
	}

	full, _ := requestBody["full"].(bool)
	if !full {
		for _, v := range list {
			v["pemRaw"] = ""
			v["keyRaw"] = ""
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"list": list,
	})
}

func SaveCert(c *gin.Context) {
	var requestBody map[string]interface{}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid JSON",
		})
		return
	}

	var id, pemRaw, keyRaw string
	var ok bool

	id, ok = requestBody["id"].(string)
	if !ok || !pkg.IsValidId(id) {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid id",
		})
		return
	}
	pemRaw, ok = requestBody["pemRaw"].(string)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid pemRaw",
		})
		return
	}
	keyRaw, ok = requestBody["keyRaw"].(string)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid keyRaw",
		})
		return
	}

	certPemPath, certKeyPath, _ := pkg.PathCert(id)
	requestBody["pemPath"] = certPemPath
	requestBody["keyPath"] = certKeyPath

	output, err := pkg.SaveCert(id, requestBody, pemRaw, keyRaw)
	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"err": "SaveCert Failed",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"output":     output,
		"certConfig": requestBody,
	})
}

func DelCert(c *gin.Context) {
	var requestBody map[string]interface{}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid JSON",
		})
		return
	}

	var id string
	var ok bool

	id, ok = requestBody["id"].(string)
	if !ok || !pkg.IsValidId(id) {
		c.JSON(http.StatusBadRequest, gin.H{
			"err": "Invalid id",
		})
		return
	}

	output, err := pkg.SaveCert(id, nil, "", "")

	if err != nil {
		c.JSON(http.StatusOK, gin.H{
			"err":    "SaveCert Failed",
			"output": output,
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"output": output,
	})
}
