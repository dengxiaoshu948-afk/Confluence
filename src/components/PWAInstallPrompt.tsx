import { useState, useEffect } from "react";
import { Download, X, Smartphone, Share2, PlusSquare } from "lucide-react";

export function PWAInstallPrompt() {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) return;

    // Check if user previously dismissed
    if (localStorage.getItem("pwa_dismissed") === "1") return;

    // Detect iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Listen for install prompt (Android Chrome)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // For iOS or browsers without beforeinstallprompt, show after delay
    const timer = setTimeout(() => {
      if (!isStandalone) {
        setShow(true);
      }
    }, 3000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShow(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem("pwa_dismissed", "1");
  };

  if (!show || dismissed) return null;

  return (
    <div className="glass-card p-4 mb-6 relative overflow-hidden">
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all z-10"
      >
        <X size={16} />
      </button>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shrink-0">
          <Download size={18} className="text-white" />
        </div>
        <div className="flex-1 min-w-0 pr-6">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
            安装到桌面
          </h3>
          <p className="text-xs text-slate-400 dark:text-gray-500 mt-0.5">
            像原生APP一样使用，支持离线访问
          </p>

          {isIOS ? (
            <div className="mt-3 space-y-2 text-xs text-slate-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>点击 Safari 底部</span>
                <Share2 size={12} className="text-blue-400" />
                <span>分享按钮</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>选择"添加到主屏幕"</span>
                <PlusSquare size={12} className="text-blue-400" />
              </div>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              disabled={!deferredPrompt}
              className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Smartphone size={14} />
              {deferredPrompt ? "立即安装" : "请用浏览器菜单添加"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
