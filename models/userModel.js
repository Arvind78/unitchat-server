const { default: mongoose } = require("mongoose");

// Define the schema for the user model
const userSchama = new mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    userName:{type:String},
    email:{type:String},
    password:{type:String,
    default:""
    },
    phone:{type:String},
    follow:{
        type: [String], 
        default:[]
    },
    followers:{
        type: [String], 
        default:[]
    },
    profileImg:{type:String},

},{timestamps:true});

// Create and export the 'User' model based on the schema
module.exports = mongoose.model("userSchama",userSchama);