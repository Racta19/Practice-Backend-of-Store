import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Please enter Name"],
        maxLength: [30, "Cannot exceed 30 characters"],
        minLength: [4, "Should be more than 4 characters"]
    },
    email:{
        type: String,
        required: [true, "Enter email"],
        unique: true,
        validate: [validator.isEmail, "Enter valid Email"]
    },
    password:{
        type: String,
        required: [true, "Enter Password"],
        minLength: [8, "Should be more than 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    };
    this.password = await bcrypt.hash(this.password, 10);
});


//JWT token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

//Compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function(){
    //Generate Token
    const resetToken = crypto.randomBytes(20).toString("hex")
    //Hashing and adding to use schema
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    //Reset token expire
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken
};

const User = mongoose.model("User", userSchema);
export default User;