import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsService } from '../services/eventsService';
import { paymentsService } from '../services/paymentsService';
import { notificationService } from '../services/notificationService';
import { emailService } from '../services/emailService';
import { calendarService } from '../services/calendarService';
import { useAuth } from '../hooks/useAuth';

// Placeholder Data (In a real app, this would be fetched from the BE /events/:id endpoint)
const mockEventData = {
    id: 101,
    name: "AfroTime Jams",
    ticketPrice: 1500.00, // Cost per ticket in KES
    description: "The biggest Afrobeats festival of the year.",
    image_url: "/placeholder-event-image.jpg"
};

const CheckoutPage = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { 
        register, 
        handleSubmit, 
        watch,
        formState: { errors } 
    } = useForm({
        defaultValues: {
            quantity: 1,
            mpesa_phone: ''
        }
    });

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [event, setEvent] = useState(null);
    const [eventLoading, setEventLoading] = useState(true);
    const { user } = useAuth();

    // Fetch event data
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setEventLoading(true);
                const eventData = await eventsService.getEvent(eventId);
                setEvent(eventData.event || eventData);
            } catch (error) {
                console.error('Failed to fetch event:', error);
                // Fallback to mock data
                setEvent(mockEventData);
            } finally {
                setEventLoading(false);
            }
        };

        if (eventId) {
            fetchEvent();
        }
    }, [eventId]);

    // --- Core Calculation Logic (G-2) ---
    const quantity = watch('quantity');
    const ticketPrice = event.ticketPrice;
    const bookingFee = 50.00; // Fixed booking fee per transaction
    const subtotal = quantity * ticketPrice;
    const totalAmount = subtotal + bookingFee;
    
    // --- API Submission Handler ---
    const onSubmit = async (data) => {
        setLoading(true);
        setApiError('');
        
        if (!user) {
            setApiError('Please log in to make a purchase.');
            setLoading(false);
            return;
        }

        const paymentData = {
            event_id: event.id,
            user_id: user.id,
            quantity: quantity,
            phone_number: data.mpesa_phone,
            total_amount: totalAmount
        };

        try {
            const result = await paymentsService.initiateMpesaPayment(paymentData);
            
            if (result.success) {
                // Send notification to organizer
                try {
                    await notificationService.sendTicketPurchaseNotification(event.id, {
                        user_id: user.id,
                        quantity: quantity,
                        total_amount: totalAmount,
                        transaction_id: result.transaction_id
                    });
                } catch (notifError) {
                    console.error('Failed to send notification:', notifError);
                }
                
                // Send ticket email
                try {
                    await emailService.sendTicketEmail({
                        user_email: user.email,
                        event_title: event.title,
                        event_date: event.date,
                        event_location: event.venue_name,
                        quantity: quantity,
                        total_amount: totalAmount,
                        transaction_id: result.transaction_id
                    });
                } catch (emailError) {
                    console.error('Failed to send ticket email:', emailError);
                }
                
                // Add to calendar
                try {
                    await calendarService.addEventToCalendar({
                        title: event.title,
                        date: event.date,
                        start_time: event.start_time,
                        end_time: event.end_time,
                        location: event.address,
                        description: event.description
                    });
                } catch (calendarError) {
                    console.error('Failed to add to calendar:', calendarError);
                }
                
                alert('Payment successful! Check your email for tickets and calendar for event reminder.');
                navigate('/goer/dashboard');
            } else {
                setApiError(result.message || 'Payment initiation failed.');
            }
        } catch (error) {
            setApiError(error.message || 'Network error. Could not connect to the payment server.');
        } finally {
            setLoading(false);
        }
    };
    
    // Check if event data loaded
    if (eventLoading) return (
        <div className="text-center pt-32">
            <div className="animate-spin w-8 h-8 border-4 border-er-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <div className="text-er-light">Loading Event Details...</div>
        </div>
    );
    
    if (!event) return (
        <div className="text-center pt-32">
            <div className="text-er-light text-xl">Event not found</div>
        </div>
    );

    const inputStyle = "w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-1 focus:ring-er-primary text-er-light placeholder-gray-500";
    const errorStyle = "text-red-400 text-sm mt-1";

    return (
        <div className="container mx-auto p-8 pt-24 min-h-screen">
            <h1 className="text-4xl font-extrabold text-er-light mb-8">Checkout for: {event.name}</h1>
            
            <div className="flex flex-col lg:flex-row gap-10">
                
                {/* 1. Order Summary (Left/Top) */}
                <div className="lg:w-1/2 bg-er-gray p-6 rounded-xl shadow-2xl border border-gray-800">
                    <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-3">Order Summary</h2>
                    
                    {/* Item Row */}
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-400">Ticket Price:</span>
                        <span className="font-semibold text-er-light">KES {ticketPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="py-4">
                        <label htmlFor="quantity" className="block text-gray-400 font-semibold mb-3">Number of Tickets:</label>
                        <div className="flex items-center justify-center space-x-4">
                            <button
                                type="button"
                                onClick={() => {
                                    const currentQty = parseInt(quantity || 1);
                                    if (currentQty > 1) {
                                        const newQty = currentQty - 1;
                                        document.getElementById('quantity').value = newQty;
                                    }
                                }}
                                className="w-10 h-10 bg-er-primary text-white rounded-full font-bold hover:bg-pink-600 transition-colors"
                            >
                                -
                            </button>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                max="10"
                                {...register('quantity', { 
                                    required: 'Quantity is required', 
                                    min: { value: 1, message: 'Minimum 1 ticket' },
                                    max: { value: 10, message: 'Maximum 10 tickets' }
                                })}
                                className="w-20 p-3 bg-er-dark border border-gray-700 rounded-lg text-center text-er-light text-xl font-bold"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    const currentQty = parseInt(quantity || 1);
                                    if (currentQty < 10) {
                                        const newQty = currentQty + 1;
                                        document.getElementById('quantity').value = newQty;
                                    }
                                }}
                                className="w-10 h-10 bg-er-primary text-white rounded-full font-bold hover:bg-pink-600 transition-colors"
                            >
                                +
                            </button>
                        </div>
                        {errors.quantity && <p className={errorStyle}>{errors.quantity.message}</p>}
                    </div>

                    {/* Calculation Rows */}
                    <hr className="my-4 border-gray-800" />
                    <div className="flex justify-between py-1">
                        <span className="text-gray-400">Subtotal ({quantity} x KES {ticketPrice.toLocaleString()}):</span>
                        <span className="font-medium text-er-light">KES {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-1">
                        <span className="text-gray-400">Booking Fee:</span>
                        <span className="font-medium text-er-light">KES {bookingFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>

                    {/* Total Row */}
                    <hr className="my-4 border-er-primary" />
                    <div className="flex justify-between text-2xl font-bold">
                        <span>Total:</span>
                        <span className="text-er-primary">KES {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>

                {/* 2. Payment Form (Right/Bottom) */}
                <div className="lg:w-1/2 bg-er-gray p-6 rounded-xl shadow-2xl border border-gray-800">
                    <h2 className="text-2xl font-bold mb-4 border-b border-gray-800 pb-3">Payment Method (M-Pesa)</h2>
                    
                    {apiError && <p className="text-red-500 bg-red-900/30 p-3 rounded mb-4 text-center">{apiError}</p>}
                    
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <p className="text-gray-400">You will receive a **STK Push** notification on the number provided below to complete the payment.</p>
                        
                        {/* M-Pesa Phone Input */}
                        <div>
                            <label htmlFor="mpesa_phone" className="block text-gray-400 font-semibold mb-2">M-Pesa Mobile Number</label>
                            <input
                                type="tel"
                                placeholder="07XXXXXXXX"
                                {...register('mpesa_phone', { 
                                    required: 'M-Pesa number is required',
                                    pattern: {
                                        value: /^(0|254)\d{9}$/,
                                        message: "Must be a valid Kenyan mobile number (e.g., 07XXXXXXXX)"
                                    }
                                })}
                                className={inputStyle}
                            />
                            {errors.mpesa_phone && <p className={errorStyle}>{errors.mpesa_phone.message}</p>}
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start">
                            <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 text-er-primary bg-gray-700 border-gray-600 rounded focus:ring-er-primary" />
                            <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                                I agree to the <a href="#" className="text-er-primary hover:underline">Terms and Conditions</a>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || quantity < 1}
                            className="btn-primary w-full"
                        >
                            {loading ? 'Processing Payment...' : `Pay KES ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;