import mongoose from "mongoose";

const sponsorshipSchema = new mongoose.Schema(
  {
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    sponsorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sponsor",
    },
    sponsorUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tournamentTitle: {
      type: String,
      required: true,
    },
    game: {
      type: String,
      default: "Esports",
    },
    tier: {
      type: String,
      enum: [
        "Title Sponsor",
        "Platinum Partner",
        "Gold Partner",
        "Silver Partner",
        "Community Booster",
      ],
      default: "Gold Partner",
    },
    amount: {
      type: Number,
      required: [true, "Please provide sponsorship amount"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "completed"],
      default: "pending",
    },
    organizerName: {
      type: String,
      default: "Tournament Host",
    },
    organizerEmail: {
      type: String,
      default: "",
    },
    deliverables: [
      {
        type: String,
      },
    ],
    message: {
      type: String,
      default: "",
    },
    audienceReach: {
      type: String,
      default: "50,000+ Viewers",
    },
    roiScore: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Sponsorship = mongoose.model("Sponsorship", sponsorshipSchema);

export default Sponsorship;
