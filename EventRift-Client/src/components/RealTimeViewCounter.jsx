import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// IMPORTANT: Replace with the deployed URL or the local development URL of your Flask backend
// e.g., "https://eventrift-backend.railway.app" or "http://localhost:5555"
const SOCKET_SERVER_URL = "http://localhost:5555"; 

const RealTimeViewCounter = ({ eventId }) => {
  const [viewCount, setViewCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    // 1. Establish connection
    const socket = io(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      setIsConnected(true);
      console.log(`Socket connected. Joining room: event_${eventId}`);
      
      // 2. Join the specific room using the BE event name 'join_event_room'
      // This allows the BE to send updates only to clients viewing this specific event.
      socket.emit('join_event_room', { event_id: eventId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected.');
    });

    // 3. Listen for real-time view count updates
    socket.on('view_count', (data) => {
      console.log(`Received new view count for ${eventId}: ${data.count}`);
      setViewCount(data.count);
    });

    // 4. Cleanup function: runs when the component unmounts or before re-running useEffect
    return () => {
      // Send a signal to the BE that the client is leaving the room (optional but good practice)
      // socket.emit('leave_event_room', { event_id: eventId }); 
      socket.disconnect();
    };
  }, [eventId]); // Dependency array ensures effect runs only when eventId changes

  return (
    <div className="flex items-center text-gray-400 text-sm mt-2">
        <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: isConnected ? '#10B981' : '#F87171' }}></span>
        {/* Placeholder for real-time icon */}
        <span className="font-semibold text-er-primary mr-1">LIVE:</span>
        <span className="font-bold text-lg text-white">{viewCount.toLocaleString()}</span>
        <span className="ml-1">Viewers</span>
    </div>
  );
};

export default RealTimeViewCounter;