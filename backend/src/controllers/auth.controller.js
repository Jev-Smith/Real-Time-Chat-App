import User from '../models/user.model.js'
import { generateToken } from '../lib/utils.js';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import ENV from '../lib/env.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ message: "Email already exist" });
    }

    try {
        const user = new User({ email, fullName, password });

        if (user) {
            await user.save();
            generateToken(user._id, res);

            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                password: user.password
            });
        }
        else {
            console.error("User not created");
            res.status(400).json("User not created");
        }

        try {
            await sendWelcomeEmail(user.fullName, user.email, ENV.CLIENT_URL);
        } catch (error) {
            console.error("Failed to send welcome email", error);
        }

    } catch (error) {
        console.error("Erorr in signup controller", error);

        if (error.message == "Server Error") {
            return res.status(500).json({ message: error.message });
        }
        else {
            return res.status(400).json({ message: error.message })
        }
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials user" });
        }

        const isMatch = await user.comparePasswords(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.error("Error in login controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (_, res) => {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

        const userId = req.user._id;

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        ).select("-password");

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const check = async (req, res) => res.status(200).json(req.user);