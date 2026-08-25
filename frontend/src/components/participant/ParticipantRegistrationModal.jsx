import React, { useState } from 'react';
import { X, ShieldCheck, UserCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function ParticipantRegistrationModal({ tournament, isOpen, onClose }) {
  if (!isOpen || !tournament) return null;

  const isTeamEvent = (tournament.teamSize || 1) > 1;

  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    captainEmail: '',
    captainPhone: '',
    captainInGameId: '',
    discordTag: '',
    players: Array.from({ length: Math.max(0, (tournament.teamSize || 1) - 1) }, (_, i) => ({
      name: '',
      inGameId: '',
      role: 'Starter'
    })),
    // Undertakings & Responsibilities Checkboxes
    agreedToRules: false,
    agreedToAntiCheat: false,
    agreedToConductCode: false,
    agreedToMediaConsent: false,
    agreedToAgeEligibility: false,
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...formData.players];
    updatedPlayers[index][field] = value;
    setFormData((prev) => ({ ...prev, players: updatedPlayers }));
  };

  const validate = () => {
    const newErrors = {};

    if (isTeamEvent && !formData.teamName.trim()) {
      newErrors.teamName = 'Squad / Team Name is required.';
    }

    if (!formData.captainName.trim()) newErrors.captainName = 'Full Name is required.';
    if (!formData.captainEmail.trim() || !/\S+@\S+\.\S+/.test(formData.captainEmail)) {
      newErrors.captainEmail = 'Valid email is required.';
    }
    if (!formData.captainPhone.trim() || formData.captainPhone.length < 10) {
      newErrors.captainPhone = 'Valid 10-digit mobile number is required.';
    }
    if (!formData.captainInGameId.trim()) {
      newErrors.captainInGameId = 'In-Game ID / IGN is required for match room invites.';
    }
    if (!formData.discordTag.trim()) {
      newErrors.discordTag = 'Discord handle is required for coordinator contact.';
    }

    // Validate Teammates
    if (isTeamEvent) {
      formData.players.forEach((p, idx) => {
        if (!p.name.trim() || !p.inGameId.trim()) {
          newErrors[`player_${idx}`] = `Player ${idx + 2} name and IGN are required.`;
        }
      });
    }

    // Validate Undertakings
    if (!formData.agreedToRules) newErrors.agreedToRules = 'You must accept the tournament rules.';
    if (!formData.agreedToAntiCheat) newErrors.agreedToAntiCheat = 'Anti-cheat declaration is mandatory.';
    if (!formData.agreedToConductCode) newErrors.agreedToConductCode = 'Code of conduct agreement is mandatory.';
    if (!formData.agreedToMediaConsent) newErrors.agreedToMediaConsent = 'Media broadcast consent is required.';
    if (!formData.agreedToAgeEligibility) newErrors.agreedToAgeEligibility = 'Eligibility declaration is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error('Please complete all required fields and accept all undertakings.');
      return;
    }

    toast.success(`Successfully registered for ${tournament.title}! Check email for confirmation.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="theme-card border theme-border w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b theme-border flex items-center justify-between bg-indigo-600/10">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase">
              Official Entry Form
            </span>
            <h2 className="text-xl font-bold theme-text">{tournament.title}</h2>
            <p className="text-xs theme-subtext mt-0.5">
              {tournament.game} • {isTeamEvent ? `Squad (${tournament.teamSize} Players)` : 'Solo Player'} • Fee: {tournament.entryFee ? `₹${tournament.entryFee}` : 'Free'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Section 1: Captain / Solo Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm theme-text flex items-center gap-2 border-b theme-border pb-2">
              <UserCheck className="w-4 h-4 text-indigo-500" />
              1. {isTeamEvent ? 'Team Captain Details' : 'Player Information'}
            </h3>

            {isTeamEvent && (
              <div>
                <label className="block font-semibold theme-subtext mb-1">Squad / Team Name *</label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  placeholder="e.g. Velocity Gaming"
                  className={`theme-input w-full px-3 py-2 border rounded-lg outline-none ${errors.teamName ? 'border-rose-500' : ''}`}
                />
                {errors.teamName && <p className="text-rose-500 text-[11px] mt-0.5">{errors.teamName}</p>}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold theme-subtext mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  name="captainName"
                  value={formData.captainName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`theme-input w-full px-3 py-2 border rounded-lg outline-none ${errors.captainName ? 'border-rose-500' : ''}`}
                />
                {errors.captainName && <p className="text-rose-500 text-[11px] mt-0.5">{errors.captainName}</p>}
              </div>

              <div>
                <label className="block font-semibold theme-subtext mb-1">In-Game ID (IGN + Tag) *</label>
                <input
                  type="text"
                  name="captainInGameId"
                  value={formData.captainInGameId}
                  onChange={handleInputChange}
                  placeholder="e.g. TenZ#NA1"
                  className={`theme-input w-full px-3 py-2 border rounded-lg outline-none ${errors.captainInGameId ? 'border-rose-500' : ''}`}
                />
                {errors.captainInGameId && <p className="text-rose-500 text-[11px] mt-0.5">{errors.captainInGameId}</p>}
              </div>

              <div>
                <label className="block font-semibold theme-subtext mb-1">Email Address *</label>
                <input
                  type="email"
                  name="captainEmail"
                  value={formData.captainEmail}
                  onChange={handleInputChange}
                  placeholder="captain@esports.com"
                  className={`theme-input w-full px-3 py-2 border rounded-lg outline-none ${errors.captainEmail ? 'border-rose-500' : ''}`}
                />
                {errors.captainEmail && <p className="text-rose-500 text-[11px] mt-0.5">{errors.captainEmail}</p>}
              </div>

              <div>
                <label className="block font-semibold theme-subtext mb-1">Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  name="captainPhone"
                  value={formData.captainPhone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  className={`theme-input w-full px-3 py-2 border rounded-lg outline-none ${errors.captainPhone ? 'border-rose-500' : ''}`}
                />
                {errors.captainPhone && <p className="text-rose-500 text-[11px] mt-0.5">{errors.captainPhone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold theme-subtext mb-1">Discord Tag / Username *</label>
                <input
                  type="text"
                  name="discordTag"
                  value={formData.discordTag}
                  onChange={handleInputChange}
                  placeholder="username#1234 or gamer_tag"
                  className={`theme-input w-full px-3 py-2 border rounded-lg outline-none ${errors.discordTag ? 'border-rose-500' : ''}`}
                />
                {errors.discordTag && <p className="text-rose-500 text-[11px] mt-0.5">{errors.discordTag}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Team Members (If Team Event) */}
          {isTeamEvent && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm theme-text flex items-center gap-2 border-b theme-border pb-2">
                <UserCheck className="w-4 h-4 text-indigo-500" />
                2. Roster Details ({tournament.teamSize - 1} Teammates)
              </h3>

              <div className="space-y-3">
                {formData.players.map((p, idx) => (
                  <div key={idx} className="p-3 border theme-border rounded-xl space-y-2 bg-black/5 dark:bg-white/5">
                    <p className="font-bold theme-text text-xs">Player #{idx + 2}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Player Full Name"
                        value={p.name}
                        onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                        className="theme-input px-3 py-1.5 border rounded-lg outline-none"
                      />
                      <input
                        type="text"
                        placeholder="In-Game ID / IGN"
                        value={p.inGameId}
                        onChange={(e) => handlePlayerChange(idx, 'inGameId', e.target.value)}
                        className="theme-input px-3 py-1.5 border rounded-lg outline-none"
                      />
                    </div>
                    {errors[`player_${idx}`] && (
                      <p className="text-rose-500 text-[11px]">{errors[`player_${idx}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Responsibilities & Rules Notice */}
          <div className="space-y-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <h4 className="font-bold text-amber-500 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Participant Responsibilities
            </h4>
            <ul className="list-disc list-inside space-y-1 text-amber-600 dark:text-amber-300 text-[11px]">
              <li>Must check in 30 minutes prior to match schedule on official Discord.</li>
              <li>Responsible for stable internet connection, device hardware, and ping.</li>
              <li>Game recordings/screenshots of end-match results must be uploaded after every round.</li>
              <li>Unsportsmanlike behavior, toxicity, or map exploits will lead to instant disqualification.</li>
            </ul>
          </div>

          {/* Section 4: Legal Undertakings & Waivers */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm theme-text flex items-center gap-2 border-b theme-border pb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              3. Mandatory Legal Undertakings & Consent
            </h3>

            <div className="space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToRules"
                  checked={formData.agreedToRules}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="theme-subtext leading-relaxed">
                  I have read and agree to follow all official rules & tournament bracket guidelines.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToAntiCheat"
                  checked={formData.agreedToAntiCheat}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="theme-subtext leading-relaxed">
                  <strong>Anti-Cheat Undertaking:</strong> I declare that neither I nor my squad will use hacks, aimbots, scripts, or third-party modifications.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToConductCode"
                  checked={formData.agreedToConductCode}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="theme-subtext leading-relaxed">
                  <strong>Code of Conduct:</strong> I agree to maintain professional etiquette and abstain from hate speech, harassment, or match-fixing.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToMediaConsent"
                  checked={formData.agreedToMediaConsent}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="theme-subtext leading-relaxed">
                  <strong>Media Broadcast Waiver:</strong> I grant organizers rights to live-stream, record, and use my in-game avatar/IGN for tournament broadcasts & promotional material.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToAgeEligibility"
                  checked={formData.agreedToAgeEligibility}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="theme-subtext leading-relaxed">
                  <strong>Eligibility Undertaking:</strong> I confirm all registered players meet the age limit requirements for this game title.
                </span>
              </label>
            </div>
          </div>

          {/* Submission Footer */}
          <div className="pt-4 border-t theme-border flex items-center justify-between">
            <div>
              <p className="text-[11px] theme-subtext">Total Registration Fee</p>
              <p className="text-base font-bold theme-text">
                {tournament.entryFee ? `₹${tournament.entryFee}` : 'FREE ENTRY'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-bold theme-subtext hover:theme-text rounded-xl border theme-border cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Submit Registration
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}