import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar(){
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">Task Manager</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">Hello, {user.username} ({user.role})</span>
            <Link to="/">Dashboard</Link>
            <Link to="/task/new">Create Task</Link>
            <button className="btn-logout" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
