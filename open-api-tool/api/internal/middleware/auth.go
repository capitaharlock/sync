package middleware

import (
    "strings"
    
    "github.com/gin-gonic/gin"
    "github.com/dgrijalva/jwt-go"
)

func AuthMiddleware(secretKey string) gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(401, gin.H{"error": "No authorization header"})
            c.Abort()
            return
        }

        tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return []byte(secretKey), nil
        })

        if err != nil || !token.Valid {
            c.JSON(401, gin.H{"error": "Invalid token"})
            c.Abort()
            return
        }

        claims, ok := token.Claims.(jwt.MapClaims)
        if !ok {
            c.JSON(401, gin.H{"error": "Invalid token claims"})
            c.Abort()
            return
        }

        userID := uint(claims["user_id"].(float64))
        c.Set("userID", userID)
        c.Next()
    }
}
