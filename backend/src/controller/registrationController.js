import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import Tournament from "../models/Tournament.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import User from "../models/user.js";

export const registerParticipant = catchAsyncErrors(async (req, res, next) => {
    const { tournamentId } = req.params;
    const {
        registrationType,
        teamName,
        players,
        captainContact,
        agreements,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
        return next(new ErrorHandler("Invalid tournament ID", 400));
    }

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
        return next(new ErrorHandler("Tournament not found", 404));
    }

    if (tournament.status !== "published") {
        return next(
            new ErrorHandler(
                "Registration is not available for this tournament",
                400
            )
        );
    }

    const now = new Date();

    if (
        tournament.registrationDeadline &&
        now >= new Date(tournament.registrationDeadline)
    ) {
        return next(
            new ErrorHandler(
                "Registration deadline has already passed",
                400
            )
        );
    }

    if (
        tournament.startDate &&
        now >= new Date(tournament.startDate)
    ) {
        return next(
            new ErrorHandler(
                "Registration is closed because the tournament has started",
                400
            )
        );
    }

    if (!["solo", "team"].includes(registrationType)) {
        return next(
            new ErrorHandler(
                "Registration type must be either solo or team",
                400
            )
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

    if (!teamName || teamName.trim() === "") {
        return next(
            new ErrorHandler(
                "Clan name is required for registration",
                400
            )
        );
    }

    if (!Array.isArray(players) || players.length === 0) {
        return next(
            new ErrorHandler(
                "At least one player is required",
                400
            )
        );
    }

    const requiredPlayers =
        registrationType === "solo"
            ? 1
            : Number(tournament.teamSize);

    if (!requiredPlayers || requiredPlayers < 1) {
        return next(
            new ErrorHandler(
                "Invalid team size configured for this tournament",
                400
            )
        );
    }

    if (players.length !== requiredPlayers) {
        return next(
            new ErrorHandler(
                registrationType === "solo"
                    ? "Solo registration must contain exactly one player"
                    : `Team registration must contain exactly ${requiredPlayers} players, including the captain`,
                400
            )
        );
    }

    for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (
            !player ||
            !player.fullName ||
            !player.gameUid ||
            !player.email ||
            !player.phone
        ) {
            return next(
                new ErrorHandler(
                    `Player ${i + 1} must have fullName, gameUid, email and phone`,
                    400
                )
            );
        }

        player.fullName = player.fullName.trim();
        player.gameUid = player.gameUid.trim();
        player.email = player.email.trim().toLowerCase();
        player.phone = player.phone.trim();
    }

    const playerEmails = players.map((player) => player.email);

    const uniquePlayerEmails = new Set(playerEmails);

    if (uniquePlayerEmails.size !== playerEmails.length) {
        return next(
            new ErrorHandler(
                "The same email cannot be used for multiple players",
                400
            )
        );
    }

    const nexusUsers = await User.find({
        email: { $in: playerEmails },
        role: "user",
    }).select("_id email");

    const usersByEmail = new Map(
        nexusUsers.map((user) => [
            user.email.toLowerCase(),
            user._id,
        ])
    );

    for (const player of players) {
        player.user =
            usersByEmail.get(player.email) || null;
    }

    const loggedInUserId = req.user._id.toString();

    const captainIncluded = players.some(
        (player) =>
            player.user &&
            player.user.toString() === loggedInUserId
    );

    if (!captainIncluded) {
        return next(
            new ErrorHandler(
                "The logged-in user must be included as the captain",
                400
            )
        );
    }

    const captainCount = players.filter(
        (player) =>
            player.user &&
            player.user.toString() === loggedInUserId
    ).length;

    if (captainCount !== 1) {
        return next(
            new ErrorHandler(
                "The logged-in user can only be included once in the team",
                400
            )
        );
    }

    const linkedUserIds = players
        .filter((player) => player.user)
        .map((player) => player.user.toString());

    const uniqueUserIds = new Set(linkedUserIds);

    if (uniqueUserIds.size !== linkedUserIds.length) {
        return next(
            new ErrorHandler(
                "The same NexusPlay account cannot be used for multiple players",
                400
            )
        );
    }

    const gameUids = players.map((player) =>
        player.gameUid.trim().toLowerCase()
    );

    const uniqueGameUids = new Set(gameUids);

    if (uniqueGameUids.size !== gameUids.length) {
        return next(
            new ErrorHandler(
                "Duplicate game UID / IGN is not allowed",
                400
            )
        );
    }

    if (
        !captainContact ||
        !captainContact.whatsapp ||
        captainContact.whatsapp.trim() === ""
    ) {
        return next(
            new ErrorHandler(
                "WhatsApp contact is required",
                400
            )
        );
    }

    const requiredAgreements = [
        "antiCheat",
        "rulebook",
        "identityVerification",
        "mediaConsent",
        "professionalConduct",
        "guardianConsent",
        "captainResponsibility",
    ];

    for (const agreement of requiredAgreements) {
        if (!agreements || agreements[agreement] !== true) {
            return next(
                new ErrorHandler(
                    `You must accept the ${agreement} agreement`,
                    400
                )
            );
        }
    }

    const existingRegistration = await Registration.findOne({
        user: req.user._id,
        tournament: tournamentId,
        status: "registered",
    });

    if (existingRegistration) {
        return next(
            new ErrorHandler(
                "You are already registered for this tournament",
                400
            )
        );
    }

    if (linkedUserIds.length > 0) {
        const existingPlayerRegistration = await Registration.findOne({
            tournament: tournamentId,
            status: "registered",
            "players.user": {
                $in: linkedUserIds,
            },
        }).populate("players.user", "name email");

        if (existingPlayerRegistration) {
            const alreadyRegisteredPlayers =
                existingPlayerRegistration.players
                    .filter(
                        (player) =>
                            player.user &&
                            linkedUserIds.includes(
                                player.user._id.toString()
                            )
                    )
                    .map((player) => player.email);

            return next(
                new ErrorHandler(
                    `player with  ${alreadyRegisteredPlayers.join(", ")} is already registered for this tournament`,
                    400
                )
            );
        }
    }

    if (
        tournament.currentParticipants >=
        tournament.maxParticipants
    ) {
        return next(
            new ErrorHandler(
                "Tournament registration is full",
                400
            )
        );
    }

    const registration = await Registration.create({
        user: req.user._id,
        tournament: tournamentId,
        registrationType,
        teamName: teamName.trim(),
        players,
        captainContact,
        agreements,
    });

    tournament.currentParticipants += 1;

    await tournament.save();

    res.status(201).json({
        success: true,
        message: "Registration completed successfully",
        registration,
    });
});

export const getMyRegistrations = catchAsyncErrors(async (req, res, next) => {
    const registrations = await Registration.find({
        $or: [
            { user: req.user._id },
            { "players.user": req.user._id },
        ],
    })
        .populate("user", "name email mobileNumber")
        .populate("players.user", "name email mobileNumber")
        .populate("tournament",
            "title game tournamentType teamSize startDate endDate registrationDeadline venue status tournamentImage entryFee prizePool prizes maxParticipants currentParticipants"
        )
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: registrations.length,
        registrations,
    });
});

export const getMyRegistration = catchAsyncErrors(async (req, res, next) => {
    const { tournamentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
        return next(new ErrorHandler("Invalid tournament ID", 400));
    }

    const registration = await Registration.findOne({
        tournament: tournamentId,
        status: "registered",
        $or: [
            { user: req.user._id },
            { "players.user": req.user._id },
        ],
    })
        .populate(
            "user",
            "name email mobileNumber"
        )
        .populate(
            "players.user",
            "name email mobileNumber"
        )
        .populate(
            "tournament",
            "title game tournamentType teamSize startDate endDate registrationDeadline venue status tournamentImage entryFee prizePool prizes maxParticipants currentParticipants"
        );

    if (!registration) {
        return next(
            new ErrorHandler(
                "You are not registered for this tournament",
                404
            )
        );
    }

    res.status(200).json({
        success: true,
        registration,
    });
});

export const cancelRegistration = catchAsyncErrors(async (req, res, next) => {
    const { tournamentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
        return next(new ErrorHandler("Invalid tournament ID", 400));
    }

    const registration = await Registration.findOne({
        user: req.user._id,
        tournament: tournamentId,
        status: "registered",
    });

    if (!registration) {
        return next(new ErrorHandler("Active registration not found", 404));
    }

    registration.status = "cancelled";

    await registration.save();

    await Tournament.findByIdAndUpdate(tournamentId, { $inc: { currentParticipants: -1 } });

    res.status(200).json({
        success: true,
        message: "Registration cancelled successfully",
    });
});

export const getTournamentRegistrations = catchAsyncErrors(async (req, res, next) => {
    const { tournamentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
        return next(new ErrorHandler("Invalid tournament ID", 400));
    }

    const registrations = await Registration.find({
        tournament: tournamentId,
        status: { $ne: "cancelled" },
    })
        .populate("user", "name email")
        .populate("players.user", "name email")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        count: registrations.length,
        registrations,
    });
});