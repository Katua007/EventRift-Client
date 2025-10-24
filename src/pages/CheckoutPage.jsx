import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

// Placeholder Data (In a real app, this would be fetched from the BE /events/:id endpoint)
const mockEventData = {
    id: 101,
    name: "AfroTime Jams",
    ticketPrice: 1500.00, // Cost per ticket in KES
    description: "The biggest Afrobeats festival of the year.",
    image_url: "/placeholder-event-image.jpg"
};

const CheckoutPage = () => {
    const { eventId: _eventId } = useParams();
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
    const event = mockEventData; // Using mock data for simplicity

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
        
        const paymentData = {
            event_id: event.id,
            user_id: 1, // Placeholder: Replace with actual user ID from AuthContext
            quantity: quantity,
            mpesa_phone: data.mpesa_phone,
            total_amount: totalAmount // Send calculated total to BE for verification
        };

        try {
            // NOTE: This route corresponds to BE-401 (Daraja Setup)
            const response = await fetch('/api/payments/initiate', { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${localStorage.getItem('token')}` // Include JWT
                },
                body: JSON.stringify(paymentData),
            });
            
            const result = await response.json();

            if (response.ok) {
                // Payment initiated successfully, prompt user to check phone
                alert('M-Pesa prompt sent! Check your phone to complete the payment.');
                navigate(`/payment-status/${event.id}`); 
            } else {
                setApiError(result.message || 'Payment initiation failed. Please check your phone number.');
            }
        } catch (_error) {
            setApiError('Network error. Could not connect to the payment server.');
        } finally {
            setLoading(false);
        }
    };
    
    // Check if event data loaded
    if (!event) return <div className="text-center pt-32">Loading Event Details...</div>;

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
                    <div className="flex justify-between items-center py-2">
                        <label htmlFor="quantity" className="text-gray-400">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            min="1"
                            max="10" // Example max quantity
                            {...register('quantity', { 
                                required: 'Qty is required', 
                                min: { value: 1, message: 'Min 1 ticket' } 
                            })}
                            className="w-20 p-2 bg-er-dark border border-gray-700 rounded text-center text-er-light"
                        />
                    </div>
                    {errors.quantity && <p className={errorStyle}>{errors.quantity.message}</p>}

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