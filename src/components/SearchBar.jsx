import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/readblog?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate("/readblog");
    }
  };

  return (
    <div className="ml-auto flex items-center gap-2">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        type="text"
        placeholder="Search..."
        className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
