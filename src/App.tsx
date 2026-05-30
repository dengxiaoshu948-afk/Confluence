import { Routes, Route } from "react-router";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Code from "./pages/Code";
import UploadPage from "./pages/Upload";
import ResourceDetail from "./pages/ResourceDetail";
import Community from "./pages/Community";
import DiscussionDetail from "./pages/DiscussionDetail";
import NewDiscussion from "./pages/NewDiscussion";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Layout>
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
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
