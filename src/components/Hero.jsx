import React from 'react';
import { Link } from 'react-router-dom';

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/src/assets/images/hero image.jpg"
          alt="EventRift Hero"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <div 
          className="w-full h-full bg-gradient-to-br from-er-primary/30 to-er-secondary/30 flex items-center justify-center text-6xl"
          style={{ display: 'none' }}
        >
          🎉
        </div>
        
        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-er-dark/90 via-transparent to-transparent" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-er-primary/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-er-secondary/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-er-accent/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 left-1/2 w-8 h-8 bg-er-primary/30 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="animate-fade-in">
          {/* Main Heading - Simple clean text matching Figma */}
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-12 leading-tight text-shadow">
            World of live experiences
            <br />
            where every event tells a story
            <br />
            and every story becomes a memory
          </h1>

          {/* CTA Button - "Find an Event" */}
          <div className="flex justify-center mb-16">
            <Link 
              to="/signup" 
              className="bg-er-primary hover:bg-er-primary/90 text-white font-bold text-lg px-12 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-glow"
            >
              Find an Event
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-er-primary rounded-full flex justify-center glass-effect">
          <div className="w-1 h-3 bg-er-primary rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}