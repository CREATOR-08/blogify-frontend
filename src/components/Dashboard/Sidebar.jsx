import React from "react";

const Sidebar = () => {
  return (
    <div className="w-64 bg-slate-900 shadow-lg border-r border-slate-700">
      <div className="p-6 font-bold text-xl border-b border-slate-700 text-white">
        Blogify
      </div>
      <div className="flex flex-col p-6 gap-3">
        <button className="text-left hover:bg-slate-800 p-2 rounded text-slate-300 hover:text-white transition">
          Dashboard
        </button>
        <button className="text-left hover:bg-slate-800 p-2 rounded text-slate-300 hover:text-white transition">
          My Posts
        </button>
        <button className="text-left hover:bg-slate-800 p-2 rounded text-slate-300 hover:text-white transition">
          Create Post
        </button>
        <button className="text-left hover:bg-slate-800 p-2 rounded text-slate-300 hover:text-white transition">
          Settings
        </button>
      </div>
    </div>
  )
}

export default Sidebar