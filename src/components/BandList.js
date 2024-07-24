import React, { useEffect, useState } from 'react';
import api, { HOST } from '../services/api';
import './BandList.css'; 
import { useNavigate } from 'react-router-dom';

const BandList = () => {
  const navigate = useNavigate();
  const [bands, setBands] = useState([]);

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

  return (
    <div style={{flexDirection:'column'}} >
      <h2>Bands</h2>
      <div className="grid">
        {bands.map(band => (
          <div key={band.id} onClick={() => navigate(`/bands/${band.id}`)} className="band-card">
            <img
              src={HOST + JSON.parse(band.photoGroup)[0]}
              alt={band.name}
              className="band-avatar"
            />
            <h5>{band.name}</h5>
            <p>{band.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BandList;
