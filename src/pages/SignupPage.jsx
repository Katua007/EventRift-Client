import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    // Set default role to 'Goer' as it's the most common user type
    defaultValues: {
      role: 'Goer'
    }
  });
  
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Watch the password field for the confirmation validation
  const password = watch("password", "");

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError('');
    
    // Prepare data (remove confirm_password before sending)
    const { confirm_password: _confirm_password, ...userData } = data;

    try {
      // NOTE: Update URL to your deployed backend API later
      const response = await fetch('/api/users', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const result = await response.json();

      if (response.ok) {
        // Successful signup, redirect to login or verification page
        alert('Signup successful! Please check your email for verification.');
        navigate('/login'); 
      } else {
        // Handle specific BE errors (e.g., email already exists)
        setApiError(result.message || 'Registration failed. Please try again.');
      }
    } catch (_error) {
      setApiError('Network error. Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light placeholder-gray-500";
  const errorStyle = "text-red-400 text-sm mt-1";

  return (
    <div className="flex justify-center items-center py-10 min-h-screen bg-er-dark">
      <div className="w-full max-w-lg p-8 bg-er-gray rounded-xl shadow-2xl border border-gray-800">
        <h2 className="font-heading text-4xl font-extrabold text-er-light mb-8 text-center">Join EventRift</h2>
        {apiError && <p className="text-red-500 bg-red-900/30 p-3 rounded mb-4 text-center">{apiError}</p>}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Username */}
          <div>
            <input
              type="text"
              placeholder="Username"
              {...register('username', { required: 'Username is required' })}
              className={inputStyle}
            />
            {errors.username && <p className={errorStyle}>{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email', { 
                required: 'Email is required', 
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address"
                }
              })}
              className={inputStyle}
            />
            {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
          </div>

          {/* Role Selection */}
          <div className="pt-2">
            <label className="block text-gray-400 font-semibold mb-2">I am signing up as:</label>
            <div className="flex justify-between space-x-3">
              {['Goer', 'Organizer', 'Vendor'].map(roleOption => (
                <label key={roleOption} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    value={roleOption}
                    {...register('role', { required: 'Please select a role' })}
                    className="hidden"
                  />
                  <div className={`p-3 text-center rounded-lg border-2 transition duration-300 ${
                    watch('role') === roleOption 
                      ? 'bg-er-primary border-er-primary text-white font-bold' 
                      : 'bg-er-dark border-gray-700 text-gray-300 hover:border-er-primary'
                  }`}>
                    {roleOption}
                  </div>
                </label>
              ))}
            </div>
            {errors.role && <p className={errorStyle}>{errors.role.message}</p>}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className={inputStyle}
            />
            {errors.password && <p className={errorStyle}>{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              {...register('confirm_password', { 
                required: 'Please confirm your password',
                validate: value => 
                  value === password || "Passwords do not match"
              })}
              className={inputStyle}
            />
            {errors.confirm_password && <p className={errorStyle}>{errors.confirm_password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center text-sm mt-6 text-gray-400">
          Already have an account? <Link to="/login" className="text-er-primary hover:underline font-semibold">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;