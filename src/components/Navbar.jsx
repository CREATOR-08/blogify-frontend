import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("blogifyToken");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full h-20 flex items-center justify-between px-6 md:px-12 bg-[#020617]/70 border-b border-white/5 backdrop-blur-md select-none transition-all duration-300">
      
      {/* Brand Logo & Name */}
      <div className="flex items-center">
  <Link to="/" className="flex items-center gap-3 group">
    <img
      src="/logo.png"
      alt="Blogify logo"
      className="h-12 w-12 object-contain transition-transform duration-300 group-hover:scale-105"
    />

    <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-300 group-hover:to-blue-400 transition-all duration-300">
      Blogify
      <span className="text-blue-500 group-hover:animate-pulse">.</span>
    </span>
  </Link>
</div>

      {/* Navigation Links */}
      <ul className="flex items-center gap-6 md:gap-8 text-sm font-medium tracking-wide text-slate-400">
        <li>
          <Link 
            to="/" 
            className="relative py-2 text-slate-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </Link>
        </li>
        
        {isLoggedIn && (
          <li>
            <Link 
              to="/dashboard" 
              className="relative py-2 text-slate-300 hover:text-white transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-blue-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              Dashboard
            </Link>
          </li>
        )}

        {/* Dynamic Auth Actions */}
        {!isLoggedIn ? (
          <>
            <li>
              <Link 
                to="/login" 
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Log In
              </Link>
            </li>
            <li>
              <Link 
                to="/signup" 
                className="relative px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-600/10 shadow-lg backdrop-blur-sm transition-all duration-300 active:scale-95"
              >
                Sign Up
              </Link>
            </li>
          </>
        ) : (
          <li>
            <button 
              onClick={handleLogout} 
              className="relative px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/40 border border-white/5 hover:border-red-500/30 hover:bg-red-950/20 shadow-md backdrop-blur-sm transition-all duration-300 active:scale-95"
            >
              Log Out
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;