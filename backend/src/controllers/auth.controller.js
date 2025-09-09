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
            password: hashedPassword
        })

        if (newUser) {
            generateToken(newUser._id, res)
            await newUser.save();
            return res.status(201).json({ "message": "user created successfully", "user": { _id: newUser._id, fullname: newUser.fullname, email: newUser.email }})
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

        res.status(200).json({
            message: "Logged in successfully",
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
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