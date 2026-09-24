import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trophy,
  Eye,
  RefreshCw,
  XCircle,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  Gamepad2,
  Building2,
} from "lucide-react";
import { adminService } from "../../services/adminService";

const statusStyles = {
  draft: "text-slate-300 bg-slate-400/10 border-slate-400/20",
  published: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  ongoing: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  completed: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

const formatStatus = (status) =>
  status
    ? status.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())
    : "Unknown";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "—";

  return `₹${Number(amount).toLocaleString("en-IN")}`;
};

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex gap-3">
    <div className="mt-0.5 text-indigo-400">
      <Icon size={17} />
    </div>

    <div className="min-w-0">
      <p className="text-xs theme-subtext">{label}</p>
      <p className="mt-1 break-words text-sm theme-text">{value || "—"}</p>
    </div>
  </div>
);

const DetailSection = ({ title, children }) => (
  <div className="border-b theme-border pb-5 last:border-0 last:pb-0">
    <h3 className="mb-4 text-sm font-semibold theme-text">{title}</h3>
    {children}
  </div>
);

export const TournamentsModerationPage = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gameFilter, setGameFilter] = useState("all");
  const [selectedTournament, setSelectedTournament] = useState(null);

  const fetchTournaments = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await adminService.getTournaments();

      setTournaments(response?.tournaments || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load tournaments");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const games = useMemo(() => {
    return [
      ...new Set(
        tournaments.map((tournament) => tournament.game).filter(Boolean),
      ),
    ].sort();
  }, [tournaments]);

  const filteredTournaments = useMemo(() => {
    const value = search.trim().toLowerCase();

    return tournaments.filter((tournament) => {
      const matchesStatus =
        statusFilter === "all" || tournament.status === statusFilter;

      const matchesGame =
        gameFilter === "all" || tournament.game === gameFilter;

      const matchesSearch =
        !value ||
        tournament.title?.toLowerCase().includes(value) ||
        tournament.game?.toLowerCase().includes(value) ||
        tournament.venue?.toLowerCase().includes(value) ||
        tournament.cityRegion?.toLowerCase().includes(value) ||
        tournament.organizer?.organizationName?.toLowerCase().includes(value);

      return matchesStatus && matchesGame && matchesSearch;
    });
  }, [tournaments, search, statusFilter, gameFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold theme-text">Tournaments</h1>

          <p className="mt-1 text-sm theme-subtext">
            Monitor tournaments across the NexusPlay platform.
          </p>
        </div>

        <button
          onClick={() => fetchTournaments(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-lg border theme-border px-4 py-2 text-sm theme-text transition hover:bg-white/5 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["All", "all"],
          ["Draft", "draft"],
          ["Published", "published"],
          ["Ongoing", "ongoing"],
          ["Completed", "completed"],
          ["Cancelled", "cancelled"],
        ].map(([label, value]) => {
          const count =
            value === "all"
              ? tournaments.length
              : tournaments.filter((tournament) => tournament.status === value)
                  .length;

          return (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`rounded-xl border p-4 text-left transition ${
                statusFilter === value
                  ? "border-indigo-500/50 bg-indigo-500/10"
                  : "theme-card theme-border hover:bg-white/5"
              }`}
            >
              <p className="text-xs theme-subtext">{label}</p>

              <p className="mt-1 text-xl font-bold theme-text">{count}</p>
            </button>
          );
        })}
      </div>

      <div className="theme-card rounded-xl border theme-border p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 theme-subtext"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tournament, game, venue, organizer..."
              className="theme-input w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm outline-none"
            />
          </div>

          <select
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="theme-input rounded-lg border px-3 py-2.5 text-sm outline-none"
          >
            <option value="all">All Games</option>

            {games.map((game) => (
              <option key={game} value={game}>
                {game}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="theme-card rounded-xl border theme-border p-10 text-center">
          <RefreshCw size={22} className="mx-auto animate-spin theme-subtext" />

          <p className="mt-3 text-sm theme-subtext">Loading tournaments...</p>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="theme-card rounded-xl border theme-border p-10 text-center">
          <Trophy size={32} className="mx-auto theme-subtext" />

          <p className="mt-3 font-medium theme-text">No tournaments found</p>

          <p className="mt-1 text-sm theme-subtext">
            Try changing the search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border theme-border lg:block">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b theme-border bg-white/[0.02]">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Tournament
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Organizer
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Schedule
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Participants
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-medium theme-subtext">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-medium theme-subtext">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTournaments.map((tournament) => (
                    <tr
                      key={tournament._id}
                      className="border-b theme-border last:border-b-0"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                            <Trophy size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold theme-text">
                              {tournament.title}
                            </p>

                            <p className="truncate text-xs theme-subtext">
                              {tournament.game} · {tournament.tournamentType}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm theme-text">
                          {tournament.organizer?.organizationName || "—"}
                        </p>

                        <p className="mt-1 text-xs theme-subtext">
                          {tournament.venue ||
                            tournament.cityRegion ||
                            "No venue"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm theme-text">
                          {formatDate(tournament.startDate)}
                        </p>

                        <p className="mt-1 text-xs theme-subtext">
                          to {formatDate(tournament.endDate)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm theme-text">
                          {tournament.currentParticipants ?? 0}
                          {" / "}
                          {tournament.maxParticipants ?? "—"}
                        </p>

                        <p className="mt-1 text-xs theme-subtext">
                          {tournament.tournamentType === "team"
                            ? `${tournament.teamSize || 0} players/team`
                            : "Solo"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                            statusStyles[tournament.status] ||
                            "theme-border theme-text"
                          }`}
                        >
                          {formatStatus(tournament.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => setSelectedTournament(tournament)}
                          className="inline-flex items-center gap-2 rounded-lg border theme-border px-3 py-2 text-sm theme-text transition hover:bg-white/5"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 lg:hidden">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament._id}
                className="theme-card rounded-xl border theme-border p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Trophy size={18} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold theme-text">
                        {tournament.title}
                      </h3>

                      <p className="truncate text-xs theme-subtext">
                        {tournament.game} · {tournament.tournamentType}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-2 py-1 text-[11px] ${
                      statusStyles[tournament.status] ||
                      "theme-border theme-text"
                    }`}
                  >
                    {formatStatus(tournament.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoItem
                    icon={Building2}
                    label="Organizer"
                    value={tournament.organizer?.organizationName}
                  />

                  <InfoItem
                    icon={Calendar}
                    label="Start Date"
                    value={formatDate(tournament.startDate)}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="Venue"
                    value={tournament.venue || tournament.cityRegion}
                  />

                  <InfoItem
                    icon={Users}
                    label="Participants"
                    value={`${tournament.currentParticipants ?? 0} / ${
                      tournament.maxParticipants ?? "—"
                    }`}
                  />
                </div>

                <button
                  onClick={() => setSelectedTournament(tournament)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border theme-border px-3 py-2 text-sm theme-text transition hover:bg-white/5"
                >
                  <Eye size={15} />
                  View Details
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="theme-card max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border theme-border shadow-2xl">
            <div className="flex items-center justify-between border-b theme-border p-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Trophy size={20} />
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold theme-text">
                    {selectedTournament.title}
                  </h2>

                  <p className="text-xs theme-subtext">
                    {selectedTournament.game} ·{" "}
                    {formatStatus(selectedTournament.tournamentType)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTournament(null)}
                className="rounded-lg p-2 theme-subtext transition hover:bg-white/5 hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="max-h-[calc(90vh-80px)] overflow-y-auto p-5">
              <div className="space-y-6">
                <DetailSection title="Tournament Information">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={Trophy}
                      label="Title"
                      value={selectedTournament.title}
                    />

                    <InfoItem
                      icon={Gamepad2}
                      label="Game"
                      value={selectedTournament.game}
                    />

                    <InfoItem
                      icon={Users}
                      label="Tournament Type"
                      value={formatStatus(selectedTournament.tournamentType)}
                    />

                    <InfoItem
                      icon={Gamepad2}
                      label="Tournament Mode"
                      value={selectedTournament.tournamentMode}
                    />

                    <InfoItem
                      icon={MapPin}
                      label="Venue"
                      value={selectedTournament.venue}
                    />

                    <InfoItem
                      icon={MapPin}
                      label="City / Region"
                      value={selectedTournament.cityRegion}
                    />
                  </div>

                  {selectedTournament.description && (
                    <div className="mt-5">
                      <p className="text-xs theme-subtext">Description</p>

                      <p className="mt-1 whitespace-pre-wrap text-sm theme-text">
                        {selectedTournament.description}
                      </p>
                    </div>
                  )}

                  {selectedTournament.rules && (
                    <div className="mt-5">
                      <p className="text-xs theme-subtext">Rules</p>

                      <p className="mt-1 whitespace-pre-wrap text-sm theme-text">
                        {selectedTournament.rules}
                      </p>
                    </div>
                  )}
                </DetailSection>

                <DetailSection title="Schedule">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={Calendar}
                      label="Start Date"
                      value={formatDate(selectedTournament.startDate)}
                    />

                    <InfoItem
                      icon={Calendar}
                      label="End Date"
                      value={formatDate(selectedTournament.endDate)}
                    />

                    <InfoItem
                      icon={Calendar}
                      label="Registration Deadline"
                      value={formatDate(
                        selectedTournament.registrationDeadline,
                      )}
                    />

                    <InfoItem
                      icon={Calendar}
                      label="Status"
                      value={formatStatus(selectedTournament.status)}
                    />
                  </div>
                </DetailSection>

                <DetailSection title="Participation">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={Users}
                      label="Maximum Participants"
                      value={selectedTournament.maxParticipants}
                    />

                    <InfoItem
                      icon={Users}
                      label="Current Participants"
                      value={selectedTournament.currentParticipants}
                    />

                    <InfoItem
                      icon={Users}
                      label="Team Size"
                      value={selectedTournament.teamSize || "Not applicable"}
                    />

                    <InfoItem
                      icon={IndianRupee}
                      label="Entry Fee"
                      value={formatCurrency(selectedTournament.entryFee)}
                    />
                  </div>
                </DetailSection>

                <DetailSection title="Prize Information">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={IndianRupee}
                      label="Prize Pool"
                      value={formatCurrency(selectedTournament.prizePool)}
                    />
                  </div>

                  {selectedTournament.prizes?.length > 0 && (
                    <div className="mt-5 space-y-2">
                      {selectedTournament.prizes.map((prize, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border theme-border px-4 py-3"
                        >
                          <span className="text-sm theme-text">
                            Position {prize.position}
                          </span>

                          <span className="text-sm font-medium theme-text">
                            {formatCurrency(prize.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </DetailSection>

                <DetailSection title="Organizer">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      icon={Building2}
                      label="Organization"
                      value={selectedTournament.organizer?.organizationName}
                    />

                    <InfoItem
                      icon={Building2}
                      label="Organization Type"
                      value={selectedTournament.organizer?.organizationType}
                    />

                    <InfoItem
                      icon={Building2}
                      label="Verification Status"
                      value={formatStatus(
                        selectedTournament.organizer?.verificationStatus,
                      )}
                    />
                  </div>
                </DetailSection>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

