package easjwt

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
)

// 默认签发5分钟的jwt，过期后如果签发时间在设置的jwtExpire时间内，会自动重签发新的jwt
// const jwtRefreshDur = time.Minute * 5

const jwtRefreshDur = time.Second * 5

type SignJwtFn[JwtData any] func(ctx *gin.Context, id string) (*JwtData, error)
type ReadJwtFn[JwtData any] func(ctx *gin.Context) (*JwtData, error)
type ClearJwtFn func(ctx *gin.Context)

func New[JwtData any](
	// 密钥
	secretKey []byte,
	// 在cookie存的名称
	jwtName string,
	// 登录态有效期
	jwtExpire time.Duration,
	// 通过id获取jwtData回调函数
	genJwtDataFn func(ctx *gin.Context, id string) (*JwtData, error),
) (
	// 给gin的中间件
	middleWare gin.HandlerFunc,
	// 注销 jwt 方法
	clearJwtFn ClearJwtFn,
	// 向当前ctx签发Jwt
	signJwt SignJwtFn[JwtData],
	// 从ctx中获取JwtData
	readJwt ReadJwtFn[JwtData],
) {
	clearJwtFn = func(ctx *gin.Context) {
		// ctx.SetSameSite(http.SameSiteNoneMode)
		// ctx.SetSameSite(http.SameSiteStrictMode)
		ctx.SetCookie(jwtName, "", int(jwtExpire.Seconds()),
			"/", "", true, true)
		ctx.Status(401)
		ctx.Abort()
	}

	signJwt = func(ctx *gin.Context, id string) (*JwtData, error) {
		jwtData, err := genJwtDataFn(ctx, id)
		if err != nil {
			return nil, err
		}
		jwtString, err := genJwtString(secretKey, id, jwtData)
		if err != nil {
			return nil, err
		}
		// ctx.SetSameSite(http.SameSiteNoneMode)
		// ctx.SetSameSite(http.SameSiteStrictMode)
		ctx.SetCookie(jwtName, jwtString, int(jwtExpire.Seconds()),
			"/", "", true, true)

		return jwtData, nil
	}

	middleWare = func(ctx *gin.Context) {
		jwtCookie, err := ctx.Request.Cookie(jwtName)
		if err != nil {
			ctx.Status(401)
			ctx.Abort()
			return
		}
		jwtString := jwtCookie.Value
		jwtClaims, jwtValid, err := parseJwtString(secretKey, jwtString, new(JwtData))
		if err != nil {
			ctx.Status(401)
			ctx.Abort()
			return
		}

		JwtData := &jwtClaims.Data
		if !jwtValid {
			iat := time.Unix(jwtClaims.IssuedAt, 0)
			if time.Since(iat) > jwtExpire {
				ctx.Status(401)
				ctx.Abort()
				return
			}
			JwtData, err = signJwt(ctx, jwtClaims.Id)
			if err != nil {
				ctx.Status(401)
				ctx.Abort()
				return
			}
		}

		ctx.Set("_jwt_data", JwtData)
		ctx.Next()
	}

	readJwt = func(ctx *gin.Context) (*JwtData, error) {
		_jwtData, exists := ctx.Get("_jwt_data")
		if !exists {
			return nil, errors.New("_jwt_data not exists")
		}
		jwtData, ok := _jwtData.(*JwtData)
		if !ok {
			return nil, errors.New("_jwt_data parse failed")
		}
		return jwtData, nil
	}

	return
}
