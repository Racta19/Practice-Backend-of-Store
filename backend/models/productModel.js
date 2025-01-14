import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true
    },
    description:{
        type: String,
        required: [true, "Please enter description about the product"],
    },
    price: {
        type: Number,
        required: [true, "Please enter price of product"],
        maxLength: [8, "Price cannot exceed 8 characters"]
    },
    ratings:{
        type: Number,
        default: 0
    },
    images:[
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    categories:{
        type: String,
        required: [true, "Please enter category under which the product falls "]
    },
    stock: {
        type: Number,
        required: [true, "Enter Quantity"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1
    },
    numberOfReviews:{
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
});

const Product = mongoose.model("Product",productSchema);
export default Product;
