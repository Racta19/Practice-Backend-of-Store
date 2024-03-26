import express from "express";
import { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getAllProductReviews, deleteProductReviews  } from "../controller/productController.js";
import {isAuthenticatedUser, authorizedRoles} from "../middleware/auth.js";

const router = express.Router();

//Get or READ all products
router.route("/products").get(getAllProducts);

//POST or CREATE product
router.route("/product/new").post(isAuthenticatedUser, authorizedRoles("admin"), createProduct);

//GET or READ single product
router.route("/product");

//UPDATE product, DELETE product, GET product
router.route("/product/:id").put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct).delete(isAuthenticatedUser, authorizedRoles("admin"),deleteProduct).get(getProductDetails);

//Create or update review
router.route("/review").put(isAuthenticatedUser, createProductReview );

//Get Reviews
router.route("/reviews").get(getAllProductReviews).delete(isAuthenticatedUser, deleteProductReviews);

export default router;