//import required modules
const express = require("express");
//import mongoose module
const mongoose = require("mongoose");
//load environment variables from .env file
require("dotenv").config();
//create an instance of express application
const app = express();
//Define the port number for the server to listen on
const PORT = process.env.PORT || 3000;
//middleware to parse incoming JSON requests
app.use(express.json());
//connect to MongoDB database using connection string from environment variables
mongoose
    .connect(process.env.MONGO_URI, )  
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch((error) => {
            console.error("Error connecting to MongoDB:", error);
        });
        //Define the user schema for MongoDB
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
//create a User model
const User = mongoose.model("User", userSchema);
//Create a new user
app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
//READ all users GET

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: Error.message });
    }
});

//READ ONE user GET
app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Invalid user ID" });
    }
});
//UPDATE COMPLET User PUT
app.put("/users/:id", async (req, res) => {
    try {
 const { name, email } = req.body;   
const user = await User.findByIdAndUpdate(  
req.params.id,
 { name, email },
 { new: true, runValidators: true }
     );
if (!user) {
               
return res.status(404).json({ message: "User not found"
},
);
res.json(user);
}
 //UPDATE PARTIAL User PATCH
 app.patch("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message});
    }
});

//DELETE User DELETE
app.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findById
AndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Invalid user ID" });

    }
//Handle undefined routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

 // Start server after connecting to MongoDB
mongoose.connection.once("open", () => {
 app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
 });


