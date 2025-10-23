import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-er-light p-10 mt-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-bold mb-4">STAY CONNECTED</h3>
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full md:w-3/4 p-2 bg-er-dark border border-gray-700 text-er-light focus:outline-none focus:border-er-primary"
          />
        </div>

        <div>
          <h4 className="font-semibold mb-3">Shows</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:text-er-primary">Upcoming</a></li>
            <li><a href="#" className="hover:text-er-primary">History</a></li>
            <li><a href="#" className="hover:text-er-primary">Vendor Listings</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Follow Us :</h4>
          {/* Social Media Icons/Links here */}
        </div>
      </div>

      <div className="container mx-auto border-t border-gray-800 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <div className="space-x-4">
          <a href="#" className="hover:text-er-primary">Privacy Policy</a>
          <a href="#" className="hover:text-er-primary">Terms & Conditions</a>
          <a href="#" className="hover:text-er-primary">Refund Policy</a>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <h4 className="font-semibold">CONTACT US :</h4>
          <p>info@eventrift.com</p>
          <p>+254 789640541</p>
          <p>Nairobi, Kenya</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;