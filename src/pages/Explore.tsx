import { useState } from "react";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  Search,
  Download,
  Star,
  Zap,
  Database,
  FileText,
  Wrench,
  BookOpen,
  Code2,
  Filter,
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

const categories = ["全部", "自然语言处理", "计算机视觉", "语音识别", "多模态", "强化学习", "其他"];
const types = [
  { key: "", label: "全部" },
  { key: "model", label: "模型" },
  { key: "dataset", label: "数据集" },
  { key: "tool", label: "工具" },
  { key: "code", label: "代码" },
  { key: "doc", label: "文档" },
  { key: "tutorial", label: "教程" },
];
const sortOptions = [
  { key: "newest", label: "最新" },
  { key: "popular", label: "最热" },
  { key: "mostDownloaded", label: "最多下载" },
];

export default function Explore() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";
  const sort = (searchParams.get("sort") as "newest" | "popular" | "mostDownloaded") || "newest";

  const { data, isLoading } = trpc.resource.list.useQuery({
    type: type || undefined,
    category: category === "全部" || category === "全部类型" ? undefined : category,
    search: searchQuery || undefined,
    sort,
    limit: 24,
  });

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "全部" && value !== "全部类型") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Use replace to avoid adding history entries
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-3 bg-inherit">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-1">发现</h1>
        <p className="text-xs text-slate-400 dark:text-gray-500">探索 AI 模型、数据集与工具</p>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="搜索资源..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border transition-all ${
              showFilters
                ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass-card p-4 space-y-4 animate-fade-in-up">
          {/* Type Filter */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">资源类型</label>
            <div className="flex flex-wrap gap-2">
              {types.map((t) => (
                <button
                  key={t.key}
                  onClick={() => updateFilter("type", t.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    type === t.key
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          {/* Category Filter */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">领域分类</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => updateFilter("category", c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    (category === c) || (c === "全部" && !category)
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sort Tabs */}
      <div className="flex items-center gap-1 border-b border-white/5">
        {sortOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => updateFilter("sort", option.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-all ${
              sort === option.key
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="glass-card p-4 animate-pulse">
              <div className="h-4 bg-white/5 rounded w-1/3 mb-3" />
              <div className="h-5 bg-white/5 rounded w-3/4 mb-2" />
              <div className="h-3 bg-white/5 rounded w-full mb-1" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-500">
            共 {data?.total || 0} 个资源
          </div>

          {data?.items.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-500 text-lg mb-2">暂无资源</div>
              <p className="text-gray-600 text-sm">成为第一个贡献者吧！</p>
              <Link to="/upload" className="btn-primary mt-4 inline-flex">
                上传资源
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.items.map((resource) => (
                <Link
                  key={resource.id}
                  to={`/resource/${resource.id}`}
                  className="glass-card p-4 hover:border-blue-500/30 group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${categoryColors[resource.type] || categoryColors.doc}`}>
                      {typeIcons[resource.type]}
                      {typeLabels[resource.type] || resource.type}
                    </span>
                    <span className="text-xs text-gray-600">{resource.category}</span>
                  </div>

                  <h3 className="text-white font-medium text-sm truncate group-hover:text-blue-400 transition-colors mb-1">
                    {resource.title}
                  </h3>

                  <p className="text-gray-500 text-xs line-clamp-2 mb-3">{resource.description}</p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Star size={11} />
                        {resource.starCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download size={11} />
                        {resource.downloadCount}
                      </span>
                    </div>
                    <span className="text-xs text-gray-600">
                      {new Date(resource.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>

                  {resource.authorName && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                      {resource.authorAvatar ? (
                        <img src={resource.authorAvatar} alt="" className="w-5 h-5 rounded-full" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/10" />
                      )}
                      <span className="text-xs text-gray-500">{resource.authorName}</span>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
