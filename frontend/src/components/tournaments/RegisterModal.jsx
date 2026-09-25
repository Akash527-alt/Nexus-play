import React, { useEffect, useState } from "react";
import {
  X,
  Trophy,
  User,
  ShieldAlert,
  Phone,
  CheckSquare,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { participantService } from "../../services/participantService";

export function RegisterModal({ tournament, isOpen, onClose, onSuccess }) {
  const isTeamTournament = tournament?.tournamentType === "team";
  const playerCount = isTeamTournament ? Number(tournament?.teamSize) : 1;
  const teammateCount = isTeamTournament ? playerCount - 1 : 0;

  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    teamName: "",
    contactNumber: "",
    altContactNumber: "",
    discordHandle: "",
    players: [],
    undertakingFairPlay: false,
    undertakingRules: false,
    undertakingCaptainResponsibility: false,
    undertakingIdentityVerify: false,
    undertakingMediaStreamRights: false,
    undertakingPenaltyAcceptance: false,
    undertakingMinorConsent: false,
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !tournament) {
      return;
    }

    const size =
      tournament.tournamentType === "team" ? Number(tournament.teamSize) : 1;

    if (!size || size < 1) {
      toast.error("Invalid tournament team size.");
      return;
    }

    loadParticipantProfile(size);
  }, [tournament, isOpen]);

  const loadParticipantProfile = async (size) => {
    try {
      const response = await participantService.getProfile();

      const profile =
        response?.participant ||
        response?.profile ||
        response?.user ||
        response?.data ||
        null;

      if (!profile) {
        throw new Error("Participant profile not found.");
      }

      const captain = {
        user: profile?._id || profile?.id || null,
        fullName: profile?.name || profile?.fullName || "",
        gameUid: profile?.gameUid || profile?.uid || "",
        email: profile?.email || "",
        phone: profile?.phone || profile?.mobile || "",
      };

      const teammates = Array.from({ length: Math.max(size - 1, 0) }, () => ({
        user: null,
        fullName: "",
        gameUid: "",
        email: "",
        phone: "",
      }));

      setCurrentUser(profile);

      setFormData({
        teamName: "",
        contactNumber: profile?.phone || profile?.mobile || "",
        altContactNumber: "",
        discordHandle: "",
        players: [captain, ...teammates],
        undertakingFairPlay: false,
        undertakingRules: false,
        undertakingCaptainResponsibility: false,
        undertakingIdentityVerify: false,
        undertakingMediaStreamRights: false,
        undertakingPenaltyAcceptance: false,
        undertakingMinorConsent: false,
      });
    } catch (error) {
      console.error("Failed to load participant profile:", error);

      toast.error("Unable to load your participant profile.");

      setCurrentUser(null);

      setFormData({
        teamName: "",
        contactNumber: "",
        altContactNumber: "",
        discordHandle: "",
        players: Array.from({ length: size }, () => ({
          user: null,
          fullName: "",
          gameUid: "",
          email: "",
          phone: "",
        })),
        undertakingFairPlay: false,
        undertakingRules: false,
        undertakingCaptainResponsibility: false,
        undertakingIdentityVerify: false,
        undertakingMediaStreamRights: false,
        undertakingPenaltyAcceptance: false,
        undertakingMinorConsent: false,
      });
    }
  };

  if (!isOpen || !tournament) {
    return null;
  }

  const handlePlayerChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedPlayers = [...prev.players];

      updatedPlayers[index] = {
        ...updatedPlayers[index],
        [field]: value,
      };

      return {
        ...prev,
        players: updatedPlayers,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const areAllUndertakingsChecked = [
    formData.undertakingFairPlay,
    formData.undertakingRules,
    formData.undertakingCaptainResponsibility,
    formData.undertakingIdentityVerify,
    formData.undertakingMediaStreamRights,
    formData.undertakingPenaltyAcceptance,
    formData.undertakingMinorConsent,
  ].every(Boolean);

  const handleSelectAllUndertakings = (e) => {
    const checked = e.target.checked;

    setFormData((prev) => ({
      ...prev,
      undertakingFairPlay: checked,
      undertakingRules: checked,
      undertakingCaptainResponsibility: checked,
      undertakingIdentityVerify: checked,
      undertakingMediaStreamRights: checked,
      undertakingPenaltyAcceptance: checked,
      undertakingMinorConsent: checked,
    }));
  };

  const validateRegistrationWindow = () => {
    const now = new Date();

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

    if (tournament.status !== "published") {
      toast.error("Registration is not available for this tournament.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) {
      return;
    }

    if (!validateRegistrationWindow()) {
      return;
    }

    if (!isTeamTournament && playerCount !== 1) {
      toast.error("Invalid solo tournament configuration.");
      return;
    }

    if (isTeamTournament && (!playerCount || playerCount < 2)) {
      toast.error("Invalid team size configured for this tournament.");
      return;
    }

    if (formData.players.length !== playerCount) {
      toast.error(
        `Exactly ${playerCount} player${
          playerCount > 1 ? "s" : ""
        } required for this tournament.`,
      );
      return;
    }

    if (!currentUser?._id && !currentUser?.id) {
      toast.error("Your participant account could not be identified.");
      return;
    }

    if (isTeamTournament && !formData.teamName.trim()) {
      toast.error("Team / Clan name is required.");
      return;
    }

    const captain = formData.players[0];

    if (!captain?.fullName?.trim()) {
      toast.error("Captain name is required.");
      return;
    }

    if (!captain?.gameUid?.trim()) {
      toast.error("Captain Game UID / IGN is required.");
      return;
    }

    if (!captain?.email?.trim()) {
      toast.error("Captain email is required.");
      return;
    }

    if (!captain?.phone?.trim()) {
      toast.error("Captain phone number is required.");
      return;
    }

    if (isTeamTournament) {
      for (let i = 1; i < formData.players.length; i++) {
        const player = formData.players[i];

        if (!player.fullName?.trim()) {
          toast.error(`Please provide Full Name for Teammate ${i}.`);
          return;
        }

        if (!player.gameUid?.trim()) {
          toast.error(`Please provide Game UID / IGN for Teammate ${i}.`);
          return;
        }

        if (!player.email?.trim()) {
          toast.error(`Please provide Email for Teammate ${i}.`);
          return;
        }

        if (!player.phone?.trim()) {
          toast.error(`Please provide Phone Number for Teammate ${i}.`);
          return;
        }
      }
    }

    if (!formData.contactNumber.trim()) {
      toast.error("WhatsApp contact is required.");
      return;
    }

    const mandatoryChecks = [
      formData.undertakingFairPlay,
      formData.undertakingRules,
      formData.undertakingCaptainResponsibility,
      formData.undertakingIdentityVerify,
      formData.undertakingMediaStreamRights,
      formData.undertakingPenaltyAcceptance,
      formData.undertakingMinorConsent,
    ];

    if (mandatoryChecks.some((checked) => !checked)) {
      toast.error("You must accept all mandatory undertakings.");
      return;
    }

    const loggedInUserId = currentUser._id || currentUser.id;

    const players = formData.players.map((player, index) => ({
      user: index === 0 ? loggedInUserId : player.user || null,
      fullName: player.fullName.trim(),
      gameUid: player.gameUid.trim(),
      email: player.email.trim().toLowerCase(),
      phone: player.phone.trim(),
    }));

    const registrationData = {
      registrationType: tournament.tournamentType,
      teamName: isTeamTournament
        ? formData.teamName.trim()
        : players[0].fullName,
      players,
      captainContact: {
        whatsapp: formData.contactNumber.trim(),
        alternatePhone: formData.altContactNumber.trim(),
        discordId: formData.discordHandle.trim(),
      },
      agreements: {
        antiCheat: formData.undertakingFairPlay,
        rulebook: formData.undertakingRules,
        identityVerification: formData.undertakingIdentityVerify,
        mediaConsent: formData.undertakingMediaStreamRights,
        professionalConduct: formData.undertakingPenaltyAcceptance,
        guardianConsent: formData.undertakingMinorConsent,
        captainResponsibility: formData.undertakingCaptainResponsibility,
      },
    };

    try {
      setSubmitting(true);

      await participantService.registerTournament(
        tournament._id || tournament.id,
        registrationData,
      );

      toast.success("Registration completed successfully.");

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error?.response?.data?.message || "Failed to complete registration.";

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="theme-card border theme-border rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-6">
        <div className="flex justify-between items-center p-5 border-b theme-border theme-icon-box">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500">
              <Trophy className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-base font-extrabold theme-text">
                Register for {tournament.title || tournament.name}
              </h2>

              <p className="text-xs theme-subtext mt-0.5">
                Game:{" "}
                <span className="font-semibold text-indigo-500">
                  {tournament.game || "Esports"}
                </span>{" "}
                • Format:{" "}
                {isTeamTournament
                  ? `Squad (${playerCount} Players)`
                  : "Solo (1 Player)"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            disabled={submitting}
            className="p-1.5 rounded-lg theme-subtext hover:theme-text theme-hover cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 text-xs max-h-[78vh] overflow-y-auto"
        >
          {isTeamTournament && (
            <div className="space-y-3">
              <h3 className="font-bold theme-text uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b theme-border pb-2">
                <Users className="w-4 h-4 text-indigo-500" />
                Team Information
              </h3>

              <div className="space-y-1">
                <label className="font-bold theme-text">
                  Team / Clan Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="teamName"
                  required
                  value={formData.teamName}
                  onChange={handleChange}
                  placeholder="e.g. Soul Esports"
                  className="w-full theme-card border theme-border rounded-xl px-3.5 py-2.5 theme-text focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between border-b theme-border pb-2">
              <h3 className="font-bold theme-text uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <User className="w-4 h-4 text-indigo-500" />
                Captain Details
              </h3>

              <span className="text-[10px] theme-subtext font-medium">
                You are the captain
              </span>
            </div>

            <div className="theme-icon-box border theme-border p-4 rounded-xl space-y-3">
              <div className="flex justify-between items-center border-b theme-border pb-2">
                <span className="text-[11px] font-bold text-indigo-500">
                  Captain
                </span>

                <span className="text-[10px] theme-subtext">
                  Automatically included
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold theme-subtext">
                    Full Legal Name
                  </label>

                  <input
                    type="text"
                    value={formData.players[0]?.fullName || ""}
                    disabled
                    className="w-full theme-card border theme-border rounded-lg px-3 py-2 theme-subtext opacity-80 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold theme-subtext">
                    Game UID / IGN
                  </label>

                  <input
                    type="text"
                    value={formData.players[0]?.gameUid || ""}
                    onChange={(e) =>
                      handlePlayerChange(0, "gameUid", e.target.value)
                    }
                    placeholder="Captain Game UID / IGN"
                    className="w-full theme-card border theme-border rounded-lg px-3 py-2 theme-text focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold theme-subtext">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={formData.players[0]?.email || ""}
                    disabled
                    className="w-full theme-card border theme-border rounded-lg px-3 py-2 theme-subtext opacity-80 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold theme-subtext">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={formData.players[0]?.phone || ""}
                    disabled
                    className="w-full theme-card border theme-border rounded-lg px-3 py-2 theme-subtext opacity-80 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {isTeamTournament && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b theme-border pb-2">
                <h3 className="font-bold theme-text uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Team Members
                </h3>

                <span className="text-[10px] theme-subtext font-medium">
                  Captain already included
                </span>
              </div>

              <div className="space-y-4">
                {formData.players.slice(1).map((player, index) => {
                  const playerIndex = index + 1;

                  return (
                    <div
                      key={playerIndex}
                      className="theme-icon-box border theme-border p-4 rounded-xl space-y-3"
                    >
                      <div className="flex justify-between items-center border-b theme-border pb-2">
                        <span className="text-[11px] font-bold text-indigo-500">
                          Teammate {playerIndex}
                        </span>

                        <span className="text-[10px] theme-subtext">
                          Required Slot #{playerIndex + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold theme-subtext">
                            Full Legal Name{" "}
                            <span className="text-red-500">*</span>
                          </label>

                          <input
                            type="text"
                            required
                            value={player.fullName}
                            onChange={(e) =>
                              handlePlayerChange(
                                playerIndex,
                                "fullName",
                                e.target.value,
                              )
                            }
                            placeholder="Full Name"
                            className="w-full theme-card border theme-border rounded-lg px-3 py-2 theme-text focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold theme-subtext">
                            Game UID / IGN{" "}
                            <span className="text-red-500">*</span>
                          </label>

                          <input
                            type="text"
                            required
                            value={player.gameUid}
                            onChange={(e) =>
                              handlePlayerChange(
                                playerIndex,
                                "gameUid",
                                e.target.value,
                              )
                            }
                            placeholder="Game UID / IGN"
                            className="w-full theme-card border theme-border rounded-lg px-3 py-2 theme-text focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold theme-subtext">
                            Email Address{" "}
                            <span className="text-red-500">*</span>
                          </label>

                          <input
                            type="email"
                            required
                            value={player.email}
                            onChange={(e) =>
                              handlePlayerChange(
                                playerIndex,
                                "email",
                                e.target.value,
                              )
                            }
                            placeholder="Email Address"
                            className="w-full theme-card border theme-border rounded-lg px-3 py-2 theme-text focus:outline-none focus:border-indigo-500"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold theme-subtext">
                            Phone Number <span className="text-red-500">*</span>
                          </label>

                          <input
                            type="tel"
                            required
                            value={player.phone}
                            onChange={(e) =>
                              handlePlayerChange(
                                playerIndex,
                                "phone",
                                e.target.value,
                              )
                            }
                            placeholder="Phone Number"
                            className="w-full theme-card border theme-border rounded-lg px-3 py-2 theme-text focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-bold theme-text uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b theme-border pb-2">
              <Phone className="w-4 h-4 text-indigo-500" />
              Captain Contacts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold theme-text">
                  WhatsApp Contact <span className="text-red-500">*</span>
                </label>

                <input
                  type="tel"
                  name="contactNumber"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full theme-card border theme-border rounded-xl px-3.5 py-2 theme-text focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold theme-text">
                  Alternate Contact
                </label>

                <input
                  type="tel"
                  name="altContactNumber"
                  value={formData.altContactNumber}
                  onChange={handleChange}
                  placeholder="Alternate Contact"
                  className="w-full theme-card border theme-border rounded-xl px-3.5 py-2 theme-text focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold theme-text">
                  Captain Discord ID
                </label>

                <input
                  type="text"
                  name="discordHandle"
                  value={formData.discordHandle}
                  onChange={handleChange}
                  placeholder="Discord ID"
                  className="w-full theme-card border theme-border rounded-xl px-3.5 py-2 theme-text focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between border-b theme-border pb-2">
              <h4 className="font-bold theme-text text-[11px] uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                <ShieldAlert className="w-4 h-4" />
                Mandatory Undertakings
              </h4>

              <span className="text-[10px] text-red-500 font-bold">
                * All Required
              </span>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/30">
              <input
                type="checkbox"
                id="selectAllUndertakings"
                checked={areAllUndertakingsChecked}
                onChange={handleSelectAllUndertakings}
                className="w-4 h-4 rounded border-indigo-500 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />

              <label
                htmlFor="selectAllUndertakings"
                className="font-bold theme-text text-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckSquare className="w-4 h-4 text-indigo-500" />
                Select All Undertakings
              </label>
            </div>

            <div className="space-y-3 theme-icon-box border theme-border p-4 rounded-xl">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="undertakingFairPlay"
                  checked={formData.undertakingFairPlay}
                  onChange={handleChange}
                  className="mt-0.5"
                />

                <span className="theme-subtext text-[11px] leading-relaxed">
                  <strong className="theme-text">
                    Anti-Cheat & Fair Play:
                  </strong>{" "}
                  We certify that all players will follow the tournament
                  anti-cheat rules.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="undertakingRules"
                  checked={formData.undertakingRules}
                  onChange={handleChange}
                  className="mt-0.5"
                />

                <span className="theme-subtext text-[11px] leading-relaxed">
                  <strong className="theme-text">Rulebook Adherence:</strong> We
                  agree to follow all tournament rules and timings.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="undertakingIdentityVerify"
                  checked={formData.undertakingIdentityVerify}
                  onChange={handleChange}
                  className="mt-0.5"
                />

                <span className="theme-subtext text-[11px] leading-relaxed">
                  <strong className="theme-text">Identity Verification:</strong>{" "}
                  All player information and game UIDs are genuine.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="undertakingMediaStreamRights"
                  checked={formData.undertakingMediaStreamRights}
                  onChange={handleChange}
                  className="mt-0.5"
                />

                <span className="theme-subtext text-[11px] leading-relaxed">
                  <strong className="theme-text">Media Consent:</strong> We
                  permit tournament-related media usage according to the
                  tournament rules.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="undertakingPenaltyAcceptance"
                  checked={formData.undertakingPenaltyAcceptance}
                  onChange={handleChange}
                  className="mt-0.5"
                />

                <span className="theme-subtext text-[11px] leading-relaxed">
                  <strong className="theme-text">Professional Conduct:</strong>{" "}
                  We agree to maintain professional conduct during the
                  tournament.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="undertakingMinorConsent"
                  checked={formData.undertakingMinorConsent}
                  onChange={handleChange}
                  className="mt-0.5"
                />

                <span className="theme-subtext text-[11px] leading-relaxed">
                  <strong className="theme-text">Guardian Consent:</strong>{" "}
                  Players under 18 confirm that they have the required guardian
                  authorization.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  name="undertakingCaptainResponsibility"
                  checked={formData.undertakingCaptainResponsibility}
                  onChange={handleChange}
                  className="mt-0.5"
                />

                <span className="theme-subtext text-[11px] leading-relaxed">
                  <strong className="theme-text">
                    Captain Responsibility:
                  </strong>{" "}
                  The captain accepts responsibility for the registered roster
                  and tournament communication.
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t theme-border">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 theme-border border rounded-xl theme-subtext font-bold text-xs theme-hover cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
            >
              {submitting
                ? "Submitting Registration..."
                : "Accept Undertakings & Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModal;
