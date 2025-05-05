import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Card, Skeleton } from "@heroui/react";
import UseAPI from "../hooks/UseAPI";
import BASE_URL from "../config/url.config";

// Map location keys to state names for API calls
const locationToStateMap = {
  "all": "All India",
  "srinagar": "Jammu and Kashmir",
  "delhi": "Delhi",
  "mumbai": "Maharashtra",
  "bangalore": "Karnataka",
  "chennai": "Tamil Nadu",
  "kolkata": "West Bengal",
  "hyderabad": "Telangana"
};

const DynamicListings = ({ selectedLocation }) => {
  const [listings, setListings] = useState([]);
  const { requestAPI, loading, error } = UseAPI();

  // Function to fetch listings based on selected location
  const fetchListings = async (locationKey) => {
    try {
      // Convert location key to state name for API call
      const stateName = locationToStateMap[locationKey] || "Delhi";
      
      const response = await requestAPI('GET', `/listings/search/${stateName}`);
      if (response && response.status === "success" && response.data) {
        setListings(response.data);
      } else {
        setListings([]);
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setListings([]);
    }
  };

  // Fetch listings when the selected location changes
  useEffect(() => {
    if (selectedLocation) {
      fetchListings(selectedLocation);
    }
  }, [selectedLocation]);

  // Function to extract specific values from productValues array
  const getProductValue = (productValues, attributeName) => {
    const attribute = productValues?.find(attr => attr.attribute_name === attributeName);
    return attribute ? attribute.value : null;
  };

  // Render skeleton cards during loading
  const renderSkeletons = () => {
    return Array(8).fill().map((_, index) => (
      <Card key={`skeleton-${index}`} className="w-full p-4 space-y-5" radius="sm">
        <Skeleton className="rounded-lg">
          <div className="h-48 rounded-lg bg-default-300"></div>
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-5 w-3/5 rounded-lg bg-default-300"></div>
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-200"></div>
          </Skeleton>
        </div>
      </Card>
    ));
  };

  // Get location name for display
  const getLocationDisplayName = (locationKey) => {
    return locationToStateMap[locationKey] || "All India";
  };

  return (
    <div className="bg-white py-8 md:py-12 w-full">
      {/* Full width gradient header */}
      <div className="w-full bg-[linear-gradient(to_right,_rgba(0,108,84,0.1)_0%,_rgba(255,255,255,0.1)_100%)] mb-6 md:mb-8 py-8 ps-5">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-[400] text-gray-800">
            Listings in {getLocationDisplayName(selectedLocation)}
          </h2>
        </div>
      </div>
      
      {/* Product grid */}
      <div className="container mx-auto px-3 md:px-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {loading ? (
            renderSkeletons()
          ) : listings.length > 0 ? (
            listings.map((listing) => {
              // Extract necessary data from the listing
              const title = getProductValue(listing.productValues, "Title");
              const price = getProductValue(listing.productValues, "Price");
              const photos = getProductValue(listing.productValues, "Photos");
              const imageUrl = photos && photos.length > 0 
                ? `${BASE_URL}/${photos[0]}`
                : null;
              
              return (
                <ProductCard
                  key={listing.id}
                  image={imageUrl}
                  title={title || "No title available"}
                  price={price || 0}
                  location={`${listing.productLocation?.city || ""}, ${listing.productLocation?.state || ""}`}
                  date={new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  featured={listing.is_sponsored}
                />
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              No listings found for {getLocationDisplayName(selectedLocation)}. Try selecting a different location.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicListings;
