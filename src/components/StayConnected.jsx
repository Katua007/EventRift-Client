import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function StayConnected() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <section className="bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white mb-8 uppercase tracking-wide">Stay Connected</h2>
        
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <form onSubmit={handleSubmit} className="flex-1 max-w-md">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-black flex-1"
                required
              />
              <Button type="submit" className="bg-white text-black hover:bg-white/90">
                Subscribe
              </Button>
            </div>
          </form>
          
          <div className="flex gap-6 text-white/80">
            <div>
              <p className="mb-2">Follow us</p>
              <div className="flex flex-col gap-1">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}