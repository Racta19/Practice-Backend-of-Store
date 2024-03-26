import express from "express";
import {isAuthenticatedUser, authorizedRoles} from "../middleware/auth.js";
import { allOrders, deleteOrder, getSingleOrder, myOrder, newOrder, updateOrderStatus } from "../controller/orderController.js";

const router = express.Router();

//Create new order
router.route("/order/new").post(isAuthenticatedUser, newOrder); 
//Get order details
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
//Get loggeg user order details
router.route("/order/me").get(isAuthenticatedUser, myOrder);
//Get all order -- Admin routes
router.route("/admin/orders").get(isAuthenticatedUser, authorizedRoles("admin"), allOrders);
//Update or delete single order -- Admin rotues
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizedRoles("admin"), updateOrderStatus).delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);

export default router;