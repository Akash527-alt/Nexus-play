import React, { useEffect, useState } from "react";
import { Settings, Save, AlertTriangle, ShieldCheck, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "../../services/adminService";

export function PlatformSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await adminService.getSettings();
        setSettings(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await adminService.updateSettings(settings);
      toast.success("Platform settings updated successfully!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs theme-subtext">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold theme-text">Global Platform Governance Settings</h1>
        <p className="text-xs md:text-sm theme-subtext">
          Control system-wide operational parameters, revenue commissions, and registration switches.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Switches */}
        <div className="theme-card border theme-border rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider theme-subtext mb-2">
            Operational Kill-Switches
          </h2>

          <div className="flex items-center justify-between p-3.5 rounded-xl border theme-border theme-icon-box">
            <div>
              <p className="font-bold theme-text text-xs">Emergency Maintenance Mode</p>
              <p className="text-[11px] theme-subtext">
                When enabled, non-admin users see a maintenance screen and tournament registrations pause.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("maintenanceMode")}
              className={`p-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                settings?.maintenanceMode
                  ? "bg-rose-600 text-white"
                  : "theme-card border theme-border theme-subtext"
              }`}
            >
              {settings?.maintenanceMode ? (
                <>
                  <ToggleRight className="w-5 h-5 text-white" />
                  <span>ACTIVE</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  <span>OFF</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border theme-border theme-icon-box">
            <div>
              <p className="font-bold theme-text text-xs">Allow New User Registrations</p>
              <p className="text-[11px] theme-subtext">
                Permit new participants and students to create accounts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("allowRegistrations")}
              className={`p-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                settings?.allowRegistrations
                  ? "bg-emerald-600 text-white"
                  : "theme-card border theme-border theme-subtext"
              }`}
            >
              {settings?.allowRegistrations ? (
                <>
                  <ToggleRight className="w-5 h-5 text-white" />
                  <span>OPEN</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  <span>CLOSED</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl border theme-border theme-icon-box">
            <div>
              <p className="font-bold theme-text text-xs">Allow Organizer Applications</p>
              <p className="text-[11px] theme-subtext">
                Permit third-party clubs to register and submit organizer profiles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle("allowOrganizerApplications")}
              className={`p-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                settings?.allowOrganizerApplications
                  ? "bg-emerald-600 text-white"
                  : "theme-card border theme-border theme-subtext"
              }`}
            >
              {settings?.allowOrganizerApplications ? (
                <>
                  <ToggleRight className="w-5 h-5 text-white" />
                  <span>OPEN</span>
                </>
              ) : (
                <>
                  <ToggleLeft className="w-5 h-5" />
                  <span>CLOSED</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Financial & Fee Rules */}
        <div className="theme-card border theme-border rounded-2xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider theme-subtext mb-2">
            Financial & Fee Configuration
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
                Platform Commission Fee (%)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                name="platformCommissionPercent"
                value={settings?.platformCommissionPercent || 5}
                onChange={handleChange}
                className="theme-input w-full p-2.5 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-rose-500/20"
              />
              <p className="text-[11px] theme-subtext mt-1">
                Deducted automatically from tournament entry pools and sponsorships.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
                Escrow Payout Hold Duration (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                name="payoutHoldDays"
                value={settings?.payoutHoldDays || 3}
                onChange={handleChange}
                className="theme-input w-full p-2.5 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-rose-500/20"
              />
              <p className="text-[11px] theme-subtext mt-1">
                Number of days prize pools are held in escrow after tournament finals for dispute resolution.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Platform Configuration"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlatformSettingsPage;
