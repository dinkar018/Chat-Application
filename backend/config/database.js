import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async ()=> {
    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log('MongoDB connected successfully');
    }).catch((error) => {
        console.log('MongoDB connection failed:', error.message);
    })
};

export default connectDB;