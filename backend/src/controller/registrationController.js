import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Registration from "../models/Registration.js";
import Tournament from "../models/tournament.js";
import ErrorHandler from "../utils/ErrorHandler.js";


export const registerParticipant = catchAsyncErrors(async (req, res, next) => {
    const { tournamentId } = req.params;
    const { registrationType, teamName, teamMembers } = req.body;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
        return next(new ErrorHandler("Tournament not found", 404));
    }

    if (tournament.status !== "published") {
        return next(
            new ErrorHandler("Tournament is not open for registration", 400)
        );
    }

    if (new Date(tournament.registrationDeadline) < new Date()) {
        return next(new ErrorHandler("Registration deadline has passed", 400));
    }

    if (tournament.currentParticipants >= tournament.maxParticipants) {
        return next(new ErrorHandler("Tournament is full", 400));
    }

    const existingRegistration = await Registration.findOne({
        user: req.user._id,
        tournament: tournamentId,
        status: "registered",
    });

    if (existingRegistration) {
        return next(
            new ErrorHandler("You are already registered for this tournament", 400)
        );
    }

    if (!registrationType || !["solo", "team"].includes(registrationType)) {
        return next(
            new ErrorHandler("registrationType must be 'solo' or 'team'", 400)
        );
    }

    if (registrationType !== tournament.tournamentType) {
        return next(
            new ErrorHandler(
                `This tournament only accepts ${tournament.tournamentType} registrations`,
                400
            )
        );
    }

    const registrationData = {
        user: req.user._id,
        tournament: tournamentId,
        registrationType,
    };

    if (registrationType === "team") {
        if (!teamName) {
            return next(
                new ErrorHandler("Team name is required for team registration", 400)
            );
        }

        if (!Array.isArray(teamMembers) || teamMembers.length === 0) {
            return next(
                new ErrorHandler("Team members are required for team registration", 400)
            );
        }

        const isUserInTeam = teamMembers.some(
            (memberId) => memberId.toString() === req.user._id.toString()
        );

        if (!isUserInTeam) {
            return next(
                new ErrorHandler(
                    "The registering user must be included in teamMembers",
                    400
                )
            );
        }

        registrationData.teamName = teamName;
        registrationData.teamMembers = teamMembers;
    }

    const registration = await Registration.create(registrationData);


    tournament.currentParticipants += 1;
    await tournament.save();

    res.status(201).json({
        success: true,
        message: "Registered for tournament successfully",
        registration,
    });
});

export const getMyRegistrations = catchAsyncErrors(async (req, res, next) => {
    const registrations = await Registration.find({ user: req.user._id })
        .populate("tournament")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: registrations.length,
        registrations,
    });
});


export const getMyRegistration = catchAsyncErrors(async (req, res, next) => {
    const { tournamentId } = req.params;

    const registration = await Registration.findOne({
        user: req.user._id,
        tournament: tournamentId,
        status: "registered",
    }).populate("tournament");

    if (!registration) {
        return next(
            new ErrorHandler("You are not registered for this tournament", 404)
        );
    }

    res.status(200).json({
        success: true,
        registration,
    });
});


export const cancelRegistration = catchAsyncErrors(async (req, res, next) => {
    const { tournamentId } = req.params;

    const registration = await Registration.findOne({
        user: req.user._id,
        tournament: tournamentId,
        status: "registered",
    });

    if (!registration) {
        return next(
            new ErrorHandler("You are not registered for this tournament", 404)
        );
    }

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
        return next(new ErrorHandler("Tournament not found", 404));
    }

    if (new Date(tournament.registrationDeadline) < new Date()) {
        return next(
            new ErrorHandler("Cannot cancel after the registration deadline", 400)
        );
    }

    registration.status = "cancelled";
    await registration.save();

    await Tournament.findOneAndUpdate(
        { _id: tournamentId, currentParticipants: { $gt: 0 } },
        { $inc: { currentParticipants: -1 } }
    );

    res.status(200).json({
        success: true,
        message: "Registration cancelled successfully",
        registration,
    });
});