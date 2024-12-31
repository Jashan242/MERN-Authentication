import {User} from "../model/user.js";
import jwt from "jsonwebtoken";
import {transporter} from '../utils/sendEmail.js';
import bcrypt from "bcrypt";

export const register = async (req, res, next) => {
    try {
        const { name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success:false, message: "Please fill in all fields" });
        }

        const existingUser = await User.findOne({ email: email});

        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const user = new User({ name, email, password });
        await user.save();
        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
        res.cookie('token', token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
        });

        const options = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: "Welcome",
            html:`Welcome!!! Your account has been created with email id: ${email}.`,
        };

        await transporter.sendMail(options);

        return res.json({success: true, message:"user registered successfully"});
    }
    catch(err) {
        console.log("error: " + err);
        res.json({ error: err.message}); 
    }
}


export const login=async(req,res)=>{
    const {email, password}=req.body;

    if(!email || !password){
        return res.json({success:false, message:"Email and password are required"});
    }

    try{
        const user=await User.findOne({email:email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: "Invalid email or password" });
        }

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
        res.cookie('token', token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
        });

        return res.json({success:true, message:"User logged in"})

    }
    catch(err){
        res.json({error:err.message});
    }
}

export const sendVerifyOtp= async(req, res) => {
    try{
        const {userId}=req.body;
        const user=await User.findById(userId);
        if(user.isAccountVerified){
            return res.json({success:false, message:"User is already verified."});
        }
        const otp=String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp=otp;
        user.verifyOtpExpiredAt=Date.now() + 24 * 60 * 60 * 1000;
        await user.save();

        const options = {
            from: process.env.SMTP_MAIL,
            to: user.email,
            subject: "Account Verification",
            html:`Your OTP for account verification is : ${otp}. Verify your account.`,
        };

        await transporter.sendMail(options);

        res.json({success:true, message:"Verification otp sent successfully"});
    }
    catch(err){
        res.json({error:err.message});
    }
}

export const isAuthenticated = (req, res) => {
    try{
        return res.json({success:true, message:"Authenticated"});
    }
    catch(err){
        return res.json({success:false, message:err.message});
    }
}

export const verifyAccount=async(req, res) => {
    try{
        const {userId, otp}=req.body;
        
        if(!userId || !otp){
            res.json({success:false, message:"Missing details"});
        }

        const user=await User.findById(userId);
        if(!user){
            res.json({success:false, message:"User not found"});
        }

        if(user.verifyOtp==='' || user.verifyOtp!==otp){
            return res.json({success:false, message:"Invalid OTP"});
        }

        if(user.verifyOtpExpiredAt < Date.now()){
            return res.json({success:false, message:"OTP expired"});
        }

        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpiredAt=0;
        await user.save();
        const options = {
            from: process.env.SMTP_MAIL,
            to: user.email,
            subject: "Account Verification",
            html:`Your account has been verified`,
        };

        await transporter.sendMail(options);

        return res.json({success:true, message:"Verification otp sent successfully"});
        // return res.json({success:true, message:"Email verified successfully"});

    }
    catch(err){
        res.json({error:err.message});
    }
}

//Reset Password
export const resetOtp=async(req, res) => {
    const {email}=req.body;
    if(!email){
        return res.json({success:false, message:"Email is required"});
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        const otp=String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp=otp;
        user.resetOtpExpiredAt=Date.now() + 15 * 60 * 1000;
        await user.save();

        const options = {
            from: process.env.SMTP_MAIL,
            to: user.email,
            subject: "Password Reset Otp",
            html:`Your OTP for resetting the password is : ${otp}. Use this otp to reset your password.`,
        };

        await transporter.sendMail(options);

        res.json({success:true, message:"Password reset otp sent successfully"});

    }
    catch(err){
        return res.json({success:false, message:err.message})
    }
}

export const resetPassword=async(req, res) => {
    const {email, otp, newPass}=req.body;

    if(!email || !otp || !newPass){
        return res.json({success:false, message:"All fields are required"});
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        if(user.resetOtp==="" || user.resetOtp!==otp){
            return res.json({success:false, message:"Invalid OTP"});
        }
        if(user.resetOtpExpiredAt < Date.now()){
            return res.json({success:false, message:"OTP expired"});
        }

        user.password=newPass;
        user.resetOtp='';
        user.resetOtpExpiredAt=0;
        await user.save();
        return res.json({success:true, message:"Password has been reset successfully"});
    }
    catch(err){
        return res.json({success:false, message:err.message})
    }
}

export const getUserDetails=async(req,res)=>{
    const {userId}=req.body;

    const user=await User.findById(userId);
    if(!user){
        return res.json({success:false, message:"User not found"});
    }
    else{
        return res.json({success:true,
             data:{
                name:user.name,
                email:user.email,
                isAccountVerified:user.isAccountVerified
            }});
    }
}

export const logout=async(req,res)=>{
    try{
        res.clearCookie('token',{
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: false,
        })
        return res.json({success:true, message:"User logged out successfully"});
    }
    catch(err){
        return res.json({success:false, message:err.message});
    }
}