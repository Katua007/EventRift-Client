import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react'; // Icons for visual distinction

/**
 * A reusable component for displaying consistent success or error messages.
 * @param {string} message - The message content.
 * @param {'error' | 'success'} type - The type of alert.
 */
const Alert = ({ message, type = 'error' }) => {
    if (!message) return null;

    const baseClasses = "p-4 rounded-lg flex items-start space-x-3 text-sm font-medium mb-4";
    
    // Define colors based on the theme
    let classes = '';
    let Icon = AlertCircle;

    if (type === 'error') {
        classes = "bg-red-900/40 text-red-300 border border-red-800";
        Icon = AlertCircle;
    } else if (type === 'success') {
        classes = "bg-green-900/40 text-green-300 border border-green-800";
        Icon = CheckCircle;
    }

    return (
        <div className={`${baseClasses} ${classes}`} role="alert">
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="flex-grow">{message}</p>
        </div>
    );
};

export default Alert;