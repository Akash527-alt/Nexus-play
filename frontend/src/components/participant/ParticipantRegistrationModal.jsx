import React, { useEffect, useState } from "react";
import {
  X,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "../../context/AuthContext";
import { participantService } from "../../services/participantService";

const createPlayer = () => ({
  fullName: "",
  gameUid: "",
  email: "",
  phone: "",
});

const getTeamSize = (tournament) => {
  if (tournament?.tournamentType?.toLowerCase() === "solo") {
    return 1;
  }

  const size = Number(tournament?.teamSize);

  return Number.isInteger(size) && size > 1 ? size : 0;
};

const createInitialFormData = (user, teammateCount) => ({
  teamName: "",
  captainName: user?.name || "",
  captainEmail: user?.email || "",
  captainPhone: "",
  captainInGameId: "",
  discordTag: "",
  players: Array.from({ length: teammateCount }, createPlayer),
  agreedToRules: false,
  agreedToAntiCheat: false,
  agreedToConductCode: false,
  agreedToMediaConsent: false,
  agreedToAgeEligibility: false,
  agreedToIdentityVerification: false,
  agreedToGuardianConsent: false,
  agreedToCaptainResponsibility: false,
});

export function ParticipantRegistrationModal({
  tournament,
  isOpen,
  onClose,
  onSuccess,
}) {
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const teamSize = getTeamSize(tournament);

  const isTeamEvent = tournament?.tournamentType?.toLowerCase() === "team";

  const teammateCount = isTeamEvent ? Math.max(teamSize - 1, 0) : 0;

  const createFormData = () => createInitialFormData(user, teammateCount);

  const [formData, setFormData] = useState(createFormData);

  useEffect(() => {
    if (!isOpen || !tournament || !user) {
      return;
    }

    setFormData(createInitialFormData(user, teammateCount));
    setErrors({});
  }, [
    isOpen,
    tournament?._id,
    tournament?.id,
    tournament?.teamSize,
    tournament?.tournamentType,
    user?._id,
  ]);

  if (!isOpen || !tournament) {
    return null;
  }

  const tournamentTitle = tournament.title || tournament.name || "Tournament";

  const entryFee = tournament.entryFee || tournament.registrationFee || 0;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: null,
      }));
    }
  };

  const handlePlayerChange = (index, field, value) => {
    setFormData((previous) => {
      const updatedPlayers = [...previous.players];

      updatedPlayers[index] = {
        ...updatedPlayers[index],
        [field]: value,
      };

      return {
        ...previous,
        players: updatedPlayers,
      };
    });

    if (errors[`player_${index}`]) {
      setErrors((previous) => ({
        ...previous,
        [`player_${index}`]: null,
      }));
    }
  };

  const validateRegistrationWindow = () => {
    const now = new Date();

    if (tournament.status !== "published") {
      toast.error("Registration is not available for this tournament.");
      return false;
    }

    if (
      tournament.registrationDeadline &&
      now >= new Date(tournament.registrationDeadline)
    ) {
      toast.error("Registration deadline has already passed.");
      return false;
    }

    if (tournament.startDate && now >= new Date(tournament.startDate)) {
      toast.error(
        "Registration is closed because the tournament has already started.",
      );
      return false;
    }

    return true;
  };

  const validate = () => {
    const newErrors = {};

    if (!user?._id) {
      newErrors.user = "You must be logged in to register.";
    }

    if (!teamSize || teamSize < 1) {
      newErrors.teamSize = "Invalid team size configured for this tournament.";
    }

    if (isTeamEvent && teamSize < 2) {
      newErrors.teamSize =
        "Invalid team size configured for this team tournament.";
    }

    if (!formData.teamName.trim()) {
      newErrors.teamName = isTeamEvent
        ? "Team / Clan name is required."
        : "Player / Clan name is required.";
    }

    if (!formData.captainName.trim()) {
      newErrors.captainName = "Full name is required.";
    }

    if (
      !formData.captainEmail.trim() ||
      !/\S+@\S+\.\S+/.test(formData.captainEmail.trim())
    ) {
      newErrors.captainEmail = "Valid email is required.";
    }

    const cleanedCaptainPhone = formData.captainPhone.replace(/\D/g, "");

    if (cleanedCaptainPhone.length !== 10) {
      newErrors.captainPhone = "Valid 10-digit mobile number is required.";
    }

    if (!formData.captainInGameId.trim()) {
      newErrors.captainInGameId = "In-Game ID / IGN is required.";
    }

    if (!formData.discordTag.trim()) {
      newErrors.discordTag = "Discord handle is required.";
    }

    if (isTeamEvent) {
      if (formData.players.length !== teammateCount) {
        newErrors.teamSize = `Exactly ${teammateCount} teammates are required.`;
      }

      formData.players.forEach((player, index) => {
        const isEmailValid = /\S+@\S+\.\S+/.test(player.email.trim());

        const cleanedPhone = player.phone.replace(/\D/g, "");

        if (
          !player.fullName.trim() ||
          !player.gameUid.trim() ||
          !player.email.trim() ||
          !isEmailValid ||
          cleanedPhone.length !== 10
        ) {
          newErrors[`player_${index}`] =
            `Teammate ${index + 1} must have a valid name, IGN, email and 10-digit phone number.`;
        }
      });
    }

    if (!formData.agreedToRules) {
      newErrors.agreedToRules = "You must accept the tournament rules.";
    }

    if (!formData.agreedToAntiCheat) {
      newErrors.agreedToAntiCheat = "Anti-cheat declaration is mandatory.";
    }

    if (!formData.agreedToConductCode) {
      newErrors.agreedToConductCode = "Code of conduct agreement is mandatory.";
    }

    if (!formData.agreedToMediaConsent) {
      newErrors.agreedToMediaConsent = "Media consent is required.";
    }

    if (!formData.agreedToAgeEligibility) {
      newErrors.agreedToAgeEligibility =
        "Age eligibility declaration is required.";
    }

    if (!formData.agreedToIdentityVerification) {
      newErrors.agreedToIdentityVerification =
        "Identity verification agreement is required.";
    }

    if (!formData.agreedToGuardianConsent) {
      newErrors.agreedToGuardianConsent = "Guardian consent is required.";
    }

    if (!formData.agreedToCaptainResponsibility) {
      newErrors.agreedToCaptainResponsibility =
        "Captain responsibility agreement is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (!validateRegistrationWindow()) {
      return;
    }

    if (!validate()) {
      toast.error("Please complete all required fields and agreements.");
      return;
    }

    if (!user?._id) {
      toast.error("Please log in before registering.");
      return;
    }

    const tournamentId = tournament._id || tournament.id;

    if (!tournamentId) {
      toast.error("Tournament ID is missing.");
      return;
    }

    try {
      setIsSubmitting(true);

      const registrationType = isTeamEvent ? "team" : "solo";

      const captainPlayer = {
        user: user._id,
        fullName: formData.captainName.trim(),
        email: formData.captainEmail.trim().toLowerCase(),
        gameUid: formData.captainInGameId.trim(),
        phone: formData.captainPhone.replace(/\D/g, ""),
      };

      let players = [captainPlayer];

      if (isTeamEvent) {
        const teammatePlayers = formData.players.map((player) => ({
          user: null,
          fullName: player.fullName.trim(),
          gameUid: player.gameUid.trim(),
          email: player.email.trim().toLowerCase(),
          phone: player.phone.replace(/\D/g, ""),
        }));

        players = [captainPlayer, ...teammatePlayers];
      }

      if (players.length !== teamSize) {
        toast.error(
          `Exactly ${teamSize} players are required for this tournament.`,
        );
        return;
      }

      const registrationData = {
        registrationType,
        teamName: formData.teamName.trim(),
        players,
        captainContact: {
          whatsapp: formData.captainPhone.replace(/\D/g, ""),
          alternatePhone: "",
          discordId: formData.discordTag.trim(),
        },
        agreements: {
          antiCheat: formData.agreedToAntiCheat,
          rulebook: formData.agreedToRules,
          identityVerification: formData.agreedToIdentityVerification,
          mediaConsent: formData.agreedToMediaConsent,
          professionalConduct: formData.agreedToConductCode,
          guardianConsent: formData.agreedToGuardianConsent,
          captainResponsibility: formData.agreedToCaptainResponsibility,
        },
      };

      await participantService.registerTournament(
        tournamentId,
        registrationData,
      );

      toast.success("Registration completed successfully!");

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Tournament registration error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Registration failed. Please try again.";

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const agreementErrorKeys = [
    "agreedToRules",
    "agreedToAntiCheat",
    "agreedToConductCode",
    "agreedToMediaConsent",
    "agreedToAgeEligibility",
    "agreedToIdentityVerification",
    "agreedToGuardianConsent",
    "agreedToCaptainResponsibility",
  ];

  const agreementFields = [
    "agreedToRules",
    "agreedToAntiCheat",
    "agreedToConductCode",
    "agreedToMediaConsent",
    "agreedToAgeEligibility",
    "agreedToIdentityVerification",
    "agreedToGuardianConsent",
    "agreedToCaptainResponsibility",
  ];

  const allAgreementsChecked = agreementFields.every(
    (field) => formData[field] === true,
  );

  const handleToggleAllAgreements = (e) => {
    const { checked } = e.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
      };

      agreementFields.forEach((field) => {
        updated[field] = checked;
      });

      return updated;
    });

    setErrors((previous) => {
      const updated = {
        ...previous,
      };

      agreementFields.forEach((field) => {
        updated[field] = null;
      });

      return updated;
    });
  };

  const hasAgreementErrors = Object.keys(errors).some((key) =>
    agreementErrorKeys.includes(key),
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="theme-card border theme-border w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        <div className="p-5 border-b theme-border flex items-center justify-between bg-indigo-600/10">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-indigo-500 uppercase">
              Official Entry Form
            </span>

            <h2 className="text-xl font-bold theme-text">{tournamentTitle}</h2>

            <p className="text-xs theme-subtext mt-0.5">
              {tournament.game} •{" "}
              {isTeamEvent ? `Team (${teamSize} Players)` : "Solo Player"} •
              Fee: {entryFee ? `₹${entryFee}` : "Free"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer disabled:opacity-50"
            aria-label="Close registration modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-6 flex-1 text-xs"
        >
          <div className="space-y-4">
            <h3 className="font-bold text-sm theme-text flex items-center gap-2 border-b theme-border pb-2">
              <UserCheck className="w-4 h-4 text-indigo-500" />
              1. Registration Details
            </h3>

            <div>
              <label className="block font-semibold theme-subtext mb-1">
                {isTeamEvent ? "Team / Clan Name *" : "Player / Clan Name *"}
              </label>

              <input
                type="text"
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                placeholder={
                  isTeamEvent
                    ? "Enter your team or clan name"
                    : "Enter your player or clan name"
                }
                className={`theme-input w-full px-3 py-2 border rounded-lg outline-none ${
                  errors.teamName ? "border-rose-500" : ""
                }`}
              />

              {errors.teamName && (
                <p className="text-rose-500 text-[11px] mt-1">
                  {errors.teamName}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold theme-subtext mb-1">
                  Full Legal Name *
                </label>

                <input
                  type="text"
                  name="captainName"
                  value={formData.captainName}
                  readOnly
                  className="theme-input w-full px-3 py-2 border rounded-lg outline-none opacity-80 cursor-not-allowed"
                />

                {errors.captainName && (
                  <p className="text-rose-500 text-[11px] mt-1">
                    {errors.captainName}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold theme-subtext mb-1">
                  In-Game ID / IGN *
                </label>

                <input
                  type="text"
                  name="captainInGameId"
                  value={formData.captainInGameId}
                  onChange={handleInputChange}
                  placeholder="e.g. TenZ#NA1"
                  className={`theme-input w-full px-3 py-2 border rounded-lg outline-none ${
                    errors.captainInGameId ? "border-rose-500" : ""
                  }`}
                />

                {errors.captainInGameId && (
                  <p className="text-rose-500 text-[11px] mt-1">
                    {errors.captainInGameId}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold theme-subtext mb-1">
                  Email Address *
                </label>

                <input
                  type="email"
                  name="captainEmail"
                  value={formData.captainEmail}
                  readOnly
                  className="theme-input w-full px-3 py-2 border rounded-lg outline-none opacity-80 cursor-not-allowed"
                />

                {errors.captainEmail && (
                  <p className="text-rose-500 text-[11px] mt-1">
                    {errors.captainEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold theme-subtext mb-1">
                  Phone Number (WhatsApp) *
                </label>

                <input
                  type="tel"
                  name="captainPhone"
                  value={formData.captainPhone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  maxLength={10}
                  className={`theme-input w-full px-3 py-2 border rounded-lg outline-none ${
                    errors.captainPhone ? "border-rose-500" : ""
                  }`}
                />

                {errors.captainPhone && (
                  <p className="text-rose-500 text-[11px] mt-1">
                    {errors.captainPhone}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold theme-subtext mb-1">
                  Discord Tag / Username *
                </label>

                <input
                  type="text"
                  name="discordTag"
                  value={formData.discordTag}
                  onChange={handleInputChange}
                  placeholder="username#1234 or gamer_tag"
                  className={`theme-input w-full px-3 py-2 border rounded-lg outline-none ${
                    errors.discordTag ? "border-rose-500" : ""
                  }`}
                />

                {errors.discordTag && (
                  <p className="text-rose-500 text-[11px] mt-1">
                    {errors.discordTag}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isTeamEvent && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm theme-text flex items-center gap-2 border-b theme-border pb-2">
                <UserCheck className="w-4 h-4 text-indigo-500" />
                2. Team Members ({teammateCount} Teammates)
              </h3>

              <p className="theme-subtext text-[11px]">
                The captain is already included. Add {teammateCount} teammate
                {teammateCount !== 1 ? "s" : ""} to complete your {teamSize}
                -player team.
              </p>

              {formData.players.map((player, index) => (
                <div
                  key={index}
                  className="p-4 border theme-border rounded-xl space-y-3 bg-black/5 dark:bg-white/5"
                >
                  <p className="font-bold theme-text text-xs">
                    Teammate #{index + 1}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Player Full Name"
                      value={player.fullName}
                      onChange={(e) =>
                        handlePlayerChange(index, "fullName", e.target.value)
                      }
                      className="theme-input px-3 py-2 border rounded-lg outline-none"
                    />

                    <input
                      type="text"
                      placeholder="In-Game ID / IGN"
                      value={player.gameUid}
                      onChange={(e) =>
                        handlePlayerChange(index, "gameUid", e.target.value)
                      }
                      className="theme-input px-3 py-2 border rounded-lg outline-none"
                    />

                    <input
                      type="email"
                      placeholder="Player Email"
                      value={player.email}
                      onChange={(e) =>
                        handlePlayerChange(index, "email", e.target.value)
                      }
                      className="theme-input px-3 py-2 border rounded-lg outline-none"
                    />

                    <input
                      type="tel"
                      placeholder="Player Phone Number"
                      value={player.phone}
                      maxLength={10}
                      onChange={(e) =>
                        handlePlayerChange(index, "phone", e.target.value)
                      }
                      className="theme-input px-3 py-2 border rounded-lg outline-none"
                    />
                  </div>

                  {errors[`player_${index}`] && (
                    <p className="text-rose-500 text-[11px]">
                      {errors[`player_${index}`]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <h4 className="font-bold text-amber-500 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              Participant Responsibilities
            </h4>

            <ul className="list-disc list-inside space-y-1 text-amber-600 dark:text-amber-300 text-[11px]">
              <li>
                Check in 30 minutes before the match through official Discord.
              </li>

              <li>
                Maintain a stable internet connection and suitable hardware.
              </li>

              <li>
                Unsportsmanlike behavior or cheating can result in
                disqualification.
              </li>
            </ul>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl border theme-border bg-indigo-600/5">
            <input
              type="checkbox"
              checked={allAgreementsChecked}
              onChange={handleToggleAllAgreements}
              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
            />

            <span className="font-bold theme-text leading-relaxed">
              Accept all Terms &amp; Conditions, rules, and consents listed
              below.
            </span>
          </label>

          <div className="space-y-3">
            <h3 className="font-bold text-sm theme-text flex items-center gap-2 border-b theme-border pb-2">
              <ShieldCheck className="w-4 h-4 text-indigo-500" />
              4. Mandatory Legal Undertakings & Consent
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToRules"
                  checked={formData.agreedToRules}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />

                <span className="theme-subtext leading-relaxed">
                  I have read and agree to follow all official tournament rules
                  and bracket guidelines.
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
                  <strong>Anti-Cheat Undertaking:</strong> I declare that
                  neither I nor my squad will use hacks, aimbots, scripts, or
                  unauthorized modifications.
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
                  <strong>Code of Conduct:</strong> I agree to maintain
                  professional etiquette and avoid harassment, hate speech, and
                  match-fixing.
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
                  <strong>Media Consent:</strong> I allow the organizer to
                  record and use my in-game name or avatar for tournament
                  broadcasts and promotion.
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
                  <strong>Age Eligibility:</strong> I confirm that all
                  registered players meet the age requirements for this
                  tournament.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToIdentityVerification"
                  checked={formData.agreedToIdentityVerification}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />

                <span className="theme-subtext leading-relaxed">
                  <strong>Identity Verification:</strong> I agree to provide
                  valid identity details if required by the organizer.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToGuardianConsent"
                  checked={formData.agreedToGuardianConsent}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />

                <span className="theme-subtext leading-relaxed">
                  <strong>Guardian Consent:</strong> I confirm that guardian
                  consent has been obtained where required by applicable age
                  eligibility rules.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedToCaptainResponsibility"
                  checked={formData.agreedToCaptainResponsibility}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />

                <span className="theme-subtext leading-relaxed">
                  <strong>Captain Responsibility:</strong> I accept
                  responsibility for the accuracy of the registration details
                  and the conduct of my team.
                </span>
              </label>
            </div>

            {hasAgreementErrors && (
              <p className="text-rose-500 text-[11px]">
                Please accept all mandatory agreements before submitting.
              </p>
            )}
          </div>

          <div className="pt-4 border-t theme-border flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] theme-subtext">
                Total Registration Fee
              </p>

              <p className="text-base font-bold theme-text">
                {entryFee ? `₹${entryFee}` : "FREE ENTRY"}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 font-bold theme-subtext hover:theme-text rounded-xl border theme-border cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />

                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ParticipantRegistrationModal;
