const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://Hackathon_Project:mXQF92uIinP0XaoV@cluster0.xjo6z5a.mongodb.net/', {
      // Mongoose 8 options - defaults are usually fine
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
