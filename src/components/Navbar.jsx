

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
    <div className='flex flex-row h-16 items-center justify-between bg-slate-950 text-white px-4'>
      <div className='flex items-center gap-3'>
        <Link to='/' className='flex items-center gap-3'>
          <img src='/logo.png' alt='Blogify logo' className='h-10 w-10 rounded-full border border-cyan-500 bg-slate-900 object-contain' />
          <span className='font-bold text-2xl text-cyan-400'>Blogify</span>
        </Link>
      </div>
      <ul className='flex flex-row text-cyan-300 gap-6 font-semibold'>
        <li>
          <Link to='/' className='hover:text-white'>Home</Link>
        </li>
        {isLoggedIn && (
          <li>
            <Link to='/dashboard' className='hover:text-white'>Dashboard</Link>
          </li>
        )}
        {!isLoggedIn ? (
          <>
            <li>
              <Link to='/login' className='hover:text-white'>Log In</Link>
            </li>
            <li>
              <Link to='/signup' className='hover:text-white'>Sign Up</Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleLogout} className='rounded-full bg-cyan-500 px-4 py-2 text-sm text-slate-950 transition hover:bg-cyan-400'>Log Out</button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Navbar
