import React from 'react';

// NOTE: In the real app, this data would come from the Vendor Dashboard API
const mockVendorData = {
    // This status would reflect a field from the StallBooking table (e.g., stall_badge_granted)
    hasActiveBadge: true, 
    badgeEventName: "AfroTime Jams"
};

const VendorBadgeStatus = ({ vendorId }) => {
    
    // Placeholder logic for demonstration
    const { hasActiveBadge, badgeEventName } = mockVendorData;
    
    return (
        <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-2xl font-bold text-er-light mb-4">Current Vendor Status</h3>
            
            {hasActiveBadge ? (
                <div className="bg-green-900/40 p-4 rounded-lg flex items-center justify-between">
                    <span className="text-green-400 font-semibold flex items-center">
                        <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        OFFICIAL VENDOR BADGE GRANTED!
                    </span>
                    <span className="text-sm text-green-300">
                        Active for: {badgeEventName}
                    </span>
                </div>
            ) : (
                <div className="bg-yellow-900/40 p-4 rounded-lg">
                    <span className="text-yellow-400 font-semibold">
                        Awaiting Payment/Verification
                    </span>
                    <p className="text-sm text-gray-400 mt-1">
                        Your official badge will be granted automatically upon successful payment.
                    </p>
                </div>
            )}
        </div>
    );
};

export default VendorBadgeStatus;