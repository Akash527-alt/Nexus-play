import { useNavigate } from "react-router-dom";
import { useTournaments } from "../../context/TournamentContext";
import { tournamentService } from "../../services/tournamentService";
import {
  Plus,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Lock,
  ImagePlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { getOrganizerProfile } from "../../services/organizerService";
import { Loader2, ShieldAlert } from "lucide-react";

const MANDATORY_RULES = {
  Online: [
    "Must check in 30 minutes prior to match schedule on official Discord.",
    "Responsible for stable internet connection, device hardware, and ping.",
    "Game recordings/screenshots of end-match results must be uploaded after every round.",
    "Unsportsmanlike behavior, toxicity, or map exploits will lead to instant disqualification.",
  ],
  Offline: [
    "Must check in at the venue registration desk 30 minutes prior to match time.",
    "Responsible for bringing approved personal peripherals (headsets, controller, mice).",
    "Match results must be reported directly to on-site tournament marshals immediately.",
    "Unsportsmanlike behavior, physical misconduct, or equipment abuse leads to instant DQ.",
  ],
};

export function CreateTournamentPage() {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [checkingVerification, setCheckingVerification] = useState(true);

  const [tournamentImage, setTournamentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const context = useTournaments ? useTournaments() : null;
  const addTournament = context?.addTournament;

  const today = new Date();

  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [formData, setFormData] = useState({
    name: "",
    game: "",
    startDate: "",
    startTime: "10:00",
    endDate: "",
    endTime: "18:00",
    venueType: "Online",
    venueDetails: "Official Discord Server",
    city: "Mumbai",
    registrationFee: "",
    registrationDeadline: "",
    registrationDeadlineTime: "23:59",
    maxTeams: 16,
    teamSize: 5,
    description: "",
    prizes: [
      { position: 1, amount: "" },
      { position: 2, amount: "" },
    ],
    customRules: [
      "Players must follow official tournament admin calls at all times.",
    ],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const data = await getOrganizerProfile();

        if (data.success && data.organizer) {
          setVerificationStatus(data.organizer.verificationStatus);
        } else {
          setVerificationStatus(null);
        }
      } catch (error) {
        console.error("Verification check failed:", error);
        setVerificationStatus(null);
      } finally {
        setCheckingVerification(false);
      }
    };

    checkVerification();
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        tournamentImage: "Only image files are allowed.",
      }));

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        tournamentImage: "Image size must be less than 5 MB.",
      }));

      e.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setTournamentImage(file);
    setImagePreview(previewUrl);

    setErrors((prev) => ({
      ...prev,
      tournamentImage: null,
    }));
  };

  const removeTournamentImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setTournamentImage(null);
    setImagePreview("");

    const input = document.getElementById("tournamentImage");

    if (input) {
      input.value = "";
    }
  };

  const handleVenueTypeChange = (e) => {
    const newVenueType = e.target.value;

    setFormData((prev) => ({
      ...prev,
      venueType: newVenueType,
      venueDetails:
        newVenueType === "Online"
          ? "Official Discord Server"
          : "Gaming Arena / LAN Center",
    }));
  };

  const addPrize = () => {
    setFormData((prev) => ({
      ...prev,
      prizes: [
        ...prev.prizes,
        {
          position: prev.prizes.length + 1,
          amount: "",
        },
      ],
    }));

    if (errors.prizes) {
      setErrors((prev) => ({
        ...prev,
        prizes: null,
      }));
    }
  };

  const updatePrize = (index, key, value) => {
    const updated = [...formData.prizes];

    updated[index][key] = value === "" ? "" : Number(value);

    setFormData((prev) => ({
      ...prev,
      prizes: updated,
    }));
  };

  const removePrize = (index) => {
    if (formData.prizes.length <= 1) {
      setErrors((prev) => ({
        ...prev,
        prizes: "At least one prize tier is required.",
      }));

      return;
    }

    const updated = formData.prizes
      .filter((_, i) => i !== index)
      .map((prize, i) => ({
        ...prize,
        position: i + 1,
      }));

    setFormData((prev) => ({
      ...prev,
      prizes: updated,
    }));
  };

  const addCustomRule = () => {
    setFormData((prev) => ({
      ...prev,
      customRules: [...prev.customRules, ""],
    }));
  };

  const updateCustomRule = (index, value) => {
    const updated = [...formData.customRules];

    updated[index] = value;

    setFormData((prev) => ({
      ...prev,
      customRules: updated,
    }));
  };

  const removeCustomRule = (index) => {
    setFormData((prev) => ({
      ...prev,
      customRules: prev.customRules.filter((_, i) => i !== index),
    }));
  };

  const calculateTotalPrize = () => {
    return formData.prizes.reduce(
      (sum, prize) => sum + (Number(prize.amount) || 0),
      0,
    );
  };

  const createDateTime = (date, time) => {
    if (!date || !time) return null;

    const [hours, minutes] = time.split(":").map(Number);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    return new Date(
      `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0",
      )}:00+05:30`,
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tournament name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Tournament name must contain at least 3 characters.";
    }

    if (!formData.game.trim()) {
      newErrors.game = "Esports game name is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 20) {
      newErrors.description =
        "Description must contain at least 20 characters.";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required.";
    } else if (formData.startDate < todayStr) {
      newErrors.startDate = "Start date must be today or a future date.";
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required.";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required.";
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = "End date cannot be before start date.";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required.";
    }

    const startDateTime = createDateTime(
      formData.startDate,
      formData.startTime,
    );

    const endDateTime = createDateTime(formData.endDate, formData.endTime);

    const registrationDeadlineDateTime = createDateTime(
      formData.registrationDeadline,
      formData.registrationDeadlineTime,
    );

    if (startDateTime && endDateTime && endDateTime <= startDateTime) {
      newErrors.endTime = "Tournament end time must be after the start time.";
    }

    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline =
        "Registration deadline date is required.";
    }

    if (!formData.registrationDeadlineTime) {
      newErrors.registrationDeadlineTime =
        "Registration deadline time is required.";
    }

    if (
      registrationDeadlineDateTime &&
      startDateTime &&
      registrationDeadlineDateTime >= startDateTime
    ) {
      newErrors.registrationDeadline =
        "Registration deadline must be before the tournament starts.";
    }

    if (
      formData.registrationFee !== "" &&
      (!Number.isFinite(Number(formData.registrationFee)) ||
        Number(formData.registrationFee) < 0)
    ) {
      newErrors.registrationFee = "Registration fee must be 0 or greater.";
    }

    if (
      !formData.maxTeams ||
      !Number.isInteger(Number(formData.maxTeams)) ||
      Number(formData.maxTeams) < 2
    ) {
      newErrors.maxTeams = "Maximum participants must be at least 2.";
    }

    if (
      !formData.teamSize ||
      !Number.isInteger(Number(formData.teamSize)) ||
      Number(formData.teamSize) < 1
    ) {
      newErrors.teamSize = "Team size must be at least 1.";
    }

    if (Number(formData.teamSize) === 1 && Number(formData.maxTeams) < 2) {
      newErrors.maxTeams = "A tournament must allow at least 2 participants.";
    }

    if (formData.venueType === "Offline") {
      if (!formData.venueDetails.trim()) {
        newErrors.venueDetails =
          "Venue details are required for offline tournaments.";
      }

      if (!formData.city.trim()) {
        newErrors.city = "City or region is required for offline tournaments.";
      }
    }

    if (!formData.city.trim()) {
      newErrors.city = "City or region is required.";
    }

    if (!formData.venueDetails.trim()) {
      newErrors.venueDetails = "Venue details are required.";
    }

    if (formData.prizes.length === 0) {
      newErrors.prizes = "At least one prize tier is required.";
    } else {
      const positions = formData.prizes.map((prize) => Number(prize.position));

      const hasDuplicatePositions =
        new Set(positions).size !== positions.length;

      if (hasDuplicatePositions) {
        newErrors.prizes = "Prize positions must be unique.";
      }

      const hasInvalidPrize = formData.prizes.some(
        (prize) =>
          !prize.position ||
          !Number.isInteger(Number(prize.position)) ||
          Number(prize.position) < 1 ||
          prize.amount === "" ||
          !Number.isFinite(Number(prize.amount)) ||
          Number(prize.amount) < 0,
      );

      if (hasInvalidPrize) {
        newErrors.prizes = "All prizes must have a valid position and amount.";
      }
    }

    if (calculateTotalPrize() <= 0) {
      newErrors.prizes = "Total prize pool must be greater than ₹0.";
    }

    const customRuleHasEmptyValue = formData.customRules.some(
      (rule) => typeof rule === "string" && rule.trim() === "",
    );

    if (customRuleHasEmptyValue) {
      newErrors.customRules = "Additional rule fields cannot be empty.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the validation errors before submitting.");

      return false;
    }

    return true;
  };

  const convertISTToUTC = (date, time) => {
    const [hours, minutes] = time.split(":").map(Number);

    const istDate = new Date(
      `${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0",
      )}:00+05:30`,
    );

    return istDate.toISOString();
  };

  const handleSubmit = async (status = "published") => {
    if (status === "draft") return;

    if (!validateForm()) return;

    const currentMandatoryRules = MANDATORY_RULES[formData.venueType] || [];

    const validCustomRules = formData.customRules.filter((rule) => rule.trim());

    const combinedRulesList = [...currentMandatoryRules, ...validCustomRules];

    const tournamentType = Number(formData.teamSize) === 1 ? "solo" : "team";

    const payload = {
      title: formData.name.trim(),

      game: formData.game.trim(),

      tournamentType,

      description: formData.description.trim(),

      rules: combinedRulesList.join("\n"),

      tournamentMode: formData.venueType,

      venue: `${formData.venueDetails.trim()} (${formData.city.trim()})`,

      cityRegion: formData.city.trim(),

      startDate: convertISTToUTC(formData.startDate, formData.startTime),

      endDate: convertISTToUTC(formData.endDate, formData.endTime),

      registrationDeadline: convertISTToUTC(
        formData.registrationDeadline,
        formData.registrationDeadlineTime,
      ),

      entryFee:
        formData.registrationFee === "" ? 0 : Number(formData.registrationFee),

      prizePool: calculateTotalPrize(),

      prizes: formData.prizes.map((prize) => ({
        position: Number(prize.position),
        amount: Number(prize.amount),
      })),

      maxParticipants: Number(formData.maxTeams),

      teamSize:
        tournamentType === "team" ? Number(formData.teamSize) : undefined,

      tournamentImage,

      status: "published",
    };

    try {
      await tournamentService.create(payload);

      toast.success("Tournament published successfully!");

      navigate("/organizer/dashboard");
    } catch (err) {
      console.error("Tournament creation failed:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to publish tournament. Please try again.",
      );
    }
  };

  const inputStyle =
    "theme-input w-full px-3.5 py-2 text-sm rounded-lg border outline-none focus:ring-2 focus:ring-indigo-600 transition-all";

  const boxStyle = "theme-icon-box p-4 rounded-xl border";

  if (checkingVerification) {
    return (
      <div className="flex items-center justify-center py-20 theme-text">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Checking verification status...
      </div>
    );
  }

  if (verificationStatus !== "verified") {
    return (
      <div className="max-w-xl mx-auto mt-12">
        <div className="theme-card border rounded-2xl p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-yellow-500" />
            </div>
          </div>

          <h2 className="text-xl font-bold theme-text">
            Verification Required
          </h2>

          <p className="text-sm theme-subtext">
            You must be a verified organizer before creating a tournament.
          </p>

          <p className="text-xs font-semibold text-yellow-500 capitalize">
            Current Status: {verificationStatus || "Profile Incomplete"}
          </p>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/organizer/profile")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold"
            >
              View Profile
            </button>

            <button
              type="button"
              onClick={() => navigate("/organizer/dashboard")}
              className="theme-card theme-border theme-text border px-4 py-2 rounded-xl text-xs font-semibold"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="theme-card theme-border theme-text theme-hover flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border cursor-pointer transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div>
          <h1 className="theme-text text-2xl font-bold">
            Create New Tournament
          </h1>

          <p className="theme-subtext text-sm">
            Configure parameters, venue mode, and rules.
          </p>
        </div>
      </div>

      <div className="theme-card border space-y-6 p-6 sm:p-8 rounded-2xl shadow-sm">
        <div>
          <h2 className="theme-text theme-border text-base font-bold border-b pb-2 mb-4">
            1. Basic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="theme-text block text-xs font-bold uppercase mb-1">
                Tournament Name *
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${inputStyle} ${
                  errors.name ? "border-rose-500" : ""
                }`}
                placeholder="e.g. Nexus Invitational Season 1"
              />

              {errors.name && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="theme-text block text-xs font-bold uppercase mb-1">
                Esports Game *
              </label>

              <input
                type="text"
                name="game"
                value={formData.game}
                onChange={handleInputChange}
                className={`${inputStyle} ${
                  errors.game ? "border-rose-500" : ""
                }`}
                placeholder="e.g. Valorant, BGMI, Tekken 8"
              />

              {errors.game && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.game}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="theme-text block text-xs font-bold uppercase mb-1">
                Description *
              </label>

              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className={`${inputStyle} ${
                  errors.description ? "border-rose-500" : ""
                }`}
                placeholder="Detailed tournament overview..."
              />

              {errors.description && (
                <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h2 className="theme-text theme-border text-base font-bold border-b pb-2 mb-4">
            2. Tournament Image
          </h2>

          <div className="theme-icon-box theme-border border rounded-xl p-4">
            {!imagePreview ? (
              <label
                htmlFor="tournamentImage"
                className="flex flex-col items-center justify-center border-2 border-dashed theme-border rounded-xl p-8 cursor-pointer hover:border-indigo-500 transition-all"
              >
                <ImagePlus className="w-10 h-10 text-indigo-500 mb-3" />

                <p className="theme-text text-sm font-semibold">
                  Upload Tournament Image
                </p>

                <p className="theme-subtext text-xs mt-1">
                  JPG, PNG, WEBP up to 5 MB
                </p>

                <input
                  id="tournamentImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Tournament preview"
                  className="w-full h-56 object-cover rounded-xl"
                />

                <button
                  type="button"
                  onClick={removeTournamentImage}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.tournamentImage && (
              <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.tournamentImage}
              </p>
            )}

            <p className="theme-subtext text-xs mt-3">
              Tournament image is optional. A default image will be shown on
              tournament cards if no image is uploaded.
            </p>
          </div>
        </div>

        <div>
          <h2 className="theme-text theme-border text-base font-bold border-b pb-2 mb-4">
            3. Schedule & Venue Mode
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={boxStyle}>
                <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">
                  Tournament Start
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="theme-subtext block text-[11px] font-semibold uppercase mb-1">
                      Date *
                    </label>

                    <input
                      type="date"
                      min={todayStr}
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className={`${inputStyle} ${
                        errors.startDate ? "border-rose-500" : ""
                      }`}
                    />

                    {errors.startDate && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="theme-subtext block text-[11px] font-semibold uppercase mb-1">
                      Time *
                    </label>

                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      className={`${inputStyle} ${
                        errors.startTime ? "border-rose-500" : ""
                      }`}
                    />

                    {errors.startTime && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.startTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className={boxStyle}>
                <span className="block text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">
                  Tournament End
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="theme-subtext block text-[11px] font-semibold uppercase mb-1">
                      Date *
                    </label>

                    <input
                      type="date"
                      min={formData.startDate || todayStr}
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className={`${inputStyle} ${
                        errors.endDate ? "border-rose-500" : ""
                      }`}
                    />

                    {errors.endDate && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.endDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="theme-subtext block text-[11px] font-semibold uppercase mb-1">
                      Time *
                    </label>

                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      className={`${inputStyle} ${
                        errors.endTime ? "border-rose-500" : ""
                      }`}
                    />

                    {errors.endTime && (
                      <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.endTime}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={boxStyle}>
              <span className="block text-xs font-bold text-rose-600 dark:text-rose-400 uppercase mb-2">
                Registration Deadline
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="theme-subtext block text-[11px] font-semibold uppercase mb-1">
                    Date *
                  </label>

                  <input
                    type="date"
                    min={todayStr}
                    max={formData.startDate || undefined}
                    name="registrationDeadline"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    className={`${inputStyle} ${
                      errors.registrationDeadline ? "border-rose-500" : ""
                    }`}
                  />

                  {errors.registrationDeadline && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.registrationDeadline}
                    </p>
                  )}
                </div>

                <div>
                  <label className="theme-subtext block text-[11px] font-semibold uppercase mb-1">
                    Time *
                  </label>

                  <input
                    type="time"
                    name="registrationDeadlineTime"
                    value={formData.registrationDeadlineTime}
                    onChange={handleInputChange}
                    className={`${inputStyle} ${
                      errors.registrationDeadlineTime ? "border-rose-500" : ""
                    }`}
                  />

                  {errors.registrationDeadlineTime && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.registrationDeadlineTime}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="theme-text block text-xs font-bold uppercase mb-1">
                  Tournament Mode *
                </label>

                <select
                  name="venueType"
                  value={formData.venueType}
                  onChange={handleVenueTypeChange}
                  className={`${inputStyle} font-semibold text-indigo-600 dark:text-indigo-400`}
                >
                  <option value="Online">Online Tournament</option>

                  <option value="Offline">Offline / LAN Event</option>
                </select>
              </div>

              <div>
                <label className="theme-text block text-xs font-bold uppercase mb-1">
                  Venue Details *
                </label>

                <input
                  type="text"
                  name="venueDetails"
                  value={formData.venueDetails}
                  onChange={handleInputChange}
                  className={`${inputStyle} ${
                    errors.venueDetails ? "border-rose-500" : ""
                  }`}
                  placeholder={
                    formData.venueType === "Online"
                      ? "e.g. Discord / Room Code"
                      : "e.g. LXG Arena"
                  }
                />

                {errors.venueDetails && (
                  <p className="text-xs text-rose-500 mt-1">
                    {errors.venueDetails}
                  </p>
                )}
              </div>

              <div>
                <label className="theme-text block text-xs font-bold uppercase mb-1">
                  City / Region *
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`${inputStyle} ${
                    errors.city ? "border-rose-500" : ""
                  }`}
                  placeholder="e.g. Mumbai"
                />

                {errors.city && (
                  <p className="text-xs text-rose-500 mt-1">{errors.city}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="theme-text theme-border text-base font-bold border-b pb-2 mb-4">
            4. Registration & Slots
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="theme-text block text-xs font-bold uppercase mb-1">
                Registration Fee (₹) *
              </label>

              <input
                type="number"
                min="0"
                step="1"
                name="registrationFee"
                value={formData.registrationFee}
                onChange={handleInputChange}
                placeholder="0"
                className={`${inputStyle} ${
                  errors.registrationFee ? "border-rose-500" : ""
                }`}
              />

              {errors.registrationFee && (
                <p className="text-xs text-rose-500 mt-1">
                  {errors.registrationFee}
                </p>
              )}
            </div>

            <div>
              <label className="theme-text block text-xs font-bold uppercase mb-1">
                Max Slots *
              </label>

              <input
                type="number"
                min="2"
                step="1"
                name="maxTeams"
                value={formData.maxTeams}
                onChange={handleInputChange}
                className={`${inputStyle} ${
                  errors.maxTeams ? "border-rose-500" : ""
                }`}
              />

              {errors.maxTeams && (
                <p className="text-xs text-rose-500 mt-1">{errors.maxTeams}</p>
              )}
            </div>

            <div>
              <label className="theme-text block text-xs font-bold uppercase mb-1">
                Team Size (Players) *
              </label>

              <input
                type="number"
                min="1"
                step="1"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleInputChange}
                className={`${inputStyle} ${
                  errors.teamSize ? "border-rose-500" : ""
                }`}
              />

              {errors.teamSize && (
                <p className="text-xs text-rose-500 mt-1">{errors.teamSize}</p>
              )}

              <p className="theme-subtext text-[10px] mt-1">
                Team size 1 = Solo tournament.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center theme-border border-b pb-2 mb-4">
            <h2 className="theme-text text-base font-bold">
              5. Prize Pool Distribution
            </h2>

            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-300 theme-icon-box border px-3 py-1 rounded-full">
              Total Prize Pool: ₹{calculateTotalPrize().toLocaleString("en-IN")}
            </span>
          </div>

          {errors.prizes && (
            <p className="text-xs text-rose-500 mb-3 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.prizes}
            </p>
          )}

          <div className="space-y-3">
            {formData.prizes.map((prize, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="theme-icon-box theme-border theme-text w-32 px-3.5 py-2 text-sm border font-semibold rounded-lg">
                  Rank {prize.position}
                </div>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={prize.amount}
                  onChange={(e) => updatePrize(index, "amount", e.target.value)}
                  className={inputStyle}
                  placeholder="Prize Amount (₹)"
                />

                <button
                  type="button"
                  onClick={() => removePrize(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addPrize}
              className="theme-icon-box theme-border text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 border flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Prize Tier
            </button>
          </div>
        </div>

        <div>
          <h2 className="theme-text theme-border text-base font-bold border-b pb-2 mb-4">
            6. Rules & Guidelines
          </h2>

          <div className="theme-icon-box theme-border border rounded-xl p-4 mb-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">
              <Lock className="w-3.5 h-3.5" />
              Mandatory Rules for {formData.venueType} Mode
            </div>

            <ul className="list-disc list-inside space-y-1.5 text-xs theme-subtext">
              {MANDATORY_RULES[formData.venueType]?.map((rule, index) => (
                <li key={index} className="font-medium">
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <label className="theme-text block text-xs font-bold uppercase">
              Additional Rules
            </label>

            {formData.customRules.map((rule, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => updateCustomRule(index, e.target.value)}
                  className={`${inputStyle} ${
                    errors.customRules && !rule.trim() ? "border-rose-500" : ""
                  }`}
                  placeholder="Additional rule clause detail..."
                />

                <button
                  type="button"
                  onClick={() => removeCustomRule(index)}
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            {errors.customRules && (
              <p className="text-xs text-rose-500">{errors.customRules}</p>
            )}

            <button
              type="button"
              onClick={addCustomRule}
              className="theme-icon-box theme-border text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 border flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Rule Clause
            </button>
          </div>
        </div>

        <div className="theme-border flex items-center justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            className="theme-card theme-border theme-text theme-hover px-4 py-2 text-xs font-bold rounded-lg border cursor-pointer transition-all shadow-sm"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit("published")}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer transition-all shadow-sm"
          >
            Publish Tournament
          </button>
        </div>
      </div>
    </div>
  );
}
