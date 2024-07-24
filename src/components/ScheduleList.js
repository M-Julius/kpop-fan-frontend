import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './ScheduleList.css'; // Tambahkan file CSS khusus untuk ScheduleList

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get('/schedules');
        setSchedules(response.data.data);
      } catch (error) {
        console.error('Error fetching schedules', error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <div className="schedule-list">
      <h2>Concert Schedules</h2>
      <div>
        {schedules.map(schedule => (
          <div key={schedule.id} className="schedule-item">
            <h3>{schedule.Band.name}</h3>
            <p>{new Date(schedule.date).toLocaleDateString()}</p>
            <p>{schedule.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleList;
