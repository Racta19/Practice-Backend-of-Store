import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

import Errorhandler from "../utils/errorhandler.js";
import catchAsyncError from "./catchAsyncError.js";

export const isAuthenticatedUser = catchAsyncError(async (req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new Errorhandler("Login to access Resource", 401))
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodedData.id);

    next();
});

export const authorizedRoles = (...roles) => {
    return (req,res,next) => {

        if(!roles.includes(req.user.role)){
            return next(new Errorhandler("Access Denied", 403));
        };

        next();
    };
};
