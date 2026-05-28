import React from "react";

const StatCard = ({ label, value }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-gray-500">{label}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
};

export default StatCard;
