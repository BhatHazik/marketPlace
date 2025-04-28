import { io } from 'socket.io-client';
import BASE_URL from '../config/url.config';

let socket = null;

const connectSocket = (token) => {
  if (!socket) {
    socket = io(`${BASE_URL}?token=${token}`, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5
    });
  }
  return socket;
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
  isConnected: () => socket !== null && socket.connected
};
