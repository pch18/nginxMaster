package pkg

import (
	"crypto/md5"
	"encoding/hex"
	"os"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

const initUserPass = "admin:admin9999"
const cookieName = "_x_"

var hashAuthKey []byte

var CurUserPassHash string

func init() {
	timestamp := time.Now().UnixNano()
	hashAuthKey = []byte(strconv.FormatInt(timestamp, 36))

	_userPass, err := os.ReadFile(UserPassFile)
	if err == nil {
		CurUserPassHash = HashAuthByte(_userPass)
	} else if os.IsNotExist((err)) {
		CurUserPassHash = HashAuth(initUserPass)
	}
}

func AuthMiddleWare(ctx *gin.Context) {
	cookieAuth, err := ctx.Request.Cookie(cookieName)
	if err != nil || cookieAuth.Value != CurUserPassHash {
		ctx.Status(401)
		ctx.Abort()
		return
	}
	ctx.Next()
}

func Sign(ctx *gin.Context, key string) {
	ctx.SetCookie(cookieName, HashAuth(key), 86400,
		"/", "", true, true)
}

func UnSign(ctx *gin.Context) {
	ctx.SetCookie(cookieName, "", 86400,
		"/", "", true, true)
	ctx.Status(401)
	ctx.Abort()
}

func HashAuth(input string) string {
	hash := md5.Sum(append(hashAuthKey, []byte(input)...))
	return hex.EncodeToString(hash[:])
}

func HashAuthByte(input []byte) string {
	hash := md5.Sum(append(hashAuthKey, input...))
	return hex.EncodeToString(hash[:])
}
