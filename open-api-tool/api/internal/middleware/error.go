package middleware

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func ErrorHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Next()

        // Only handle errors if no response has been written
        if c.Writer.Written() {
            return
        }

        if len(c.Errors) > 0 {
            err := c.Errors.Last()
            switch err.Type {
            case gin.ErrorTypeBind:
                c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
            case gin.ErrorTypePrivate:
                c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
            default:
                c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            }
        }
    }
}
