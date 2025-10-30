import React from 'react';
import { Calendar, MapPin, Clock, User, Hash, Download, Share2 } from 'lucide-react';

export const TicketDetails = ({ ticket, onClose }) => {
  const handleDownload = () => {
    // Create a simple ticket download
    const ticketData = `
EventRift Digital Ticket
========================
Event: ${ticket.event.title}
Date: ${new Date(ticket.event.date).toLocaleDateString()}
Time: ${ticket.event.start_time}
Venue: ${ticket.event.venue_name}
Address: ${ticket.event.address}
Tickets: ${ticket.quantity} x General Admission
Total Paid: KES ${ticket.totalPaid.toLocaleString()}
Transaction ID: ${ticket.transactionId}
========================
Please present this ticket at the venue
    `;
    
    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EventRift-Ticket-${ticket.transactionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${ticket.event.title} - EventRift Ticket`,
      text: `I'm attending ${ticket.event.title} on ${new Date(ticket.event.date).toLocaleDateString()}!`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      alert('Event details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-er-gray rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎫</div>
          <h3 className="text-xl font-bold text-er-light mb-2">Digital Ticket</h3>
          <p className="text-er-secondary font-mono text-sm">#{ticket.transactionId}</p>
        </div>

        {/* Event Details */}
        <div className="bg-er-dark rounded-lg p-6 mb-6">
          <h4 className="font-bold text-er-light text-lg mb-4">{ticket.event.title}</h4>
          
          <div className="space-y-3">
            <div className="flex items-center text-er-text">
              <Calendar className="w-5 h-5 mr-3 text-er-primary" />
              <div>
                <p className="font-semibold text-er-light">
                  {new Date(ticket.event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center text-er-text">
              <Clock className="w-5 h-5 mr-3 text-er-primary" />
              <div>
                <p className="font-semibold text-er-light">
                  {ticket.event.start_time} {ticket.event.end_time && `- ${ticket.event.end_time}`}
                </p>
              </div>
            </div>

            <div className="flex items-center text-er-text">
              <MapPin className="w-5 h-5 mr-3 text-er-primary" />
              <div>
                <p className="font-semibold text-er-light">{ticket.event.venue_name}</p>
                <p className="text-sm">{ticket.event.address}</p>
              </div>
            </div>

            <div className="flex items-center text-er-text">
              <User className="w-5 h-5 mr-3 text-er-primary" />
              <div>
                <p className="font-semibold text-er-light">{ticket.quantity} x General Admission</p>
                <p className="text-sm">Valid for entry</p>
              </div>
            </div>

            <div className="flex items-center text-er-text">
              <Hash className="w-5 h-5 mr-3 text-er-primary" />
              <div>
                <p className="font-semibold text-er-light">KES {ticket.totalPaid.toLocaleString()}</p>
                <p className="text-sm">Total paid</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="bg-er-dark rounded-lg p-6 mb-6 text-center">
          <div className="w-32 h-32 bg-white rounded-lg mx-auto mb-3 flex items-center justify-center">
            <div className="text-black font-mono text-xs">QR CODE</div>
          </div>
          <p className="text-er-text text-sm">Scan this code at the venue for entry</p>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-6">
          <h5 className="font-semibold text-yellow-300 mb-2">Important Notes:</h5>
          <ul className="text-yellow-200 text-sm space-y-1">
            <li>• Present this ticket (digital or printed) at the venue</li>
            <li>• Arrive 30 minutes before event start time</li>
            <li>• Valid ID required for entry</li>
            <li>• No outside food or drinks allowed</li>
            {ticket.event.dress_code && <li>• Dress code: {ticket.event.dress_code}</li>}
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-4">
          <button
            onClick={handleDownload}
            className="flex-1 bg-er-secondary hover:bg-er-secondary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
          <button
            onClick={handleShare}
            className="flex-1 bg-er-primary hover:bg-er-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-er-gray border border-gray-700 hover:border-er-primary text-er-light font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};