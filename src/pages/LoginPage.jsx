import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../App';
import { Link, useNavigate } from 'react-router-dom';


const LOGIN_API = '/login'; // Backend endpoint (BE-201)

const LoginPage = () => {
  // Destructure isSubmitting for the button state
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = React.useState(null); // Use null for clean state

  const onSubmit = async (data) => {
    setApiError(null); // Clear previous errors
    try {
      // NOTE: Ensure the keys in `data` match the backend expectations (Phase 2 plan uses email_or_username)
      const submissionData = {
          email_or_username: data.email_or_username,
          password: data.password
      };
      
      const response = await fetch(LOGIN_API, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        // Assuming the BE returns { access_token, user: { id, username, role } }
        const token = result.access_token;
        const userData = result.user;

        // Call context login function
        login(token, userData); 
        
        // Redirect based on role
        navigate(`/${userData.role.toLowerCase()}/dashboard`);
      } else {
        // Use result.msg from Flask-JWT-Extended or result.message from custom error
        const errorMessage = result.msg || result.message || 'Login failed. Please check your credentials.';
        setApiError(errorMessage);
      }
    } catch (_error) {
      setApiError('Network error. Could not connect to the server.');
    }
  };

  return (
    <div className="flex justify-center items-center p-8 pt-32 min-h-screen bg-er-dark">
      <div className="w-full max-w-md p-8 bg-er-gray rounded-xl shadow-2xl border border-gray-800">
        <h2 className="font-heading text-3xl font-bold text-er-light mb-6 text-center">Log In to EventRift</h2>
        
        {apiError && <p className="text-red-500 bg-red-900/30 p-3 rounded mb-4 text-center">{apiError}</p>} 
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Updated input name to match the BE-201 expectation: email_or_username */}
          <div>
            <input
              type="text" // Allows email or username
              placeholder="Email or Username"
              {...register('email_or_username', { required: 'Email/Username is required.' })}
              className="w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-er-primary text-er-light"
            />
            {errors.email_or_username && <p className="text-red-400 text-xs mt-1">{errors.email_or_username.message}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-er-primary text-er-light"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting} // Disable button during submission
            className="btn-primary w-full"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center text-sm mt-6 text-gray-400">
          Don't have an account? <Link to="/signup" className="text-er-primary hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;