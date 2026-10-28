package main

import (
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// ---------- TASK ----------
type Task struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
}

var tasks = []Task{
	{ID: 1, Title: "Buy Milk"},
	{ID: 2, Title: "Learn Go"},
}

func main() {
	r := gin.Default()

	// CORS
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		if c.Request.Method == "OPTIONS" {
			c.Status(204)
			return
		}
		c.Next()
	})

	// ========== AUTH ==========
	r.POST("/register", func(c *gin.Context) {
		var u User
		if err := c.ShouldBindJSON(&u); err != nil {
			c.JSON(400, gin.H{"error": "Invalid data"})
			return
		}
		if u.Name == "" || u.Email == "" || u.Password == "" {
			c.JSON(400, gin.H{"error": "All fields required"})
			return
		}
		if _, exists := users[u.Email]; exists {
			c.JSON(400, gin.H{"error": "Email already registered"})
			return
		}
		hash, _ := bcrypt.GenerateFromPassword([]byte(u.Password), 10)
		u.Password = string(hash)
		users[u.Email] = u
		c.JSON(200, gin.H{"message": "Registered successfully!"})
	})

	r.POST("/login", func(c *gin.Context) {
		var input struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		c.ShouldBindJSON(&input)

		user, exists := users[input.Email]
		if !exists {
			c.JSON(401, gin.H{"error": "Email not found"})
			return
		}
		if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)) != nil {
			c.JSON(401, gin.H{"error": "Wrong password"})
			return
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"email": user.Email,
			"exp":   time.Now().Add(24 * time.Hour).Unix(),
		})
		tokenString, _ := token.SignedString([]byte("mySecretKey123"))

		c.JSON(200, gin.H{
			"message": "Login successful!",
			"token":   tokenString,
			"user":    gin.H{"name": user.Name, "email": user.Email},
		})
	})

	// ========== TASKS CRUD ==========
	r.GET("/tasks", func(c *gin.Context) {
		c.JSON(200, tasks)
	})

	r.POST("/tasks", func(c *gin.Context) {
		var t Task
		c.ShouldBindJSON(&t)
		t.ID = len(tasks) + 1
		tasks = append(tasks, t)
		c.JSON(200, t)
	})

	r.PUT("/tasks/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		var t Task
		c.ShouldBindJSON(&t)
		for i := 0; i < len(tasks); i++ {
			if tasks[i].ID == id {
				tasks[i].Title = t.Title
				c.JSON(200, tasks[i])
				return
			}
		}
		c.JSON(404, gin.H{"error": "not found"})
	})

	r.DELETE("/tasks/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		for i := 0; i < len(tasks); i++ {
			if tasks[i].ID == id {
				tasks = append(tasks[:i], tasks[i+1:]...)
				c.JSON(200, gin.H{"message": "deleted"})
				return
			}
		}
		c.JSON(404, gin.H{"error": "not found"})
	})

	r.Run(":8080")
}
