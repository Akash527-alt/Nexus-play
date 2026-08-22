import React, { useState, useEffect, useRef } from 'react';
import { OrganizerSidebar } from './OrganizerSidebar';
import { Bell, Search, X, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export function OrganizerLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);

  const searchRef = useRef(null);
  const bellRef = useRef(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Team Registered', desc: 'Team Soul joined Nexus Invitational', time: '10m ago', type: 'info', unread: true },
    { id: 2, title: 'Match Result Pending', desc: 'Verify score for Semi-Final Match 2', time: '1h ago', type: 'alert', unread: true },
    { id: 3, title: 'Payment Confirmed', desc: 'Prize pool funds added to escrow', time: '3h ago', type: 'success', unread: false },
  ]);

  const [userProfile, setUserProfile] = useState({
    name: 'Organizer Pro',
    email: 'organizer@nexusplay.gg'
  });

  const searchableItems = [
    { type: 'Tournament', name: 'Nexus Invitational Season 1', link: '/organizer/tournaments/1' },
    { type: 'Page', name: 'Create New Tournament', link: '/organizer/tournaments/create' },
    { type: 'Page', name: 'Platform Settings', link: '/organizer/settings' },
    { type: 'Page', name: 'Organizer Profile', link: '/organizer/profile' },
  ];

  const filteredSearch = searchQuery.trim() === '' ? [] : searchableItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshProfileData = () => {
    const saved = localStorage.getItem('organizer_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name && parsed.email) {
          setUserProfile({ name: parsed.name, email: parsed.email });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    refreshProfileData();
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const hasUnread = notifications.some(n => n.unread);

  return (
    <div className="flex min-h-screen w-full transition-colors duration-200">
      <OrganizerSidebar />

      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        
        {/* Top Header Navbar */}
        <header className="theme-header h-16 border-b px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          
          {/* Functional Search Bar */}
          <div className="relative w-72" ref={searchRef}>
            <Search className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search tournaments, pages..." 
              className="theme-input w-full pl-9 pr-8 py-1.5 text-xs border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchQuery && (
              <X 
                onClick={() => setSearchQuery('')} 
                className="w-3.5 h-3.5 theme-subtext hover:opacity-100 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer" 
              />
            )}

            {/* Search Dropdown */}
            {isSearchOpen && searchQuery.trim().length > 0 && (
              <div className="theme-card absolute top-full left-0 mt-2 w-80 border rounded-xl shadow-lg p-2 z-50">
                <p className="text-[10px] font-bold theme-subtext uppercase px-2 py-1">Search Results</p>
                {filteredSearch.length > 0 ? (
                  <div className="space-y-1">
                    {filteredSearch.map((item, idx) => (
                      <div 
                        key={idx}
                        onClick={() => {
                          navigate(item.link);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="theme-hover p-2 rounded-lg cursor-pointer flex items-center justify-between"
                      >
                        <span className="text-xs font-semibold theme-text">{item.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white font-bold">{item.type}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs theme-subtext p-2 text-center">No matching results found.</p>
                )}
              </div>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-4">
            
            {/* Bell Icon Notification Trigger */}
            <div className="relative" ref={bellRef}>
              <button 
                onClick={() => setIsBellOpen(!isBellOpen)}
                className="theme-hover p-2 theme-subtext hover:theme-text rounded-lg relative cursor-pointer transition-colors"
              >
                <Bell className="w-4 h-4" />
                {hasUnread && (
                  <span className="w-2 h-2 bg-indigo-600 rounded-full absolute top-1.5 right-1.5 ring-2 ring-white animate-pulse"></span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {isBellOpen && (
                <div className="theme-card absolute right-0 mt-2 w-80 border rounded-2xl shadow-xl p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: 'var(--border-color)' }}>
                    <h3 className="text-xs font-bold theme-text">Notifications</h3>
                    {hasUnread && (
                      <button 
                        onClick={markAllRead} 
                        className="text-[10px] text-indigo-500 font-semibold hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className="p-2.5 rounded-xl border text-xs flex gap-2.5 transition-colors"
                        style={{ borderColor: 'var(--border-color)' }}
                      >
                        {n.type === 'info' && <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />}
                        {n.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                        {n.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-bold theme-text leading-tight">{n.title}</p>
                          <p className="text-[11px] theme-subtext mt-0.5">{n.desc}</p>
                          <span className="text-[9px] theme-subtext mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="h-5 w-px" style={{ backgroundColor: 'var(--border-color)' }} />

            {/* Profile Avatar Pill */}
            <div 
              onClick={() => navigate('/organizer/profile')} 
              className="theme-hover flex items-center gap-2.5 cursor-pointer p-1.5 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {getInitials(userProfile.name)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold theme-text leading-tight">{userProfile.name}</p>
                <p className="text-[10px] theme-subtext">{userProfile.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 w-full max-w-full">
          {children}
        </main>

        <footer className="theme-header border-t py-4 px-8 text-xs theme-subtext flex flex-col sm:flex-row items-center justify-between gap-2 mt-auto">
          <p>© {new Date().getFullYear()} NexusPlay Esports. All rights reserved.</p>
          <div className="flex items-center gap-4 font-medium">
            <a href="#" className="hover:text-indigo-500">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-500">Terms of Service</a>
            <a href="#" className="hover:text-indigo-500">Support</a>
          </div>
        </footer>

      </div>
    </div>
  );
}