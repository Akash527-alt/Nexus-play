import React, { useState } from 'react';
import { X } from 'lucide-react';

export function CreateTournamentModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    game: '',
    tournamentType: 'team',
    description: '',
    rules: `1. Fair Play: Any form of cheating, hacking, or using third-party software/emulators will result in immediate disqualification.
2. Punctuality: Teams/Players must join the custom room/server at least 15 minutes before the scheduled match time.
3. Proof of Results: The winning team leader must submit a screenshot of the end-game result screen.
4. Player Eligibility: All players must use their registered in-game IDs (IGNs). No last-minute substitutions without prior admin approval.
5. Decision Finality: Organizer/Admin decisions regarding disputes or rule breaches are final and binding.`,
    venue: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    entryFee: 0,
    maxParticipants: 16,
    teamSize: 4,
    status: 'draft'
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Exact JSON Object according to Backend Schema
    const payload = {
      ...formData,
      id: Date.now().toString(),
      currentParticipants: 0,
      bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=200&q=80'
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3 border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Create Event</h2>
            <p className="text-xs text-slate-400">Add tournament according to database schema</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2 flex-1">
          {/* Title & Game */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. BGMI Pro Tournament"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Game Name *</label>
              <input
                type="text"
                name="game"
                required
                value={formData.game}
                onChange={handleChange}
                placeholder="e.g. BGMI, Valorant, Chess"
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tournament Type & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Tournament Type *</label>
              <select
                name="tournamentType"
                value={formData.tournamentType}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="solo">Solo</option>
                <option value="team">Team</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Start Date *</label>
              <input
                type="date"
                name="startDate"
                required
                value={formData.startDate}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">End Date *</label>
              <input
                type="date"
                name="endDate"
                required
                value={formData.endDate}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Reg. Deadline *</label>
              <input
                type="date"
                name="registrationDeadline"
                required
                value={formData.registrationDeadline}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Numeric Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Entry Fee (₹) *</label>
              <input
                type="number"
                name="entryFee"
                min="0"
                required
                value={formData.entryFee}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase">Max Participants *</label>
              <input
                type="number"
                name="maxParticipants"
                min="2"
                required
                value={formData.maxParticipants}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
            {formData.tournamentType === 'team' && (
              <div>
                <label className="text-xs font-bold text-slate-600 uppercase">Team Size</label>
                <input
                  type="number"
                  name="teamSize"
                  min="1"
                  value={formData.teamSize}
                  onChange={handleChange}
                  className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Venue */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Venue / Platform *</label>
            <input
              type="text"
              name="venue"
              required
              value={formData.venue}
              onChange={handleChange}
              placeholder="e.g. Custom Room / Online Server / Stadium Name"
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Description *</label>
            <textarea
              name="description"
              required
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief details about the event..."
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          {/* Rules */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase">Rules & Guidelines *</label>
            <textarea
              name="rules"
              required
              rows="5"
              value={formData.rules}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-end pt-3 border-t border-slate-100 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}