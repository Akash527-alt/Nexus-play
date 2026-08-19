import express from 'express';
import { createTournament, deleteTournament, getAllTournaments, getTournament, updateTournament } from '../controller/tournamentController.js';

const router = express.Router();

router.route("/").post(createTournament).get(getAllTournaments);
router.route("/:id").get(getTournament).put(updateTournament).delete(deleteTournament);


export default router;
