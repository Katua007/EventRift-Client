import React, { useState } from 'react';
import { Upload, Plus, Trash2, Save, Award } from 'lucide-react';
import { vendorService } from '../services/vendorService';
import { mpesaService } from '../services/mpesaService';

export const VendorSetup = () => {
  const [services, setServices] = useState([]);
  const [license, setLicense] = useState(null);
  const [loading, setLoading] = useState(false);
  const [vendorStatus, setVendorStatus] = useState('setup'); // setup, verified, certified

  const serviceCategories = [
    'Photography', 'Catering', 'Decoration', 'Sound & Lighting', 
    'Security', 'Transportation', 'Entertainment', 'Other'
  ];

  const addService = () => {
    setServices([...services, {
      id: Date.now(),
      name: '',
      category: '',
      description: '',
      price: '',
      duration: ''
    }]);
  };

  const updateService = (id, field, value) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, [field]: value } : service
    ));
  };

  const removeService = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  const handleLicenseUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLicense(file);
    }
  };

  const handleSaveServices = async () => {
    setLoading(true);
    try {
      await vendorService.updateServices('vendor-id', services);
      
      if (license) {
        await vendorService.uploadLicense('vendor-id', license);
      }
      
      alert('Services saved successfully!');
      setVendorStatus('verified');
    } catch (error) {
      console.error('Error saving services:', error);
      alert('Error saving services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBookStall = async (eventId) => {
    try {
      const stallPrice = 25000; // KES 25,000 for stall booking
      
      const response = await mpesaService.stkPush(
        '254712345678', // Get from user profile
        stallPrice,
        `STALL-${eventId}`,
        'Event stall booking'
      );

      if (response.ResponseCode === '0') {
        // Simulate successful payment
        setTimeout(async () => {
          await vendorService.bookStall('vendor-id', eventId, {
            stall_number: Math.floor(Math.random() * 100) + 1,
            price: stallPrice
          });
          
          setVendorStatus('certified');
          alert('Stall booked successfully! You now have a certified vendor badge.');
        }, 3000);
      }
    } catch (error) {
      console.error('Error booking stall:', error);
      alert('Error booking stall. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-er-dark pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="font-heading text-4xl font-bold text-er-light">
              Vendor Setup
            </h1>
            {vendorStatus === 'certified' && (
              <div className="flex items-center bg-green-900/30 text-green-300 px-3 py-1 rounded-full">
                <Award className="w-4 h-4 mr-2" />
                Certified Vendor
              </div>
            )}
          </div>
          <p className="text-er-text">Set up your services and get certified to start receiving bookings</p>
        </div>

        {/* Services Section */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-er-light">Your Services</h2>
            <button
              onClick={addService}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </button>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-er-text mb-4">No services added yet</p>
              <button onClick={addService} className="btn-secondary">
                Add Your First Service
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="p-4 bg-er-dark rounded-lg border border-gray-700">
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-er-light font-semibold mb-2">Service Name</label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(service.id, 'name', e.target.value)}
                        className="w-full p-3 bg-er-gray border border-gray-600 rounded-lg text-er-light"
                        placeholder="e.g., Wedding Photography"
                      />
                    </div>
                    <div>
                      <label className="block text-er-light font-semibold mb-2">Category</label>
                      <select
                        value={service.category}
                        onChange={(e) => updateService(service.id, 'category', e.target.value)}
                        className="w-full p-3 bg-er-gray border border-gray-600 rounded-lg text-er-light"
                      >
                        <option value="">Select Category</option>
                        {serviceCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-er-light font-semibold mb-2">Price (KES)</label>
                      <input
                        type="number"
                        value={service.price}
                        onChange={(e) => updateService(service.id, 'price', e.target.value)}
                        className="w-full p-3 bg-er-gray border border-gray-600 rounded-lg text-er-light"
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <label className="block text-er-light font-semibold mb-2">Duration</label>
                      <input
                        type="text"
                        value={service.duration}
                        onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                        className="w-full p-3 bg-er-gray border border-gray-600 rounded-lg text-er-light"
                        placeholder="e.g., 8 hours"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-er-light font-semibold mb-2">Description</label>
                    <textarea
                      value={service.description}
                      onChange={(e) => updateService(service.id, 'description', e.target.value)}
                      rows={3}
                      className="w-full p-3 bg-er-gray border border-gray-600 rounded-lg text-er-light"
                      placeholder="Describe your service..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => removeService(service.id)}
                      className="text-red-400 hover:text-red-300 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* License Upload */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-er-light mb-4">Business License</h2>
          <p className="text-er-text mb-4">Upload your business license to get verified</p>
          
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
            {license ? (
              <div>
                <p className="text-er-light mb-2">✓ {license.name}</p>
                <button
                  onClick={() => setLicense(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 text-er-text mx-auto mb-4" />
                <p className="text-er-text mb-4">Click to upload your business license</p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleLicenseUpload}
                  className="hidden"
                  id="license-upload"
                />
                <label
                  htmlFor="license-upload"
                  className="btn-secondary cursor-pointer"
                >
                  Choose File
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Certification Section */}
        {vendorStatus === 'verified' && (
          <div className="card mb-8">
            <h2 className="text-2xl font-bold text-er-light mb-4">Get Certified</h2>
            <p className="text-er-text mb-4">
              Book a stall at any event to receive your certified vendor badge
            </p>
            
            <div className="bg-er-dark p-4 rounded-lg mb-4">
              <h3 className="text-er-light font-semibold mb-2">Stall Booking - KES 25,000</h3>
              <p className="text-er-text text-sm mb-4">
                Includes: 3x3m space, table, chairs, power connection, and certified vendor badge
              </p>
              <button
                onClick={() => handleBookStall('demo-event-id')}
                className="btn-primary"
              >
                Book Stall & Get Certified
              </button>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveServices}
            disabled={loading || services.length === 0}
            className="btn-primary flex items-center"
          >
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Services
          </button>
        </div>
      </div>
    </div>
  );
};