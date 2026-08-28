import React, { useState, useEffect } from 'react';
import { Save, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    emailAlerts: true,
    autoApproveTeams: false,
    publicProfile: true,
    timezone: 'Asia/Kolkata (GMT+5:30)'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('organizer_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse settings:', e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('organizer_settings', JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold theme-text">Platform Settings</h1>
        <p className="text-sm theme-subtext">Configure interface appearance, notifications, and preferences.</p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-700 text-xs px-4 py-3 rounded-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="theme-card rounded-2xl border p-6 shadow-xs space-y-6">
        
        {/* Appearance */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold theme-text border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
            Appearance
          </h2>
          <div>
            <p className="text-sm font-semibold theme-text">Interface Theme</p>
            <p className="text-xs theme-subtext mb-3">Choose your preferred portal design mode.</p>
            
            <div className="grid grid-cols-2 gap-4 max-w-sm">
              <button
                type="button"
                onClick={() => toggleTheme('light')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-600 ring-2 ring-indigo-500/20'
                    : 'theme-hover theme-text'
                }`}
                style={{ borderColor: theme === 'light' ? '#4f46e5' : 'var(--border-color)' }}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                Light Mode
              </button>

              <button
                type="button"
                onClick={() => toggleTheme('dark')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-indigo-500 bg-indigo-950/40 text-indigo-400 ring-2 ring-indigo-500/20'
                    : 'theme-hover theme-text'
                }`}
                style={{ borderColor: theme === 'dark' ? '#6366f1' : 'var(--border-color)' }}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                Dark Mode
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-3 border-t pt-4" style={{ borderColor: 'var(--border-color)' }}>
          <h2 className="text-sm font-bold theme-text border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
            Notifications
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold theme-text">Email Notifications</p>
              <p className="text-xs theme-subtext">Receive instant alerts when new teams register.</p>
            </div>
            <input 
              type="checkbox" 
              checked={settings.emailAlerts} 
              onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })} 
              className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleSave} 
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-xs cursor-pointer transition-colors"
        >
          <Save className="w-4 h-4" /> Save Preferences
        </button>
      </div>
    </div>
  );
}