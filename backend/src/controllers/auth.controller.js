import User from '../models/user.model.js'
import { generateToken } from '../../lib/utils.js';
import { sendWelcomeEmail } from '../emails/emailHandlers.js';
import ENV from '../../lib/env.js';

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password){
        return res.status(400).json({message: "All fields are required"});
    }

    const isUser = await User.findOne({email});
    if(isUser){
        return res.status(400).json({message: "Email already exist"});
    }

    try {
        const user = new User({email, fullName, password});

        if(user){
            await user.save();
            generateToken(user._id, res);
            
            res.status(201).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                password: user.password
            });
        }
        else{
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

        if(error.message == "Server Error"){
            return res.status(500).json({message: error.message});
        }
        else{
            return res.status(400).json({message: error.message})
        }
    }
}

export const login = (_, res) => {
    res.send("Login");
}

export const logout = (_, res) => {
    res.send("Logout");
}