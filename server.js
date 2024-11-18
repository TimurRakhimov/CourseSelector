/**
 * Author: Timur Rakhimov
 * Date: 2024-11-12
 * Description: Node.js server using Express and MongoDB for a course selection application. 
 * Provides routes for user registration, login, and course management (view, add, delete).
 */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/courseSelectionDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(express.static("public"));

// Define Mongoose models
const User = require("./models/userModel.js");
const Course = mongoose.model("Course", { courseId: String, courseName: String });

// Route to handle user login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username and password
        const user = await User.findOne({ username, password });
        if (user) {
            res.json({ success: true, username });
        } else {
            res.json({ success: false, message: "Invalid username or password." });
        }
    } catch (error) {
        // Handle server errors
        res.status(500).json({ success: false, message: "Server error during login." });
    }
});


// Define the registration route
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: "Username already exists." });
        }

        // Create a new user with an empty courses array
        const newUser = new User({ username, password, courses: [] });
        await newUser.save();
        res.json({ success: true, message: "Registration successful!" });
    } catch (error) {
        // Handle server errors
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Server error during registration." });
    }
});


// Route to get all courses for a specific user
app.get("/courses", async (req, res) => {
    const { username } = req.query;

    try {
        console.log("Fetching courses for user:", username);

        // Find the user by username and select only the "courses" field
        const user = await User.findOne({ username }).select("courses");
        console.log("User data fetched from MongoDB:", user);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Return the user's courses or an empty array if none exist
        res.status(200).json(user.courses || []);
    } catch (error) {
        // Handle server errors
        console.error("Error during course fetching:", error);
        res.status(500).json({ success: false, message: "Server error fetching courses." });
    }
});


// Route to add a new course for a specific user
app.post("/api/addCourse", async (req, res) => {
    const { username, courseId, courseName } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        // Initialize the courses array if it doesn't exist
        if (!user.courses) {
            user.courses = [];
        }

        // Check if the course already exists in the user's courses
        const existingCourse = user.courses.find((course) => course.courseId === courseId);
        if (existingCourse) {
            return res.json({ success: false, message: "Course already exists." });
        }

        // Add the new course to the user's courses array
        user.courses.push({ courseId, courseName });
        await user.save();
        res.json({ success: true, message: "Course added successfully!" });
    } catch (error) {
        // Handle server errors
        console.error("Error adding course:", error);
        res.status(500).json({ success: false, message: "Server error adding course." });
    }
});


// Route to delete a course for a specific user
app.delete("/api/deleteCourse/:courseId", async (req, res) => {
    const { username } = req.query;
    const courseId = req.params.courseId;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        // Remove the course from the user's courses array
        user.courses = user.courses.filter((course) => course.courseId !== courseId);
        await user.save();
        res.json({ success: true, message: "Course deleted successfully!" });
    } catch (error) {
        // Handle server errors
        res.status(500).json({ success: false, message: "Server error deleting course." });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
