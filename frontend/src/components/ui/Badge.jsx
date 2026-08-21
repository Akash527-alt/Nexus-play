import React from 'react';

export function Badge({ status }) {
  const styles = {
    Live: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Upcoming: "bg-blue-100 text-blue-800 border-blue-300",
    Completed: "bg-slate-100 text-slate-700 border-slate-300",
    Cancelled: "bg-rose-100 text-rose-800 border-rose-300",
    Draft: "bg-amber-100 text-amber-800 border-amber-300"
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${styles[status] || styles.Completed}`}>
      {status}
    </span>
  );
}