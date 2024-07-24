import React from 'react';
import { Spinner } from 'react-bootstrap';
import './Loading.css';

const Loading = () => (
  <div className="loading-overlay">
    <Spinner animation="border" role="status">
    </Spinner>
  </div>
);

export default Loading;
