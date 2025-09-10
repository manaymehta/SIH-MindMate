import { generateToken } from "../lib/utils.js";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        //passwrod validation
        if (password.length < 6) {
            return res.status(400).json({ message: "password must be at least 6 characters" })
        }
        //user validation
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "user already exists" })
        }
        //password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        //create user 
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            return res.status(201).json({ "message": "user created successfully", "user": { _id: newUser._id, fullname: newUser.fullname, email: newUser.email,}})
        } else {
            return res.status(400).json({ message: "Invalid user data" })
        }

    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' }) //error.message
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid Credentials" })
        }

        generateToken(user._id, res);
        console.log("User logged in:", user);
        res.status(200).json({
            message: "Logged in successfully",
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
        })


    } catch (error) {
        console.log("Error in Login: ", error)
        return res.status(500).json({ message: 'Internal Server Error' }) //error.message
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in Logout: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const checkAuth = async (req, res, next) => {
    try {
        res.status(200).json(req.user)

    } catch (error) {
        console.log("Error in checkAuth: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateUserSentiment = async (req, res) => {
    try {
        const { userId } = req.params;
        const { date, sentiment, confidence } = req.body;
        console.log("Updating sentiment for user:", userId, { date, sentiment, confidence });

        if (!date || !sentiment || !confidence) {
            return res.status(400).json({ message: "Date, sentiment, and confidence are required." });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        user.dailySentiments.push({ date: new Date(date), sentiment, confidence });
        await user.save();

        res.status(200).json({ message: "Sentiment updated successfully.", user });

    } catch (error) {
        console.error("Error updating user sentiment:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("fullname");
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsers: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getUserConfidence = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const confidenceData = user.dailySentiments.map(sentiment => sentiment.confidence);
        
        res.status(200).json(confidenceData);
    } catch (error) {
        console.error("Error in getUserConfidence: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};