// import express from "express";
const express = require("express");
// Import mongoose for MongoDB connection
const mongoose = require("mongoose");
// Load environment variables from .env file
require("dotenv").config();
// Create an instance of the Express application
const app = express();
// Define the port number for the server to listen on
const PORT = 5000;
// Middleware to read JSON sent by Postman
app.use(express.json());
// Connect to MongoDB using the connection string from environment variables
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});
// Define the User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});
// Create the User model
const User = mongoose.model("User", userSchema);
// 1. Create the User - POST
app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required" });
        }
        const user = await User.create({ name, email });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error creating user", error });
    }
});
// 2. Get all users - GET
app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
});
// Read one user by ID - GET
app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);    
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }   

    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }       
    
});
// 4. Update complete user   - PUT
app.put("/users/:id", async (req, res) => {
    try {
        const { name, email } = req.body;   

        const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error });
    }
});
const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { runvalidators: true });
if (!user) {
    return res.status(404).json({ message: "User not found" });
}
res.status(200).json(user); massage : "User updated successfully"
// 3. Update partial user - PATCH
app.patch("/users/:id", async (req, res) => {
    try {
        const updates = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
// 5. Delete user - DELETE
app.delete("/users/:id", async (req, res) => {
    try {   
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }       
});
// handle undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// start after connecting to MongoDB
mongoose.connection.once("open", () => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
    }
