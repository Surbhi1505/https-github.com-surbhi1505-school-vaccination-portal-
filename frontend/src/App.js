import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Drives from './pages/Drives';
import Reports from './pages/Reports';
import Navigation from './pages/Navigation';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const listener = () => {
      setLoggedIn(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  }, []);

  return (
    <BrowserRouter>
      {loggedIn && <Navigation setLoggedIn={setLoggedIn} />}
      <Routes>
        <Route path="/" element={<Login setLoggedIn={setLoggedIn} />} />
      <Route path="/dashboard" element={loggedIn ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/students" element={loggedIn ? <Students /> : <Navigate to="/" />} />
        <Route path="/drives" element={loggedIn ? <Drives /> : <Navigate to="/" />} />
        <Route path="/reports" element={loggedIn ? <Reports /> : <Navigate to="/" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
