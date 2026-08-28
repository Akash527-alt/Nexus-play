import React from "react";
import { toast } from "sonner";
import { useTheme } from "../../context/ThemeContext";

export const ParticipantSettingsPage = () => {
  const { theme, setThemeMode } = useTheme();

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold theme-text">Account Settings</h2>
        <p className="text-xs theme-subtext mt-1">
          Manage your theme preferences, payment details, and notifications.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance / Theme Options */}
        <div className="theme-card border theme-border p-6 rounded-2xl space-y-4 shadow-xs">
          <h3 className="text-sm font-bold theme-text border-b theme-border pb-3">
            Appearance & Theme
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* Dark Mode Card */}
            <button
              type="button"
              onClick={() => setThemeMode("dark")}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                theme === "dark"
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "theme-border hover:border-indigo-500/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">🌙</span>
                {theme === "dark" && (
                  <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold theme-text">Dark Mode</p>
                <p className="text-[10px] theme-subtext mt-0.5">
                  Esports arena style layout with high contrast dark tones.
                </p>
              </div>
            </button>

            {/* Light Mode Card */}
            <button
              type="button"
              onClick={() => setThemeMode("light")}
              className={`p-4 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                theme === "light"
                  ? "border-indigo-500 bg-indigo-500/10"
                  : "theme-border hover:border-indigo-500/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">☀️</span>
                {theme === "light" && (
                  <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold theme-text">Light Mode</p>
                <p className="text-[10px] theme-subtext mt-0.5">
                  Clean light theme for bright environment readability.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="theme-card border theme-border p-6 rounded-2xl space-y-4 shadow-xs">
          <h3 className="text-sm font-bold theme-text border-b theme-border pb-3">
            Payments & Wallet
          </h3>
          <div>
            <label className="block text-xs font-bold theme-text mb-1">
              Default UPI ID (For Prize Money & Refunds)
            </label>
            <input
              type="text"
              defaultValue="alex@upi"
              className="w-full theme-card border theme-border rounded-xl p-2.5 text-xs theme-text focus:outline-none focus:border-indigo-500"
              placeholder="e.g. username@upi"
            />
          </div>
        </div>

        {/* Notifications */}
        <div className="theme-card border theme-border p-6 rounded-2xl space-y-4 shadow-xs">
          <h3 className="text-sm font-bold theme-text border-b theme-border pb-3">
            Notifications
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold theme-text">Match Reminders</p>
              <p className="text-[10px] theme-subtext">
                Get notified before your registered tournament match begins.
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-bold theme-text">Tournament Updates</p>
              <p className="text-[10px] theme-subtext">
                Receive email announcements from organizers.
              </p>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md"
          >
            Save Preference Settings
          </button>
        </div>
      </form>
    </div>
  );
};