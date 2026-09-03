import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournaments } from '../../context/TournamentContext';
import { tournamentService } from '../../services/tournamentService';
import { Plus, Trash2, ArrowLeft, AlertCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';

const MANDATORY_RULES = {
  Online: [
    "Must check in 30 minutes prior to match schedule on official Discord.",
    "Responsible for stable internet connection, device hardware, and ping.",
    "Game recordings/screenshots of end-match results must be uploaded after every round.",
    "Unsportsmanlike behavior, toxicity, or map exploits will lead to instant disqualification."
  ],
  Offline: [
    "Must check in at the venue registration desk 30 minutes prior to match time.",
    "Responsible for bringing approved personal peripherals (headsets, controller, mice).",
    "Match results must be reported directly to on-site tournament marshals immediately.",
    "Unsportsmanlike behavior, physical misconduct, or equipment abuse leads to instant DQ."
  ]
};

export function CreateTournamentPage() {
  const navigate = useNavigate();
  const context = useTournaments ? useTournaments() : null;
  const addTournament = context?.addTournament;
  
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const [formData, setFormData] = useState({
    name: '',
    game: '',
    startDate: '',
    endDate: '',
    venueType: 'Online',
    venueDetails: 'Official Discord Server',
    city: 'Mumbai',
    registrationFee: '',
    registrationDeadline: '',
    maxTeams: 16,
    teamSize: 5,
    description: '',
    prizes: [
      { position: 1, amount: '' },
      { position: 2, amount: '' }
    ],
    customRules: ['Players must follow official tournament admin calls at all times.']
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleVenueTypeChange = (e) => {
    const newVenueType = e.target.value;
    setFormData(prev => ({
      ...prev,
      venueType: newVenueType,
      venueDetails: newVenueType === 'Online' ? 'Official Discord Server' : 'Gaming Arena / LAN Center'
    }));
  };

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, { position: prev.prizes.length + 1, amount: '' }]
    }));
    if (errors.prizes) setErrors(prev => ({ ...prev, prizes: null }));
  };

  const updatePrize = (index, key, val) => {
    const updated = [...formData.prizes];
    updated[index][key] = val === '' ? '' : Number(val);
    setFormData(prev => ({ ...prev, prizes: updated }));
  };

  const removePrize = (index) => {
    if (formData.prizes.length <= 1) {
      setErrors(prev => ({ ...prev, prizes: 'At least one prize tier is required.' }));
      return;
    }
    const updated = formData.prizes
      .filter((_, i) => i !== index)
      .map((p, i) => ({ ...p, position: i + 1 }));
    setFormData(prev => ({ ...prev, prizes: updated }));
  };

  const addCustomRule = () => {
    setFormData(prev => ({ ...prev, customRules: [...prev.customRules, ''] }));
  };

  const updateCustomRule = (index, val) => {
    const updated = [...formData.customRules];
    updated[index] = val;
    setFormData(prev => ({ ...prev, customRules: updated }));
  };

  const removeCustomRule = (index) => {
    setFormData(prev => ({ ...prev, customRules: prev.customRules.filter((_, i) => i !== index) }));
  };

  const calculateTotalPrize = () => 
    formData.prizes.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
    if (!formData.game.trim()) newErrors.game = 'Esports game name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (formData.startDate < todayStr) {
      newErrors.startDate = 'Start date must be today or a future date';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date must be on or after start date';
    }

    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required';
    } else if (formData.endDate && formData.registrationDeadline > formData.endDate) {
      newErrors.registrationDeadline = 'Registration deadline cannot be after tournament end date';
    }

    if (formData.registrationFee !== '' && Number(formData.registrationFee) < 0) {
      newErrors.registrationFee = 'Fee cannot be negative';
    }
    if (!formData.maxTeams || Number(formData.maxTeams) <= 1) {
      newErrors.maxTeams = 'Must have at least 2 teams/participants';
    }
    if (!formData.teamSize || Number(formData.teamSize) <= 0) {
      newErrors.teamSize = 'Team size must be at least 1';
    }

    if (formData.prizes.length === 0) {
      newErrors.prizes = 'At least one prize tier is required';
    } else if (formData.prizes.some(p => !p.position || p.amount === '' || Number(p.amount) < 0)) {
      newErrors.prizes = 'All prizes must have a position and valid positive amount';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix validation errors before submitting.');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status = 'published') => {
    if (!validateForm()) return;

    const currentMandatoryRules = MANDATORY_RULES[formData.venueType] || [];
    const validCustomRules = formData.customRules.filter(r => r.trim());
    const combinedRulesList = [...currentMandatoryRules, ...validCustomRules];

    const uniqueId = `t_${Date.now()}`;

    const payload = {
      id: uniqueId,
      _id: uniqueId,
      title: formData.name,
      name: formData.name,
      game: formData.game,
      tournamentType: Number(formData.teamSize) > 1 ? 'team' : 'solo',
      description: formData.description,
      rules: combinedRulesList.join('\n'),
      venue: `${formData.venueType}: ${formData.venueDetails} (${formData.city})`,
      startDate: formData.startDate,
      startTime: formData.startDate, 
      endDate: formData.endDate,
      registrationDeadline: formData.registrationDeadline,
      entryFee: formData.registrationFee === '' ? 0 : Number(formData.registrationFee),
      prizePool: calculateTotalPrize(),
      totalPrizePool: calculateTotalPrize(),
      prizes: formData.prizes.map(p => ({
        position: Number(p.position),
        amount: Number(p.amount)
      })),
      maxParticipants: Number(formData.maxTeams),
      maxSlots: Number(formData.maxTeams),
      filledSlots: 0,
      teamSize: Number(formData.teamSize),
      status: status,
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Context Update
      if (addTournament) {
        addTournament(payload);
      }

      // 2. Safe Local Storage Sync Write across shared keys
      const readExisting = (key) => {
        try {
          return JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
          return [];
        }
      };

      const existing1 = readExisting('nexus_tournaments');
      const existing2 = readExisting('my_tournaments');
      
      const filtered1 = existing1.filter(item => (item._id || item.id) !== uniqueId);
      const filtered2 = existing2.filter(item => (item._id || item.id) !== uniqueId);

      localStorage.setItem('nexus_tournaments', JSON.stringify([payload, ...filtered1]));
      localStorage.setItem('my_tournaments', JSON.stringify([payload, ...filtered2]));

      // 3. Backend API Update (Bypassed gracefully if restricted/fails)
      if (tournamentService && typeof tournamentService.create === 'function') {
        await tournamentService.create(payload);
      }

      toast.success(`Tournament ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
      navigate('/organizer/dashboard');
    } catch (err) {
      console.warn('Backend write failed, tournament saved to local store:', err);
      toast.success('Tournament saved locally!');
      navigate('/organizer/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="theme-hover theme-text flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg border cursor-pointer"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div>
          <h1 className="text-2xl font-bold theme-text">Create New Tournament</h1>
          <p className="text-sm theme-subtext">Configure parameters, venue mode, and rules.</p>
        </div>
      </div>

      <div className="theme-card space-y-6 p-8 rounded-2xl border shadow-xs">
        <div>
          <h2 className="text-base font-bold theme-text border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>1. Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Tournament Name *</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className={`theme-input w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 outline-none ${errors.name ? 'border-rose-500' : 'focus:ring-indigo-500'}`} 
                placeholder="e.g. Nexus Invitational Season 1" 
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Esports Game *</label>
              <input 
                type="text"
                name="game" 
                value={formData.game} 
                onChange={handleInputChange} 
                className={`theme-input w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 outline-none ${errors.game ? 'border-rose-500' : 'focus:ring-indigo-500'}`}
                placeholder="e.g. Valorant, BGMI, Tekken 8"
              />
              {errors.game && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.game}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Description *</label>
              <textarea 
                name="description" 
                rows="3" 
                value={formData.description} 
                onChange={handleInputChange} 
                className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.description ? 'border-rose-500' : ''}`}
                placeholder="Detailed tournament overview..."
              />
              {errors.description && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.description}</p>}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold theme-text border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>2. Schedule & Venue Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Start Date *</label>
              <input 
                type="date" 
                min={todayStr} 
                name="startDate" 
                value={formData.startDate} 
                onChange={handleInputChange} 
                className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.startDate ? 'border-rose-500' : ''}`} 
              />
              {errors.startDate && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">End Date *</label>
              <input 
                type="date" 
                min={formData.startDate || todayStr} 
                name="endDate" 
                value={formData.endDate} 
                onChange={handleInputChange} 
                className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.endDate ? 'border-rose-500' : ''}`} 
              />
              {errors.endDate && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.endDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Reg. Deadline *</label>
              <input 
                type="date" 
                min={todayStr} 
                max={formData.endDate || undefined} 
                name="registrationDeadline" 
                value={formData.registrationDeadline} 
                onChange={handleInputChange} 
                className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.registrationDeadline ? 'border-rose-500' : ''}`} 
              />
              {errors.registrationDeadline && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.registrationDeadline}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Tournament Mode *</label>
              <select 
                name="venueType" 
                value={formData.venueType} 
                onChange={handleVenueTypeChange} 
                className="theme-input w-full px-3 py-2 text-sm font-semibold border rounded-lg outline-none text-indigo-500"
              >
                <option value="Online">Online Tournament</option>
                <option value="Offline">Offline / LAN Event</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Venue Details</label>
              <input 
                type="text" 
                name="venueDetails" 
                value={formData.venueDetails} 
                onChange={handleInputChange} 
                className="theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none" 
                placeholder={formData.venueType === 'Online' ? 'e.g. Discord / Room Code' : 'e.g. LXG Arena'} 
              />
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">City / Region</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none" placeholder="e.g. Mumbai" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold theme-text border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>3. Registration & Slots</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Registration Fee (₹) *</label>
              <input 
                type="number" 
                min="0" 
                name="registrationFee" 
                value={formData.registrationFee} 
                onChange={handleInputChange} 
                placeholder="0"
                className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.registrationFee ? 'border-rose-500' : ''}`} 
              />
              {errors.registrationFee && <p className="text-xs text-rose-500 mt-1">{errors.registrationFee}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Max Participants / Slots *</label>
              <input type="number" min="2" name="maxTeams" value={formData.maxTeams} onChange={handleInputChange} className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.maxTeams ? 'border-rose-500' : ''}`} />
              {errors.maxTeams && <p className="text-xs text-rose-500 mt-1">{errors.maxTeams}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Team Size (Players) *</label>
              <input type="number" min="1" name="teamSize" value={formData.teamSize} onChange={handleInputChange} className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.teamSize ? 'border-rose-500' : ''}`} />
              {errors.teamSize && <p className="text-xs text-rose-500 mt-1">{errors.teamSize}</p>}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-base font-bold theme-text">4. Prize Pool Distribution</h2>
            <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
              Total Prize Pool: ₹{calculateTotalPrize().toLocaleString('en-IN')}
            </span>
          </div>
          
          {errors.prizes && <p className="text-xs text-rose-500 mb-3 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.prizes}</p>}

          <div className="space-y-3">
            {formData.prizes.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-32 px-3 py-2 text-sm border rounded-lg bg-gray-50 dark:bg-gray-800 font-semibold theme-text">
                  Rank {p.position}
                </div>
                <input 
                  type="number" 
                  min="0"
                  value={p.amount} 
                  onChange={(e) => updatePrize(idx, 'amount', e.target.value)} 
                  className="theme-input flex-1 px-3 py-2 text-sm border rounded-lg outline-none" 
                  placeholder="Prize Amount (₹)"
                />
                <button 
                  type="button" 
                  onClick={() => removePrize(idx)} 
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addPrize} 
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 bg-indigo-500/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-500/20"
            >
              <Plus className="w-4 h-4" /> Add Prize Tier
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold theme-text border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>
            5. Rules & Guidelines
          </h2>

          <div className="mb-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-2">
              <Lock className="w-3.5 h-3.5" />
              Mandatory Rules for {formData.venueType} Mode
            </div>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-indigo-900 dark:text-indigo-200">
              {MANDATORY_RULES[formData.venueType]?.map((mRule, idx) => (
                <li key={idx} className="font-medium">{mRule}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold theme-subtext uppercase">Additional Rules</label>
            {formData.customRules.map((rule, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={rule} 
                  onChange={(e) => updateCustomRule(idx, e.target.value)} 
                  className="theme-input flex-1 px-3 py-2 text-sm border rounded-lg outline-none" 
                  placeholder="Additional rule clause detail..."
                />
                <button 
                  type="button" 
                  onClick={() => removeCustomRule(idx)} 
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addCustomRule} 
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 bg-indigo-500/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-500/20"
            >
              <Plus className="w-4 h-4" /> Add Rule Clause
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button 
            type="button" 
            onClick={() => handleSubmit('draft')} 
            className="theme-hover theme-text px-4 py-2 text-xs font-bold rounded-lg border cursor-pointer"
            style={{ borderColor: 'var(--border-color)' }}
          >
            Save Draft
          </button>
          <button 
            type="button" 
            onClick={() => handleSubmit('published')} 
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
          >
            Publish Tournament
          </button>
        </div>
      </div>
    </div>
  );
}