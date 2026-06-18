import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ post }) => {
  const navigate = useNavigate();
  const postId = post.id;

  return (
    <article
      className={`rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-lg shadow-black/30 hover:bg-slate-800 transition ${
        postId ? "cursor-pointer hover:border-cyan-400" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {post.title || post.heading || "Untitled"}
          </h2>
          <p className="text-sm text-gray-400">By {post.name || "Unknown"}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {post.topic && (
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-sky-300">
              {post.topic}
            </span>
          )}
          {post.age_restriction && (
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-gray-400">
              {post.age_restriction}
            </span>
          )}
          {post.ageRestriction && (
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-gray-400">
              {post.ageRestriction}
            </span>
          )}
        </div>
      </div>
      <p className="text-gray-300 leading-relaxed mb-6">
        {post.content?.slice(0, 260) ||
          post.body?.slice(0, 260) ||
          "No preview available."}
        {(post.content?.length > 260 || post.body?.length > 260) && "..."}
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
          <span className="rounded-full bg-slate-800 px-3 py-1 text-sky-300">
            Random Selection
          </span>
          <span className="rounded-full bg-slate-800 px-3 py-1">
            Likes: {post.total_likes ?? 0}
          </span>
        </div>
        <button
          onClick={() => navigate(`/readblog/${postId}`)}
          className="rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-400"
        >
          Read full blog
        </button>
      </div>
    </article>
  );
};

export default BlogCard;
