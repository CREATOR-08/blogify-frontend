import React, { useState, useEffect } from "react";
import { useLoading } from "../context/LoadingContext";
import { useNavigate } from "react-router-dom";

const Loginpage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { start, done } = useLoading();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const googleError = urlParams.get('googleError');

    if (token) {
      localStorage.setItem("blogifyToken", token);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
      return;
    }

    if (googleError) {
      setError(googleError);
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loginuser = async (e) => {
    e.preventDefault();
    setError(null);
    if (start) start();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 200) {
        if (data.token) {
          localStorage.setItem("blogifyToken", data.token);
        }
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        setError(data.error || data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
      if (done) done();
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40">
        <div className="grid gap-0 lg:grid-cols-2">
          <div className="px-10 py-12 sm:px-14">
            <div className="mb-8">
              <div className="text-cyan-300 text-sm uppercase tracking-[0.4em] mb-3">Welcome back</div>
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Login to Blogify</h1>
              <p className="mt-4 max-w-lg text-slate-400">Access your dashboard, manage posts, and explore readers while keeping the login page consistent with the site theme.</p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full rounded-full border border-slate-700 bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 mb-4"
            >
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-slate-900 px-2 text-slate-400">or</span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={loginuser}>
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
                <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-full bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-8 text-sm text-slate-400">
              Not signed up yet?{' '}
              <button onClick={() => navigate('/signup')} className="font-semibold text-cyan-300 hover:text-cyan-200">
                Create an account
              </button>
            </div>
          </div>

          <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.15),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.95),_rgba(15,23,42,0.95))] p-0 sm:p-0">
            <div className="relative h-full w-full rounded-[2rem] overflow-hidden border border-slate-700 bg-slate-950/90 shadow-inner shadow-black/20">
              <img
                className="h-full w-full object-cover opacity-90"
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"
                alt="Creative workspace"
              />
              <div className="absolute inset-0 bg-slate-950/72 p-8 flex flex-col justify-between">
                <div>
                  <div className="mb-8 text-cyan-300 text-sm uppercase tracking-[0.4em]">A better way to write</div>
                  <h2 className="text-3xl font-bold text-white">Secure access for creators</h2>
                  <p className="mt-4 max-w-sm text-slate-400">Login to start publishing faster, manage your blog, and grow your audience with Blogify.</p>
                </div>
                <div className="grid gap-4">
                  <div className="rounded-3xl bg-slate-900/80 p-5 text-slate-300 shadow-lg shadow-black/20 backdrop-blur-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Fast access</p>
                    <p className="mt-3 text-sm">Sign in quickly and continue working on your latest posts.</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/80 p-5 text-slate-300 shadow-lg shadow-black/20 backdrop-blur-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Stay inspired</p>
                    <p className="mt-3 text-sm">Get motivated to write content that readers love.</p>
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

export default Loginpage;