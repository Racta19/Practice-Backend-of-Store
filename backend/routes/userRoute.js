import express  from "express";
import { allUsers, deleteUser, forgotPassword, registerUser, resetPassword, singleUser, updatePassword, updateProfile, updateRole, userDetails, userLogin, userLogout } from "../controller/UserController.js";
import {isAuthenticatedUser, authorizedRoles} from "../middleware/auth.js";

const router = express.Router();

//Create or POST new user
router.route("/register").post(registerUser); 
//Login User
router.route("/login").post(userLogin);
//Forget Password
router.route("/password/forgot").post(forgotPassword);
//Reset Password
router.route("/password/reset/:token").put(resetPassword);
//Logout User
router.route("/logout").get(userLogout);

//Get user details --Authenticated
router.route("/me").get(isAuthenticatedUser,userDetails);
//Update user password --Authenticated
router.route("/password/update").put(isAuthenticatedUser, updatePassword);

//Super account users details
router.route("/admin/users").get(isAuthenticatedUser, authorizedRoles("admin"), allUsers);
//Super account user functionality routes
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizedRoles("admin"), singleUser).put(isAuthenticatedUser, authorizedRoles("admin"), updateRole).delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);

export default router;