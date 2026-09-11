import Sponsor from "../models/sponsor.js";
import Sponsorship from "../models/sponsorship.js";
import Tournament from "../models/tournament.js";
import Payment from "../models/payment.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// @route   GET /api/v1/sponsors/me
// @desc    Get current logged in sponsor profile
export const getMySponsorProfile = catchAsyncErrors(async (req, res, next) => {
  let sponsor = await Sponsor.findOne({ userId: req.user._id });

  if (!sponsor) {
    // If not found yet, create initial default profile
    sponsor = await Sponsor.create({
      userId: req.user._id,
      companyName: req.user.name || "Brand Partner",
      contactEmail: req.user.email,
    });
  }

  res.status(200).json({
    success: true,
    data: sponsor,
  });
});

// @route   PUT /api/v1/sponsors/me
// @desc    Create or update sponsor profile
export const updateSponsorProfile = catchAsyncErrors(async (req, res, next) => {
  const {
    companyName,
    brandName,
    industry,
    website,
    contactEmail,
    contactPhone,
    budgetRange,
    preferredGames,
    preferredLocations,
    description,
    logoUrl,
  } = req.body;

  let sponsor = await Sponsor.findOne({ userId: req.user._id });

  if (!sponsor) {
    sponsor = await Sponsor.create({
      userId: req.user._id,
      companyName: companyName || req.user.name,
      brandName,
      industry,
      website,
      contactEmail: contactEmail || req.user.email,
      contactPhone,
      budgetRange,
      preferredGames,
      preferredLocations,
      description,
      logoUrl,
    });
  } else {
    sponsor.companyName = companyName || sponsor.companyName;
    if (brandName !== undefined) sponsor.brandName = brandName;
    if (industry !== undefined) sponsor.industry = industry;
    if (website !== undefined) sponsor.website = website;
    if (contactEmail !== undefined) sponsor.contactEmail = contactEmail;
    if (contactPhone !== undefined) sponsor.contactPhone = contactPhone;
    if (budgetRange !== undefined) sponsor.budgetRange = budgetRange;
    if (preferredGames !== undefined) sponsor.preferredGames = preferredGames;
    if (preferredLocations !== undefined) sponsor.preferredLocations = preferredLocations;
    if (description !== undefined) sponsor.description = description;
    if (logoUrl !== undefined) sponsor.logoUrl = logoUrl;

    await sponsor.save();
  }

  res.status(200).json({
    success: true,
    data: sponsor,
  });
});

// @route   POST /api/v1/tournaments/:id/sponsors
// @desc    Sponsor a tournament (submit proposal)
export const sponsorTournament = catchAsyncErrors(async (req, res, next) => {
  const tournamentId = req.params.id || req.body.tournamentId;
  const tournament = await Tournament.findById(tournamentId);

  const {
    tier = "Gold Partner",
    amount,
    deliverables = [],
    message = "",
  } = req.body;

  if (!amount || Number(amount) <= 0) {
    return next(new ErrorHandler("Please provide a valid sponsorship amount", 400));
  }

  const sponsor = await Sponsor.findOne({ userId: req.user._id });

  const sponsorship = await Sponsorship.create({
    tournamentId: tournament?._id || tournamentId,
    sponsorId: sponsor?._id,
    sponsorUserId: req.user._id,
    tournamentTitle: tournament?.title || req.body.tournamentTitle || "Championship Event",
    game: tournament?.game || req.body.game || "Esports",
    tier,
    amount: Number(amount),
    status: "pending",
    organizerName: tournament?.organizer?.name || req.body.organizerName || "Tournament Host",
    organizerEmail: tournament?.organizer?.email || req.body.organizerEmail || "",
    deliverables,
    message,
  });

  // Record payment in escrow ledger
  await Payment.create({
    transactionId: `TXN_${Date.now()}`,
    userId: req.user._id,
    tournamentId: tournament?._id || tournamentId,
    type: "Sponsorship Deposit",
    entity: sponsor?.companyName || req.user.name,
    tournament: tournament?.title || "Championship Event",
    amount: Number(amount),
    method: "Escrow Transfer",
    status: "pending",
  }).catch(() => null);

  res.status(201).json({
    success: true,
    message: "Sponsorship proposal submitted successfully",
    data: sponsorship,
  });
});

// @route   GET /api/v1/sponsors/sponsorships
// @desc    Get all sponsorships submitted by logged-in sponsor
export const getMySponsorships = catchAsyncErrors(async (req, res, next) => {
  const sponsorships = await Sponsorship.find({
    sponsorUserId: req.user._id,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: sponsorships,
  });
});

// @route   GET /api/v1/tournaments/:id/sponsors
// @desc    Get all approved sponsors for a specific tournament
export const getTournamentSponsors = catchAsyncErrors(async (req, res, next) => {
  const sponsors = await Sponsorship.find({
    tournamentId: req.params.id,
    status: { $in: ["approved", "active", "completed"] },
  });

  res.status(200).json({
    success: true,
    data: sponsors,
  });
});

// @route   GET /api/v1/organizer/sponsors
// @desc    Get all incoming sponsorship proposals for tournaments
export const getOrganizerSponsors = catchAsyncErrors(async (req, res, next) => {
  const sponsorships = await Sponsorship.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: sponsorships,
  });
});

// @route   PATCH /api/v1/organizer/sponsors/:id/status
// @desc    Update status of a sponsorship (Approve / Reject)
export const updateSponsorshipStatus = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const sponsorship = await Sponsorship.findById(req.params.id);

  if (!sponsorship) {
    return next(new ErrorHandler("Sponsorship record not found", 404));
  }

  sponsorship.status = status;
  await sponsorship.save();

  // If approved, update payment status to success
  if (status === "approved" || status === "active") {
    await Payment.findOneAndUpdate(
      { tournamentId: sponsorship.tournamentId, userId: sponsorship.sponsorUserId },
      { status: "success" }
    ).catch(() => null);
  }

  res.status(200).json({
    success: true,
    data: sponsorship,
  });
});

// @route   GET /api/v1/sponsors
// @desc    Get all verified sponsors
export const getAllSponsors = catchAsyncErrors(async (req, res, next) => {
  const sponsors = await Sponsor.find().sort({ totalInvested: -1 });

  res.status(200).json({
    success: true,
    data: sponsors,
  });
});
