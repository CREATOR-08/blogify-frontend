import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { start, done } = useLoading();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (start) start();
    try {
      const res = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 200) {
        setSuccess("Account created successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError(data.error || data.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      if (done) done();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="px-10 py-12 sm:px-14">
            <div className="mb-8">
              <div className="text-cyan-300 text-sm uppercase tracking-[0.4em] mb-3">Welcome to Blogify</div>
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Create your account</h1>
              <p className="mt-4 max-w-lg text-slate-400">Join Blogify to publish blogs, connect with readers, and save your ideas. The signup experience now matches the home page theme.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              {success && <p className="text-sm text-emerald-400">{success}</p>}
              <button
                type="submit"
                className="w-full rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-8 text-sm text-slate-400">
              Already have an account?{' '}
              <button onClick={() => navigate('/login')} className="font-semibold text-cyan-300 hover:text-cyan-200">
                Log in
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.15),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.95),_rgba(15,23,42,0.95))] p-0 sm:p-0">
            <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-slate-700 bg-slate-950/90 shadow-inner shadow-black/20">
              <img
                className="h-full w-full object-cover opacity-90"
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80"
                alt="Blogging workspace"
              />
              <div className="absolute inset-0 bg-slate-950/70 p-8 flex flex-col justify-between">
                <div>
                  <div className="mb-8 text-cyan-300 text-sm uppercase tracking-[0.4em]">Your creative space</div>
                  <h2 className="text-3xl font-bold text-white">Design posts that stand out.</h2>
                  <p className="mt-4 max-w-sm text-slate-400">A polished signup page with a real image section makes the experience feel warm and premium.</p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-3xl bg-slate-900/80 p-5 text-slate-300 shadow-lg shadow-black/20 backdrop-blur-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Fast setup</p>
                    <p className="mt-3 text-sm">Get up and running quickly with a modern blog dashboard.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-5 text-slate-300 shadow-lg shadow-black/20 backdrop-blur-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Built for creators</p>
                    <p className="mt-3 text-sm">Save drafts, publish stories, and grow your audience all from one app.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
