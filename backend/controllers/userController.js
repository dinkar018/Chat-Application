import { User } from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { fullName, userName, password, confirmPassword, gender } = req.body;
    try {
        if (!fullName || !userName || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${userName}`;
        await User.create({
            fullName,
            userName,
            password: hashedPassword,
            profilePhoto: gender === "male" ? maleProfilePhoto : femaleProfilePhoto,
            gender
        });
        return res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
export const login = async (req, res) => {
    try{
        const {userName, password} = req.body;
        if(!userName || !password){
            return res.status(400).json({message: "All fields are required"});
        };
        const user = await User.findOne({userName});
        if(!user){
            return res.status(404).json({message: "User not found"});
        };
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(400).json({message: "Invalid password"});
        };
        const tokenData = {
            userID: user._id
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true,
            sameSite: 'strict',
        }).json({
            _id:user._id,
            userName:user.userName,
            fullName:user.fullName
        });
    }catch(error){
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
export const logout = (req,res) =>{
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
            message:"logged out successfully."
        })
    }catch(error){
        console.log(error);
    }
}
export const getOtherUsers = async (req, res) => {
    try{
        const loggedInUserId = req.id; // Assuming req.id is set by the authentication middleware
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password -__v');
        return res.status(200).json(otherUsers);
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}