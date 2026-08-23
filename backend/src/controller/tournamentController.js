import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Tournament from "../models/tournament.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import APIFeatures from "../utils/apiFeatures.js";
import Organizer from "../models/organizer.js";


// create tournament -> /api/v1/tournaments
export const createTournament = catchAsyncErrors(async (req, res, next) => {
    const {
        title,
        game,
        tournamentType,
        description,
        rules,
        venue,
        startDate,
        endDate,
        registrationDeadline,
        entryFee,
        prizePool,
        prizes,
        maxParticipants,
        teamSize,
    } = req.body;

    if (tournamentType === "team" && !teamSize) {
        return next(
            new ErrorHandler(
                "Team size is required for team tournaments",
                400
            )
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

    const organizer = await Organizer.findOne({
        userId: req.user._id,
    });

    if (!organizer) {
        return next(
            new ErrorHandler(
                "Organizer profile not found",
                404
            )
        );
    }

    const tournament = await Tournament.create({
        title,
        game,
        tournamentType,
        description,
        rules,
        venue,
        startDate,
        endDate,
        registrationDeadline,
        entryFee,
        prizePool,
        prizes,
        maxParticipants,
        currentParticipants: 0,
        teamSize,
        organizer: organizer._id,
    });

    res.status(201).json({
        success: true,
        message: "Tournament created successfully",
        tournament,
    });
});

// Get all tournaments => /api/v1/tournaments
export const getAllTournaments = catchAsyncErrors(async (req, res, next) => {

        const apiFilters = new APIFeatures(Tournament.find(), req.query).search().filter().dateFilter().sort();
        const resPerPage = 4;

        
        const totalTournaments = await apiFilters.query.clone().countDocuments();
        apiFilters.pagination(resPerPage)
        
        const tournaments = await apiFilters.query;
        const currentPage = Number(req.query.page) || 1;
        const totalPages = Math.ceil(totalTournaments / resPerPage);

        res.status(200).json({
            success: true,
            count: tournaments.length,
            totalTournaments,
            currentPage,
            totalPages,
            tournaments
        });

    
});

// get single tournament => /api/v1/tournaments/:id
export const getTournament = catchAsyncErrors(async (req, res, next) => {
        const tournament = await Tournament.findById(req?.params?.id);

        if (!tournament) {
            return next(new ErrorHandler("Tournament not available", 404));
        }

        res.status(200).json({
            success: true,
            tournament
        });
 
});

// update tournament ->  PUT /api/v1/tournament/:id
export const updateTournament = catchAsyncErrors(async (req, res, next) => {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
        return next(new ErrorHandler("Tournament not found", 404));
    }

    const organizer = await Organizer.findOne({
        userId: req.user._id,
    });

    if (!organizer) {
        return next(new ErrorHandler("Organizer profile not found", 404));
    }

    if (tournament.organizer.toString() !== organizer._id.toString()) {
        return next(
            new ErrorHandler(
                "You are not allowed to update this tournament",
                403
            )
        );
    }

    const allowedFields = [
        "title",
        "game",
        "tournamentType",
        "description",
        "rules",
        "venue",
        "startDate",
        "endDate",
        "registrationDeadline",
        "entryFee",
        "prizePool",
        "prizes",
        "maxParticipants",
        "teamSize",
        "status",
    ];

    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
        req.params.id,
        updates,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({
        success: true,
        message: "Tournament updated successfully",
        tournament: updatedTournament,
    });
});

// Delete tournament -> DELETE /api/v1/tournament/:id
export const deleteTournament = catchAsyncErrors(async (req, res, next) => {
    const tournament = await Tournament.findById(req.params.id);

    if (!tournament) {
        return next(new ErrorHandler("Tournament not found", 404));
    }

    const organizer = await Organizer.findOne({
        userId: req.user._id,
    });

    if (!organizer) {
        return next(new ErrorHandler("Organizer profile not found", 404));
    }

    if (tournament.organizer.toString() !== organizer._id.toString()) {
        return next(
            new ErrorHandler(
                "You are not allowed to delete this tournament",
                403
            )
        );
    }

    await tournament.deleteOne();

    res.status(200).json({
        success: true,
        message: "Tournament deleted successfully",
    });
});
