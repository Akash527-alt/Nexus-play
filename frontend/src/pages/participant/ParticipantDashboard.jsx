import React, { useState } from 'react';

export const ParticipantDashboard = () => {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [notification, setNotification] = useState('');

  // Search & Filter States
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('all'); // 'all', 'online', 'offline'
  const [pricing, setPricing] = useState('all'); // 'all', 'free', 'paid'

  // Tournaments Data
  const [tournaments] = useState([
    { id: '1', title: 'Valorant Championship 2026', mode: 'online', type: 'paid', entryFee: 200, date: '2026-09-02', organizer: 'eSports Club' },
    { id: '2', title: 'College BGMI LAN Battle', mode: 'offline', type: 'free', entryFee: 0, date: '2026-09-05', organizer: 'Gaming Arena' },
    { id: '3', title: 'Chess Masters Speedrun', mode: 'online', type: 'free', entryFee: 0, date: '2026-09-10', organizer: 'MindSports' },
    { id: '4', title: 'Tekken 8 Offline Showdown', mode: 'offline', type: 'paid', entryFee: 150, date: '2026-09-15', organizer: 'Arcade Zone' }
  ]);

  // Match History Data
  const [history] = useState([
    { id: '101', title: 'Overwatch Cyber Cup', date: '2026-08-10', mode: 'online', status: 'Won', prize: '₹2,000' },
    { id: '102', title: 'EA FC 26 FIFA Night', date: '2026-07-20', mode: 'offline', status: 'Lost', prize: 'Runner Up' }
  ]);

  // Filter Logic
  const filteredTournaments = tournaments.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesMode = mode === 'all' || t.mode === mode;
    const matchesPricing = pricing === 'all' || (pricing === 'free' ? t.entryFee === 0 : t.entryFee > 0);
    return matchesSearch && matchesMode && matchesPricing;
  });

  // Registration & Payment Handler
  const handleRegister = (t) => {
    if (t.entryFee === 0) {
      setNotification(`Successfully registered for ${t.title}! Confirmation email sent.`);
      setSelectedTournament(null);
    } else {
      // GPay / PhonePe / UPI Direct Intent Redirect
      const upiId = "nexusplay@upi";
      const name = encodeURIComponent("Nexus Play Tournaments");
      const note = encodeURIComponent(`Registration for ${t.title}`);
      const upiUrl = `upi://pay?pa=${upiId}&pn=${name}&tn=${note}&am=${t.entryFee}&cu=INR`;

      // Redirect to GPay or installed UPI app
      window.location.href = upiUrl;

      // Simulate completion check for frontend testing
      setTimeout(() => {
        const confirmed = window.confirm("Did you complete the payment on GPay?");
        if (confirmed) {
          setNotification(`Payment successful! Registered for ${t.title}. Confirmation email sent.`);
        } else {
          setNotification("Payment was cancelled or failed.");
        }
        setSelectedTournament(null);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Level Up Your Competition</h1>
            <p className="text-slate-400 text-xs mt-1">Explore active esports events, track match performances, and manage tournament slots.</p>
          </div>
          
          {/* Main Navigation Tabs */}
          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'browse' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Browse Tournaments
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Match History
            </button>
          </div>
        </div>

        {/* Status Notification Banner */}
        {notification && (
          <div className="bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-4 py-3 rounded-xl mb-6 text-xs flex justify-between items-center">
            <span>{notification}</span>
            <button onClick={() => setNotification('')} className="font-bold hover:text-white">✕</button>
          </div>
        )}

        {/* Tab 1: Tournaments & Search */}
        {activeTab === 'browse' ? (
          <>
            {/* Search and Filters Bar */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-8 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg">
              
              {/* Search Input */}
              <input
                type="text"
                placeholder="Search tournaments by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-1/3 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />

              {/* Filters Group */}
              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                
                {/* Mode Filter: Online / Offline */}
                <div className="flex bg-slate-800 p-1 rounded-xl text-xs border border-slate-700/50">
                  {['all', 'online', 'offline'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`px-3 py-1 rounded-lg capitalize font-bold transition ${
                        mode === m ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Type Filter: Free / Paid */}
                <div className="flex bg-slate-800 p-1 rounded-xl text-xs border border-slate-700/50">
                  {['all', 'free', 'paid'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPricing(p)}
                      className={`px-3 py-1 rounded-lg capitalize font-bold transition ${
                        pricing === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Tournament Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.length > 0 ? (
                filteredTournaments.map((t) => (
                  <div key={t.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition shadow-xl">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          t.mode === 'online' 
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {t.mode}
                        </span>
                        <span className="text-xs font-black text-emerald-400">
                          {t.entryFee === 0 ? 'FREE' : `₹${t.entryFee}`}
                        </span>
                      </div>
                      <h3 className="text-base font-bold mb-1 text-slate-100">{t.title}</h3>
                      <p className="text-xs text-slate-400 mb-4">Date: {t.date} • By {t.organizer}</p>
                    </div>

                    <button
                      onClick={() => setSelectedTournament(t)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition"
                    >
                      Register Now
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 text-xs">
                  No tournaments match your search or filter criteria.
                </div>
              )}
            </div>
          </>
        ) : (
          
          /* Tab 2: Match History Section */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 font-bold text-sm">Match History & Results</div>
            <div className="divide-y divide-slate-800">
              {history.map((h) => (
                <div key={h.id} className="p-4 flex justify-between items-center hover:bg-slate-800/40 transition">
                  <div>
                    <h4 className="font-bold text-xs text-slate-200">{h.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{h.date} • Mode: <span className="uppercase">{h.mode}</span></p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                      h.status === 'Won' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {h.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">Reward: {h.prize}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Confirmation / Payment Modal */}
      {selectedTournament && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full text-white shadow-2xl">
            <h3 className="text-lg font-bold mb-1">{selectedTournament.title}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Mode: <span className="uppercase text-indigo-400 font-bold">{selectedTournament.mode}</span>
            </p>
            
            <div className="bg-slate-800 p-4 rounded-xl mb-6 flex justify-between items-center border border-slate-700/50">
              <span className="text-xs text-slate-300">Registration Fee:</span>
              <span className="text-lg font-extrabold text-emerald-400">
                {selectedTournament.entryFee === 0 ? 'FREE' : `₹${selectedTournament.entryFee}`}
              </span>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setSelectedTournament(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition">
                Cancel
              </button>
              <button 
                onClick={() => handleRegister(selectedTournament)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-bold transition">
                {selectedTournament.entryFee === 0 ? 'Confirm Spot' : 'Pay via GPay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};