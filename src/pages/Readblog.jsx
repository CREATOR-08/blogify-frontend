import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLoading } from "../context/LoadingContext";
import { useNavigate, useLocation } from "react-router-dom";
import Dashnav from "../components/Dashboard/Dashnav";
import BlogCard from "../components/BlogCard";

const Readblog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const { start, done } = useLoading();

  useEffect(() => {
    const fetchBlogs = async () => {
      if (start) start();
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("blogifyToken");
        const url = query ? `${import.meta.env.VITE_API_URL}/api/readblogs?q=${encodeURIComponent(query)}` : `${import.meta.env.VITE_API_URL}/api/readblogs`;
        const res = await axios.get(url, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          withCredentials: true,
        });

        setPosts(res.data.posts || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load blogs.");
      } finally {
        setLoading(false);
        if (done) done();
      }
    };

    fetchBlogs();
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Dashnav />
      <div className="flex flex-col md:flex-row">
        <main className="flex-1 p-8">
          <div className="flex flex-col gap-2 mb-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <button
                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>
              <h1 className="text-3xl font-bold">Read Blogs</h1>
            </div>
            {query && (
              <div className="text-sm text-gray-300">
                Showing results for <span className="font-semibold text-white">"{query}"</span>
              </div>
            )}
          </div>

          {loading && <p className="text-gray-300">Loading random blogs...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && posts.length === 0 && (
            <p className="text-gray-300">No blogs found yet.</p>
          )}

          <div className="grid gap-6">
            {posts.map((post) => (
              <BlogCard key={post.id || post.title} post={post} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Readblog;
