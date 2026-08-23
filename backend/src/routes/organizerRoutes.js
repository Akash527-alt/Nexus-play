import express from "express";

import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import { createOrganizerProfile } from "../controller/organizerController.js";

const router = express.Router();

router.post(
    "/profile",
    isAuthenticatedUser,
    authorizeRoles("organizer"),
    createOrganizerProfile
);

export default router;