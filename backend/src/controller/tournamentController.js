import Tournament from "../models/Tournament.js";
import ErrorHandler from "../utils/ErrorHandler.js";



// create tournament -> /api/v1/tournaments
export const createTournament = async (req, res, next) => {
    try {
        const {
            title,
            game,
            tournamentType,
            description,
            venue,
            startDate,
            endDate,
            registrationDeadline,
            entryFee,
            maxParticipants,
            teamSize
        } = req.body;


        if (tournamentType === 'team' && !teamSize) {
            return (
                next(new ErrorHandler("Team size is required for team tournaments", 400))
            );
        }

        if (tournamentType === "solo" && teamSize) {
            return next(
                new ErrorHandler(
                    "Team size is not required for solo tournaments",
                    400
                )
            );
        }

        const tournament = await Tournament.create({
            title, game,
            title,
            game,
            tournamentType,
            description,
            venue,
            startDate,
            endDate,
            registrationDeadline,
            entryFee,
            maxParticipants,
            currentParticipants: 0,
            teamSize
        })

        res.status(201).json({
            success: true,
            message: "Tournament created successfully",
            tournament
        });
    } catch (err) {
        next(err);
    }
}

// Get all tournaments => /api/v1/tournaments

export const getAllTournaments = async (req, res, next) => {
    try {
        const tournaments = await Tournament.find();

        res.status(200).json({
            count: tournaments.length,
            tournaments
        });

    }
    catch (err) {
        next(err);
    }
}

// get single tournament => /api/v1/tournaments/:id

export const getTournament = async (req, res, next) => {
    try {
        const tournament = await    Tournament.findById(req?.params?.id);

        if (!tournament) {
            return next(new ErrorHandler("Tournament not available", 404));
        }

        res.status(200).json({
            success: true,
            tournament
        });
    }   catch(err){
        next(err);
    }
}