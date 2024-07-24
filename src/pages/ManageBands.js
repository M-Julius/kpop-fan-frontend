import React, { useEffect, useState } from 'react';
import api, { HOST } from '../services/api';
import Sidebar from '../components/Sidebar';
import { Modal, Button, Form } from 'react-bootstrap';
import Loading from '../components/Loading';
import './CMSDashboard.css';

const ManageBands = () => {
  const [bands, setBands] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([{ name: '', role: '' }]);
  const [playlist, setPlaylist] = useState([{ song: '', url: '' }]);
  const [photos, setPhotos] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentBandId, setCurrentBandId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBands = async () => {
      try {
        const response = await api.get('/bands');
        setBands(response.data.data);
      } catch (error) {
        console.error('Error fetching bands', error);
      }
    };

    fetchBands();
  }, []);

  const handleClose = () => {
    setShow(false);
    resetForm();
  };
  const handleShow = () => setShow(true);

  const resetForm = () => {
    setName('');
    setDescription('');
    setMembers([{ name: '', role: '' }]);
    setPlaylist([{ song: '', url: '' }]);
    setPhotos([]);
    setEditing(false);
    setCurrentBandId(null);
  };

  const handleFileChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleAddMember = () => {
    setMembers([...members, { name: '', role: '' }]);
  };

  const handleRemoveMember = (index) => {
    const newMembers = members.slice();
    newMembers.splice(index, 1);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, event) => {
    const { name, value } = event.target;
    const newMembers = members.slice();
    newMembers[index][name] = value;
    setMembers(newMembers);
  };

  const handleAddSong = () => {
    setPlaylist([...playlist, { song: '', url: '' }]);
  };

  const handleRemoveSong = (index) => {
    const newPlaylist = playlist.slice();
    newPlaylist.splice(index, 1);
    setPlaylist(newPlaylist);
  };

  const handleSongChange = (index, event) => {
    const { name, value } = event.target;
    const newPlaylist = playlist.slice();
    newPlaylist[index][name] = value;
    setPlaylist(newPlaylist);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('members', JSON.stringify(members));
    formData.append('playlist', JSON.stringify(playlist));
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    try {
      if (editing) {
        await api.put(`/bands/${currentBandId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/bands', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      handleClose();
      const response = await api.get('/bands');
      setBands(response.data.data);
    } catch (error) {
      console.error(`Error ${editing ? 'updating' : 'creating'} band`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (band) => {
    setName(band.name);
    setDescription(band.description);
    setMembers(JSON.parse(band.members));
    setPlaylist(JSON.parse(band.playlist));
    setCurrentBandId(band.id);
    setEditing(true);
    handleShow();
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await api.delete(`/bands/${id}`);
      const response = await api.get('/bands');
      setBands(response.data.data);
    } catch (error) {
      console.error('Error deleting band', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cms-dashboard">
      <Sidebar />
      <div className="cms-content">
        <h2>Manage Bands</h2>
        <Button variant="primary" onClick={handleShow}>
          Create Band
        </Button>
        <ul className="list-unstyled mt-4">
          {bands.map(band => (
            <li key={band.id} className="media my-4 p-3 border rounded bg-white shadow-sm">
              <div className="media-body">
                <h5 className="mt-0 mb-1">{band.name}</h5>
                <p>{band.description}</p>
                <div className="mt-2">
                  {JSON.parse(band.photoGroup).map((photo, index) => (
                    <img key={index} src={HOST+photo} alt="Band" className="img-thumbnail mr-2" style={{ width: '100px' }} />
                  ))}
                </div>
                <Button variant="secondary" onClick={() => handleEdit(band)} className="mr-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(band.id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? 'Edit Band' : 'Create Band'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
              <Form.Group controlId="formMembers">
                <Form.Label>Members</Form.Label>
                {members.map((member, index) => (
                  <div key={index} className="d-flex mb-2">
                    <Form.Control
                      type="text"
                      className="mr-2"
                      name="name"
                      placeholder="Name"
                      value={member.name}
                      onChange={(e) => handleMemberChange(index, e)}
                      required
                    />
                    <Form.Control
                      type="text"
                      className="mr-2"
                      name="role"
                      placeholder="Role"
                      value={member.role}
                      onChange={(e) => handleMemberChange(index, e)}
                      required
                    />
                    <Button variant="danger" onClick={() => handleRemoveMember(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddMember}>
                  Add Member
                </Button>
              </Form.Group>
              <Form.Group controlId="formPlaylist">
                <Form.Label>Playlist</Form.Label>
                {playlist.map((song, index) => (
                  <div key={index} className="d-flex mb-2">
                    <Form.Control
                      type="text"
                      className="mr-2"
                      name="song"
                      placeholder="Song"
                      value={song.song}
                      onChange={(e) => handleSongChange(index, e)}
                      required
                    />
                    <Form.Control
                      type="text"
                      className="mr-2"
                      name="url"
                      placeholder="URL"
                      value={song.url}
                      onChange={(e) => handleSongChange(index, e)}
                      required
                    />
                    <Button variant="danger" onClick={() => handleRemoveSong(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddSong}>
                  Add Song
                </Button>
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
                {editing ? 'Update Band' : 'Create Band'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default ManageBands;
