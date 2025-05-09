import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Button, Tabs, Tab, Skeleton, Card } from "@heroui/react";
import { Link } from "react-router-dom";
import BASE_URL from "../config/url.config";
import UseAPI from "../hooks/UseAPI";

const FeaturedListings = ({ listings = [], isLoading = false, selectedLocation = "" }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { requestAPI } = UseAPI();

  // Function to extract specific values from productValues array
  const getProductValue = (productValues, attributeName) => {
    if (!productValues) return null;
    return productValues[attributeName] || null;
  };

  // Function to get the correct image URL
  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    // Remove leading slash if present
    const cleanPath = photoPath.startsWith('/') ? photoPath.slice(1) : photoPath;
    return `${BASE_URL}/${cleanPath}`;
  };

  // Fetch listings when location changes
  useEffect(() => {
    const fetchListings = async () => {
      if (!selectedLocation) return;
      
      setLoading(true);
      try {
        const response = await requestAPI('GET', `/listings/search/${selectedLocation}`, null, { showErrorToast: false });
        
        if (response && response.status === "success" && response.data) {
          // Filter for featured listings (is_sponsored)
          const featured = response.data.filter(listing => listing.is_sponsored);
          setFeaturedListings(featured);
        }
      } catch (error) {
        console.error("Error fetching featured listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [selectedLocation]);

  // Filter products based on active category if we have subcategory data
  const filteredListings = activeCategory === 'all' 
    ? featuredListings 
    : featuredListings.filter(listing => {
        // Get category from subcategory data if available
        const category = listing.subcategory?.parent_category?.name?.toLowerCase();
        return category === activeCategory;
      });

  // Categories for filtering
  const categories = [
    { key: "all", label: "All Categories" },
    { key: "vehicles", label: "Vehicles" },
    { key: "property", label: "Property" },
    { key: "fashion", label: "Fashion" },
    { key: "electronics", label: "Electronics" },
    { key: "furniture", label: "Furniture" }
  ];

  // Render skeleton cards during loading
  const renderSkeletons = () => {
    return Array(4).fill().map((_, index) => (
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

  return (
    <div className="bg-white py-8 md:py-12 w-full">
      {/* Full width gradient header */}
      <div className="w-full bg-[linear-gradient(to_right,_rgba(0,108,84,0.1)_0%,_rgba(255,255,255,0.1)_100%)] mb-6 md:mb-8 py-8 ps-5">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-3xl font-[400] text-gray-800 px-4">
            Featured Listings {selectedLocation && `in ${selectedLocation}`}
          </h2>
        </div>
      </div>
      
      {/* Full width product grid with container only for the grid itself */}
      <div className="container mx-auto px-3 md:px-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {loading ? (
            renderSkeletons()
          ) : filteredListings?.length > 0 ? (
            filteredListings?.map((listing) => {
              // Extract necessary data from the listing
              const title = getProductValue(listing?.productValues, "Title");
              const price = getProductValue(listing?.productValues, "Price");
              const photos = getProductValue(listing?.productValues, "Photos");
              const imageUrl = photos && photos.length > 0 
                ? getImageUrl(photos[0])
                : null;
              
              return (
                <ProductCard
                  key={listing.id}
                  productId={listing.id}
                  image={listing.productValues?.Photos[0]}
                  title={title || "No title available"}
                  price={price || 0}
                  location={`${listing.productLocation?.city || ""}, ${listing.productLocation?.state || ""}`}
                  date={new Date(listing.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  featured={listing.is_sponsored}
                  wishlisted={listing.isWishlisted}
                />
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              {selectedLocation ? `No featured listings available in ${selectedLocation}.` : 'No featured listings available.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedListings;