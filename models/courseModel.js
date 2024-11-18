/**
 * Author: Timur Rakhimov
 * Date: 2024-11-12
 * Description: Mongoose model for the Course collection.
 */

const mongoose = require("mongoose");

// Define the Course schema
const courseSchema = new mongoose.Schema({
    courseId: String,
    courseName: String,
});

// Create and export the Course model
module.exports = mongoose.model("Course", courseSchema);
