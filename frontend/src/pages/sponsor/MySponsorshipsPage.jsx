import React, { useEffect, useState } from "react";
import {
  Handshake,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Calendar,
  Trophy,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { sponsorService } from "../../services/sponsorService";
import { toast } from "sonner";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

export function MySponsorshipsPage() {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const loadSponsorships = async () => {
    try {
      setLoading(true);

      const response = await sponsorService.getMySponsorships();

      setSponsorships(response?.data || []);
    } catch (error) {
      console.error("Failed to load sponsorships:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load sponsorships.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsorships();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";

      case "approved":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";

      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

      case "rejected":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";

      case "completed":
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";

      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;

      case "approved":
      case "active":
        return <CheckCircle className="w-4 h-4" />;

      case "rejected":
        return <XCircle className="w-4 h-4" />;

      default:
        return <Handshake className="w-4 h-4" />;
    }
  };

  const handlePayment = async (sponsorship) => {
    try {
      setPayingId(sponsorship._id);

      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        toast.error("Razorpay failed to load. Please try again.");
        return;
      }

      const response = await sponsorService.createSponsorshipPaymentOrder(
        sponsorship._id,
      );

      if (!response?.success) {
        toast.error(response?.message || "Unable to create payment order.");
        return;
      }

      const options = {
        key: response.key,
        amount: response.amount,
        currency: response.currency,
        name: "NexusPlay",
        description: `Sponsorship - ${
          sponsorship.tournamentId?.title ||
          sponsorship.tournamentTitle ||
          "Tournament"
        }`,
        order_id: response.orderId,

        handler: async function (paymentResponse) {
          try {
            const verificationResponse =
              await sponsorService.verifySponsorshipPayment({
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_signature: paymentResponse.razorpay_signature,
                paymentId: response.paymentId,
              });

            if (verificationResponse?.success) {
              toast.success("Sponsorship payment completed successfully.");

              await loadSponsorships();
            }
          } catch (error) {
            console.error("Sponsorship payment verification error:", error);

            toast.error(
              error?.response?.data?.message || "Payment verification failed.",
            );
          } finally {
            setPayingId(null);
          }
        },

        modal: {
          ondismiss: function () {
            setPayingId(null);
          },
        },

        theme: {
          color: "#4f46e5",
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (paymentResponse) {
        console.error("Razorpay payment failed:", paymentResponse);

        toast.error(paymentResponse?.error?.description || "Payment failed.");

        setPayingId(null);
      });

      razorpay.open();
    } catch (error) {
      console.error("Sponsorship payment error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to start sponsorship payment.",
      );

      setPayingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text">My Sponsorships</h1>

          <p className="text-xs md:text-sm theme-subtext mt-1">
            Track your sponsorship proposals, approvals, and payment status.
          </p>
        </div>

        <button
          onClick={loadSponsorships}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl theme-card border theme-border theme-text text-xs font-semibold hover:bg-indigo-500/10 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="theme-card border theme-border rounded-2xl p-10 text-center">
          <RefreshCw className="w-5 h-5 animate-spin theme-subtext mx-auto" />

          <p className="text-xs theme-subtext mt-3">Loading sponsorships...</p>
        </div>
      ) : sponsorships.length === 0 ? (
        <div className="theme-card border theme-border rounded-2xl p-10 text-center">
          <Handshake className="w-8 h-8 theme-subtext mx-auto" />

          <h3 className="text-sm font-bold theme-text mt-3">
            No sponsorships yet
          </h3>

          <p className="text-xs theme-subtext mt-1">
            Your sponsorship proposals will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sponsorships.map((sponsorship) => {
            const tournamentTitle =
              sponsorship.tournamentId?.title ||
              sponsorship.tournamentTitle ||
              "Tournament";

            const game =
              sponsorship.tournamentId?.game || sponsorship.game || "Esports";

            const isPaymentPending =
              sponsorship.status === "approved" &&
              sponsorship.paymentStatus === "pending";

            const isPaid = sponsorship.paymentStatus === "paid";

            const isPaying = payingId === sponsorship._id;

            return (
              <div
                key={sponsorship._id}
                className="theme-card border theme-border rounded-2xl p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${getStatusStyle(
                          sponsorship.status,
                        )}`}
                      >
                        {getStatusIcon(sponsorship.status)}
                        {sponsorship.status}
                      </span>

                      <span className="text-[10px] theme-subtext flex items-center gap-1">
                        <CreditCard className="w-3 h-3" />
                        {sponsorship.paymentStatus === "paid"
                          ? "Paid"
                          : sponsorship.paymentStatus === "pending"
                            ? "Payment Pending"
                            : sponsorship.paymentStatus === "failed"
                              ? "Payment Failed"
                              : "Payment Not Required"}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold theme-text mt-3">
                      {tournamentTitle}
                    </h2>

                    <p className="text-xs theme-subtext mt-1">
                      Game:{" "}
                      <span className="font-semibold theme-text">{game}</span>
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-[11px] theme-subtext">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />

                        {sponsorship.tournamentId?.startDate
                          ? new Date(
                              sponsorship.tournamentId.startDate,
                            ).toLocaleDateString()
                          : "Date TBA"}
                      </span>

                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />₹
                        {Number(sponsorship.amount || 0).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>

                    {sponsorship.requirements && (
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider theme-subtext">
                          Sponsorship Requirements
                        </p>

                        <p className="text-xs theme-subtext mt-1 leading-relaxed">
                          {sponsorship.requirements}
                        </p>
                      </div>
                    )}

                    {sponsorship.message && (
                      <div className="mt-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider theme-subtext">
                          Message
                        </p>

                        <p className="text-xs theme-subtext mt-1 leading-relaxed">
                          {sponsorship.message}
                        </p>
                      </div>
                    )}

                    {sponsorship.status === "rejected" &&
                      sponsorship.rejectionReason && (
                        <div className="mt-4 border border-rose-500/20 bg-rose-500/5 rounded-xl p-4">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                            Rejection Reason
                          </p>

                          <p className="text-xs theme-subtext mt-1">
                            {sponsorship.rejectionReason}
                          </p>
                        </div>
                      )}

                    {isPaymentPending && (
                      <div className="mt-5 border border-cyan-500/20 bg-cyan-500/5 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div>
                            <p className="text-xs font-bold theme-text">
                              Sponsorship Approved
                            </p>

                            <p className="text-[11px] theme-subtext mt-1">
                              The organizer has approved your sponsorship
                              proposal. Complete the payment to activate the
                              sponsorship.
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handlePayment(sponsorship)}
                            disabled={isPaying}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                          >
                            <CreditCard className="w-4 h-4" />

                            {isPaying
                              ? "Opening Payment..."
                              : `Pay ₹${Number(
                                  sponsorship.amount || 0,
                                ).toLocaleString("en-IN")}`}
                          </button>
                        </div>
                      </div>
                    )}

                    {isPaid && (
                      <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                          <CheckCircle className="w-4 h-4" />
                          Sponsorship payment completed
                        </div>

                        {sponsorship.paidAt && (
                          <span className="text-[11px] theme-subtext">
                            Paid on{" "}
                            {new Date(sponsorship.paidAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 lg:text-right">
                    <p className="text-[10px] uppercase tracking-wider theme-subtext">
                      Sponsorship Amount
                    </p>

                    <p className="text-xl font-extrabold text-indigo-400 mt-1">
                      ₹{Number(sponsorship.amount || 0).toLocaleString("en-IN")}
                    </p>

                    <p className="text-[10px] theme-subtext mt-2">
                      Submitted{" "}
                      {sponsorship.createdAt
                        ? new Date(sponsorship.createdAt).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MySponsorshipsPage;
