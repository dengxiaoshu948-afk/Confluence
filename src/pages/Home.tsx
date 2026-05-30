import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { HeroCanvas } from "@/components/HeroCanvas";
import {
  ArrowRight,
  Download,
  Star,
  MessageSquare,
  Clock,
  Eye,
  Zap,
  Database,
  FileText,
  Wrench,
  BookOpen,
  Code2,
  Hash,
  Trophy,
  Search,
  Users,
  ArrowUpRight,
  Radio,
} from "lucide-react";

const typeIcons: Record<string, React.ReactNode> = {
  model: <Zap size={14} />,
  dataset: <Database size={14} />,
  tool: <Wrench size={14} />,
  code: <Code2 size={14} />,
  doc: <FileText size={14} />,
  tutorial: <BookOpen size={14} />,
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

// Tilt card
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [transform, setTransform] = useState("");
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTransform(`perspective(600px) rotateX(${(y - 0.5) * -6}deg) rotateY(${(x - 0.5) * 6}deg)`);
  };
  const handleLeave = () => setTransform("");
  return (
    <div className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transform, transition: "transform 0.15s ease-out" }}>
      {children}
    </div>
  );
}

export default function Home() {
  const { data: latestResources } = trpc.resource.list.useQuery({ sort: "newest", limit: 6 });
  const { data: popularResources } = trpc.resource.list.useQuery({ sort: "popular", limit: 6 });
  const { data: discussionsData } = trpc.discussion.list.useQuery({ limit: 5 });

  return (
    <div className="space-y-16 relative z-10">

      {/* ===== HERO ===== */}
      <section className="relative">
        <HeroCanvas />
        <div className="flex items-center justify-center gap-5 mt-4">
          <Link
            to="/explore"
            className="group relative px-8 py-3.5 rounded-full font-medium text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.03] active:scale-[0.97]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
            <span className="absolute inset-0 overflow-hidden rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="absolute top-0 left-0 w-full h-[1px] bg-white/40 animate-[scanline_2s_linear_infinite]" />
            </span>
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "radial-gradient(circle at 50% 50%, rgba(100,200,255,0.25), transparent 60%)" }} />
            <span className="relative z-10 flex items-center gap-2 text-sm">
              <Search size={16} />
              搜索
            </span>
          </Link>
          <Link
            to="/community"
            className="group relative px-8 py-3.5 rounded-full font-medium text-white overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.03] active:scale-[0.97]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite]" />
            <span className="absolute inset-0 rounded-full animate-pulse-glow opacity-50" />
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "radial-gradient(circle at 50% 50%, rgba(100,255,180,0.2), transparent 60%)" }} />
            <span className="relative z-10 flex items-center gap-2 text-sm">
              <Users size={16} />
              社区
            </span>
          </Link>
        </div>
      </section>

      {/* ===== CATEGORY CARDS ===== */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { key: "model", label: "模型", icon: Zap, color: "text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/[0.08]", border: "border-purple-200/60 dark:border-purple-500/15", hoverBg: "hover:bg-purple-100/50 dark:hover:bg-purple-500/[0.12]", desc: "AI模型文件" },
            { key: "dataset", label: "数据集", icon: Database, color: "text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/[0.08]", border: "border-emerald-200/60 dark:border-emerald-500/15", hoverBg: "hover:bg-emerald-100/50 dark:hover:bg-emerald-500/[0.12]", desc: "训练与测试数据" },
            { key: "tool", label: "工具", icon: Wrench, color: "text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/[0.08]", border: "border-amber-200/60 dark:border-amber-500/15", hoverBg: "hover:bg-amber-100/50 dark:hover:bg-amber-500/[0.12]", desc: "开发工具框架" },
            { key: "code", label: "代码", icon: Code2, color: "text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/[0.08]", border: "border-rose-200/60 dark:border-rose-500/15", hoverBg: "hover:bg-rose-100/50 dark:hover:bg-rose-500/[0.12]", desc: "开源代码项目" },
            { key: "doc", label: "文档", icon: FileText, color: "text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/[0.08]", border: "border-blue-200/60 dark:border-blue-500/15", hoverBg: "hover:bg-blue-100/50 dark:hover:bg-blue-500/[0.12]", desc: "教程参考资料" },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <Link key={cat.key} to={cat.key === "code" ? "/code" : `/explore?type=${cat.key}`}>
                <TiltCard className={`${cat.bg} ${cat.hoverBg} border ${cat.border} rounded-2xl p-4 md:p-5 cursor-pointer transition-all duration-300 h-full`}>
                  <div className={`w-10 h-10 rounded-xl ${cat.bg} ${cat.border} border flex items-center justify-center mb-3`}>
                    <Icon size={20} className={cat.color} />
                  </div>
                  <div className="font-semibold text-sm text-slate-700 dark:text-white">{cat.label}</div>
                  <div className="text-xs mt-0.5 text-slate-400 dark:text-gray-500">{cat.desc}</div>
                </TiltCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ===== POPULAR RESOURCES ===== */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Trophy size={16} className="text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">热门资源</h2>
          </div>
          <Link to="/explore?sort=popular" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
            全部 <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularResources?.items.map((r) => (
            <Link key={r.id} to={`/resource/${r.id}`} className="block">
              <TiltCard className="glass-card p-5 group cursor-pointer h-full">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${categoryColors[r.type] || categoryColors.doc}`}>
                        {typeIcons[r.type]}
                        {typeLabels[r.type] || r.type}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-gray-600">{r.category}</span>
                    </div>
                    <h3 className="font-medium truncate group-hover:text-blue-400 transition-colors text-slate-800 dark:text-white">{r.title}</h3>
                    <p className="text-sm mt-1 line-clamp-2 text-slate-500 dark:text-gray-500">{r.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400 dark:text-gray-500">
                  <span className="flex items-center gap-1"><Download size={12} />{r.downloadCount}</span>
                  <span className="flex items-center gap-1"><Star size={12} />{r.starCount}</span>
                  <span className="flex items-center gap-1"><Clock size={12} />{new Date(r.createdAt).toLocaleDateString("zh-CN")}</span>
                </div>
              </TiltCard>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== COMMUNITY ===== */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Radio size={16} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">社区动态</h2>
              <p className="text-xs text-slate-400 dark:text-gray-500">看看大家在讨论什么</p>
            </div>
          </div>
          <Link to="/community" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
            全部 <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {discussionsData?.items.slice(0, 6).map((d) => (
            <Link key={d.id} to={`/discussion/${d.id}`} className="block">
              <div className="glass-card p-4 group cursor-pointer hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col">
                <h3 className="font-medium text-sm truncate group-hover:text-blue-400 transition-colors text-slate-800 dark:text-white flex-1">
                  {d.title}
                </h3>
                <p className="text-xs mt-2 line-clamp-2 text-slate-500 dark:text-gray-500 flex-1">{d.content}</p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-white/5 text-xs text-slate-400 dark:text-gray-600">
                  <span>{d.userName || "匿名"}</span>
                  <span className="flex items-center gap-1"><Eye size={11} />{d.viewCount}</span>
                  <span className="flex items-center gap-1"><MessageSquare size={11} />{d.replyCount}</span>
                  {d.tags && <span className="flex items-center gap-1"><Hash size={10} />{d.tags.split(",")[0]?.trim()}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== LATEST ===== */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-white">
            <Clock size={18} className="text-cyan-400" />
            最新上传
          </h2>
          <Link to="/explore" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
            全部 <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestResources?.items.map((r) => (
            <Link key={r.id} to={`/resource/${r.id}`} className="block">
              <div className="glass-card p-4 group cursor-pointer hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${categoryColors[r.type] || categoryColors.doc}`}>
                    {typeIcons[r.type]}
                    {typeLabels[r.type] || r.type}
                  </span>
                </div>
                <h3 className="font-medium text-sm truncate group-hover:text-blue-400 transition-colors text-slate-800 dark:text-white">{r.title}</h3>
                <p className="text-xs mt-1 line-clamp-2 text-slate-500 dark:text-gray-500">{r.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 dark:text-gray-600">
                  <span className="flex items-center gap-1"><Star size={11} />{r.starCount}</span>
                  <span className="flex items-center gap-1"><Download size={11} />{r.downloadCount}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
