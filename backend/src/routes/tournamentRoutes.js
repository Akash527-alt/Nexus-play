import express from "express";

import {
    createTournament,
    deleteTournament,
    getAllTournaments,
    getMyTournaments,
    getTournament,
    updateTournament,
} from "../controller/tournamentController.js";

import {
    authorizeRoles,
    isAuthenticatedUser,
} from "../middleware/auth.js";

import { isTournamentOwner } from "../middleware/tournament.js";

import { isOrganizerVerified } from "../middleware/organizer.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.route("/")
    .post(
        isAuthenticatedUser,
        authorizeRoles("organizer"),
        isOrganizerVerified,
        upload.single("tournamentImage"),
        createTournament
    )
    .get(getAllTournaments);

router.route("/me")
    .get(
        isAuthenticatedUser,
        authorizeRoles("organizer"),
        getMyTournaments
    );

router.route("/:id")
    .get(getTournament)
    .put(
        isAuthenticatedUser,
        authorizeRoles("organizer"),
        isTournamentOwner,
        updateTournament
    )
    .delete(
        isAuthenticatedUser,
        authorizeRoles("organizer"),
        isTournamentOwner,
        deleteTournament
    );

export default router;