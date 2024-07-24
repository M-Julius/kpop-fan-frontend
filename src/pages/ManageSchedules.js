import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { Modal, Button, Form } from 'react-bootstrap';
import Loading from '../components/Loading';
import './CMSDashboard.css';

const ManageSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [bandId, setBandId] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [bands, setBands] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentScheduleId, setCurrentScheduleId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleClose = () => {
    setShow(false);
    resetForm();
  };
  const handleShow = () => setShow(true);

  const resetForm = () => {
    setBandId('');
    setDate('');
    setLocation('');
    setEditing(false);
    setCurrentScheduleId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = { bandId, date, location };

    try {
      if (editing) {
        await api.put(`/schedules/${currentScheduleId}`, data);
      } else {
        await api.post('/schedules', data);
      }
      handleClose();
      const response = await api.get('/schedules');
      setSchedules(response.data.data);
    } catch (error) {
      console.error(`Error ${editing ? 'updating' : 'creating'} schedule`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    setBandId(schedule.bandId);
    setDate(new Date(schedule.date).toISOString().split('T')[0]);
    setLocation(schedule.location);
    setCurrentScheduleId(schedule.id);
    setEditing(true);
    handleShow();
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await api.delete(`/schedules/${id}`);
      const response = await api.get('/schedules');
      setSchedules(response.data.data);
    } catch (error) {
      console.error('Error deleting schedule', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cms-dashboard">
      <Sidebar />
      <div className="cms-content">
        <h2>Manage Schedules</h2>
        <Button variant="primary" onClick={handleShow}>
          Create Schedule
        </Button>
        <ul className="list-unstyled mt-4">
          {schedules.map(schedule => (
            <li key={schedule.id} className="media my-4 p-3 border rounded bg-white shadow-sm">
              <div className="media-body">
                <h5 className="mt-0 mb-1">{schedule.Band.name}</h5>
                <p>{new Date(schedule.date).toLocaleDateString()}</p>
                <p>{schedule.location}</p>
                <Button variant="secondary" onClick={() => handleEdit(schedule)} className="mr-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(schedule.id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? 'Edit Schedule' : 'Create Schedule'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBand">
                <Form.Label>Band</Form.Label>
                <Form.Control
                  as="select"
                  value={bandId}
                  onChange={(e) => setBandId(e.target.value)}
                  required
                >
                  <option value="">Select Band</option>
                  {bands.map(band => (
                    <option key={band.id} value={band.id}>{band.name}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formLocation">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {editing ? 'Update Schedule' : 'Create Schedule'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default ManageSchedules;
