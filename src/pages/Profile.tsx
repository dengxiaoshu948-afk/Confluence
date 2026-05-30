import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";
import {
  User,
  Star,
  Download,
  Loader2,
  Settings,
  Heart,
  MessageSquare,
  TrendingUp,
  FolderOpen,
} from "lucide-react";

// Level system
function getLevelInfo(points: number) {
  const levels = [
    { name: "探索者", min: 0, icon: "E" },
    { name: "学徒", min: 5, icon: "D" },
    { name: "研究员", min: 20, icon: "C" },
    { name: "工程师", min: 50, icon: "B" },
    { name: "专家", min: 100, icon: "A" },
    { name: "大师", min: 200, icon: "S" },
    { name: "传奇", min: 500, icon: "SS" },
  ];
  let current = levels[0];
  let next = levels[1];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].min) {
      current = levels[i];
      next = levels[i + 1] || null;
      break;
    }
  }
  const progress = next ? Math.min(100, ((points - current.min) / (next.min - current.min)) * 100) : 100;
  return { current, next, progress };
}

// Stat card component
function StatCard({ icon: Icon, label, value, color, to }: {
  icon: React.ComponentType<{ size: number; className?: string }>;
  label: string;
  value: string | number;
  color: string;
  to: string;
}) {
  return (
    <Link to={to} className="glass-card p-4 hover:-translate-y-0.5 transition-all duration-300 block">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
        <div>
          <div className="text-lg font-bold text-slate-800 dark:text-white">{value}</div>
          <div className="text-xs text-slate-400 dark:text-gray-500">{label}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"posts" | "stars" | "points">("posts");

  const { data: myUploads, isLoading: uploadsLoading } = trpc.resource.myUploads.useQuery(undefined, { enabled: !!user });
  const { data: myStars, isLoading: starsLoading } = trpc.resource.myStars.useQuery(undefined, { enabled: !!user });
  const { data: pointHistory } = trpc.points.myHistory.useQuery(undefined, { enabled: !!user });
  const { data: followCounts } = trpc.follow.counts.useQuery({ userId: user?.id || 0 }, { enabled: !!user });
  const utils = trpc.useUtils();
  const deleteResource = trpc.resource.delete.useMutation({
    onSuccess: () => { utils.resource.myUploads.invalidate(); },
  });

  if (authLoading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-blue-400" /></div>;
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

  const points = user.points || 0;
  const levelInfo = getLevelInfo(points);
  const followingCount = followCounts?.following || 0;
  const followersCount = followCounts?.followers || 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative z-10">

      {/* User Info Card */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className={`w-18 h-18 rounded-full p-[2px] bg-gradient-to-br from-blue-500 to-cyan-400`}>
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-white dark:border-[#121218]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center border-2 border-white dark:border-[#121218]">
                <span className="text-white text-xl font-bold">{(user.name || "U").charAt(0).toUpperCase()}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">{user.name || "用户"}</h1>
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-medium">
                {levelInfo.current.icon} {levelInfo.current.name}
              </span>
            </div>
            <p className="text-slate-400 dark:text-gray-500 text-sm mt-0.5">{user.email || ""}</p>

            {/* Level progress */}
            <div className="mt-2 max-w-xs">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 dark:text-gray-500">{points} 积分</span>
                {levelInfo.next && <span className="text-slate-400 dark:text-gray-500">还需 {levelInfo.next.min - points} 升级</span>}
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all" style={{ width: `${levelInfo.progress}%` }} />
              </div>
            </div>
          </div>
          <Link to="/settings" className="shrink-0 p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all" title="设置">
            <Settings size={18} />
          </Link>
        </div>

        {/* Follow stats - clickable */}
        <div className="flex gap-6 mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
          <Link to="/profile/following" className="text-center hover:opacity-80 transition-opacity">
            <div className="text-lg font-bold text-slate-800 dark:text-white">{followingCount}</div>
            <div className="text-xs text-slate-400 dark:text-gray-500">关注</div>
          </Link>
          <Link to="/profile/followers" className="text-center hover:opacity-80 transition-opacity">
            <div className="text-lg font-bold text-slate-800 dark:text-white">{followersCount}</div>
            <div className="text-xs text-slate-400 dark:text-gray-500">粉丝</div>
          </Link>
          <div className="text-center">
            <div className="text-lg font-bold text-amber-500">{points}</div>
            <div className="text-xs text-slate-400 dark:text-gray-500">积分</div>
          </div>
        </div>
      </div>

      {/* Small Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon={FolderOpen} label="我的上传" value={myUploads?.length || 0} color="bg-blue-500/10 text-blue-400" to="/profile/uploads" />
        <StatCard icon={Star} label="我的收藏" value={myStars?.length || 0} color="bg-yellow-500/10 text-yellow-400" to="/profile/stars" />
        <StatCard icon={TrendingUp} label="积分记录" value={points} color="bg-emerald-500/10 text-emerald-400" to="/profile/points" />
        <StatCard icon={Download} label="下载管理" value={"查看"} color="bg-purple-500/10 text-purple-400" to="/profile/downloads" />
        <StatCard icon={MessageSquare} label="我的回复" value={"查看"} color="bg-cyan-500/10 text-cyan-400" to="/profile/replies" />
        <StatCard icon={Heart} label="我的评论" value={"查看"} color="bg-rose-500/10 text-rose-400" to="/profile/comments" />
      </div>

      {/* Tab content */}
      <div>
        <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-white/5 mb-4">
          {[
            { key: "posts" as const, label: "上传" },
            { key: "stars" as const, label: "收藏" },
            { key: "points" as const, label: "积分" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-white dark:bg-white/10 text-slate-800 dark:text-white shadow-sm"
                  : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "posts" && (
          <div>
            {uploadsLoading ? (
              <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-blue-400" /></div>
            ) : myUploads?.length ? (
              <div className="space-y-2">
                {myUploads.map((r) => (
                  <div key={r.id} className="glass-card p-3 flex items-center gap-3 group">
                    <Link to={`/resource/${r.id}`} className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate group-hover:text-blue-400 transition-colors text-slate-800 dark:text-white">{r.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 dark:text-gray-500">
                        <span className="flex items-center gap-1"><Star size={10} />{r.starCount}</span>
                        <span className="flex items-center gap-1"><Download size={10} />{r.downloadCount}</span>
                      </div>
                    </Link>
                    <button
                      onClick={() => { if (window.confirm("确定删除？")) deleteResource.mutate({ id: r.id }); }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
                    >
                      <span className="text-xs">删除</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center text-sm text-slate-400 dark:text-gray-500">
                还没有上传过资源
              </div>
            )}
          </div>
        )}

        {activeTab === "stars" && (
          <div>
            {starsLoading ? (
              <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-blue-400" /></div>
            ) : myStars?.length ? (
              <div className="space-y-2">
                {myStars.map((r) => (
                  <Link key={r.id} to={`/resource/${r.id}`} className="glass-card p-3 block group">
                    <h3 className="text-sm font-medium truncate group-hover:text-blue-400 transition-colors text-slate-800 dark:text-white">{r.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 dark:text-gray-500">
                      <span className="flex items-center gap-1"><Star size={10} />{r.starCount}</span>
                      <span className="flex items-center gap-1"><Download size={10} />{r.downloadCount}</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center text-sm text-slate-400 dark:text-gray-500">
                还没有收藏
              </div>
            )}
          </div>
        )}

        {activeTab === "points" && (
          <div>
            {pointHistory?.length ? (
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {pointHistory.slice(0, 20).map((record) => (
                  <div key={record.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                    <span className={`text-sm font-bold w-8 text-right ${
                      record.action === "upload" ? "text-blue-400" :
                      record.action === "download_received" ? "text-emerald-400" :
                      record.action === "star_received" ? "text-amber-400" :
                      "text-purple-400"
                    }`}>+{record.points}</span>
                    <span className="text-xs text-slate-500 dark:text-gray-400 flex-1 truncate">{record.description}</span>
                    <span className="text-xs text-slate-300 dark:text-gray-600 shrink-0">{new Date(record.createdAt).toLocaleDateString("zh-CN")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center text-sm text-slate-400 dark:text-gray-500">
                暂无积分记录
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
