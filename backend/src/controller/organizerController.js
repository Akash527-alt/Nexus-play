import Organizer from "../models/organizer.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Tournament from "../models/tournament.js";

export const createOrganizerProfile = catchAsyncErrors(
    async (req, res, next) => {

        console.log("1. createOrganizerProfile reached");
        console.log("2. req.user:", req.user?._id, req.user?.role);
        console.log("3. req.body:", req.body);

        const {
            organizationName,
            organizationType,
            description,
            address,
            contactEmail,
            contactPhone,
        } = req.body;

        console.log("4. Body destructured");

        if (
            !organizationName ||
            !organizationType ||
            !address ||
            !contactEmail ||
            !contactPhone
        ) {
            return next(
                new ErrorHandler(
                    "Please provide all required organization details",
                    400
                )
            );
        }

        console.log("5. Required fields passed");

        if (req.user.role !== "organizer") {
            return next(
                new ErrorHandler(
                    "Only organizers can create an organizer profile",
                    403
                )
            );
        }

        console.log("6. Organizer role confirmed");

        const existingOrganizer = await Organizer.findOne({
            userId: req.user._id,
        });

        console.log("7. Organizer findOne completed");
        console.log("Existing organizer:", existingOrganizer);

        if (existingOrganizer) {
            return next(
                new ErrorHandler(
                    "Organizer profile already exists",
                    400
                )
            );
        }

        console.log("8. Creating organizer");

        const organizer = await Organizer.create({
            organizerId: `ORG-${Date.now()}`,
            userId: req.user._id,
            organizationName,
            organizationType,
            description,
            address,
            contactEmail,
            contactPhone,
        });

        console.log("9. Organizer created:", organizer._id);

        res.status(201).json({
            success: true,
            message: "Organizer profile created successfully",
            organizer,
        });
    }
);

// Get organizer dashboard data
// GET /api/v1/tournaments/dashboard
export const getOrganizerDashboard = catchAsyncErrors(
    async (req, res, next) => {
        // Find organizer profile using logged-in user
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

        const organizerId = organizer._id;

        // Fetch dashboard statistics and recent tournaments
        const [
            totalTournaments,
            draftTournaments,
            publishedTournaments,
            ongoingTournaments,
            completedTournaments,
            cancelledTournaments,
            totalParticipants,
            recentTournaments,
        ] = await Promise.all([
            // Total tournaments
            Tournament.countDocuments({
                organizer: organizerId,
            }),

            // Draft tournaments
            Tournament.countDocuments({
                organizer: organizerId,
                status: "draft",
            }),

            // Published tournaments
            Tournament.countDocuments({
                organizer: organizerId,
                status: "published",
            }),

            // Ongoing tournaments
            Tournament.countDocuments({
                organizer: organizerId,
                status: "ongoing",
            }),

            // Completed tournaments
            Tournament.countDocuments({
                organizer: organizerId,
                status: "completed",
            }),

            // Cancelled tournaments
            Tournament.countDocuments({
                organizer: organizerId,
                status: "cancelled",
            }),

            // Total participants across all organizer tournaments
            Tournament.aggregate([
                {
                    $match: {
                        organizer: organizerId,
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$currentParticipants",
                        },
                    },
                },
            ]),

            // Five most recently created tournaments
            Tournament.find({
                organizer: organizerId,
            })
                .sort({ createdAt: -1 })
                .limit(5),
        ]);

        res.status(200).json({
            success: true,

            stats: {
                totalTournaments,
                draftTournaments,
                publishedTournaments,
                ongoingTournaments,
                completedTournaments,
                cancelledTournaments,

                totalParticipants:
                    totalParticipants.length > 0
                        ? totalParticipants[0].total
                        : 0,
            },

            recentTournaments,
        });
    }
);