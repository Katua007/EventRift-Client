import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle, Users } from 'lucide-react';

const SignupPage = () => {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      role: 'Goer'
    }
  });
  
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const password = watch("password", "");
  const { register: registerUser } = useAuth();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    setSuccessMessage('');
    
    const { confirm_password: _confirm_password, ...userData } = data;

    try {
      const result = await registerUser(userData);
      
      if (result.success) {
        setSuccessMessage('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      setApiError(error.message || 'Network error. Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { 
      value: 'Goer', 
      label: 'Event Goer', 
      desc: 'Discover and attend amazing events',
      icon: '🎉'
    },
    { 
      value: 'Organizer', 
      label: 'Event Organizer', 
      desc: 'Create and manage events',
      icon: '🎯'
    },
    { 
      value: 'Vendor', 
      label: 'Service Vendor', 
      desc: 'Provide services for events',
      icon: '🛠️'
    }
  ];

  return (
    <div className="min-h-screen bg-er-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-er-primary to-er-secondary rounded-3xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
          </div>
          <h2 className="font-heading text-4xl font-bold text-er-light mb-3">
            Join EventRift
          </h2>
          <p className="text-er-text text-lg">
            Create your account and start discovering amazing events
          </p>
        </div>
        
        {/* Form Card */}
        <div className="card animate-slide-up">
          {/* Success Message */}
          {successMessage && (
            <div className="bg-er-success/10 border border-er-success/20 rounded-xl p-4 mb-6 animate-fade-in">
              <p className="text-er-success text-sm text-center flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {successMessage}
              </p>
            </div>
          )}

          {/* Error Message */}
          {apiError && (
            <div className="bg-er-error/10 border border-er-error/20 rounded-xl p-4 mb-6 animate-fade-in">
              <p className="text-er-error text-sm text-center flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {apiError}
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-er-light mb-3">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-er-muted" />
                </div>
                <input
                  type="text"
                  placeholder="Choose a unique username"
                  {...register('username', { required: 'Username is required' })}
                  className="input-field pl-12 pr-4"
                />
              </div>
              {errors.username && (
                <p className="text-er-error text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-er-light mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-er-muted" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  {...register('email', { 
                    required: 'Email is required', 
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address"
                    }
                  })}
                  className="input-field pl-12 pr-4"
                />
              </div>
              {errors.email && (
                <p className="text-er-error text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-er-light mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                I am signing up as:
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map(roleOption => (
                  <label key={roleOption.value} className="cursor-pointer">
                    <input
                      type="radio"
                      value={roleOption.value}
                      {...register('role', { required: 'Please select a role' })}
                      className="hidden"
                    />
                    <div className={`p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      watch('role') === roleOption.value 
                        ? 'bg-gradient-to-r from-er-primary/20 to-er-secondary/20 border-er-primary shadow-glow' 
                        : 'bg-er-dark border-er-border hover:border-er-primary/50 hover:bg-er-primary/5'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{roleOption.icon}</div>
                        <div className="flex-1">
                          <div className={`font-semibold ${
                            watch('role') === roleOption.value ? 'text-er-light' : 'text-er-text'
                          }`}>
                            {roleOption.label}
                          </div>
                          <div className={`text-sm ${
                            watch('role') === roleOption.value ? 'text-er-text' : 'text-er-muted'
                          }`}>
                            {roleOption.desc}
                          </div>
                        </div>
                        {watch('role') === roleOption.value && (
                          <CheckCircle className="w-5 h-5 text-er-primary" />
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="text-er-error text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-er-light mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-er-muted" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-er-muted hover:text-er-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-er-error text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-er-light mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-er-muted" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register('confirm_password', { 
                    required: 'Please confirm your password',
                    validate: value => 
                      value === password || "Passwords do not match"
                  })}
                  className="input-field pl-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-er-muted hover:text-er-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-er-error text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.confirm_password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || successMessage}
              className="w-full bg-gradient-to-r from-er-primary to-er-secondary hover:from-er-primary/90 hover:to-er-secondary/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-glow"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Creating Account...
                </div>
              ) : successMessage ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Account Created!
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
          
          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-er-border">
            <p className="text-er-text">
              Already have an account?{' '}
              <Link to="/login" className="text-er-primary hover:text-er-primary/80 font-semibold transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;