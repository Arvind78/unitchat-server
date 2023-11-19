const express = require('express');
const path = require('path')
// Import the user controller function
const { handleSignUp, handleSignIn, handleUpdate, handleDelete, handleVerifyUser, handleGoogleAuth, handleForgetPassword } = require('../controllers/userController');
// Create a new Express Router instance
const route = express.Router();

// Create a storage to store imgage or video file using multer
const multer = require('multer');
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null , "upload/")
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    }
})

const upload =multer({storage:storage})
 
// Define user routes and corresponding controller functions
route.post('/user/signup',handleSignUp)
route.post('/user/signin',handleSignIn)
route.post('/user/google/auth',handleGoogleAuth)
route.put('/user/update',upload.single("profileImg"),handleUpdate)
route.post('/user/verify',handleVerifyUser)
route.delete('/user/delete/:id',handleDelete)
route.put('/user/forget',handleForgetPassword)


// Export the router to be used in the main application
module.exports = route;

