import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLoading } from "../context/LoadingContext";
import Sidebar from "../components/Sidebar";

import StatsCards from "../components/StatsCards";
import PostsTable from "../components/PostsTable";
import Dashnav from "../components/Dashnav";
import Settings from "../components/Settings";
const Dashboard = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();

  const [Posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [stats, setStats] = useState({ totalLikes: 0, subscriberCount: 0 });
  const [loadingPosts, setLoadingPosts] = useState(false);
  const { start, done } = useLoading();
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
      setUsername(res.data.username || "");
      setPosts(res.data.posts || []);
      setStats(res.data.stats || { totalLikes: 0, subscriberCount: 0 });
    } catch (error) {
      console.error("Failed to load posts:", error.response?.data || error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("blogifyToken");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
      }
      setPosts([]);
      setStats({ totalLikes: 0, subscriberCount: 0 });
    } finally {
      setLoadingPosts(false);
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

  const handleEdit = (post) => {
    const postId = post.id;
    if (!postId) return;
    navigate(`/editblog/${postId}`, { state: { post, isEdit: true } });
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

  return (
    <>
    <div
      className={`${isSettingsOpen ? "blur-sm" : ""} transition flex-1 min-h-screen`}
    >
      <Dashnav onOpenSettings={() => setIsSettingsOpen(true)} />
      <div className="p-8">
        <h1 className="text-white font-bold mb-4 text-center text-2xl">
          {username || (loadingPosts ? "Loading..." : "Welcome")}
        </h1>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <button
            className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            onClick={() => navigate('/readblog')}
          >
            Read Random Blogs
          </button>
          <button
            className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
            onClick={() => navigate('/createblog')}
          >
            Create New Blog
          </button>
        </div>

        <StatsCards posts={Posts} stats={stats} />

        <PostsTable posts={Posts} onEdit={handleEdit} onDelete={handleDelete} />
        
      </div>
    </div>
    <Settings
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
    </>
  );
  
}

export default Dashboard