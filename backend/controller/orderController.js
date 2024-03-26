//import Order, Product model
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
//import error handlers
import catchAsyncError from "../middleware/catchAsyncError.js";
import Errorhandler from "../utils/errorhandler.js";

//Create new Order
export const newOrder = catchAsyncError( async (req, res, next) => {
    const {shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice} = req.body;
    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemPrice, 
        taxPrice, 
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    });
    res.status(201).json({
        sucess: true,
        order
    });
});

//Get Single Order
export const getSingleOrder = catchAsyncError( async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user","name email");
    if(!order){
        return next(new Errorhandler("Order not Found", 400));
    };
    res.status(200).json({
        sucess: true,
        order
    });
});


//Get logges user order
export const myOrder = catchAsyncError( async (req, res, next) => {
    const orders = await Order.find({user: req.user._id});
    
    res.status(200).json({
        sucess: true,
        orders
    });
});

//Get all orders --Admin
export const allOrders = catchAsyncError( async (req, res, next) => {
    const orders = await Order.find();
    let totalAmount = 0;
    
    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        sucess: true,
        totalAmount,
        orders
    });
});

//update Order Status
export const updateOrderStatus = catchAsyncError( async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new Errorhandler("Order not found", 404));
    }

    if(order.orderStatus === "Delivered"){
        return next(new Errorhandler("Order delivered", 400));
    }
    
    order.orderItems.forEach(async (ord) => {
        await updateStock(ord.product, ord.quantity);
    })

    order.orderStatus = req.body.status;
    await order.save({validateBeforeSave: false})
    if(req.body.status === "Delivered"){
        order.deliveredAt = Data.now();
    }

    res.status(200).json({
        sucess: true
    })

});

async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false});
}

//Delete Order -- Admin
export const deleteOrder = catchAsyncError( async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new Errorhandler("Order already removed", 404));
    }
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
        sucess: true
    });
});