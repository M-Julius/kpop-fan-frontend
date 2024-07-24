import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import './CMSDashboard.css'; // Menggunakan CSS yang sama untuk konsistensi

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [bandId, setBandId] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [bands, setBands] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get('/schedules');
        setSchedules(response.data.data);
      } catch (error) {
        console.error('Error fetching schedules', error);
      }
    };

    const fetchBands = async () => {
      try {
        const response = await api.get('/bands');
        setBands(response.data.data);
      } catch (error) {
        console.error('Error fetching bands', error);
      }
    };

    fetchSchedules();
    fetchBands();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/schedules', { bandId, date, location });
      setBandId('');
      setDate('');
      setLocation('');
      const response = await api.get('/schedules');
      setSchedules(response.data.schedules);
    } catch (error) {
      console.error('Error creating schedule', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/schedules/${id}`);
      const response = await api.get('/schedules');
      setSchedules(response.data.schedules);
    } catch (error) {
      console.error('Error deleting schedule', error);
    }
  };

  return (
    <div className="cms-dashboard">
      <Sidebar />
      <div className="cms-content">
        <h2>Manage Schedules</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Band</label>
            <select
              className="form-control"
              value={bandId}
              onChange={(e) => setBandId(e.target.value)}
              required
            >
              <option value="">Select Band</option>
              {bands.map(band => (
                <option key={band.id} value={band.id}>{band.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Schedule</button>
        </form>
        <ul className="list-unstyled mt-4">
          {schedules.map(schedule => (
            <li key={schedule.id} className="media my-4 p-3 border rounded bg-white shadow-sm">
              <div className="media-body">
                <h5 className="mt-0 mb-1">{schedule.Band.name}</h5>
                <p>{new Date(schedule.date).toLocaleDateString()}</p>
                <p>{schedule.location}</p>
                <button onClick={() => handleDelete(schedule.id)} className="btn btn-danger mt-2">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageSchedules;
