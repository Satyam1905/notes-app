import type { Request, Response } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import type { IUser } from '../models/User.js';

dotenv.config();

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const requestSignupOtp = async (req: Request, res: Response) => {
    const { name, email, dateOfBirth } = req.body;
    
    if(!name || !email || !dateOfBirth) {
        return res.status(400).json({ message: 'Please provide all details' });
    }

    const UserExists = await User.findOne({ email });
    if(UserExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user = await User.findOneAndUpdate(
        { email },
        { name, email, dateOfBirth, otp, otpExpires },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Notes App Signup',
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        });
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

export const verifySignupOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    if(!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
        return res.status(400).json({ message: 'OTP expired or not set' });
    }

    const isMatch = await user.compareOtp(otp);

    if(!isMatch) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
    });
};

export const requestSigninOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Login OTP for Note App',
            text: `Your One-Time Password (OTP) is: ${otp}`,
        });
        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
};

export const verifySigninOtp = async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if(!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    if(!user.otp || !user.otpExpires || user.otpExpires < new Date()) {
        return res.status(400).json({ message: 'OTP expired or invalid' });
    }

    const isMatch = await user.compareOtp(otp);

    if(!isMatch) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()),
    });
};

export const getUserProfile = async (req: Request, res: Response) => {
    const user = await User.findById(req.user._id).select('-otp -otpExpires');
    if(user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};