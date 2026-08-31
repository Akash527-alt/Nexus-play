import mongoose from "mongoose";

const registrationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },

        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tournament",
            required: [true, "Tournament is required"],
        },

        registrationType: {
            type: String,
            enum: ["solo", "team"],
            required: [true, "Registration type is required"],
        },

        teamName: {
            type: String,
            trim: true,
            required: [
                function () {
                    return this.registrationType === "team";
                },
                "Team name is required for team registration",
            ],
        },

        teamMembers: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
            ],
            required: [
                function () {
                    return this.registrationType === "team";
                },
                "Team members are required for team registration",
            ],
            validate: {
                // Rejects the array if any user ID appears more than once
                validator: function (members) {
                    if (!members || members.length === 0) return true;

                    const uniqueMembers = new Set(
                        members.map((memberId) => memberId.toString())
                    );

                    return uniqueMembers.size === members.length;
                },
                message: "teamMembers cannot contain duplicate users",
            },
        },

        status: {
            type: String,
            enum: ["registered", "cancelled"],
            default: "registered",
        },
    },
    {
        timestamps: true,
    }
);
registerParticipant/getMyRegistration/cancelRegistration.
registrationSchema.index({ user: 1, tournament: 1 });

const Registration = mongoose.model("Registration", registrationSchema);

export default Registration;