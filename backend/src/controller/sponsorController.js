import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Sponsor from "../models/Sponsor.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createSponsorProfile = catchAsyncErrors(async (req, res, next) => {
    const {
        sponsorName,
        organizationName,
        organizationType,
        description,
        contactEmail,
        contactPhone,
        website,
        address,
        logo,
    } = req.body;

    if (!sponsorName || !organizationName || !contactEmail) {
        return next(
            new ErrorHandler(
                "Please provide sponsorName, organizationName and contactEmail",
                400
            )
        );
    }

    const existingSponsor = await Sponsor.findOne({ userId: req.user._id });

    if (existingSponsor) {
        return next(new ErrorHandler("Sponsor profile already exists", 400));
    }

    const sponsor = await Sponsor.create({
        userId: req.user._id,
        sponsorName,
        organizationName,
        organizationType,
        description,
        contactEmail,
        contactPhone,
        website,
        address,
        logo,
    });

    res.status(201).json({
        success: true,
        message: "Sponsor profile created successfully",
        sponsor,
    });
});

export const getSponsorProfile = catchAsyncErrors(async (req, res, next) => {
    const sponsor = await Sponsor.findOne({ userId: req.user._id });

    if (!sponsor) {
        return next(new ErrorHandler("Sponsor profile not found", 404));
    }

    res.status(200).json({
        success: true,
        sponsor,
    });
});

export const updateSponsorProfile = catchAsyncErrors(async (req, res, next) => {
    const sponsor = await Sponsor.findOne({ userId: req.user._id });

    if (!sponsor) {
        return next(new ErrorHandler("Sponsor profile not found", 404));
    }

    const allowedFields = [
        "sponsorName",
        "organizationName",
        "organizationType",
        "description",
        "contactEmail",
        "contactPhone",
        "website",
        "address",
        "logo",
    ];

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            sponsor[field] = req.body[field];
        }
    }

    await sponsor.save();

    res.status(200).json({
        success: true,
        message: "Sponsor profile updated successfully",
        sponsor,
    });
});


export const deleteSponsorProfile = catchAsyncErrors(async (req, res, next) => {
    const sponsor = await Sponsor.findOne({ userId: req.user._id });

    if (!sponsor) {
        return next(new ErrorHandler("Sponsor profile not found", 404));
    }

    sponsor.status = "inactive";
    await sponsor.save();

    res.status(200).json({
        success: true,
        message: "Sponsor profile deactivated successfully",
        sponsor,
    });
});