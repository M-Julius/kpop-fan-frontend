import React, { useEffect, useState } from 'react';
import api, { HOST } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Modal, Button, Form } from 'react-bootstrap';
import Loading from '../components/Loading';
import './CMSDashboard.css';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [bandId, setBandId] = useState('');
  const [bands, setBands] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleClose = () => {
    setShow(false);
    resetForm();
  };
  const handleShow = () => setShow(true);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setBandId('');
    setPhotos([]);
    setEditing(false);
    setCurrentEventId(null);
  };

  const handleFileChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);
    formData.append('bandId', bandId);
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    try {
      if (editing) {
        await api.put(`/events/${currentEventId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/events', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      handleClose();
      const response = await api.get('/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error(`Error ${editing ? 'updating' : 'creating'} event`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (event) => {
    setTitle(event.title);
    setDescription(event.description);
    setDate(new Date(event.date).toISOString().split('T')[0]);
    setBandId(event.bandId);
    setCurrentEventId(event.id);
    setEditing(true);
    handleShow();
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await api.delete(`/events/${id}`);
      const response = await api.get('/events');
      setEvents(response.data.data);
    } catch (error) {
      console.error('Error deleting event', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cms-dashboard">
      <Sidebar />
      <div className="cms-content">
        <h2>Manage Events</h2>
        <Button variant="primary" onClick={handleShow}>
          Create Event
        </Button>
        <ul className="list-unstyled mt-4">
          {events.map(event => (
            <li key={event.id} className="media my-4 p-3 border rounded bg-white shadow-sm">
              <div className="media-body">
                <h5 className="mt-0 mb-1">{event.title}</h5>
                <p>{event.description}</p>
                <p>{new Date(event.date).toLocaleDateString()}</p>
                <div className="mt-2">
                  {event.photos.map((photo, index) => (
                    <img key={index} src={HOST+photo} alt="Event" className="img-thumbnail mr-2" style={{ width: '100px' }} />
                  ))}
                </div>
                <Button variant="secondary" onClick={() => handleEdit(event)} className="mr-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(event.id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? 'Edit Event' : 'Create Event'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
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
              <Form.Group controlId="formPhotos">
                <Form.Label>Photos</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {editing ? 'Update Event' : 'Create Event'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default ManageEvents;
