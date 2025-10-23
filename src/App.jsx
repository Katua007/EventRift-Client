import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className="min-h-screen pt-16"> 
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Protected routes will go here later */}
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
export default App;