import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import { ThemeProvider } from "@/providers/theme"
import App from './App.tsx'

// Cache version - bump this on each release to force cache clear
const APP_CACHE_VERSION = "0.6.0";

// Auto-clear cache on version change
(async () => {
  const cachedVersion = localStorage.getItem("app_cache_version");
  if (cachedVersion !== APP_CACHE_VERSION) {
    console.log(`Cache version changed: ${cachedVersion} -> ${APP_CACHE_VERSION}, clearing...`);
    // Clear all caches
    if ("caches" in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        console.log("All caches cleared");
      } catch (e) {
        console.error("Cache clear failed:", e);
      }
    }
    // Unregister old service workers
    if ("serviceWorker" in navigator) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
        console.log("Old service workers unregistered");
      } catch (e) {
        console.error("SW unregister failed:", e);
      }
    }
    // Save new version
    localStorage.setItem("app_cache_version", APP_CACHE_VERSION);
    // Reload if we actually cleared something
    if (cachedVersion) {
      console.log("Reloading to use new version...");
      window.location.reload();
      return;
    }
  }

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('SW registered:', reg.scope))
      .catch((err) => console.log('SW registration failed:', err));
  }
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <TRPCProvider>
          <App />
        </TRPCProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
