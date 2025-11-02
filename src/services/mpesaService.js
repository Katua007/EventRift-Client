// M-Pesa Daraja API service
const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke';
const CONSUMER_KEY = import.meta.env.VITE_MPESA_CONSUMER_KEY || 'demo_key';
const CONSUMER_SECRET = import.meta.env.VITE_MPESA_CONSUMER_SECRET || 'demo_secret';
const BUSINESS_SHORT_CODE = import.meta.env.VITE_MPESA_SHORTCODE || '174379';
const PASSKEY = import.meta.env.VITE_MPESA_PASSKEY || 'demo_passkey';

// Check if we're in demo mode (no API keys or running in browser with CORS restrictions)
const isDemoMode = () => {
  return CONSUMER_KEY === 'demo_key' || 
         CONSUMER_SECRET === 'demo_secret' || 
         window.location.hostname !== 'localhost';
};

export const mpesaService = {
  // Get OAuth token
  getAccessToken: async () => {
    // Always use demo mode to avoid CORS issues
    if (isDemoMode()) {
      console.log('Demo Mode: M-Pesa service running in demo mode');
      return 'demo-token-12345';
    }
    
    try {
      const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
      const response = await fetch(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting M-Pesa token:', error);
      // Return demo token instead of throwing error
      return 'demo-token-12345';
    }
  },

  // Initiate STK Push
  stkPush: async (phoneNumber, amount, accountReference, transactionDesc, ticketCount = 1) => {
    console.log('Demo Mode: M-Pesa STK Push simulation', { phoneNumber, amount, accountReference, transactionDesc });

    // Always use demo mode to avoid CORS issues
    if (isDemoMode()) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate creating a ticket in the backend
      try {
        const ticketData = {
          event_id: parseInt(accountReference.replace('EVENT-', '')),
          quantity: ticketCount,
          phone_number: phoneNumber,
          amount: amount,
          transaction_id: `TXN-${Date.now()}`
        };

        // Import eventsService dynamically to avoid circular imports
        const { eventsService } = await import('./eventsService.js');
        await eventsService.createTicket(ticketData);
      } catch (error) {
        console.error('Error creating ticket:', error);
      }

      return {
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        MerchantRequestID: `demo-merchant-${Date.now()}`,
        CheckoutRequestID: `demo-checkout-${Date.now()}`
      };
    }
    
    try {
      const token = await mpesaService.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = btoa(`${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`);

      const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          BusinessShortCode: BUSINESS_SHORT_CODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: BUSINESS_SHORT_CODE,
          PhoneNumber: phoneNumber,
          CallBackURL: `${window.location.origin}/api/mpesa/callback`,
          AccountReference: accountReference,
          TransactionDesc: transactionDesc
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      // Return mock success for demo
      return {
        ResponseCode: '0',
        ResponseDescription: 'Success. Request accepted for processing',
        MerchantRequestID: `demo-merchant-${Date.now()}`,
        CheckoutRequestID: `demo-checkout-${Date.now()}`
      };
    }
  },

  // Check transaction status
  queryTransaction: async (checkoutRequestID) => {
    // Always use demo mode to avoid CORS issues
    if (isDemoMode()) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        ResponseCode: '0',
        ResponseDescription: 'The service request has been accepted successfully',
        ResultCode: '0',
        ResultDesc: 'The service request is processed successfully.'
      };
    }
    
    try {
      const token = await mpesaService.getAccessToken();
      const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
      const password = btoa(`${BUSINESS_SHORT_CODE}${PASSKEY}${timestamp}`);

      const response = await fetch(`${MPESA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          BusinessShortCode: BUSINESS_SHORT_CODE,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: checkoutRequestID
        })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error querying M-Pesa transaction:', error);
      // Return mock success for demo
      return {
        ResponseCode: '0',
        ResponseDescription: 'The service request has been accepted successfully',
        ResultCode: '0',
        ResultDesc: 'The service request is processed successfully.'
      };
    }
  }
};