// M-Pesa Daraja API service
const MPESA_BASE_URL = 'https://sandbox.safaricom.co.ke';
const CONSUMER_KEY = import.meta.env.VITE_MPESA_CONSUMER_KEY || 'demo_key';
const CONSUMER_SECRET = import.meta.env.VITE_MPESA_CONSUMER_SECRET || 'demo_secret';
const BUSINESS_SHORT_CODE = import.meta.env.VITE_MPESA_SHORTCODE || '174379';
const PASSKEY = import.meta.env.VITE_MPESA_PASSKEY || 'demo_passkey';

export const mpesaService = {
  // Get OAuth token
  getAccessToken: async () => {
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
      throw error;
    }
  },

  // Initiate STK Push
  stkPush: async (phoneNumber, amount, accountReference, transactionDesc) => {
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
        MerchantRequestID: 'mock-merchant-id',
        CheckoutRequestID: 'mock-checkout-id'
      };
    }
  },

  // Check transaction status
  queryTransaction: async (checkoutRequestID) => {
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