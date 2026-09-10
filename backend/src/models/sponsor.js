import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        sponsorName: {
            type: String,
            required: [true, "Sponsor name is required"],
            trim: true,
        },

        organizationName: {
            type: String,
            required: [true, "Organization name is required"],
            trim: true,
        },

        organizationType: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        contactEmail: {
            type: String,
            required: [true, "Contact email is required"],
            lowercase: true,
            trim: true,
        },

        contactPhone: {
            type: String,
            trim: true,
        },

        website: {
            type: String,
            trim: true,
        },

        address: {
            type: String,
            trim: true,
        },

        logo: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const Sponsor = mongoose.model("Sponsor", sponsorSchema);

export default Sponsor;