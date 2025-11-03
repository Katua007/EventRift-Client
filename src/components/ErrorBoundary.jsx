// Error boundary component to catch and handle React errors gracefully
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-er-dark text-er-text flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-er-primary mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">We're experiencing technical difficulties. Please try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-er-primary to-er-secondary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;