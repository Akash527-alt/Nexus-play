import express from "express";

import {
    getAllOrganizers,
    getOrganizer,
    verifyOrganizer,
    rejectOrganizer,
    suspendOrganizer,
    getSponsor,
    verifySponsor,
    rejectSponsor,
    suspendSponsor,
} from "../controller/superAdminController.js";

import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middleware/auth.js";
import { getAllSponsors } from "../controller/sponsorController.js";

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


// Sponsor Management
router.get(
    "/sponsors",
    isAuthenticatedUser,
    authorizeRoles("superadmin"),
    getAllSponsors
);
router.get(
    "/sponsors/:id",
    isAuthenticatedUser,
    authorizeRoles("superadmin"),
    getSponsor
);
router.put(
    "/sponsors/:id/verify",
    isAuthenticatedUser,
    authorizeRoles("superadmin"),
    verifySponsor
);
router.put(
    "/sponsors/:id/reject",
    isAuthenticatedUser,
    authorizeRoles("superadmin"),
    rejectSponsor
);
router.put(
    "/sponsors/:id/suspend",
    isAuthenticatedUser,
    authorizeRoles("superadmin"),
    suspendSponsor
);


export default router;