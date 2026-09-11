import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Edit,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../services/adminService";
import { AdminTable } from "../../components/admin/AdminTable";
import { StatusBadge } from "../../components/admin/StatusBadge";
import { ConfirmModal } from "../../components/admin/ConfirmModal";

export function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    isDestructive: false,
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = (user) => {
    const isSuspending = user.status === "active";
    setConfirmModal({
      isOpen: true,
      title: isSuspending ? "Suspend User Account" : "Reactivate User Account",
      message: isSuspending
        ? `Are you sure you want to suspend ${user.name}? They will be locked out from competing and logging in.`
        : `Reactivate account for ${user.name}? Their platform permissions will be restored.`,
      isDestructive: isSuspending,
      confirmLabel: isSuspending ? "Suspend User" : "Reactivate",
      action: async () => {
        const nextStatus = isSuspending ? "suspended" : "active";
        const res = await adminService.updateUserStatus(user.id, nextStatus);
        if (res.success) {
          toast.success(`User ${user.name} is now ${nextStatus}`);
          loadUsers();
        }
      },
    });
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      const res = await adminService.updateUserRole(user.id, newRole);
      if (res.success) {
        toast.success(`Updated ${user.name}'s role to ${newRole}`);
        loadUsers();
      }
    } catch {
      toast.error("Failed to update user role");
    }
  };

  const filteredUsers = users.filter((u) => {
    return roleFilter === "all" || u.role === roleFilter;
  });

  const columns = [
    {
      header: "User Identity",
      accessor: "name",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 font-extrabold flex items-center justify-center text-xs">
            {u.avatar || u.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold theme-text leading-tight">{u.name}</p>
            <p className="text-[11px] theme-subtext">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      render: (u) => (
        <select
          value={u.role}
          onChange={(e) => handleRoleChange(u, e.target.value)}
          className="theme-input px-2 py-1 text-[11px] font-bold rounded-lg border theme-border outline-none cursor-pointer"
        >
          <option value="user">Participant (user)</option>
          <option value="organizer">Organizer</option>
          <option value="sponsor">Sponsor</option>
          <option value="superadmin">Super Admin</option>
        </select>
      ),
    },
    {
      header: "Account Status",
      accessor: "status",
      render: (u) => <StatusBadge status={u.status} size="sm" />,
    },
    {
      header: "Joined Date",
      accessor: "joinedDate",
      render: (u) => (
        <span className="text-xs theme-subtext font-medium">{u.joinedDate || "2026"}</span>
      ),
    },
    {
      header: "Tournaments",
      accessor: "tournamentsJoined",
      render: (u) => (
        <span className="text-xs font-semibold theme-text">
          {u.tournamentsJoined || 0} entered
        </span>
      ),
    },
    {
      header: "Governance Actions",
      className: "text-right",
      render: (u) => (
        <div className="flex items-center justify-end gap-2">
          {u.role !== "superadmin" && (
            <button
              onClick={() => handleToggleStatus(u)}
              className={`p-1.5 rounded-lg border transition cursor-pointer text-xs font-semibold ${
                u.status === "active"
                  ? "border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                  : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              }`}
              title={u.status === "active" ? "Suspend Account" : "Reactivate Account"}
            >
              {u.status === "active" ? (
                <UserX className="w-3.5 h-3.5" />
              ) : (
                <UserCheck className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold theme-text">Platform User Directory</h1>
        <p className="text-xs md:text-sm theme-subtext">
          Search, audit, and regulate user privileges, roles, and suspension states across all roles.
        </p>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["all", "user", "organizer", "sponsor", "superadmin"].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
              roleFilter === r
                ? "bg-rose-600 text-white shadow-xs"
                : "theme-card border theme-border theme-subtext hover:theme-text"
            }`}
          >
            {r === "all" ? "All Platform Users" : r}
          </button>
        ))}
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="p-12 text-center text-xs theme-subtext">Loading user records...</div>
      ) : (
        <AdminTable
          columns={columns}
          data={filteredUsers}
          searchPlaceholder="Search users by name, email, or role..."
          searchKey="name"
        />
      )}

      {/* Confirm Modal */}
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

export default UsersManagementPage;
