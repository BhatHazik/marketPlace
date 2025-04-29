import { io } from 'socket.io-client';
import BASE_URL from '../config/url.config';

let socket = null;

// Maintain a global cache of user statuses
let userStatuses = {};

// Create a map of status listeners
const statusListeners = new Map();

const connectSocket = (token) => {
  if (!socket) {
    socket = io(`${BASE_URL}?token=${token}`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5
    });
    
    // Set up global listeners as soon as the socket is created
    setupGlobalListeners();
  }
  return socket;
};

// Set up global listeners that persist throughout the app
const setupGlobalListeners = () => {
  if (!socket) return;
  
  // Global user status change listener
  socket.off('user_status_change'); // Remove any existing listener first
  socket.on('user_status_change', (statusData) => {
    console.log('Global user status change received:', statusData);
    
    if (statusData && statusData.userId) {
      // Update our global cache of user statuses
      userStatuses[statusData.userId] = {
        isOnline: statusData.isOnline,
        lastSeen: statusData.lastSeen
      };
      
      // Notify all listeners of this update
      notifyStatusListeners(statusData);
    }
  });
};

// Notify all registered status listeners
const notifyStatusListeners = (statusData) => {
  statusListeners.forEach((callback) => {
    try {
      callback(statusData);
    } catch (err) {
      console.error('Error notifying status listener:', err);
    }
  });
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

const onPrivateMessage = (callback) => {
  if (socket) {
    // First remove any existing listeners to prevent duplicates
    socket.off('private_message');
    
    // Then add the new listener
    socket.on('private_message', (messageData) => {
      console.log('Socket service received private_message:', messageData);
      callback(messageData);
    });
  } else {
    console.error('Cannot register private_message listener: socket not connected');
  }
};

// Listener for message sent status updates
const onMessageSent = (callback) => {
  if (socket) {
    console.log('Registering message_sent listener');
    socket.on('message_sent', (messageData) => {
      console.log('Message sent status received:', messageData);
      callback(messageData);
    });
  } else {
    console.error('Cannot register message_sent listener: socket not connected');
  }
};

// Listener for message delivered status updates
const onMessageDelivered = (callback) => {
  if (socket) {
    console.log('Registering message_delivered listener');
    socket.on('message_delivered', (deliveryData) => {
      console.log('Message delivery status received:', deliveryData);
      callback(deliveryData);
    });
  } else {
    console.error('Cannot register message_delivered listener: socket not connected');
  }
};

// Listener for message seen status updates
const onMessageSeen = (callback) => {
  if (socket) {
    console.log('Registering message_seen listener');
    // Use both potential event names to ensure compatibility
    socket.on('message_seen', (seenData) => {
      console.log('Message seen status received from message_seen event:', seenData);
      callback(seenData);
    });
    
    // Also listen for alternate event name that might be used by backend
    socket.on('seen_message', (seenData) => {
      console.log('Message seen status received from seen_message event:', seenData);
      callback(seenData);
    });
  } else {
    console.error('Cannot register message_seen listener: socket not connected');
  }
};

const emitPrivateMessage = (message) => {
  if (socket) {
    console.log('Emitting message to socket server:', message);
    
    // Create socket message data with required fields
    const socketData = {
      receiverId: message.receiverId,
      content: message.content || '' // Ensure content is never undefined or null
    };
    
    // Log content for debugging
    console.log('Content being sent:', {
      original: message.content,
      processed: socketData.content,
      type: typeof socketData.content
    });
    
    // Include media properties if they exist
    if (message.mediaUrl) {
      socketData.mediaUrl = message.mediaUrl;
    }
    
    if (message.mediaType) {
      socketData.mediaType = message.mediaType;
    }
    
    console.log('Final socket data being emitted:', socketData);
    
    socket.emit('private_message', socketData, (response) => {
      // This is the acknowledgement callback that will fire when server acknowledges the message
      console.log('Socket server acknowledged message:', response);
      return response; // Return response for handling elsewhere if needed
    });
  } else {
    console.error('Socket not connected, cannot emit message');
  }
};

// Emitter for message seen status
const emitMessageSeen = (messageId) => {
  if (socket) {
    try {
      console.log('Emitting message_seen for messageId:', messageId);
      
      // Try both event names to ensure compatibility
      // First try with message_seen event name
      socket.emit('message_seen', { messageId }, (response) => {
        console.log('Socket server acknowledged message_seen:', response);
      });
      
      // Also try with alternate event name that might be used by backend
      socket.emit('seen_message', { messageId }, (response) => {
        console.log('Socket server acknowledged seen_message:', response);
      });
      
      // For additional compatibility, also try with a chatId field
      if (messageId) {
        socket.emit('message_seen', { messageId, messageID: messageId }, (response) => {
          console.log('Socket server acknowledged message_seen with messageID field:', response);
        });
      }
    } catch (error) {
      console.error('Error emitting message_seen:', error);
    }
  } else {
    console.error('Socket not connected, cannot emit message_seen');
  }
};

// Register a component to receive user status updates
const onUserStatusChange = (callback, listenerId = null) => {
  // Generate a unique ID for this listener if not provided
  const id = listenerId || `listener_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  // Store the callback in our listeners map
  statusListeners.set(id, callback);
  
  console.log(`Registered status listener with ID: ${id}, total listeners: ${statusListeners.size}`);
  
  // Return the ID so the component can remove this listener later
  return id;
};

// Remove a specific user status listener
const offUserStatusChange = (listenerId) => {
  if (statusListeners.has(listenerId)) {
    statusListeners.delete(listenerId);
    console.log(`Removed status listener with ID: ${listenerId}, remaining listeners: ${statusListeners.size}`);
    return true;
  }
  return false;
};

// Get the current status of a specific user
const getUserStatus = (userId) => {
  return userStatuses[userId] || { isOnline: false, lastSeen: null };
};

// Get all user statuses
const getAllUserStatuses = () => {
  return { ...userStatuses };
};

// Listener for typing status updates
const onTypingStatus = (callback) => {
  if (socket) {
    console.log('Registering typing_status listener');
    socket.on('typing_status', (typingData) => {
      console.log('Typing status received:', typingData);
      callback(typingData);
    });
  } else {
    console.error('Cannot register typing_status listener: socket not connected');
  }
};

// Emitter for typing status
const emitTypingStatus = (receiverId, isTyping) => {
  if (socket) {
    try {
      console.log(`Emitting typing_status: ${isTyping ? 'typing' : 'stopped typing'} to user ${receiverId}`);
      socket.emit('typing_status', { receiverId, isTyping }, (response) => {
        console.log('Socket server acknowledged typing_status:', response);
      });
    } catch (error) {
      console.error('Error emitting typing_status:', error);
    }
  } else {
    console.error('Socket not connected, cannot emit typing_status');
  }
};

// Get the current socket instance (or null if not connected)
const getSocket = () => {
  return socket;
};

// Export as a single object to maintain compatibility with existing code
export const SocketService = {
  connectSocket,
  disconnectSocket,
  onPrivateMessage,
  onMessageSent,
  onMessageDelivered,
  onMessageSeen,
  emitPrivateMessage,
  emitMessageSeen,
  onUserStatusChange,
  offUserStatusChange,
  getUserStatus,
  getAllUserStatuses,
  onTypingStatus,
  emitTypingStatus,
  getSocket,
  isConnected: () => socket !== null && socket.connected
};
