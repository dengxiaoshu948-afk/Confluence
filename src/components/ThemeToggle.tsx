import { useTheme } from "@/providers/theme";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl transition-all duration-300 group overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(59,130,246,0.15), rgba(147,51,234,0.15))"
          : "linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.15))",
        border: isDark
          ? "1px solid rgba(59,130,246,0.2)"
          : "1px solid rgba(245,158,11,0.2)",
      }}
      title={isDark ? "切换亮色模式" : "切换暗色模式"}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)"
            : "radial-gradient(circle, rgba(245,158,11,0.3), transparent 70%)",
        }}
      />
      {isDark ? (
        <Sun size={18} className="relative z-10 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
      ) : (
        <Moon size={18} className="relative z-10 text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}
