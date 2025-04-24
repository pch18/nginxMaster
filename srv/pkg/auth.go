package pkg

import (
	"crypto/md5"
	"encoding/hex"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// admin:admin7777
const initUserPass = "YWRtaW46YWRtaW43Nzc3"
const cookieName = "_x_"
const cookieExpire = 3600

var AuthHashKey []byte
var CurAuthWithHash string

func init() {
	timestamp := time.Now().UnixNano()
	AuthHashKey = []byte(strconv.FormatInt(timestamp, 36))

	_userPass := os.Getenv("USER_PASS")
	if _userPass != "" {
		CurAuthWithHash = HashAuth(_userPass)
	} else {
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
