import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    avatarUrl: {
        type: String,
    },
    role: {
        type: String,
        enum: ['student', 'instructor', 'admin'],
        default: 'student',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);

export default userModel;