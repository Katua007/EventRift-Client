import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Users, Clock, Tag, Save } from 'lucide-react';
import { eventsService } from '../services/eventsService';
import { useAuth } from '../hooks/useAuth';

const CreateEventForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const categories = ['Music', 'Technology', 'Art', 'Food', 'Business', 'Sports', 'Entertainment', 'Fashion', 'Education', 'Health'];
  const themes = ['Corporate', 'Casual', 'Formal', 'Festival', 'Conference', 'Workshop', 'Networking', 'Cultural'];

  useEffect(() => {
    if (eventId) {
      setIsEditing(true);
      const loadEventData = async () => {
        try {
          const response = await eventsService.getEvent(eventId);
          const event = response.event;
          reset({
            title: event.title,
            category: event.category,
            theme: event.theme,
            dress_code: event.dress_code,
            description: event.description,
            date: event.date || event.start_date,
            start_time: event.start_time,
            end_time: event.end_time,
            venue_name: event.venue_name,
            address: event.address,
            ticket_price: event.ticket_price,
            early_bird_price: event.early_bird_price,
            max_attendees: event.max_attendees
          });
        } catch (err) {
          setError('Failed to load event data');
        }
      };
      loadEventData();
    }
  }, [eventId, reset]);

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      type === 'success' ? 'bg-green-900/90 border border-green-700 text-green-300' :
      'bg-red-900/90 border border-red-700 text-red-300'
    }`;
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="mr-3">${type === 'success' ? '✅' : '❌'}</div>
        <div class="font-medium">${message}</div>
      </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const eventData = {
        ...data,
        organizer_id: user.id,
        location: `${data.venue_name}, ${data.address}`,
        image: getEventEmoji(data.category),
        start_date: data.date,
        status: 'active'
      };

      const result = isEditing
        ? await eventsService.updateEvent(eventId, eventData)
        : await eventsService.createEvent(eventData);

      if (result.success) {
        showNotification(
          `Event "${data.title}" ${isEditing ? 'updated' : 'created'} successfully!`,
          'success'
        );
        setTimeout(() => navigate('/organizer/dashboard'), 1500);
      } else {
        setError(result.message || `Failed to ${isEditing ? 'update' : 'create'} event`);
      }
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} event`);
    } finally {
      setLoading(false);
    }
  };

  const getEventEmoji = (category) => {
    const emojiMap = {
      'Music': '🎵', 'Technology': '💻', 'Art': '🎨', 'Food': '🍽️',
      'Business': '💼', 'Sports': '🏃♂️', 'Entertainment': '🎭',
      'Fashion': '👗', 'Education': '📚', 'Health': '🏥'
    };
    return emojiMap[category] || '🎉';
  };

  return (
    <div className="min-h-screen bg-er-dark pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-er-light mb-4">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h1>
          <p className="text-er-text">
            {isEditing ? 'Update your event details' : 'Fill in the details to create your amazing event'}
          </p>
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
                <label className="block text-er-light font-semibold mb-2">Event Date *</label>
                <input
                  type="date"
                  {...register('date', { required: 'Event date is required' })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                />
                {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
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
          </div>

          {/* Location */}
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-6 flex items-center">
              <MapPin className="mr-3 text-er-primary" />
              Location
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-er-light font-semibold mb-2">Venue Name *</label>
                <input
                  {...register('venue_name', { required: 'Venue name is required' })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="Enter venue name"
                />
                {errors.venue_name && <p className="text-red-400 text-sm mt-1">{errors.venue_name.message}</p>}
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Address *</label>
                <input
                  {...register('address', { required: 'Address is required' })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="Enter full address"
                />
                {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-6 flex items-center">
              <DollarSign className="mr-3 text-er-primary" />
              Pricing
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
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/organizer/dashboard')}
              className="btn-secondary px-8 py-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 flex items-center"
            >
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : (
                <Save className="w-5 h-5 mr-2" />
              )}
              {loading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventForm;