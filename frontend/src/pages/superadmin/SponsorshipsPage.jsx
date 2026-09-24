import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Handshake,
  Eye,
  RefreshCw,
  XCircle,
  Building2,
  Trophy,
  IndianRupee,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { adminService } from "../../services/adminService";

const statusStyles = {
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  approved: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  payment_pending: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  paid: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  completed: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  rejected: "text-red-400 bg-red-400/10 border-red-400/20",
};

const formatStatus = (status) =>
  status
    ? status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "Unknown";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "—";

  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const getSponsorName = (sponsorship) => {
  if (sponsorship.sponsor?.companyName) {
    return sponsorship.sponsor.companyName;
  }

  if (sponsorship.sponsor?.brandName) {
    return sponsorship.sponsor.brandName;
  }

  if (sponsorship.sponsorId?.companyName) {
    return sponsorship.sponsorId.companyName;
  }

  if (sponsorship.sponsorId?.brandName) {
    return sponsorship.sponsorId.brandName;
  }

  return "Unknown Sponsor";
};

const getTournamentName = (sponsorship) => {
  if (sponsorship.tournament?.title) {
    return sponsorship.tournament.title;
  }

  if (sponsorship.tournamentId?.title) {
    return sponsorship.tournamentId.title;
  }

  return "Unknown Tournament";
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex gap-3">
    <div className="mt-0.5 text-indigo-400">
      <Icon size={17} />
    </div>

    <div className="min-w-0">
      <p className="text-xs theme-subtext">{label}</p>

      <p className="mt-1 break-words text-sm theme-text">{value || "—"}</p>
    </div>
  </div>
);

const DetailSection = ({ title, children }) => (
  <div className="border-b theme-border pb-5 last:border-0 last:pb-0">
    <h3 className="mb-4 text-sm font-semibold theme-text">{title}</h3>

    {children}
  </div>
);

export const SponsorshipsPage = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSponsorship, setSelectedSponsorship] = useState(null);

  const fetchSponsorships = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await adminService.getSponsorships();

      setSponsorships(response?.sponsorships || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load sponsorships");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const filteredSponsorships = useMemo(() => {
    const value = search.trim().toLowerCase();

    return sponsorships.filter((sponsorship) => {
      const sponsorName = getSponsorName(sponsorship).toLowerCase();

      const tournamentName = getTournamentName(sponsorship).toLowerCase();

      const matchesSearch =
        !value ||
        sponsorName.includes(value) ||
        tournamentName.includes(value) ||
        sponsorship.message?.toLowerCase().includes(value) ||
        sponsorship.requirements?.toLowerCase().includes(value);

      const matchesStatus =
        statusFilter === "all" || sponsorship.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sponsorships, search, statusFilter]);

  const statusFilters = [
    ["All", "all"],
    ["Pending", "pending"],
    ["Approved", "approved"],
    ["Payment Pending", "payment_pending"],
    ["Paid", "paid"],
    ["Completed", "completed"],
    ["Rejected", "rejected"],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold theme-text">Sponsorships</h1>

          <p className="mt-1 text-sm theme-subtext">
            Monitor sponsorship requests, approvals and payment status across
            the platform.
          </p>
        </div>

        <button
          onClick={() => fetchSponsorships(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border theme-border px-4 py-2 text-sm theme-text transition hover:bg-white/5 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {statusFilters.map(([label, value]) => {
          const count =
            value === "all"
              ? sponsorships.length
              : sponsorships.filter(
                  (sponsorship) => sponsorship.status === value,
                ).length;

          return (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`rounded-xl border p-4 text-left transition ${
                statusFilter === value
                  ? "border-indigo-500/50 bg-indigo-500/10"
                  : "theme-card theme-border hover:bg-white/5"
              }`}
            >
              <p className="text-xs theme-subtext">{label}</p>

              <p className="mt-1 text-xl font-bold theme-text">{count}</p>
            </button>
          );
        })}
      </div>

      <div className="theme-card rounded-xl border theme-border p-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 theme-subtext"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sponsor, tournament, requirements..."
            className="theme-input w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="theme-card rounded-xl border theme-border p-10 text-center">
          <RefreshCw size={22} className="mx-auto animate-spin theme-subtext" />

          <p className="mt-3 text-sm theme-subtext">Loading sponsorships...</p>
        </div>
      ) : filteredSponsorships.length === 0 ? (
        <div className="theme-card rounded-xl border theme-border p-10 text-center">
          <Handshake size={32} className="mx-auto theme-subtext" />

          <p className="mt-3 font-medium theme-text">No sponsorships found</p>

          <p className="mt-1 text-sm theme-subtext">
            Try changing the search or status filter.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border theme-border lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b theme-border bg-white/[0.02]">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Sponsor
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Tournament
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Date
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-medium theme-subtext">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSponsorships.map((sponsorship) => (
                    <tr
                      key={sponsorship._id}
                      className="border-b theme-border last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Building2 size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold theme-text">
                              {getSponsorName(sponsorship)}
                            </p>

                            <p className="truncate text-xs theme-subtext">
                              {sponsorship.sponsor?.industry ||
                                "Corporate Sponsor"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[220px] truncate text-sm theme-text">
                          {getTournamentName(sponsorship)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-medium theme-text">
                          {formatCurrency(sponsorship.amount)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm theme-text">
                          {formatDate(sponsorship.createdAt)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                            statusStyles[sponsorship.status] ||
                            "theme-border theme-text"
                          }`}
                        >
                          {formatStatus(sponsorship.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedSponsorship(sponsorship)}
                          className="inline-flex items-center gap-2 rounded-lg border theme-border px-3 py-2 text-sm theme-text transition hover:bg-white/5"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 lg:hidden">
            {filteredSponsorships.map((sponsorship) => (
              <div
                key={sponsorship._id}
                className="theme-card rounded-xl border theme-border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Handshake size={18} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold theme-text">
                        {getSponsorName(sponsorship)}
                      </h3>

                      <p className="truncate text-xs theme-subtext">
                        {getTournamentName(sponsorship)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-1 text-[11px] ${
                      statusStyles[sponsorship.status] ||
                      "theme-border theme-text"
                    }`}
                  >
                    {formatStatus(sponsorship.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoItem
                    icon={IndianRupee}
                    label="Amount"
                    value={formatCurrency(sponsorship.amount)}
                  />

                  <InfoItem
                    icon={Calendar}
                    label="Requested"
                    value={formatDate(sponsorship.createdAt)}
                  />

                  <InfoItem
                    icon={Trophy}
                    label="Tournament"
                    value={getTournamentName(sponsorship)}
                  />

                  <InfoItem
                    icon={Building2}
                    label="Sponsor"
                    value={getSponsorName(sponsorship)}
                  />
                </div>

                <button
                  onClick={() => setSelectedSponsorship(sponsorship)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border theme-border px-3 py-2 text-sm theme-text transition hover:bg-white/5"
                >
                  <Eye size={15} />
                  View Details
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedSponsorship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="theme-card max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border theme-border shadow-2xl">
            <div className="flex items-center justify-between border-b theme-border p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Handshake size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold theme-text">
                    {getSponsorName(selectedSponsorship)}
                  </h2>

                  <p className="truncate text-xs theme-subtext">
                    {getTournamentName(selectedSponsorship)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSponsorship(null)}
                className="rounded-lg p-2 theme-subtext transition hover:bg-white/5 hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5">
              <div className="space-y-6">
                <DetailSection title="Sponsorship Information">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={Building2}
                      label="Sponsor"
                      value={getSponsorName(selectedSponsorship)}
                    />

                    <InfoItem
                      icon={Trophy}
                      label="Tournament"
                      value={getTournamentName(selectedSponsorship)}
                    />

                    <InfoItem
                      icon={IndianRupee}
                      label="Sponsorship Amount"
                      value={formatCurrency(selectedSponsorship.amount)}
                    />

                    <InfoItem
                      icon={Calendar}
                      label="Request Date"
                      value={formatDate(selectedSponsorship.createdAt)}
                    />

                    <InfoItem
                      icon={Handshake}
                      label="Status"
                      value={formatStatus(selectedSponsorship.status)}
                    />
                  </div>
                </DetailSection>

                <DetailSection title="Sponsor">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={Building2}
                      label="Company"
                      value={selectedSponsorship.sponsorId?.companyName}
                    />

                    <InfoItem
                      icon={Building2}
                      label="Brand"
                      value={selectedSponsorship.sponsorId?.brandName}
                    />

                    <InfoItem
                      icon={Building2}
                      label="Industry"
                      value={selectedSponsorship.sponsorId?.industry}
                    />

                    <InfoItem
                      icon={User}
                      label="Representative"
                      value={selectedSponsorship.sponsorId?.representativeName}
                    />
                  </div>
                </DetailSection>

                <DetailSection title="Request Details">
                  <div className="space-y-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText size={17} className="text-indigo-400" />

                        <p className="text-xs theme-subtext">Message</p>
                      </div>

                      <p className="mt-2 whitespace-pre-wrap text-sm theme-text">
                        {selectedSponsorship.message || "No message provided"}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <FileText size={17} className="text-indigo-400" />

                        <p className="text-xs theme-subtext">Requirements</p>
                      </div>

                      <p className="mt-2 whitespace-pre-wrap text-sm theme-text">
                        {selectedSponsorship.requirements ||
                          "No requirements provided"}
                      </p>
                    </div>
                  </div>
                </DetailSection>

                {selectedSponsorship.rejectionReason && (
                  <DetailSection title="Rejection">
                    <p className="whitespace-pre-wrap text-sm text-red-400">
                      {selectedSponsorship.rejectionReason}
                    </p>
                  </DetailSection>
                )}

                <DetailSection title="Timeline">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={Calendar}
                      label="Created"
                      value={formatDate(selectedSponsorship.createdAt)}
                    />

                    <InfoItem
                      icon={Calendar}
                      label="Last Updated"
                      value={formatDate(selectedSponsorship.updatedAt)}
                    />
                  </div>
                </DetailSection>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

