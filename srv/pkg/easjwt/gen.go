package easjwt

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/pkg/errors"
)

type JwtClaims[JwtData any] struct {
	Data JwtData
	jwt.StandardClaims
}

func (m JwtClaims[any]) Valid() error {
	return nil
}

func genJwtString[JwtData any](secretKey []byte, id string, jwtData *JwtData) (string, error) {
	now := time.Now()
	claims := JwtClaims[JwtData]{
		// Data: *jwtData,
		StandardClaims: jwt.StandardClaims{
			Id:       id,
			IssuedAt: now.Unix(),
		},
	}
	if jwtData != nil {
		claims.Data = *jwtData
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secretKey)
}

func parseJwtString[JwtData any](secretKey []byte, jwtString string, jwtData *JwtData) (*JwtClaims[JwtData], bool, error) {
	token, err := jwt.ParseWithClaims(jwtString, &JwtClaims[JwtData]{}, func(token *jwt.Token) (interface{}, error) {
		return secretKey, nil
	})
	if err != nil {
		return nil, false, err
	}
	jwtClaims, ok := token.Claims.(*JwtClaims[JwtData])
	if !ok {
		return nil, false, errors.New("Parse Jwt Failed")
	}
	*jwtData = jwtClaims.Data
	valid := time.Since(time.Unix(jwtClaims.IssuedAt, 0)) <= jwtRefreshDur
	return jwtClaims, valid, nil
}
