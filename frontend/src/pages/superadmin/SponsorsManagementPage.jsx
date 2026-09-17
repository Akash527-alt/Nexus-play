import React, { useEffect, useState } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  Ban,
  Loader2,
  X,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";

import adminService from "../../services/adminService";

export const SponsorsManagementPage = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all sponsors
  const loadSponsors = async () => {
    try {
      setLoading(true);

      const response = await adminService.getSponsors();

      setSponsors(response || []);
    } catch (error) {
      console.error("Failed to load sponsors:", error);

      toast.error(error.response?.data?.message || "Failed to load sponsors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSponsors();
  }, []);

  // Open sponsor details modal
  const openSponsorDetails = async (sponsorId) => {
    try {
      setDetailsLoading(true);

      const response = await adminService.getSponsorDetails(sponsorId);

      const sponsor = response.sponsor || response.data || response;

      setSelectedSponsor(sponsor);
    } catch (error) {
      console.error("Failed to load sponsor details:", error);

      toast.error(
        error.response?.data?.message || "Failed to load sponsor details",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // Perform sponsor action
  const handleAction = async (action) => {
    console.log("ACTION RECEIVED:", action);
    console.log("SELECTED SPONSOR:", selectedSponsor);
    if (!selectedSponsor) return;

    const sponsorId = selectedSponsor._id || selectedSponsor.id;

    try {
      setActionLoading(true);

      if (action === "verify") {
        await adminService.verifySponsor(sponsorId);

        toast.success("Sponsor verified successfully");
      }

      if (action === "reject") {
        await adminService.rejectSponsor(sponsorId);

        toast.success("Sponsor rejected successfully");
      }

      if (action === "suspend") {
        await adminService.suspendSponsor(sponsorId);

        toast.success("Sponsor suspended successfully");
      }

      setSelectedSponsor(null);

      await loadSponsors();
    } catch (error) {
      console.error("Sponsor action failed:", error);

      toast.error(error.response?.data?.message || "Unable to perform action");
    } finally {
      setActionLoading(false);
    }
  };

  // Status styling for dark theme
  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",

      verified:
        "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",

      active: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",

      rejected: "bg-rose-500/15 text-rose-400 border border-rose-500/30",

      suspended: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
    };

    return (
      styles[status] ||
      "bg-slate-500/20 text-slate-300 border border-slate-500/30"
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-transparent">
        <Loader2 size={32} className="animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <ShieldCheck size={18} className="text-cyan-400" />

            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Governance Suite
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Sponsors Management
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Review and manage sponsor verification requests.
          </p>
        </div>

        <div className="w-fit rounded-full border border-slate-700 bg-slate-800/70 px-4 py-2 text-sm text-slate-300">
          Total Sponsors:{" "}
          <span className="font-semibold text-white">{sponsors.length}</span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-800/60 shadow-xl md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-slate-700 bg-slate-800/90">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Company
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Contact
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Total Invested
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-700/70">
              {sponsors.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No sponsors found.
                  </td>
                </tr>
              ) : (
                sponsors.map((sponsor) => (
                  <tr
                    key={sponsor._id || sponsor.id}
                    className="transition-colors hover:bg-slate-700/30"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
                          <Building2 size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[190px] truncate font-semibold text-white">
                            {sponsor.companyName || sponsor.brandName || "N/A"}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {sponsor.industry || "Gaming & Esports"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <p className="max-w-[220px] break-all text-sm text-slate-300">
                        {sponsor.contactEmail || sponsor.userId?.email || "N/A"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {sponsor.contactPhone || "No phone"}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusStyle(
                          sponsor.status,
                        )}`}
                      >
                        {sponsor.status || "pending"}
                      </span>
                    </td>

                    <td className="px-5 py-5 text-sm text-slate-300">
                      ₹
                      {Number(sponsor.totalInvested || 0).toLocaleString(
                        "en-IN",
                      )}
                    </td>

                    <td className="px-5 py-5">
                      <button
                        onClick={() =>
                          openSponsorDetails(sponsor._id || sponsor.id)
                        }
                        disabled={detailsLoading}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/15 px-3 py-2 text-sm font-medium text-indigo-300 transition hover:bg-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Eye size={16} />
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {sponsors.length === 0 ? (
          <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-8 text-center text-slate-400">
            No sponsors found.
          </div>
        ) : (
          sponsors.map((sponsor) => (
            <div
              key={sponsor._id || sponsor.id}
              className="rounded-2xl border border-slate-700/80 bg-slate-800/60 p-4 shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
                    <Building2 size={18} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-white">
                      {sponsor.companyName || sponsor.brandName || "N/A"}
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {sponsor.industry || "Gaming & Esports"}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold capitalize ${getStatusStyle(
                    sponsor.status,
                  )}`}
                >
                  {sponsor.status || "pending"}
                </span>
              </div>

              <div className="mt-5 space-y-3 border-t border-slate-700/70 pt-4">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 shrink-0 text-slate-500" />

                  <p className="break-all text-sm text-slate-300">
                    {sponsor.contactEmail || sponsor.userId?.email || "N/A"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="shrink-0 text-slate-500" />

                  <p className="text-sm text-slate-300">
                    {sponsor.contactPhone || "No phone"}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-500">Total Invested</span>

                  <span className="text-sm font-semibold text-emerald-400">
                    ₹
                    {Number(sponsor.totalInvested || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => openSponsorDetails(sponsor._id || sponsor.id)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/15 px-4 py-3 text-sm font-semibold text-indigo-300 transition hover:bg-indigo-500/25"
              >
                <Eye size={16} />
                Review Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Sponsor Details Modal */}
      {selectedSponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-800/80 px-4 py-4 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400">
                  <Building2 size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-white sm:text-xl">
                    Sponsor Details
                  </h2>

                  <p className="text-xs text-slate-400">Verification review</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSponsor(null)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-4 sm:p-6">
              {/* Status */}
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                <span className="text-sm text-slate-400">Current Status</span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                    selectedSponsor.status,
                  )}`}
                >
                  {selectedSponsor.status || "pending"}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Detail
                  icon={Building2}
                  label="Company Name"
                  value={selectedSponsor.companyName}
                />

                <Detail
                  icon={Building2}
                  label="Brand Name"
                  value={selectedSponsor.brandName}
                />

                <Detail label="Industry" value={selectedSponsor.industry} />

                <Detail
                  icon={Mail}
                  label="Contact Email"
                  value={selectedSponsor.contactEmail}
                />

                <Detail
                  icon={Phone}
                  label="Contact Phone"
                  value={selectedSponsor.contactPhone}
                />

                <Detail
                  icon={Globe}
                  label="Website"
                  value={selectedSponsor.website}
                />

                <Detail
                  icon={Wallet}
                  label="Budget Range"
                  value={selectedSponsor.budgetRange}
                />

                <Detail
                  icon={Wallet}
                  label="Total Invested"
                  value={`₹${Number(
                    selectedSponsor.totalInvested || 0,
                  ).toLocaleString("en-IN")}`}
                />

                <Detail
                  icon={MapPin}
                  label="Address"
                  value={selectedSponsor.address}
                />

                <Detail
                  label="Representative Name"
                  value={selectedSponsor.representativeName}
                />

                <Detail
                  label="Aadhaar Number"
                  value={
                    selectedSponsor.aadhaarNumber
                      ? `********${String(selectedSponsor.aadhaarNumber).slice(
                          -4,
                        )}`
                      : "Not provided"
                  }
                />

                <Detail
                  label="PAN Number"
                  value={
                    selectedSponsor.panNumber
                      ? `******${String(selectedSponsor.panNumber).slice(-4)}`
                      : "Not provided"
                  }
                />
              </div>

              {/* Description */}
              <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Description
                </p>

                <p className="mt-2 break-words text-sm leading-6 text-slate-300">
                  {selectedSponsor.description || "No description provided"}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-700 bg-slate-800/80 p-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                onClick={() => handleAction("reject")}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-400 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XCircle size={16} />
                Reject
              </button>

              <button
                onClick={() => handleAction("suspend")}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700/60 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Ban size={16} />
                Suspend
              </button>

              <button
                type="button"
                onClick={() => {
                  console.log("VERIFY BUTTON CLICKED", selectedSponsor?._id);

                  handleAction("verify");
                }}
                disabled={actionLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reusable dark-theme detail component
const Detail = ({ icon: Icon, label, value }) => (
  <div className="min-w-0 rounded-xl border border-slate-700/80 bg-slate-800/60 p-4">
    <div className="flex items-center gap-2">
      {Icon && <Icon size={14} className="shrink-0 text-slate-500" />}

      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
    </div>

    <p className="mt-2 break-words text-sm font-medium text-slate-200">
      {value || "Not provided"}
    </p>
  </div>
);
