import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedListings from "../components/FeaturedListings";
import FreshListings from "../components/FreshListings";
import BrandSection from "../components/BrandSection";
import PostAdSection from "../components/PostAdSection";
import UseAPI from "../hooks/UseAPI";
import GeoLocationModal from "../components/GeoLocationModal";



const Home = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [allListings, setAllListings] = useState([]);
  const [featuredListings, setFeaturedListings] = useState([]);
  const [freshListings, setFreshListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detectedLocation, setDetectedLocation] = useState(null);
  const { requestAPI } = UseAPI();


  useEffect(()=>{
    const selectedLocation = localStorage.getItem("selectedLocation");
    setSelectedLocation(selectedLocation);
  },[localStorage.getItem("selectedLocation")]);

  const handleLocationChange = (location) => {
    console.log("Location changed in Home:", location);
    localStorage.setItem("selectedLocation",location);

    setSelectedLocation(location);
  };

  const handleLocationIdChange = (location) => {
    console.log("Location id changed in Home:", location);
    localStorage.setItem("selectedLocationId",location);
  };
  
  const handleDetectedLocation = (location) => {
    console.log("Location detected from geolocation:", location);
    setDetectedLocation(location);
  };

  // Function to fetch listings based on selected location
  const fetchListings = async (locationKey) => {
    // Don't fetch if no location is selected yet
    if (!locationKey) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching listings for location: ${locationKey}`);
      console.log("locationKey",locationKey)
      // Convert location key to state name for API call
      // const stateName = locationToStateMap[locationKey] || "Delhi";
      const stateName = locationKey;
      // Make API request to get listings for the selected state
      const response = await requestAPI('GET', `/listings/search/${stateName}`, null, { showErrorToast: false });
      
      if (response && response.status === "success" && response.data) {
        const listings = response.data;
        setAllListings(listings);
        
        // Sort listings into featured and fresh
        const featured = listings.filter(listing => listing.is_sponsored);
        const fresh = listings.filter(listing => !listing.is_sponsored);
        console.log("fresh",fresh)
        
        setFeaturedListings(featured);
        setFreshListings(fresh);
      } else {
        setAllListings([]);
        setFeaturedListings([]);
        setFreshListings([]);
        setError("No listings found for this location");
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setAllListings([]);
      setFeaturedListings([]);
      setFreshListings([]);
      setError("Failed to fetch listings. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch listings when the selected location changes
  useEffect(() => {
    if (selectedLocation) {
      console.log("selectedLocation",selectedLocation)
      fetchListings(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div>
      <GeoLocationModal onLocationDetected={handleDetectedLocation} />
      <Hero 
        onLocationChange={handleLocationChange} 
        onLocationIdChange={handleLocationIdChange} 
        detectedLocation={detectedLocation}
      />
      <FeaturedListings 
        listings={featuredListings} 
        isLoading={isLoading} 
        selectedLocation={selectedLocation} 
      />
      <FreshListings 
        listings={freshListings} 
        isLoading={isLoading} 
        selectedLocation={selectedLocation} 
      />
      <PostAdSection />
    </div>
  );
};

export default Home;