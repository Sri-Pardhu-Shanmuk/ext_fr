import React, { useState } from "react";
import './navbarcss.css';
import { LogOut } from "lucide-react";
import { Link , useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();

  

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    navigate("/");
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const username = localStorage.getItem("username") || "User";
  const firstLetter = username.charAt(0).toUpperCase();

  return (
    <nav className="navbar">

      <div className="logo-heading">

        <div 
          className={`hamburger ${menuOpen ? "open" : ""}`} 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>


        <div className="et-logo">ET</div>
        <h1 className="navbar-title">Expense Tracker</h1>
      </div>

      <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <ul onClick={() => setMenuOpen(false)}>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/transactions">Transactions</Link></li>
          <li><Link to="/reports">Reports</Link></li>
        </ul>
      </div>

      <div className="navbar-user-info">

        <div className="navbar-user">
          <div className="navbar-user-logo">
            <div className="logo">{firstLetter}</div>
          </div>
          <span className="navbar-username">{username}</span>
        </div>

        <button className="navbar-button" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>

      </div>

    </nav>
  );
}

export default Navbar;