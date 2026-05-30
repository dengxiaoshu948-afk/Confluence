import { useParams, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { useTheme } from "@/providers/theme";
import {
  ArrowLeft,
  FolderOpen,
  Star,
  TrendingUp,
  Download,
  MessageSquare,
  Heart,
  User as UserIcon,
  Loader2,
  Trash2,
} from "lucide-react";

const typeLabels: Record<string, string> = {
  upload: "上传资源", download_received: "被下载", star_received: "被收藏", share: "分享",
};

export default function ProfileDetail() {
  const { type } = useParams<{ type: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const { isDark } = useTheme();
  const utils = trpc.useUtils();

  const { data: myUploads, isLoading: uploadsLoading } = trpc.resource.myUploads.useQuery(undefined, { enabled: !!user && type === "uploads" });
  const { data: myStars, isLoading: starsLoading } = trpc.resource.myStars.useQuery(undefined, { enabled: !!user && type === "stars" });
  const { data: pointHistory } = trpc.points.myHistory.useQuery(undefined, { enabled: !!user && type === "points" });
  const { data: followersList } = trpc.follow.followers.useQuery({ userId: user?.id || 0 }, { enabled: !!user && type === "followers" });
  const { data: followingList } = trpc.follow.following.useQuery({ userId: user?.id || 0 }, { enabled: !!user && type === "following" });

  const deleteResource = trpc.resource.delete.useMutation({
    onSuccess: () => { utils.resource.myUploads.invalidate(); },
  });

  const titles: Record<string, { title: string; subtitle: string; icon: React.ComponentType<{ size: number; className?: string }> }> = {
    uploads: { title: "我的上传", subtitle: "你分享的所有资源", icon: FolderOpen },
    stars: { title: "我的收藏", subtitle: "你收藏的资源列表", icon: Star },
    points: { title: "积分记录", subtitle: "积分获取明细", icon: TrendingUp },
    downloads: { title: "下载管理", subtitle: "你下载的资源记录", icon: Download },
    replies: { title: "我的回复", subtitle: "你在社区的所有回复", icon: MessageSquare },
    comments: { title: "我的评论", subtitle: "你在资源下的所有评论", icon: Heart },
    followers: { title: "粉丝", subtitle: "关注你的人", icon: UserIcon },
    following: { title: "关注", subtitle: "你关注的人", icon: UserIcon },
  };

  const info = titles[type || ""] || { title: "详情", subtitle: "", icon: FolderOpen };
  const Icon = info.icon;

  if (authLoading) return <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-blue-400" /></div>;
  if (!user) return <div className="text-center py-20 text-slate-400">请先登录</div>;

  return (
    <div className="max-w-2xl mx-auto relative z-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/profile" className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10`}>
          <Icon size={18} className="text-blue-400" />
        </div>
        <div>
          <h1 className={`text-lg font-bold ${isDark ? "text-white" : "text-slate-800"}`}>{info.title}</h1>
          <p className="text-xs text-slate-400 dark:text-gray-500">{info.subtitle}</p>
        </div>
      </div>

      {/* Content */}
      {type === "uploads" && (
        uploadsLoading ? <Loader2 size={24} className="animate-spin text-blue-400 mx-auto block" /> :
        myUploads?.length ? (
          <div className="space-y-2">
            {myUploads.map((r) => (
              <div key={r.id} className="glass-card p-4 flex items-center gap-3">
                <Link to={`/resource/${r.id}`} className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate text-slate-800 dark:text-white">{r.title}</h3>
                  <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">{r.category} · {typeLabels[r.type as keyof typeof typeLabels] || r.type}</p>
                </Link>
                <button onClick={() => { if (window.confirm("确定删除？")) deleteResource.mutate({ id: r.id }); }} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : <div className="glass-card p-8 text-center text-sm text-slate-400">暂无上传</div>
      )}

      {type === "stars" && (
        starsLoading ? <Loader2 size={24} className="animate-spin text-blue-400 mx-auto block" /> :
        myStars?.length ? (
          <div className="space-y-2">
            {myStars.map((r) => (
              <Link key={r.id} to={`/resource/${r.id}`} className="glass-card p-4 block">
                <h3 className="text-sm font-medium truncate text-slate-800 dark:text-white">{r.title}</h3>
                <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">{r.category}</p>
              </Link>
            ))}
          </div>
        ) : <div className="glass-card p-8 text-center text-sm text-slate-400">暂无收藏</div>
      )}

      {type === "points" && (
        pointHistory?.length ? (
          <div className="space-y-1">
            {pointHistory.map((record) => (
              <div key={record.id} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-white/5">
                <span className={`text-sm font-bold w-10 text-right ${record.action === "upload" ? "text-blue-400" : record.action === "download_received" ? "text-emerald-400" : record.action === "star_received" ? "text-amber-400" : "text-purple-400"}`}>+{record.points}</span>
                <span className="text-xs text-slate-500 dark:text-gray-400 flex-1">{record.description}</span>
                <span className="text-xs text-slate-300 dark:text-gray-600">{new Date(record.createdAt).toLocaleDateString("zh-CN")}</span>
              </div>
            ))}
          </div>
        ) : <div className="glass-card p-8 text-center text-sm text-slate-400">暂无积分记录</div>
      )}

      {type === "followers" && (
        followersList?.length ? (
          <div className="space-y-2">
            {followersList.map((u) => (
              <div key={u.id} className="glass-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">{(u.name || "U").charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-slate-800 dark:text-white">{u.name || "匿名用户"}</span>
              </div>
            ))}
          </div>
        ) : <div className="glass-card p-8 text-center text-sm text-slate-400">还没有粉丝</div>
      )}

      {type === "following" && (
        followingList?.length ? (
          <div className="space-y-2">
            {followingList.map((u) => (
              <div key={u.id} className="glass-card p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">{(u.name || "U").charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-sm font-medium text-slate-800 dark:text-white">{u.name || "匿名用户"}</span>
              </div>
            ))}
          </div>
        ) : <div className="glass-card p-8 text-center text-sm text-slate-400">还没有关注任何人</div>
      )}

      {type === "downloads" && (
        <div className="glass-card p-8 text-center text-sm text-slate-400">下载记录功能开发中</div>
      )}

      {type === "replies" && (
        <div className="glass-card p-8 text-center text-sm text-slate-400">回复记录功能开发中</div>
      )}

      {type === "comments" && (
        <div className="glass-card p-8 text-center text-sm text-slate-400">评论记录功能开发中</div>
      )}
    </div>
  );
}
