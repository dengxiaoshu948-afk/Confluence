import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User, X, Compass, MessageSquare, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_ACTIONS = [
  { icon: Compass, label: "帮我找模型", action: "我想找一个适合中文NLP的预训练模型" },
  { icon: BookOpen, label: "学习资源", action: "推荐一些AI入门的学习资源" },
  { icon: MessageSquare, label: "社区热点", action: "最近社区有哪些热门讨论？" },
];

interface KimiAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function KimiAgent({ isOpen, onClose }: KimiAgentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "你好！我是 Confluence AI 助手。我可以帮你搜索资源、解答 AI 问题，或者推荐社区讨论。你想了解什么？" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || loading) return;

    setMessages((prev) => [...prev, { role: "user", content }]);
    if (!text) setInput("");
    setLoading(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        "我想找一个适合中文NLP的预训练模型": "推荐你去探索页面的「自然语言处理」分类看看，那里有很多中文模型。比如 GPT-4 中文微调模型和 LLaMA3 中文版都很受欢迎。你也可以试试搜索\"中文\"或\"bert\"。",
        "推荐一些AI入门的学习资源": "对于初学者，我推荐从 PyTorch 官方教程开始，然后看我们社区的「前沿论文速递」板块。文档分类下也有很多优质的教程资源。",
        "最近社区有哪些热门讨论？": "最近社区很活跃！大家在讨论 LLM 推理加速、多模态模型训练成本，还有 RAG 系统的向量数据库选型。你可以点击上方的「社区动态」查看全部讨论。",
      };
      const defaultResponses = [
        "你可以尝试在探索页面搜索相关资源，或者去社区发起一个讨论。",
        "这是一个很好的问题！你可以查看我们的文档板块，那里有很多相关的教程。",
        "我建议你先去社区看看，有很多开发者在讨论类似的话题。",
        "如果你想了解更多，可以查看热门话题标签，或者直接搜索关键词。",
      ];
      const response = responses[content] || defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setLoading(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[60] w-80 md:w-96 flex flex-col border-l dark:border-white/10 border-slate-200 backdrop-blur-xl"
      style={{
        background: document.documentElement.classList.contains("dark") ? "rgba(8, 8, 12, 0.95)" : "rgba(255, 255, 255, 0.95)",
      }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-white/10 border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-2">
              Kimi Agent
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 text-[10px] font-medium border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                在线
              </span>
            </h3>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
          <X size={18} />
        </button>
      </div>

      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Sparkles size={32} className="text-slate-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-slate-500 dark:text-gray-400">登录后即可使用 AI 助手</p>
        </div>
      ) : (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot size={13} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-br-sm"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-gray-300 rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User size={13} className="text-emerald-500" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shrink-0">
                  <Bot size={13} className="text-white animate-pulse" />
                </div>
                <div className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.action)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-gray-400 border border-slate-200 dark:border-white/10 hover:border-blue-400/30 hover:text-blue-500 transition-all shrink-0"
                >
                  <Icon size={12} />
                  {action.label}
                </button>
              );
            })}
          </div>

          {/* Input */}
          <div className="p-4 pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="问我任何问题..."
                className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-600 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white disabled:opacity-30 hover:shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
