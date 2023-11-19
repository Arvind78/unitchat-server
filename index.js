// Importing required modules and configurations
const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path')
const dbConnection = require('./connection/dbConnection');
const route  = require('./routes/routes');

// Creating an instance of Express.js
const app = express();

// Instance middleware function 
app.use(cors());
app.use(express.json());
app.use('/upload', express.static(path.join(__dirname,"upload")));
app.use("/api",route);


// Error handling middleware: captures and sends error responses to the client
app.use((err,req,res,next)=>{
   const status = err.status || 500 ;
   const message = err.message || "Internal Server Error";
   res.status(status).json({message});
})

// Starting the server and establishing a connection to the database
app.listen(process.env.PORT,()=>{
    console.log(`Server is Running ${process.env.PORT}`);
    dbConnection();
})

