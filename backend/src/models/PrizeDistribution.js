import mongoose from "mongoose";

const prizeDistributionSchema = new mongoose.Schema(
    {
        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tournament",
            required: [true, "Tournament is required"],
        },

        registration: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Registration",
            required: [true, "Registration is required"],
        },

        position: {
            type: Number,
            required: [true, "Prize position is required"],
            min: [1, "Prize position must be at least 1"],
        },

        prizeAmount: {
            type: Number,
            required: [true, "Prize amount is required"],
            min: [0, "Prize amount cannot be negative"],
        },

        captain: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Captain is required"],
        },

        status: {
            type: String,
            enum: ["confirmed"],
            default: "confirmed",
        },

        confirmedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

prizeDistributionSchema.index(
    {
        tournament: 1,
        position: 1,
    },
    {
        unique: true,
    }
);

prizeDistributionSchema.index(
    {
        tournament: 1,
        registration: 1,
    },
    {
        unique: true,
    }
);

const PrizeDistribution =
    mongoose.models.PrizeDistribution ||
    mongoose.model("PrizeDistribution", prizeDistributionSchema);

export default PrizeDistribution;