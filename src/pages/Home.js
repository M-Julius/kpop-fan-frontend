import React from 'react';
import BannerSlider from '../components/BannerSlider';
import BandList from '../components/BandList';
import ScheduleList from '../components/ScheduleList';
import './Home.css'; // Tambahkan file CSS khusus untuk halaman Home

const Home = () => {
  return (
    <div className="home">
      <div className="component-container">
        <BannerSlider />
      </div>
      <div className="component-container">
        <BandList />
      </div>
      <div className="component-container">
        <ScheduleList />
      </div>
    </div>
  );
};

export default Home;
