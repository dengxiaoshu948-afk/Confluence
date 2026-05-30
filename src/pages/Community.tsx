import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  MessageSquare,
  Eye,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";

const hotTags = ["大模型", "Stable Diffusion", "LangChain", "PyTorch", "GPT", "微调", "部署"];

export default function Community() {
  const { data, isLoading } = trpc.discussion.list.useQuery({ limit: 50 });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">社区讨论</h1>
          <p className="text-gray-400 text-sm">与 AI 开发者交流技术、分享经验、解决问题</p>
        </div>
        <Link to="/discussion/new" className="btn-primary self-start">
          <Plus size={16} />
          发起讨论
        </Link>
      </div>

      {/* Hot Tags */}
      <div className="flex flex-wrap gap-2">
        {hotTags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs font-medium hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Discussions List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-400" />
        </div>
      ) : (
        <div className="space-y-3">
          {data?.items.map((discussion) => (
            <Link
              key={discussion.id}
              to={`/discussion/${discussion.id}`}
              className="glass-card p-5 flex items-start gap-4 hover:border-blue-500/30 group"
            >
              {/* Avatar */}
              <div className="shrink-0">
                {discussion.userAvatar ? (
                  <img
                    src={discussion.userAvatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-semibold text-sm">
                      {(discussion.userName || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors mb-2 line-clamp-1">
                  {discussion.title}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{discussion.content}</p>

                {discussion.tags && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {discussion.tags.split(",").map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-white/5 text-gray-500 text-xs"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span>{discussion.userName || "匿名用户"}</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(discussion.createdAt).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="shrink-0 flex flex-col items-end gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye size={13} />
                  {discussion.viewCount}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare size={13} />
                  {discussion.replyCount}
                </span>
              </div>
            </Link>
          ))}

          {data?.items.length === 0 && (
            <div className="text-center py-20">
              <MessageSquare size={48} className="text-gray-700 mx-auto mb-4" />
              <div className="text-gray-500 text-lg mb-2">暂无讨论</div>
              <p className="text-gray-600 text-sm mb-6">成为第一个发起讨论的人吧！</p>
              <Link to="/discussion/new" className="btn-primary">
                <Plus size={16} />
                发起讨论
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
