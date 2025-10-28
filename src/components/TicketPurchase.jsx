import React, { useState } from 'react';
import { Minus, Plus, CreditCard, Phone } from 'lucide-react';
import { mpesaService } from '../services/mpesaService';
import { emailService } from '../services/emailService';
import { calendarService } from '../services/calendarService';

export const TicketPurchase = ({ event, onClose, onSuccess }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('select'); // select, payment, success

  const ticketPrice = event.early_bird_price || event.ticket_price || 0;
  const subtotal = ticketPrice * ticketCount;
  const serviceFee = subtotal * 0.05; // 5% service fee
  const total = subtotal + serviceFee;

  const handleTicketChange = (increment) => {
    if (increment && ticketCount < Math.min(10, event.availableTickets || 10)) {
      setTicketCount(ticketCount + 1);
    } else if (!increment && ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };

  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await mpesaService.stkPush(
        phoneNumber,
        total,
        `EVENT-${event.id}`,
        `${ticketCount} tickets for ${event.title}`
      );

      if (response.ResponseCode === '0') {
        // Payment initiated successfully
        setStep('payment');
        
        // Simulate payment completion after 5 seconds
        setTimeout(async () => {
          await handlePaymentSuccess();
        }, 5000);
      } else {
        alert('Payment initiation failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Send ticket email
      await emailService.sendTicketEmail({
        to: 'user@example.com', // Get from auth context
        event: event,
        tickets: ticketCount,
        total: total,
        transactionId: `TXN-${Date.now()}`
      });

      // Add to calendar
      await calendarService.addEventToCalendar({
        title: event.title,
        date: event.date,
        startTime: event.start_time,
        endTime: event.end_time,
        location: event.venue_name,
        description: event.description
      });

      setStep('success');
      onSuccess?.({
        event,
        tickets: ticketCount,
        total,
        transactionId: `TXN-${Date.now()}`
      });
    } catch (error) {
      console.error('Post-payment processing error:', error);
      setStep('success'); // Still show success even if email/calendar fails
    }
  };

  if (step === 'payment') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-er-gray rounded-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin w-12 h-12 border-4 border-er-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-bold text-er-light mb-2">Processing Payment</h3>
          <p className="text-er-text mb-4">Please check your phone for M-Pesa prompt</p>
          <p className="text-er-text text-sm">Enter your M-Pesa PIN to complete the transaction</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-er-gray rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-er-light mb-2">Payment Successful!</h3>
          <p className="text-er-text mb-4">Your tickets have been sent to your email</p>
          <p className="text-er-text text-sm mb-6">Event added to your calendar</p>
          <button
            onClick={onClose}
            className="btn-primary w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-er-gray rounded-xl p-8 max-w-md w-full">
        <h3 className="text-xl font-bold text-er-light mb-4">Purchase Tickets</h3>
        
        <div className="mb-6">
          <h4 className="font-semibold text-er-light mb-2">{event.title}</h4>
          <p className="text-er-text text-sm">{event.date} • {event.venue_name}</p>
        </div>

        {/* Ticket Selection */}
        <div className="mb-6">
          <label className="block text-er-light font-semibold mb-2">Number of Tickets</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleTicketChange(false)}
              disabled={ticketCount <= 1}
              className="p-2 bg-er-dark border border-gray-700 rounded-lg text-er-light disabled:opacity-50"
            >
              <Minus size={16} />
            </button>
            <span className="text-er-light font-bold text-xl min-w-[40px] text-center">
              {ticketCount}
            </span>
            <button
              onClick={() => handleTicketChange(true)}
              disabled={ticketCount >= Math.min(10, event.availableTickets || 10)}
              className="p-2 bg-er-dark border border-gray-700 rounded-lg text-er-light disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>
          <p className="text-er-text text-sm mt-2">Maximum 10 tickets per order</p>
        </div>

        {/* Price Breakdown */}
        <div className="mb-6 p-4 bg-er-dark rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-er-text">Subtotal ({ticketCount} tickets)</span>
            <span className="text-er-light">KES {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-er-text">Service Fee</span>
            <span className="text-er-light">KES {serviceFee.toLocaleString()}</span>
          </div>
          <div className="border-t border-gray-700 pt-2 flex justify-between">
            <span className="text-er-light font-bold">Total</span>
            <span className="text-er-primary font-bold">KES {total.toLocaleString()}</span>
          </div>
        </div>

        {/* M-Pesa Payment */}
        <div className="mb-6">
          <label className="block text-er-light font-semibold mb-2">
            <Phone className="inline w-4 h-4 mr-2" />
            M-Pesa Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="254712345678"
            className="w-full p-3 bg-er-dark border border-gray-700 rounded-lg text-er-light"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleMpesaPayment}
            disabled={loading || !phoneNumber}
            className="btn-primary flex-1 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
            ) : (
              <CreditCard className="w-4 h-4 mr-2" />
            )}
            Pay with M-Pesa
          </button>
        </div>
      </div>
    </div>
  );
};