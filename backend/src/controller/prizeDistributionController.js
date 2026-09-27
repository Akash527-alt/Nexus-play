import mongoose from "mongoose";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Tournament from "../models/Tournament.js";
import Registration from "../models/Registration.js";
import PrizeDistribution from "../models/PrizeDistribution.js";
import Organizer from "../models/organizer.js";

const getOrganizer = async (userId) => {
    return Organizer.findOne({ userId });
};

const verifyTournamentOwnership = async (tournamentId, userId) => {
    const organizer = await getOrganizer(userId);

    if (!organizer) {
        throw new ErrorHandler("Organizer profile not found", 404);
    }

    const tournament = await Tournament.findOne({
        _id: tournamentId,
        organizer: organizer._id,
    });

    if (!tournament) {
        throw new ErrorHandler(
            "Tournament not found or you are not authorized to manage it",
            404
        );
    }

    return tournament;
};

const verifyCompletedTournament = async (tournamentId, userId) => {
    const tournament = await verifyTournamentOwnership(
        tournamentId,
        userId
    );

    if (tournament.status !== "completed") {
        throw new ErrorHandler(
            "Prize distribution is available only for completed tournaments",
            400
        );
    }

    return tournament;
};

export const getPrizeDistribution = catchAsyncErrors(
    async (req, res, next) => {
        const { tournamentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
            return next(new ErrorHandler("Invalid tournament ID", 400));
        }

        const tournament = await verifyCompletedTournament(
            tournamentId,
            req.user._id
        );

        const registrations = await Registration.find({
            tournament: tournament._id,
            status: "registered",
        })
            .populate("user", "name email mobileNumber")
            .populate("players.user", "name email mobileNumber")
            .sort({ createdAt: 1 });

        const distributions = await PrizeDistribution.find({
            tournament: tournament._id,
        })
            .populate("registration")
            .populate("captain", "name email mobileNumber")
            .sort({ position: 1 });

        res.status(200).json({
            success: true,
            tournament,
            prizes: tournament.prizes,
            registrations,
            distributions,
        });
    }
);

export const confirmPrizeWinner = catchAsyncErrors(
    async (req, res, next) => {
        const { tournamentId } = req.params;
        const { registrationId, position } = req.body;

        if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
            return next(new ErrorHandler("Invalid tournament ID", 400));
        }

        if (!mongoose.Types.ObjectId.isValid(registrationId)) {
            return next(new ErrorHandler("Invalid registration ID", 400));
        }

        const numericPosition = Number(position);

        if (!Number.isInteger(numericPosition) || numericPosition < 1) {
            return next(new ErrorHandler("Invalid prize position", 400));
        }

        const tournament = await verifyCompletedTournament(
            tournamentId,
            req.user._id
        );

        const prize = tournament.prizes.find(
            (item) => Number(item.position) === numericPosition
        );

        if (!prize) {
            return next(
                new ErrorHandler(
                    `Prize for position ${numericPosition} is not configured`,
                    400
                )
            );
        }

        const registration = await Registration.findOne({
            _id: registrationId,
            tournament: tournament._id,
            status: "registered",
        }).populate("user", "name email mobileNumber");

        if (!registration) {
            return next(
                new ErrorHandler(
                    "Selected registration does not belong to this tournament",
                    400
                )
            );
        }

        if (!registration.user) {
            return next(
                new ErrorHandler(
                    "The selected registration does not have a NexusPlay captain account",
                    400
                )
            );
        }

        const existingPosition = await PrizeDistribution.findOne({
            tournament: tournament._id,
            position: numericPosition,
        });

        if (existingPosition) {
            return next(
                new ErrorHandler(
                    `Position ${numericPosition} has already been confirmed`,
                    400
                )
            );
        }

        const existingWinner = await PrizeDistribution.findOne({
            tournament: tournament._id,
            registration: registration._id,
        });

        if (existingWinner) {
            return next(
                new ErrorHandler(
                    "This team has already been assigned a prize position",
                    400
                )
            );
        }

        const distribution = await PrizeDistribution.create({
            tournament: tournament._id,
            registration: registration._id,
            position: numericPosition,
            prizeAmount: prize.amount,
            captain: registration.user._id,
            status: "confirmed",
            confirmedAt: new Date(),
        });

        const populatedDistribution =
            await PrizeDistribution.findById(distribution._id)
                .populate("registration")
                .populate("captain", "name email mobileNumber");

        res.status(201).json({
            success: true,
            message: `${numericPosition}${numericPosition === 1 ? "st" : numericPosition === 2 ? "nd" : numericPosition === 3 ? "rd" : "th"} place confirmed successfully`,
            distribution: populatedDistribution,
        });
    }
);

export const removePrizeWinner = catchAsyncErrors(
    async (req, res, next) => {
        const { tournamentId, distributionId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(tournamentId) ||
            !mongoose.Types.ObjectId.isValid(distributionId)
        ) {
            return next(new ErrorHandler("Invalid ID", 400));
        }

        const tournament = await verifyCompletedTournament(
            tournamentId,
            req.user._id
        );

        const distribution = await PrizeDistribution.findOne({
            _id: distributionId,
            tournament: tournament._id,
        });

        if (!distribution) {
            return next(
                new ErrorHandler(
                    "Prize distribution not found",
                    404
                )
            );
        }

        await distribution.deleteOne();

        res.status(200).json({
            success: true,
            message: "Prize winner removed successfully",
        });
    }
);