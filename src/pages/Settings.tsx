import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Link } from "react-router";
import {
  ArrowLeft,
  User,
  Mail,
  Camera,
  Save,
  Loader2,
  Shield,
  Check,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// Current app version - bump this on each release
const APP_VERSION = "0.5.0";
const GITHUB_RELEASE_URL = "https://api.github.com/repos/dengxiaoshu948-afk/confluence/releases/latest";

export default function Settings() {
  const { user, isLoading: authLoading, refresh } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update check states
  const [checkingUpdate, setCheckingUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState<{
    hasUpdate: boolean;
    latestVersion: string;
    downloadUrl: string;
  } | null>(null);
  const [clearingCache, setClearingCache] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  // Check for updates on mount
  useEffect(() => {
    checkUpdate();
  }, []);

  const checkUpdate = async () => {
    setCheckingUpdate(true);
    try {
      const response = await fetch(GITHUB_RELEASE_URL);
      if (response.ok) {
        const data = await response.json();
        const latestVersion = data.tag_name?.replace("v", "") || "0.0.0";
        const downloadUrl = data.assets?.[0]?.browser_download_url || "";

        // Compare versions
        const currentParts = APP_VERSION.split(".").map(Number);
        const latestParts = latestVersion.split(".").map(Number);
        let hasUpdate = false;
        for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
          const current = currentParts[i] || 0;
          const latest = latestParts[i] || 0;
          if (latest > current) {
            hasUpdate = true;
            break;
          }
          if (latest < current) break;
        }

        setUpdateInfo({ hasUpdate, latestVersion, downloadUrl });
      }
    } catch {
      // Silently fail - user can manually check
    } finally {
      setCheckingUpdate(false);
    }
  };

  const clearCache = async () => {
    setClearingCache(true);
    try {
      // Clear service worker cache
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      // Unregister service worker
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
      }
      // Clear localStorage cache version
      localStorage.removeItem("app_cache_version");
      setCacheCleared(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch {
      setClearingCache(false);
    }
  };

  const updateProfile = trpc.localAuth.updateProfile.useMutation({
    onSuccess: () => {
      setSaved(true);
      refresh();
      setTimeout(() => setSaved(false), 2000);
    },
  });

  // Only local auth users can edit profile via settings
  // OAuth users should use Kimi profile
  const isLocalUser = user?.authType === "local";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLocalUser) return;
    updateProfile.mutate({
      name: name || undefined,
      email: email || undefined,
      avatar: avatar || undefined,
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // For now, just use a data URL for demo
    // In production, you'd upload to a file server
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="glass-card p-8 text-center max-w-md">
          <User size={48} className="text-slate-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">请先登录</h2>
          <Link to="/login" className="btn-primary text-sm">去登录</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Back */}
      <Link to="/profile" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors mb-6">
        <ArrowLeft size={16} />
        返回个人中心
      </Link>

      <div className="glass-card p-6 md:p-8">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
          <User size={20} className="text-blue-400" />
          账号设置
        </h1>

        {!isLocalUser && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
            <Shield size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 dark:text-gray-400">
              你通过 Kimi 账号登录，个人信息请在 Kimi 平台修改。下方仅可预览当前信息。
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={!isLocalUser}
              className="relative group"
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-white/10 group-hover:border-blue-400 transition-colors"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center border-2 border-slate-200 dark:border-white/10 group-hover:border-blue-400 transition-colors">
                  <span className="text-white text-2xl font-bold">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              {isLocalUser && (
                <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={20} className="text-white" />
                </div>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {isLocalUser && (
              <p className="text-xs text-slate-400 dark:text-gray-500 mt-2">点击更换头像</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              昵称
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isLocalUser}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
              <Mail size={14} className="text-slate-400" />
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isLocalUser}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Auth type indicator */}
          <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
            <Shield size={14} className="text-slate-400" />
            <span className="text-xs text-slate-500 dark:text-gray-400">
              登录方式：{user.authType === "oauth" ? "Kimi OAuth" : "站内账号"}
            </span>
            {user.role === "admin" && (
              <span className="ml-auto px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-medium border border-red-500/20">
                管理员
              </span>
            )}
          </div>

          {isLocalUser && (
            <button
              type="submit"
              disabled={updateProfile.isPending}
              className="w-full btn-primary disabled:opacity-50"
            >
              {saved ? (
                <>
                  <Check size={16} />
                  已保存
                </>
              ) : updateProfile.isPending ? (
                <span className="animate-pulse">保存中...</span>
              ) : (
                <>
                  <Save size={16} />
                  保存修改
                </>
              )}
            </button>
          )}
        </form>

        {/* Version & Update Section */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
            应用管理
          </h3>

          {/* Current Version */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600 dark:text-gray-300">当前版本</span>
            <span className="text-sm font-mono text-slate-400 dark:text-gray-500">v{APP_VERSION}</span>
          </div>

          {/* Check Update */}
          <div>
            {checkingUpdate ? (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Loader2 size={14} className="animate-spin" />
                检查更新中...
              </div>
            ) : updateInfo?.hasUpdate ? (
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-blue-400" />
                  <span className="text-sm font-medium text-slate-800 dark:text-white">发现新版本</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mb-3">
                  最新版本：v{updateInfo.latestVersion}（当前：v{APP_VERSION}）
                </p>
                <a
                  href={updateInfo.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-xs w-full"
                >
                  <Download size={14} />
                  立即下载更新
                </a>
              </div>
            ) : (
              <button
                onClick={checkUpdate}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-sm text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              >
                <RefreshCw size={14} />
                检查更新
              </button>
            )}
          </div>

          {/* Clear Cache */}
          <button
            onClick={clearCache}
            disabled={clearingCache}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-sm text-slate-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all disabled:opacity-50"
          >
            {clearingCache ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {cacheCleared ? "已清理，刷新中..." : "清理中..."}
              </>
            ) : (
              <>
                <Trash2 size={14} />
                清除缓存
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
