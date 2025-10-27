import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export const StayConnected = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', { email, message });
    setEmail('');
    setMessage('');
  };

  return (
    <section className="py-20 px-6 bg-er-gray">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-er-light mb-4">
            Stay Connected
          </h2>
          <p className="text-xl text-er-text max-w-2xl mx-auto">
            Get in touch with us or subscribe to our newsletter
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-2xl font-semibold text-er-light mb-6">
              Get In Touch
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center text-er-text">
                <Mail className="w-5 h-5 mr-3 text-er-primary" />
                <span>hello@eventrift.com</span>
              </div>
              <div className="flex items-center text-er-text">
                <Phone className="w-5 h-5 mr-3 text-er-primary" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center text-er-text">
                <MapPin className="w-5 h-5 mr-3 text-er-primary" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-heading text-lg font-semibold text-er-light mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <a href="#" className="text-er-text hover:text-er-primary transition-colors">
                  Facebook
                </a>
                <a href="#" className="text-er-text hover:text-er-primary transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-er-text hover:text-er-primary transition-colors">
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-er-light font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-er-dark border border-er-text/20 rounded-lg text-er-light focus:outline-none focus:border-er-primary transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-er-light font-semibold mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-er-dark border border-er-text/20 rounded-lg text-er-light focus:outline-none focus:border-er-primary transition-colors resize-none"
                  placeholder="Tell us what's on your mind..."
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-er-primary hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};