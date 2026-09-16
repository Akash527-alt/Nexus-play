import React, { useEffect, useState } from "react";
import {
  Handshake,
  ShieldCheck,
  ShieldAlert,
  Globe,
  DollarSign,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AdminTable } from "../../components/admin/AdminTable";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { ConfirmModal } from "../../components/admin/ConfirmModal";

export function SponsorsManagementPage() {
  const [sponsors, setSponsors] = useState([
    {
      id: "spn_01",
      companyName: "Razer Gaming Tech",
      industry: "Hardware & Peripherals",
      email: "partnerships@razer.com",
      website: "https://razer.com",
      budgetRange: "$25,000 - $50,000",
      totalInvested: 9750,
      activeDealsCount: 2,
      status: "verified",
      joinedDate: "2026-01-15",
    },
    {
      id: "spn_02",
      companyName: "Red Bull Energy India",
      industry: "Beverages & Lifestyle",
      email: "esports@in.redbull.com",
      website: "https://redbull.com",
      budgetRange: "$50,000+",
      totalInvested: 15000,
      activeDealsCount: 3,
      status: "verified",
      joinedDate: "2026-02-01",
    },
    {
      id: "spn_03",
      companyName: "Logitech G Series",
      industry: "Computer Peripherals",
      email: "sponsorships@logitechg.com",
      website: "https://logitechg.com",
      budgetRange: "$10,000 - $25,000",
      totalInvested: 4500,
      activeDealsCount: 1,
      status: "pending",
      joinedDate: "2026-03-10",
    },
    {
      id: "spn_04",
      companyName: "Monster Energy Global",
      industry: "Beverages",
      email: "partnerships@monsterenergy.com",
      website: "https://monsterenergy.com",
      budgetRange: "$30,000+",
      totalInvested: 12000,
      activeDealsCount: 2,
      status: "verified",
      joinedDate: "2026-02-18",
    },
  ]);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    isDestructive: false,
  });

  const handleUpdateStatus = (spn, nextStatus) => {
    const isDestructive = nextStatus === "suspended";
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus === "verified" ? "Verify" : "Suspend"} Sponsor`,
      message: `Change ${spn.companyName} corporate status to ${nextStatus}?`,
      isDestructive,
      confirmLabel: nextStatus === "verified" ? "Verify Sponsor" : "Suspend Account",
      action: () => {
        setSponsors((prev) =>
          prev.map((s) => (s.id === spn.id ? { ...s, status: nextStatus } : s))
        );
        toast.success(`${spn.companyName} is now ${nextStatus}`);
      },
    });
  };

  const columns = [
    {
      header: "Brand Partner",
      accessor: "companyName",
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 font-extrabold flex items-center justify-center text-xs">
            {s.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold theme-text leading-tight">{s.companyName}</p>
            <p className="text-[11px] theme-subtext">{s.industry}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Website & Contact",
      accessor: "email",
      render: (s) => (
        <div className="space-y-0.5">
          <a
            href={s.website}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
          >
            <Globe className="w-3 h-3" />
            <span>{s.website.replace("https://", "")}</span>
          </a>
          <p className="text-[11px] theme-subtext flex items-center gap-1">
            <Mail className="w-3 h-3" /> {s.email}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (s) => <StatusBadge status={s.status} size="sm" />,
    },
    {
      header: "Total Invested",
      accessor: "totalInvested",
      render: (s) => (
        <span className="font-bold text-emerald-400 text-xs">
          ${s.totalInvested.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Active Deals",
      accessor: "activeDealsCount",
      render: (s) => (
        <span className="text-xs font-semibold theme-text">
          {s.activeDealsCount} tournaments
        </span>
      ),
    },
    {
      header: "Governance Action",
      className: "text-right",
      render: (s) => (
        <div className="flex items-center justify-end gap-2">
          {s.status !== "verified" && (
            <button
              onClick={() => handleUpdateStatus(s, "verified")}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Verify</span>
            </button>
          )}

          {s.status !== "suspended" && (
            <button
              onClick={() => handleUpdateStatus(s, "suspended")}
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
        <h1 className="text-2xl font-bold theme-text">Corporate Sponsor Management</h1>
        <p className="text-xs md:text-sm theme-subtext">
          Audit registered brand sponsors, track total injected capital, and enforce commercial partnership compliance.
        </p>
      </div>

      <AdminTable
        columns={columns}
        data={sponsors}
        searchPlaceholder="Search sponsors by company name or industry..."
        searchKey="companyName"
      />

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

export default SponsorsManagementPage;
