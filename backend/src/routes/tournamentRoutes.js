import express from 'express';
import { createTournament, getAllTournaments, getTournament } from '../controller/tournamentController.js';

const router = express.Router();

router.route("/").post(createTournament).get(getAllTournaments)

router.route("/:id").get(getTournament);

export default router;
