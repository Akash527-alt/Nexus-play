import React, { useEffect, useState } from "react";
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
  XCircle,
  Phone,
  Mail,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../services/adminService";
import { AdminTable } from "../../components/admin/AdminTable";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { ConfirmModal } from "../../components/admin/ConfirmModal";

export function OrganizersManagementPage() {
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    isDestructive: false,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getOrganizers();
      setOrganizers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = (org, nextStatus) => {
    const isDestructive = nextStatus === "suspended";
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus === "verified" ? "Verify" : "Suspend"} Organizer`,
      message: `Change ${org.organizationName} compliance status to ${nextStatus}?`,
      isDestructive,
      confirmLabel: nextStatus === "verified" ? "Grant Verified Status" : "Suspend Org",
      action: async () => {
        const res = await adminService.updateOrganizerStatus(org.id, nextStatus);
        if (res.success) {
          toast.success(`${org.organizationName} is now ${nextStatus}`);
          loadData();
        }
      },
    });
  };

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
            <p className="font-bold theme-text leading-tight">{org.organizationName}</p>
            <p className="text-[11px] theme-subtext">{org.organizationType}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Contact Lead",
      accessor: "contactName",
      render: (org) => (
        <div>
          <p className="font-semibold theme-text leading-tight">{org.contactName}</p>
          <p className="text-[11px] theme-subtext flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3" /> {org.email}
          </p>
        </div>
      ),
    },
    {
      header: "Verification",
      accessor: "status",
      render: (org) => <StatusBadge status={org.status} size="sm" />,
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
      render: (org) => <span className="text-xs theme-subtext">{org.createdAt}</span>,
    },
    {
      header: "KYC Action",
      className: "text-right",
      render: (org) => (
        <div className="flex items-center justify-end gap-2">
          {org.status !== "verified" && (
            <button
              onClick={() => handleUpdateStatus(org, "verified")}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verify</span>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold theme-text">Tournament Organizers & KYC Oversight</h1>
        <p className="text-xs md:text-sm theme-subtext">
          Audit credentials, grant certified host badges, and govern host organizations on NexusPlay.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs theme-subtext">Loading organizers...</div>
      ) : (
        <AdminTable
          columns={columns}
          data={organizers}
          searchPlaceholder="Search organizers by org name or contact..."
          searchKey="organizationName"
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmLabel={confirmModal.confirmLabel}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.action}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

export default OrganizersManagementPage;
