import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLoading } from "../context/LoadingContext";
import Sidebar from "../components/Dashboard/Sidebar";

import StatsCards from "../components/Dashboard/StatsCards";
import PostsTable from "../components/Dashboard/PostsTable";
import Dashnav from "../components/Dashboard/Dashnav";
import Settings from "../components/Dashboard/Settings";

const BADGE_TIERS = [
  {
    name: "diamond",
    label: "Diamond",
    description: "Reserved for creators with at least 100 posts, 500 likes, or 250 subscribers.",
    icon: "/diamond-badge.svg",
    matches: ({ postCount, totalLikes, subscriberCount }) =>
      postCount >= 100 || totalLikes >= 500 || subscriberCount >= 250,
  },
  {
    name: "platinum",
    label: "Platinum",
    description: "Unlocked at 60 posts, 250 likes, or 100 subscribers.",
    icon: "/platinum-badge.svg",
    matches: ({ postCount, totalLikes, subscriberCount }) =>
      postCount >= 60 || totalLikes >= 250 || subscriberCount >= 100,
  },
  {
    name: "gold",
    label: "Gold",
    description: "Unlocked at 30 posts, 100 likes, or 50 subscribers.",
    icon: "/gold-badge.svg",
    matches: ({ postCount, totalLikes, subscriberCount }) =>
      postCount >= 30 || totalLikes >= 100 || subscriberCount >= 50,
  },
  {
    name: "silver",
    label: "Silver",
    description: "Unlocked at 10 posts, 50 likes, or 20 subscribers.",
    icon: "/silver-badge.svg",
    matches: ({ postCount, totalLikes, subscriberCount }) =>
      postCount >= 10 || totalLikes >= 50 || subscriberCount >= 20,
  },
  {
    name: "bronze",
    label: "Bronze",
    description: "Baseline badge for every signed-in creator.",
    icon: "/bronze-badge.svg",
    matches: () => true,
  },
];

const getBadgeTier = ({ postCount, totalLikes, subscriberCount }) =>
  BADGE_TIERS.find((tier) => tier.matches({ postCount, totalLikes, subscriberCount })) || BADGE_TIERS[BADGE_TIERS.length - 1];

const Dashboard = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isIntroAnimating, setIsIntroAnimating] = useState(true); 
  const [hasDataLoaded, setHasDataLoaded] = useState(false); // Tracks when backend data is completely ready
  const navigate = useNavigate();

  const [Posts, setPosts] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("blogifyUsername") || "");
  const [stats, setStats] = useState({ totalLikes: 0, subscriberCount: 0 });
  const [loadingPosts, setLoadingPosts] = useState(false);
  const { start, done } = useLoading();
  
  const badgeTier = getBadgeTier({
    postCount: Posts.length,
    totalLikes: Number(stats.totalLikes ?? 0),
    subscriberCount: Number(stats.subscriberCount ?? 0),
  });

  const getPosts = async () => {
    const token = localStorage.getItem("blogifyToken");
    if (!token || localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/login");
      return;
    }
    if (start) start();
    setLoadingPosts(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/myposts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      const responseUsername = res.data.username || localStorage.getItem("blogifyUsername") || "";
      setUsername(responseUsername);
      if (responseUsername && !localStorage.getItem("blogifyUsername")) {
        localStorage.setItem("blogifyUsername", responseUsername);
      }
      setPosts(res.data.posts || []);
      setStats(res.data.stats || { totalLikes: 0, subscriberCount: 0 });
    } catch (error) {
      console.error("Failed to load posts:", error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("blogifyToken");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("blogifyUsername");
        navigate("/login");
      }
      setPosts([]);
      setStats({ totalLikes: 0, subscriberCount: 0 });
    } finally {
      setLoadingPosts(false);
      setHasDataLoaded(true); // Flag that the initial data download has finished
      if (done) done();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("blogifyToken");
    if (!token || localStorage.getItem("isLoggedIn") !== "true") {
      navigate("/login");
      return;
    }
    getPosts();
  }, [navigate]);

  // Handle the 3-4 second animation delay *after* the loading page/process finishes
  useEffect(() => {
    if (hasDataLoaded) {
      const timer = setTimeout(() => {
        setIsIntroAnimating(false);
      }, 3500); // 3.5 second showcase window

      return () => clearTimeout(timer);
    }
  }, [hasDataLoaded]);

  const handleEdit = (post) => {
    const postId = post.id;
    if (!postId) return;
    navigate(`/editor/${postId}`, { state: { post, isEdit: true } });
  };

  const handleDelete = async (post) => {
    const postId = post.id;
    if (!postId) return;

    const confirmed = window.confirm("Delete this post? This cannot be undone.");
    if (!confirmed) return;

    try {
      if (start) start();
      const token = localStorage.getItem("blogifyToken");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/myposts/${postId}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        withCredentials: true,
      });
      getPosts();
    } catch (error) {
      console.error("Failed to delete post:", error.response?.data || error.message);
    } finally {
      if (done) done();
    }
  };

  // Keep screen completely clear or show your global loader while the API is working.
  // The badge splash overlay only displays once data is ready.
  if (loadingPosts && !hasDataLoaded) {
    return null; // Or your loading spinner component if useLoading doesn't cover the full screen
  }

  return (
    <>
      {/* Intro Animated Spotlight Overlay — Shows for 3.5s AFTER data is ready */}
      {isIntroAnimating && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-xl pointer-events-none animate-fade-out [animation-delay:3.2s]">
          <div className="flex flex-col items-center gap-5 scale-110 md:scale-125 transition-transform duration-700 animate-pulse">
            <img
              src={badgeTier.icon}
              alt={`${badgeTier.label} badge`}
              className="h-32 w-32 object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]"
            />
            <div className="text-center space-y-1">
              <p className="text-xs font-bold tracking-[0.3em] text-sky-400 uppercase">Creator Status</p>
              <h2 className="text-2xl font-black tracking-widest text-white uppercase">
                {badgeTier.label} Tier
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div 
        className={`transition-all duration-1000 flex-1 min-h-screen bg-slate-950 text-slate-100 ${
          isSettingsOpen ? "blur-sm scale-[0.99]" : ""
        } ${isIntroAnimating ? "blur-md scale-[0.98] opacity-40 select-none pointer-events-none" : "blur-none scale-100 opacity-100"}`}
      >
        <Dashnav onOpenSettings={() => setIsSettingsOpen(true)} />
        
        <main className="max-w-7xl mx-auto p-6 md:p-10 space-y-10">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/60 pb-8">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {username || "Welcome"}
              </h1>
              
              {/* Big Floating Badge alongside name */}
              <div 
                className={`flex items-center gap-2 text-base font-bold tracking-wide text-slate-300 uppercase cursor-help hover:text-slate-100 transition-all duration-1000 ${
                  isIntroAnimating ? "opacity-0 translate-y-4 scale-75" : "opacity-100 translate-y-0 scale-100"
                }`}
                title={badgeTier.description}
              >
                <img
                  src={badgeTier.icon}
                  alt={`${badgeTier.label} badge`}
                  className="h-24 w-24 object-contain drop-shadow-[0_4px_12px_rgba(255,255,255,0.15)] transform transition-transform hover:scale-110"
                />
                
              </div>
            </div>

            {/* Modern Quick Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-850 hover:text-white hover:border-slate-700 active:scale-95"
                onClick={() => navigate('/readblog')}
              >
                <span>Read Random Blogs</span>
              </button>
              
              <button
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-slate-100 shadow-sm active:scale-95"
                onClick={() => navigate('/editor')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Create New Blog</span>
              </button>
            </div>
          </div>

          {/* Stats Analytics Panel */}
          <div className="transition-all duration-300 hover:scale-[1.005]">
            <StatsCards posts={Posts} stats={stats} />
          </div>

          {/* Table / Main Content Block */}
          <div className="rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md p-1">
            <PostsTable posts={Posts} onEdit={handleEdit} onDelete={handleDelete} />
          </div>
          
        </main>
      </div>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default Dashboard;