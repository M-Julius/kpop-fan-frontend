import React, { useEffect, useState } from 'react';
import api from '../services/api';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        setEvents(response.data.data);
      } catch (error) {
        console.error('Error fetching events', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="event-list">
      <h2>Upcoming Events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.description}</p>
            <p>{new Date(event.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventList;
