import React, { useEffect, useState } from "react";
import {
  Trophy,
  Star,
  CheckCircle,
  XCircle,
  Trash2,
  Calendar,
  Users,
  Eye,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../services/adminService";
import { AdminTable } from "../../components/admin/AdminTable";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { ConfirmModal } from "../../components/admin/ConfirmModal";

export function TournamentsModerationPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

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
      const data = await adminService.getTournaments();
      setTournaments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFeatured = async (t) => {
    try {
      await adminService.toggleTournamentFeatured(t.id);
      toast.success(
        t.featured ? `Removed from homepage featured` : `Featured on homepage!`
      );
      loadData();
    } catch {
      toast.error("Failed to update featured state");
    }
  };

  const handleStatusChange = (t, nextStatus) => {
    const isDestructive = nextStatus === "suspended";
    setConfirmModal({
      isOpen: true,
      title: `${nextStatus === "published" ? "Approve" : "Suspend"} Tournament`,
      message: `Change '${t.title}' status to ${nextStatus}?`,
      isDestructive,
      confirmLabel: nextStatus === "published" ? "Approve Event" : "Suspend Event",
      action: async () => {
        const res = await adminService.updateTournamentStatus(t.id, nextStatus);
        if (res.success) {
          toast.success(`Tournament marked as ${nextStatus}`);
          loadData();
        }
      },
    });
  };

  const handleDelete = (t) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Tournament Record",
      message: `Permanently delete '${t.title}' from the platform database? This action cannot be undone.`,
      isDestructive: true,
      confirmLabel: "Delete Permanently",
      action: async () => {
        const res = await adminService.deleteTournament(t.id);
        if (res.success) {
          toast.success(`Tournament '${t.title}' deleted`);
          loadData();
        }
      },
    });
  };

  const filteredTournaments = tournaments.filter((t) => {
    return statusFilter === "all" || t.status === statusFilter;
  });

  const columns = [
    {
      header: "Tournament",
      accessor: "title",
      render: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-extrabold flex items-center justify-center text-xs">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold theme-text leading-tight line-clamp-1">{t.title}</p>
            <p className="text-[11px] theme-subtext">
              {t.game} · Host: <span className="font-semibold">{t.organizer}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Prize Pool",
      accessor: "prizePool",
      render: (t) => (
        <span className="font-bold text-amber-400 text-xs">
          ${Number(t.prizePool || 0).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (t) => <StatusBadge status={t.status} size="sm" />,
    },
    {
      header: "Featured",
      accessor: "featured",
      render: (t) => (
        <button
          onClick={() => handleToggleFeatured(t)}
          className={`p-1.5 rounded-lg border transition cursor-pointer ${
            t.featured
              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
              : "theme-icon-box border theme-border theme-subtext hover:text-amber-400"
          }`}
          title={t.featured ? "Unfeature" : "Feature on Homepage"}
        >
          <Star className="w-3.5 h-3.5" fill={t.featured ? "currentColor" : "none"} />
        </button>
      ),
    },
    {
      header: "Teams Cap",
      accessor: "teamsCount",
      render: (t) => (
        <span className="text-xs theme-subtext">
          {t.teamsCount} / {t.maxTeams || 32}
        </span>
      ),
    },
    {
      header: "Moderation Controls",
      className: "text-right",
      render: (t) => (
        <div className="flex items-center justify-end gap-2">
          {t.status === "pending" && (
            <button
              onClick={() => handleStatusChange(t, "published")}
              className="p-1.5 rounded-lg bg-emerald-600/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
              title="Approve Tournament"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {t.status !== "suspended" && (
            <button
              onClick={() => handleStatusChange(t, "suspended")}
              className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-600 hover:text-white transition cursor-pointer"
              title="Suspend Tournament"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => handleDelete(t)}
            className="p-1.5 rounded-lg bg-rose-600/15 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white transition cursor-pointer"
            title="Delete Tournament"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold theme-text">Platform Tournament Moderation</h1>
        <p className="text-xs md:text-sm theme-subtext">
          Audit event listings, approve pending tournaments, highlight featured showcases, and enforce competition guidelines.
        </p>
      </div>

      {/* Filter status tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["all", "published", "ongoing", "completed", "pending", "suspended"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
              statusFilter === st
                ? "bg-rose-600 text-white shadow-xs"
                : "theme-card border theme-border theme-subtext hover:theme-text"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs theme-subtext">Loading tournaments...</div>
      ) : (
        <AdminTable
          columns={columns}
          data={filteredTournaments}
          searchPlaceholder="Search tournaments by name, game, or host..."
          searchKey="title"
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

export default TournamentsModerationPage;
