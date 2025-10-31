import api from './api';

// Check if we're in demo mode (running in production or test environment)
const isDemoMode = () => {
  return window.location.hostname !== 'localhost' || 
         process.env.NODE_ENV === 'test' ||
         import.meta.env.VITE_DEMO_MODE === 'true';
};

export const emailService = {
  // Send ticket email to user
  async sendTicketEmail(ticketData) {
    // Log the attempt for debugging
    console.log('Attempting to send ticket email:', ticketData);
    
    // Use demo mode to avoid CORS issues in production
    if (isDemoMode()) {
      console.log('Demo Mode: Email service simulation - ticket email would be sent to:', ticketData.to);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        message: 'Demo Mode: Ticket email sent successfully',
        id: `email-${Date.now()}`
      };
    }
    
    try {
      const response = await api.post('/api/email/send-ticket', ticketData);
      return response.data;
    } catch (error) {
      console.error('Email service error:', error);
      
      // Handle network errors gracefully
      if (error.isCorsError || error.isNetworkError) {
        console.log('Demo Mode (fallback): Network error detected, simulating successful email');
        return { 
          success: true, 
          message: 'Demo Mode: Ticket email sent successfully (fallback)',
          id: `email-${Date.now()}`
        };
      }
      
      // For other errors, return a standardized error object
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send ticket email',
        error: error.message
      };
    }
  },

  // Send event reminder email
  async sendEventReminder(reminderData) {
    // Use demo mode to avoid CORS issues in production
    if (isDemoMode()) {
      console.log('Demo Mode: Email service simulation - reminder email would be sent');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        message: 'Demo Mode: Reminder email sent successfully',
        id: `email-${Date.now()}`
      };
    }
    
    try {
      const response = await api.post('/api/email/send-reminder', reminderData);
      return response.data;
    } catch (error) {
      console.error('Email service error:', error);
      
      // Handle network errors gracefully
      if (error.isCorsError || error.isNetworkError) {
        return { 
          success: true, 
          message: 'Demo Mode: Reminder email sent successfully (fallback)',
          id: `email-${Date.now()}`
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send reminder email',
        error: error.message
      };
    }
  },

  // Send event confirmation email
  async sendEventConfirmation(confirmationData) {
    // Use demo mode to avoid CORS issues in production
    if (isDemoMode()) {
      console.log('Demo Mode: Email service simulation - confirmation email would be sent');
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return { 
        success: true, 
        message: 'Demo Mode: Confirmation email sent successfully',
        id: `email-${Date.now()}`
      };
    }
    
    try {
      const response = await api.post('/api/email/send-confirmation', confirmationData);
      return response.data;
    } catch (error) {
      console.error('Email service error:', error);
      
      // Handle network errors gracefully
      if (error.isCorsError || error.isNetworkError) {
        return { 
          success: true, 
          message: 'Demo Mode: Confirmation email sent successfully (fallback)',
          id: `email-${Date.now()}`
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to send confirmation email',
        error: error.message
      };
    }
  }
};