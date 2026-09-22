import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Sun,
  Moon,
  Gamepad2,
  Trophy,
  ClipboardList,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService.js";

export const ParticipantLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  /*
    Desktop:
    true  = expanded sidebar
    false = collapsed sidebar

    Mobile:
    true  = drawer open
    false = drawer closed
  */
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isDark = theme === "dark";

  // =========================================================
  // TEXT COLORS
  // =========================================================

  const primaryText = isDark ? "text-white" : "text-slate-950";

  const secondaryText = isDark ? "text-slate-300" : "text-slate-700";

  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  // =========================================================
  // NAVIGATION ITEMS
  // =========================================================

  const navItems = [
    {
      label: "Dashboard",
      path: "/participant/dashboard",
      icon: Gamepad2,
    },
    {
      label: "Tournaments",
      path: "/participant/tournaments",
      icon: Trophy,
    },
    {
      label: "Participation History",
      path: "/participant/history",
      icon: ClipboardList,
    },
    {
      label: "Profile",
      path: "/participant/profile",
      icon: User,
    },
    {
      label: "Settings",
      path: "/participant/settings",
      icon: Settings,
    },
  ];

  // =========================================================
  // PAGE TITLE
  // =========================================================

  const getPageTitle = () => {
    const segment = location.pathname.split("/")[2];

    switch (segment) {
      case "tournaments":
        return "Explore Tournaments";

      case "history":
        return "Tournament History";

      case "profile":
        return "Player Profile";

      case "settings":
        return "Account Settings";

      default:
        return "Player Dashboard";
    }
  };

  // =========================================================
  // USER NAME
  // =========================================================

  const getUserName = () => {
    return user?.fullName || user?.name || user?.username || "Player";
  };

  // =========================================================
  // USER INITIALS
  // =========================================================

  const getUserInitials = () => {
    const name = getUserName().trim();

    if (!name) {
      return "P";
    }

    const parts = name.split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return name.substring(0, 2).toUpperCase();
  };

  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigation = () => {
    // Only close drawer on mobile.
    // Desktop sidebar remains in its current state.
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      await authService.logoutUser();

      toast.success("Logged out successfully");

      setIsSidebarOpen(false);

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen theme-bg theme-text font-sans overflow-x-hidden">
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsSidebarOpen(false)}
          className="
            fixed
            inset-0
            bg-black/50
            z-40
            md:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
          Fixed on desktop and mobile.
      ====================================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          bottom-0
          z-50

          ${isSidebarOpen ? "w-72" : "w-0 md:w-[76px]"}

          theme-card
          border-r
          theme-border

          flex
          flex-col

          overflow-hidden

          transition-all
          duration-300
          ease-in-out

          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        {/* ===================================================
            SIDEBAR HEADER
        ================================================== */}

        <div
          className={`
            h-20
            px-5
            border-b
            theme-border
            flex
            items-center
            shrink-0

            ${isSidebarOpen ? "justify-between" : "justify-center"}
          `}
        >
          {isSidebarOpen ? (
            <Link
              to="/participant/dashboard"
              onClick={handleNavigation}
              className="flex items-center gap-3 min-w-0"
            >
              <div
                className="
                  w-10
                  h-10
                  bg-indigo-600
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  text-white
                  shadow-md
                  shrink-0
                "
              >
                <Gamepad2 className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <h1
                  className={`
                    text-sm
                    font-extrabold
                    tracking-wide
                    ${primaryText}
                  `}
                >
                  NEXUS PLAY
                </h1>

                <p
                  className={`
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-widest
                    ${mutedText}
                  `}
                >
                  Student Arena
                </p>
              </div>
            </Link>
          ) : (
            <div
              className="
                w-10
                h-10
                bg-indigo-600
                rounded-xl
                flex
                items-center
                justify-center
                text-white
              "
            >
              <Gamepad2 className="w-5 h-5" />
            </div>
          )}

          {/* Mobile close button */}

          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            className="
              md:hidden
              w-9
              h-9
              theme-icon-box
              border
              theme-border
              rounded-xl
              flex
              items-center
              justify-center
            "
            aria-label="Close menu"
          >
            <X className={`w-5 h-5 ${primaryText}`} />
          </button>
        </div>

        {/* ===================================================
            NAVIGATION
        ================================================== */}

        <div className="flex-1 overflow-y-auto px-3 py-6">
          {isSidebarOpen && (
            <p
              className={`
                px-3
                mb-3
                text-[10px]
                uppercase
                tracking-widest
                font-bold
                ${mutedText}
              `}
            >
              Menu
            </p>
          )}

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(`${item.path}/`);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleNavigation}
                  title={!isSidebarOpen ? item.label : ""}
                  className={`
                    group
                    flex
                    items-center

                    ${isSidebarOpen ? "gap-3 px-3.5" : "justify-center px-2"}

                    py-3
                    rounded-xl
                    text-xs
                    font-bold
                    transition-all
                    duration-200

                    ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-md"
                        : `${secondaryText} hover:text-indigo-500 theme-hover`
                    }
                  `}
                >
                  <Icon
                    className={`
                      w-5
                      h-5
                      shrink-0

                      ${isActive ? "text-white" : "group-hover:text-indigo-500"}
                    `}
                  />

                  {isSidebarOpen && (
                    <>
                      <span className="flex-1">{item.label}</span>

                      {isActive && (
                        <ChevronRight className="w-4 h-4 opacity-80" />
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ===================================================
            FIXED BOTTOM USER SECTION
        ================================================== */}

        <div
          className="
            border-t
            theme-border
            p-4
            shrink-0
            bg-inherit
          "
        >
          <div
            className={`
              flex
              items-center

              ${isSidebarOpen ? "gap-3" : "justify-center"}
            `}
          >
            {/* Avatar */}

            <div
              className="
                w-10
                h-10
                rounded-full
                bg-indigo-600/10
                border
                border-indigo-500/30
                flex
                items-center
                justify-center
                text-xs
                font-bold
                text-indigo-500
                shrink-0
              "
            >
              {getUserInitials()}
            </div>

            {/* User Details */}

            {isSidebarOpen && (
              <>
                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      text-xs
                      font-bold
                      truncate
                      ${primaryText}
                    `}
                  >
                    {getUserName()}
                  </p>

                  <p className="text-[10px] text-emerald-500 font-semibold">
                    ● Online
                  </p>
                </div>

                {/* LOGOUT BUTTON */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    items-center
                    gap-2

                    px-3
                    py-2

                    rounded-lg

                    theme-icon-box
                    border
                    theme-border

                    text-xs
                    font-bold

                    theme-subtext

                    hover:text-red-500
                    hover:border-red-500/30

                    transition
                    cursor-pointer
                  "
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />

                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
          Margin changes according to desktop sidebar width.
      ====================================================== */}

      <main
        className={`
          min-h-screen
          flex
          flex-col

          transition-all
          duration-300
          ease-in-out

          ${isSidebarOpen ? "md:ml-72" : "md:ml-[76px]"}
        `}
      >
        {/* ===================================================
            HEADER
        ================================================== */}

        <header
          className="
            sticky
            top-0
            z-30

            h-16
            md:h-20

            theme-card
            border-b
            theme-border

            flex
            items-center
            justify-between

            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* LEFT */}

          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger */}

            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="
                w-10
                h-10
                theme-icon-box
                border
                theme-border
                rounded-xl

                flex
                items-center
                justify-center

                hover:bg-indigo-500/10

                transition
                shrink-0
              "
              title={isSidebarOpen ? "Collapse menu" : "Open menu"}
            >
              {isSidebarOpen ? (
                <X className={`w-5 h-5 ${primaryText}`} />
              ) : (
                <Menu className={`w-5 h-5 ${primaryText}`} />
              )}
            </button>

            {/* Page title */}

            <h2
              className={`
                text-sm
                md:text-base
                font-bold
                tracking-wide
                truncate
                ${primaryText}
              `}
            >
              {getPageTitle()}
            </h2>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2 md:gap-3">
            {/* Theme Toggle */}

            <button
              type="button"
              onClick={toggleTheme}
              className="
                w-9
                h-9
                md:w-10
                md:h-10

                theme-icon-box
                border
                theme-border
                rounded-xl

                flex
                items-center
                justify-center

                hover:bg-indigo-500/10

                transition
              "
              title="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-white" />
              ) : (
                <Moon className="w-4 h-4 text-slate-900" />
              )}
            </button>

            {/* Profile */}

            <Link
              to="/participant/profile"
              className="
                w-9
                h-9
                md:w-10
                md:h-10

                bg-indigo-600/10

                border
                border-indigo-500/30

                rounded-xl

                flex
                items-center
                justify-center

                text-indigo-600

                text-xs
                font-bold

                hover:bg-indigo-600
                hover:text-white

                transition
              "
              title="Profile"
            >
              {getUserInitials()}
            </Link>
          </div>
        </header>

        {/* ===================================================
            PAGE CONTENT
        ================================================== */}

        <div
          className="
            flex-1
            w-full

            px-4
            py-5

            sm:px-6

            md:px-8
            md:py-8
          "
        >
          <div className="w-full max-w-[1500px] mx-auto">{children}</div>
        </div>

        {/* ===================================================
            FOOTER
        ================================================== */}

        <footer
          className={`
            theme-card
            border-t
            theme-border

            px-4
            sm:px-6
            md:px-8

            py-4

            text-[10px]
            sm:text-[11px]

            ${mutedText}

            flex
            flex-col
            sm:flex-row

            items-center
            justify-between

            gap-2

            text-center
            sm:text-left
          `}
        >
          <p>© 2026 Nexus Play Esports Engine.</p>

          <p>Student Participant Portal</p>
        </footer>
      </main>
    </div>
  );
};

export default ParticipantLayout;
