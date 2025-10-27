import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, DollarSign, Star, Eye, Edit, Trash2, TrendingUp, Package, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const VendorDashboard = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setLoading(true);
        // Mock data for demo
        const mockServices = [
          {
            id: 1,
            name: "Photography Package",
            category: "Photography",
            price: 50000,
            bookings: 12,
            rating: 4.8,
            status: "active"
          },
          {
            id: 2,
            name: "Catering Service",
            category: "Food & Beverage",
            price: 25000,
            bookings: 8,
            rating: 4.5,
            status: "active"
          }
        ];

        const mockBookings = [
          {
            id: 1,
            service_name: "Photography Package",
            event_name: "Tech Conference 2024",
            client_name: "John Doe",
            date: "2024-12-20",
            amount: 50000,
            status: "confirmed"
          }
        ];

        setServices(mockServices);
        setBookings(mockBookings);
        setStats({
          totalServices: 2,
          totalBookings: 20,
          totalRevenue: 1000000,
          averageRating: 4.7
        });
      } catch (err) {
        console.error('Failed to fetch vendor data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchVendorData();
    }
  }, [user?.id]);

  const StatCard = ({ icon: Icon, title, value, color = "text-er-primary" }) => (
    <div className="card hover:transform hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-er-text text-sm">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );

  const ServiceCard = ({ service }) => (
    <div className="card hover:transform hover:scale-105 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-heading text-xl font-semibold text-er-light mb-2">{service.name}</h3>
          <p className="text-er-text">{service.category}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          service.status === 'active' ? 'bg-green-900/30 text-green-300' :
          'bg-gray-900/30 text-gray-300'
        }`}>
          {service.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-er-text text-sm">Price</p>
          <p className="text-er-primary font-bold">KES {service.price.toLocaleString()}</p>
        </div>
        <div className="text-center">
          <p className="text-er-text text-sm">Bookings</p>
          <p className="text-er-secondary font-bold">{service.bookings}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-er-text">{service.rating}</span>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 bg-er-primary/20 text-er-primary rounded-lg hover:bg-er-primary/30 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-2 bg-er-secondary/20 text-er-secondary rounded-lg hover:bg-er-secondary/30 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-2 bg-red-900/20 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const BookingCard = ({ booking }) => (
    <div className="card hover:transform hover:scale-105 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-heading text-lg font-semibold text-er-light mb-1">{booking.service_name}</h3>
          <p className="text-er-text">{booking.event_name}</p>
          <p className="text-er-text text-sm">Client: {booking.client_name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          booking.status === 'confirmed' ? 'bg-green-900/30 text-green-300' :
          booking.status === 'pending' ? 'bg-yellow-900/30 text-yellow-300' :
          'bg-red-900/30 text-red-300'
        }`}>
          {booking.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-er-text text-sm">Date</p>
          <p className="text-er-light font-semibold">{new Date(booking.date).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-er-text text-sm">Amount</p>
          <p className="text-er-primary font-bold">KES {booking.amount.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-er-dark pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-er-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-er-light">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-er-dark pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-heading text-4xl font-bold text-er-light mb-2">
              Welcome back, {user?.username}! 🛠️
            </h1>
            <p className="text-er-text">Manage your services and track your bookings</p>
          </div>
          <Link
            to="/vendor/create-service"
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Service
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Package}
            title="Total Services"
            value={stats.totalServices}
            color="text-er-primary"
          />
          <StatCard
            icon={Calendar}
            title="Total Bookings"
            value={stats.totalBookings}
            color="text-er-secondary"
          />
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`KES ${stats.totalRevenue.toLocaleString()}`}
            color="text-er-accent"
          />
          <StatCard
            icon={Star}
            title="Average Rating"
            value={stats.averageRating}
            color="text-yellow-400"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-er-gray rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'services', label: 'My Services', icon: Package },
            { id: 'bookings', label: 'Bookings', icon: Calendar }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-er-primary text-white'
                  : 'text-er-text hover:text-er-primary'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="card">
              <h2 className="font-heading text-2xl font-semibold text-er-light mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-er-dark rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-4"></div>
                  <div>
                    <p className="text-er-light">New booking for "Photography Package"</p>
                    <p className="text-er-text text-sm">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-er-dark rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-4"></div>
                  <div>
                    <p className="text-er-light">Service "Catering Service" received a 5-star review</p>
                    <p className="text-er-text text-sm">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div>
            {services.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-er-text mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-er-light mb-2">No services yet</h3>
                <p className="text-er-text mb-6">Add your first service to get started</p>
                <Link to="/vendor/create-service" className="btn-primary">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Your First Service
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="w-16 h-16 text-er-text mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-er-light mb-2">No bookings yet</h3>
                <p className="text-er-text">Your service bookings will appear here</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;