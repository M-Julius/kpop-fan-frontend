import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css'; 
import { Button } from 'react-bootstrap';

const Sidebar = () => {
  const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
      };
  return (
    <div className="sidebar">
      <h2>CMS</h2>
      <ul>
        <li>
          <Link to="/cms/events">Manage Events</Link>
        </li>
        <li>
          <Link to="/cms/schedules">Manage Schedules</Link>
        </li>
        <li>
          <Link to="/cms/users">Manage Users</Link>
        </li>
        <li>
          <Link to="/cms/bands">Manage Bands</Link>
        </li>
        <li>
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
