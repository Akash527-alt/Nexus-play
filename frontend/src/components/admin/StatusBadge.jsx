import React from "react";

export function StatusBadge({ status, size = "md" }) {
  const norm = (status || "").toLowerCase();

  let styles = "bg-slate-500/15 text-slate-400 border-slate-500/30";

  if (
    norm === "active" ||
    norm === "verified" ||
    norm === "success" ||
    norm === "completed" ||
    norm === "published"
  ) {
    styles = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  } else if (norm === "ongoing" || norm === "approved") {
    styles = "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
  } else if (norm === "pending" || norm === "review") {
    styles = "bg-amber-500/15 text-amber-400 border-amber-500/30";
  } else if (norm === "suspended" || norm === "failed" || norm === "banned" || norm === "rejected") {
    styles = "bg-rose-500/15 text-rose-400 border-rose-500/30";
  } else if (norm === "refunded") {
    styles = "bg-purple-500/15 text-purple-400 border-purple-500/30";
  }

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border uppercase tracking-wider ${styles} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{status || "Unknown"}</span>
    </span>
  );
}

export default StatusBadge;
