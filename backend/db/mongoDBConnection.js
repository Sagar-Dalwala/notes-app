import mongoose from "mongoose";

const mongoDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected: ", db.connection.name);
    } catch (error) {
        console.log("MongoDB Connection Failed: ", error);
    }
};

export default mongoDB;