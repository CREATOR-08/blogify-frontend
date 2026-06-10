import React from "react";
import { useNavigate } from "react-router-dom";

const NavLinks = ({ onOpenSettings }) => {
  const navigate = useNavigate();

  const links = [
    { label: "Home", path: "/" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Read Blogs", path: "/readblog" },
    { label: "Create Blog", path: "/editor" },
  ];

  return (
    <>
      {links.map((link) => (
        <h1
          key={link.path}
          className="cursor-pointer text-gray-500 hover:text-white transition"
          onClick={() => navigate(link.path)}
        >
          {link.label}
        </h1>
      ))}
      <h1
        className="cursor-pointer text-gray-500 hover:text-white transition"
        onClick={onOpenSettings}
      >
        Settings
      </h1>
    </>
  );
};

export default NavLinks;
