import React, { useEffect, useState } from "react";
import { Building2, Globe, Mail, Phone, Save, Sparkles, DollarSign, Gamepad2 } from "lucide-react";
import { toast } from "sonner";
import { sponsorService } from "../../services/sponsorService";

export function SponsorProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await sponsorService.getProfile();
        setProfile(data);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await sponsorService.updateProfile(profile);
      if (res.success) {
        toast.success("Sponsor profile updated successfully!");
      }
    } catch {
      toast.error("Failed to update sponsor profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-xs theme-subtext">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold theme-text">Corporate Sponsor Profile</h1>
        <p className="text-xs md:text-sm theme-subtext">
          Manage your brand identity, contact channels, and esports sponsorship preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Overview Card */}
        <div className="theme-card border theme-border rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold flex items-center justify-center text-xl shadow-md">
              {profile?.companyName?.slice(0, 2).toUpperCase() || "SP"}
            </div>
            <div>
              <h2 className="text-lg font-bold theme-text">{profile?.companyName || "Sponsor Company"}</h2>
              <p className="text-xs theme-subtext flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Verified Commercial Partner</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t theme-border">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={profile?.companyName || ""}
                onChange={handleChange}
                className="theme-input w-full p-2.5 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
                Industry Sector
              </label>
              <input
                type="text"
                name="industry"
                value={profile?.industry || ""}
                onChange={handleChange}
                placeholder="e.g. Gaming Hardware, Energy Drinks, Fintech"
                className="theme-input w-full p-2.5 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
                Website URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="website"
                  value={profile?.website || ""}
                  onChange={handleChange}
                  placeholder="https://yourbrand.com"
                  className="theme-input w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
                Quarterly Budget Range
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="budgetRange"
                  value={profile?.budgetRange || ""}
                  onChange={handleChange}
                  placeholder="e.g. $25,000 - $50,000"
                  className="theme-input w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
              Brand Bio & Mission
            </label>
            <textarea
              name="description"
              rows={3}
              value={profile?.description || ""}
              onChange={handleChange}
              placeholder="Tell tournament organizers about your brand values and goals..."
              className="theme-input w-full p-3 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>
        </div>

        {/* Contact Channels */}
        <div className="theme-card border theme-border rounded-2xl p-6 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold theme-text">Direct Point of Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
                Partnership Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={profile?.email || ""}
                  onChange={handleChange}
                  className="theme-input w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider theme-subtext mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="phone"
                  value={profile?.phone || ""}
                  onChange={handleChange}
                  className="theme-input w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border theme-border outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default SponsorProfilePage;
