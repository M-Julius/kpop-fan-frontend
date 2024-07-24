import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { Modal, Button, Form } from 'react-bootstrap';
import Loading from '../components/Loading';
import './CMSDashboard.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleClose = () => {
    setShow(false);
    resetForm();
  };
  const handleShow = () => setShow(true);

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setRole('');
    setEditing(false);
    setCurrentUserId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const data = { username, password, role };

    try {
      if (editing) {
        await api.put(`/users/${currentUserId}`, data);
      } else {
        await api.post('/users', data);
      }
      handleClose();
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error(`Error ${editing ? 'updating' : 'creating'} user`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setUsername(user.username);
    setPassword('');
    setRole(user.role);
    setCurrentUserId(user.id);
    setEditing(true);
    handleShow();
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await api.delete(`/users/${id}`);
      const response = await api.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error deleting user', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cms-dashboard">
      <Sidebar />
      <div className="cms-content">
        <h2>Manage Users</h2>
        <Button variant="primary" onClick={handleShow}>
          Create User
        </Button>
        <ul className="list-unstyled mt-4">
          {users.map(user => (
            <li key={user.id} className="media my-4 p-3 border rounded bg-white shadow-sm">
              <div className="media-body">
                <h5 className="mt-0 mb-1">{user.username}</h5>
                <p>Role: {user.role}</p>
                <Button variant="secondary" onClick={() => handleEdit(user)} className="mr-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
              </div>
            </li>
          ))}
        </ul>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? 'Edit User' : 'Create User'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editing}
                  placeholder={editing ? "Leave blank to keep current password" : ""}
                />
              </Form.Group>
              <Form.Group controlId="formRole">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  as="select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="submit">
                {editing ? 'Update User' : 'Create User'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default ManageUsers;
