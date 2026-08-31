import express from "express";
import {
    registerParticipant,
    getMyRegistrations,
    getMyRegistration,
    cancelRegistration,
} from "../controller/registrationController.js";
import { authorizeRoles, isAuthenticatedUser } from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/tournaments/:tournamentId/register",
    isAuthenticatedUser,
    authorizeRoles("user"),
    registerParticipant
);

router.get(
    "/registrations/me",
    isAuthenticatedUser,
    authorizeRoles("user"),
    getMyRegistrations
);

router.get(
    "/tournaments/:tournamentId/registration",
    isAuthenticatedUser,
    authorizeRoles("user"),
    getMyRegistration
);

router.delete(
    "/tournaments/:tournamentId/registration",
    isAuthenticatedUser,
    authorizeRoles("user"),
    cancelRegistration
);

export default router;