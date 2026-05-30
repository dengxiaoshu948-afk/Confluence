import { useState } from "react";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router";
import { trpc } from "@/providers/trpc";
import { useTheme } from "@/providers/theme";
import {
  Code2,
  GitFork,
  Star,
  Download,
  Terminal,
  Zap,
  Search,
} from "lucide-react";

const languages = [
  { key: "", label: "全部" },
  { key: "python", label: "Python", color: "text-yellow-400" },
  { key: "typescript", label: "TypeScript", color: "text-blue-400" },
  { key: "cpp", label: "C++", color: "text-cyan-400" },
  { key: "rust", label: "Rust", color: "text-orange-400" },
  { key: "go", label: "Go", color: "text-sky-400" },
  { key: "java", label: "Java", color: "text-red-400" },
  { key: "other", label: "其他", color: "text-gray-400" },
];

const codeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";

export default function Code() {
  const { isDark } = useTheme();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const lang = searchParams.get("lang") || "";
  const { data, isLoading } = trpc.resource.list.useQuery({
    type: "code",
    limit: 48,
  });

  // Client-side filter by language tag and search query
  const items = data?.items.filter((item) => {
    if (!lang && !searchQuery) return true;
    const matchesLang = !lang || item.tags?.toLowerCase().includes(lang.toLowerCase());
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLang && matchesSearch;
  }) || [];

  return (
    <div className="space-y-6 relative z-10">
      {/* Sticky Header with Search */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-inherit">
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium border ${codeColor}`}>
            <Code2 size={12} />
            开源代码
          </span>
        </div>
        <h1 className={`text-lg font-bold mb-1 ${isDark ? "text-white" : "text-slate-800"}`}>
          代码库
        </h1>
        <p className={`text-xs mb-3 ${isDark ? "text-gray-500" : "text-slate-400"}`}>
          训练脚本、推理引擎与开发工具
        </p>

        {/* Search Bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="搜索代码..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Language Filter */}
      <div className={`flex flex-wrap gap-2 pb-4 border-b ${isDark ? "border-white/5" : "border-slate-200"}`}>
        {languages.map((l) => (
          <button
            key={l.key}
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              if (l.key) params.set("lang", l.key);
              else params.delete("lang");
              navigate(`${location.pathname}?${params.toString()}`, { replace: true });
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
              lang === l.key
                ? isDark
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-blue-100 text-blue-700 border border-blue-200"
                : isDark
                  ? "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className={`h-4 rounded w-1/3 mb-3 ${isDark ? "bg-white/5" : "bg-slate-200"}`} />
              <div className={`h-5 rounded w-3/4 mb-2 ${isDark ? "bg-white/5" : "bg-slate-200"}`} />
              <div className={`h-3 rounded w-full ${isDark ? "bg-white/5" : "bg-slate-200"}`} />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <Terminal size={48} className={`mx-auto mb-4 ${isDark ? "text-gray-700" : "text-slate-300"}`} />
          <div className={`text-lg mb-2 ${isDark ? "text-gray-500" : "text-slate-500"}`}>暂无代码资源</div>
          <p className={`text-sm mb-6 ${isDark ? "text-gray-600" : "text-slate-400"}`}>
            成为第一个分享代码的人吧！
          </p>
          <Link to="/upload" className="btn-primary">
            <Code2 size={16} />
            分享代码
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((resource) => (
            <Link
              key={resource.id}
              to={`/resource/${resource.id}`}
              className="glass-card p-5 group hover:translate-y-[-2px] transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${codeColor}`}>
                      <Code2 size={13} />
                      代码
                    </span>
                    {resource.tags && (
                      <span className={`text-xs ${isDark ? "text-gray-600" : "text-slate-400"}`}>
                        {resource.tags.split(",")[0]?.trim()}
                      </span>
                    )}
                  </div>
                  <h3 className={`font-medium truncate group-hover:text-blue-400 transition-colors ${
                    isDark ? "text-white" : "text-slate-800"
                  }`}>
                    {resource.title}
                  </h3>
                  <p className={`text-sm mt-1 line-clamp-2 ${isDark ? "text-gray-500" : "text-slate-500"}`}>
                    {resource.description}
                  </p>
                </div>
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDark ? "bg-rose-500/10" : "bg-rose-50"
                }`}>
                  <Code2 size={18} className="text-rose-400" />
                </div>
              </div>
              <div className={`flex items-center gap-4 mt-3 pt-3 text-xs ${
                isDark ? "border-t border-white/5 text-gray-500" : "border-t border-slate-100 text-slate-400"
              }`}>
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {resource.starCount}
                </span>
                <span className="flex items-center gap-1">
                  <Download size={12} />
                  {resource.downloadCount}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork size={12} />
                  {resource.authorName || "匿名"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Why Code Section */}
      <section className={`glass-card p-6 md:p-8 mt-10 ${isDark ? "" : ""}`}>
        <h2 className={`text-lg font-semibold mb-5 ${isDark ? "text-white" : "text-slate-800"}`}>
          为什么区分「代码」和「模型」？
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Terminal,
              title: "代码是可读的工程资产",
              desc: "模型权重是训练结果，无法直接理解。代码则是完整的工程实现 — 包含架构设计、训练逻辑、数据处理流程。",
              color: "text-blue-400",
              bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
            },
            {
              icon: GitFork,
              title: "可复用、可修改、可学习",
              desc: "优秀的开源代码可以被 Fork、修改和二次开发。你可以学习别人的实现方式，也可以为项目贡献改进。",
              color: "text-emerald-400",
              bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
            },
            {
              icon: Zap,
              title: "模型需要代码才能运行",
              desc: "没有推理代码和部署脚本，模型只是一堆参数。代码模块提供完整的从训练到部署的全链路工具。",
              color: "text-amber-400",
              bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={`p-4 rounded-xl ${item.bg}`}>
                <Icon size={20} className={`${item.color} mb-3`} />
                <h3 className={`font-medium text-sm mb-1.5 ${isDark ? "text-white" : "text-slate-700"}`}>
                  {item.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-slate-500"}`}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
