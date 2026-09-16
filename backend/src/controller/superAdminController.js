import Organizer from "../models/organizer.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";



export const getSuperAdminProfile = catchAsyncErrors(
    async (req, res, next) => {

        const superAdmin = await User.findOne({
            _id: req.user._id,
            role: "superadmin"
        }).select("-password");

        if (!superAdmin) {
            return next(
                new ErrorHandler("Superadmin not found", 404)
            );
        }

        res.status(200).json({
            success: true,
            superAdmin
        });
    }
);

// GET /api/v1/superadmin/organizers

export const getAllOrganizers = catchAsyncErrors(
    async (req, res, next) => {

        const organizers = await Organizer.find()
            .populate("userId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: organizers.length,
            organizers,
        });
    }
);


// =====================================================
// GET SINGLE ORGANIZER
// GET /api/v1/superadmin/organizers/:id
// =====================================================

export const getOrganizer = catchAsyncErrors(
    async (req, res, next) => {

        const organizer = await Organizer.findById(req.params.id)
            .populate("userId", "name email");

        if (!organizer) {
            return next(
                new ErrorHandler(
                    "Organizer not found",
                    404
                )
            );
        }

        res.status(200).json({
            success: true,
            organizer,
        });
    }
);


// =====================================================
// VERIFY ORGANIZER
// PUT /api/v1/superadmin/organizers/:id/verify
// =====================================================

export const verifyOrganizer = catchAsyncErrors(
    async (req, res, next) => {

        const organizer = await Organizer.findById(
            req.params.id
        );

        if (!organizer) {
            return next(
                new ErrorHandler(
                    "Organizer not found",
                    404
                )
            );
        }

        if (organizer.verificationStatus === "verified") {
            return next(
                new ErrorHandler(
                    "Organizer is already verified",
                    400
                )
            );
        }

        organizer.verificationStatus = "verified";

        await organizer.save();

        res.status(200).json({
            success: true,
            message: "Organizer verified successfully",
            organizer,
        });
    }
);


// =====================================================
// REJECT ORGANIZER
// PUT /api/v1/superadmin/organizers/:id/reject
// =====================================================

export const rejectOrganizer = catchAsyncErrors(
    async (req, res, next) => {

        const organizer = await Organizer.findById(
            req.params.id
        );

        if (!organizer) {
            return next(
                new ErrorHandler(
                    "Organizer not found",
                    404
                )
            );
        }

        if (organizer.verificationStatus === "rejected") {
            return next(
                new ErrorHandler(
                    "Organizer is already rejected",
                    400
                )
            );
        }

        organizer.verificationStatus = "rejected";

        await organizer.save();

        res.status(200).json({
            success: true,
            message: "Organizer rejected successfully",
            organizer,
        });
    }
);


// =====================================================
// SUSPEND ORGANIZER
// PUT /api/v1/superadmin/organizers/:id/suspend
// =====================================================

export const suspendOrganizer = catchAsyncErrors(
    async (req, res, next) => {

        const organizer = await Organizer.findById(
            req.params.id
        );

        if (!organizer) {
            return next(
                new ErrorHandler(
                    "Organizer not found",
                    404
                )
            );
        }

        if (organizer.verificationStatus === "suspended") {
            return next(
                new ErrorHandler(
                    "Organizer is already suspended",
                    400
                )
            );
        }

        organizer.verificationStatus = "suspended";

        await organizer.save();

        res.status(200).json({
            success: true,
            message: "Organizer suspended successfully",
            organizer,
        });
    }
);
