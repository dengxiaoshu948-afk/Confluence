import { useParams, Link, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Eye,
  Clock,
  Send,
  User,
  Loader2,
  Tag,
  Trash2,
} from "lucide-react";

export default function DiscussionDetail() {
  const { id } = useParams<{ id: string }>();
  const discussionId = parseInt(id || "0");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [replyText, setReplyText] = useState("");

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.discussion.getById.useQuery({ id: discussionId });

  const deleteDiscussion = trpc.discussion.delete.useMutation({
    onSuccess: () => navigate("/community"),
  });

  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const addReply = trpc.discussion.addReply.useMutation({
    onSuccess: () => {
      utils.discussion.getById.invalidate({ id: discussionId });
    },
  });

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = replyText.trim();
    if (!content || !user || isSubmittingReply) return;

    setIsSubmittingReply(true);
    setReplyText(""); // Clear immediately for instant feedback

    try {
      await addReply.mutateAsync({ discussionId, content });
    } catch {
      // On error, restore the text
      setReplyText(content);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-blue-400" />
      </div>
    );
  }

  if (!data?.discussion) {
    return (
      <div className="text-center py-20">
        <div className="text-gray-500 text-lg mb-2">讨论不存在</div>
        <Link to="/community" className="text-blue-400 text-sm hover:underline">返回社区</Link>
      </div>
    );
  }

  const { discussion, replies } = data;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <Link to="/community" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={16} />
        返回社区
      </Link>

      {/* Discussion Content */}
      <div className="glass-card p-6 md:p-8">
        {/* Author */}
        <div className="flex items-center gap-3 mb-5">
          {discussion.userAvatar ? (
            <img src={discussion.userAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <span className="text-blue-400 font-semibold">
                {(discussion.userName || "U").charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="text-white font-medium text-sm">{discussion.userName || "匿名用户"}</div>
            <div className="text-gray-500 text-xs flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {new Date(discussion.createdAt).toLocaleDateString("zh-CN")}
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-white mb-4">{discussion.title}</h1>

        {/* Content */}
        <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-5">
          {discussion.content}
        </div>

        {/* Tags */}
        {discussion.tags && (
          <div className="flex flex-wrap gap-2 mb-5">
            {discussion.tags.split(",").map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-gray-400 text-xs">
                <Tag size={11} />
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 pt-4 border-t border-white/5 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Eye size={14} />
            {discussion.viewCount} 浏览
          </span>
          <span className="flex items-center gap-1.5">
            <MessageSquare size={14} />
            {discussion.replyCount} 回复
          </span>
          {user && (user.id === discussion.userId || user.role === "admin") && (
            <button
              onClick={() => {
                if (window.confirm("确定要删除这个讨论吗？此操作不可撤销。")) {
                  deleteDiscussion.mutate({ id: discussionId });
                }
              }}
              disabled={deleteDiscussion.isPending}
              className="ml-auto flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} />
              {deleteDiscussion.isPending ? "删除中..." : "删除"}
            </button>
          )}
        </div>
      </div>

      {/* Replies */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <MessageSquare size={18} className="text-blue-400" />
          回复 ({replies.length})
        </h2>

        {/* Reply Form */}
        {user ? (
          <form onSubmit={handleSubmitReply} className="mb-6">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="写下你的回复..."
              rows={3}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none mb-3"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!replyText.trim() || isSubmittingReply}
                className="btn-primary text-sm disabled:opacity-50"
              >
                {isSubmittingReply ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
                {isSubmittingReply ? "发送中..." : "发表回复"}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5 text-center">
            <p className="text-gray-400 text-sm">登录后参与回复</p>
          </div>
        )}

        {/* Replies List */}
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-3 p-4 rounded-xl bg-white/[0.02]">
              <div className="shrink-0">
                {reply.userAvatar ? (
                  <img src={reply.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <User size={14} className="text-blue-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{reply.userName || "匿名用户"}</span>
                  <span className="text-xs text-gray-600">
                    {new Date(reply.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{reply.content}</p>
              </div>
            </div>
          ))}

          {replies.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">暂无回复，来发表第一条吧！</div>
          )}
        </div>
      </div>
    </div>
  );
}
