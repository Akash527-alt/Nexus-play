import express from "express";

import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";
import { createOrganizerProfile, getOrganizerDashboard } from "../controller/organizerController.js";
import { getMyTournaments } from "../controller/tournamentController.js";

const router = express.Router();

router.post(
    "/profile",
    isAuthenticatedUser,
    authorizeRoles("organizer"),
    createOrganizerProfile
);

// Organizer dashboard
router.get(
    "/dashboard",
    isAuthenticatedUser,
    authorizeRoles("organizer"),
    getOrganizerDashboard
);





export default router;