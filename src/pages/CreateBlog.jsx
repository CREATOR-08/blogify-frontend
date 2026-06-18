import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Dashnav from "../components/Dashboard/Dashnav";
import CurrentEventsPanel from "../components/CurrentEventsPanel";
import { useLoading } from "../context/LoadingContext";
import { fetchCurrentEvents } from "../utils/api";

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
  const [eventsPanelOpen, setEventsPanelOpen] = useState(true); // Open by default for better utility view
  const [selectedCountry, setSelectedCountry] = useState("Worldwide");
  const [eventsData, setEventsData] = useState(null);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [eventsError, setEventsError] = useState(null);
  
  // Media Modal States
  const [mediaModal, setMediaModal] = useState({ isOpen: false, type: "" });
  const [mediaUrl, setMediaUrl] = useState("");
  
  const textareaRef = useRef(null);
  const navigate = useNavigate();
  const { start, done } = useLoading();

  const loadCurrentEvents = useCallback(
    async (country = selectedCountry) => {
      setEventsLoading(true);
      setEventsError(null);

      try {
        const response = await fetchCurrentEvents(country);
        setEventsData(response.data);
      } catch (err) {
        setEventsError(err.response?.data?.message || err.message || "Failed to load current events.");
      } finally {
        setEventsLoading(false);
      }
    },
    [selectedCountry]
  );

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
  }, [done, id, isEdit, location.state, start]);

  useEffect(() => {
    if (!eventsPanelOpen) return;
    loadCurrentEvents(selectedCountry);
  }, [eventsPanelOpen, selectedCountry, loadCurrentEvents]);

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
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
            withCredentials: true,
          })
        : await axios.post(url, body, {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
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

  // Media Insertion Handler
  const insertMediaTag = (e) => {
    e.preventDefault();
    if (!mediaUrl.trim()) return;

    const tag = mediaModal.type === "image" ? `![Image](${mediaUrl})` : `![Video](${mediaUrl})`;
    const textarea = textareaRef.current;

    if (textarea) {
      const startPos = textarea.selectionStart;
      const endPos = textarea.selectionEnd;
      const newContent = content.substring(0, startPos) + tag + content.substring(endPos, content.length);
      setContent(newContent);
    } else {
      setContent((prev) => prev + "\n" + tag);
    }

    setMediaUrl("");
    setMediaModal({ isOpen: false, type: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-sky-500/30">
      <Dashnav />
      
      <main className="mx-auto max-w-7xl p-4 md:p-8">
        {/* Header Actions Container */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <button
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Blog Editor
            </h1>
          </div>
          
          <button
            type="button"
            onClick={() => setEventsPanelOpen(!eventsPanelOpen)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition duration-200 ${
              eventsPanelOpen 
                ? "border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20" 
                : "border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {eventsPanelOpen ? "Hide Current Events" : "Show Current Events"}
          </button>
        </div>

        {success && <div className="mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-400">{success}</div>}
        {error && <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-400">{error}</div>}

        {/* Master Workspace Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          {/* Main Editing Column */}
          <div className={`transition-all duration-300 ${eventsPanelOpen ? "lg:col-span-8" : "lg:col-span-12"}`}>
            {step === "editor" && (
              <form onSubmit={handlePublish} className="space-y-6">
                
                {/* Meta details header strip */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur p-5">
                  <div className="grid gap-4 grid-cols-3 text-center md:text-left">
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Title</h2>
                      <p className="text-base font-semibold text-slate-200 truncate">{details.title || "Untitled"}</p>
                    </div>
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Topic</h2>
                      <p className="text-base font-semibold text-slate-200 truncate">{details.topic || "None"}</p>
                    </div>
                    <div>
                      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Age Restriction</h2>
                      <p className="text-base font-semibold text-slate-300">{details.ageRestriction}</p>
                    </div>
                  </div>
                </div>

                {/* Core Rich Text Workspace Area */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden focus-within:border-sky-500/50 transition">
                  {/* Toolbar Option Bar */}
                  <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/50 px-4 py-2">
                    <span className="text-xs font-medium text-slate-500 mr-2">Insert Media:</span>
                    <button
                      type="button"
                      onClick={() => setMediaModal({ isOpen: true, type: "image" })}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      📷 Image Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaModal({ isOpen: true, type: "video" })}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      🎥 Video Link
                    </button>
                  </div>

                  <textarea
                    ref={textareaRef}
                    rows={16}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full resize-none bg-slate-950 px-5 py-4 text-slate-100 outline-none placeholder-slate-600 font-mono text-sm leading-relaxed"
                    placeholder="Start writing your story here... (Markdown syntax is active for media objects)"
                  />
                </div>

                {/* Footer Publisher Controls */}
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
                    onClick={() => setShowDialog(true)}
                  >
                    Modify Details
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/10 hover:from-sky-400 hover:to-blue-500 transition disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Publishing..." : "Publish Blog"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Embedded Right Panel Ecosystem */}
          {eventsPanelOpen && (
            <div className="lg:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
              <h3 className="text-sm font-bold text-slate-400 mb-4 tracking-wide uppercase px-2">Inspirations / Current Events</h3>
              <CurrentEventsPanel
                isOpen={eventsPanelOpen}
                onOpen={() => setEventsPanelOpen(true)}
                onClose={() => setEventsPanelOpen(false)}
                country={selectedCountry}
                onCountryChange={setSelectedCountry}
                onRefresh={() => loadCurrentEvents(selectedCountry)}
                loading={eventsLoading}
                error={eventsError}
                data={eventsData}
                inlineLayout={true} // Add custom layout handling flag if supported natively inside your panel
              />
            </div>
          )}
        </div>

        {/* Media Injection Utility Modal */}
        {mediaModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-white capitalize mb-2">Insert Link for {mediaModal.type}</h3>
              <p className="text-xs text-slate-400 mb-4">Paste the direct hosted file URL source to embed inside the markdown content area.</p>
              <form onSubmit={insertMediaTag} className="space-y-4">
                <input
                  type="url"
                  required
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder={`https://example.com/source-${mediaModal.type}.mp4`}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500"
                />
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setMediaModal({ isOpen: false, type: "" }); setMediaUrl(""); }}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-400"
                  >
                    Insert to Editor
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Core Detail Setup Modal */}
        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-xs">
            <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 shadow-2xl">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-white">Enter blog details</h2>
              <form onSubmit={handleDetailsSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Title</label>
                  <input
                    type="text"
                    value={details.title}
                    onChange={(e) => setDetails({ ...details, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="Enter your blog title"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Topic</label>
                  <input
                    type="text"
                    value={details.topic}
                    onChange={(e) => setDetails({ ...details, topic: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="Example: Travel, Food, Technology"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">Age Restriction</label>
                  <select
                    value={details.ageRestriction}
                    onChange={(e) => setDetails({ ...details, ageRestriction: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none focus:border-sky-500"
                  >
                    <option>All ages</option>
                    <option>13+</option>
                    <option>16+</option>
                    <option>18+</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-4 pt-4 justify-end">
                  <button
                    type="button"
                    className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/10 hover:from-sky-400 hover:to-blue-500 transition"
                  >
                    Start writing
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