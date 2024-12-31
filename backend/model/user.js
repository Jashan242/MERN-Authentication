import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
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
        minLength:[8, "Password must be at least 8 characters."],
        // maxLength:[32, "Password must not exceed 32 characters."]
    },
    // phone:String,
    verifyOtp:{
        type: String,
        default: ''
    },
    verifyOtpExpiredAt:{
        type: Number,
        default: 0
    },
    isAccountVerified:{
        type: Boolean,
        default: false
    },

    resetOtp:{
        type: String,
        default: ''
    },
    resetOtpExpiredAt:{
        type: Number,
        default: 0
    },
    // accountVerified:{type:Boolean, default:false},
    // verificationCode:Number,
    // verificationCodeExpire:Date,
    // resetPasswordString:String,
    // resetPasswordExpire:Date,
    createdAt:{
        type: Date,
        default: Date.now,
    }
});


userSchema.pre("save", async function(next){
    if(!this.isModified()) next();
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword=async function(pwd){
    return await bcrypt.compare(pwd, this.password);
}

userSchema.methods.generateVerificationCode=async function(){
    const generateFiveDigitNumber=()=>{
        const firstDigit=Math.floor(Math.random()*9)+1;
        const remainingDigit=Math.floor(Math.random()*1000).toString().padStart(4,0);
        return parseInt(firstDigit+remainingDigit);
    }

    const verificationCode=generateFiveDigitNumber();
    this.verificationCode=verificationCode;
    this.verificationCodeExpire=Date.now() + 5*60*1000; 

    return verificationCode;
}

export const User=mongoose.model("User", userSchema);