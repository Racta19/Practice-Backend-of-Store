import Errorhandler from "../utils/errorhandler.js";

export default (err,req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Mongo DB id error handling
    if(err.name === 'CastError'){
        const message = `Resource not found, Invalid: ${err.path}`;
        err = new Errorhandler(message, 404);
    };

    //Mongoose duplicate Key error (Same email used for creating a new account)
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new Errorhandler(message, 400);
    };

    //Wrong JSON web token error
    if(err.name === 'JsonWebTokenError'){
        const message = `Token is invalid, try again`;
        err = new Errorhandler(message, 400);
    };

    //Expired JSON web token error
    if(err.name === 'TokenExpireError'){
        const message = `Token has expired, try again`;
        err = new Errorhandler(message, 400);
    };

    res.status(err.statusCode).json({
        sucess: false,
        message: err.message
    });
};