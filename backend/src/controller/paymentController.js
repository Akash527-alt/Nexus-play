import mongoose from "mongoose";
import Payment from "../models/payment.js";
import Registration from "../models/Registration.js";
import Tournament from "../models/Tournament.js";
import User from "../models/user.js";
import getRazorpayClient from "../config/razorpay.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import crypto from "crypto";

export const createPaymentOrder = catchAsyncErrors(async (req, res, next) => {
    const { tournamentId } = req.body;
    const { registrationType, teamName, players, captainContact, agreements } = req.body;

    if (!mongoose.Types.ObjectId.isValid(tournamentId)) {
        return next(new ErrorHandler("Invalid tournament ID", 400));
    }

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
        return next(new ErrorHandler("Tournament not found", 404));
    }

    if (tournament.status !== "published") {
        return next(new ErrorHandler("Registration is not available for this tournament", 400));
    }

    const now = new Date();

    if (tournament.registrationDeadline && now >= new Date(tournament.registrationDeadline)) {
        return next(new ErrorHandler("Registration deadline has already passed", 400));
    }

    if (tournament.startDate && now >= new Date(tournament.startDate)) {
        return next(new ErrorHandler("Registration is closed because the tournament has started", 400));
    }

    if (!["solo", "team"].includes(registrationType)) {
        return next(new ErrorHandler("Registration type must be either solo or team", 400));
    }

    if (registrationType !== tournament.tournamentType) {
        return next(new ErrorHandler(`This tournament only accepts ${tournament.tournamentType} registrations`, 400));
    }

    if (!teamName || teamName.trim() === "") {
        return next(new ErrorHandler("Clan name is required for registration", 400));
    }

    if (!Array.isArray(players) || players.length === 0) {
        return next(new ErrorHandler("At least one player is required", 400));
    }

    const requiredPlayers = registrationType === "solo" ? 1 : Number(tournament.teamSize);

    if (!requiredPlayers || requiredPlayers < 1) {
        return next(new ErrorHandler("Invalid team size configured for this tournament", 400));
    }

    if (players.length !== requiredPlayers) {
        return next(new ErrorHandler(
            registrationType === "solo"
                ? "Solo registration must contain exactly one player"
                : `Team registration must contain exactly ${requiredPlayers} players, including the captain`,
            400
        ));
    }

    for (let i = 0; i < players.length; i++) {
        const player = players[i];

        if (!player || !player.fullName || !player.gameUid || !player.email || !player.phone) {
            return next(new ErrorHandler(`Player ${i + 1} must have fullName, gameUid, email and phone`, 400));
        }

        player.fullName = player.fullName.trim();
        player.gameUid = player.gameUid.trim();
        player.email = player.email.trim().toLowerCase();
        player.phone = player.phone.trim();
    }

    const playerEmails = players.map((player) => player.email);
    const uniquePlayerEmails = new Set(playerEmails);

    if (uniquePlayerEmails.size !== playerEmails.length) {
        return next(new ErrorHandler("The same email cannot be used for multiple players", 400));
    }

    const nexusUsers = await User.find({ email: { $in: playerEmails }, role: "user" }).select("_id email");
    const usersByEmail = new Map(nexusUsers.map((user) => [user.email.toLowerCase(), user._id]));

    for (const player of players) {
        player.user = usersByEmail.get(player.email) || null;
    }

    const loggedInUserId = req.user._id.toString();
    const captainCount = players.filter((player) => player.user && player.user.toString() === loggedInUserId).length;

    if (captainCount === 0) {
        return next(new ErrorHandler("The logged-in user must be included as the captain", 400));
    }

    if (captainCount !== 1) {
        return next(new ErrorHandler("The logged-in user can only be included once in the team", 400));
    }

    const linkedUserIds = players.filter((player) => player.user).map((player) => player.user.toString());
    const uniqueUserIds = new Set(linkedUserIds);

    if (uniqueUserIds.size !== linkedUserIds.length) {
        return next(new ErrorHandler("The same NexusPlay account cannot be used for multiple players", 400));
    }

    const gameUids = players.map((player) => player.gameUid.toLowerCase());
    const uniqueGameUids = new Set(gameUids);

    if (uniqueGameUids.size !== gameUids.length) {
        return next(new ErrorHandler("Duplicate game UID / IGN is not allowed", 400));
    }

    if (!captainContact || !captainContact.whatsapp || captainContact.whatsapp.trim() === "") {
        return next(new ErrorHandler("WhatsApp contact is required", 400));
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
            return next(new ErrorHandler(`You must accept the ${agreement} agreement`, 400));
        }
    }

    const existingRegistration = await Registration.findOne({
        user: req.user._id,
        tournament: tournamentId,
        status: "registered",
    });

    if (existingRegistration) {
        return next(new ErrorHandler("You are already registered for this tournament", 400));
    }

    if (linkedUserIds.length > 0) {
        const existingPlayerRegistration = await Registration.findOne({
            tournament: tournamentId,
            status: "registered",
            "players.user": { $in: linkedUserIds },
        }).populate("players.user", "name email");

        if (existingPlayerRegistration) {
            const alreadyRegisteredPlayers = existingPlayerRegistration.players
                .filter((player) => player.user && linkedUserIds.includes(player.user._id.toString()))
                .map((player) => player.email);

            return next(new ErrorHandler(`Player with ${alreadyRegisteredPlayers.join(", ")} is already registered for this tournament`, 400));
        }
    }

    if (tournament.currentParticipants >= tournament.maxParticipants) {
        return next(new ErrorHandler("Tournament registration is full", 400));
    }

    if (tournament.entryFee <= 0) {
        return next(new ErrorHandler("This tournament does not require a payment", 400));
    }

    const razorpay = getRazorpayClient();

    const order = await razorpay.orders.create({
        amount: Math.round(tournament.entryFee * 100),
        currency: "INR",
        receipt: `reg_${Date.now()}`,
    });

    const payment = await Payment.create({
        user: req.user._id,
        tournament: tournamentId,
        amount: tournament.entryFee,
        currency: "INR",
        razorpayOrderId: order.id,
        status: "pending",
        registrationData: { registrationType, teamName: teamName.trim(), players, captainContact, agreements },
    });

    return res.status(201).json({
        success: true,
        message: "Payment order created successfully",
        paymentId: payment._id,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
    });
});

export const verifyPayment = catchAsyncErrors(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
        return next(new ErrorHandler("Payment verification data is incomplete", 400));
    }

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (generatedSignature !== razorpay_signature) {
        await Payment.findOneAndUpdate(
            { _id: paymentId, user: req.user._id, razorpayOrderId: razorpay_order_id, status: "pending" },
            { status: "failed" }
        );

        return next(new ErrorHandler("Payment verification failed", 400));
    }

    const session = await mongoose.startSession();

    try {
        let registration;
        let payment;

        await session.withTransaction(async () => {
            payment = await Payment.findOne({
                _id: paymentId,
                user: req.user._id,
                razorpayOrderId: razorpay_order_id,
                status: "pending",
            }).session(session);

            if (!payment) {
                throw new ErrorHandler("Payment transaction not found or already processed", 404);
            }

            const tournament = await Tournament.findById(payment.tournament).session(session);

            if (!tournament) {
                throw new ErrorHandler("Tournament not found", 404);
            }

            if (tournament.status !== "published") {
                throw new ErrorHandler("Tournament is not open for registration", 400);
            }

            if (new Date() > new Date(tournament.registrationDeadline)) {
                throw new ErrorHandler("Registration deadline has passed", 400);
            }

            const registrationData = payment.registrationData;

            const existingRegistration = await Registration.findOne({
                user: payment.user,
                tournament: payment.tournament,
                status: "registered",
            }).session(session);

            if (existingRegistration) {
                throw new ErrorHandler("You are already registered for this tournament", 400);
            }

            const linkedUserIds = registrationData.players.filter((player) => player.user).map((player) => player.user.toString());

            if (linkedUserIds.length > 0) {
                const existingPlayerRegistration = await Registration.findOne({
                    tournament: payment.tournament,
                    status: "registered",
                    "players.user": { $in: linkedUserIds },
                }).session(session);

                if (existingPlayerRegistration) {
                    throw new ErrorHandler("One or more players are already registered for this tournament", 400);
                }
            }

            if (tournament.currentParticipants + registrationData.players.length > tournament.maxParticipants) {
                throw new ErrorHandler("Tournament does not have enough participant capacity", 400);
            }

            const createdRegistrations = await Registration.create([{
                user: payment.user,
                tournament: payment.tournament,
                registrationType: registrationData.registrationType,
                teamName: registrationData.teamName,
                players: registrationData.players,
                captainContact: registrationData.captainContact,
                agreements: registrationData.agreements,
            }], { session });

            registration = createdRegistrations[0];

            tournament.currentParticipants += registrationData.players.length;

            await tournament.save({ session });

            payment.registration = registration._id;
            payment.razorpayPaymentId = razorpay_payment_id;
            payment.razorpaySignature = razorpay_signature;
            payment.status = "paid";
            payment.paidAt = new Date();

            await payment.save({ session });
        });

        res.status(200).json({
            success: true,
            message: "Payment verified and registration completed successfully",
            payment,
            registration,
        });
    } catch (error) {
        return next(error);
    } finally {
        await session.endSession();
    }
});