import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Users, Clock, Tag, Save } from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { useAuth } from '../hooks/useAuth';

const CreateEventForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Music', 'Technology', 'Art', 'Food', 'Business', 'Sports', 'Entertainment', 'Fashion', 'Education', 'Health'];
  const themes = ['Corporate', 'Casual', 'Formal', 'Festival', 'Conference', 'Workshop', 'Networking', 'Cultural'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      if (window.google) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          zoom: 13,
        });

        const markerInstance = new window.google.maps.Marker({
          position: { lat: -1.2921, lng: 36.8219 },
          map: mapInstance,
          draggable: true,
        });

        markerInstance.addListener('dragend', () => {
          const position = markerInstance.getPosition();
          setValue('latitude', position.lat());
          setValue('longitude', position.lng());
        });

        setMap(mapInstance);
        setMarker(markerInstance);
      }
    };

    // Load Google Maps script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const eventData = {
        ...data,
        organizer_id: user.id,
        created_at: new Date().toISOString(),
        status: 'active'
      };

      const result = await eventsService.createEvent(eventData);
      
      if (result.success) {
        navigate('/organizer/dashboard');
      } else {
        setError(result.message || 'Failed to create event');
      }
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-er-dark pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-er-light mb-4">Create New Event</h1>
          <p className="text-er-text">Fill in the details to create your amazing event</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-6 flex items-center">
              <Tag className="mr-3 text-er-primary" />
              Basic Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-er-light font-semibold mb-2">Event Title *</label>
                <input
                  {...register('title', { required: 'Event title is required' })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="Enter event title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Category *</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Theme</label>
                <select
                  {...register('theme')}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                >
                  <option value="">Select theme</option>
                  {themes.map(theme => (
                    <option key={theme} value={theme}>{theme}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Dress Code</label>
                <input
                  {...register('dress_code')}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="e.g., Smart Casual, Formal, Traditional"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-er-light font-semibold mb-2">Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                placeholder="Describe your event..."
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Date & Time */}
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-6 flex items-center">
              <Calendar className="mr-3 text-er-primary" />
              Date & Time
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-er-light font-semibold mb-2">Start Date *</label>
                <input
                  type="date"
                  {...register('start_date', { required: 'Start date is required' })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                />
                {errors.start_date && <p className="text-red-400 text-sm mt-1">{errors.start_date.message}</p>}
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Start Time *</label>
                <input
                  type="time"
                  {...register('start_time', { required: 'Start time is required' })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                />
                {errors.start_time && <p className="text-red-400 text-sm mt-1">{errors.start_time.message}</p>}
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">End Time</label>
                <input
                  type="time"
                  {...register('end_time')}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-er-light font-semibold mb-2">Days of Week</label>
              <div className="flex flex-wrap gap-3">
                {daysOfWeek.map(day => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      value={day}
                      {...register('days_of_week')}
                      className="mr-2 text-er-primary"
                    />
                    <span className="text-er-text">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-6 flex items-center">
              <MapPin className="mr-3 text-er-primary" />
              Location
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-er-light font-semibold mb-2">Venue Name *</label>
                <input
                  {...register('venue_name', { required: 'Venue name is required' })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="e.g., KICC, Carnivore Restaurant"
                />
                {errors.venue_name && <p className="text-red-400 text-sm mt-1">{errors.venue_name.message}</p>}
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Address *</label>
                <input
                  {...register('address', { required: 'Address is required' })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="Full address"
                />
                {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-er-light font-semibold mb-2">Select Location on Map</label>
              <div ref={mapRef} className="w-full h-64 rounded-lg border border-gray-700"></div>
              <p className="text-er-text text-sm mt-2">Drag the marker to set the exact location</p>
            </div>

            <input type="hidden" {...register('latitude')} />
            <input type="hidden" {...register('longitude')} />
          </div>

          {/* Pricing */}
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-6 flex items-center">
              <DollarSign className="mr-3 text-er-primary" />
              Pricing & Tickets
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-er-light font-semibold mb-2">Ticket Price (KES) *</label>
                <input
                  type="number"
                  {...register('ticket_price', { required: 'Ticket price is required', min: 0 })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="0"
                />
                {errors.ticket_price && <p className="text-red-400 text-sm mt-1">{errors.ticket_price.message}</p>}
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Early Bird Price (KES)</label>
                <input
                  type="number"
                  {...register('early_bird_price', { min: 0 })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Max Attendees</label>
                <input
                  type="number"
                  {...register('max_attendees', { min: 1 })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-er-light font-semibold mb-2">Payment Method</label>
              <select
                {...register('payment_method')}
                className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="bank">Bank Transfer</option>
                <option value="cash">Cash at Venue</option>
                <option value="multiple">Multiple Options</option>
              </select>
            </div>
          </div>

          {/* Additional Details */}
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-6 flex items-center">
              <Users className="mr-3 text-er-primary" />
              Additional Details
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-er-light font-semibold mb-2">What to Expect</label>
                <textarea
                  {...register('what_to_expect')}
                  rows={3}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="Describe what attendees can expect..."
                />
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Services Available</label>
                <textarea
                  {...register('services_available')}
                  rows={3}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="List services like parking, catering, WiFi..."
                />
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Terms and Conditions</label>
                <textarea
                  {...register('terms_conditions')}
                  rows={4}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="Enter terms and conditions for the event..."
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-lg px-12 py-4 flex items-center mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Creating Event...
                </>
              ) : (
                <>
                  <Save className="mr-3 w-5 h-5" />
                  Create Event
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;