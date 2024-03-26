import crypto from "crypto";
//user Schema
import User from "../models/userModel.js";
//Error handling
import Errorhandler from "../utils/errorhandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
//Send Token
import sendToken from "../utils/jwtToken.js";
//Send email
import sendEmail from "../utils/sendEmail.js";

//create new User 
export const registerUser = catchAsyncError(async (req,res,next) => {
    const {name, email, password} = req.body;
    
    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: "sample id",
            url:"sampleURL"
        }
    });

    sendToken(user, 201, res);
}); 
/* User Authentication starts here */
// Login User
export const userLogin = catchAsyncError( async (req,res,next) => {
    const {email, password } = req.body;
    //Check if credentials mathced
    if(!email || !password){
        return next(new Errorhandler("Enter correct email and password", 400));
    };

    const user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new Errorhandler("Enter correct email or password", 401));
    };

    const isPassswordMatched = await user.comparePassword(password);
    if(!isPassswordMatched){
        return next(new Errorhandler("Enter correct email or password", 401));
    };

    sendToken(user, 200, res);
});

//Logout User
export const userLogout = catchAsyncError( async (req,res,next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        sucess: true,
        message: "Logout sucessfull"
    });
});

//Forgot Password
export const forgotPassword = catchAsyncError( async (req,res,next) =>{
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new Errorhandler("User not found",404));
    }
    //Get reset password Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
    const message = `Click here to change your password \n\n${resetPasswordUrl}\n\nIf you have not requested this email then, please ignore it`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Ecommerce Password Change",
            message,
        });

        res.status(200).json({
            sucess: true,
            message: `Email send to ${user.email} sucessfully`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});
        return next(new Errorhandler(error.stack, 500));
    }
});

//Reset Password
export const resetPassword = catchAsyncError( async (req,res,next) => {
    //creating hash token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    //searching database
    const user = User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user){
        return next(new Errorhandler("Request no longer valid", 400));
    };

    if(req.body.password !== req.body.confirmPassword){
        return next(new Errorhandler("Passwords do not match", 400));
    };

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200, res);
});

/* User Authentication Ended */
/* User Route Api Started */

//Get User Details 
export const userDetails = catchAsyncError( async (req,res,next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        sucess: true,
        user
    });
});

//Update User Password 
export const updatePassword = catchAsyncError( async (req,res,next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPassswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPassswordMatched){
        return next(new Errorhandler("Incorrect password", 400));
    };
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new Errorhandler("Password mismatch", 400));
    }
    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});

//Update User Profile 
export const updateProfile = catchAsyncError( async (req,res,next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    };
    //add cloudinary later 
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true, 
        useFindAndModify: false
    });
    res.status(200).json({
        sucess: true
    });
});

//Get All Users - Super account
export const allUsers = catchAsyncError( async (req,res,next) => {
    const users = await User.find();
    res.status(200).json({
        sucess: true,
        users
    });
});
 
//Get user details - super account
export const singleUser = catchAsyncError( async (req,res,next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new Errorhandler("User not found", 401));
    };
    res.status(200).json({
        sucess: true,
        user
    });
});

//Update user profile - super account
export const updateRole = catchAsyncError( async (req,res,next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true, 
        useFindAndModify: false
    });
    res.status(200).json({
        sucess: true
    });
});

//Delete user - super account
export const deleteUser = catchAsyncError( async (req,res,next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    //remove cloudinary later 
    if(!user){
        return next(new Errorhandler("User not found", 401));
    };
    res.status(200).json({
        sucess: true,
        message: "User deleted"
    });
});