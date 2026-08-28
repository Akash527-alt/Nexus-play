import React, { useState } from "react";
import { toast } from "sonner";

export const ParticipantProfilePage = () => {
  const [profile, setProfile] = useState({
    name: "Alex Student",
    gamerTag: "#ALEX_NEXUS",
    email: "alex.student@college.edu",
    college: "National Institute of Tech",
    upiId: "alex@upi",
    games: ["Valorant", "BGMI"],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile, gamesInput: profile.games.join(", ") });

  const handleSave = (e) => {
    e.preventDefault();
    const gamesArr = formData.gamesInput.split(",").map((g) => g.trim()).filter(Boolean);
    setProfile({
      ...formData,
      games: gamesArr,
    });
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner Box */}
      <div className="theme-card border theme-border p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-xs w-full">
        <div className="h-20 w-20 bg-indigo-600 border-2 border-indigo-400 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-md shrink-0">
          {profile.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-xl font-extrabold theme-text">{profile.name}</h2>
          <p className="text-xs theme-subtext mt-0.5">
            Gamer Tag: <span className="text-indigo-500 font-semibold">{profile.gamerTag}</span> • Verified Student Player
          </p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
            {profile.games.map((game, i) => (
              <span key={i} className="text-[10px] theme-icon-box theme-text px-2.5 py-1 rounded-md border theme-border font-medium">
                {game}
              </span>
            ))}
            <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded-md border border-indigo-500/20 font-bold">
              450 XP
            </span>
          </div>
        </div>
        <button 
          onClick={() => {
            setFormData({ ...profile, gamesInput: profile.games.join(", ") });
            setIsEditing(true);
          }} 
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-sm whitespace-nowrap">
          Edit Profile
        </button>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="theme-card border theme-border p-5 rounded-2xl space-y-3 shadow-xs">
          <h3 className="text-sm font-bold theme-text border-b theme-border pb-2">Personal Info</h3>
          <div className="text-xs theme-subtext space-y-2">
            <p><strong className="theme-text">Email:</strong> {profile.email}</p>
            <p><strong className="theme-text">College:</strong> {profile.college}</p>
            <p><strong className="theme-text">Default UPI:</strong> {profile.upiId}</p>
          </div>
        </div>
        
        <div className="theme-card border theme-border p-5 rounded-2xl space-y-3 shadow-xs">
          <h3 className="text-sm font-bold theme-text border-b theme-border pb-2">Tournament Overview</h3>
          <div className="text-xs theme-subtext space-y-2">
            <p><strong className="theme-text">Played:</strong> 12 Events</p>
            <p><strong className="theme-text">Win Rate:</strong> 66%</p>
            <p><strong className="theme-text">Total Earnings:</strong> ₹4,500</p>
          </div>
        </div>
      </div>

      {/* Dynamic Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="theme-card border theme-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b theme-border pb-3">
              <h3 className="text-base font-bold theme-text">Edit Player Profile</h3>
              <button onClick={() => setIsEditing(false)} className="theme-subtext text-sm hover:theme-text">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold theme-text mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full theme-input border rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold theme-text mb-1">Gamer Tag</label>
                <input 
                  type="text" 
                  value={formData.gamerTag} 
                  onChange={(e) => setFormData({ ...formData, gamerTag: e.target.value })}
                  className="w-full theme-input border rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold theme-text mb-1">College / Institute</label>
                <input 
                  type="text" 
                  value={formData.college} 
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className="w-full theme-input border rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold theme-text mb-1">Default UPI ID</label>
                <input 
                  type="text" 
                  value={formData.upiId} 
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  className="w-full theme-input border rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold theme-text mb-1">Primary Games (comma separated)</label>
                <input 
                  type="text" 
                  value={formData.gamesInput} 
                  onChange={(e) => setFormData({ ...formData, gamesInput: e.target.value })}
                  className="w-full theme-input border rounded-xl p-2.5 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t theme-border">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 theme-border border rounded-xl theme-subtext theme-hover">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};