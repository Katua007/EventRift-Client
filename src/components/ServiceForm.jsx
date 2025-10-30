import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Package, DollarSign, Save, ArrowLeft } from 'lucide-react';
import { vendorService } from '../services/vendorService';
import { useAuth } from '../hooks/useAuth';

const ServiceForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const categories = [
    'Photography', 'Videography', 'Catering', 'Decoration', 'Sound & Lighting',
    'Security', 'Transportation', 'Entertainment', 'Flowers', 'Equipment Rental'
  ];

  useEffect(() => {
    if (serviceId) {
      setIsEditing(true);
      // Load service data for editing
      const loadServiceData = async () => {
        try {
          const response = await vendorService.getService(serviceId);
          reset(response.service);
        } catch (err) {
          setError('Failed to load service data');
        }
      };
      loadServiceData();
    }
  }, [serviceId, reset]);

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
      const serviceData = {
        ...data,
        vendor_id: user.id,
        price: parseFloat(data.price),
        status: 'active'
      };

      const result = isEditing
        ? await vendorService.updateService(serviceId, serviceData)
        : await vendorService.createService(serviceData);

      if (result.success) {
        showNotification(
          `Service "${data.name}" ${isEditing ? 'updated' : 'created'} successfully!`,
          'success'
        );
        setTimeout(() => navigate('/vendor/dashboard'), 1500);
      } else {
        setError(result.message || `Failed to ${isEditing ? 'update' : 'create'} service`);
      }
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} service`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-er-dark pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <button
            onClick={() => navigate('/vendor/dashboard')}
            className="flex items-center text-er-text hover:text-er-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <h1 className="font-heading text-4xl font-bold text-er-light mb-4">
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </h1>
          <p className="text-er-text">
            {isEditing ? 'Update your service details' : 'Add a service to offer at events'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Service Information */}
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-6 flex items-center">
              <Package className="mr-3 text-er-primary" />
              Service Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-er-light font-semibold mb-2">Service Name *</label>
                <input
                  {...register('name', { required: 'Service name is required' })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="Enter service name"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
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
            </div>

            <div className="mt-6">
              <label className="block text-er-light font-semibold mb-2">Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                placeholder="Describe your service..."
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Pricing */}
          <div className="card">
            <h2 className="font-heading text-2xl font-semibold text-er-light mb-6 flex items-center">
              <DollarSign className="mr-3 text-er-primary" />
              Pricing
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-er-light font-semibold mb-2">Price (KES) *</label>
                <input
                  type="number"
                  {...register('price', { required: 'Price is required', min: 0 })}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="0"
                />
                {errors.price && <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>}
              </div>

              <div>
                <label className="block text-er-light font-semibold mb-2">Duration</label>
                <input
                  {...register('duration')}
                  className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light"
                  placeholder="e.g., 4 hours, Full day"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/vendor/dashboard')}
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
              {loading ? 'Saving...' : (isEditing ? 'Update Service' : 'Add Service')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;