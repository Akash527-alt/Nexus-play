import express from 'express';
import { createTournament, deleteTournament, getAllTournaments, getTournament, updateTournament } from '../controller/tournamentController.js';
import {authorizeRoles, isAuthenticatedUser} from '../middleware/auth.js';

const router = express.Router();

router.route("/").post(isAuthenticatedUser,authorizeRoles("admin"),createTournament).get(getAllTournaments);
router.route("/:id").get(getTournament).put(isAuthenticatedUser,authorizeRoles("admin"),updateTournament).delete(isAuthenticatedUser,authorizeRoles("admin"),deleteTournament);


export default router;
