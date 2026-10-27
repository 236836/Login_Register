package main

import (
	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {
	var input User

	// 1. Read data from request
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(400, gin.H{"error": "Invalid data"})
		return
	}

	// 2. Required fields check
	if input.Name == "" || input.Email == "" || input.Password == "" {
		c.JSON(400, gin.H{"error": "Name, Email and Password are required"})
		return
	}

	// 3. Check if email already exists
	if _, exists := users[input.Email]; exists {
		c.JSON(400, gin.H{"error": "Email already Exist in the Map box"})
		return
	}

	// 4. Hash (scramble) the password
	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), 10)
	if err != nil {
		c.JSON(500, gin.H{"error": "Could not hash password"})
		return
	}
	input.Password = string(hash)

	// 5. Save user
	users[input.Email] = input

	// 6. Success response
	c.JSON(200, gin.H{
		"message": "Registered successfully!",
		"user": gin.H{
			"name":  input.Name,
			"email": input.Email,
		},
	})
}
