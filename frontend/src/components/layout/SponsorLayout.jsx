import React, { useState, useEffect, useRef } from "react";
import { SponsorSidebar } from "./SponsorSidebar";
import {
  Menu,
  Moon,
  Sun,
  Bell,
  Search,
  X,
  CheckCircle,
  Info,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export function SponsorLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Open on desktop, closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 768;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);

  const searchRef = useRef(null);
  const bellRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Sponsorship Approved",
      desc: "Apex Gaming Club approved your sponsorship request.",
      time: "25m ago",
      type: "success",
      unread: true,
    },
    {
      id: 2,
      title: "Milestone Verified",
      desc: "Broadcast deliverables met for BGMI Champions Series.",
      time: "2h ago",
      type: "info",
      unread: true,
    },
  ]);

  const searchableItems = [
    {
      type: "Page",
      name: "Browse Tournaments",
      link: "/sponsor/tournaments",
    },
    {
      type: "Page",
      name: "My Sponsorships",
      link: "/sponsor/sponsorships",
    },
    {
      type: "Page",
      name: "ROI Analytics",
      link: "/sponsor/analytics",
    },
    {
      type: "Page",
      name: "Company Profile",
      link: "/sponsor/profile",
    },
  ];

  const filteredSearch =
    searchQuery.trim() === ""
      ? []
      : searchableItems.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        );

  /* -------------------------------------------------
     Close dropdowns when clicking outside
  ------------------------------------------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }

      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsBellOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* -------------------------------------------------
     Keep sidebar behavior correct when resizing
  ------------------------------------------------- */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /* -------------------------------------------------
     Prevent background scrolling when mobile drawer
     is open
  ------------------------------------------------- */
  useEffect(() => {
    if (window.innerWidth < 768 && isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const hasUnread = notifications.some((n) => n.unread);

  const handleSidebarNavigate = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full theme-bg theme-text transition-colors duration-200">
      {/* =====================================================
          MOBILE SIDEBAR BACKDROP
      ====================================================== */}
      {isSidebarOpen && (
        <div
          onClick={() => {
            if (window.innerWidth < 768) {
              setIsSidebarOpen(false);
            }
          }}
          className="
            fixed inset-0
            bg-black/50
            backdrop-blur-[2px]
            z-40
            md:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}
      {isSidebarOpen && (
        <div
          className="
            fixed
            left-0
            top-0
            bottom-0
            z-50

            md:sticky
            md:top-0
            md:z-40
            md:h-screen
            md:shrink-0

            shadow-2xl
            md:shadow-none
          "
        >
          <SponsorSidebar onNavigate={handleSidebarNavigate} />
        </div>
      )}

      {/* =====================================================
          MAIN COLUMN
      ====================================================== */}
      <div className="flex-1 flex flex-col min-w-0 w-full overflow-x-hidden">
        {/* =====================================================
            TOP NAVBAR
        ====================================================== */}
        <header
          className="
            theme-header
            h-16
            border-b theme-border
            px-3 sm:px-4 md:px-6
            flex items-center justify-between
            sticky top-0
            z-30
            shadow-xs
          "
        >
          {/* LEFT SIDE */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="
                p-2
                theme-icon-box
                border theme-border
                rounded-lg
                text-sm
                theme-text
                hover:bg-indigo-500/10
                transition
                cursor-pointer
                shrink-0
              "
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div
              className="
                relative
                w-[150px]
                sm:w-48
                md:w-72
              "
              ref={searchRef}
            >
              <Search className="w-4 h-4 theme-subtext absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search tournaments..."
                className="
                  theme-input
                  w-full
                  pl-9
                  pr-8
                  py-2
                  text-xs
                  border theme-border
                  rounded-lg
                  outline-none
                  focus:ring-2
                  focus:ring-indigo-500/20
                  bg-transparent
                "
              />

              {searchQuery && (
                <X
                  onClick={() => setSearchQuery("")}
                  className="
                    w-3.5 h-3.5
                    theme-subtext
                    hover:opacity-100
                    absolute
                    right-2.5
                    top-1/2
                    -translate-y-1/2
                    cursor-pointer
                  "
                />
              )}

              {/* Search Dropdown */}
              {isSearchOpen && searchQuery.trim().length > 0 && (
                <div
                  className="
                    theme-card
                    absolute
                    top-full
                    left-0
                    mt-2
                    w-[260px]
                    sm:w-80
                    max-w-[calc(100vw-24px)]
                    border theme-border
                    rounded-xl
                    shadow-lg
                    p-2
                    z-50
                  "
                >
                  <p className="text-[10px] font-bold theme-subtext uppercase px-2 py-1">
                    Search Results
                  </p>

                  {filteredSearch.length > 0 ? (
                    <div className="space-y-1">
                      {filteredSearch.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            navigate(item.link);
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="
                            theme-hover
                            p-2
                            rounded-lg
                            cursor-pointer
                            flex items-center justify-between
                            gap-2
                          "
                        >
                          <span className="text-xs font-semibold theme-text">
                            {item.name}
                          </span>

                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white font-bold">
                            {item.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs theme-subtext p-2 text-center">
                      No matching results found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              RIGHT SIDE
          ====================================================== */}
          <div className="flex items-center gap-1 sm:gap-3 md:gap-4 shrink-0">
            {/* Theme */}
            <button
              onClick={toggleTheme}
              className="
                theme-hover
                p-2
                theme-subtext
                hover:theme-text
                rounded-lg
                transition-colors
                cursor-pointer
              "
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setIsBellOpen(!isBellOpen)}
                className="
                  theme-hover
                  p-2
                  theme-subtext
                  hover:theme-text
                  rounded-lg
                  relative
                  cursor-pointer
                  transition-colors
                "
              >
                <Bell className="w-4 h-4" />

                {hasUnread && (
                  <span
                    className="
                      w-2 h-2
                      bg-indigo-600
                      rounded-full
                      absolute
                      top-1.5
                      right-1.5
                      ring-2
                      ring-white
                      animate-pulse
                    "
                  />
                )}
              </button>

              {isBellOpen && (
                <div
                  className="
                    theme-card
                    absolute
                    right-0
                    mt-2
                    w-[290px]
                    sm:w-80
                    max-w-[calc(100vw-24px)]
                    border theme-border
                    rounded-2xl
                    shadow-xl
                    p-4
                    z-50
                    space-y-3
                  "
                >
                  <div className="flex items-center justify-between border-b theme-border pb-2">
                    <h3 className="text-xs font-bold theme-text">
                      Notifications
                    </h3>

                    <button
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((n) => ({
                            ...n,
                            unread: false,
                          })),
                        )
                      }
                      className="
                        text-[10px]
                        text-indigo-400
                        font-semibold
                        hover:underline
                        cursor-pointer
                      "
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="
                          p-2.5
                          rounded-xl
                          border theme-border
                          text-xs
                          flex gap-2.5
                        "
                      >
                        {n.type === "success" ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        )}

                        <div>
                          <p className="font-bold theme-text leading-tight">
                            {n.title}
                          </p>

                          <p className="text-[11px] theme-subtext mt-0.5">
                            {n.desc}
                          </p>

                          <span className="text-[9px] theme-subtext mt-1 block">
                            {n.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-5 w-px bg-gray-300 dark:bg-gray-700" />

            {/* Sponsor Profile */}
            <div
              onClick={() => navigate("/sponsor/profile")}
              className="
                theme-hover
                flex items-center
                gap-2
                cursor-pointer
                p-1.5
                rounded-xl
                transition-colors
                border theme-border
              "
            >
              <div
                className="
                  w-8 h-8
                  rounded-lg
                  bg-gradient-to-tr
                  from-indigo-600
                  to-purple-600
                  text-white
                  font-bold
                  flex items-center justify-center
                  text-xs
                  shadow-xs
                  shrink-0
                "
              >
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "SP"}
              </div>

              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold theme-text leading-tight">
                  {user?.name || "Sponsor"}
                </p>

                <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  Brand Partner
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* =====================================================
            PAGE CONTENT
        ====================================================== */}
        <main
          className="
            flex-1
            p-4
            sm:p-5
            md:p-8
            w-full
            max-w-full
          "
        >
          {children}
        </main>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <footer
          className="
            theme-header
            border-t theme-border
            py-4
            px-4
            md:px-8
            text-xs
            theme-subtext
            flex flex-col
            sm:flex-row
            items-center
            justify-between
            gap-2
            mt-auto
            text-center
            sm:text-left
          "
        >
          <p>
            © {new Date().getFullYear()} NexusPlay Esports Engine · Commercial
            Sponsor Suite
          </p>

          <div className="flex items-center gap-4 font-medium">
            <a href="#" className="hover:text-indigo-400">
              Partnership Terms
            </a>

            <a href="#" className="hover:text-indigo-400">
              Brand Escrow
            </a>

            <a href="#" className="hover:text-indigo-400">
              Support
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SponsorLayout;
