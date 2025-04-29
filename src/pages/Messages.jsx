import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Tabs, Tab, Input, Avatar, Card, CardBody, Button, 
  Divider, Badge, Dropdown, DropdownTrigger, DropdownMenu, 
  DropdownItem, ScrollShadow, Skeleton, Progress, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Chip
} from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, faPaperPlane, faEllipsisV, faImage, 
  faVideo, faFile, faMicrophone, faSmile, faChevronLeft,
  faTimes, faDownload, faExclamationTriangle, faPlay, faX,
  faArrowLeft, faExpand, faCompress, faTimes as faClose, faChevronRight, faChevronLeft as faChevronLeftIcon,
  faCircleXmark,
  faCircle,
  faCheckDouble,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import UseApi from '../hooks/UseAPI';
import { SocketService } from '../services/socket.service';
import { toast } from 'react-toastify';
import axios from 'axios';
import BASE_URL from '../config/url.config';


// Placeholder default avatar for users without avatars
const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';

// Helper functions for working with chat messages
const formatChatMessages = (messages, currentUserId) => {
  return messages.map(message => {
    // Get the current user ID as a string for comparison
    const currentUserIdStr = String(currentUserId);
    
    // Check if this message was sent by the current user (me)
    const isSentByMe = String(message.senderId) === currentUserIdStr;
    
    // Add debug info for message direction
    console.log(`Message ID ${message.id}:`, {
      senderId: message.senderId,
      senderIdType: typeof message.senderId,
      currentUserId: currentUserIdStr,
      currentUserIdType: typeof currentUserIdStr,
      isSentByMe: isSentByMe,
      compare: `${String(message.senderId)} === ${currentUserIdStr}`,
      deliveryStatus: {
        isSent: message.isSent,
        isDelivered: message.isDelivered,
        isSeen: message.isSeen
      }
    });
    
    // Create the base message object
    const formattedMessage = {
      id: message.id,
      sender: isSentByMe ? 'me' : 'them',
      text: message.content,
      timestamp: new Date(message.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      // Store raw timestamp for sequential message grouping
      rawSentAt: message.sentAt,
      // Pass all status flags for proper display in UI
      isSent: message.isSent,
      isDelivered: message.isDelivered,
      isSeen: message.isSeen,
      avatar: DEFAULT_AVATAR,
      senderName: isSentByMe ? null : message.sender?.profile?.name
    };
    
    // Check if message has media content
    if (message.mediaUrl) {
      console.log('API message has media:', {
        mediaUrl: message.mediaUrl,
        mediaType: message.mediaType
      });
      
      // Store the original mediaUrl and mediaType properties
      formattedMessage.mediaUrl = message.mediaUrl;
      formattedMessage.mediaType = message.mediaType || 'image/jpeg';
      
      // Prepare media for UI rendering
      const mediaType = formattedMessage.mediaType.split('/')[0]; // 'image', 'video', etc.
      const fullUrl = message.mediaUrl.startsWith('http') ? 
        message.mediaUrl : 
        `${BASE_URL}${message.mediaUrl}`;
      
      // Create media array for UI rendering
      formattedMessage.media = [{
        type: mediaType,
        url: fullUrl,
        mediaType: formattedMessage.mediaType
      }];
    }
    
    return formattedMessage;
  });
};

// Message skeleton for loading state
const MessageSkeletons = () => {
  return (
    <>
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'} mb-4`}>
          <div className={`flex ${i % 2 === 0 ? 'flex-row-reverse' : 'flex-row'} items-end`}>
            {i % 2 !== 0 && (
              <Skeleton className="h-8 w-8 rounded-full mb-2 mr-2" />
            )}
            <div>
              <Skeleton className={`h-10 w-48 rounded-2xl ${i % 2 === 0 ? 'rounded-br-sm' : 'rounded-bl-sm'}`} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

// Function to process messages and group sequential images
const groupSequentialImages = (messages) => {
  if (!messages || messages.length === 0) return [];
  
  const groupedMessages = [];
  let currentImageGroup = null;
  let currentSender = null;
  
  // Debug log to help identify why some images aren't grouping
  console.log('Starting image grouping process for', messages.length, 'messages');
  
  // First, we'll ensure all messages have the necessary properties
  const normalizedMessages = messages.map(msg => {
    // Some messages might be missing rawSentAt
    if (!msg.rawSentAt && msg.timestamp) {
      // Handle case where rawSentAt is missing but we have timestamp
      console.log('Message missing rawSentAt, using timestamp:', msg.id);
      const parsed = new Date();
      try {
        // Try to parse from timestamp, or use current date
        parsed.setHours(
          parseInt(msg.timestamp.split(':')[0]), 
          parseInt(msg.timestamp.split(':')[1])
        );
      } catch (e) {
        console.error('Error parsing timestamp:', e);
      }
      return {
        ...msg,
        rawSentAt: parsed.toISOString()
      };
    }
    return msg;
  });
  
  // Sort messages by timestamp to ensure proper sequential grouping
  normalizedMessages.sort((a, b) => {
    const timeA = new Date(a.rawSentAt || 0).getTime();
    const timeB = new Date(b.rawSentAt || 0).getTime();
    return timeA - timeB;
  });
  
  // Process each message to find sequences of images
  normalizedMessages.forEach((message, index) => {
    // Skip messages that are already grouped (from previous runs)
    if (message.isImageGroup) {
      groupedMessages.push(message);
      return;
    }
    
    // Check if this is an image message
    const isImageMessage = message.media && 
                          message.media.some(item => 
                            item.type === 'image' || 
                            item.mediaType?.startsWith('image/'));
    
    console.log(`Message ${message.id} - Is image message: ${isImageMessage}`, 
                message.media ? message.media.map(m => m.type || m.mediaType) : 'no media');
    
    // Determine if we should start a new group or add to existing
    if (isImageMessage) {
      // If we don't have a group yet or this is from a different sender, start a new group
      if (!currentImageGroup || currentSender !== message.sender) {
        // If we have an existing group, add it to the results
        if (currentImageGroup) {
          console.log('Finishing image group with', currentImageGroup.media.length, 'images');
          groupedMessages.push(currentImageGroup);
        }
        
        // Start a new image group
        console.log('Starting new image group from message', message.id);
        currentImageGroup = {
          id: `img-group-${Date.now()}-${message.id}`,
          sender: message.sender,
          timestamp: message.timestamp,
          isSent: message.isSent,
          isDelivered: message.isDelivered,
          isSeen: message.isSeen,
          avatar: message.avatar,
          senderName: message.senderName,
          text: '', // No text for image groups
          isImageGroup: true,
          media: [...message.media], // Start with media from this message
          sentAt: message.rawSentAt, // Keep the raw timestamp for sorting
          rawSentAt: message.rawSentAt
        };
        currentSender = message.sender;
      } else {
        // Add to the existing group if from same sender and sequential
        // More lenient grouping - consider all sequential image messages from same sender as a group
        // regardless of time difference, unless separated by text
        
        console.log('Adding to existing image group from message', message.id);
        // Add media from this message to the group
        currentImageGroup.media.push(...message.media);
        
        // Update timestamp to most recent message
        if (!message.rawSentAt) {
          console.warn('Message has no rawSentAt:', message.id);
        } else if (!currentImageGroup.rawSentAt) {
          console.warn('Current group has no rawSentAt');
          currentImageGroup.timestamp = message.timestamp;
          currentImageGroup.rawSentAt = message.rawSentAt;
        } else if (new Date(message.rawSentAt) > new Date(currentImageGroup.rawSentAt)) {
          currentImageGroup.timestamp = message.timestamp;
          currentImageGroup.rawSentAt = message.rawSentAt;
        }
      }
    } else {
      // This is not an image message
      console.log('Non-image message:', message.id, message.text?.substring(0, 20));
      
      // If we have an existing image group, add it to results before this message
      if (currentImageGroup) {
        console.log('Finishing image group before non-image message');
        groupedMessages.push(currentImageGroup);
        currentImageGroup = null;
      }
      
      // Add the non-image message
      groupedMessages.push(message);
      currentSender = message.sender;
    }
  });
  
  // Add the last image group if there is one
  if (currentImageGroup) {
    console.log('Adding final image group with', currentImageGroup.media.length, 'images');
    groupedMessages.push(currentImageGroup);
  }
  
  console.log('Finished grouping. Original:', messages.length, 'After grouping:', groupedMessages.length);
  return groupedMessages;
};

// Custom Image Gallery component for message media with improved grid layout
const ImageGallery = ({ images, onImageClick }) => {
  // Make sure we have valid image objects in the array
  const validImages = images.filter(img => img && img.url);
  
  // Limit visible images to 4, but keep track of all images for the gallery
  const visibleImages = validImages.slice(0, 4);
  const remainingCount = validImages.length > 4 ? validImages.length - 4 : 0;
  
  // Determine the optimal grid layout based on number of images
  const getGridClass = () => {
    if (validImages.length === 1) return 'grid-cols-1';
    if (validImages.length === 2) return 'grid-cols-2';
    if (validImages.length === 3) return 'grid-cols-2';
    return 'grid-cols-2'; // 4 or more images
  };
  
  // Get the optimal size class for each image
  const getImageSizeClass = (index) => {
    if (validImages.length === 1) return 'max-h-64 min-h-[250px] w-full';
    if (validImages.length === 2) return 'h-48 w-full';
    if (validImages.length === 3) {
      // First image gets larger treatment in a 3-image layout
      return index === 0 ? 'h-48 w-full' : 'h-36 w-full'; 
    }
    return 'h-32 w-full'; // 4 or more images get smaller thumbnails
  };
  
  const handleImageClick = (index) => {
    // Ensure we pass the full array of images, not just the visible ones
    onImageClick(validImages, index);
  };
  
  return (
    <div className={`grid gap-1 mb-2 ${getGridClass()}`}>
      {visibleImages.map((image, index) => (
        <div 
          key={`gallery-image-${index}-${image.url}`} 
          className={`relative rounded-lg overflow-hidden cursor-pointer transition-transform hover:opacity-95 hover:scale-[0.99]
            ${validImages.length === 3 && index === 0 ? 'col-span-2' : ''}`}
          onClick={() => handleImageClick(index)}
        >
          <img 
            src={image.url} 
            alt={`Gallery image ${index + 1}`} 
            className={`object-cover ${getImageSizeClass(index)}`}
            loading="lazy"
          />
          
          {/* Overlay for the 4th image when there are more images */}
          {index === 3 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-all hover:bg-opacity-60">
              <span className="text-white text-xl font-bold">+{remainingCount}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Image Modal for full-screen gallery view with enhanced carousel functionality
const ImageModal = ({ isOpen, images, currentIndex, onClose, onNext, onPrev, onToggleFullscreen, isFullscreen }) => {
  if (!isOpen || !images || images.length === 0) return null;
  
  // Local state for touch/swipe handling
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const swipeThreshold = 50; // Minimum distance to trigger a swipe
  
  // Refs for carousel items
  const carouselRef = useRef(null);
  const slideRefs = useRef([]);
  
  // Set up slide refs
  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, images.length);
  }, [images]);
  
  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };
  
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    
    // Minimum swipe distance threshold
    if (Math.abs(distance) > swipeThreshold) {
      if (distance > 0) {
        // Swipe left, go to next
        onNext();
      } else {
        // Swipe right, go to previous
        onPrev();
      }
    }
    
    // Reset
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // Mouse drag handlers for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragOffset(0);
    e.preventDefault();
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const offset = e.clientX - dragStartX;
    setDragOffset(offset);
    e.preventDefault();
  };
  
  const handleMouseUp = (e) => {
    if (!isDragging) return;
    
    if (Math.abs(dragOffset) > swipeThreshold) {
      if (dragOffset < 0) {
        // Dragged left, go to next
        onNext(e);
      } else {
        // Dragged right, go to previous
        onPrev(e);
      }
    }
    
    setIsDragging(false);
    setDragOffset(0);
    e.preventDefault();
  };
  
  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          onPrev(e);
          break;
        case 'ArrowRight':
          onNext(e);
          break;
        case 'Escape':
          onClose(e);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onNext, onPrev, onClose]);
  
  // Animation settings for smooth transitions
  const modalAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 }
  };
  
  // Image slide animation with swipe effect
  const imageAnimation = {
    initial: { opacity: 0, x: 100 * (currentIndex > 0 ? 1 : -1) },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 * (currentIndex > 0 ? 1 : -1) },
    transition: { type: "spring", stiffness: 300, damping: 30 }
  };
  
  // Calculate thumbnail positions
  const generateThumbnails = () => {
    if (!images || images.length <= 1) return null;
    
    return (
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex gap-2 px-4 py-2 bg-black bg-opacity-50 rounded-full">
          {images.map((img, idx) => (
            <button 
              key={idx}
              className={`h-2 rounded-full transition-all ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-gray-400'}`}
              onClick={(e) => {
                e.stopPropagation();
                onNext(e, idx);
              }}
              aria-label={`View image ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95"
      onClick={onClose}
      {...modalAnimation}
    >
      {/* Gallery controls */}
      <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 z-10">
        <Button 
          isIconOnly 
          variant="light" 
          className="text-white"
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          <FontAwesomeIcon icon={faX} />
        </Button>
        
        <div>
          <span className="text-white mr-4">{currentIndex + 1}/{images.length}</span>
          <Button 
            isIconOnly 
            variant="light" 
            className="text-white"
            onClick={(e) => { e.stopPropagation(); onToggleFullscreen(); }}
          >
            <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
          </Button>
        </div>
      </div>
      
      {/* Carousel container with touch/mouse handlers */}
      <div 
        ref={carouselRef}
        className="absolute inset-0 flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous button */}
        {images.length > 1 && (
          <Button 
            isIconOnly 
            variant="light" 
            className="absolute left-4 z-10 text-white hover:bg-black hover:bg-opacity-30"
            onClick={(e) => { e.stopPropagation(); onPrev(e); }}
          >
            <FontAwesomeIcon icon={faChevronLeftIcon} size="lg" />
          </Button>
        )}
        
        {/* Current image with animation */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={`image-${currentIndex}`}
            className="relative max-w-[90%] max-h-[80%] flex items-center justify-center"
            style={isDragging ? { transform: `translateX(${dragOffset}px)` } : undefined}
            {...imageAnimation}
          >
            <img 
              ref={el => (slideRefs.current[currentIndex] = el)}
              src={images[currentIndex].url} 
              alt={`Gallery image ${currentIndex + 1}`} 
              className={`max-h-[80vh] max-w-full object-contain rounded-lg ${isFullscreen ? 'h-screen w-screen object-contain' : ''}`}
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Next button */}
        {images.length > 1 && (
          <Button 
            isIconOnly 
            variant="light" 
            className="absolute right-4 z-10 text-white hover:bg-black hover:bg-opacity-30"
            onClick={(e) => { e.stopPropagation(); onNext(e); }}
          >
            <FontAwesomeIcon icon={faChevronRight} size="lg" />
          </Button>
        )}
      </div>
      
      {/* Thumbnail indicators */}
      {generateThumbnails()}
    </motion.div>
  );
};

const Messages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(id || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showMobileChat, setShowMobileChat] = useState(!!id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatData, setChatData] = useState([]);
  const [isFetchingChats, setIsFetchingChats] = useState(false);
  const [chatsFetchError, setChatsFetchError] = useState(null);
  const { requestAPI } = UseApi();
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('userId') || '1');
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  
  // Image gallery state
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  
  // Media upload states
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [currentUploads, setCurrentUploads] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  // User status tracking
  const [userStatuses, setUserStatuses] = useState({});
  
  // Typing status tracking
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});
  const typingTimeoutRef = useRef(null);
  
  const fileInputRef = useRef(null);
  
  // Debug log for current user ID
  useEffect(() => {
    console.log('Current User ID from localStorage:', currentUserId);
  }, [currentUserId]);
  
  // Utility function to format last seen time nicely
  const formatLastSeen = (lastSeenTime) => {
    if (!lastSeenTime) return 'Unknown';
    
    const lastSeen = new Date(lastSeenTime);
    const now = new Date();
    const diffInSeconds = Math.floor((now - lastSeen) / 1000);
    
    // If less than a minute ago
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    // If less than an hour ago
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // If less than a day ago
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    // If within the past week
    if (diffInSeconds < 604800) { // 7 days
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    
    // Otherwise show the date and time
    return lastSeen.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Utility function to format timestamps for the chat list
  const formatTimeAgo = (date) => {
    if (!date) return '';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today
    if (date >= today) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Check if date was yesterday
    if (date >= yesterday && date < today) {
      return 'Yesterday';
    }
    
    // Check if date is within the last week
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 6);
    if (date >= lastWeek) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise return the date
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };
  
  // Debug to check socket connection status
  useEffect(() => {
    const interval = setInterval(() => {
      if (socket) {
        console.log('Socket connection status:', socket.connected ? 'Connected' : 'Disconnected');
      }
    }, 10000); // Log every 10 seconds
    
    return () => clearInterval(interval);
  }, [socket]);
  
  // Reference to the messages container for auto-scrolling
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of messages
  const scrollToBottom = (behavior = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior, block: 'end' });
  };



    
  // Debug logs
  useEffect(() => {
    console.log('States:', {
      id,
      selectedChat,
      isMobile,
      showMobileChat,
      messageCount: messages.length
    });
  }, [id, selectedChat, isMobile, showMobileChat, messages]);
  
  // Keyboard navigation for image gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!galleryOpen) return;
      
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          setCurrentImageIndex((prevIndex) => 
            prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
          );
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setCurrentImageIndex((prevIndex) => 
            prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
          );
          break;
        case 'Escape':
          e.preventDefault();
          setGalleryOpen(false);
          break;
        case 'f':
          e.preventDefault();
          setFullscreenMode(!fullscreenMode);
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryOpen, galleryImages, currentImageIndex, fullscreenMode]);

  // Get reference to the existing socket when component mounts
  // and monitor connection status
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Instead of creating a new connection, get reference to the existing one
      // that was created in App.jsx
      const existingSocket = SocketService.getSocket();
      
      if (existingSocket) {
        setSocket(existingSocket);
        setSocketConnected(existingSocket.connected);
        console.log('Using existing socket connection with user ID:', currentUserId, 'Connection status:', existingSocket.connected);
        
        // Monitor socket connection status
        const handleConnect = () => {
          console.log('Socket connected event fired');
          setSocketConnected(true);
        };
        
        const handleDisconnect = () => {
          console.log('Socket disconnected event fired');
          setSocketConnected(false);
        };
        
        // Add connection status listeners
        existingSocket.on('connect', handleConnect);
        existingSocket.on('disconnect', handleDisconnect);
        
        // If socket is not connected, try to reconnect
        if (!existingSocket.connected) {
          console.log('Socket is not connected, attempting to reconnect...');
          existingSocket.connect();
        }
      } else {
        // If for some reason there's no existing connection, let's create one
        // This is just a fallback
        console.log('No existing socket found, creating one');
        const socketConnection = SocketService.connectSocket(token);
        setSocket(socketConnection);
        setSocketConnected(socketConnection.connected);
        
        // Monitor new socket connection status
        socketConnection.on('connect', () => {
          console.log('New socket connected');
          setSocketConnected(true);
        });
        
        socketConnection.on('disconnect', () => {
          console.log('New socket disconnected');
          setSocketConnected(false);
        });
      }
      
      // Don't disconnect on component unmount
      return () => {
        // Just clean up the reference and listeners in this component
        if (socket) {
          socket.off('connect');
          socket.off('disconnect');
        }
        setSocket(null);
        setSocketConnected(false);
        console.log('Component unmounted, socket reference released');
      };
    }
  }, [currentUserId]);
  
  // Function to update chat list when a new message is received
  const updateChatListWithNewMessage = (messageData) => {
    if (!messageData) return;
    
    // Check if this message is relevant to the current user
    const isRelevantToUser = (
      String(messageData.senderId) === String(currentUserId) ||
      String(messageData.receiverId) === String(currentUserId)
    );
    
    if (!isRelevantToUser) return;
    
    console.log('Updating chat list with new message:', messageData);
    
    // Find the chatId for this message
    const chatId = messageData.chatId?.toString();
    if (!chatId) return;
    
    // Update the chat list to move this chat to the top
    setChatData(prevChatData => {
      // Check if this chat already exists in our list
      const existingChatIndex = prevChatData.findIndex(chat => chat.id.toString() === chatId);
      
      // If the chat doesn't exist in our list, we'll have to fetch the full chat list again
      if (existingChatIndex === -1) {
        console.log('Chat not found in list, will need to refresh chat list');
        // Refresh the chat list in the background
        fetchChats();
        return prevChatData;
      }
      
      // Chat exists, update it and move it to the top
      const updatedChatList = [...prevChatData];
      const chatToUpdate = {...updatedChatList[existingChatIndex]};
      
      // Update the chat with the latest message
      chatToUpdate.lastMessage = {
        content: messageData.content,
        sentAt: messageData.sentAt || new Date().toISOString(),
        senderId: messageData.senderId,
        id: messageData.id,
        // Add media info to preview if available
        mediaUrl: messageData.mediaUrl,
        mediaType: messageData.mediaType
      };
      
      // Add unread flag if the message is not from the current user and not in the currently selected chat
      if (
        String(messageData.senderId) !== String(currentUserId) && 
        selectedChat !== chatId
      ) {
        chatToUpdate.hasUnread = true;
        chatToUpdate.unreadCount = (chatToUpdate.unreadCount || 0) + 1;
      }
      
      // Remove the chat from its current position
      updatedChatList.splice(existingChatIndex, 1);
      
      // Add it back at the top
      updatedChatList.unshift(chatToUpdate);
      
      console.log('Updated chat list with new order', updatedChatList);
      return updatedChatList;
    });
  };

  // Register for global user status updates
  useEffect(() => {
    // Get initial user statuses from the global cache
    const initialStatuses = SocketService.getAllUserStatuses();
    setUserStatuses(initialStatuses);
    
    // Register a listener for status updates
    const statusListenerId = SocketService.onUserStatusChange((statusData) => {
      console.log('User status change received in Messages component:', statusData);
      
      if (statusData && statusData.userId) {
        // Update local state with the new status data
        setUserStatuses(prevStatuses => ({
          ...prevStatuses,
          [statusData.userId]: {
            isOnline: statusData.isOnline,
            lastSeen: statusData.lastSeen
          }
        }));
        
        // If we have chat data loaded, also update the user in the chat list
        setChatData(prevChatData => {
          // Find if this user is in our chat list
          const updatedChatData = prevChatData.map(chat => {
            // Check if this chat's user matches the status update user ID
            if (chat.user && String(chat.user.id) === String(statusData.userId)) {
              // Update the user's online status and last seen time
              return {
                ...chat,
                user: {
                  ...chat.user,
                  isOnline: statusData.isOnline,
                  lastSeen: statusData.lastSeen
                }
              };
            }
            return chat;
          });
          
          return updatedChatData;
        });
      }
    });
    
    // Clean up function to remove our status listener when component unmounts
    return () => {
      SocketService.offUserStatusChange(statusListenerId);
    };
  }, []);

  // Filter chats based on search query
  const filteredChats = chatData.filter(chat => 
    chat.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get the selected chat data
  const currentChat = chatData.find(chat => chat.id.toString() === selectedChat);

  // Clean up typing timeout on unmount or chat change
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Reset typing status when changing chats
      if (isUserTyping && currentChat?.user?.id) {
        setIsUserTyping(false);
        SocketService.emitTypingStatus(currentChat.user.id, false);
      }
    };
  }, [selectedChat, isUserTyping, currentChat]);

  // Listen for socket events (other than user status)
  useEffect(() => {
    // Clean up function to remove previous listeners
    const cleanupSocketListeners = () => {
      console.log('Cleaning up socket event listeners');
      if (socket) {
        // Remove all existing listeners to prevent duplicates
        socket.off('private_message');
        socket.off('message_seen');
        socket.off('seen_message');
        socket.off('message_sent');
        socket.off('message_delivered');
        socket.off('typing_status');
      }
    };
    
    // Clean up any existing listeners before adding new ones
    cleanupSocketListeners();
    
    if (socketConnected && socket) {
      console.log(`Setting up socket listeners for chat ID: ${selectedChat}`);
      
      // Listen for message seen status updates
      SocketService.onMessageSeen((seenData) => {
        console.log('Message seen status update received in Messages component:', seenData);
        
        // Handle different possible payload formats from backend
        const messageId = seenData.messageId || seenData.messageID || seenData.id;
        
        if (selectedChat && messageId) {
          console.log('Processing seen update for message ID:', messageId);
          
          // Update the message seen status in the state
          setMessages(prevMessages => {
            // Try to find the message by its ID
            let found = false;
            
            // Convert message ID to string for comparison
            const messageIdStr = String(messageId);
            
            const updatedMessages = prevMessages.map(msg => {
              // Convert message ID to string and compare
              if (String(msg.id) === messageIdStr) {
                found = true;
                console.log(`Updating message ${msg.id} to seen status`);
                return {
                  ...msg,
                  isSent: true,              // Guarantee sent status
                  isDelivered: true,         // Guarantee delivered status
                  isSeen: true,              // Set to seen
                  seenAt: seenData.seenAt || new Date().toISOString(),
                  isNew: false               // Prevent re-animation
                };
              }
              return msg;
            });
            
            console.log(`Seen update ${found ? 'matched' : 'did not match'} an existing message: ID ${messageId}`);
            
            // If message not found, try logging all message IDs to help debugging
            if (!found) {
              console.log('Available message IDs:', prevMessages.map(m => m.id));
            }
            
            return updatedMessages;
          });
        }
      });
      
      // Listen for private messages
      SocketService.onPrivateMessage((messageData) => {
        console.log('Received message via socket:', messageData, 'Current user ID:', currentUserId);
        
        // Always update the chat list regardless of selected chat
        // This ensures new chats move to the top and show the latest message preview
        updateChatListWithNewMessage(messageData);
        
        // Only add the message if it's for the currently selected chat
        if (selectedChat && messageData) {
          // First, check if the message contains a specific chatId
          // If it does, this is the most reliable way to filter messages
          if (messageData.chatId) {
            // If the message has a chatId, strictly verify it matches the current chat
            const messageChatId = messageData.chatId.toString();
            const currentChatId = selectedChat.toString();
            
            console.log('Filtering message by CHAT ID:', {
              messageChatId,
              currentChatId,
              isMatchingChat: messageChatId === currentChatId
            });
            
            // If the chat IDs don't match, ignore this message completely
            if (messageChatId !== currentChatId) {
              console.log('Message rejected: belongs to a different chat ID');
              return; // Exit early, this message is for a different chat
            }
          } else {
            // No chatId available, fall back to user ID based filtering
            // Get the selected chat data
            const currentChatData = chatData.find(chat => chat.id.toString() === selectedChat);
            
            if (!currentChatData || !currentChatData.user) {
              console.log('Cannot determine chat relevance: chat data or user not found');
              return; // Exit if we can't determine relevance
            }
            
            // Make sure the message belongs specifically to this chat conversation
            // It must be between the current user and the selected chat partner
            const isChatRelevant = (
              // Sender must be the user we're chatting with AND receiver must be current user
              (messageData.senderId === currentChatData.user?.id && messageData.receiverId === currentUserId) || 
              // OR sender must be current user AND receiver must be the user we're chatting with
              (messageData.senderId === currentUserId && messageData.receiverId === currentChatData.user?.id)
            );
            
            // Log to help with debugging
            console.log('Fallback: Filtering message by USER IDs:', {
              messageData,
              currentUserId,
              currentChatUser: currentChatData.user?.id,
              isChatRelevant
            });
            
            // If not relevant to this chat by user IDs, ignore the message
            if (!isChatRelevant) {
              console.log('Message rejected: not relevant to current chat users');
              return; // Exit early
            }
          }
          
          // At this point, we've verified the message belongs to the current chat
          // Determine message direction 
          // For socket messages, we need to invert the logic compared to our API
          // Messages received via socket from other users should always be 'them' (left side)
          const isSentByMe = false; // Force incoming socket messages to appear from the left
          
          // Check if this message is from another user and we're actively viewing the chat
          const isFromOtherUser = String(messageData.senderId) !== String(currentUserId);
          
          // Get chat data for sender name
          const currentChatData = chatData.find(chat => chat.id.toString() === selectedChat);
          
          // Create formatted message object for display
          const formattedMessage = {
            id: messageData.id || `socket-${Date.now()}`,
            sender: isSentByMe ? 'me' : 'them',
            text: messageData.content,
            // Use the sent timestamp from the message data or current time
            rawSentAt: messageData.sentAt || new Date().toISOString(),
            timestamp: messageData.sentAt ? 
              new Date(messageData.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
              new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isSent: true,
            isDelivered: false,
            isSeen: false,
            avatar: DEFAULT_AVATAR,
            senderName: isSentByMe ? null : messageData.senderName || currentChatData.user?.name,
            isNew: true
          };
          
          // Check if incoming message has media content
          if (messageData.mediaUrl && messageData.mediaType) {
            console.log('Received message with media:', {
              mediaUrl: messageData.mediaUrl,
              mediaType: messageData.mediaType
            });
            
            // Add direct mediaUrl and mediaType properties for consistent handling
            formattedMessage.mediaUrl = messageData.mediaUrl;
            formattedMessage.mediaType = messageData.mediaType;
            
            // Create media array for UI rendering
            formattedMessage.media = [{
              type: messageData.mediaType.split('/')[0], // 'image', 'video', etc.
              url: messageData.mediaUrl.startsWith('http') ? 
                messageData.mediaUrl : 
                `${BASE_URL}${messageData.mediaUrl}`,
              mediaType: messageData.mediaType
            }];
          }
          
          // Add message to state and apply image grouping
          setMessages(prevMessages => {
            // Check if this message is already in the list
            const isDuplicate = prevMessages.some(msg => 
              msg.id === formattedMessage.id || 
              (msg.text === formattedMessage.text && 
               Math.abs(new Date(msg.timestamp) - new Date(formattedMessage.timestamp)) < 5000)
            );
            
            if (!isDuplicate) {
              // Add the new message to the list and ensure proper timestamp order
              const newMessageList = [...prevMessages, formattedMessage];
              
              // Sort messages by timestamp to ensure proper chronological order
              const sortedMessages = newMessageList.sort((a, b) => {
                const timeA = a.rawSentAt ? new Date(a.rawSentAt).getTime() : new Date(a.timestamp).getTime();
                const timeB = b.rawSentAt ? new Date(b.rawSentAt).getTime() : new Date(b.timestamp).getTime();
                return timeA - timeB;
              });
              
              // Apply the image grouping function to merge sequential images
              // This will automatically group images if they are sent in sequence
              const groupedMessages = groupSequentialImages(sortedMessages);
              
              // Log the result of grouping for debugging
              console.log('Grouped messages after new message:', 
                groupedMessages.length, 'messages,', 
                groupedMessages.filter(m => m.isImageGroup).length, 'image groups');
                
              return groupedMessages;
            }
            return prevMessages;
          });
          
          // If the message is from another user and we're already in the chat view,
          // automatically mark it as seen
          if (isFromOtherUser && messageData.id) {
            console.log('Automatically marking incoming message as seen:', messageData.id);
            // Small delay to ensure message is processed first
            setTimeout(() => {
              SocketService.emitMessageSeen(messageData.id);
            }, 500);
          }
          
          scrollToBottom('smooth');
        }
      });
      
      // Listen for message sent status updates
      SocketService.onMessageSent((messageSentData) => {
        console.log('Message sent status update received:', messageSentData);
        
        if (selectedChat && messageSentData) {
          // Check if the message belongs to the current chat
          if (messageSentData.chatId?.toString() === selectedChat) {
            // Update the message status in the state
            setMessages(prevMessages => {
              // Try to find the message in our existing messages
              let found = false;
              
              const updatedMessages = prevMessages.map(msg => {
                // Try to match by ID first
                if (msg.id === messageSentData.id || msg.id === `temp-${messageSentData.id}`) {
                  found = true;
                  return {
                    ...msg,
                    id: messageSentData.id, // Replace temp ID with actual ID
                    isSent: true,          // Always set sent to true
                    isDelivered: messageSentData.isDelivered,
                    isSeen: messageSentData.isSeen,
                    sending: false,        // No longer sending
                    failed: false,         // Not failed
                    isNew: false           // Prevent re-animation
                  };
                }
                // If no ID match, try to match by content and check if it's a temp message
                else if (msg.id.toString().includes('temp-') && 
                         msg.originalContent === messageSentData.content) {
                  found = true;
                  return {
                    ...msg,
                    id: messageSentData.id,
                    isSent: true,
                    isDelivered: messageSentData.isDelivered,
                    isSeen: messageSentData.isSeen,
                    sending: false,
                    failed: false,
                    isNew: false           // Prevent re-animation
                  };
                }
                // Final fallback: match by content and timestamp proximity
                else if (msg.id.toString().includes('temp-') && 
                         msg.text === messageSentData.content && 
                         msg.sentTime && 
                         Math.abs(new Date(msg.sentTime).getTime() - new Date(messageSentData.sentAt).getTime()) < 10000) {
                  found = true;
                  return {
                    ...msg,
                    id: messageSentData.id,
                    isSent: true,
                    isDelivered: messageSentData.isDelivered,
                    isSeen: messageSentData.isSeen,
                    sending: false,
                    failed: false,
                    isNew: false           // Prevent re-animation
                  };
                }
                return msg;
              });
              
              console.log(`Message update ${found ? 'matched' : 'did not match'} an existing message`);
              return updatedMessages;
            });
          }
        }
      });
      
      // Listen for message delivered status updates
      SocketService.onMessageDelivered((deliveryData) => {
        console.log('Message delivery status update received:', deliveryData);
        
        if (selectedChat && deliveryData && deliveryData.messageId) {
          // Update the message delivery status in the state
          setMessages(prevMessages => {
            // Try to find the message by its ID
            let found = false;
            
            const updatedMessages = prevMessages.map(msg => {
              // Match by message ID
              if (msg.id === deliveryData.messageId) {
                found = true;
                return {
                  ...msg,
                  isSent: true,              // Guarantee sent status
                  isDelivered: deliveryData.isDelivered, // Update delivered status
                  deliveredAt: deliveryData.deliveredAt,
                  isNew: false               // Prevent re-animation
                };
              }
              return msg;
            });
            
            console.log(`Delivery update ${found ? 'matched' : 'did not match'} an existing message: ID ${deliveryData.messageId}`);
            return updatedMessages;
          });
        }
      });
      
      // Register listener for typing status
      SocketService.onTypingStatus((typingData) => {
        console.log('Typing status update received:', typingData);
        
        if (typingData && typingData.userId) {
          // Update typing status for this user
          setTypingUsers(prev => ({
            ...prev,
            [typingData.userId]: {
              isTyping: typingData.isTyping,
              timestamp: new Date().getTime()
            }
          }));
        }
      });
    }
    
    return () => {
      // Clean up listeners when component unmounts or dependencies change
      cleanupSocketListeners();
      console.log('Socket listeners cleaned up on unmount/dependency change');
    };
  }, [socketConnected, selectedChat, chatData, currentUserId, socket]);
  
  // Effect to handle chat changes specifically
  useEffect(() => {
    // When selectedChat changes, clear messages to avoid showing old messages
    if (socketConnected && selectedChat) {
      console.log(`Selected chat changed to: ${selectedChat}, clearing previous messages`);
    }
  }, [selectedChat, socketConnected]);
  
  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom('smooth');
    }
  }, [messages]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // If transitioning from mobile to desktop, ensure both views are visible
      if (!mobile && selectedChat) {
        setShowMobileChat(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [selectedChat]);

  // Handle URL/ID changes
  useEffect(() => {
    if (id) {
      setSelectedChat(id);
      setShowMobileChat(true);
      fetchMessages(id);
    } else if (!id && showMobileChat && isMobile) {
      setShowMobileChat(false);
    }
  }, [id, isMobile, showMobileChat]);

  // Function to fetch messages for a chat
  const fetchMessages = async (chatId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await requestAPI('get', `/chats/${chatId}/messages`);
      
      if (response && !response.error && response.messages) {
        console.log('API messages response:', response.messages);
        // Ensure we're using the most up-to-date user ID from localStorage
        const userId = localStorage.getItem('userId');
        if (userId) {
          setCurrentUserId(userId);
        }
        // Format individual messages first
        const formattedMessages = formatChatMessages(response.messages, userId || currentUserId);
        
        // Group sequential images for WhatsApp-like display
        const groupedMessages = groupSequentialImages(formattedMessages);
        
        // Log messages for debugging
        console.log('Raw formatted messages:', formattedMessages);
        console.log('Messages after image grouping:', groupedMessages);
        
        // Set the grouped messages in state
        setMessages(groupedMessages);
        
        // Mark all unread messages as seen when entering the chat
        if (socketConnected) {
          // Make sure we have the latest user ID
          const currentUser = userId || currentUserId;
          console.log('Current user marking messages as seen, userID:', currentUser);
          
          // Find messages that are not from the current user and not seen yet
          const unseenMessages = response.messages.filter(msg => {
            const isFromOtherUser = String(msg.senderId) !== String(currentUser);
            const isNotSeen = !msg.isSeen;
            console.log(`Message ${msg.id} from ${msg.senderId}: isFromOtherUser=${isFromOtherUser}, isNotSeen=${isNotSeen}`);
            return isFromOtherUser && isNotSeen;
          });
          
          console.log('Marking unseen messages as seen:', unseenMessages.length, 'messages');
          
          // Emit message_seen for each unseen message with slight delay between each
          // to prevent potential race conditions or message drops
          if (unseenMessages.length > 0) {
            unseenMessages.forEach((msg, index) => {
              setTimeout(() => {
                console.log(`Emitting seen for message ID ${msg.id}`);
                SocketService.emitMessageSeen(msg.id);
              }, index * 200); // 200ms delay between each message
            });
          }
        }
      } else {
        setError('Failed to load messages');
        setMessages([]);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat list from API
  useEffect(() => {
    const fetchChats = async () => {
      setIsFetchingChats(true);
      setChatsFetchError(null);
      
      try {
        const response = await requestAPI('get', '/chats/list');
        if (response && !response.error) {
          setChatData(response);
        } else {
          setChatsFetchError('Failed to load chats');
        }
      } catch (err) {
        console.error('Error fetching chats:', err);
        setChatsFetchError('Failed to load chats');
      } finally {
        setIsFetchingChats(false);
      }
    };
    
    fetchChats();
  }, []);

  // Handle file upload when files are selected
  const handleFileSelect = useCallback(async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    
    // Reset file input value to allow selecting the same file again
    event.target.value = null;
    
    // Start upload process
    setIsUploading(true);
    setUploadProgress(0);
    setShowUploadModal(true);
    setUploadError(null);
    
    // Prepare files for upload
    const filesToUpload = files.map(file => ({
      file,
      id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending',
      previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
    }));
    
    setCurrentUploads(filesToUpload);
    
    // Upload files sequentially
    for (let i = 0; i < filesToUpload.length; i++) {
      const fileData = filesToUpload[i];
      
      // Update progress for overall uploads
      setUploadProgress(Math.round((i / filesToUpload.length) * 100));
      
      // Update status for this file to 'uploading'
      setCurrentUploads(prevUploads => 
        prevUploads.map(upload => 
          upload.id === fileData.id 
            ? { ...upload, status: 'uploading', progress: 0 } 
            : upload
        )
      );
      
      try {
        // Create form data with proper multipart/form-data structure
        const formData = new FormData();
        
        // The field name 'media' here must match what the server expects in req.files
        // Some server configurations like Express with multer will look for this specific field name
        formData.append('media', fileData.file, fileData.file.name);
        
        console.log('Uploading file:', {
          name: fileData.file.name,
          type: fileData.file.type,
          size: fileData.file.size,
          lastModified: new Date(fileData.file.lastModified).toISOString()
        });
        
        // For file uploads, we need to use axios directly to ensure proper multipart/form-data handling
        const token = localStorage.getItem('token');
        const axiosInstance = axios.create({
          baseURL: BASE_URL,
          headers: {
            'ngrok-skip-browser-warning': 'true',
            'Authorization': token ? `Bearer ${token}` : '',
          }
        });
        
        // Make API request using axios directly (don't set Content-Type - let browser handle it)
        const axiosResponse = await axiosInstance.post('/chats/upload', formData, {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress for ${fileData.name}: ${percentCompleted}%`);
            
            // Update progress for this specific file
            setCurrentUploads(prevUploads => 
              prevUploads.map(upload => 
                upload.id === fileData.id 
                  ? { ...upload, progress: percentCompleted } 
                  : upload
              )
            );
          }
        });
        
        const response = axiosResponse.data;
        if (response) {
          console.log('Upload successful:', response);
          // Update uploads with success status and server data
          setCurrentUploads(prevUploads => 
            prevUploads.map(upload => 
              upload.id === fileData.id 
                ? { 
                    ...upload, 
                    status: 'completed', 
                    progress: 100,
                    mediaUrl: response.mediaUrl,
                    mediaType: response.mediaType
                  } 
                : upload
            )
          );
          
          // Add to uploadedMedia array for sending with the message
          setUploadedMedia(prev => [
            ...prev, 
            { 
              id: fileData.id,
              mediaUrl: response.mediaUrl, 
              mediaType: response.mediaType,
              originalFileName: fileData.name,
              previewUrl: fileData.previewUrl
            }
          ]);
          
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error(`Error uploading file ${fileData.name}:`, error);
        
        // Update status to 'failed' for this file
        setCurrentUploads(prevUploads => 
          prevUploads.map(upload => 
            upload.id === fileData.id 
              ? { ...upload, status: 'failed', error: error.message } 
              : upload
          )
        );
        
        // Set overall upload error
        setUploadError(`Failed to upload ${fileData.name}`);        
      }
    }
    
    // Complete upload process
    setIsUploading(false);
    setUploadProgress(100);
    
    // Keep modal open to show results
    // User can close it when ready
  }, [requestAPI]);
  
  // Handle removing a media item before sending
  const handleRemoveMedia = (mediaId) => {
    setUploadedMedia(prev => prev.filter(media => media.id !== mediaId));
  };
  
  // Handle clicking the attachment button
  const handleAttachmentClick = (type) => {
    if (fileInputRef.current) {
      // Set accept attribute based on the selected type
      switch (type) {
        case 'photo':
          fileInputRef.current.accept = 'image/*';
          break;
        case 'video':
          fileInputRef.current.accept = 'video/*';
          break;
        case 'document':
          fileInputRef.current.accept = '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx';
          break;
        default:
          fileInputRef.current.accept = '*/*';
      }
      
      // Force a flush of the DOM updates before clicking
      setTimeout(() => {
        // Trigger click on file input to open file dialog
        fileInputRef.current.click();
      }, 0);
    }
  };
  
  // Handle canceling uploads
  const handleCancelUpload = () => {
    setIsUploading(false);
    setCurrentUploads([]);
    setShowUploadModal(false);
  };
  
  // Function to get the appropriate icon for media type
  const getMediaTypeIcon = (mediaType) => {
    if (mediaType.startsWith('image/')) return faImage;
    if (mediaType.startsWith('video/')) return faVideo;
    if (mediaType.includes('pdf')) return faFile;
    return faFile;
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    // Always log what we're trying to send
    console.log('Attempting to send message:', {
      text: newMessage,
      textLength: (newMessage || '').length,
      hasMedia: uploadedMedia.length > 0,
      mediaCount: uploadedMedia.length,
      selectedChat: selectedChat,
      socketConnected: socketConnected,
      socketExists: !!socket
    });
    
    // Make sure the socket is connected before trying to send
    if (!socketConnected) {
      console.error('Cannot send message: Socket is not connected!');
      
      // Try to reconnect the socket
      if (socket) {
        console.log('Attempting to reconnect socket...');
        socket.connect();
        
        // Show error to user
        toast.error('Connection lost. Reconnecting...', {
          position: "top-right",
          autoClose: 3000
        });
      }
      
      return; // Don't proceed with sending if socket isn't connected
    }
    
    if ((newMessage.trim() !== '' || uploadedMedia.length > 0) && selectedChat) {
      // Get the selected chat data to determine recipient
      const currentChatData = chatData.find(chat => chat.id.toString() === selectedChat);
      
      if (!currentChatData || !currentChatData.user) {
        console.error('Cannot send message: chat data or user not found');
        return;
      }
      
      // Generate a consistent temp ID that can be tracked across state updates
      const now = Date.now();
      const tempMsgId = `temp-${now}`;
      
      // Create a temporary message to show immediately in UI
      // Initial message shows 'sending' status (no tick)
      const tempMsg = {
        id: tempMsgId,
        sender: 'me',
        text: newMessage,
        timestamp: new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSent: false,       // Start with not sent
        isDelivered: false,  // Not delivered
        isSeen: false,       // Not seen
        sending: true,       // Message is in sending state
        isNew: true,         // Flag to animate new messages
        originalContent: newMessage, // Store original content for matching
        sentTime: now,       // Timestamp for matching,
        rawSentAt: new Date().toISOString() // For sequential grouping
      };
      
      // Add media to the message if any are uploaded
      if (uploadedMedia.length > 0) {
        console.log(`Adding ${uploadedMedia.length} media items to temp message:`, uploadedMedia);
        
        // For consistency with server response format, add mediaUrl and mediaType directly
        // to the temp message (first media item)
        const firstMedia = uploadedMedia[0];
        tempMsg.mediaUrl = firstMedia.mediaUrl;
        tempMsg.mediaType = firstMedia.mediaType;
        
        // Also keep the media array for UI rendering
        tempMsg.media = uploadedMedia.map(media => ({
          type: media.mediaType.split('/')[0], // 'image', 'video', etc.
          url: `${BASE_URL}${media.mediaUrl}`,
          mediaType: media.mediaType
        }));
      }
      
      // Add the temporary message to the UI and sort all messages
      setMessages(prevMessages => {
        // Add the new message to the list
        const newMessageList = [...prevMessages, tempMsg];
        
        // Sort messages by timestamp to ensure proper chronological order
        const sortedMessages = newMessageList.sort((a, b) => {
          const timeA = a.rawSentAt ? new Date(a.rawSentAt).getTime() : new Date(a.timestamp).getTime();
          const timeB = b.rawSentAt ? new Date(b.rawSentAt).getTime() : new Date(b.timestamp).getTime();
          return timeA - timeB;
        });
        
        return sortedMessages;
      });
      
      // Store original message content before clearing input
      const messageContent = newMessage;
      
      // Clear input field
      setNewMessage('');
      
      // Create a message object for updating the chat list
      const messageForChatList = {
        id: tempMsgId,
        senderId: currentUserId,
        receiverId: currentChatData.user.id,
        chatId: selectedChat,
        content: newMessage,
        sentAt: new Date().toISOString()
      };
      
      // Add media info to chat list message if available
      if (uploadedMedia.length > 0) {
        const firstMedia = uploadedMedia[0];
        messageForChatList.mediaUrl = firstMedia.mediaUrl;
        messageForChatList.mediaType = firstMedia.mediaType;
      }
      
      // Update the chat list to move this chat to the top
      updateChatListWithNewMessage(messageForChatList);
      
      // Scroll to bottom immediately
      setTimeout(() => scrollToBottom('smooth'), 50);
      
      try {
        // Double check socket is connected before sending
        if (socketConnected && socket && socket.connected) {
          // Cache the uploaded media before clearing it
          const mediaToSend = [...uploadedMedia];
          
          // Now clear uploaded media after we've cached it
          setUploadedMedia([]);
          
          // First, check if we need to send both text and media
          const hasText = messageContent && messageContent.trim() !== '';
          const hasMedia = mediaToSend.length > 0;
          
          console.log('Socket status before sending:', {
            socketExists: !!socket,
            socketConnected: socket ? socket.connected : false,
            connectedState: socketConnected
          });
          
          if (hasText || (hasMedia && mediaToSend.length === 1)) {
            // Simple case: text message or single media item
            // Prepare message data for socket
            const socketMessageData = {
              receiverId: currentChatData.user.id,
              content: messageContent || '' // Use stored content, not the cleared newMessage
            };
            
            // Add media information if available (first or only item)
            if (hasMedia) {
              const firstMedia = mediaToSend[0];
              socketMessageData.mediaUrl = firstMedia.mediaUrl;
              socketMessageData.mediaType = firstMedia.mediaType;
            }
            
            console.log('Emitting message via socket:', socketMessageData);
            
            // Send message via socket
            SocketService.emitPrivateMessage(socketMessageData);
          } else if (hasMedia && mediaToSend.length > 1) {
            // Multiple media items case: send each one separately to ensure proper delivery
            console.log(`Sending ${mediaToSend.length} media items via separate socket messages`);
            
            // Send text first if exists
            if (hasText) {
              const textMessageData = {
                receiverId: currentChatData.user.id,
                content: messageContent
              };
              console.log('Emitting text message via socket:', textMessageData);
              SocketService.emitPrivateMessage(textMessageData);
            }
            
            // Send each media item separately with minimal delay between each
            // to ensure proper order and avoid rate limiting
            mediaToSend.forEach((media, index) => {
              setTimeout(() => {
                const mediaMessageData = {
                  receiverId: currentChatData.user.id,
                  content: '',  // Empty content for media-only messages
                  mediaUrl: media.mediaUrl,
                  mediaType: media.mediaType
                };
                
                console.log(`Emitting media message ${index+1}/${mediaToSend.length}:`, {
                  mediaUrl: media.mediaUrl,
                  mediaType: media.mediaType
                });
                
                SocketService.emitPrivateMessage(mediaMessageData);
              }, index * 300); // 300ms delay between each message to ensure proper ordering
            });
          }
          
          // ALWAYS update message to 'sent' status after a short delay
          // This guarantees that every message shows at least one tick
          setTimeout(() => {
            setMessages(prevMessages => {
              // Ensure the message still exists before updating
              const msgExists = prevMessages.some(msg => msg.id === tempMsgId);
              
              if (msgExists) {
                return prevMessages.map(msg => 
                  msg.id === tempMsgId
                    ? { ...msg, isSent: true, sending: false, isNew: false } // Prevent re-animation 
                    : msg
                );
              }
              return prevMessages;
            });
          }, 300); // Show sent status after 300ms
        } else {
          throw new Error('Socket not connected');
        }
      } catch (err) {
        console.error('Error sending message:', err);
        // Keep the message in the UI but mark it as failed
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === tempMsgId 
              ? { ...msg, failed: true, sending: false, isNew: false, text: msg.text + ' (Failed to send)' } 
              : msg
          )
        );
      }
    }
  };

  // Handle selecting a chat
  const handleSelectChat = (chatId) => {
    try {
      setSelectedChat(chatId);
      fetchMessages(chatId);
      
      if (isMobile) {
        setShowMobileChat(true);
      }
      
      navigate(`/messages/${chatId}`, { replace: true });
      
      // After setting messages, scroll to bottom with a slight delay
      // to ensure the content is rendered
      setTimeout(() => {
        scrollToBottom();
      }, 300);
      
    } catch (err) {
      console.error('Error selecting chat:', err);
      setError('Failed to load chat');
    }
  };

  // Handle going back to chat list on mobile
  const handleBackToList = () => {
    setShowMobileChat(false);
    navigate('/messages', { replace: true });
  };
  
  // Image gallery handlers with enhanced carousel functionality
  const openGallery = (images, startIndex = 0) => {
    console.log('Opening gallery with', images.length, 'images, starting at index', startIndex);
    setGalleryImages(images);
    setCurrentImageIndex(startIndex);
    setGalleryOpen(true);
    setFullscreenMode(false); // Always start in non-fullscreen mode
  };
  
  const closeGallery = (e) => {
    if (e) e.stopPropagation();
    setGalleryOpen(false);
    setFullscreenMode(false);
  };
  
  // Enhanced nextImage to support direct navigation to a specific index
  const nextImage = (e, targetIndex) => {
    if (e) e.stopPropagation();
    
    // If a specific target index is provided, go directly to that image
    if (targetIndex !== undefined && targetIndex >= 0 && targetIndex < galleryImages.length) {
      setCurrentImageIndex(targetIndex);
      return;
    }
    
    // Otherwise cycle through images
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1;
      console.log('Moving to next image:', nextIndex);
      return nextIndex;
    });
  };
  
  const prevImage = (e) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prevIndex) => {
      const prevIdx = prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1;
      console.log('Moving to previous image:', prevIdx);
      return prevIdx;
    });
  };
  
  const toggleFullscreen = (e) => {
    if (e) e.stopPropagation();
    setFullscreenMode(!fullscreenMode);
  };
 
  // Function to render the chat view
  const renderChatContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col h-full">
          {/* Chat Header with Skeleton */}
          <div className="px-4 py-3 border-b flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
            <div className="flex items-center">
              {isMobile && (
                <Button 
                  isIconOnly 
                  variant="light" 
                  className="mr-2"
                  onClick={handleBackToList}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
              )}
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="ml-3">
                <Skeleton className="h-5 w-32 rounded" />
                <Skeleton className="h-3 w-20 rounded mt-1" />
              </div>
            </div>
          </div>
          
          {/* Messages area with skeletons */}
          <ScrollShadow className="flex-grow min-h-0 overflow-auto overflow-x-hidden" visibility='top'>
            <div className="py-4 px-4 min-h-[calc(100%-120px)]">
              <div className="flex flex-col space-y-4">
                <MessageSkeletons />
                <div ref={messagesEndRef} />
              </div>
            </div>
          </ScrollShadow>
          
          {/* Message Input */}
          <div className="border-t p-3 bg-white sticky bottom-0 z-10 shadow-sm mt-auto">
            <div className="flex items-center">
              <div className="flex gap-2 mr-2">
                <Button isIconOnly variant="light" size="sm" disabled>
                  <FontAwesomeIcon icon={faFile} />
                </Button>
                <Button isIconOnly variant="light" size="sm" disabled>
                  <FontAwesomeIcon icon={faSmile} />
                </Button>
                <Button isIconOnly variant="light" size="sm" disabled>
                  <FontAwesomeIcon icon={faMicrophone} />
                </Button>
              </div>
              <Input
                type="text"
                placeholder="Type a message..."
                className="flex-1"
                disabled
              />
              <Button 
                isIconOnly 
                color="primary" 
                variant="solid" 
                className="ml-2 bg-[#006C54]"
                disabled
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex flex-col justify-center items-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => handleSelectChat(selectedChat)} className="mt-2">
            Try Again
          </Button>
        </div>
      );
    }

    if (!selectedChat) {
      return (
        <div className="flex-1 flex justify-center items-center bg-gray-50">
          <Card className="w-3/4 max-w-md">
            <CardBody className="text-center py-8">
              <div className="mb-4 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Your Messages</h3>
              <p className="text-gray-500 mb-4">Select a chat to start messaging</p>
            </CardBody>
          </Card>
        </div>
      );
    }
    

    return (
      <div className="flex flex-col h-full">
        {/* Chat Header - Fixed at top */}
        <div className="px-4 py-3 border-b flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
          <div className="flex items-center">
            {isMobile && (
              <Button 
                isIconOnly 
                variant="light" 
                className="mr-2"
                onClick={handleBackToList}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </Button>
            )}
            {currentChat && currentChat.user && (
              <>
                <Avatar src={DEFAULT_AVATAR} className="h-10 w-10" />
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="font-semibold">{currentChat.user.name}</p>
                    <span className="ml-1 text-[10px] text-gray-500 bg-gray-100 rounded-full px-1.5 py-0.5">
                      #{currentChat.user.id || 'unknown'}
                    </span>
                  </div>
                  <p className="text-xs flex items-center gap-1">
                    {/* Show typing indicator if user is typing */}
                    {typingUsers[currentChat.user.id]?.isTyping ? (
  <span className="text-green-600 font-medium flex items-center space-x-1">
    <span>Typing</span>
    <span className="flex items-center space-x-1 ml-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          initial={{ y: 0 }}
          animate={{ y: [-2, 0, -2] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        >
          <FontAwesomeIcon icon={faCircle} className="text-[3px]"/>
          {/* <FaCircle  /> */}
        </motion.span>
      ))}
    </span>
  </span>
) : currentChat.user.isOnline ? (
  <>
    <span className="h-2 w-2 bg-green-500 rounded-full inline-block animate-pulse"></span>
    <span className="text-green-600 font-medium ml-1">Active now</span>
  </>
) : (
  <span className="text-gray-500">
    Last seen: {formatLastSeen(currentChat.user.lastSeen)}
  </span>
)}
                  </p>
                </div>
              </>
            )}
          </div>
          
          <div>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light">
                  <FontAwesomeIcon icon={faEllipsisV} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Chat actions">
                <DropdownItem>View profile</DropdownItem>
                <DropdownItem>Block user</DropdownItem>
                <DropdownItem>Delete conversation</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        
        {/* Messages - Scrollable area with flex-grow to fill available space */}
        <ScrollShadow className="flex-grow min-h-0 overflow-auto overflow-x-hidden" visibility='top'>
          <div className="py-4 px-4 min-h-[calc(100%-120px)]">
            <div className="flex flex-col space-y-4">
              {messages.map((message) => (
                
                <motion.div 
                  key={message.id} 
                  initial={message.isNew ? { opacity: 0, y: 20 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  layout={false} /* Prevent layout animations when content changes */
                  className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                
                  <div className={`flex ${message.sender === 'me' ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[75%]`}>
                    {message.sender === 'them' && (
                      <div className="flex-shrink-0">
                        <Avatar src={message.avatar} className="h-8 w-8 mb-2 mr-2" />
                      </div>
                    )}
                    <div 
                      className={`rounded-2xl p-3 break-words overflow-hidden ${message.sender === 'me' 
                        ? 'bg-[#006C54] text-white rounded-br-sm' 
                        : 'bg-gray-200 text-gray-800 rounded-bl-sm'}`}
                      style={{ maxWidth: '100%', wordBreak: 'break-word' }}
                    >
                      {message.senderName && message.sender === 'them' && (
                        <p className="text-xs font-semibold mb-1 text-gray-700">{message.senderName}</p>
                      )}
                      {/* Only show text if it's not an empty string */}
                      {message.text?.trim() && (
  <p className="break-words whitespace-pre-wrap">{message.text}</p>
)}

                      
                      {message.media && (
                        <div className={message.text ? "mt-2" : ""}>
                          {/* Special handling for pre-grouped image groups */}
                          {message.isImageGroup ? (
                            <ImageGallery 
                              images={message.media} 
                              onImageClick={openGallery} 
                            />
                          ) : (
                            /* For regular messages, group media by type */
                            (() => {
                              const imageMedia = message.media.filter(item => item.type === 'image' || item.mediaType?.startsWith('image/'));
                              const videoMedia = message.media.filter(item => item.type === 'video' || item.mediaType?.startsWith('video/'));
                              const documentMedia = message.media.filter(item => 
                                !item.type?.match(/image|video/) && 
                                !item.mediaType?.match(/^(image|video)\//))
                            ;
                              return (
                                <>
                                  {/* Render images in a grid-like layout using our custom ImageGallery component */}
                                  {imageMedia.length > 0 && (
                                    <ImageGallery 
                                      images={imageMedia} 
                                      onImageClick={openGallery} 
                                    />
                                  )}
                                
                                {/* Render videos */}
                                {videoMedia.length > 0 && (
                                  <div className="flex flex-col gap-2 mb-2">
                                    {videoMedia.map((item, index) => (
                                      <div key={index} className="relative rounded-lg overflow-hidden bg-gray-800">
                                        <video 
                                          controls 
                                          className="max-h-64 max-w-full"
                                          poster={item.thumbnail}
                                        >
                                          <source src={item.url} type={item.mediaType || 'video/mp4'} />
                                          Your browser does not support the video tag.
                                        </video>
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                          <div className="bg-black bg-opacity-30 rounded-full p-3">
                                            <FontAwesomeIcon icon={faPlay} className="text-white text-xl" />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Render documents/files */}
                                {documentMedia.length > 0 && (
                                  <div className="flex flex-col gap-2">
                                    {documentMedia.map((item, index) => {
                                      const isPdf = item.mediaType?.includes('pdf');
                                      const icon = getMediaTypeIcon(item.mediaType || 'application/octet-stream');
                                      
                                      return (
                                        <div 
                                          key={index} 
                                          className={`flex items-center p-2 rounded-lg ${message.sender === 'me' 
                                            ? 'bg-[#006C54] bg-opacity-60' 
                                            : 'bg-gray-100'}`}
                                          onClick={() => window.open(item.url, '_blank')}
                                        >
                                          <div className={`p-2 rounded mr-2 ${message.sender === 'me' ? 'bg-white bg-opacity-20' : 'bg-white bg-opacity-80'}`}>
                                            <FontAwesomeIcon 
                                              icon={icon} 
                                              className={`${message.sender === 'me' ? 'text-white' : 'text-gray-700'} text-lg`} 
                                            />
                                          </div>
                                          <div className="flex-1 min-w-0 mr-2">
                                            <p className="text-sm font-medium truncate">
                                              {item.originalFileName || `File ${index + 1}`}
                                            </p>
                                            <p className="text-xs opacity-70">
                                              {item.mediaType?.split('/')[1]?.toUpperCase() || 'Document'}
                                            </p>
                                          </div>
                                          <FontAwesomeIcon 
                                            icon={faDownload} 
                                            className={`${message.sender === 'me' ? 'text-white' : 'text-gray-700'} text-sm opacity-70`} 
                                          />
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                </>
                              );
                            })()
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-end">
                        <p className={`text-xs mt-1 ${message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'}`}>
                          {message.timestamp}
                        </p>
                        {message.sender === 'me' && (
                          <span className="ml-1 text-xs">
                            {message.failed ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FontAwesomeIcon icon={faCircleXmark} className="text-red-400" />
        </motion.div>
      ) : message.sending ? (
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FontAwesomeIcon icon={faCircle} className="text-blue-200" />
        </motion.div>
      ) : message.isSeen ? (
        <motion.div
          initial={{ opacity: 0, y: -2 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FontAwesomeIcon icon={faCheckDouble} className="text-blue-500" />
        </motion.div>
      ) : message.isDelivered ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FontAwesomeIcon icon={faCheckDouble} className="text-blue-200" />
        </motion.div>
      ) : message.isSent ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <FontAwesomeIcon icon={faCheck} className="text-blue-200" />

        </motion.div>
      ) : (
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <FontAwesomeIcon icon={faCircle} className="text-blue-100" />

        </motion.div>
      )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </ScrollShadow>
        
        {/* Message Input - Fixed at bottom */}
        <div className="border-t p-3 bg-white sticky bottom-0 z-10 shadow-sm mt-auto">
          <div className="flex items-center">
            {/* Hidden file inputs for different types of uploads */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileSelect} 
              multiple
            />
            
            {/* Direct file inputs for image and video buttons */}
            <input 
              type="file" 
              id="photoInput"
              className="hidden" 
              accept="image/*"
              onChange={handleFileSelect} 
              multiple
            />
            
            <input 
              type="file" 
              id="videoInput"
              className="hidden" 
              accept="video/*"
              onChange={handleFileSelect} 
              multiple
            />
            
            <div className="flex gap-2 mr-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly variant="light" size="sm">
                    <FontAwesomeIcon icon={faFile} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Attachment options">
                  <DropdownItem 
                    startContent={<FontAwesomeIcon icon={faImage} />}
                    onClick={() => handleAttachmentClick('photo')}
                  >
                    Photo
                  </DropdownItem>
                  <DropdownItem 
                    startContent={<FontAwesomeIcon icon={faVideo} />}
                    onClick={() => handleAttachmentClick('video')}
                  >
                    Video
                  </DropdownItem>
                  <DropdownItem 
                    startContent={<FontAwesomeIcon icon={faFile} />}
                    onClick={() => handleAttachmentClick('document')}
                  >
                    Document
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              
              <Button 
                isIconOnly 
                variant="light" 
                size="sm"
                onClick={() => document.getElementById('photoInput').click()}
              >
                <FontAwesomeIcon icon={faImage} />
              </Button>
              
              <Button 
                isIconOnly 
                variant="light" 
                size="sm"
                onClick={() => document.getElementById('videoInput').click()}
              >
                <FontAwesomeIcon icon={faVideo} />
              </Button>
            </div>
            
            <div className="flex-1 relative">
              {/* Display media preview above input if media is attached */}
              {uploadedMedia.length > 0 && (
                <div className="flex flex-wrap gap-2 p-2 mb-2 bg-gray-50 rounded-lg border">
                  {uploadedMedia.map((media) => (
                    <div key={media.id} className="relative group">
                      <div className="h-16 w-16 rounded-md overflow-hidden relative bg-gray-200 flex items-center justify-center">
                        {media.mediaType.startsWith('image/') ? (
                          <img 
                            src={`${BASE_URL}${media.mediaUrl}`} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FontAwesomeIcon 
                            icon={getMediaTypeIcon(media.mediaType)} 
                            className="text-gray-500 text-xl"
                          />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                          <Button 
                            isIconOnly 
                            size="sm" 
                            color="danger" 
                            variant="flat" 
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveMedia(media.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faX} className="text-xs" />
                          </Button>
                        </div>
                      </div>
                      <span className="text-xs truncate block w-16 text-center mt-1">
                        {media.mediaType.split('/')[1]}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <Input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  
                  // Only emit typing status if we're in an active chat
                  if (selectedChat && currentChat?.user?.id) {
                    // If user wasn't already typing, emit typing started
                    if (!isUserTyping) {
                      setIsUserTyping(true);
                      SocketService.emitTypingStatus(currentChat.user.id, true);
                    }
                    
                    // Clear any existing timeout
                    if (typingTimeoutRef.current) {
                      clearTimeout(typingTimeoutRef.current);
                    }
                    
                    // Set a new timeout to emit typing stopped after 2 seconds of inactivity
                    typingTimeoutRef.current = setTimeout(() => {
                      if (isUserTyping) {
                        setIsUserTyping(false);
                        SocketService.emitTypingStatus(currentChat.user.id, false);
                      }
                    }, 2000);
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="w-full"
              />
            </div>
            
            <Button 
              isIconOnly 
              color="primary" 
              variant="solid" 
              className="ml-2 bg-[#006C54]"
              onClick={handleSendMessage}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Media upload modal component
  const renderUploadModal = () => {
    return (
      <Modal 
        isOpen={showUploadModal} 
        onClose={() => !isUploading && setShowUploadModal(false)}
        isDismissable={!isUploading}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {isUploading ? 'Uploading Media...' : 'Upload Complete'}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  {uploadError && (
                    <div className="p-2 bg-red-100 text-red-800 rounded-md flex items-center gap-2">
                      <FontAwesomeIcon icon={faExclamationTriangle} />
                      <span>{uploadError}</span>
                    </div>
                  )}
                  
                  {isUploading && (
                    <div className="mb-4">
                      <p className="text-center text-sm text-gray-500 mb-2">
                        Uploading files... {uploadProgress}%
                      </p>
                      <Progress 
                        value={uploadProgress} 
                        color="primary"
                        showValueLabel={true}
                        className="w-full" 
                      />
                    </div>
                  )}
                  
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {currentUploads.map(file => (
                      <div key={file.id} className="flex items-center p-2 border rounded-md">
                        <div className="mr-3 text-lg">
                          <FontAwesomeIcon 
                            icon={getMediaTypeIcon(file.type)} 
                            className={file.status === 'failed' ? 'text-red-500' : 'text-gray-500'} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center">
                            {file.status === 'uploading' && (
                              <>
                                <div className="w-24 mr-2">
                                  <Progress 
                                    size="sm" 
                                    value={file.progress} 
                                    color="primary" 
                                    className="max-w-md"
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{file.progress}%</span>
                              </>
                            )}
                            {file.status === 'completed' && (
                              <Chip color="success" size="sm" variant="flat">Uploaded</Chip>
                            )}
                            {file.status === 'failed' && (
                              <Chip color="danger" size="sm" variant="flat">Failed</Chip>
                            )}
                            {file.status === 'pending' && (
                              <Chip color="warning" size="sm" variant="flat">Waiting</Chip>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                {isUploading ? (
                  <Button 
                    color="danger" 
                    variant="flat" 
                    onPress={handleCancelUpload}
                  >
                    Cancel Upload
                  </Button>
                ) : (
                  <Button color="primary" onPress={onClose}>
                    Done
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 border-t-1 relative overflow-hidden">
      {/* Chat List */}
      <AnimatePresence initial={false}>
        {!(showMobileChat && isMobile) && (
          <motion.div 
            key="chatList"
            initial={isMobile ? { x: -300, opacity: 0 } : { opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: -300, opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${isMobile ? 'absolute inset-0' : 'relative'} w-full md:w-1/3 lg:w-1/4 border-r bg-white z-10`}
          >
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-4">Messages</h1>
              <Tabs aria-label="Chat tabs" className="mb-4 text-white"
              color="primary" 
              variant="solid"
              classNames={{
                tab: "data-[selected=true]:text-[#006C54] data-[selected=true]:border-[#006C54]",
                cursor: "bg-[#006C54]"
              }}>
                <Tab key="all" title="All" />
                <Tab key="unread" title="Buying" />
                <Tab key="archived" title="Selling" />
              </Tabs>
              
              <Input
                isClearable
                startContent={<FontAwesomeIcon icon={faSearch} className="text-gray-400" />}
                placeholder="Search chats..."
                className="mb-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <ScrollShadow className="h-[calc(100vh-230px)] overflow-y-auto" >
                {isFetchingChats ? (
                  <div className="py-2 space-y-3">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center p-3 rounded-lg mb-2">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="ml-3 flex-1">
                          <Skeleton className="h-5 w-24 rounded mb-1" />
                          <Skeleton className="h-4 w-40 rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : chatsFetchError ? (
                  <div className="flex flex-col justify-center items-center h-full">
                    <p className="text-red-500">{chatsFetchError}</p>
                    <Button onClick={() => window.location.reload()} className="mt-2">
                      Try Again
                    </Button>
                  </div>
                ) : filteredChats.length === 0 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-500">No chats found</p>
                  </div>
                ) : (
                  filteredChats.map((chat) => (
                    <motion.div 
                      key={chat.id}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                      onClick={() => handleSelectChat(chat.id.toString())}
                      className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 ${selectedChat === chat.id.toString() ? 'bg-[#f0f9ff] hover:bg-blue-50' : ''}`}
                    >
                      <div className="relative">
                        <Avatar src={DEFAULT_AVATAR} className="h-10 w-10" />
                        {chat.user?.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <p className="font-semibold truncate">{chat.user?.name || 'Unknown User'}</p>
                              <span className="ml-1 text-[10px] text-gray-500 bg-gray-100 rounded-full px-1.5 py-0.5">
                                #{chat.user?.id || 'unknown'}
                              </span>
                            </div>
                            {!chat.user?.isOnline && chat.user?.lastSeen && (
                              <p className="text-xs text-gray-500 -mt-0.5">
                                Last seen: {formatLastSeen(chat.user.lastSeen)}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {chat.lastMessage?.sentAt ? formatTimeAgo(new Date(chat.lastMessage.sentAt)) : ''}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[180px] md:max-w-[240px] flex items-center">
                          {chat.lastMessage?.mediaType && (
                            <span className="mr-1">
                              <FontAwesomeIcon 
                                icon={getMediaTypeIcon(chat.lastMessage.mediaType)} 
                                className="text-xs text-gray-400" 
                              />
                            </span>
                          )}
                          
                          {chat.lastMessage?.mediaType ? 
                            (chat.lastMessage?.content ? 
                              chat.lastMessage.content : 
                              `${chat.lastMessage.mediaType.split('/')[0]} file`) : 
                            (chat.lastMessage?.content || 'No messages yet')}
                        </div>
                      </div>
                  </motion.div>
                )))}
              </ScrollShadow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Content */}
      <AnimatePresence initial={false}>
        {(showMobileChat || !isMobile) && (
          <motion.div 
            key="chatContent"
            initial={isMobile ? { x: 300, opacity: 0 } : { opacity: 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={isMobile ? { x: 300, opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`${isMobile ? 'absolute inset-0' : 'flex-1'} flex flex-col bg-white ${isMobile ? 'z-20' : ''}`}
          >
            {renderChatContent()}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Render image gallery modal */}
      <ImageModal 
        isOpen={galleryOpen}
        images={galleryImages}
        currentIndex={currentImageIndex}
        onClose={closeGallery}
        onNext={nextImage}
        onPrev={prevImage}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={fullscreenMode}
      />
      
      {/* Render upload modal */}
      {renderUploadModal()}
    </div>
  );
};

export default Messages;