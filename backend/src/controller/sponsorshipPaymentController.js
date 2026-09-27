import mongoose from "mongoose";
import crypto from "crypto";

import Sponsorship from "../models/sponsorship.js";
import SponsorshipPayment from "../models/SponsorshipPayment.js";
import Sponsor from "../models/sponsor.js";
import Tournament from "../models/Tournament.js";
import Organizer from "../models/organizer.js";

import getRazorpayClient from "../config/razorpay.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createSponsorshipPaymentOrder = catchAsyncErrors(
    async (req, res, next) => {
        const { sponsorshipId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(sponsorshipId)) {
            return next(new ErrorHandler("Invalid sponsorship ID", 400));
        }

        const sponsorship = await Sponsorship.findById(sponsorshipId);

        if (!sponsorship) {
            return next(new ErrorHandler("Sponsorship not found", 404));
        }

        if (sponsorship.sponsorUserId.toString() !== req.user._id.toString()) {
            return next(
                new ErrorHandler(
                    "You are not authorized to pay for this sponsorship",
                    403
                )
            );
        }

        if (sponsorship.status !== "approved") {
            return next(
                new ErrorHandler(
                    "Only approved sponsorships can be paid",
                    400
                )
            );
        }

        if (sponsorship.paymentStatus !== "pending") {
            return next(
                new ErrorHandler(
                    "This sponsorship is not awaiting payment",
                    400
                )
            );
        }

        const existingPayment = await SponsorshipPayment.findOne({
            sponsorship: sponsorship._id,
            status: "pending",
        });

        if (existingPayment) {
            return res.status(200).json({
                success: true,
                message: "Pending sponsorship payment already exists",
                paymentId: existingPayment._id,
                orderId: existingPayment.razorpayOrderId,
                amount: existingPayment.amount * 100,
                currency: existingPayment.currency,
                key: process.env.RAZORPAY_KEY_ID,
            });
        }

        const sponsor = await Sponsor.findById(sponsorship.sponsorId);

        if (!sponsor) {
            return next(new ErrorHandler("Sponsor not found", 404));
        }

        const tournament = await Tournament.findById(sponsorship.tournamentId);

        if (!tournament) {
            return next(new ErrorHandler("Tournament not found", 404));
        }

        const organizer = await Organizer.findOne({
            _id: tournament.organizer,
        });

        if (!organizer) {
            return next(new ErrorHandler("Organizer not found", 404));
        }

        const razorpay = getRazorpayClient();

        const order = await razorpay.orders.create({
            amount: Math.round(sponsorship.amount * 100),
            currency: "INR",
            receipt: `sponsor_${Date.now()}`,
        });

        const payment = await SponsorshipPayment.create({
            sponsorship: sponsorship._id,
            sponsor: sponsor._id,
            sponsorUser: sponsorship.sponsorUserId,
            tournament: tournament._id,
            organizer: organizer._id,
            amount: sponsorship.amount,
            currency: "INR",
            razorpayOrderId: order.id,
            status: "pending",
        });

        return res.status(201).json({
            success: true,
            message: "Sponsorship payment order created successfully",
            paymentId: payment._id,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID,
        });
    }
);

export const verifySponsorshipPayment = catchAsyncErrors(
    async (req, res, next) => {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            paymentId,
        } = req.body;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !paymentId
        ) {
            return next(
                new ErrorHandler(
                    "Payment verification data is incomplete",
                    400
                )
            );
        }

        if (!mongoose.Types.ObjectId.isValid(paymentId)) {
            return next(new ErrorHandler("Invalid payment ID", 400));
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            await SponsorshipPayment.findOneAndUpdate(
                {
                    _id: paymentId,
                    sponsorUser: req.user._id,
                    razorpayOrderId: razorpay_order_id,
                    status: "pending",
                },
                {
                    status: "failed",
                }
            );

            return next(
                new ErrorHandler("Payment verification failed", 400)
            );
        }

        const session = await mongoose.startSession();

        try {
            let payment;
            let sponsorship;

            await session.withTransaction(async () => {
                payment = await SponsorshipPayment.findOne({
                    _id: paymentId,
                    sponsorUser: req.user._id,
                    razorpayOrderId: razorpay_order_id,
                    status: "pending",
                }).session(session);

                if (!payment) {
                    throw new ErrorHandler(
                        "Payment transaction not found or already processed",
                        404
                    );
                }

                sponsorship = await Sponsorship.findById(
                    payment.sponsorship
                ).session(session);

                if (!sponsorship) {
                    throw new ErrorHandler(
                        "Sponsorship not found",
                        404
                    );
                }

                if (sponsorship.status !== "approved") {
                    throw new ErrorHandler(
                        "This sponsorship is no longer approved for payment",
                        400
                    );
                }

                if (sponsorship.paymentStatus !== "pending") {
                    throw new ErrorHandler(
                        "This sponsorship is no longer awaiting payment",
                        400
                    );
                }

                payment.razorpayPaymentId = razorpay_payment_id;
                payment.razorpaySignature = razorpay_signature;
                payment.status = "paid";
                payment.paidAt = new Date();

                await payment.save({ session });

                sponsorship.paymentStatus = "paid";
                sponsorship.status = "active";
                sponsorship.paidAt = new Date();

                await sponsorship.save({ session });

                await Sponsor.findByIdAndUpdate(
                    sponsorship.sponsorId,
                    {
                        $inc: {
                            totalInvested: sponsorship.amount,
                        },
                    },
                    { session }
                );
            });

            return res.status(200).json({
                success: true,
                message: "Sponsorship payment verified successfully",
                payment,
                sponsorship,
            });
        } catch (error) {
            return next(error);
        } finally {
            await session.endSession();
        }
    }
);