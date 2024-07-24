import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Carousel from 'react-bootstrap/Carousel';
import './BandDetailPage.css'; // Tambahkan file CSS khusus untuk BandDetailPage

const BandDetailPage = () => {
  const { id } = useParams();
  const [band, setBand] = useState(null);

  useEffect(() => {
    const fetchBand = async () => {
      try {
        const response = await api.get(`/bands/${id}`);
        setBand(response.data);
      } catch (error) {
        console.error('Error fetching band details', error);
      }
    };

    fetchBand();
  }, [id]);

  if (!band) return <div>Loading...</div>;

  return (
    <div className="band-detail-container">
      <div className="band-header">
        <h1>{band.name}</h1>
        <p>{band.description}</p>
      </div>
      <Carousel className="band-carousel">
        {band.photos.map((photo, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={photo}
              alt={`slide-${index}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>
      <div className="band-members">
        <h2>Members</h2>
        <ul className="list-unstyled row">
          {band.members.map((member, index) => (
            <li key={index} className="col-md-4 mb-4">
              <div className="member-card">
                <h5>{member.name}</h5>
                <p>{member.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="band-playlist">
        <h2>Playlist</h2>
        <ul className="list-unstyled">
          {band.playlist.map((song, index) => (
            <li key={index}>
              <a href={song.url} target="_blank" rel="noopener noreferrer">
                {song.song}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BandDetailPage;
