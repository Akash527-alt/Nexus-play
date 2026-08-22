import express from 'express';
import { changePassword, forgotPassword, getUserProfile, loginUser, logoutUser, registerUser, resetPassword } from '../controller/authController.js';
import {isAuthenticatedUser} from '../middleware/auth.js';

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/me").post(isAuthenticatedUser,getUserProfile)
router.route("/logout").get(logoutUser)
router.route("/password/update").put(isAuthenticatedUser,changePassword);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);


export default router;