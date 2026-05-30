import { Routes, Route, useNavigate, useLocation } from "react-router";
import { Layout } from "@/components/Layout";
import { useEffect } from "react";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Code from "./pages/Code";
import UploadPage from "./pages/Upload";
import ResourceDetail from "./pages/ResourceDetail";
import Community from "./pages/Community";
import DiscussionDetail from "./pages/DiscussionDetail";
import NewDiscussion from "./pages/NewDiscussion";
import Profile from "./pages/Profile";
import ProfileDetail from "./pages/ProfileDetail";
import Rank from "./pages/Rank";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Back button handler for Capacitor app
function BackButtonHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let App: any;
    try {
      App = require("@capacitor/app").App;
    } catch {
      return;
    }

    const listener = App.addListener("backButton", ({ canGoBack }: { canGoBack: boolean }) => {
      if (location.pathname === "/") {
        // On home page, exit app
        App.exitApp();
      } else if (canGoBack) {
        // Go back to previous page
        navigate(-1);
      } else {
        // Can't go back, exit app
        App.exitApp();
      }
    });

    return () => {
      listener.then((l: any) => l.remove());
    };
  }, [navigate, location.pathname]);

  return null;
}

export default function App() {
  return (
    <Layout>
      <BackButtonHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/code" element={<Code />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/discussion/:id" element={<DiscussionDetail />} />
        <Route path="/discussion/new" element={<NewDiscussion />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:type" element={<ProfileDetail />} />
        <Route path="/rank" element={<Rank />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
