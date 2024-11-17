package pkg

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

var BasicAuthSecret string

func init() {
	authData, err := os.ReadFile(AuthFile)
	if err == nil {
		BasicAuthSecret = string(authData)
	} else if os.IsNotExist((err)) {
		// admin:admin9999
		BasicAuthSecret = "YWRtaW46YWRtaW45OTk5"
	}
}

func BasicAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		if len(auth) > 6 && auth[6:] == BasicAuthSecret {
			c.Next()
			return
		}
		c.Header("WWW-Authenticate", `Basic realm="Restricted"`)
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}
