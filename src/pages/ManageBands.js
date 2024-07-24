import React, { useEffect, useState } from 'react';
import api, { HOST } from '../services/api';
import Sidebar from '../components/Sidebar';
import './CMSDashboard.css';

const ManageBands = () => {
  const [bands, setBands] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState([{ name: '', role: '' }]);
  const [playlist, setPlaylist] = useState([{ song: '', url: '' }]);
  const [photos, setPhotos] = useState([]);

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
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('members', JSON.stringify(members));
    formData.append('playlist', JSON.stringify(playlist));
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    try {
      await api.post('/bands', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setName('');
      setDescription('');
      setMembers([{ name: '', role: '' }]);
      setPlaylist([{ song: '', url: '' }]);
      setPhotos([]);
      const response = await api.get('/bands');
      setBands(response.data);
    } catch (error) {
      console.error('Error creating band', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/bands/${id}`);
      const response = await api.get('/bands');
      setBands(response.data);
    } catch (error) {
      console.error('Error deleting band', error);
    }
  };

  return (
    <div className="cms-dashboard">
      <Sidebar />
      <div className="cms-content">
        <h2>Manage Bands</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label>Members</label>
            {members.map((member, index) => (
              <div key={index} className="d-flex mb-2">
                <input
                  type="text"
                  className="form-control mr-2"
                  name="name"
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => handleMemberChange(index, e)}
                  required
                />
                <input
                  type="text"
                  className="form-control mr-2"
                  name="role"
                  placeholder="Role"
                  value={member.role}
                  onChange={(e) => handleMemberChange(index, e)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveMember(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={handleAddMember}>
              Add Member
            </button>
          </div>
          <div className="form-group">
            <label>Playlist</label>
            {playlist.map((song, index) => (
              <div key={index} className="d-flex mb-2" style={{alignItems:'center', alignContent:'center', justifyContent:'center',}}>
                <input
                  type="text"
                  className="form-control mr-2"
                  name="song"
                  placeholder="Song"
                  value={song.song}
                  onChange={(e) => handleSongChange(index, e)}
                  required
                />
                <input
                  type="text"
                  className="form-control mr-2"
                  name="url"
                  placeholder="URL"
                  value={song.url}
                  onChange={(e) => handleSongChange(index, e)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveSong(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={handleAddSong}>
              Add Song
            </button>
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
          <button type="submit" className="btn btn-primary">Create Band</button>
        </form>
        <ul className="list-unstyled mt-4">
          {bands.map(band => (
            <li key={band.id} className="media my-4 p-3 border rounded bg-white shadow-sm">
              <div className="media-body">
                <h5 className="mt-0 mb-1">{band.name}</h5>
                <p>{band.description}</p>
                <div className="mt-2">
                  {/* {JSON.parse(band.photos)?.length && JSON.parse(band.photos)?.map((photo, index) => (
                    <img key={index} src={HOST+photo} alt="Band" className="img-thumbnail mr-2" style={{ width: '100px' }} />
                  ))} */}
                </div>
                <button onClick={() => handleDelete(band.id)} className="btn btn-danger mt-2">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageBands;
