import { useState, useRef } from 'react';
import { HeaderSPA } from './HeaderSPA';
import { Hero } from './Hero';
import { WhatsGoingOn } from './WhatsGoingOn';
import { AboutUs } from './AboutUs';
import { PhotoGallery } from './PhotoGallery';
import { StayConnected } from './StayConnected';
import { Footer } from './Footer';
import { EventDetail } from './EventDetail';

export default function SinglePageApp() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedEventId, setSelectedEventId] = useState(null);

  const eventsRef = useRef(null);
  const aboutRef = useRef(null);
  const galleryRef = useRef(null);
  const contactRef = useRef(null);

  const handleNavigate = (section) => {
    setCurrentView('home');
    
    // Wait for view to update, then scroll
    setTimeout(() => {
      switch (section) {
        case 'home':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'events':
          eventsRef.current?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'about':
          aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'gallery':
          galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
          break;
        case 'contact':
          contactRef.current?.scrollIntoView({ behavior: 'smooth' });
          break;
      }
    }, 100);
  };

  const handleEventClick = (eventId) => {
    setSelectedEventId(eventId);
    setCurrentView('event-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedEventId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'event-detail' && selectedEventId) {
    return (
      <>
        <HeaderSPA onNavigate={handleNavigate} />
        <EventDetail eventId={selectedEventId} onBack={handleBackToHome} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <HeaderSPA onNavigate={handleNavigate} />
      <Hero />
      <div ref={eventsRef}>
        <WhatsGoingOn onEventClick={handleEventClick} />
      </div>
      <div ref={aboutRef}>
        <AboutUs />
      </div>
      <div ref={galleryRef}>
        <PhotoGallery />
      </div>
      <div ref={contactRef}>
        <StayConnected />
      </div>
      <Footer />
    </div>
  );
}