import React from "react";
import StatCard from "./StatCard";

const StatsCards = ({ posts, stats }) => {
  const totalLikes = stats?.totalLikes ?? 0;
  const subscriberCount = stats?.subscriberCount ?? 0;

  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <StatCard label="Total Posts" value={posts.length} />
      <StatCard label="Total Likes" value={totalLikes} />
      <StatCard label="Subscribers" value={subscriberCount} />
    </div>
  );
};

export default StatsCards;