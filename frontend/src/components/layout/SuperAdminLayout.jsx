import React, { useState, useEffect, useRef } from "react";
import { SuperAdminSidebar } from "./SuperAdminSidebar";
import {
  Menu,
  Moon,
  Sun,
  Bell,
  Search,
  X,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export function SuperAdminLayout({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);

  const searchRef = useRef(null);
  const bellRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "KYC Verification Needed",
      desc: "Vanguard Collegiate League submitted official organization papers.",
      time: "15m ago",
      type: "alert",
      unread: true,
    },
    {
      id: 2,
      title: "Escrow Deposit Confirmed",
      desc: "$5,000 received from Razer Gaming Tech for Valorant Masters.",
      time: "1h ago",
      type: "success",
      unread: true,
    },
    {
      id: 3,
      title: "New Flagged Report",
      desc: "User Vikram Malhotra flagged for multi-account abuse.",
      time: "3h ago",
      type: "alert",
      unread: false,
    },
  ]);

  const searchableItems = [
    {
      type: "Module",
      name: "Users Directory",
      link: "/superadmin/users",
    },
    {
      type: "Module",
      name: "Organizers KYC",
      link: "/superadmin/organizers",
    },
    {
      type: "Module",
      name: "Tournaments Moderation",
      link: "/superadmin/tournaments",
    },
    {
      type: "Module",
      name: "Corporate Sponsors",
      link: "/superadmin/sponsors",
    },
    {
      type: "Module",
      name: "Sponsorships",
      link: "/superadmin/sponsorships",
    },
    {
      type: "Module",
      name: "Payments & Escrow",
      link: "/superadmin/payments",
    },
    {
      type: "Module",
      name: "Platform Reports",
      link: "/superadmin/reports",
    },
    {
      type: "Module",
      name: "Platform Settings",
      link: "/superadmin/settings",
    },
  ];

  const filteredSearch =
    searchQuery.trim() === ""
      ? []
      : searchableItems.filter((item) =>
          item.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }

      if (
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setIsBellOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      isSidebarOpen && window.innerWidth < 1024
        ? "hidden"
        : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const hasUnread = notifications.some(
    (notification) => notification.unread
  );

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="theme-bg theme-text flex min-h-screen w-full transition-colors duration-200">
      <SuperAdminSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-x-hidden">
        <header className="theme-header sticky top-0 z-30 flex h-16 items-center justify-between border-b theme-border px-3 shadow-xs sm:px-4 md:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() =>
                setIsSidebarOpen((previous) => !previous)
              }
              className="theme-icon-box rounded-lg border theme-border p-2 theme-text transition hover:bg-rose-500/10 lg:hidden"
              title="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </button>

            <div
              className="relative w-40 sm:w-52 md:w-72"
              ref={searchRef}
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 theme-subtext" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search modules..."
                className="theme-input w-full rounded-lg border theme-border bg-transparent py-1.5 pl-9 pr-8 text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
              />

              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 theme-subtext"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}

              {isSearchOpen &&
                searchQuery.trim().length > 0 && (
                  <div className="theme-card absolute left-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-xl border theme-border p-2 shadow-xl">
                    <p className="px-2 py-1 text-[10px] font-bold uppercase theme-subtext">
                      Direct Navigation
                    </p>

                    {filteredSearch.length > 0 ? (
                      <div className="space-y-1">
                        {filteredSearch.map(
                          (item, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                navigate(item.link);
                                setIsSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="theme-hover flex w-full items-center justify-between rounded-lg p-2 text-left"
                            >
                              <span className="text-xs font-semibold theme-text">
                                {item.name}
                              </span>

                              <span className="rounded bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                                {item.type}
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="p-2 text-center text-xs theme-subtext">
                        No matching modules found.
                      </p>
                    )}
                  </div>
                )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3 md:gap-4">
            <button
              onClick={toggleTheme}
              className="theme-hover rounded-lg p-2 theme-subtext transition-colors hover:theme-text"
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <div
              className="relative"
              ref={bellRef}
            >
              <button
                onClick={() =>
                  setIsBellOpen((previous) => !previous)
                }
                className="theme-hover relative rounded-lg p-2 theme-subtext transition-colors hover:theme-text"
              >
                <Bell className="h-4 w-4" />

                {hasUnread && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 animate-pulse rounded-full bg-rose-600 ring-2 ring-white" />
                )}
              </button>

              {isBellOpen && (
                <div className="theme-card absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-1rem))] rounded-2xl border theme-border p-4 shadow-xl">
                  <div className="flex items-center justify-between border-b theme-border pb-2">
                    <h3 className="text-xs font-bold theme-text">
                      System Alerts
                    </h3>

                    <button
                      onClick={() =>
                        setNotifications((previous) =>
                          previous.map((notification) => ({
                            ...notification,
                            unread: false,
                          }))
                        )
                      }
                      className="text-[10px] font-semibold text-rose-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-60 space-y-2 overflow-y-auto pt-3">
                    {notifications.map(
                      (notification) => (
                        <div
                          key={notification.id}
                          className="flex gap-2.5 rounded-xl border theme-border p-2.5 text-xs"
                        >
                          {notification.type ===
                          "alert" ? (
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                          ) : (
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                          )}

                          <div className="min-w-0">
                            <p className="font-bold leading-tight theme-text">
                              {notification.title}
                            </p>

                            <p className="mt-0.5 text-[11px] theme-subtext">
                              {notification.desc}
                            </p>

                            <span className="mt-1 block text-[9px] theme-subtext">
                              {notification.time}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="hidden h-5 w-px bg-gray-300 dark:bg-gray-700 sm:block" />

            <button
              onClick={() =>
                navigate("/superadmin/dashboard")
              }
              className="theme-hover flex items-center gap-2 rounded-xl border theme-border p-1.5 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-600 to-indigo-600 text-xs font-black text-white shadow-xs">
                SA
              </div>

              <div className="hidden text-left sm:block">
                <p className="text-xs font-bold leading-tight theme-text">
                  {user?.name || "Root Admin"}
                </p>

                <p className="text-[10px] font-bold text-rose-400">
                  SUPERADMIN
                </p>
              </div>
            </button>
          </div>
        </header>

        <main className="w-full max-w-full flex-1 p-4 sm:p-5 md:p-8">
          {children}
        </main>

        <footer className="theme-header mt-auto flex flex-col gap-2 border-t theme-border px-4 py-4 text-center text-xs theme-subtext sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-left">
          <p>
            © {new Date().getFullYear()} NexusPlay Esports
            System · Super Admin
          </p>
          
        </footer>
      </div>
    </div>
  );
}

export default SuperAdminLayout;