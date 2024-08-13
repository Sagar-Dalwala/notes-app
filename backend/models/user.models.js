import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    createdOn:{
        type: Date,
        default: new Date().getTime(),
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
