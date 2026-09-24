import React, { useEffect, useState } from "react";
import {
  Building2,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  CreditCard,
  X,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../services/adminService";

export function OrganizersManagementPage() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrganizers = async () => {
    try {
      setLoading(true);

      const response = await adminService.getOrganizers();

      setOrganizers(response.organizers || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load organizers",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizers();
  }, []);

  const handleViewOrganizer = async (id) => {
    try {
      setDetailLoading(true);

      const response = await adminService.getOrganizer(id);

      setSelectedOrganizer(response.organizer);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load organizer details",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAction = async (action, id) => {
    try {
      setActionLoading(true);

      let response;

      if (action === "verify") {
        response = await adminService.verifyOrganizer(id);
      }

      if (action === "reject") {
        response = await adminService.rejectOrganizer(id);
      }

      if (action === "suspend") {
        response = await adminService.suspendOrganizer(id);
      }

      toast.success(response?.message || "Organizer status updated");

      await loadOrganizers();

      if (selectedOrganizer?._id === id) {
        const updated = await adminService.getOrganizer(id);
        setSelectedOrganizer(updated.organizer);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update organizer",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const filteredOrganizers = organizers.filter((organizer) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      organizer.organizationName?.toLowerCase().includes(searchValue) ||
      organizer.organizationType?.toLowerCase().includes(searchValue) ||
      organizer.contactEmail?.toLowerCase().includes(searchValue) ||
      organizer.representativeName?.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "all" || organizer.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    if (status === "verified") {
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
    }

    if (status === "rejected") {
      return "bg-rose-500/15 text-rose-400 border-rose-500/30";
    }

    if (status === "suspended") {
      return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    }

    return "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const statusCounts = {
    all: organizers.length,
    pending: organizers.filter((item) => item.verificationStatus === "pending")
      .length,
    verified: organizers.filter(
      (item) => item.verificationStatus === "verified",
    ).length,
    rejected: organizers.filter(
      (item) => item.verificationStatus === "rejected",
    ).length,
    suspended: organizers.filter(
      (item) => item.verificationStatus === "suspended",
    ).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold theme-text">
          Organizer KYC Management
        </h1>

        <p className="text-xs md:text-sm theme-subtext mt-1">
          Review organizer profiles, KYC information, and verification status.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "verified", label: "Verified" },
          { key: "rejected", label: "Rejected" },
          { key: "suspended", label: "Suspended" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setStatusFilter(item.key)}
            className={`p-3 rounded-xl border text-left transition cursor-pointer ${
              statusFilter === item.key
                ? "bg-rose-600 border-rose-600 text-white"
                : "theme-card theme-border theme-subtext hover:theme-text"
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider font-bold">
              {item.label}
            </p>

            <p className="text-xl font-black mt-1">{statusCounts[item.key]}</p>
          </button>
        ))}
      </div>

      <div className="theme-card border theme-border rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 theme-subtext" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organization, representative, email, or type..."
            className="theme-input w-full pl-10 pr-4 py-2.5 rounded-xl border theme-border text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="theme-card border theme-border rounded-2xl p-12 text-center">
          <p className="text-xs theme-subtext">Loading organizer records...</p>
        </div>
      ) : filteredOrganizers.length === 0 ? (
        <div className="theme-card border theme-border rounded-2xl p-12 text-center">
          <Building2 className="w-8 h-8 mx-auto theme-subtext mb-3" />

          <p className="text-sm font-bold theme-text">No organizers found</p>

          <p className="text-xs theme-subtext mt-1">
            Try changing the search or verification filter.
          </p>
        </div>
      ) : (
        <div className="theme-card border theme-border rounded-2xl overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b theme-border">
                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider theme-subtext font-bold">
                    Organization
                  </th>

                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider theme-subtext font-bold">
                    Representative
                  </th>

                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider theme-subtext font-bold">
                    Contact
                  </th>

                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider theme-subtext font-bold">
                    Status
                  </th>

                  <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider theme-subtext font-bold">
                    Joined
                  </th>

                  <th className="text-right px-5 py-3 text-[10px] uppercase tracking-wider theme-subtext font-bold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredOrganizers.map((organizer) => (
                  <tr
                    key={organizer._id}
                    className="border-b theme-border last:border-b-0 hover:bg-rose-500/5 transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-bold theme-text truncate max-w-[220px]">
                            {organizer.organizationName}
                          </p>

                          <p className="text-[11px] theme-subtext capitalize">
                            {organizer.organizationType?.replaceAll("_", " ")}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold theme-text">
                        {organizer.representativeName || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs theme-text">
                        {organizer.contactEmail}
                      </p>

                      <p className="text-[11px] theme-subtext mt-0.5">
                        {organizer.contactPhone || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full border text-[10px] font-bold capitalize ${getStatusClass(
                          organizer.verificationStatus,
                        )}`}
                      >
                        {organizer.verificationStatus}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs theme-subtext">
                        {formatDate(organizer.createdAt)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleViewOrganizer(organizer._id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border theme-border theme-text hover:bg-rose-500/10 hover:text-rose-400 text-[11px] font-bold transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden divide-y theme-border">
            {filteredOrganizers.map((organizer) => (
              <div key={organizer._id} className="p-4 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold theme-text truncate">
                        {organizer.organizationName}
                      </p>

                      <p className="text-[11px] theme-subtext capitalize">
                        {organizer.organizationType?.replaceAll("_", " ")}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-full border text-[9px] font-bold capitalize shrink-0 ${getStatusClass(
                      organizer.verificationStatus,
                    )}`}
                  >
                    {organizer.verificationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider theme-subtext font-bold">
                      Representative
                    </p>

                    <p className="text-xs theme-text mt-1">
                      {organizer.representativeName || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider theme-subtext font-bold">
                      Email
                    </p>

                    <p className="text-xs theme-text mt-1 break-all">
                      {organizer.contactEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider theme-subtext font-bold">
                      Phone
                    </p>

                    <p className="text-xs theme-text mt-1">
                      {organizer.contactPhone || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider theme-subtext font-bold">
                      Joined
                    </p>

                    <p className="text-xs theme-text mt-1">
                      {formatDate(organizer.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleViewOrganizer(organizer._id)}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border theme-border theme-text hover:bg-rose-500/10 hover:text-rose-400 text-xs font-bold transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  View Organizer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {(selectedOrganizer || detailLoading) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="theme-card border theme-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {detailLoading ? (
              <div className="p-12 text-center">
                <p className="text-xs theme-subtext">
                  Loading organizer details...
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 p-5 md:p-6 border-b theme-border">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-lg font-bold theme-text truncate">
                        {selectedOrganizer.organizationName}
                      </h2>

                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[11px] theme-subtext capitalize">
                          {selectedOrganizer.organizationType?.replaceAll(
                            "_",
                            " ",
                          )}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full border text-[9px] font-bold capitalize ${getStatusClass(
                            selectedOrganizer.verificationStatus,
                          )}`}
                        >
                          {selectedOrganizer.verificationStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrganizer(null)}
                    className="p-2 rounded-lg theme-icon-box border theme-border theme-subtext hover:theme-text cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 md:p-6 overflow-y-auto max-h-[calc(90vh-150px)] space-y-5">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider theme-subtext mb-3">
                      Organization Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InfoCard
                        icon={Building2}
                        label="Organization Name"
                        value={selectedOrganizer.organizationName}
                      />

                      <InfoCard
                        icon={FileText}
                        label="Organization Type"
                        value={selectedOrganizer.organizationType?.replaceAll(
                          "_",
                          " ",
                        )}
                      />

                      <InfoCard
                        icon={MapPin}
                        label="Address"
                        value={selectedOrganizer.address}
                      />

                      <InfoCard
                        icon={FileText}
                        label="Description"
                        value={selectedOrganizer.description || "Not provided"}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider theme-subtext mb-3">
                      Representative Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InfoCard
                        icon={User}
                        label="Representative"
                        value={
                          selectedOrganizer.representativeName || "Not provided"
                        }
                      />

                      <InfoCard
                        icon={Mail}
                        label="Contact Email"
                        value={selectedOrganizer.contactEmail}
                      />

                      <InfoCard
                        icon={Phone}
                        label="Contact Phone"
                        value={selectedOrganizer.contactPhone || "Not provided"}
                      />

                      <InfoCard
                        icon={FileText}
                        label="Organizer ID"
                        value={selectedOrganizer.organizerId}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider theme-subtext mb-3">
                      KYC Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InfoCard
                        icon={CreditCard}
                        label="Aadhaar Number"
                        value={
                          selectedOrganizer.aadhaarNumber || "Not provided"
                        }
                      />

                      <InfoCard
                        icon={CreditCard}
                        label="PAN Number"
                        value={selectedOrganizer.panNumber || "Not provided"}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider theme-subtext mb-3">
                      Account Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InfoCard
                        icon={User}
                        label="User ID"
                        value={
                          typeof selectedOrganizer.userId === "object"
                            ? selectedOrganizer.userId?._id
                            : selectedOrganizer.userId
                        }
                      />

                      <InfoCard
                        icon={Mail}
                        label="User Email"
                        value={
                          typeof selectedOrganizer.userId === "object"
                            ? selectedOrganizer.userId?.email
                            : "Not available"
                        }
                      />

                      <InfoCard
                        icon={Calendar}
                        label="Created"
                        value={formatDate(selectedOrganizer.createdAt)}
                      />

                      <InfoCard
                        icon={Calendar}
                        label="Last Updated"
                        value={formatDate(selectedOrganizer.updatedAt)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    {selectedOrganizer.verificationStatus !== "verified" && (
                      <button
                        onClick={() =>
                          handleAction("verify", selectedOrganizer._id)
                        }
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verify Organizer
                      </button>
                    )}

                    {selectedOrganizer.verificationStatus !== "rejected" && (
                      <button
                        onClick={() =>
                          handleAction("reject", selectedOrganizer._id)
                        }
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    )}

                    {selectedOrganizer.verificationStatus !== "suspended" && (
                      <button
                        onClick={() =>
                          handleAction("suspend", selectedOrganizer._id)
                        }
                        disabled={actionLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="p-3.5 rounded-xl border theme-border theme-icon-box">
      <div className="flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />

        <p className="text-[10px] uppercase tracking-wider theme-subtext font-bold">
          {label}
        </p>
      </div>

      <p className="text-xs font-semibold theme-text mt-2 break-words">
        {value || "-"}
      </p>
    </div>
  );
}

