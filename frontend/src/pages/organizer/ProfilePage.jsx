import React, { useState, useEffect } from 'react';
import { Save, User, Building, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export function ProfilePage() {
  const [profile, setProfile] = useState({
    name: 'Hardik Gohil',
    email: 'hardik@nexusgaming.gg',
    organization: 'Nexus Gaming League',
    role: 'Frontend Developer',
    bio: 'Esports organizer and frontend developer dedicated to crafting seamless gaming tournament experiences.'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('organizer_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load profile:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!savedSuccess) return;
    const timer = setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [savedSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('organizer_profile', JSON.stringify(profile));
    setSavedSuccess(true);
  };

  const getInitials = (name) => {
    if (!name) return 'HG';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold theme-text">Organizer Profile</h1>
        <p className="text-sm theme-subtext">Manage your personal details, public info, and organizational role.</p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs px-4 py-3 rounded-xl font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile details updated successfully!</span>
        </div>
      )}

      {/* Profile Header Banner Card */}
      <div className="theme-card rounded-2xl border p-6 shadow-xs flex flex-col sm:flex-row items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-2xl shadow-md shrink-0">
          {getInitials(profile.name)}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-xl font-bold theme-text">{profile.name}</h2>
          <p className="text-xs font-semibold text-indigo-500">{profile.organization} • {profile.role}</p>
          <p className="text-xs theme-subtext">{profile.email}</p>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSave} className="theme-card rounded-2xl border p-6 shadow-xs space-y-6">
        <h2 className="text-sm font-bold theme-text border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-xs font-bold theme-subtext uppercase">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                id="name"
                type="text" 
                name="name" 
                value={profile.name} 
                onChange={handleChange} 
                className="theme-input w-full pl-9 pr-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Hardik Gohil"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold theme-subtext uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                id="email"
                type="email" 
                name="email" 
                value={profile.email} 
                onChange={handleChange} 
                className="theme-input w-full pl-9 pr-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="hardik@nexusgaming.gg"
              />
            </div>
          </div>

          {/* Organization */}
          <div className="space-y-1.5">
            <label htmlFor="organization" className="block text-xs font-bold theme-subtext uppercase">Organization</label>
            <div className="relative">
              <Building className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                id="organization"
                type="text" 
                name="organization" 
                value={profile.organization} 
                onChange={handleChange} 
                className="theme-input w-full pl-9 pr-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Nexus Gaming League"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label htmlFor="role" className="block text-xs font-bold theme-subtext uppercase">Role</label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                id="role"
                type="text" 
                name="role" 
                value={profile.role} 
                onChange={handleChange} 
                className="theme-input w-full pl-9 pr-3.5 py-2 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Frontend Developer"
              />
            </div>
          </div>

        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label htmlFor="bio" className="block text-xs font-bold theme-subtext uppercase">Bio / Overview</label>
          <textarea 
            id="bio"
            name="bio" 
            rows="3" 
            value={profile.bio} 
            onChange={handleChange} 
            className="theme-input w-full p-3 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
            placeholder="Tell us about yourself or your organization..."
          />
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end">
          <button 
            type="submit" 
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </div>

      </form>
    </div>
  );
}