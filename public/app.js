/**
 * Author: Timur Rakhimov
 * Date: 2024-11-12
 * Description: AngularJS client-side script for handling user registration and navigation.
 */


// Define the AngularJS module for the Course Selection app
const app = angular.module("courseApp", []);

// Main Controller for Login
app.controller("MainController", function ($scope, $http) {
    $scope.message = "";
    $scope.success = false;

    // Function to handle user login
    $scope.login = function () {
        // Prepare login data with trimmed username and password
        const loginData = {
            username: $scope.username.trim(),
            password: $scope.password.trim(),
        };

        $http.post("/login", loginData)
            .then((response) => {
                // If login is successful, store the username and redirect to courses page
                if (response.data.success) { 
                    localStorage.setItem("username", $scope.username);
                    $scope.message = "Login successful! Redirecting...";
                    $scope.success = true;
                    setTimeout(() => {
                        window.location.href = "/courses.html";
                    }, 1000);
                } else { 
                    // Display error message if login fails
                    $scope.message = "Login failed. Please check your credentials.";
                    $scope.success = false;
                }
            })
            .catch((error) => {
                // Handle server error
                console.error("Server error:", error);
                $scope.message = "Server error. Please try again later.";
            });
    };

    // Function to navigate to the registration page
    $scope.goToRegister = function () {
        window.location.href = "/register.html";
    };
});

// Register Controller for User Registration
app.controller("RegisterController", function ($scope, $http) {
     $scope.message = "";
     $scope.success = false;
 
     // Function to handle user registration
     $scope.register = function () {
        // Prepare registration data with trimmed username and password
         const registrationData = {
             username: $scope.username.trim(),
             password: $scope.password.trim(),
         };
 
         console.log("Sending registration data:", registrationData);
 
         $http.post("/register", registrationData)
             .then((response) => {
                 console.log("Server response:", response.data);
                 // If registration is successful, display success message and redirect to login page
                 if (response.data.success) {
                     $scope.message = "Registration successful! You can now log in.";
                     $scope.success = true;
                     setTimeout(() => {
                         window.location.href = "/index.html";
                     }, 1000);
                 } else {
                    // Display error message if registration fails
                     $scope.message = response.data.message || "Registration failed. Please try again.";
                     $scope.success = false;
                 }
             })
             .catch((error) => {
                // Handle server error
                 console.error("Server error:", error);
                 $scope.message = "Server error during registration. Please try again later.";
             });
     };
     
     // Function to navigate back to the login page
     $scope.goToLogin = function () {
         window.location.href = "/index.html";
     };
 });
 

// Main Controller for Courses Page
app.controller("CoursesController", function ($scope, $http) {
     $scope.courses = [];
     $scope.newCourseId = "";
     $scope.newCourseName = "";
     const username = localStorage.getItem("username");
 
     // Function to load all courses for the logged-in user
     $scope.loadCourses = function () {
        const username = localStorage.getItem("username");
    
        $http.get("/courses", { params: { username } })
            .then((response) => {
                console.log("Full response from backend:", response);
    
                // Check if the response data is an array and contains courses
                if (Array.isArray(response.data)) {
                    $scope.courses = response.data;
                    console.log("Loaded courses:", $scope.courses);
                } else {
                    // If the response format is unexpected, log the issue
                    console.log("Unexpected response format:", response.data);
                    $scope.courses = [];
                }
            })
            .catch((error) => {
                // Handle error when fetching courses
                console.error("Error fetching courses:", error);
                alert("Failed to load courses. Please try again later.");
            });
    };
        
        
 
     // Function to add a new course
     $scope.addCourse = function () {
        // Validate input fields before making the request
         if ($scope.newCourseId && $scope.newCourseName) {
             const newCourse = {
                 username,
                 courseId: $scope.newCourseId.trim(),
                 courseName: $scope.newCourseName.trim(),
             };
 
             $http.post("/api/addCourse", newCourse)
                 .then((response) => {
                    console.log("Server response:", response.data);
                    // If course is added successfully, reload the courses list
                     if (response.data.success) {
                         alert("Course added successfully!");
                         $scope.loadCourses();
                         $scope.newCourseId = "";
                         $scope.newCourseName = "";
                     } else {
                         alert("Failed to add course. Please try again.");
                     }
                 })
                 .catch((error) => {
                    // Handle error when adding course
                     console.error("Error adding course:", error);
                     alert("Error adding course. Please try again.");
                 });
         } else {
            // Alert user if input fields are empty
             alert("Please enter both Course ID and Course Name.");
         }
     };
 
     // Function to delete a course
     $scope.deleteCourse = function (courseId) {
         $http.delete(`/api/deleteCourse/${courseId}`, { params:{ username }})
             .then((response) => {
                // If course is deleted successfully, reload the courses list
                 if (response.data.success) {
                     alert("Course deleted successfully!");
                     $scope.loadCourses();
                 } else {
                     alert("Failed to delete course. Please try again.");
                 }
             })
             .catch((error) => {
                // Handle error when deleting course
                 console.error("Error deleting course:", error);
                 alert("Error deleting course. Please try again.");
             });
     };

     // Function to log out the user
     $scope.logout = function () {
          localStorage.removeItem("username");
          window.location.href = "/index.html";
     };
 
     // Load courses when the controller is initialized
     $scope.loadCourses();
 });