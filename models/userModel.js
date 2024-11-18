/**
 * Author: Timur Rakhimov
 * Date: 2024-11-12
 * Description: Mongoose model for User collection, including user details and enrolled courses.
 */

const mongoose = require("mongoose");

// Define the Course schema (sub-document of User)
const courseSchema = new mongoose.Schema({
    courseId: String,
    courseName: String,
});

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    courses: [courseSchema], // Explicitly define the courses array
});

// Create the User model from the schema
const User = mongoose.model("User", userSchema);
// Export the User model to be used in other parts of the application
module.exports = User;