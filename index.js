const express = require("express");
const moogose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 5500;

//Middleware 
app.use(express.json());

//connect to DB

moogose.connect(process.env.MONGO_URI)
.then(() => console.log("Mongobd connected successfully"))
.catch((err) => console.log("MongoDB connection error: ", err));

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

const User = mongoose.model("User", userSchema);

//Start CRUD operations
app.post("/users", async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            reture res.status(400).json({
                message: "Name and email are required", 
            }); 
            }
            const user = await User.create({ name, email });

            res.status(201).json({
                message: "User created successfully",
            });
            catch (err) {
                res.status(500).json({
                    message: "Server error",
                    error: err.message,
                });
            }

app.get("/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ users });
    } catch (err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
    }
}
app.get ("/users/:id", async (req, res) => {
    try {
        const user = await User .findById(req.params.id
        )
        if (!user) {
            return res.status(400).json({
                message: "User not found",
            });
        }
     res.status(200).json({ user});
    } 
    catch(err) {
        res.status(500).json({
            message: "Server error",
            error: err.message,
        });
       }
        
    app.put("/users/:id", async (req, res) => {
        try {
            const { name, email } = req.body;
            if (!name || !email) {
                return res.status(400).json({
                    message: "Name and email are required in Put",
                });
            }                                                                                       
    }const user = await User.findByIdAndUpdate(
        REQ.params.id,
        { name, email },
    { new: true runValidators: true }
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
      return res.(404).json({
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
    const user = await User.findByIdAndDelete(req..id);

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
    res.status(400)({ message: "Invalid user ID" });
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

