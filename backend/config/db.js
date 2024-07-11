import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database")
    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit();
    }
}

