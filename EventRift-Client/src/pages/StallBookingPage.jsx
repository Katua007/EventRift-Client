import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

// Placeholder API endpoints
const STALL_BOOKING_API = '/stalls/book';
const VENDOR_SERVICES_API = '/vendor/services/my'; 
const EVENT_DETAIL_API = '/events'; 

const StallBookingPage = () => {
    // Assuming the event ID is passed via the URL (e.g., /events/123/book-stall)
    const { eventId } = useParams();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    
    const [event, setEvent] = useState(null);
    const [vendorServices, setVendorServices] = useState([]);
    const [bookingStatus, setBookingStatus] = useState(null); // 'success', 'error', or null
    const [totalCost, setTotalCost] = useState(15000); // Placeholder cost

    // --- FETCH DATA ---
    useEffect(() => {
        // 1. Fetch Event Details (for name/date display)
        fetch(`${EVENT_DETAIL_API}/${eventId}`)
            .then(res => res.json())
            .then(data => setEvent(data))
            .catch(() => setEvent({ id: eventId, name: "Placeholder Event Title", date: "2026-05-20" }));

        // 2. Fetch Vendor's Registered Services (BE-303 endpoint)
        // NOTE: Requires Authorization header with JWT token
        fetch(VENDOR_SERVICES_API, { /* headers: { Authorization: ... } */ })
            .then(res => res.json())
            .then(data => {
                // Assuming data is an array of service objects
                setVendorServices(data.services || [{id: 1, name: "Mobile Catering (Verified)"}, {id: 2, name: "Photography Services"}]);
            })
            .catch(() => setVendorServices([{id: 1, name: "Placeholder Service 1"}]));
            
    }, [eventId]);

    // --- SUBMISSION LOGIC ---
    const onSubmit = async (data) => {
        setBookingStatus(null);
        
        // Data structure matching BE-403: { vendor_id, event_id, vendor_service_id, cost }
        const submissionData = {
            ...data,
            event_id: parseInt(eventId),
            cost: totalCost, // In a real app, cost is determined by BE based on event/stall type
            // vendor_id: user.id (needs to come from Auth Context)
        };

        try {
            const response = await fetch(STALL_BOOKING_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' /* + Auth Header */ },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) throw new Error('Booking failed. Check your service status.');
            
            // In a real flow, the BE sends back an M-Pesa STK Push prompt to the user's phone.
            setBookingStatus('success'); 
        
        } catch (error) {
            setBookingStatus('error');
            console.error("Booking error:", error);
        }
    };
    
    if (!event) return <div className="p-10 text-xl text-gray-400">Loading event details...</div>;

    return (
        <div className="container mx-auto p-8 pt-24 min-h-screen">
            <div className="max-w-4xl mx-auto bg-black p-10 rounded-xl shadow-2xl">
                <h1 className="text-4xl font-extrabold text-er-primary mb-2">Book Stall for:</h1>
                <h2 className="text-3xl font-light text-er-light mb-8">{event.name}</h2>

                {/* Status Messages */}
                {bookingStatus === 'success' && (
                    <p className="p-4 mb-4 bg-green-800/50 text-green-300 rounded">
                        Booking request submitted! Awaiting M-Pesa payment confirmation. Check your phone.
                    </p>
                )}
                {bookingStatus === 'error' && (
                    <p className="p-4 mb-4 bg-red-800/50 text-red-300 rounded">
                        Failed to process booking. Ensure your selected service is verified.
                    </p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Select Service */}
                    <div>
                        <label className="block text-sm font-medium text-er-light mb-1">Select Your Service</label>
                        <select
                            {...register('vendor_service_id', { required: 'Please select a service.' })}
                            className="w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-er-primary text-er-light"
                        >
                            <option value="">-- Choose an already verified service --</option>
                            {vendorServices.map(service => (
                                <option key={service.id} value={service.id}>{service.name}</option>
                            ))}
                        </select>
                        {errors.vendor_service_id && <p className="text-red-400 text-sm mt-1">{errors.vendor_service_id.message}</p>}
                    </div>

                    {/* Cost and Payment Info */}
                    <div className="bg-er-dark p-4 rounded-lg border border-gray-700">
                        <h3 className="text-xl font-bold text-er-light mb-3">Payment Summary</h3>
                        <div className="flex justify-between text-lg mb-2">
                            <span className="text-gray-400">Stall Fee:</span>
                            <span className="font-semibold text-white">Ksh {totalCost.toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-3">
                            Clicking 'Book & Pay' will initiate an M-Pesa STK Push to your registered phone number.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !vendorServices.length}
                        className="w-full bg-er-primary text-white font-bold py-3 rounded hover:bg-pink-700 transition duration-300 disabled:bg-gray-600"
                    >
                        {isSubmitting ? 'Processing Payment...' : 'Book & Pay (M-Pesa)'}
                    </button>
                    
                    {/* Placeholder for Vendor Badge Status */}
                    <VendorBadgeStatus />
                </form>
            </div>
        </div>
    );
};

export default StallBookingPage;