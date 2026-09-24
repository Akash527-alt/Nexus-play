import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  ShieldCheck,
  XCircle,
  Ban,
  Eye,
  RefreshCw,
  User,
  CreditCard,
} from "lucide-react";
import { adminService } from "../../services/adminService";

const statusStyles = {
  pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  verified: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  active: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  rejected: "text-red-400 bg-red-400/10 border-red-400/20",
  suspended: "text-orange-400 bg-orange-400/10 border-orange-400/20",
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

export const SponsorsManagementPage = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

const fetchSponsors = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await adminService.getSponsors();

      setSponsors(response?.sponsors || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load sponsors");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const filteredSponsors = useMemo(() => {
    const value = search.trim().toLowerCase();

    return sponsors.filter((sponsor) => {
      const matchesStatus =
        statusFilter === "all" || sponsor.status === statusFilter;

      const matchesSearch =
        !value ||
        sponsor.companyName?.toLowerCase().includes(value) ||
        sponsor.brandName?.toLowerCase().includes(value) ||
        sponsor.contactEmail?.toLowerCase().includes(value) ||
        sponsor.industry?.toLowerCase().includes(value) ||
        sponsor.representativeName?.toLowerCase().includes(value);

      return matchesStatus && matchesSearch;
    });
  }, [sponsors, search, statusFilter]);

  const handleAction = async (action) => {
    if (!selectedSponsor) return;

    try {
      setActionLoading(true);

      if (action === "verify") {
        await adminService.verifySponsor(selectedSponsor._id);
      }

      if (action === "reject") {
        await adminService.rejectSponsor(selectedSponsor._id);
      }

      if (action === "suspend") {
        await adminService.suspendSponsor(selectedSponsor._id);
      }

      await fetchSponsors();
      setSelectedSponsor(null);
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${action} sponsor`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold theme-text">Corporate Sponsors</h1>
          <p className="mt-1 text-sm theme-subtext">
            Review sponsor profiles and manage verification status.
          </p>
        </div>

        <button
          onClick={() => fetchSponsors(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border theme-border px-4 py-2 text-sm theme-text transition hover:bg-white/5 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {[
          ["All", "all"],
          ["Pending", "pending"],
          ["Verified", "verified"],
          ["Rejected", "rejected"],
          ["Suspended", "suspended"],
        ].map(([label, value]) => {
          const count =
            value === "all"
              ? sponsors.length
              : sponsors.filter((sponsor) => sponsor.status === value).length;

          return (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`rounded-xl border p-4 text-left transition ${
                statusFilter === value
                  ? "border-indigo-500/50 bg-indigo-500/10"
                  : "theme-border theme-card hover:bg-white/5"
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
            placeholder="Search company, brand, industry, email..."
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
          <p className="mt-3 text-sm theme-subtext">Loading sponsors...</p>
        </div>
      ) : filteredSponsors.length === 0 ? (
        <div className="theme-card rounded-xl border theme-border p-10 text-center">
          <Building2 size={32} className="mx-auto theme-subtext" />
          <p className="mt-3 font-medium theme-text">No sponsors found</p>
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
                      Contact
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Industry
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
                  {filteredSponsors.map((sponsor) => (
                    <tr
                      key={sponsor._id}
                      className="border-b theme-border last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Building2 size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold theme-text">
                              {sponsor.companyName}
                            </p>

                            <p className="truncate text-xs theme-subtext">
                              {sponsor.brandName || "No brand name"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm theme-text">
                          {sponsor.contactEmail || "—"}
                        </p>
                        <p className="mt-1 text-xs theme-subtext">
                          {sponsor.contactPhone || "No phone"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm theme-text">
                        {sponsor.industry || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                            statusStyles[sponsor.status] ||
                            "theme-border theme-text"
                          }`}
                        >
                          {formatStatus(sponsor.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedSponsor(sponsor)}
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
            {filteredSponsors.map((sponsor) => (
              <div
                key={sponsor._id}
                className="theme-card rounded-xl border theme-border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Building2 size={18} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold theme-text">
                        {sponsor.companyName}
                      </h3>

                      <p className="truncate text-xs theme-subtext">
                        {sponsor.brandName || "No brand name"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-1 text-[11px] ${
                      statusStyles[sponsor.status] || "theme-border theme-text"
                    }`}
                  >
                    {formatStatus(sponsor.status)}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <InfoItem
                    icon={Mail}
                    label="Email"
                    value={sponsor.contactEmail}
                  />

                  <InfoItem
                    icon={Building2}
                    label="Industry"
                    value={sponsor.industry}
                  />

                  <InfoItem
                    icon={User}
                    label="Representative"
                    value={sponsor.representativeName}
                  />
                </div>

                <button
                  onClick={() => setSelectedSponsor(sponsor)}
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

      {selectedSponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="theme-card max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl border theme-border shadow-2xl">
            <div className="flex items-center justify-between border-b theme-border p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Building2 size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold theme-text">
                    {selectedSponsor.companyName}
                  </h2>

                  <p className="text-xs theme-subtext">
                    {selectedSponsor.brandName || "Corporate Sponsor"}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSponsor(null)}
                className="rounded-lg p-2 theme-subtext transition hover:bg-white/5 hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-150px)] overflow-y-auto p-5">
              <div className="space-y-6">
                <DetailSection title="Sponsor Information">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={Building2}
                      label="Company Name"
                      value={selectedSponsor.companyName}
                    />

                    <InfoItem
                      icon={Building2}
                      label="Brand Name"
                      value={selectedSponsor.brandName}
                    />

                    <InfoItem
                      icon={Building2}
                      label="Industry"
                      value={selectedSponsor.industry}
                    />

                    <InfoItem
                      icon={Globe}
                      label="Website"
                      value={selectedSponsor.website}
                    />

                    <InfoItem
                      icon={CreditCard}
                      label="Budget Range"
                      value={selectedSponsor.budgetRange}
                    />

                    <InfoItem
                      icon={Calendar}
                      label="Joined"
                      value={formatDate(selectedSponsor.createdAt)}
                    />
                  </div>

                  {selectedSponsor.description && (
                    <div className="mt-5">
                      <p className="text-xs theme-subtext">Description</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm theme-text">
                        {selectedSponsor.description}
                      </p>
                    </div>
                  )}
                </DetailSection>

                <DetailSection title="Contact Information">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={User}
                      label="Representative"
                      value={selectedSponsor.representativeName}
                    />

                    <InfoItem
                      icon={Mail}
                      label="Email"
                      value={selectedSponsor.contactEmail}
                    />

                    <InfoItem
                      icon={Phone}
                      label="Phone"
                      value={selectedSponsor.contactPhone}
                    />
                  </div>
                </DetailSection>

              

                <DetailSection title="Verification">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={CreditCard}
                      label="Aadhaar Number"
                      value={selectedSponsor.aadhaarNumber}
                    />

                    <InfoItem
                      icon={CreditCard}
                      label="PAN Number"
                      value={selectedSponsor.panNumber}
                    />

                    <InfoItem
                      icon={ShieldCheck}
                      label="Current Status"
                      value={formatStatus(selectedSponsor.status)}
                    />

                    <InfoItem
                      icon={Calendar}
                      label="Last Updated"
                      value={formatDate(selectedSponsor.updatedAt)}
                    />
                  </div>
                </DetailSection>

                {selectedSponsor.userId && (
                  <DetailSection title="Account">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <InfoItem
                        icon={User}
                        label="Account Name"
                        value={selectedSponsor.userId.name}
                      />

                      <InfoItem
                        icon={Mail}
                        label="Account Email"
                        value={selectedSponsor.userId.email}
                      />
                    </div>
                  </DetailSection>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t theme-border p-5 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedSponsor(null)}
                className="rounded-lg border theme-border px-4 py-2.5 text-sm theme-text transition hover:bg-white/5"
              >
                Close
              </button>

              {selectedSponsor.status !== "verified" &&
                selectedSponsor.status !== "active" && (
                  <button
                    onClick={() => handleAction("verify")}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-50"
                  >
                    <ShieldCheck size={16} />
                    Verify
                  </button>
                )}

              {selectedSponsor.status !== "rejected" && (
                <button
                  onClick={() => handleAction("reject")}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              )}

              {selectedSponsor.status !== "suspended" && (
                <button
                  onClick={() => handleAction("suspend")}
                  disabled={actionLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-orange-500/30 px-4 py-2.5 text-sm font-medium text-orange-400 transition hover:bg-orange-500/10 disabled:opacity-50"
                >
                  <Ban size={16} />
                  Suspend
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

