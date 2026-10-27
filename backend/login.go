package main

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Login(c *gin.Context) {
	var input struct {
		Name     string `json: "name" required:"true"`
		Email    string `json: "email" required:"true"`
		Password string `json: "password" required:"true"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid data"})
		return
	}
	if input.Email == "" || input.Password == "" {
		c.JSON(400, gin.H{"error": "Email and Password are required"})
		return
	}

	user, exists := users[input.Email]
	if !exists {
		c.JSON(401, gin.H{
			"error": "Email does not exist",
		})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))

	if err != nil {
		c.JSON(401, gin.H{
			"error": "Does not Match Passwrod",
		})

	}

	jwt := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email ": user.Email,
		"exp":    time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenString, _ := jwt.SignedString([]byte("mySecretPassword123"))

	// 6. Success response
	c.JSON(200, gin.H{
		"message": "Login successful!",
		"token":   tokenString,
		"user": gin.H{
			"name":  user.Name,
			"email": user.Email,
		},
	})
}
