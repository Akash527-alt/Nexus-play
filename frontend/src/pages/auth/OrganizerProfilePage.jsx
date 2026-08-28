import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  FileText,
  MapPin,
  Mail,
  Phone,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext";

export function OrganizerProfilePage() {
  const navigate = useNavigate();

  const { createOrganizerProfileData } = useAuth();

  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    description: "",
    address: "",
    contactEmail: "",
    contactPhone: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      organizationName,
      organizationType,
      description,
      address,
      contactEmail,
      contactPhone,
    } = formData;

    if (
      !organizationName ||
      !organizationType ||
      !description ||
      !address ||
      !contactEmail ||
      !contactPhone
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const data = await createOrganizerProfileData(formData);

      console.log("Organizer profile response:", data);

      if (!data?.success) {
        toast.error(data?.message || "Unable to create organization profile");
        return;
      }

      toast.success("Organization profile completed successfully");

      navigate("/organizer/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.error("Organizer profile error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to create organization profile",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B1A] text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-600/20">
            <Building2 className="w-7 h-7" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            Nexus<span className="text-indigo-500">Play</span>
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Tell us about your organization
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0D1326] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-7">
            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-indigo-600" />
            </div>

            <div className="flex-1">
              <div className="h-1.5 rounded-full bg-indigo-600" />
            </div>
          </div>

          <div className="mb-7">
            <h2 className="text-xl font-bold">Organization Details</h2>

            <p className="text-sm text-slate-400 mt-1">
              Step 2 of 2 — Complete your organizer profile
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Organization Name */}
            <div>
              <label
                htmlFor="organizationName"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Organization Name
              </label>

              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={handleChange}
                  placeholder="e.g. Nexus Gaming Cafe"
                  className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Organization Type */}
            <div>
              <label
                htmlFor="organizationType"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Organization Type
              </label>

              <select
                id="organizationType"
                name="organizationType"
                value={formData.organizationType}
                onChange={handleChange}
                className="w-full bg-[#080D1D] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select organization type</option>
                <option value="college">College</option>
                <option value="gaming_cafe">Gaming Cafe</option>
                <option value="company">Company</option>
                <option value="sports_club">Sports Club</option>
                <option value="content_creator">Content Creator</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Description
              </label>

              <div className="relative">
                <FileText className="absolute left-3 top-3 w-4 h-4 text-slate-500" />

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us briefly about your organization"
                  rows={4}
                  className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-slate-300 mb-2"
              >
                Address
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Organization address"
                  rows={3}
                  className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Contact Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                  <input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                    className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contactPhone"
                  className="block text-sm font-medium text-slate-300 mb-2"
                >
                  Contact Phone
                </label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />

                  <input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full bg-[#080D1D] border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl py-3 text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating profile...
                </>
              ) : (
                "Complete Organizer Registration"
              )}
            </button>
          </form>

        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © {new Date().getFullYear()} NexusPlay Esports
        </p>
      </div>
    </div>
  );
}
