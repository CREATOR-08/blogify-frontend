import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Dashnav from "../components/Dashnav";
import { useLoading } from "../context/LoadingContext";

const CreateBlog = () => {
  const location = useLocation();
  const { id } = useParams();
  const isEdit = Boolean(location.state?.isEdit || id);
  const [showDialog, setShowDialog] = useState(!isEdit);
  const [details, setDetails] = useState({
    title: "",
    topic: "",
    ageRestriction: "All ages",
  });
  const [content, setContent] = useState("");
  const [step, setStep] = useState(isEdit ? "editor" : "details");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { start, done } = useLoading();

  useEffect(() => {
    if (isEdit) {
      const existingPost = location.state?.post;
      if (existingPost) {
        setDetails({
          title: existingPost.title || existingPost.heading || "",
          topic: existingPost.topic || "",
          ageRestriction: existingPost.ageRestriction || existingPost.age_restriction || "All ages",
        });
        setContent(existingPost.content || existingPost.body || "");
        setShowDialog(false);
        setStep("editor");
        return;
      }

      const fetchPost = async () => {
        if (start) start();
        setLoading(true);
        try {
          const token = localStorage.getItem("blogifyToken");
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/myposts/${id}`, {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
            withCredentials: true,
          });
          const existing = res.data.post;
          setDetails({
            title: existing.title || existing.heading || "",
            topic: existing.topic || "",
            ageRestriction: existing.ageRestriction || existing.age_restriction || "All ages",
          });
          setContent(existing.content || existing.body || "");
          setShowDialog(false);
          setStep("editor");
        } catch (err) {
          setError(err.response?.data?.message || err.message || "Failed to load post.");
        } finally {
          setLoading(false);
          if (done) done();
        }
      };

      if (id) {
        fetchPost();
      }
    }
  }, [id, isEdit, location.state]);

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!details.title.trim()) {
      setError("Please enter a title for your blog.");
      return;
    }
    if (!details.topic.trim()) {
      setError("Please enter a topic for your blog.");
      return;
    }

    setError(null);
    setShowDialog(false);
    setStep("editor");
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError("Please write your blog content before publishing.");
      return;
    }

    if (start) start();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("blogifyToken");
      const body = {
        title: details.title,
        topic: details.topic,
        ageRestriction: details.ageRestriction,
        content,
      };
      const url = isEdit && id ? `${import.meta.env.VITE_API_URL}/api/myposts/${id}` : `${import.meta.env.VITE_API_URL}/api/createpost`;
      const response = isEdit
        ? await axios.put(url, body, {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
            withCredentials: true,
          })
        : await axios.post(url, body, {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
            withCredentials: true,
          });

      setSuccess(isEdit ? "Blog updated successfully." : "Blog published successfully.");
      if (!isEdit) {
        setContent("");
        setShowDialog(false);
        setStep("editor");
      } else {
        navigate("/dashboard");
      }

      if (!isEdit && response.data.post && response.data.post.id) {
        navigate(`/readblog/${response.data.post.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to publish blog.");
    } finally {
      setLoading(false);
      if (done) done();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Dashnav />
      <main className="mx-auto max-w-5xl p-8">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <button
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <h1 className="text-3xl font-bold">Create New Blog</h1>
        </div>

        {success && <div className="mb-6 rounded-3xl bg-emerald-500/10 p-4 text-emerald-200">{success}</div>}

        {error && <div className="mb-6 rounded-3xl bg-red-500/10 p-4 text-red-200">{error}</div>}

        {step === "editor" && (
          <form onSubmit={handlePublish} className="space-y-6">
            <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
              <div className="mb-4 text-sm text-gray-400">Blog details</div>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <h2 className="text-sm uppercase text-slate-400">Title</h2>
                  <p className="text-lg font-semibold text-white">{details.title || "Untitled"}</p>
                </div>
                <div>
                  <h2 className="text-sm uppercase text-slate-400">Topic</h2>
                  <p className="text-lg font-semibold text-white">{details.topic || "None"}</p>
                </div>
                <div>
                  <h2 className="text-sm uppercase text-slate-400">Age restriction</h2>
                  <p className="text-lg font-semibold text-white">{details.ageRestriction}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
              <label className="mb-2 block text-sm font-medium text-gray-300">Write your blog</label>
              <textarea
                rows={18}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full resize-none rounded-3xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none focus:border-sky-500"
                placeholder="Start writing your story here..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-white hover:border-sky-500"
                onClick={() => setShowDialog(true)}
              >
                Edit details
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Publishing..." : "Publish Blog"}
              </button>
            </div>
          </form>
        )}

        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
            <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-950 p-8 shadow-2xl shadow-black/50">
              <h2 className="mb-6 text-2xl font-bold">Enter blog details</h2>
              <form onSubmit={handleDetailsSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Title</label>
                  <input
                    type="text"
                    value={details.title}
                    onChange={(e) => setDetails({ ...details, title: e.target.value })}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500"
                    placeholder="Enter your blog title"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Topic</label>
                  <input
                    type="text"
                    value={details.topic}
                    onChange={(e) => setDetails({ ...details, topic: e.target.value })}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500"
                    placeholder="Example: Travel, Food, Technology"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Age restriction</label>
                  <select
                    value={details.ageRestriction}
                    onChange={(e) => setDetails({ ...details, ageRestriction: e.target.value })}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none focus:border-sky-500"
                  >
                    <option>All ages</option>
                    <option>13+</option>
                    <option>16+</option>
                    <option>18+</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    type="submit"
                    className="rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white hover:bg-sky-400"
                  >
                    Start writing
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-slate-700 bg-slate-900 px-5 py-3 text-sm text-white hover:border-sky-500"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CreateBlog;
