import React, { useEffect, useState } from "react";
import {
  DollarSign,
  Handshake,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
} from "lucide-react";
import { sponsorService } from "../../services/sponsorService";
import { toast } from "sonner";

export function SponsorAnalyticsPage() {
  const [sponsorships, setSponsorships] = useState([]);

  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const response = await sponsorService.getMySponsorships();

      setSponsorships(response?.data || []);
    } catch (error) {
      console.error("Failed to load sponsorship analytics:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load sponsorship data.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalProposals = sponsorships.length;

  const pending = sponsorships.filter(
    (item) => item.status === "pending",
  ).length;

  const approved = sponsorships.filter(
    (item) => item.status === "approved",
  ).length;

  const active = sponsorships.filter((item) => item.status === "active").length;

  const completed = sponsorships.filter(
    (item) => item.status === "completed",
  ).length;

  const rejected = sponsorships.filter(
    (item) => item.status === "rejected",
  ).length;

  const totalProposedAmount = sponsorships.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0,
  );

  const totalPaidAmount = sponsorships
    .filter((item) => item.paymentStatus === "paid")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const paymentPending = sponsorships
    .filter((item) => item.paymentStatus === "pending")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold theme-text">Sponsorship Analytics</h1>

        <p className="text-xs md:text-sm theme-subtext mt-1">
          Overview of your sponsorship proposals, approvals, and payments.
        </p>
      </div>

      {loading ? (
        <div className="theme-card border theme-border rounded-2xl p-12 text-center">
          <p className="text-xs theme-subtext">Loading sponsorship data...</p>
        </div>
      ) : (
        <>
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="theme-card border theme-border rounded-2xl p-5">
              <DollarSign className="w-5 h-5 text-indigo-400" />

              <p className="text-[10px] theme-subtext uppercase tracking-wider mt-3">
                Total Proposed
              </p>

              <p className="text-2xl font-black theme-text mt-1">
                ₹{totalProposedAmount.toLocaleString("en-IN")}
              </p>

              <p className="text-[11px] theme-subtext mt-1">
                Across all sponsorship proposals
              </p>
            </div>

            <div className="theme-card border theme-border rounded-2xl p-5">
              <CheckCircle className="w-5 h-5 text-emerald-400" />

              <p className="text-[10px] theme-subtext uppercase tracking-wider mt-3">
                Total Paid
              </p>

              <p className="text-2xl font-black text-emerald-400 mt-1">
                ₹{totalPaidAmount.toLocaleString("en-IN")}
              </p>

              <p className="text-[11px] theme-subtext mt-1">
                Successfully paid sponsorships
              </p>
            </div>

            <div className="theme-card border theme-border rounded-2xl p-5">
              <CreditCard className="w-5 h-5 text-cyan-400" />

              <p className="text-[10px] theme-subtext uppercase tracking-wider mt-3">
                Payment Pending
              </p>

              <p className="text-2xl font-black text-cyan-400 mt-1">
                ₹{paymentPending.toLocaleString("en-IN")}
              </p>

              <p className="text-[11px] theme-subtext mt-1">
                Approved sponsorships awaiting payment
              </p>
            </div>
          </div>

          {/* Status Overview */}
          <div className="theme-card border theme-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Handshake className="w-5 h-5 text-indigo-400" />

              <div>
                <h2 className="text-base font-bold theme-text">
                  Proposal Status
                </h2>

                <p className="text-xs theme-subtext">
                  Current status of your sponsorship requests.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <p className="text-[10px] theme-subtext uppercase">Total</p>

                <p className="text-xl font-black theme-text mt-1">
                  {totalProposals}
                </p>
              </div>

              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <Clock className="w-4 h-4 text-amber-400" />

                <p className="text-[10px] theme-subtext uppercase mt-2">
                  Pending
                </p>

                <p className="text-xl font-black text-amber-400 mt-1">
                  {pending}
                </p>
              </div>

              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <CheckCircle className="w-4 h-4 text-cyan-400" />

                <p className="text-[10px] theme-subtext uppercase mt-2">
                  Approved
                </p>

                <p className="text-xl font-black text-cyan-400 mt-1">
                  {approved}
                </p>
              </div>

              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <Handshake className="w-4 h-4 text-emerald-400" />

                <p className="text-[10px] theme-subtext uppercase mt-2">
                  Active
                </p>

                <p className="text-xl font-black text-emerald-400 mt-1">
                  {active}
                </p>
              </div>

              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <CheckCircle className="w-4 h-4 text-indigo-400" />

                <p className="text-[10px] theme-subtext uppercase mt-2">
                  Completed
                </p>

                <p className="text-xl font-black text-indigo-400 mt-1">
                  {completed}
                </p>
              </div>

              <div className="theme-icon-box border theme-border rounded-xl p-4">
                <XCircle className="w-4 h-4 text-rose-400" />

                <p className="text-[10px] theme-subtext uppercase mt-2">
                  Rejected
                </p>

                <p className="text-xl font-black text-rose-400 mt-1">
                  {rejected}
                </p>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="theme-card border theme-border rounded-2xl p-6">
            <h2 className="text-base font-bold theme-text">
              Analytics Availability
            </h2>

            <p className="text-xs theme-subtext mt-2 leading-relaxed">
              Detailed marketing analytics such as impressions, audience reach,
              engagement, CPM, and ROI are not currently stored by the NexusPlay
              sponsorship backend. They should be added later when the platform
              starts collecting actual tournament audience and campaign
              performance data.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default SponsorAnalyticsPage;
