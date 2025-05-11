// src/pages/Navigation.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';

export default function Navigation({setLoggedIn}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false); // update state
    navigate('/');
  };

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/students">Students</Link>
        <Link to="/drives">Drives</Link>
        <Link to="/reports">Reports</Link>
      </div>
      <div style={{display:"flex",alignItems:"center"}}>
        <ThemeSwitcher />
        <button style={{padding:"7px 7px"}} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}

// className="nav-right"
