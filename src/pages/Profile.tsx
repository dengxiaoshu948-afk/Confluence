import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";
import {
  User,
  Upload,
  Star,
  Download,
  Loader2,
  FileText,
  Zap,
  Database,
  Wrench,
  BookOpen,
  Code2,
  Trash2,
  TrendingUp,
  Award,
  Settings,
  Crown,
} from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  model: <Zap size={13} />,
  dataset: <Database size={13} />,
  tool: <Wrench size={13} />,
  code: <Code2 size={13} />,
  doc: <FileText size={13} />,
  tutorial: <BookOpen size={13} />,
};

const typeLabels: Record<string, string> = {
  model: "模型",
  dataset: "数据集",
  tool: "工具",
  code: "代码",
  doc: "文档",
  tutorial: "教程",
};

const categoryColors: Record<string, string> = {
  model: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  dataset: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  tool: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  code: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  doc: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  tutorial: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const actionLabels: Record<string, { label: string; color: string; sign: string }> = {
  upload: { label: "上传资源", color: "text-blue-400", sign: "+" },
  download_received: { label: "被下载", color: "text-emerald-400", sign: "+" },
  star_received: { label: "被收藏", color: "text-amber-400", sign: "+" },
  share: { label: "分享", color: "text-purple-400", sign: "+" },
};

// Level system based on points
function getLevelInfo(points: number) {
  const levels = [
    { name: "探索者", min: 0, color: "from-slate-400 to-slate-500", icon: "E" },
    { name: "学徒", min: 5, color: "from-blue-400 to-blue-500", icon: "D" },
    { name: "研究员", min: 20, color: "from-emerald-400 to-emerald-500", icon: "C" },
    { name: "工程师", min: 50, color: "from-amber-400 to-orange-500", icon: "B" },
    { name: "专家", min: 100, color: "from-purple-400 to-pink-500", icon: "A" },
    { name: "大师", min: 200, color: "from-rose-400 to-red-500", icon: "S" },
    { name: "传奇", min: 500, color: "from-yellow-300 via-amber-400 to-orange-500", icon: "SS" },
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

  const progress = next
    ? Math.min(100, ((points - current.min) / (next.min - current.min)) * 100)
    : 100;

  return { current, next, progress };
}

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: myUploads, isLoading: uploadsLoading } = trpc.resource.myUploads.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: myStars, isLoading: starsLoading } = trpc.resource.myStars.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: pointHistory } = trpc.points.myHistory.useQuery(
    undefined,
    { enabled: !!user }
  );

  const utils = trpc.useUtils();

  const deleteResource = trpc.resource.delete.useMutation({
    onSuccess: () => {
      utils.resource.myUploads.invalidate();
      utils.resource.myStars.invalidate();
      utils.points.myHistory.invalidate();
    },
  });

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
          <p className="text-slate-400 dark:text-gray-400 text-sm mb-6">登录后查看你的个人中心</p>
          <Link to="/login" className="btn-primary text-sm">去登录</Link>
        </div>
      </div>
    );
  }

  const points = user.points || 0;
  const levelInfo = getLevelInfo(points);
  const totalDownloads = myUploads?.reduce((sum, r) => sum + (r.downloadCount || 0), 0) || 0;
  const totalStars = myUploads?.reduce((sum, r) => sum + (r.starCount || 0), 0) || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* ===== HERO PROFILE CARD ===== */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-5">
          {/* Avatar with level ring */}
          <div className="relative shrink-0">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${levelInfo.current.color} p-[2px]`}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-full h-full rounded-full object-cover border-2 border-white dark:border-[#121218]"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center border-2 border-white dark:border-[#121218]">
                  <span className="text-white text-2xl font-bold">
                    {(user.name || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {/* Level badge */}
            <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${levelInfo.current.color} text-white text-[10px] font-bold border-2 border-white dark:border-[#121218]`}>
              {levelInfo.current.icon}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{user.name || "用户"}</h1>
              <span className={`px-2 py-0.5 rounded-full bg-gradient-to-r ${levelInfo.current.color} text-white text-xs font-medium`}>
                {levelInfo.current.name}
              </span>
              {user.role === "admin" && (
                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20 flex items-center gap-1">
                  <Crown size={10} />
                  管理员
                </span>
              )}
            </div>
            <p className="text-slate-400 dark:text-gray-500 text-sm mt-1">{user.email || ""}</p>

            {/* Level progress */}
            <div className="mt-3 max-w-xs">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 dark:text-gray-500">{points} 积分</span>
                {levelInfo.next && (
                  <span className="text-slate-400 dark:text-gray-500">
                    还需 {levelInfo.next.min - points} 积分升级
                  </span>
                )}
              </div>
              <div className="h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${levelInfo.current.color} transition-all duration-500`}
                  style={{ width: `${levelInfo.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Settings link */}
          <Link
            to="/settings"
            className="shrink-0 p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            title="账号设置"
          >
            <Settings size={18} />
          </Link>
        </div>
      </div>

      {/* ===== STATS ROW ===== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "积分", value: points, icon: Award, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "我的上传", value: myUploads?.length || 0, icon: Upload, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "总下载", value: totalDownloads, icon: Download, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "获收藏", value: totalStars, icon: Star, color: "text-rose-400", bg: "bg-rose-500/10" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-4 text-center">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
                <Icon size={16} className={stat.color} />
              </div>
              <div className="text-xl font-bold text-slate-800 dark:text-white">{stat.value}</div>
              <div className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* ===== POINTS HISTORY ===== */}
      {pointHistory && pointHistory.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="text-base font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-400" />
            积分记录
          </h2>
          <div className="space-y-1 max-h-52 overflow-y-auto">
            {pointHistory.slice(0, 15).map((record) => {
              const action = actionLabels[record.action] || { label: record.action, color: "text-gray-400", sign: "+" };
              return (
                <div key={record.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-white/5 last:border-0">
                  <span className={`text-sm font-bold ${action.color} w-8 text-right shrink-0`}>
                    {action.sign}{record.points}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-gray-400 w-16 shrink-0">{action.label}</span>
                  {record.description && (
                    <span className="text-xs text-slate-400 dark:text-gray-500 truncate flex-1">{record.description}</span>
                  )}
                  <span className="text-xs text-slate-300 dark:text-gray-600 shrink-0">
                    {new Date(record.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== MY UPLOADS ===== */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Upload size={18} className="text-blue-400" />
          我的上传
        </h2>
        {uploadsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin text-blue-400" />
          </div>
        ) : myUploads && myUploads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myUploads.map((resource) => (
              <div key={resource.id} className="glass-card p-4 hover:border-blue-500/30 group relative">
                <Link to={`/resource/${resource.id}`} className="block">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${categoryColors[resource.type] || categoryColors.doc}`}>
                      {typeIcons[resource.type]}
                      {typeLabels[resource.type] || resource.type}
                    </span>
                  </div>
                  <h3 className="text-slate-800 dark:text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors pr-6">
                    {resource.title}
                  </h3>
                </Link>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 dark:text-gray-500">
                  <span className="flex items-center gap-1"><Star size={11} />{resource.starCount}</span>
                  <span className="flex items-center gap-1"><Download size={11} />{resource.downloadCount}</span>
                  <span className="flex-1">{new Date(resource.createdAt).toLocaleDateString("zh-CN")}</span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (window.confirm("确定要删除这个资源吗？")) {
                        deleteResource.mutate({ id: resource.id });
                      }
                    }}
                    disabled={deleteResource.isPending}
                    className="p-1 rounded text-slate-400 dark:text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="删除"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-slate-400 dark:text-gray-500 text-sm mb-4">还没有上传过资源</p>
            <Link to="/upload" className="btn-primary text-sm">去上传</Link>
          </div>
        )}
      </section>

      {/* ===== MY STARS ===== */}
      <section>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <Star size={18} className="text-yellow-400" />
          我的收藏
        </h2>
        {starsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={24} className="animate-spin text-blue-400" />
          </div>
        ) : myStars && myStars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {myStars.map((resource) => (
              <Link key={resource.id} to={`/resource/${resource.id}`} className="glass-card p-4 hover:border-blue-500/30 group">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${categoryColors[resource.type] || categoryColors.doc}`}>
                    {typeIcons[resource.type]}
                    {typeLabels[resource.type] || resource.type}
                  </span>
                </div>
                <h3 className="text-slate-800 dark:text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 dark:text-gray-500">
                  <span className="flex items-center gap-1"><Star size={11} />{resource.starCount}</span>
                  <span className="flex items-center gap-1"><Download size={11} />{resource.downloadCount}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-slate-400 dark:text-gray-500 text-sm mb-4">还没有收藏任何资源</p>
            <Link to="/explore" className="btn-primary text-sm">去探索</Link>
          </div>
        )}
      </section>

    </div>
  );
}
