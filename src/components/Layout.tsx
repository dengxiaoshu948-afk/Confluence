import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/providers/theme";
import { ThemeToggle } from "./ThemeToggle";
import { ParticleBackground } from "./ParticleBackground";
import { KimiAgent } from "./KimiAgent";

import {
  Search,
  Upload,
  MessageSquare,
  User,
  LogIn,
  Menu,
  X,
  Home,
  Compass,
  Code2,
  Bell,
  Sparkles,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { path: "/", label: "首页", icon: Home },
  { path: "/explore", label: "探索", icon: Compass },
  { path: "/code", label: "代码", icon: Code2 },
  { path: "/community", label: "社区", icon: MessageSquare },
  { path: "/upload", label: "上传", icon: Upload },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [kimiOpen, setKimiOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: unreadData } = trpc.notification.unreadCount.useQuery(
    undefined,
    { enabled: !!user, refetchInterval: 30000 }
  );
  const { data: notifications } = trpc.notification.list.useQuery(
    undefined,
    { enabled: notifOpen && !!user }
  );
  const markRead = trpc.notification.markRead.useMutation();
  const markAllRead = trpc.notification.markAllRead.useMutation();
  const utils = trpc.useUtils();

  const unreadCount = unreadData?.count || 0;

  return (
    <div className={`min-h-screen transition-colors duration-700 ${isDark ? "dark" : ""}`}>
      <div className={`relative min-h-screen transition-colors duration-700 ${
        isDark
          ? "bg-[#050507] text-[#F8FAFC]"
          : "bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-800"
      }`}>
        {/* Particle Background */}
        <ParticleBackground />

        {/* Top Navigation */}
        <nav className={`sticky top-0 z-50 transition-all duration-500 ${
          isDark
            ? "border-b border-white/5 bg-[#050507]/80 backdrop-blur-xl"
            : "border-b border-slate-200/50 bg-white/70 backdrop-blur-xl"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo - Home icon */}
              <Link to="/" className="flex items-center gap-2 shrink-0 group">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-lg ${
                  isDark ? "bg-white/10 group-hover:bg-white/15" : "bg-slate-100 group-hover:bg-slate-200"
                }`}>
                  <Home size={16} className={`transition-colors ${
                    location.pathname === "/"
                      ? "text-blue-500"
                      : isDark ? "text-gray-400" : "text-slate-500"
                  }`} />
                </div>
                <span className={`font-semibold text-sm tracking-tight hidden sm:block transition-colors duration-300 ${
                  isDark ? "text-white" : "text-slate-800"
                }`}>
                  Confluence
                </span>
              </Link>

              {/* Desktop Nav */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? isDark
                            ? "text-white bg-white/10"
                            : "text-blue-600 bg-blue-50"
                          : isDark
                            ? "text-gray-400 hover:text-white hover:bg-white/5"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-2">
                {/* Kimi Agent */}
                <button
                  onClick={() => setKimiOpen(!kimiOpen)}
                  className={`relative p-2 rounded-lg transition-all duration-300 ${
                    kimiOpen
                      ? "text-purple-400 bg-purple-500/10"
                      : isDark
                        ? "text-gray-400 hover:text-purple-400 hover:bg-purple-500/10"
                        : "text-slate-400 hover:text-purple-500 hover:bg-purple-50"
                  }`}
                  title="AI 助手"
                >
                  <Sparkles size={18} />
                </button>

                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Search button */}
                <Link
                  to="/explore"
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    isDark
                      ? "text-gray-400 hover:text-white hover:bg-white/5"
                      : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <Search size={18} />
                </Link>

                {/* Notification Bell */}
                {user && (
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={() => setNotifOpen(!notifOpen)}
                      className={`relative p-2 rounded-lg transition-all duration-300 ${
                        isDark
                          ? "text-gray-400 hover:text-white hover:bg-white/5"
                          : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {/* Notification Dropdown */}
                    {notifOpen && (
                      <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl z-50 overflow-hidden ${
                        isDark
                          ? "bg-[#121218] border-white/10"
                          : "bg-white border-slate-200"
                      }`}>
                        <div className={`flex items-center justify-between p-3 border-b ${
                          isDark ? "border-white/5" : "border-slate-100"
                        }`}>
                          <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-800"}`}>
                            通知
                          </span>
                          {unreadCount > 0 && (
                            <button
                              onClick={() => {
                                markAllRead.mutate(undefined, {
                                  onSuccess: () => {
                                    utils.notification.unreadCount.invalidate();
                                    utils.notification.list.invalidate();
                                  }
                                });
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300"
                            >
                              全部已读
                            </button>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications && notifications.length > 0 ? (
                            notifications.map((n) => (
                              <div
                                key={n.id}
                                onClick={() => {
                                  if (n.read === "0") {
                                    markRead.mutate({ id: n.id }, {
                                      onSuccess: () => {
                                        utils.notification.unreadCount.invalidate();
                                      }
                                    });
                                  }
                                  if (n.link) window.location.href = n.link;
                                  setNotifOpen(false);
                                }}
                                className={`p-3 border-b cursor-pointer transition-colors ${
                                  isDark ? "border-white/5 hover:bg-white/5" : "border-slate-50 hover:bg-slate-50"
                                } ${n.read === "0" ? (isDark ? "bg-blue-500/5" : "bg-blue-50/50") : ""}`}
                              >
                                <div className="flex items-start gap-2">
                                  {n.actorAvatar ? (
                                    <img src={n.actorAvatar} alt="" className="w-7 h-7 rounded-full shrink-0" />
                                  ) : (
                                    <div className="w-7 h-7 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                                      <User size={12} className="text-blue-400" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <div className={`text-xs font-medium ${isDark ? "text-white" : "text-slate-700"}`}>
                                      {n.title}
                                    </div>
                                    <div className={`text-xs mt-0.5 line-clamp-2 ${isDark ? "text-gray-500" : "text-slate-500"}`}>
                                      {n.content}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className={`p-6 text-center text-xs ${isDark ? "text-gray-600" : "text-slate-400"}`}>
                              暂无通知
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Auth */}
                {!isLoading && (
                  <>
                    {user ? (
                      <Link
                        to="/profile"
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${
                          isDark ? "hover:bg-white/5" : "hover:bg-slate-100"
                        }`}
                      >
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name || ""}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <User size={14} className="text-blue-400" />
                          </div>
                        )}
                        <span className={`text-sm hidden sm:block max-w-[80px] truncate ${
                          isDark ? "text-gray-300" : "text-slate-600"
                        }`}>
                          {user.name || "User"}
                        </span>
                      </Link>
                    ) : (
                      <Link
                        to="/login"
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-sm font-medium transition-all"
                      >
                        <LogIn size={14} />
                        <span className="hidden sm:inline">登录</span>
                      </Link>
                    )}
                  </>
                )}

                {/* Mobile menu button */}
                <button
                  className={`md:hidden p-2 rounded-lg transition-all ${
                    isDark
                      ? "text-gray-400 hover:text-white hover:bg-white/5"
                      : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                  }`}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <div className={`md:hidden border-t px-4 py-3 ${
              isDark
                ? "border-white/5 bg-[#0a0a0f]"
                : "border-slate-200/50 bg-white/90"
            }`}>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? isDark
                            ? "text-white bg-white/10"
                            : "text-blue-600 bg-blue-50"
                          : isDark
                            ? "text-gray-400 hover:text-white hover:bg-white/5"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Kimi Agent Sidebar */}
        <KimiAgent isOpen={kimiOpen} onClose={() => setKimiOpen(false)} />

        {/* Main Content */}
        <main className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 transition-all duration-300 ${kimiOpen ? "mr-80 md:mr-96" : ""}`}>
          {children}
        </main>

      </div>
    </div>
  );
}
