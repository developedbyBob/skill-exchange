import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    console.log('SocketContext useEffect - User:', user?.id);
    
    if (user) {
      const token = localStorage.getItem('token');
      const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';
      
      console.log('Initializing socket connection to:', socketUrl);
      console.log('Token available:', !!token);

      const newSocket = io(socketUrl, {
        auth: {
          token: `Bearer ${token}`
        },
        path: '/socket.io/',
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Log all socket events for debugging
      newSocket.onAny((event, ...args) => {
        console.log('Socket Event:', event, args);
      });

      newSocket.on('connect', () => {
        console.log('Socket Connected - ID:', newSocket.id);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket Connection Error:', error.message);
      });

      newSocket.on('error', (error) => {
        console.error('Socket Error:', error);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket Disconnected:', reason);
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log('Socket Reconnected after', attemptNumber, 'attempts');
      });

      newSocket.on('reconnect_attempt', (attemptNumber) => {
        console.log('Socket Reconnection Attempt:', attemptNumber);
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('Socket Reconnection Error:', error);
      });

      newSocket.on('reconnect_failed', () => {
        console.error('Socket Reconnection Failed');
      });

      setSocket(newSocket);

      return () => {
        console.log('Cleaning up socket connection');
        if (newSocket) {
          newSocket.disconnect();
        }
      };
    } else {
      console.log('No user available - Socket not initialized');
    }
  }, [user]);

  // Log socket state changes
  useEffect(() => {
    if (socket) {
      console.log('Socket State Updated:', {
        id: socket.id,
        connected: socket.connected,
        disconnected: socket.disconnected
      });
    }
  }, [socket]);

  const value = {
    socket,
    connected: socket?.connected || false
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket deve ser usado dentro de um SocketProvider');
  }
  return context;
};