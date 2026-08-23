import express from "express";

import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import { createOrganizerProfile } from "../controller/organizerController.js";

const router = express.Router();

router.post(
    "/profile",
    authorizeRoles,
    isAuthenticatedUser,
    createOrganizerProfile
);

export default router;