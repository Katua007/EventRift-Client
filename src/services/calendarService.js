export const calendarService = {
  // Add event to user's calendar
  async addEventToCalendar(eventData) {
    try {
      // Create calendar event data
      const calendarEvent = {
        title: eventData.title,
        start: new Date(`${eventData.date}T${eventData.start_time || '00:00'}`),
        end: new Date(`${eventData.date}T${eventData.end_time || '23:59'}`),
        location: eventData.location,
        description: eventData.description,
        url: window.location.origin + `/events/${eventData.id}`
      };

      // Generate calendar file content
      const icsContent = this.generateICSFile(calendarEvent);
      
      // Download ICS file
      const blob = new Blob([icsContent], { type: 'text/calendar' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${eventData.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, message: 'Event added to calendar' };
    } catch {
      throw { message: 'Failed to add event to calendar' };
    }
  },

  // Generate ICS file content
  generateICSFile(event) {
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//EventRift//EventRift Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@eventrift.com`,
      `DTSTART:${formatDate(event.start)}`,
      `DTEND:${formatDate(event.end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `LOCATION:${event.location || ''}`,
      `URL:${event.url || ''}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Event reminder',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
  },

  // Add to Google Calendar (alternative method)
  addToGoogleCalendar(eventData) {
    const startDate = new Date(`${eventData.date}T${eventData.start_time || '00:00'}`);
    const endDate = new Date(`${eventData.date}T${eventData.end_time || '23:59'}`);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventData.title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(eventData.description || '')}&location=${encodeURIComponent(eventData.location || '')}`;
    
    window.open(googleCalendarUrl, '_blank');
  }
};