//export express
const express = require("express");
//export mongoose
const mongoose = require("mongoose");
//export dotenv
require("dotenv").config();
//express app
const app = express();
//set port
const PORT = 5500;
// middleware
app.use(express.json());
//connect to mongoDB
mongoose.connect(process.env.MONG_URI)
.then(()=>{
    console.log("Mongodb connected successfully");
})
.catch((err)=>{
    console.log(err);
});
//define user schema
const userSchema = new mongoose.Schema({
name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
// Create the User model
const User = mongoose.model("User", userSchema);
// 1. CREATE USER - POST
app.post("/user", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }
    const user = await User.create({ name, email });
    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 2. READ ALL USERS - GET
app.get("/user", async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// 3. READ ONE USER - GET
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ message: "Invalid user ID" });
  }
});
// 4. UPDATE COMPLETE USER - PUT
app.put("/user/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required for PUT",
      });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// 5. UPDATE PART OF USER - PATCH
app.patch("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User partially updated successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// 6. DELETE USER - DELETE
app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      message: "User deleted successfully",
      user,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid user ID" });
  }
});
// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
// Start server after connecting to MongoDB
mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
