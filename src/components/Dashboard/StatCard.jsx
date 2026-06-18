import React from "react";

const StatCard = ({ label, value }) => {
  return (
    <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl shadow">
      <p className="text-slate-400">{label}</p>
      <h2 className="text-2xl font-bold text-white">{value}</h2>
    </div>
  );
};

export default StatCard;
