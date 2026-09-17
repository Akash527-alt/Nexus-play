
import React, { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CalendarDays,
  Trophy,
  UserRound,
  CreditCard,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { adminService } from "../../services/adminService";
import { AdminTable } from "../../components/admin/AdminTable";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { ConfirmModal } from "../../components/admin/ConfirmModal";

export function OrganizersManagementPage() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "",
    action: null,
    isDestructive: false,
  });

  // =====================================================
  // LOAD ALL ORGANIZERS
  // =====================================================

  const loadData = async () => {
    try {
      setLoading(true);

      const data = await adminService.getOrganizers();

      const formattedOrganizers = (data || []).map((org) => ({
        ...org,

        id: org._id,

        contactName: org.userId?.name || org.representativeName || "N/A",

        email: org.contactEmail || org.userId?.email || "N/A",

        phone: org.contactPhone || "N/A",

        status: org.verificationStatus || "unknown",

        tournamentsHosted: org.tournamentsHosted || 0,

        createdAt: org.createdAt
          ? new Date(org.createdAt).toLocaleDateString()
          : "N/A",
      }));

      setOrganizers(formattedOrganizers);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load organizers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // =====================================================
  // LOAD SINGLE ORGANIZER DETAILS
  // =====================================================

  const handleViewDetails = async (organizer) => {
    try {
      setDetailsLoading(true);

      const data = await adminService.getOrganizerDetails(organizer.id);

      if (data.success) {
        setSelectedOrganizer(data.organizer);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load organizer details"
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // =====================================================
  // CLOSE DETAILS MODAL
  // =====================================================

  const closeDetailsModal = () => {
    setSelectedOrganizer(null);
  };

  // =====================================================
  // UPDATE ORGANIZER STATUS
  // =====================================================

  const handleUpdateStatus = (organizer, nextStatus) => {
    const isDestructive =
      nextStatus === "suspended" || nextStatus === "rejected";

    const actionLabels = {
      verified: "Verify Organizer",
      rejected: "Reject Organizer",
      suspended: "Suspend Organizer",
    };

    const confirmLabels = {
      verified: "Grant Verified Status",
      rejected: "Reject Organizer",
      suspended: "Suspend Organizer",
    };

    setConfirmModal({
      isOpen: true,

      title: actionLabels[nextStatus],

      message: `Change ${organizer.organizationName} status to ${nextStatus}?`,

      confirmLabel: confirmLabels[nextStatus],

      isDestructive,

      action: async () => {
        try {
          let response;

          if (nextStatus === "verified") {
            response = await adminService.verifyOrganizer(
              organizer._id
            );
          }

          if (nextStatus === "rejected") {
            response = await adminService.rejectOrganizer(
              organizer._id
            );
          }

          if (nextStatus === "suspended") {
            response = await adminService.suspendOrganizer(
              organizer._id
            );
          }

          if (response?.success) {
            toast.success(
              `${organizer.organizationName} is now ${nextStatus}`
            );

            setConfirmModal((prev) => ({
              ...prev,
              isOpen: false,
            }));

            setSelectedOrganizer(null);

            await loadData();
          }
        } catch (error) {
          toast.error(
            error?.response?.data?.message ||
              `Failed to ${nextStatus} organizer`
          );
        }
      },
    });
  };

  // =====================================================
  // TABLE COLUMNS
  // =====================================================

  const columns = [
    {
      header: "Organization Name",
      accessor: "organizationName",

      render: (org) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 font-extrabold flex items-center justify-center text-xs">
            <Building2 className="w-4 h-4" />
          </div>

          <div>
            <p className="font-bold theme-text leading-tight">
              {org.organizationName}
            </p>

            <p className="text-[11px] theme-subtext">
              {org.organizationType}
            </p>
          </div>
        </div>
      ),
    },

    {
      header: "Contact Lead",
      accessor: "contactName",

      render: (org) => (
        <div>
          <p className="font-semibold theme-text leading-tight">
            {org.contactName}
          </p>

          <p className="text-[11px] theme-subtext flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3" />
            {org.email}
          </p>
        </div>
      ),
    },

    {
      header: "Verification",
      accessor: "status",

      render: (org) => (
        <StatusBadge status={org.status} size="sm" />
      ),
    },

    {
      header: "Tournaments",
      accessor: "tournamentsHosted",

      render: (org) => (
        <span className="text-xs font-semibold theme-text flex items-center gap-1">
          <Trophy className="w-3 h-3 text-amber-400" />
          <span>{org.tournamentsHosted || 0} hosted</span>
        </span>
      ),
    },

    {
      header: "Registered Date",
      accessor: "createdAt",

      render: (org) => (
        <span className="text-xs theme-subtext">
          {org.createdAt}
        </span>
      ),
    },

    {
      header: "KYC Action",
      className: "text-right",

      render: (org) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleViewDetails(org)}
            className="flex items-center gap-1 px-2.5 py-1 bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review</span>
          </button>

          {org.status !== "verified" && (
            <button
              onClick={() => handleUpdateStatus(org, "verified")}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          )}

          {org.status !== "rejected" && (
            <button
              onClick={() => handleUpdateStatus(org, "rejected")}
              className="flex items-center gap-1 px-2.5 py-1 bg-orange-600/15 text-orange-400 border border-orange-500/30 hover:bg-orange-600 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          )}

          {org.status !== "suspended" && (
            <button
              onClick={() => handleUpdateStatus(org, "suspended")}
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-600/15 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Suspend</span>
            </button>
          )}
        </div>
      ),
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold theme-text">
          Tournament Organizers & KYC Oversight
        </h1>

        <p className="text-xs md:text-sm theme-subtext">
          Audit credentials, review organizer details, and govern host
          organizations on NexusPlay.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs theme-subtext">
          Loading organizers...
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={organizers}
          searchPlaceholder="Search organizers by org name or contact..."
          searchKey="organizationName"
        />
      )}

      {/* =====================================================
          ORGANIZER DETAILS MODAL
      ===================================================== */}

      {selectedOrganizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto theme-card border theme-border rounded-2xl shadow-2xl">
            {/* Modal Header */}

            <div className="flex items-center justify-between p-6 border-b theme-border">
              <div>
                <h2 className="text-xl font-bold theme-text">
                  Organizer KYC Review
                </h2>

                <p className="text-xs theme-subtext mt-1">
                  Review all submitted information before taking action.
                </p>
              </div>

              <button
                onClick={closeDetailsModal}
                className="p-2 rounded-lg theme-hover theme-text cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}

            <div className="p-6 space-y-6">
              {/* Organization Details */}

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-purple-400" />

                  <h3 className="font-bold theme-text">
                    Organization Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    label="Organization Name"
                    value={selectedOrganizer.organizationName}
                  />

                  <DetailItem
                    label="Organization Type"
                    value={selectedOrganizer.organizationType}
                  />

                  <DetailItem
                    label="Organizer ID"
                    value={selectedOrganizer.organizerId}
                  />

                  <DetailItem
                    label="Verification Status"
                    value={selectedOrganizer.verificationStatus}
                  />
                </div>

                <DetailItem
                  label="Description"
                  value={selectedOrganizer.description}
                  fullWidth
                />
              </section>

              {/* Contact Details */}

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <UserRound className="w-4 h-4 text-indigo-400" />

                  <h3 className="font-bold theme-text">
                    Contact Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    label="Account Holder"
                    value={selectedOrganizer.userId?.name}
                  />

                  <DetailItem
                    label="Representative Name"
                    value={selectedOrganizer.representativeName}
                  />

                  <DetailItem
                    label="Contact Email"
                    value={
                      selectedOrganizer.contactEmail ||
                      selectedOrganizer.userId?.email
                    }
                    icon={<Mail className="w-3.5 h-3.5" />}
                  />

                  <DetailItem
                    label="Contact Phone"
                    value={selectedOrganizer.contactPhone}
                    icon={<Phone className="w-3.5 h-3.5" />}
                  />
                </div>
              </section>

              {/* Address */}

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-rose-400" />

                  <h3 className="font-bold theme-text">
                    Registered Address
                  </h3>
                </div>

                <div className="rounded-xl border theme-border p-4">
                  <p className="text-sm theme-text whitespace-pre-wrap">
                    {selectedOrganizer.address || "Not provided"}
                  </p>
                </div>
              </section>

              {/* KYC Details */}

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />

                  <h3 className="font-bold theme-text">
                    KYC Documents
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailItem
                    label="Aadhaar Number"
                    value={selectedOrganizer.aadhaarNumber}
                    icon={<CreditCard className="w-3.5 h-3.5" />}
                  />

                  <DetailItem
                    label="PAN Number"
                    value={selectedOrganizer.panNumber}
                    icon={<FileText className="w-3.5 h-3.5" />}
                  />
                </div>

                <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
                  <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />

                  <p className="text-xs text-amber-300">
                    Verify that the submitted KYC information is valid
                    before granting organizer verification.
                  </p>
                </div>
              </section>

              {/* Dates */}

              <section>
                <div className="flex items-center gap-2 mb-3">
                  <CalendarDays className="w-4 h-4 text-cyan-400" />

                  <h3 className="font-bold theme-text">
                    Registration Information
                  </h3>
                </div>

                <DetailItem
                  label="Registered On"
                  value={
                    selectedOrganizer.createdAt
                      ? new Date(
                          selectedOrganizer.createdAt
                        ).toLocaleString()
                      : "Not available"
                  }
                />
              </section>
            </div>

            {/* Modal Footer */}

            <div className="flex flex-wrap items-center justify-end gap-3 p-6 border-t theme-border">
              <button
                onClick={closeDetailsModal}
                className="px-4 py-2 rounded-xl border theme-border theme-text text-xs font-bold theme-hover cursor-pointer"
              >
                Close
              </button>

              {selectedOrganizer.verificationStatus !== "verified" && (
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedOrganizer, "verified")
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify
                </button>
              )}

              {selectedOrganizer.verificationStatus !== "rejected" && (
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedOrganizer, "rejected")
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              )}

              {selectedOrganizer.verificationStatus !== "suspended" && (
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedOrganizer, "suspended")
                  }
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  Suspend
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Details Loading Indicator */}

      {detailsLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="flex items-center gap-2 rounded-xl theme-card border theme-border px-5 py-4">
            <Loader2 className="w-5 h-5 animate-spin theme-text" />

            <span className="text-sm theme-text">
              Loading organizer details...
            </span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.action}
        onClose={() =>
          setConfirmModal((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />
    </div>
  );
}

// =====================================================
// REUSABLE DETAIL ITEM
// =====================================================

function DetailItem({ label, value, icon, fullWidth = false }) {
  return (
    <div className={fullWidth ? "mt-4" : ""}>
      <p className="text-[11px] theme-subtext font-semibold mb-1">
        {label}
      </p>

      <div className="flex items-center gap-2 rounded-xl border theme-border p-3">
        {icon && (
          <span className="theme-subtext shrink-0">
            {icon}
          </span>
        )}

        <p className="text-sm theme-text break-all">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

export default OrganizersManagementPage;