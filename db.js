const mongoose = require('mongoose');

const mongoURI="mongodb://localhost:27017/e-com-web";

const connectDB = async()=>{
    try {
        mongoose.set('strictQuery',false)
        mongoose.connect(mongoURI)
        console.log("Mongo Connected")
    } catch (error) {
        console.log(error)
        process.exit()
    }
}

module.exports = connectDB