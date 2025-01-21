package utils

import (
    "time"
    "github.com/dgrijalva/jwt-go"
)

func GenerateJWT(userID uint, secret string) (string, error) {
    token := jwt.New(jwt.SigningMethodHS256)
    
    claims := token.Claims.(jwt.MapClaims)
    claims["user_id"] = userID
    claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

    return token.SignedString([]byte(secret))
}

func GenerateResetToken() string {
    return time.Now().Format("20060102150405") + RandomString(32)
}

func RandomString(n int) string {
    const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    b := make([]byte, n)
    for i := range b {
        b[i] = letterBytes[time.Now().UnixNano()%int64(len(letterBytes))]
    }
    return string(b)
}
