import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Tournament from "../models/Tournament.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import APIFeatures from "../utils/apiFeatures.js";
import Organizer from "../models/organizer.js";
import cloudinary from "../config/cloudinary.js";

export const createTournament = catchAsyncErrors(
    async (req, res, next) => {
        const {
            title,
            game,
            tournamentType,
            description,
            rules,
            tournamentMode,
            venue,
            cityRegion,
            startDate,
            endDate,
            registrationDeadline,
            entryFee,
            prizePool,
            maxParticipants,
            teamSize,
            status,
        } = req.body;

        const tournamentStatus = status || "draft";

        if (!["draft", "published"].includes(tournamentStatus)) {
            return next(
                new ErrorHandler(
                    "Tournament can only be created as draft or published",
                    400
                )
            );
        }

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

        let prizesData = [];

        if (req.body.prizes) {
            try {
                prizesData = JSON.parse(req.body.prizes);
            } catch (error) {
                return next(
                    new ErrorHandler(
                        "Invalid prize data",
                        400
                    )
                );
            }
        }

        let tournamentImage = "";

        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "nexusplay/tournaments",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                stream.end(req.file.buffer);
            });

            tournamentImage = uploadResult.secure_url;
        }

        const tournament = await Tournament.create({
            title,
            game,
            tournamentType,
            description,
            rules,
            tournamentMode,
            venue,
            cityRegion,
            tournamentImage,
            startDate,
            endDate,
            registrationDeadline,
            entryFee,
            prizePool,
            prizes: prizesData,
            maxParticipants,
            currentParticipants: 0,
            teamSize,
            organizer: organizer._id,
            status: tournamentStatus,
        });

        res.status(201).json({
            success: true,
            message: "Tournament created successfully",
            tournament,
        });
    }
);

export const getAllTournaments = catchAsyncErrors(
    async (req, res, next) => {
        const apiFilters = new APIFeatures(
            Tournament.find(),
            req.query
        )
            .search()
            .filter()
            .dateFilter()
            .sort();

        const resPerPage = 4;

        const totalTournaments =
            await apiFilters.query.clone().countDocuments();

        const tournaments = await apiFilters.query.populate(
            "organizer",
            "organizationName organizationType verificationStatus"
        );

        res.status(200).json({
            success: true,
            count: tournaments.length,
            totalTournaments,
            tournaments,
        });
    }
);

export const getTournament = catchAsyncErrors(
    async (req, res, next) => {
        const tournament = await Tournament.findById(
            req.params.id
        );

        if (!tournament) {
            return next(
                new ErrorHandler(
                    "Tournament not available",
                    404
                )
            );
        }

        res.status(200).json({
            success: true,
            tournament,
        });
    }
);

export const updateTournament = catchAsyncErrors(
    async (req, res, next) => {
        const allowedFields = [
            "title",
            "game",
            "tournamentType",
            "description",
            "rules",
            "tournamentMode",
            "venue",
            "cityRegion",
            "startDate",
            "endDate",
            "registrationDeadline",
            "entryFee",
            "prizePool",
            "tournamentImage",
            "prizes",
            "maxParticipants",
            "teamSize",
            "status",
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                req.tournament[field] = req.body[field];
            }
        }

        await req.tournament.save();

        res.status(200).json({
            success: true,
            message: "Tournament updated successfully",
            tournament: req.tournament,
        });
    }
);

export const deleteTournament = catchAsyncErrors(
    async (req, res, next) => {
        await req.tournament.deleteOne();

        res.status(200).json({
            success: true,
            message: "Tournament deleted successfully",
        });
    }
);

export const getMyTournaments = catchAsyncErrors(
    async (req, res, next) => {
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

        const tournaments = await Tournament.find({
            organizer: organizer._id,
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tournaments.length,
            tournaments,
        });
    }
);
