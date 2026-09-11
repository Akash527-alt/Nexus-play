import React, { useEffect, useState } from "react";
import {
  CreditCard,
  DollarSign,
  Download,
  Calendar,
  ShieldCheck,
  Search,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../services/adminService";
import { AdminTable } from "../../components/admin/AdminTable";
import { StatusBadge } from "../../components/admin/StatusBadge";

export function PaymentsManagementPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getPayments();
      setPayments(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const exportCSV = () => {
    const headers = ["ID", "Transaction ID", "Type", "Entity", "Tournament", "Amount", "Method", "Status", "Date"];
    const rows = payments.map((p) => [
      p.id,
      p.transactionId,
      p.type,
      `"${p.entity}"`,
      `"${p.tournament}"`,
      p.amount,
      p.method,
      p.status,
      p.date,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nexusplay_payments_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Payments ledger exported to CSV");
  };

  const totalSuccessful = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    return statusFilter === "all" || p.status === statusFilter;
  });

  const columns = [
    {
      header: "Transaction Reference",
      accessor: "transactionId",
      render: (p) => (
        <div>
          <span className="font-mono font-bold theme-text text-xs">{p.transactionId}</span>
          <p className="text-[11px] theme-subtext">{p.type}</p>
        </div>
      ),
    },
    {
      header: "Entity / Source",
      accessor: "entity",
      render: (p) => (
        <div>
          <p className="font-semibold theme-text text-xs">{p.entity}</p>
          <p className="text-[11px] theme-subtext truncate max-w-xs">{p.tournament}</p>
        </div>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (p) => (
        <span className="font-black text-emerald-400 text-xs">
          ${p.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Payment Method",
      accessor: "method",
      render: (p) => (
        <span className="text-xs theme-subtext font-medium">{p.method}</span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (p) => <StatusBadge status={p.status} size="sm" />,
    },
    {
      header: "Timestamp",
      accessor: "date",
      render: (p) => (
        <span className="text-[11px] theme-subtext flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>{p.date}</span>
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold theme-text">Financial Ledger & Escrow Oversight</h1>
          <p className="text-xs md:text-sm theme-subtext">
            Audit tournament entry fee distributions, brand sponsorship injections, and prize payouts.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold theme-card border theme-border theme-text hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
        >
          <Download className="w-4 h-4 text-rose-400" />
          <span>Export Ledger (CSV)</span>
        </button>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
            Total Settled Volume
          </p>
          <p className="text-2xl font-black text-emerald-400 mt-2">
            ${totalSuccessful.toLocaleString()}
          </p>
          <p className="text-[11px] theme-subtext mt-0.5">Cleared through secure payment gateways</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
            Active Escrow Balance
          </p>
          <p className="text-2xl font-black text-indigo-400 mt-2">$23,200</p>
          <p className="text-[11px] theme-subtext mt-0.5">Held until tournament completion</p>
        </div>

        <div className="theme-card border theme-border rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider theme-subtext">
            Total Transactions
          </p>
          <p className="text-2xl font-black theme-text mt-2">{payments.length}</p>
          <p className="text-[11px] theme-subtext mt-0.5">Audit log entries recorded</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["all", "success", "pending", "refunded"].map((st) => (
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
        <div className="p-12 text-center text-xs theme-subtext">Loading financial records...</div>
      ) : (
        <AdminTable
          columns={columns}
          data={filteredPayments}
          searchPlaceholder="Search by transaction ID, tournament, or entity..."
          searchKey="transactionId"
        />
      )}
    </div>
  );
}

export default PaymentsManagementPage;
