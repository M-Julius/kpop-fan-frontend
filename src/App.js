import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CMSDashboard from './pages/CMSDashboard';
import ManageEvents from './pages/ManageEvents';
import ManageSchedules from './pages/ManageSchedules';
import ManageUsers from './pages/ManageUsers';
import ManageBands from './pages/ManageBands';
import BandDetailPage from './pages/BandDetailPage';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cms" element={<PrivateRoute component={CMSDashboard} />} />
          <Route path="/cms/events" element={<PrivateRoute component={ManageEvents} />} />
          <Route path="/cms/schedules" element={<PrivateRoute component={ManageSchedules} />} />
          <Route path="/cms/users" element={<PrivateRoute component={ManageUsers} />} />
          <Route path="/cms/bands" element={<PrivateRoute component={ManageBands} />} />
          <Route path="/bands/:id" element={<BandDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
