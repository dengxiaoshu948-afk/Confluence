import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router";

export default function NewDiscussion() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const createDiscussion = trpc.discussion.create.useMutation({
    onSuccess: (data) => {
      setMessage({ type: "success", text: "讨论发布成功！" });
      setTimeout(() => navigate(`/discussion/${data.id}`), 1000);
    },
    onError: (err) => {
      setMessage({ type: "error", text: err.message || "发布失败" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: "error", text: "请先登录" });
      return;
    }
    if (!title.trim()) {
      setMessage({ type: "error", text: "请输入标题" });
      return;
    }
    if (!content.trim()) {
      setMessage({ type: "error", text: "请输入内容" });
      return;
    }

    createDiscussion.mutate({
      title: title.trim(),
      content: content.trim(),
      tags: tags || undefined,
    });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="glass-card p-8 text-center max-w-md">
          <MessageSquare size={48} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">登录后参与</h2>
          <p className="text-gray-400 text-sm mb-6">请先登录账号，然后发起讨论</p>
          <a href="/login" className="btn-primary">去登录</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link
        to="/community"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        返回社区
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">发起讨论</h1>
        <p className="text-gray-400 text-sm">分享你的想法、提出问题或发起话题</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          message.type === "success"
            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
            : "bg-red-500/10 border border-red-500/20 text-red-400"
        }`}>
          {message.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-white mb-1.5 block">
            标题 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="简明扼要地描述你的话题"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white mb-1.5 block">
            内容 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="详细描述你的问题、想法或分享..."
            rows={8}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-white mb-1.5 block">标签</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="用逗号分隔，如：大模型, PyTorch, 部署"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={createDiscussion.isPending}
          className="btn-primary w-full disabled:opacity-50"
        >
          {createDiscussion.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              发布中...
            </>
          ) : (
            <>
              <Send size={16} />
              发布讨论
            </>
          )}
        </button>
      </form>
    </div>
  );
}
