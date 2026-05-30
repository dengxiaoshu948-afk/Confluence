import { useState } from "react";
import { Link } from "react-router";
import { Plus, Upload, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function FloatingUpload() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Expand menu */}
      {open && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-2 items-end animate-fade-in-up">
          <Link
            to="/upload"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-105"
          >
            <Upload size={16} />
            上传资源
          </Link>
          <Link
            to="/discussion/new"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-105"
          >
            <MessageSquare size={16} />
            发起讨论
          </Link>
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
          open
            ? "bg-slate-600 dark:bg-slate-700 rotate-45 shadow-slate-500/30"
            : "bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/30 hover:shadow-blue-500/50 animate-pulse-glow"
        }`}
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
