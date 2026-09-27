import mongoose from "mongoose";

const sponsorshipPaymentSchema = new mongoose.Schema(
    {
        sponsorship: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sponsorship",
            required: [true, "Sponsorship is required"],
        },

        sponsor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sponsor",
            required: [true, "Sponsor is required"],
        },

        sponsorUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Sponsor user is required"],
        },

        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tournament",
            required: [true, "Tournament is required"],
        },

        organizer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organizer",
            required: [true, "Organizer is required"],
        },

        amount: {
            type: Number,
            required: [true, "Payment amount is required"],
            min: [1, "Payment amount must be greater than 0"],
        },

        currency: {
            type: String,
            default: "INR",
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
        },

        razorpaySignature: {
            type: String,
            default: null,
        },

        status: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },

        paidAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const SponsorshipPayment =
    mongoose.models.SponsorshipPayment ||
    mongoose.model("SponsorshipPayment", sponsorshipPaymentSchema);

export default SponsorshipPayment;