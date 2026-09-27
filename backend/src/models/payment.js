import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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

    registration: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      default: null,
    },

    registrationData: {
      registrationType: {
        type: String,
        enum: ["solo", "team"],
        required: true,
      },

      teamName: {
        type: String,
        required: true,
        trim: true,
      },

      players: {
        type: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              default: null,
            },

            fullName: {
              type: String,
              required: true,
              trim: true,
            },

            gameUid: {
              type: String,
              required: true,
              trim: true,
            },

            email: {
              type: String,
              required: true,
              trim: true,
              lowercase: true,
            },

            phone: {
              type: String,
              required: true,
              trim: true,
            },
          },
        ],
        required: true,
      },

      captainContact: {
        whatsapp: {
          type: String,
          required: true,
          trim: true,
        },

        alternatePhone: {
          type: String,
          trim: true,
          default: "",
        },

        discordId: {
          type: String,
          trim: true,
          default: "",
        },
      },

      agreements: {
        antiCheat: {
          type: Boolean,
          required: true,
        },

        rulebook: {
          type: Boolean,
          required: true,
        },

        identityVerification: {
          type: Boolean,
          required: true,
        },

        mediaConsent: {
          type: Boolean,
          required: true,
        },

        professionalConduct: {
          type: Boolean,
          required: true,
        },

        guardianConsent: {
          type: Boolean,
          required: true,
        },

        captainResponsibility: {
          type: Boolean,
          required: true,
        },
      },
    },

    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Payment amount cannot be negative"],
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

const Payment =
  mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);

export default Payment;