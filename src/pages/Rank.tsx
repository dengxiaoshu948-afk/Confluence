import { trpc } from "@/providers/trpc";
import { useTheme } from "@/providers/theme";
import {
  Trophy,
  Crown,
  Medal,
  Award,
  TrendingUp,
  Loader2,
} from "lucide-react";

function RankIcon({ rank }: { rank: number }) {
  if (rank === 0) return <Crown size={18} className="text-amber-400" />;
  if (rank === 1) return <Medal size={18} className="text-slate-300" />;
  if (rank === 2) return <Award size={18} className="text-amber-600" />;
  return <span className="text-sm font-mono text-slate-500 dark:text-gray-500 w-5 text-center">{rank + 1}</span>;
}

export default function Rank() {
  const { isDark } = useTheme();
  const { data: leaderboard, isLoading } = trpc.points.leaderboard.useQuery({ limit: 50 });

  return (
    <div className="max-w-2xl mx-auto relative z-10">
      {/* Header */}
      <section className={`relative rounded-2xl overflow-hidden p-8 mb-8 ${
        isDark
          ? "bg-gradient-to-br from-amber-950/30 to-[#080c18] border border-amber-500/10"
          : "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100"
      }`}>
        <div className="relative z-10 text-center">
          <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
            isDark ? "bg-amber-500/10" : "bg-amber-100"
          }`}>
            <Trophy size={28} className="text-amber-400" />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-800"}`}>贡献排行榜</h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-slate-500"}`}>
            为社区贡献最多的开发者们
          </p>
        </div>
      </section>

      {/* Leaderboard List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-blue-400" />
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard?.map((user, idx) => (
            <div
              key={user.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                idx < 3
                  ? isDark
                    ? "bg-white/5 border border-white/5"
                    : "bg-white border border-slate-100"
                  : isDark
                    ? "hover:bg-white/5"
                    : "hover:bg-white"
              }`}
            >
              {/* Rank */}
              <div className="shrink-0 w-8 flex justify-center">
                <RankIcon rank={idx} />
              </div>

              {/* Avatar */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                idx === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20" :
                idx === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400" :
                idx === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700" :
                "bg-gradient-to-br from-blue-500 to-cyan-500"
              }`}>
                {(user.name || "U").charAt(0).toUpperCase()}
              </div>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                  {user.name || "匿名用户"}
                </div>
                {idx < 3 && (
                  <div className={`text-xs ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                    {idx === 0 ? "冠军" : idx === 1 ? "亚军" : "季军"}
                  </div>
                )}
              </div>

              {/* Points */}
              <div className="flex items-center gap-1.5 shrink-0">
                <TrendingUp size={14} className="text-amber-400" />
                <span className={`font-bold ${isDark ? "text-amber-400" : "text-amber-600"}`}>{user.points}</span>
                <span className={`text-xs ${isDark ? "text-gray-500" : "text-slate-400"}`}>积分</span>
              </div>
            </div>
          ))}

          {(!leaderboard || leaderboard.length === 0) && (
            <div className="text-center py-16 text-slate-400 dark:text-gray-500">
              <Trophy size={48} className="mx-auto mb-4 opacity-30" />
              <p>暂无数据，成为第一个贡献者吧！</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
