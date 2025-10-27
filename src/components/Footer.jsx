export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/60">
          <div>
            <h3 className="text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@event-8.com" className="hover:text-white transition-colors">
                  info@event-8.com
                </a>
              </li>
              <li>
                <a href="tel:+2347031232341" className="hover:text-white transition-colors">
                  +234 7031232341
                </a>
              </li>
              <li>Lagos, Nigeria</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white mb-4">EventRift</h3>
            <p>Creating unforgettable experiences</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40">
          <p>&copy; {new Date().getFullYear()} EventRift. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}