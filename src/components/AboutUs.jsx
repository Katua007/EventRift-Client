import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import aboutImage from '../assets/images/AboutSectionPic.jpeg';

export function AboutUs() {
  return (
    <section id="about" className="py-20 px-6 bg-er-gray">
      <div className="max-w-7xl mx-auto">
        {/* Header - Exact Figma Text */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            About <span className="gradient-text">EventRift</span>
          </h2>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative animate-slide-up">
            <div className="relative h-[500px] overflow-hidden rounded-3xl shadow-2xl hover-lift">
              <ImageWithFallback
                src={aboutImage}
                alt="EventRift About Us"
                className="w-full h-full object-cover"
                fallback=""
              />
              <div className="absolute inset-0 bg-gradient-to-t from-er-dark/50 to-transparent"></div>
            </div>
          </div>
          
          {/* Content - Exact Figma Text with White Color */}
          <div className="space-y-8 animate-slide-up">
            <div>
              <p className="text-lg text-white leading-relaxed">
                EventRift is Kenya's premier platform where people discover, plan, and organize 
                unforgettable events. From intimate gatherings to massive festivals, we connect 
                communities through shared experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}