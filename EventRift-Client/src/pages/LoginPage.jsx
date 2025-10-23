import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = React.useState('');

  const onSubmit = async (data) => {
    setApiError('');
    try {
      const response = await fetch('/login', { // Use proxy/full URL later
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        login(result.user_role, result.access_token);
        navigate(`/${result.user_role.toLowerCase()}/dashboard`); // Redirect based on role
      } else {
        setApiError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setApiError('Network error. Could not connect to the server.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-er-dark">
      <div className="w-full max-w-md p-8 bg-black rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-er-light mb-6 text-center">Log In to EventRift</h2>
        {apiError && <p className="text-red-500 mb-4 text-center">{apiError}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register('email', { required: 'Email is required', pattern: /^\S+@\S+$/i })}
              className="w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-er-primary text-er-light"
            />
            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password', { required: 'Password is required' })}
              className="w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-er-primary text-er-light"
            />
            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-er-primary text-white font-bold py-3 rounded hover:bg-pink-700 transition duration-300"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-400">
          Don't have an account? <Link to="/signup" className="text-er-primary hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;