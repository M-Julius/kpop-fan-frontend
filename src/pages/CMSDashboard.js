import React from 'react';
import Sidebar from '../components/Sidebar';
import './CMSDashboard.css'; // Tambahkan file CSS khusus untuk halaman CMS

const CMSDashboard = () => {
  return (
    <div className="cms-dashboard">
      <Sidebar />
      <div className="cms-content">
        <h1>Welcome to the CMS Dashboard</h1>
        <p>Select an option from the sidebar to manage content.</p>
      </div>
    </div>
  );
};

export default CMSDashboard;
