import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tournamentService } from '../../services/tournamentService';
import { Plus, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';

export function CreateTournamentPage() {
  const navigate = useNavigate();
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    game: 'Valorant',
    type: 'Single Elimination',
    startDate: '',
    endDate: '',
    venue: 'Online',
    city: 'Mumbai',
    registrationFee: 0,
    registrationDeadline: '',
    maxTeams: 16,
    teamSize: 5,
    description: '',
    bannerUrl: 'https://picsum.photos/1200/400?gaming',
    prizes: [
      { position: '1st Place', amount: 50000 },
      { position: '2nd Place', amount: 25000 }
    ],
    rules: ['Players must check in 30 minutes before match start.']
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

  const addPrize = () => {
    setFormData(prev => ({
      ...prev,
      prizes: [...prev.prizes, { position: `${prev.prizes.length + 1}th Place`, amount: 5000 }]
    }));
    if (errors.prizes) setErrors(prev => ({ ...prev, prizes: null }));
  };

  const updatePrize = (index, key, val) => {
    const updated = [...formData.prizes];
    updated[index][key] = key === 'amount' ? Number(val) : val;
    setFormData(prev => ({ ...prev, prizes: updated }));
  };

  const removePrize = (index) => {
    if (formData.prizes.length <= 1) {
      setErrors(prev => ({ ...prev, prizes: 'At least one prize tier is required.' }));
      return;
    }
    setFormData(prev => ({ ...prev, prizes: prev.prizes.filter((_, i) => i !== index) }));
  };

  const addRule = () => {
    setFormData(prev => ({ ...prev, rules: [...prev.rules, ''] }));
    if (errors.rules) setErrors(prev => ({ ...prev, rules: null }));
  };

  const updateRule = (index, val) => {
    const updated = [...formData.rules];
    updated[index] = val;
    setFormData(prev => ({ ...prev, rules: updated }));
  };

  const removeRule = (index) => {
    if (formData.rules.length <= 1) {
      setErrors(prev => ({ ...prev, rules: 'At least one rule clause is required.' }));
      return;
    }
    setFormData(prev => ({ ...prev, rules: prev.rules.filter((_, i) => i !== index) }));
  };

  const calculateTotalPrize = () => formData.prizes.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Tournament name is required';
    if (!formData.game) newErrors.game = 'Please select a valid game';
    if (!formData.type) newErrors.type = 'Please select a tournament format';

    // Date Validations
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date must be on or after start date';
    }

    if (!formData.registrationDeadline) {
      newErrors.registrationDeadline = 'Registration deadline is required';
    } else if (formData.startDate && formData.registrationDeadline > formData.startDate) {
      newErrors.registrationDeadline = 'Deadline must be before or on the tournament start date';
    }

    // Number Validations
    if (Number(formData.registrationFee) < 0) newErrors.registrationFee = 'Fee cannot be negative';
    if (Number(formData.maxTeams) <= 1) newErrors.maxTeams = 'Must have at least 2 teams';
    if (Number(formData.teamSize) <= 0) newErrors.teamSize = 'Team size must be at least 1';

    // Prize Pool Validation
    if (formData.prizes.length === 0) {
      newErrors.prizes = 'At least one prize tier is required';
    } else if (formData.prizes.some(p => !p.position || Number(p.amount) <= 0)) {
      newErrors.prizes = 'All prizes must have a title and amount greater than 0';
    }

    // Rules Validation
    if (formData.rules.length === 0 || formData.rules.some(r => !r.trim())) {
      newErrors.rules = 'Rules cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status = 'Upcoming') => {
    if (!validateForm()) return;

    const payload = {
      title: formData.name,
      game: formData.game,
      tournamentType: formData.teamSize > 1 ? 'team' : 'solo',
      format: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      venue: `${formData.venue} (${formData.city})`,
      entryFee: Number(formData.registrationFee),
      registrationDeadline: formData.registrationDeadline,
      maxParticipants: Number(formData.maxTeams),
      teamSize: Number(formData.teamSize),
      description: formData.description,
      bannerUrl: formData.bannerUrl,
      prizes: formData.prizes,
      rules: formData.rules.join('\n'),
      status: status.toLowerCase(),
      totalPrizePool: calculateTotalPrize()
    };

    try {
      await tournamentService.create(payload);
      alert(`Tournament successfully created as ${status}!`);
      navigate('/organizer/tournaments');
    } catch (err) {
      console.error('Failed to save tournament:', err);
      alert('Error creating tournament. Please try again.');
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
          <p className="text-sm theme-subtext">Configure parameters, prizes, and competitive structure.</p>
        </div>
      </div>

      <div className="theme-card space-y-6 p-8 rounded-2xl border shadow-xs">
        {/* Basic Details */}
        <div>
          <h2 className="text-base font-bold theme-text border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>1. Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Tournament Name *</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                className={`theme-input w-full px-3.5 py-2 text-sm border rounded-lg focus:ring-2 outline-none ${errors.name ? 'border-rose-500 focus:ring-rose-200' : 'focus:ring-blue-500'}`} 
                placeholder="e.g. Nexus Invitational Season 1" 
              />
              {errors.name && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Esports Game *</label>
              <select name="game" value={formData.game} onChange={handleInputChange} className="theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none">
                <option value="Valorant">Valorant</option>
                <option value="BGMI">BGMI</option>
                <option value="Counter-Strike 2">Counter-Strike 2</option>
                <option value="Rocket League">Rocket League</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Tournament Format *</label>
              <select name="type" value={formData.type} onChange={handleInputChange} className="theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none">
                <option value="Single Elimination">Single Elimination</option>
                <option value="Double Elimination">Double Elimination</option>
                <option value="Battle Royale Points">Battle Royale Points</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Description</label>
              <textarea 
                name="description" 
                rows="3" 
                value={formData.description} 
                onChange={handleInputChange} 
                className="theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none"
                placeholder="Detailed tournament overview..."
              />
            </div>
          </div>
        </div>

        {/* Schedule & Venue */}
        <div>
          <h2 className="text-base font-bold theme-text border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>2. Schedule & Venue</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Start Date *</label>
              <input type="date" min={todayStr} name="startDate" value={formData.startDate} onChange={handleInputChange} className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.startDate ? 'border-rose-500' : ''}`} />
              {errors.startDate && <p className="text-xs text-rose-500 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">End Date *</label>
              <input type="date" min={formData.startDate || todayStr} name="endDate" value={formData.endDate} onChange={handleInputChange} className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.endDate ? 'border-rose-500' : ''}`} />
              {errors.endDate && <p className="text-xs text-rose-500 mt-1">{errors.endDate}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Reg. Deadline *</label>
              <input type="date" min={todayStr} max={formData.startDate || undefined} name="registrationDeadline" value={formData.registrationDeadline} onChange={handleInputChange} className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.registrationDeadline ? 'border-rose-500' : ''}`} />
              {errors.registrationDeadline && <p className="text-xs text-rose-500 mt-1">{errors.registrationDeadline}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Venue Platform</label>
              <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} className="theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none" placeholder="e.g. Online / Custom Room" />
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">City / Region</label>
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none" placeholder="e.g. Mumbai" />
            </div>
          </div>
        </div>

        {/* Registration & Slots */}
        <div>
          <h2 className="text-base font-bold theme-text border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>3. Registration & Slots</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Registration Fee (₹)</label>
              <input type="number" min="0" name="registrationFee" value={formData.registrationFee} onChange={handleInputChange} className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.registrationFee ? 'border-rose-500' : ''}`} />
              {errors.registrationFee && <p className="text-xs text-rose-500 mt-1">{errors.registrationFee}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Max Teams / Slots</label>
              <input type="number" min="2" name="maxTeams" value={formData.maxTeams} onChange={handleInputChange} className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.maxTeams ? 'border-rose-500' : ''}`} />
              {errors.maxTeams && <p className="text-xs text-rose-500 mt-1">{errors.maxTeams}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold theme-subtext uppercase mb-1">Team Size (Players)</label>
              <input type="number" min="1" name="teamSize" value={formData.teamSize} onChange={handleInputChange} className={`theme-input w-full px-3 py-2 text-sm border rounded-lg outline-none ${errors.teamSize ? 'border-rose-500' : ''}`} />
              {errors.teamSize && <p className="text-xs text-rose-500 mt-1">{errors.teamSize}</p>}
            </div>
          </div>
        </div>

        {/* Prize Pool Distribution */}
        <div>
          <div className="flex justify-between items-center border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>
            <h2 className="text-base font-bold theme-text">4. Prize Pool Distribution</h2>
            <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
              Total: ₹{calculateTotalPrize().toLocaleString('en-IN')}
            </span>
          </div>
          
          {errors.prizes && <p className="text-xs text-rose-500 mb-3 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.prizes}</p>}

          <div className="space-y-3">
            {formData.prizes.map((p, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={p.position} 
                  onChange={(e) => updatePrize(idx, 'position', e.target.value)} 
                  className="theme-input flex-1 px-3 py-2 text-sm border rounded-lg outline-none" 
                  placeholder="Position Name"
                />
                <input 
                  type="number" 
                  min="1"
                  value={p.amount} 
                  onChange={(e) => updatePrize(idx, 'amount', e.target.value)} 
                  className="theme-input w-40 px-3 py-2 text-sm border rounded-lg outline-none" 
                  placeholder="Amount"
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

        {/* Rules */}
        <div>
          <h2 className="text-base font-bold theme-text border-b pb-2 mb-4" style={{ borderColor: 'var(--border-color)' }}>5. Rules & Guidelines</h2>
          {errors.rules && <p className="text-xs text-rose-500 mb-3 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.rules}</p>}
          <div className="space-y-3">
            {formData.rules.map((rule, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={rule} 
                  onChange={(e) => updateRule(idx, e.target.value)} 
                  className="theme-input flex-1 px-3 py-2 text-sm border rounded-lg outline-none" 
                  placeholder="Rule clause detail..."
                />
                <button 
                  type="button" 
                  onClick={() => removeRule(idx)} 
                  className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={addRule} 
              className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 bg-indigo-500/10 px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-500/20"
            >
              <Plus className="w-4 h-4" /> Add Rule Clause
            </button>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t" style={{ borderColor: 'var(--border-color)' }}>
          <button 
            type="button" 
            onClick={() => handleSubmit('Draft')} 
            className="theme-hover theme-text px-4 py-2 text-xs font-bold rounded-lg border cursor-pointer"
            style={{ borderColor: 'var(--border-color)' }}
          >
            Save Draft
          </button>
          <button 
            type="button" 
            onClick={() => handleSubmit('Upcoming')} 
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
          >
            Publish Tournament
          </button>
        </div>
      </div>
    </div>
  );
}