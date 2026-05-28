import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const start = useCallback(() => setLoading(true), []);
  const done = useCallback(() => setLoading(false), []);

  // Hide loader when route changes
  useEffect(() => {
    done();
  }, [location, done]);

  // Also listen to history methods to show loader when navigation is programmatic
  useEffect(() => {
    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    const startLoad = () => start();

    window.history.pushState = function (...args) {
      originalPush.apply(this, args);
      startLoad();
    };
    window.history.replaceState = function (...args) {
      originalReplace.apply(this, args);
      startLoad();
    };
    window.addEventListener("popstate", startLoad);

    return () => {
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
      window.removeEventListener("popstate", startLoad);
    };
  }, [start]);

  return (
    <LoadingContext.Provider value={{ loading, start, done, setLoading }}>
      {children}
      <div
        className={`fixed inset-0 z-[1000] items-center justify-center bg-slate-950/85 backdrop-blur-md transition-opacity duration-200 ${
          loading ? "flex opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center text-white">
          <img
            src="/logo.png"
            alt="Loading logo"
            className="h-28 w-28 rounded-full border border-cyan-400 bg-slate-900 p-2 shadow-xl shadow-cyan-500/20"
          />
          <div className="text-lg font-semibold">Loading...</div>
        </div>
      </div>
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
};

export default LoadingContext;
