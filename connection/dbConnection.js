// Importing the mongoose library
const mongoose = require('mongoose');

// Function to establish a connection to the MongoDB database
const dbConnection = () => {
      mongoose.connect(process.env.MONGODB_URL).then(() => {
         console.log(`Database connected !`);
    }).catch((err) => {
        console.log(err.message);
        process.exit(1);
    });
};

// Exporting the dbConnection function 
module.exports = dbConnection;
