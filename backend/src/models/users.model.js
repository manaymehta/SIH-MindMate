import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        dailySentiments: [
            {
                date: {
                    type: Date,
                    required: true,
                },
                sentiment: {
                    type: String,
                    required: true,
                },
                confidence: {
                    type: Number,
                    required: true,
                }
            },
        ],
    },
    {timestamps: true}
);

const User = mongoose.model("User", userSchema);

export default User;