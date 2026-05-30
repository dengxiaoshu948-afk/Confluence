import { useParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Download,
  Star,
  Clock,
  ArrowLeft,
  FileText,
  Zap,
  Database,
  Wrench,
  BookOpen,
  Code2,
  MessageSquare,
  Send,
  User,
  Loader2,
  ExternalLink,
  Check,
  Trash2,
  Share2,
} from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  model: <Zap size={16} />,
  dataset: <Database size={16} />,
  tool: <Wrench size={16} />,
  code: <Code2 size={16} />,
  doc: <FileText size={16} />,
  tutorial: <BookOpen size={16} />,
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

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const resourceId = parseInt(id || "0");
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);
  const navigate = useNavigate();

  const utils = trpc.useUtils();

  const { data: resource, isLoading } = trpc.resource.getById.useQuery({ id: resourceId });
  const { data: commentsData } = trpc.resource.getComments.useQuery({ resourceId });
  const { data: starredData } = trpc.resource.isStarred.useQuery({
    resourceId,
    userId: user?.id,
  });

  const incrementDownload = trpc.resource.incrementDownload.useMutation({
    onSuccess: () => utils.resource.getById.invalidate({ id: resourceId }),
  });

  const toggleStar = trpc.resource.toggleStar.useMutation({
    onSuccess: () => {
      utils.resource.getById.invalidate({ id: resourceId });
      utils.resource.isStarred.invalidate({ resourceId, userId: user?.id });
    },
  });

  const deleteResource = trpc.resource.delete.useMutation({
    onSuccess: () => {
      navigate("/explore");
    },
  });

  const recordShare = trpc.points.recordShare.useMutation({
    onSuccess: (data) => {
      if (!data.alreadyShared) {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    },
  });

  const addComment = trpc.resource.addComment.useMutation({
    onSuccess: () => {
      utils.resource.getComments.invalidate({ resourceId });
      setCommentText("");
    },
  });

  const handleDownload = () => {
    if (resource?.fileUrl) {
      incrementDownload.mutate({ id: resourceId });
      const a = document.createElement("a");
      a.href = `${resource.fileUrl}?download=1`;
      a.download = resource.fileName || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleStar = () => {
    if (!user) return;
    toggleStar.mutate({ resourceId });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;
    addComment.mutate({ resourceId, content: commentText.trim() });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = resource?.title || "Confluence 资源分享";

    // Try Web Share API first (opens system share sheet with WeChat, etc.)
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title,
          text: `来看看这个资源：${resource?.description?.slice(0, 50) || ""}`,
          url,
        });
        // Share succeeded
        if (user) {
          recordShare.mutate({ resourceId });
        }
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return;
      } catch (err) {
        // User cancelled share, fall through to copy
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback: copy link to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (user) {
        recordShare.mutate({ resourceId });
      }
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: select and copy
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="text-center py-20">
        <div className="text-slate-500 dark:text-gray-500 text-lg mb-2">资源不存在</div>
        <Link to="/explore" className="text-blue-400 text-sm hover:underline">返回探索页</Link>
      </div>
    );
  }

  const externalUrlMatch = resource.description?.match(/https?:\/\/[^\s]+/);
  const externalUrl = externalUrlMatch ? externalUrlMatch[0] : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <a ref={downloadLinkRef} className="hidden" />

      {/* Back Link */}
      <Link to="/explore" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white transition-colors">
        <ArrowLeft size={16} />
        返回探索
      </Link>

      {/* Main Card */}
      <div className="glass-card p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${categoryColors[resource.type] || categoryColors.doc}`}>
                {typeIcons[resource.type]}
                {typeLabels[resource.type] || resource.type}
              </span>
              <span className="text-xs text-slate-400 dark:text-gray-500">{resource.category}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2">{resource.title}</h1>
            {resource.tags && (
              <div className="flex flex-wrap gap-1.5">
                {resource.tags.split(",").map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 text-xs">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Action buttons */}
          <div className="flex gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="shrink-0 p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-blue-500 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              title={typeof navigator.share === 'function' ? "分享" : "复制链接"}
            >
              {shared ? <Check size={16} className="text-emerald-400" /> : copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
            </button>
          </div>
        </div>

        {/* Description */}
        {resource.description && (
          <div className="mb-6">
            <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{resource.description}</p>
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 text-sm hover:bg-blue-500/20 transition-all"
              >
                <ExternalLink size={14} />
                访问外部链接
              </a>
            )}
          </div>
        )}

        {/* File Info */}
        {resource.fileName && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 mb-6">
            <FileText size={20} className="text-blue-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-slate-800 dark:text-white text-sm font-medium truncate">{resource.fileName}</div>
              {resource.fileSize ? (
                <div className="text-slate-400 dark:text-gray-500 text-xs">
                  {resource.fileSize > 1024 * 1024 * 1024
                    ? `${(resource.fileSize / 1024 / 1024 / 1024).toFixed(2)} GB`
                    : `${(resource.fileSize / 1024 / 1024).toFixed(2)} MB`}
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          {resource.fileUrl ? (
            <button
              onClick={handleDownload}
              className="btn-primary"
              disabled={incrementDownload.isPending}
            >
              <Download size={16} />
              {incrementDownload.isPending ? "准备中..." : "下载资源"}
            </button>
          ) : externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              <ExternalLink size={16} />
              访问外部链接
            </a>
          ) : (
            <div className="px-4 py-2.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-400 dark:text-gray-500 text-sm font-medium flex items-center gap-2">
              <FileText size={16} />
              无可下载文件
            </div>
          )}
          <button
            onClick={handleStar}
            className={`btn-secondary ${starredData?.starred ? "border-yellow-500/50 text-yellow-500 dark:text-yellow-400 bg-yellow-500/10" : ""}`}
          >
            <Star size={16} className={starredData?.starred ? "fill-current" : ""} />
            {starredData?.starred ? "已收藏" : "收藏"}
            {resource.starCount > 0 && ` (${resource.starCount})`}
          </button>
          {user && resource && (user.id === resource.authorId || user.role === "admin") && (
            <button
              onClick={() => {
                if (window.confirm("确定要删除这个资源吗？此操作不可撤销。")) {
                  deleteResource.mutate({ id: resourceId });
                }
              }}
              disabled={deleteResource.isPending}
              className="btn-secondary border-red-500/20 text-red-400 hover:bg-red-500/10 hover:border-red-500/40"
            >
              <Trash2 size={16} />
              {deleteResource.isPending ? "删除中..." : "删除"}
            </button>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-white/5 text-sm text-slate-400 dark:text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {new Date(resource.createdAt).toLocaleDateString("zh-CN")}
          </span>
          <span className="flex items-center gap-1.5">
            <Download size={14} />
            {resource.downloadCount} 次下载
          </span>
          <span className="flex items-center gap-1.5">
            <Star size={14} />
            {resource.starCount} 收藏
          </span>
          {resource.authorName && (
            <span className="flex items-center gap-1.5 ml-auto">
              {resource.authorAvatar ? (
                <img src={resource.authorAvatar} alt="" className="w-5 h-5 rounded-full" />
              ) : (
                <User size={14} />
              )}
              {resource.authorName}
            </span>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
          <MessageSquare size={18} className="text-blue-400" />
          评论 ({commentsData?.length || 0})
        </h2>

        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="写下你的评论..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!commentText.trim() || addComment.isPending}
                className="btn-primary text-sm disabled:opacity-50"
              >
                <Send size={14} />
                发表评论
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-center">
            <p className="text-slate-400 dark:text-gray-400 text-sm">登录后参与讨论</p>
          </div>
        )}

        <div className="space-y-4">
          {commentsData?.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="shrink-0">
                {comment.userAvatar ? (
                  <img src={comment.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <User size={14} className="text-blue-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-800 dark:text-white">{comment.userName || "匿名用户"}</span>
                  <span className="text-xs text-slate-400 dark:text-gray-600">
                    {new Date(comment.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}

          {commentsData?.length === 0 && (
            <div className="text-center py-8 text-slate-400 dark:text-gray-500 text-sm">暂无评论，来发表第一条吧！</div>
          )}
        </div>
      </div>
    </div>
  );
}
