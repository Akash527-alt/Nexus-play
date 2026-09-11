import React from "react";
import { AlertTriangle, ShieldAlert, X } from "lucide-react";

export function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to perform this action?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="theme-card border theme-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isDestructive
                  ? "bg-rose-500/15 text-rose-400"
                  : "bg-indigo-500/15 text-indigo-400"
              }`}
            >
              {isDestructive ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <ShieldAlert className="w-5 h-5" />
              )}
            </div>
            <h3 className="text-base font-bold theme-text">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg theme-subtext hover:theme-text transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs theme-subtext leading-relaxed">{message}</p>

        <div className="pt-3 flex items-center justify-end gap-2.5 border-t theme-border">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold theme-subtext hover:theme-text theme-hover transition cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow-md ${
              isDestructive
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/30"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
