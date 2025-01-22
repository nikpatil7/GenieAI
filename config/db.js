const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
  try{
    await mongoose.connect(process.env.MONGO_URI, );
    console.log(`Mongodb Database Connected: ${mongoose.connection.host}`.cyan.white);

  }catch(err){
    console.log(`Mongodb Database Error: ${err.message}`.red);
    process.exit(1);
  }
}

module.exports = connectDB;