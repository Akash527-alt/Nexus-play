import express from "express";

import {
    getPrizeDistribution,
    confirmPrizeWinner,
    removePrizeWinner,
} from "../controller/prizeDistributionController.js";

import {
    isAuthenticatedUser,
    authorizeRoles,
} from "../middleware/auth.js";

const router = express.Router();

router.get(
    "/tournaments/:tournamentId",
    isAuthenticatedUser,
    authorizeRoles("organizer"),
    getPrizeDistribution
);

router.post(
    "/tournaments/:tournamentId",
    isAuthenticatedUser,
    authorizeRoles("organizer"),
    confirmPrizeWinner
);

router.delete(
    "/tournaments/:tournamentId/:distributionId",
    isAuthenticatedUser,
    authorizeRoles("organizer"),
    removePrizeWinner
);

export default router;