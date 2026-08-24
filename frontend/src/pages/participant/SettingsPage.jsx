import React from "react";
import { toast } from "sonner";

export const ParticipantSettingsPage = () => {
  return (
    <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Participant Settings</h2>
        <p className="text-xs text-slate-400">Configure payment UPI, notifications, and security choices.</p>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">Default UPI ID (for GPay Refunds/Prizes)</label>
          <input type="text" defaultValue="alex@upi" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500" />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs font-bold text-slate-200">Email Match Notifications</p>
            <p className="text-[10px] text-slate-400">Receive schedule and match reminders</p>
          </div>
          <input type="checkbox" defaultChecked className="toggle accent-indigo-600" />
        </div>

        <button onClick={() => toast.success("Settings saved successfully!")} className="mt-4 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition">
          Save Settings
        </button>
      </div>
    </div>
  );
};