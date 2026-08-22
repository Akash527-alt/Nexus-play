import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Tournament from "../models/tournament.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import APIFeatures from "../utils/apiFeatures.js";


// create tournament -> /api/v1/tournaments
export const createTournament = catchAsyncErrors( async (req, res, next) => {
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
export const updateTournament =catchAsyncErrors( async (req, res, next) => {
        const tournament = await Tournament.findById(req?.params?.id);

        if (!tournament) {
            return next(new ErrorHandler("tournament not found", 400));
        }

        const updateTournament = await Tournament.findByIdAndUpdate(req?.params?.id, req.body, { new: true, runValidators: true });


        res.status(200).json({
            success: true,
            message: "Tournament updated Successfully",
            updateTournament
        });
});

// Delete tournament -> DELETE /api/v1/tournament/:id
export const deleteTournament = catchAsyncErrors(async (req, res, next) => {
        let tournament = await Tournament.findById(req?.params?.id);

        if (!tournament) {
            return next(new ErrorHandler("tournament not found", 404));
        }

        await tournament.deleteOne();

        res.status(200).json({
            success: true,
            message: "Tournament deleted successfully"
        });
})
