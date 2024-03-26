import Product from "../models/productModel.js";
import ApiFeatures from "../utils/apiFeatures.js";

//Error Handling
import Errorhandler from "../utils/errorhandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";

//Create Product --Admin
export const createProduct = catchAsyncError( async (req,res, next) => {
    req,body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        sucess: true,
        product
    })
});

//Get All Products
export const getAllProducts = catchAsyncError( async (req,res) => {
    const resultPerPage = 8;
    const productCount = await Product.countDocuments()

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);
    let products = await apiFeature.query;
    res.status(200).json({
        sucess: true,
        products,
        productCount
    });
});

//Get Product details
export const getProductDetails = catchAsyncError( async (req,res,next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new Errorhandler("Product not found", 404));
    };


    res.status(200).json({
        sucess: true,
        product
        
    });
});

//Update Product --Admin
export const updateProduct = catchAsyncError( async (req,res,next) => {
    let product = await Product.findById(req.params.id);

    if(!Product){
        return next(new Errorhandler("Product not found", 404));
    };

    product = await Product.findByIdAndUpdate(req.params.id, req.body , {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        sucess: true,
        product
    });
});

//Delete Product --Admin
export const deleteProduct = catchAsyncError( async (req,res,next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new Errorhandler("Product not found", 404));
    };

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        sucess: true,
        message: "Product deleted"
    });

});

//Create Review and update Review
export const createProductReview = catchAsyncError(async (req,res,next) => {
    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    };

    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(rev => rev.user.toString() === req.user._id);
    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user.toString() === req.user._id)
                (rev.rating = rating), (rev.comment = comment);  
        });
    }else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length();
    }
    let avg = 0;
    product.reviews.forEach(rev => {
        avg += rev.rating
    });

    product.ratings = avg / product.reviews.length(); 

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        sucess: true,

    });
});

//Get All product reviewa
export const getAllProductReviews = catchAsyncError(async (req,res,next) => {
    const product = await Product.findById(req.query.id);
    if(!product){
        return next(new Errorhandler("Product not found", 404));
    }
    res.status(200).json({
        sucess: true,
        reviews: product.reviews
    });
});

//Delete product review
export const deleteProductReviews = catchAsyncError(async (req,res,next) => {
    const product = await Product.findById(req.query.productIdd);
    if(!product){
        return next(new Errorhandler("Product not found", 404));
    }
    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString());

    let avg = 0;
    reviews.forEach(rev => {
        avg += rev.rating
    });

    const ratings = avg / reviews.length(); 
    const numberOfReviews = reviews.length();
    await Product.findByIdAndUpdate(req.query.productId ,{reviews, ratings, numberOfReviews}, {new: true, runValidators: true, useFindAndModify: false});
    res.status(200).json({
        sucess: true,
        reviews: product.reviews
    });
});