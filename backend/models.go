package main

// User shape
type User struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Global variable to store registered users
var users = make(map[string]User)
