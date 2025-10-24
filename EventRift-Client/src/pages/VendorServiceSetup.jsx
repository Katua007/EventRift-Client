import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext'; // To get the vendor_id

// Placeholder for the API endpoint (BE-303 task)
const VENDOR_SERVICE_API = '/vendor/services'; 

const VendorServiceSetup = () => {
    // We'll assume the user object holds the vendor ID
    const { user } = useAuth();
    const vendorId = user?.id; 

    const { 
        register, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm();
    const [apiError, setApiError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    if (!vendorId) {
        return <div className="p-10 text-red-400">You must be logged in as a Vendor to set up services.</div>;
    }

    const onSubmit = async (data) => {
        setApiError(null);
        setSuccessMessage(null);
        
        // Append the vendor_id from context
        const submissionData = { ...data, vendor_id: vendorId };

        try {
            const response = await fetch(VENDOR_SERVICE_API, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    // Note: Auth token should be added here later (e.g., from useAuth)
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify(submissionData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit vendor service.');
            }

            // Success handling
            setSuccessMessage('Service successfully set up! Awaiting license verification.');
            // Optionally clear form or redirect

        } catch (error) {
            setApiError(error.message);
        }
    };

    return (
        <div className="container mx-auto p-8 pt-24 min-h-screen">
            <div className="max-w-3xl mx-auto bg-black p-10 rounded-xl shadow-2xl">
                <h1 className="text-4xl font-extrabold text-er-primary mb-6">Vendor Service Setup</h1>
                <p className="text-gray-400 mb-8">
                    Define the services you provide and submit your license details for verification.
                </p>

                {apiError && <p className="p-3 mb-4 bg-red-800/50 text-red-300 rounded">{apiError}</p>}
                {successMessage && <p className="p-3 mb-4 bg-green-800/50 text-green-300 rounded">{successMessage}</p>}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Service Name */}
                    <div>
                        <label className="block text-sm font-medium text-er-light mb-1">Service Name</label>
                        <input
                            type="text"
                            placeholder="e.g., Mobile Catering, DJ Services, Photography"
                            {...register('service_name', { required: 'Service name is required.' })}
                            className="w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-er-primary text-er-light"
                        />
                        {errors.service_name && <p className="text-red-400 text-sm mt-1">{errors.service_name.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-er-light mb-1">Service Description</label>
                        <textarea
                            rows="4"
                            placeholder="Provide a detailed description of your offerings and specialties."
                            {...register('description', { required: 'Description is required.' })}
                            className="w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-er-primary text-er-light"
                        />
                        {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    {/* License Number */}
                    <div>
                        <label className="block text-sm font-medium text-er-light mb-1">Official License Number</label>
                        <input
                            type="text"
                            placeholder="Enter your official business or professional license number"
                            {...register('license_number', { required: 'License number is required.' })}
                            className="w-full p-3 bg-er-dark border border-gray-700 rounded focus:border-er-primary focus:ring-er-primary text-er-light"
                        />
                        {errors.license_number && <p className="text-red-400 text-sm mt-1">{errors.license_number.message}</p>}
                    </div>

                    {/* License Document Upload (Placeholder for file handling) */}
                    <div>
                        <label className="block text-sm font-medium text-er-light mb-1">License Document (File Upload)</label>
                        <input
                            type="file"
                            {...register('license_document')} // This field will require custom handling (e.g., base64 or FormData)
                            className="w-full p-3 bg-er-dark border border-gray-700 rounded text-er-light file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-er-primary/80 file:text-white hover:file:bg-er-primary"
                        />
                        <p className="text-xs text-gray-500 mt-1">Accepts PDF or image files (Max 5MB).</p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-er-primary text-white font-bold py-3 rounded hover:bg-pink-700 transition duration-300 disabled:bg-gray-600"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VendorServiceSetup;