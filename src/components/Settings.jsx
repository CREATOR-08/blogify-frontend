import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLoading } from "../context/LoadingContext";

const Settings = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState("main");
  const [formData, setFormData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [switchData, setSwitchData] = useState({ targetUsername: "", password: "" });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { start, done } = useLoading();

  if (!isOpen) return null;

  const token = localStorage.getItem("blogifyToken");

  const resetState = () => {
    setMode("main");
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setMessage(null);
    setError(null);
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("blogifyToken");
    localStorage.removeItem("isLoggedIn");
    handleClose();
    navigate("/login");
  };

  const handleSwitchAccount = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { targetUsername, password } = switchData;
    if (!targetUsername || !password) {
      setError("Please enter the username and password for the account you want to switch to.");
      return;
    }

    setIsProcessing(true);
    if (start) start();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/switch-account`,
        { targetUsername, password },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      localStorage.setItem("blogifyToken", res.data.token);
      localStorage.setItem("isLoggedIn", "true");
      setMessage(res.data.message || "Switched account successfully.");
      setSwitchData({ targetUsername: "", password: "" });
      setMode("main");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to switch account.");
    } finally {
      setIsProcessing(false);
      if (done) done();
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Delete your account permanently? This action cannot be undone.");
    if (!confirmed) return;

    setIsProcessing(true);
    if (start) start();
    setError(null);
    setMessage(null);

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/user`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        withCredentials: true,
      });

      localStorage.removeItem("blogifyToken");
      localStorage.removeItem("isLoggedIn");
      handleClose();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to delete account.");
    } finally {
      setIsProcessing(false);
      if (done) done();
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { currentPassword, newPassword, confirmPassword } = formData;
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation must match.");
      return;
    }

    setIsProcessing(true);
    if (start) start();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/change-password`,
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setMessage(res.data.message || "Password updated successfully.");
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to change password.");
    } finally {
      setIsProcessing(false);
      if (done) done();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose}></div>
      <div className="relative bg-slate-950 w-[400px] rounded-xl border border-slate-700 p-6 shadow-lg shadow-black/50 z-10" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-6 text-white">Settings</h2>

        {mode === "main" ? (
          <div className="flex flex-col gap-3">
            <button className="text-left hover:bg-gray-100 p-2 rounded" onClick={() => setMode("password")}>
              Change Password
            </button>
            <button className="text-left hover:bg-gray-100 p-2 rounded" onClick={() => setMode("switch")}>
              Switch Account
            </button>
            <button className="text-left hover:bg-gray-100 p-2 rounded" onClick={handleLogout} disabled={isProcessing}>
              Logout
            </button>
            <button
              className="text-left text-red-500 hover:bg-red-100 p-2 rounded"
              onClick={handleDeleteAccount}
              disabled={isProcessing}
            >
              Delete Account
            </button>
          </div>
        ) : mode === "switch" ? (
          <form className="space-y-4" onSubmit={handleSwitchAccount}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Target Username</label>
              <input
                type="text"
                value={switchData.targetUsername}
                onChange={(e) => setSwitchData({ ...switchData, targetUsername: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={switchData.password}
                onChange={(e) => setSwitchData({ ...switchData, password: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
            <p className="text-sm text-slate-500">You can only switch to another account with the same email address.</p>
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-xl bg-gray-200 px-4 py-2 text-sm"
                onClick={() => {
                  setMode("main");
                  setMessage(null);
                  setError(null);
                }}
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
                disabled={isProcessing}
              >
                {isProcessing ? "Switching..." : "Switch Account"}
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-cyan-500"
              />
            </div>
            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                className="rounded-xl bg-gray-200 px-4 py-2 text-sm"
                onClick={() => {
                  setMode("main");
                  setMessage(null);
                  setError(null);
                }}
              >
                Back
              </button>
              <button
                type="submit"
                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
                disabled={isProcessing}
              >
                {isProcessing ? "Saving..." : "Update Password"}
              </button>
            </div>
          </form>
        )}

        <button onClick={handleClose} className="mt-6 bg-gray-800 text-white px-4 py-2 rounded w-full">
          Close
        </button>
      </div>
    </div>
  );
};

export default Settings;