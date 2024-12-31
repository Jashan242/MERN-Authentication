import express from 'express';
import {register, login, sendVerifyOtp, verifyAccount, resetPassword, resetOtp, isAuthenticated, getUserDetails, logout} from '../controller/user.js';
import userAuth from '../middleware/auth.js';
const userRouter=express.Router();

userRouter.post('/', register);
userRouter.post('/login', login);
userRouter.post('/send-otp', userAuth, sendVerifyOtp);
userRouter.post('/verify-otp', userAuth, verifyAccount);
userRouter.post('/auth', userAuth,isAuthenticated); 
userRouter.post('/reset-otp', resetOtp);
userRouter.post('/reset-password', resetPassword);
userRouter.get('/logout', logout);
userRouter.get('/userData', userAuth, getUserDetails);
export default userRouter;