import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Dashnav from "../components/Dashnav";
import { useLoading } from "../context/LoadingContext";

const ReadblogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasRecordedView, setHasRecordedView] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { start, done } = useLoading();

  useEffect(() => {
    const fetchPost = async () => {
      if (start) start();
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("blogifyToken");
        const postRes = await axios.get(`http://localhost:8000/api/readblogs/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          withCredentials: true,
        });

        setPost(postRes.data.post);
        setHasLiked(postRes.data.hasLiked || false);
        setIsSubscribed(postRes.data.isSubscribed || false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Failed to load blog.");
      } finally {
        setLoading(false);
        if (done) done();
      }
    };

    setHasRecordedView(false);
    fetchPost();
  }, [id]);

  useEffect(() => {
    if (!post || hasRecordedView) return;

    const timer = setTimeout(async () => {
      try {
        const token = localStorage.getItem("blogifyToken");
        await axios.post(
          `http://localhost:8000/api/readblogs/${id}/viewed`,
          {},
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
            withCredentials: true,
          }
        );
      } catch (err) {
        console.warn("Failed to record view:", err.response?.data?.message || err.message);
      } finally {
        setHasRecordedView(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, post, hasRecordedView]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Dashnav />
      <main className="mx-auto max-w-5xl p-8">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            onClick={() => navigate("/readblog")}
          >
            Back to Read Blogs
          </button>
          <h1 className="text-3xl font-bold">Blog Detail</h1>
        </div>

        {loading && <p className="text-gray-300">Loading blog...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && post && (
          <article className="rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-lg shadow-black/30">
            <header className="mb-6">
              <h2 className="text-4xl font-bold text-white mb-3">{post.title || post.heading || "Untitled"}</h2>
              <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                <span>By {post.name || "Unknown author"}</span>
                {post.topic && <span>Topic: {post.topic}</span>}
                {post.age_restriction && <span>Age: {post.age_restriction}</span>}
                {post.ageRestriction && <span>Age: {post.ageRestriction}</span>}
              </div>
            </header>
            <div className="flex flex-wrap gap-3 items-center mb-6 text-gray-400">
              <span>{Number(post.total_likes || 0)} like{Number(post.total_likes || 0) === 1 ? "" : "s"}</span>
            </div>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-100">
              {post.content || post.body || "No content available."}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className={`rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 ${
                  hasLiked
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-sky-500 hover:bg-sky-400"
                }`}
                onClick={async () => {
                  if (isProcessing) return;
                  setIsProcessing(true);
                  try {
                    if (start) start();
                    const token = localStorage.getItem("blogifyToken");
                    const res = await axios.post(
                      `http://localhost:8000/api/readblogs/${id}/like`,
                      {},
                      {
                        headers: {
                          Authorization: token ? `Bearer ${token}` : undefined,
                        },
                        withCredentials: true,
                      }
                    );
                    setPost({ ...post, total_likes: res.data.stats.total_likes });
                    setHasLiked(res.data.hasLiked || false);
                  } catch (err) {
                    setError(err.response?.data?.message || err.message || "Failed to like blog.");
                  } finally {
                    setIsProcessing(false);
                    if (done) done();
                  }
                }}
                disabled={hasLiked}
              >
                {hasLiked ? "Liked" : "Like"}
              </button>
              <button
                className={`rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 ${
                  isSubscribed
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={async () => {
                  if (isProcessing) return;
                  setIsProcessing(true);
                  try {
                    if (start) start();
                    const token = localStorage.getItem("blogifyToken");
                    const endpoint = isSubscribed 
                      ? `http://localhost:8000/api/readblogs/${id}/unsubscribe`
                      : `http://localhost:8000/api/readblogs/${id}/subscribe`;
                    
                    const res = await axios.post(
                      endpoint,
                      {},
                      {
                        headers: {
                          Authorization: token ? `Bearer ${token}` : undefined,
                        },
                        withCredentials: true,
                      }
                    );
                    setIsSubscribed(res.data.isSubscribed ?? !isSubscribed);
                  } catch (err) {
                    setError(err.response?.data?.message || err.message || `Failed to ${isSubscribed ? 'unsubscribe' : 'subscribe'}.`);
                  } finally {
                    setIsProcessing(false);
                    if (done) done();
                  }
                }}
              >
                {isSubscribed ? "Unsubscribe" : "Subscribe"}
              </button>
            </div>
          </article>
        )}
      </main>
    </div>
  );
};

export default ReadblogDetail;
