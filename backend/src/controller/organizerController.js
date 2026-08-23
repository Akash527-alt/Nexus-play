import Organizer from "../models/organizer.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createOrganizerProfile = catchAsyncErrors(
    async (req, res, next) => {
        const {
            organizationName,
            organizationType,
            description,
            address,
            contactEmail,
            contactPhone,
        } = req.body;

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

        if (req.user.role !== "organizer") {
            return next(
                new ErrorHandler(
                    "Only organizers can create an organizer profile",
                    403
                )
            );
        }

        const existingOrganizer = await Organizer.findOne({
            userId: req.user._id,
        });

        if (existingOrganizer) {
            return next(
                new ErrorHandler(
                    "Organizer profile already exists",
                    400
                )
            );
        }

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

        res.status(201).json({
            success: true,
            message: "Organizer profile created successfully",
            organizer,
        });
    }
);