import React, { useEffect, useState } from 'react';
import api, { HOST } from '../services/api';
import Sidebar from '../components/Sidebar';
import './CMSDashboard.css'; // Menggunakan CSS yang sama untuk konsistensi

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [bandId, setBandId] = useState('');
  const [bands, setBands] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data.data);
      } catch (error) {
        console.error('Error fetching events', error);
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

    fetchEvents();
    fetchBands();
  }, []);

  const handleFileChange = (e) => {
    setPhotos(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('bandId', bandId);
    for (let i = 0; i < photos.length; i++) {
      formData.append('photos', photos[i]);
    }

    try {
      await api.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setTitle('');
      setDescription('');
      setDate('');
      setBandId('');
      setPhotos([]);
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error creating event', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error deleting event', error);
    }
  };

  return (
    <div className="cms-dashboard">
      <Sidebar />
      <div className="cms-content">
        <h2>Manage Events</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
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
            <label>Photos</label>
            <input
              type="file"
              className="form-control"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Event</button>
        </form>
        <ul className="list-unstyled mt-4">
          {events.map(event => (
            <li key={event.id} className="media my-4 p-3 border rounded bg-white shadow-sm">
              <div className="media-body">
                <h5 className="mt-0 mb-1">{event.title}</h5>
                <p>{event.description}</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <div className="mt-2">
                  {/* {JSON.parse(event.photos).map((photo, index) => (
                    <img key={index} src={HOST + photo} alt="Event" className="img-thumbnail mr-2" style={{ width: '100px' }} />
                  ))} */}
                </div>
                <button onClick={() => handleDelete(event.id)} className="btn btn-danger mt-2">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageEvents;
