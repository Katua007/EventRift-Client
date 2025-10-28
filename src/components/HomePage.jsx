import React from 'react';
import { Hero } from './Hero';
import { AboutUs } from './AboutUs';
import { PhotoGallery } from './PhotoGallery';
import { StayConnected } from './StayConnected';
import { WhatsGoingOn } from './WhatsGoingOn';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-er-dark">
      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <div id="about">
        <AboutUs />
      </div>

      {/* Events Section */}
      <div id="events">
        <WhatsGoingOn />
      </div>

      {/* Photo Gallery Section - Keep exactly as is */}
      <div id="gallery">
        <PhotoGallery />
      </div>

      {/* Contact Section */}
      <div id="contact">
        <StayConnected />
      </div>
    </div>
  );
};

export default HomePage;