import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const onSubmit = async (data) => {
    setApiError(null);
    setSuccessMessage(null);
    
    try {
      const credentials = {
        email_or_username: data.email_or_username,
        password: data.password
      };
      
      const result = await login(credentials);
      
      if (result.success) {
        const displayName = result.user?.name || result.user?.username || 'User';
        setSuccessMessage(`Welcome back, ${displayName}!`);
        
        // Check for redirect URL or redirect based on role after short delay
        setTimeout(() => {
          const redirectUrl = localStorage.getItem('redirectAfterLogin');
          if (redirectUrl) {
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectUrl);
          } else {
            const role = result.user.role.toLowerCase();
            if (role === 'organizer') {
              navigate('/organizer/dashboard');
            } else if (role === 'vendor') {
              navigate('/vendor/dashboard');
            } else {
              navigate('/goer/dashboard');
            }
          }
        }, 1500);
      } else {
        setApiError(result.error);
      }
    } catch (error) {
      setApiError(error.message || 'Network error. Could not connect to the server.');
    }
  };

  return (
    <div className="min-h-screen bg-er-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-er-primary to-er-secondary rounded-3xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
          </div>
          <h2 className="font-heading text-4xl font-bold text-er-light mb-3">
            Welcome Back
          </h2>
          <p className="text-er-text text-lg">
            Sign in to your EventRift account
          </p>
        </div>
        
        {/* Form Card */}
        <div className="card animate-slide-up">
          {/* Demo Credentials */}
          <div className="bg-gradient-to-r from-er-primary/10 to-er-secondary/10 border border-er-primary/20 rounded-xl p-4 mb-6">
            <p className="text-er-primary font-semibold mb-3 text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Demo Credentials:
            </p>
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-er-text">Goer:</span>
                <span className="text-er-light font-mono">goer@test.com / password</span>
              </div>
              <div className="flex justify-between">
                <span className="text-er-text">Organizer:</span>
                <span className="text-er-light font-mono">organizer@test.com / password</span>
              </div>
              <div className="flex justify-between">
                <span className="text-er-text">Vendor:</span>
                <span className="text-er-light font-mono">vendor@test.com / password</span>
              </div>
            </div>
          </div>

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
            {/* Email/Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-er-light mb-3">
                Email or Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-er-muted" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your email or username"
                  {...register('email_or_username', { required: 'Email/Username is required.' })}
                  className="input-field pl-12 pr-4"
                />
              </div>
              {errors.email_or_username && (
                <p className="text-er-error text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email_or_username.message}
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
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || successMessage}
              className="w-full bg-gradient-to-r from-er-primary to-er-secondary hover:from-er-primary/90 hover:to-er-secondary/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-glow"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Signing In...
                </div>
              ) : successMessage ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Redirecting...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-er-border">
            <p className="text-er-text">
              Don't have an account?{' '}
              <Link to="/signup" className="text-er-primary hover:text-er-primary/80 font-semibold transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;