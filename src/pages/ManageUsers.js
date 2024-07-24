import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import './CMSDashboard.css'; // Menggunakan CSS yang sama untuk konsistensi

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', { username, password, role });
      setUsername('');
      setPassword('');
      setRole('');
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error creating user', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  return (
    <div className="cms-dashboard">
      <Sidebar />
      <div className="cms-content">
        <h2>Manage Users</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Create User</button>
        </form>
        <ul className="list-unstyled mt-4">
          {users.map(user => (
            <li key={user.id} className="media my-4 p-3 border rounded bg-white shadow-sm">
              <div className="media-body">
                <h5 className="mt-0 mb-1">{user.username}</h5>
                <p>Role: {user.role}</p>
                <button onClick={() => handleDelete(user.id)} className="btn btn-danger mt-2">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManageUsers;
