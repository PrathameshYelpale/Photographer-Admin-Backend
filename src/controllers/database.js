const mongoose = require('mongoose');

// const uri = "mongodb+srv://dhanajiadate:3x9Zy962kRiMDUM4@photographers-db.emkps.mongodb.net/?retryWrites=true&w=majority&appName=Photographers-db";
const uri = "mongodb+srv://dhanajiadate:3x9Zy962kRiMDUM4@photographers-db.emkps.mongodb.net/Photographers-Admin_DB?retryWrites=true&w=majority&appName=Photographers-db";

const connectDB = async () => {
    await mongoose.connect(uri)
    console.log("DB connected successfullly !");
}

module.exports = connectDB;