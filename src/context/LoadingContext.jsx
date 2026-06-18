import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LoadingContext = createContext(null);

// A curated list of inspiring quotes for a blogging platform
const BLOGGING_QUOTES = [
  "“The first draft is just you telling yourself the story.” – Terry Pratchett",
  "“Don't focus on having a great blog. Focus on producing a blog that's great for your readers.” – Brian Clark",
  "“Words are a lens to focus one’s mind.” – Ayn Rand",
  "“Blogging is to writing what extreme sports are to athletics: more free-form, more accident-prone, less formal.” – Andrew Sullivan",
  "“Write what should not be forgotten.” – Isabel Allende",
  "“The secret of getting ahead is getting started.” – Mark Twain"
];

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [currentQuote, setCurrentQuote] = useState("");
  const location = useLocation();

  const start = useCallback(() => setLoading(true), []);
  const done = useCallback(() => setLoading(false), []);

  // Pick a random quote whenever the loader starts up
  useEffect(() => {
    if (loading) {
      const randomIndex = Math.floor(Math.random() * BLOGGING_QUOTES.length);
      setCurrentQuote(BLOGGING_QUOTES[randomIndex]);
    }
  }, [loading]);

  // Hide loader when route changes
  useEffect(() => {
    done();
  }, [location, done]);

  return (
    <LoadingContext.Provider value={{ loading, start, done, setLoading }}>
      {children}
      
      <div
        className={`fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#020617]/90 backdrop-blur-md transition-all duration-300 ${
          loading ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-6 max-w-md px-6 text-center text-white">
          
          {/* Logo with an active, elegant spinning ring */}
          <div className="relative flex items-center justify-center">
            {/* Outer animated gradient glow ring */}
            <div className="absolute h-32 w-32 animate-spin rounded-full border-2 border-transparent border-t-cyan-400 border-b-fuchsia-500 duration-1000"></div>
            
            {/* Static Logo */}
            <img
              src="/logo.png"
              alt="Loading logo"
              className="relative h-28 w-28 rounded-full border border-slate-800 bg-[#020617] p-2 shadow-xl"
            />
          </div>

          {/* Loading status */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Curating Content
            </span>
            {/* Subtle bouncing dots */}
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.3s]"></span>
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.15s]"></span>
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400"></span>
            </span>
          </div>

          {/* Decorative Divider */}
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

          {/* Dynamically Generated Quote */}
          <p className="min-h-[3rem] text-sm italic leading-relaxed text-slate-400 transition-opacity duration-300">
            {currentQuote}
          </p>
          
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