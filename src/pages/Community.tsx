import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  MessageSquare,
  Eye,
  Clock,
  Plus,
  Loader2,
  Search,
} from "lucide-react";

const hotTags = ["大模型", "Stable Diffusion", "LangChain", "PyTorch", "GPT", "微调", "部署"];

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading } = trpc.discussion.list.useQuery({ limit: 50 });

  // Client-side search filter
  const items = data?.items.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) ||
           item.content.toLowerCase().includes(q) ||
           item.tags?.toLowerCase().includes(q);
  }) || [];

  return (
    <div className="space-y-4 relative z-10">
      {/* Sticky Header with Search */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-inherit">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold text-white">社区</h1>
          <Link to="/discussion/new" className="btn-primary text-xs px-3 py-1.5">
            <Plus size={14} />
            发起讨论
          </Link>
        </div>
        <p className="text-xs text-gray-500 mb-3">交流技术、分享经验</p>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="搜索讨论..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Hot Tags */}
      <div className="flex flex-wrap gap-2">
        {hotTags.map((tag) => (
          <span
            key={tag}
            onClick={() => setSearchQuery(tag)}
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
          {items.map((discussion) => (
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

          {items.length === 0 && (
            <div className="text-center py-20">
              <MessageSquare size={48} className="text-gray-700 mx-auto mb-4" />
              <div className="text-gray-500 text-lg mb-2">暂无讨论</div>
              <p className="text-gray-600 text-sm mb-6">
                {searchQuery ? "没有找到匹配的讨论" : "成为第一个发起讨论的人吧！"}
              </p>
              {!searchQuery && (
                <Link to="/discussion/new" className="btn-primary">
                  <Plus size={16} />
                  发起讨论
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
