import express from "express";

import {
    createPaymentOrder,
    verifyPayment,
} from "../controller/paymentController.js";

import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/create-order",
    isAuthenticatedUser,
    authorizeRoles("user"),
    createPaymentOrder
);

router.post(
    "/verify",
    isAuthenticatedUser,
    authorizeRoles("user"),
    verifyPayment
);

export default router;