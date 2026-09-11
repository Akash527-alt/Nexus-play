import React, { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export function AdminTable({
  columns = [],
  data = [],
  searchable = true,
  searchPlaceholder = "Search records...",
  searchKey = "name",
  emptyMessage = "No records found.",
  pageSize = 8,
}) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter((item) => {
    if (!search) return true;
    const val = item[searchKey];
    if (typeof val === "string") {
      return val.toLowerCase().includes(search.toLowerCase());
    }
    return JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="theme-input w-full pl-9 pr-4 py-2 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <span className="text-xs theme-subtext font-semibold hidden sm:inline-block">
            Showing {filteredData.length} records
          </span>
        </div>
      )}

      <div className="theme-card border theme-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b theme-border theme-header text-[10px] font-bold uppercase tracking-wider theme-subtext">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`p-3.5 ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="p-8 text-center theme-subtext">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIdx) => (
                  <tr
                    key={row.id || rowIdx}
                    className="theme-hover transition-colors"
                  >
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className={`p-3.5 ${col.className || ""}`}>
                        {col.render ? col.render(row) : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-3 border-t theme-border flex items-center justify-between text-xs theme-subtext">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border theme-border theme-hover disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-lg border theme-border theme-hover disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminTable;
