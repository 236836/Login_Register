package main

import "github.com/gin-gonic/gin"

func main() {

	// Createing a gin
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS")

		if c.Request.Method == "OPTIONS" {
			c.Status(204)
			return
		}
	})
	// Routes
	r.POST("/register", Register)
	r.POST("/login", Login)

	// Start server
	r.Run(":8080")
}
