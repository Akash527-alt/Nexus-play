import express from "express";
import {
    createSponsorProfile,
    getSponsorProfile,
    updateSponsorProfile,
    deleteSponsorProfile,
} from "../controller/sponsorController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router
    .route("/profile")
    .post(isAuthenticatedUser, authorizeRoles("sponsor"), createSponsorProfile)
    .get(isAuthenticatedUser, authorizeRoles("sponsor"), getSponsorProfile)
    .put(isAuthenticatedUser, authorizeRoles("sponsor"), updateSponsorProfile)
    .delete(isAuthenticatedUser, authorizeRoles("sponsor"), deleteSponsorProfile);

export default router;