import express from "express";

import {
    getAllOrganizers,
    getOrganizer,
    verifyOrganizer,
    rejectOrganizer,
    suspendOrganizer,
} from "../controller/superAdminController.js";

import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middleware/auth.js";

const router = express.Router();


// =====================================================
// ORGANIZER MANAGEMENT
// =====================================================

// Get all organizers
router.get(
    "/organizers",
    isAuthenticatedUser,
    authorizeRoles("superadmin"),
    getAllOrganizers
);

// Get single organizer
router.get(
    "/organizers/:id",
    isAuthenticatedUser,
    authorizeRoles("superadmin"),
    getOrganizer
);

// Verify organizer
router.put(
    "/organizers/:id/verify",
    isAuthenticatedUser,
    authorizeRoles("superadmin"),
    verifyOrganizer
);

// Reject organizer
router.put(
    "/organizers/:id/reject",
    isAuthenticatedUser,
    authorizeRoles("superadmin"),
    rejectOrganizer
);

// Suspend organizer
router.put(
    "/organizers/:id/suspend",
    isAuthenticatedUser,
    authorizeRoles("superadmin"),
    suspendOrganizer
);

export default router;