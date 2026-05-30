import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/providers/theme";
import { ThemeToggle } from "./ThemeToggle";
import { ParticleBackground } from "./ParticleBackground";

import {
  Search,
  MessageSquare,
  User,
  LogIn,
  Home,
  Compass,
  Code2,
  Bell,
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useState, useEffect, useRef } from "react";

const navItems = [
  { path: "/", label: "首页", icon: Home },
  { path: "/explore", label: "探索", icon: Compass },
  { path: "/code", label: "代码", icon: Code2 },
  { path: "/community", label: "社区", icon: MessageSquare },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, isLoading } = useAuth();
  const { isDark } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

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
      <div className={`relative min-h-screen pb-16 md:pb-0 transition-colors duration-700 ${
        isDark
          ? "bg-[#050507] text-[#F8FAFC]"
          : "bg-gradient-to-br from-slate-50 via-white to-blue-50 text-slate-800"
      }`}>
        {/* Particle Background */}
        <ParticleBackground />

        {/* Top Navigation - Desktop */}
        <nav className={`hidden md:block sticky top-0 z-50 transition-all duration-500 ${
          isDark
            ? "border-b border-white/5 bg-[#050507]/80 backdrop-blur-xl"
            : "border-b border-slate-200/50 bg-white/70 backdrop-blur-xl"
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-sm shadow-blue-500/20">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <span className={`font-bold text-base tracking-tight transition-colors duration-300 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent`}>
                  Confluence
                </span>
              </Link>

              {/* Desktop Nav Links */}
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? isDark ? "text-white bg-white/10" : "text-blue-600 bg-blue-50"
                          : isDark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
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
                <ThemeToggle />
                <Link to="/explore" className={`p-2 rounded-lg transition-all ${isDark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"}`}>
                  <Search size={18} />
                </Link>

                {user && (
                  <div className="relative" ref={notifRef}>
                    <button onClick={() => setNotifOpen(!notifOpen)} className={`relative p-2 rounded-lg transition-all ${isDark ? "text-gray-400 hover:text-white hover:bg-white/5" : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"}`}>
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>
                      )}
                    </button>
                    {notifOpen && (
                      <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl z-50 overflow-hidden ${isDark ? "bg-[#121218] border-white/10" : "bg-white border-slate-200"}`}>
                        <div className={`flex items-center justify-between p-3 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                          <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-800"}`}>通知</span>
                          {unreadCount > 0 && (
                            <button onClick={() => markAllRead.mutate(undefined, { onSuccess: () => { utils.notification.unreadCount.invalidate(); utils.notification.list.invalidate(); } })} className="text-xs text-blue-400 hover:text-blue-300">全部已读</button>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications?.length ? notifications.map((n) => (
                            <div key={n.id} onClick={() => { if (n.read === "0") markRead.mutate({ id: n.id }); if (n.link) window.location.href = n.link; setNotifOpen(false); }} className={`p-3 border-b cursor-pointer ${isDark ? "border-white/5 hover:bg-white/5" : "border-slate-50 hover:bg-slate-50"} ${n.read === "0" ? (isDark ? "bg-blue-500/5" : "bg-blue-50/50") : ""}`}>
                              <div className="text-xs font-medium">{n.title}</div>
                              <div className={`text-xs mt-0.5 line-clamp-2 ${isDark ? "text-gray-500" : "text-slate-500"}`}>{n.content}</div>
                            </div>
                          )) : <div className={`p-6 text-center text-xs ${isDark ? "text-gray-600" : "text-slate-400"}`}>暂无通知</div>}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!isLoading && (
                  user ? (
                    <Link to="/profile" className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-all ${isDark ? "hover:bg-white/5" : "hover:bg-slate-100"}`}>
                      {user.avatar ? <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" /> : <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><User size={14} className="text-blue-400" /></div>}
                      <span className={`text-sm max-w-[80px] truncate ${isDark ? "text-gray-300" : "text-slate-600"}`}>{user.name || "User"}</span>
                    </Link>
                  ) : (
                    <Link to="/login" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 text-sm font-medium transition-all"><LogIn size={14} /><span>登录</span></Link>
                  )
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Top Bar - minimal */}
        <div className={`md:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 ${
          isDark ? "bg-[#050507]/90 backdrop-blur-xl" : "bg-white/90 backdrop-blur-xl"
        }`} style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <Link to="/" className="flex items-center gap-2">
            <span className={`font-semibold text-sm ${isDark ? "text-white" : "text-slate-800"}`}>Confluence</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            {user && (
              <div className="relative" ref={notifRef}>
                <button onClick={() => setNotifOpen(!notifOpen)} className={`relative p-2 rounded-lg ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  <Bell size={18} />
                  {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{unreadCount > 9 ? "9+" : unreadCount}</span>}
                </button>
                {notifOpen && (
                  <div className={`absolute right-0 top-full mt-2 w-72 rounded-xl border shadow-xl z-50 overflow-hidden ${isDark ? "bg-[#121218] border-white/10" : "bg-white border-slate-200"}`}>
                    <div className={`p-3 border-b ${isDark ? "border-white/5" : "border-slate-100"}`}>
                      <span className={`text-sm font-medium ${isDark ? "text-white" : "text-slate-800"}`}>通知</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications?.length ? notifications.map((n) => (
                        <div key={n.id} onClick={() => { setNotifOpen(false); if (n.link) window.location.href = n.link; }} className={`p-3 border-b cursor-pointer ${isDark ? "border-white/5" : "border-slate-50"}`}>
                          <div className="text-xs font-medium">{n.title}</div>
                        </div>
                      )) : <div className={`p-4 text-center text-xs ${isDark ? "text-gray-600" : "text-slate-400"}`}>暂无通知</div>}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!isLoading && (user ? (
              <Link to="/profile" className="p-1.5 rounded-lg">{user.avatar ? <img src={user.avatar} alt="" className="w-6 h-6 rounded-full" /> : <User size={18} className={isDark ? "text-gray-400" : "text-slate-500"} />}</Link>
            ) : (
              <Link to="/login" className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-medium"><LogIn size={14} /></Link>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 pt-16 md:pt-6">
          {children}
        </main>

        {/* Bottom Navigation - Mobile */}
        <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t ${
          isDark
            ? "border-white/5 bg-[#050507]/95 backdrop-blur-xl"
            : "border-slate-200/50 bg-white/95 backdrop-blur-xl"
        }`} style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          <div className="flex items-center justify-around h-14">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-all duration-300 ${
                    isActive
                      ? isDark ? "text-blue-400" : "text-blue-600"
                      : isDark ? "text-gray-500" : "text-slate-400"
                  }`}
                >
                  <Icon size={20} className={isActive ? "drop-shadow-[0_0_6px_rgba(59,130,246,0.5)]" : ""} />
                  <span className="text-[10px] font-medium">{item.label}</span>
                  {isActive && <span className={`absolute bottom-1.5 w-5 h-0.5 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-500"}`} />}
                </Link>
              );
            })}
            {/* Profile tab on bottom nav */}
            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-all duration-300 ${
                location.pathname === "/profile"
                  ? isDark ? "text-blue-400" : "text-blue-600"
                  : isDark ? "text-gray-500" : "text-slate-400"
              }`}
            >
              {user?.avatar ? <img src={user.avatar} alt="" className="w-5 h-5 rounded-full" /> : <User size={20} />}
              <span className="text-[10px] font-medium">我的</span>
              {location.pathname === "/profile" && <span className={`absolute bottom-1.5 w-5 h-0.5 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-500"}`} />}
            </Link>
          </div>
        </nav>

      </div>
    </div>
  );
}
