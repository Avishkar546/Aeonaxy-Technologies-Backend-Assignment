import mongoose from "mongoose";


const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Enter title for course"],
        minLength: [4, "Title must be 4 characters at least"],
        maxLength: [80, "Title can't exceed 80 characters"],
    },

    description: {
        type: String,
        required: [true, "Enter course description"],
        minLength: [20, "Title must be 4 characters at least"]
    },

    lectures: [
        {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true
            },
            video: {
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                },
            },
        },
    ],

    poster: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },

    views: {
        type: Number,
        default: 0
    },

    totalNoVideos: {
        type: Number,
        default: 0
    },

    category: {
        type: String,
        required: [true, "Please enter category of playlist"],
    },

    createdBy: {
        type: String,
        required: [true, "Please enter category of playlist"],
    },

    price: {
        type: Number,
        require: [true, "Please Enter a valid price"],
    },
},
    { timestamps: true }
)

const courseModel = mongoose.model('course', courseSchema);

export default courseModel;