import React, { useEffect, useState } from 'react';
import api, { HOST } from '../services/api';
import Carousel from 'react-bootstrap/Carousel';

const BannerSlider = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data?.data ?? []);
      } catch (error) {
        console.error('Error fetching events', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <Carousel>
      {events.map(event => {
        console.log(HOST + JSON.parse(event.photos)[0])
        return (
        <Carousel.Item key={event.id}>
          <img
            className="d-block w-100"
            src={HOST + JSON.parse(event.photos)[0]}
            alt={event.title}
          />
          <Carousel.Caption>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      )})}
    </Carousel>
  );
};

export default BannerSlider;
