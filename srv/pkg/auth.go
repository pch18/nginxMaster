package pkg

import (
	"crypto/md5"
	"encoding/hex"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// admin:admin9999
const initUserPass = "YWRtaW46YWRtaW45OTk5"
const cookieName = "_x_"
const cookieExpire = 7200

var AuthHashKey []byte
var CurAuthWithHash string

func init() {
	timestamp := time.Now().UnixNano()
	AuthHashKey = []byte(strconv.FormatInt(timestamp, 36))

	_userPass, err := os.ReadFile(AuthFile)
	if err == nil {
		CurAuthWithHash = HashAuthByte(_userPass)
	} else if os.IsNotExist((err)) {
		CurAuthWithHash = HashAuth(initUserPass)
	}
}

func AuthMiddleWare(c *gin.Context) {
	cookieAuth, err := c.Request.Cookie(cookieName)
	if err != nil || cookieAuth.Value != CurAuthWithHash {
		c.AbortWithStatus(401)
		return
	}
	SignCookie(c, cookieAuth.Value)
	c.Next()
}

func SignCookie(c *gin.Context, hash string) {
	c.SetCookie(cookieName, hash, cookieExpire,
		"/", "", false, true)
}

func HashAuth(input string) string {
	hash := md5.Sum(append(AuthHashKey, []byte(input)...))
	return hex.EncodeToString(hash[:])
}

func HashAuthByte(input []byte) string {
	hash := md5.Sum(append(AuthHashKey, input...))
	return hex.EncodeToString(hash[:])
}
