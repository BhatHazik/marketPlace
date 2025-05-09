import { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const GeoLocationModal = ({ onLocationDetected }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if we should show the prompt (only once per session)
  useEffect(() => {
    const hasPrompted = sessionStorage.getItem("locationPrompted");
    if (!hasPrompted) {
      onOpen();
      sessionStorage.setItem("locationPrompted", "true");
    }
  }, []);
  
  const getLocation = () => {
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      setIsLoading(false);
      onClose();
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get state from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
          );
          
          if (!response.ok) throw new Error("Geocoding failed");
          
          const data = await response.json();
          const state = data.address.state;
          
          if (state && onLocationDetected) {
            onLocationDetected(state);
          }
        } catch (error) {
          console.error("Error getting location:", error);
        } finally {
          setIsLoading(false);
          onClose();
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
        setIsLoading(false);
        onClose();
      }
    );
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Use your location</ModalHeader>
        <ModalBody>
          <div className="flex items-center gap-3 mb-2">
            <FontAwesomeIcon icon={faLocationDot} className="text-3xl text-[#006C54]" />
            <p>Would you like to use your current location to find nearby listings?</p>
          </div>
          <p className="text-sm text-gray-500">This will help you find listings in your area. Your location data won't be stored.</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            No, thanks
          </Button>
          <Button 
            color="primary" 
            className="bg-[#006C54]" 
            onPress={getLocation}
            isLoading={isLoading}
          >
            Use my location
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GeoLocationModal; 