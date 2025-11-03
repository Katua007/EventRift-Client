// This file creates the login page where users can sign in to their accounts
// It handles the login form, shows error messages, and redirects users after successful login

// Import React hooks and components we need
import React, { useState } from 'react'; // React is the main library, useState helps us store data that changes
import { useForm } from 'react-hook-form'; // This helps us manage the login form easily
import { useAuth } from '../hooks/useAuth'; // This gives us access to login functions
import { Link, useNavigate } from 'react-router-dom'; // These help us move between different pages
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react'; // These are icons for the form

// This is the main component for the login page
const LoginPage = () => {
  // Set up the form with validation rules
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  // Get the login function from our authentication system
  const { login } = useAuth();
  // This helps us redirect to other pages after login
  const navigate = useNavigate();
  // Store any error messages from the server
  const [apiError, setApiError] = useState(null);
  // Control whether to show or hide the password
  const [showPassword, setShowPassword] = useState(false);
  // Store success messages to show to the user
  const [successMessage, setSuccessMessage] = useState(null);

  // This function runs when the user clicks the login button
  const onSubmit = async (data) => {
    // Clear any previous error or success messages
    setApiError(null);
    setSuccessMessage(null);

    try {
      // Prepare the login information in the format the server expects
      const credentials = {
        email: data.email_or_username, // The email or username from the form
        password: data.password // The password from the form
      };

      // Try to log in using our authentication system
      const result = await login(credentials);

      // If login was successful
      if (result.success) {
        // Get the user's name to show in the welcome message
        const displayName = result.user?.name || result.user?.username || 'User';
        // Show a success message to the user
        setSuccessMessage(`Welcome back, ${displayName}!`);

        // Wait a bit, then redirect the user to the right page
        setTimeout(() => {
          // Check if the user was trying to go to a specific page before logging in
          const redirectUrl = localStorage.getItem('redirectAfterLogin');
          if (redirectUrl) {
            // Remove the stored URL and go there
            localStorage.removeItem('redirectAfterLogin');
            navigate(redirectUrl);
          } else {
            // Otherwise, send them to their dashboard based on their role
            const role = result.user.role.toLowerCase();
            if (role === 'organizer') {
              navigate('/organizer/dashboard'); // Organizers go to organizer dashboard
            } else if (role === 'vendor') {
              navigate('/vendor/dashboard'); // Vendors go to vendor dashboard
            } else {
              navigate('/goer/dashboard'); // Everyone else goes to goer dashboard
            }
          }
        }, 1500); // Wait 1.5 seconds so they can see the success message
      } else {
        // If login failed, show the error message
        setApiError(result.error);
      }
    } catch (error) {
      // If there was a network or other error, show a generic message
      setApiError(error.message || 'Network error. Could not connect to the server.');
    }
  };

  // This is what the user sees on the screen
  return (
    // Main container that takes up the full screen height and centers everything
    <div className="min-h-screen bg-er-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Form container with maximum width and some spacing */}
      <div className="max-w-md w-full space-y-8">
        {/* Header section with logo and title */}
        <div className="text-center animate-fade-in">
          {/* Logo - a circular gradient background with the letter E */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-er-primary to-er-secondary rounded-3xl flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
          </div>
          {/* Main heading */}
          <h2 className="font-heading text-4xl font-bold text-er-light mb-3">
            Welcome Back
          </h2>
          {/* Subtitle explaining what this page does */}
          <p className="text-er-text text-lg">
            Sign in to your EventRift account
          </p>
        </div>
        
        {/* The main form container with a nice card design */}
        <div className="card animate-slide-up">
          {/* Demo credentials section - shows test login info for easy testing */}
          <div className="bg-gradient-to-r from-er-primary/10 to-er-secondary/10 border border-er-primary/20 rounded-xl p-4 mb-6">
            {/* Header for the demo credentials */}
            <p className="text-er-primary font-semibold mb-3 text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Demo Credentials:
            </p>
            {/* List of different user types and their login details */}
            <div className="text-xs space-y-2">
              {/* Goer account credentials */}
              <div className="flex justify-between">
                <span className="text-er-text">Goer:</span>
                <span className="text-er-light font-mono">goer@test.com / password</span>
              </div>
              {/* Organizer account credentials */}
              <div className="flex justify-between">
                <span className="text-er-text">Organizer:</span>
                <span className="text-er-light font-mono">organizer@test.com / password</span>
              </div>
              {/* Vendor account credentials */}
              <div className="flex justify-between">
                <span className="text-er-text">Vendor:</span>
                <span className="text-er-light font-mono">vendor@test.com / password</span>
              </div>
            </div>
          </div>

          {/* Show success message when login works */}
          {successMessage && (
            <div className="bg-er-success/10 border border-er-success/20 rounded-xl p-4 mb-6 animate-fade-in">
              <p className="text-er-success text-sm text-center flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {successMessage}
              </p>
            </div>
          )}

          {/* Show error message when login fails */}
          {apiError && (
            <div className="bg-er-error/10 border border-er-error/20 rounded-xl p-4 mb-6 animate-fade-in">
              <p className="text-er-error text-sm text-center flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {apiError}
              </p>
            </div>
          )}
          
          {/* The actual login form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email or Username input field */}
            <div className="space-y-2">
              {/* Label for the input field */}
              <label className="block text-sm font-semibold text-er-light mb-3">
                Email or Username
              </label>
              {/* Container for input with icon */}
              <div className="relative">
                {/* Mail icon on the left side */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-er-muted" />
                </div>
                {/* The actual input field */}
                <input
                  type="text"
                  placeholder="Enter your email or username"
                  {...register('email_or_username', { required: 'Email/Username is required.' })}
                  className="input-field pl-12 pr-4"
                />
              </div>
              {/* Show error message if email/username is missing */}
              {errors.email_or_username && (
                <p className="text-er-error text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email_or_username.message}
                </p>
              )}
            </div>

            {/* Password input field */}
            <div className="space-y-2">
              {/* Label for the password field */}
              <label className="block text-sm font-semibold text-er-light mb-3">
                Password
              </label>
              {/* Container for password input with icons */}
              <div className="relative">
                {/* Lock icon on the left side */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-er-muted" />
                </div>
                {/* Password input field - shows dots or text based on showPassword */}
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                  className="input-field pl-12 pr-12"
                />
                {/* Button to toggle password visibility */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-er-muted hover:text-er-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {/* Show error message if password is missing */}
              {errors.password && (
                <p className="text-er-error text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* The login button */}
            <button
              type="submit"
              disabled={isSubmitting || successMessage} // Disable button while submitting or after success
              className="w-full bg-gradient-to-r from-er-primary to-er-secondary hover:from-er-primary/90 hover:to-er-secondary/90 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-glow"
            >
              {/* Show different content based on the current state */}
              {isSubmitting ? ( // While the form is being submitted
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Signing In...
                </div>
              ) : successMessage ? ( // After successful login
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Redirecting...
                </div>
              ) : ( // Normal state - just show "Sign In"
                'Sign In'
              )}
            </button>
          </form>
          
          {/* Footer with link to sign up page */}
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

// Export the component so it can be used in other files
export default LoginPage;