import express from "express";

import {
    createSponsorshipPaymentOrder,
    verifySponsorshipPayment,
} from "../controller/sponsorshipPaymentController.js";

import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/create-order",
    isAuthenticatedUser,
    authorizeRoles("sponsor"),
    createSponsorshipPaymentOrder
);

router.post(
    "/verify",
    isAuthenticatedUser,
    authorizeRoles("sponsor"),
    verifySponsorshipPayment
);

export default router;