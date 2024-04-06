import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
    },

    email: {
        type: String,
        required: [true, "Please Enter your Email"],
        unique: true,
        validate: validator.isEmail,
    },

    password: {
        type: String,
        required: [true, "Please Enter your password"],
        minLength: [8, "Password must be at least 8 characters"],
        select: false
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

    subscription: {
        id: String,
        status: String
    },

    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },

    playlist: [
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "courseModel",
            }
        }
    ],
    
    ResetPasswordToken: String,
    ResetPasswordToken: String,
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);

export default userModel;