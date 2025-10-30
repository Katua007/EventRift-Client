import React, { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import G1 from '../assets/images/G1.jpeg';
import G2 from '../assets/images/G2.jpeg';
import G3 from '../assets/images/G3.jpeg';
import G4 from '../assets/images/G4.jpeg';
import G5 from '../assets/images/G5.jpeg';
import G6 from '../assets/images/G6.jpeg';
import G7 from '../assets/images/G7.jpeg';

export function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  
  const photos = [
    {
<<<<<<< Updated upstream
      src: '/assets/images/G1.jpeg',
=======
      src: G1,
>>>>>>> Stashed changes
      alt: 'EventRift Gallery 1',
      fallback: '🎉'
    },
    {
<<<<<<< Updated upstream
      src: '/assets/images/G2.jpeg',
=======
      src: G2,
>>>>>>> Stashed changes
      alt: 'EventRift Gallery 2',
      fallback: '🎵'
    },
    {
<<<<<<< Updated upstream
      src: '/assets/images/G3.jpeg',
=======
      src: G3,
>>>>>>> Stashed changes
      alt: 'EventRift Gallery 3',
      fallback: '🎊'
    },
    {
<<<<<<< Updated upstream
      src: '/assets/images/G4.jpeg',
=======
      src: G4,
>>>>>>> Stashed changes
      alt: 'EventRift Gallery 4',
      fallback: '🎭'
    },
    {
<<<<<<< Updated upstream
      src: '/assets/images/G5.jpeg',
=======
      src: G5,
>>>>>>> Stashed changes
      alt: 'EventRift Gallery 5',
      fallback: '🎪'
    },
    {
<<<<<<< Updated upstream
      src: '/assets/images/G6.jpeg',
=======
      src: G6,
>>>>>>> Stashed changes
      alt: 'EventRift Gallery 6',
      fallback: '🎨'
    },
    {
<<<<<<< Updated upstream
      src: '/assets/images/G7.jpeg',
=======
      src: G7,
>>>>>>> Stashed changes
      alt: 'EventRift Gallery 7',
      fallback: '🎸'
    }
  ];

  const openModal = (index) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % photos.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <section id="gallery" className="py-20 px-6 bg-er-dark">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-er-light mb-6">
            Event <span className="gradient-text">Gallery</span>
          </h2>
          <p className="text-xl text-er-text max-w-3xl mx-auto leading-relaxed">
            Capturing unforgettable moments from amazing events across Kenya
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer hover-lift animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
              onClick={() => openModal(index)}
            >
              <ImageWithFallback
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                fallback={photo.fallback}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-er-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-semibold text-sm">View Image</div>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-er-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-er-primary transition-colors z-10 p-2 rounded-full bg-er-dark/50 hover:bg-er-dark/80"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-er-primary transition-colors z-10 p-2 rounded-full bg-er-dark/50 hover:bg-er-dark/80"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-er-primary transition-colors z-10 p-2 rounded-full bg-er-dark/50 hover:bg-er-dark/80"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image */}
            <div className="max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
              <ImageWithFallback
                src={photos[selectedImage].src}
                alt={photos[selectedImage].alt}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                fallback={photos[selectedImage].fallback}
              />
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-er-dark/50 px-4 py-2 rounded-full">
              {selectedImage + 1} / {photos.length}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}