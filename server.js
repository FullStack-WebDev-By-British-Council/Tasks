      ///ASSESMENT 2///

//import express ,moongoose, and dotenv
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//create app and set the port
const app = express();
const PORT = process.env.PORT || 3000;

//middleware to to read json data
app.use(express.json());

//connect to mongodb using mongo uri from .env file
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error("MongoDB connection error:", err));
    

    //create user schema and define the fields
const userSchema = new mongoose.Schema({
name: {
        type: String,
        required: true,
    },
email: {
       type: String,
        required: true,
        unique: true
    }
});

//create user model
const User = mongoose.model('User', userSchema);

//create user by post 
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Read  all users by get
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//Read  one user by id get
app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//Update user by id put
app.put('/users/:id', async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//delete user by id delete
app.delete('/users/:id',async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
//handle unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

//server start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
