import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Tambahkan file CSS khusus untuk Sidebar

const Sidebar = () => {
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
      </ul>
    </div>
  );
};

export default Sidebar;
