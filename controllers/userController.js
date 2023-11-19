 // Import custom error handler userModel and bcrypt for password hashing
const error = require("../error/error");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require("../mail/sendEmail");

/**
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * const imageUrl = req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename;
 **/

// Handles user signup logic.
const handleSignUp  = async(req,res,next)=>{
    const {email,password ,firstName}= req.body;
    try {
         const checkEmail = await userModel.findOne({email});
         if(checkEmail) return next(error(403,"Email already exits"));
        const securePassword = await bcrypt.hash(password,10);
        const newUser =  await userModel.create({
            ...req.body,
             userName:firstName+'@'+Math.floor(Math.random() * 1000),
             userName:firstName+'@'+Math.floor(Math.random() * 1000),
            password:securePassword,
            profileImg:`${firstName[0].toUpperCase()} ${lastName[0].toUpperCase()}`
        });
        res.status(201).json({ success: true, message: "User created successfully" });   
        const fullName = `${firstName} ${lastName}`
        sendEmail(fullName,email)  
    
    } catch (err) {
        next(err)
    }

};


// Handles user authentication using Google OAuth
const handleGoogleAuth = async (req, res, next) => {
    const { email, fullName, profileImg } = req.body;
  
    try {
      // Check if the user with the provided email already exists
      const existingUser = await userModel.findOne({ email });
  
      if (!existingUser) {
        // If the user does not exist, create a new user
        const firstName = fullName.split(" ")[0];
        const lastName = fullName.split(" ")[1] || ''; // Handle cases where fullName has only one part
        const newUser = await userModel.create({
          firstName: firstName,
          lastName: lastName,
          email:email,
          userName: `${firstName}_${Math.floor(Math.random() * 1000)}`,
          profileImg: profileImg,

        });
  
        res.status(201).json({
          success: true,
          message: "User created successfully",
          user: newUser,
        });
      } else {
        // If the user already exists, generate a JWT token for authentication
        const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);
        res.status(200).json({
          success: true,
          message: "User logged successfully",
          user: existingUser,
          token: token,
        });
      }
    } catch (err) {
      // Handle any errors that occur during the process
      next(err);
    }
  };
  


// Handles user signin logic.
const handleSignIn = async (req, res, next) => {
    const { email,password } = req.body;
    console.log(req.body);

    try {
      // Find the user with the provided email
      const existingUser = await userModel.findOne({ email });
  
      if (!existingUser) {
        res.status(404).json({ success: false, message: "Email does not exist" });

      }else {
        const matchPassword = await bcrypt.compare(password, existingUser.password);
        console.log(matchPassword);
        if (!matchPassword) {
          res.status(404).json({ success: false, message: "Email or Password is incorrect" });
        } else {
          res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: existingUser,
          });
        }
      }
    } catch (err) {
      // Handle any errors that occur during the process
      next(err);
    }
  };


// Handles user update logic.
const handleUpdate = async (req, res, next) => {
  const { id } = req.params; // Assuming 'id' is part of the request parameters

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
          profileImg: req.protocol + '://' + req.get('host') + '/upload/' + req.file.filename,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      // User with the given ID not found
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // User details updated successfully
    res.status(200).json({ success: true, message: 'User details updated successfully', user: updatedUser });
  } catch (err) {
    // Handle other errors
    next(err);
  }
};



// Handles user delete logic.
const handleDelete  = async(req,res,next)=>{
  const id = req.params.id;
    try {
        const deleteUser = await userModel.findByIdAndDelete(id);
        res.send("user delted")
    } catch (err) {
        next(err)
    }
};

// Handles user verification logic.
const handleVerifyUser  = async(req,res,next)=>{
  const authHeader = req.body.headers.Authorization;
  console.log(authHeader);

  if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authorization token not provided' });
  }

    try {

      const token = (req.body.headers.Authorization).split(" ");
     const verifyUser = jwt.verify(token[1],process.env.SECRET_KEY)
     console.log(verifyUser);
     if (!verifyUser) {
      return res.status(401).json({ success: false, message: 'Invalid authorization token' });
    }else{
      return res.status(200).json({ success: true, message: 'Authorization token successfully verified' });
    }
    } catch (err) {
        next(err)
    }
};

// Handles user forget password logic.
const handleForgetPassword  = async(req,res,next)=>{
    try {
        
    } catch (err) {
        next(err)
    }
};

module.exports = {
    handleSignUp,
    handleGoogleAuth,
    handleSignIn,
    handleUpdate,
    handleDelete,
    handleVerifyUser,
    handleForgetPassword
};


