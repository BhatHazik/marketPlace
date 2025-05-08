import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button, Tabs, Tab, Skeleton, Card, AccordionItem } from "@heroui/react";
import { Link } from "react-router-dom";
import BASE_URL from "../config/url.config";



// Render skeleton cards during loading
export const renderSkeletons = (limit=4) => {
  return Array(limit).fill().map((_, index) => (
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


export const renderAccordionSkeletons = (limit = 4) => {
  return Array(limit).fill().map((_, index) => (
    <AccordionItem
      key={`accordion-skeleton-${index}`}
      title={
        <Skeleton className="w-1/2 rounded-md">
          <div className="h-4 bg-default-200 rounded-md" />
        </Skeleton>
      }
      className="bg-[#F1F2F6] border-none shadow-none py-1"
    >
      {/* Empty content or loader placeholder, if needed */}
      <div className="px-2 py-2">
        <Skeleton className="w-full h-4 rounded-md bg-default-100" />
      </div>
    </AccordionItem>
  ));
};

export const renderFilterSkeletons = (limit = 10) => {
  const skeletons = [];

  // First 5: single select input style
  for (let i = 0; i < Math.min(limit, 5); i++) {
    skeletons.push(
      <div
        key={`select-${i}`}
        className="flex items-start gap-2 animate-pulse mb-3"
      >
        <div className="w-[15%] h-4 bg-gray-300 rounded-sm mt-2" />
        <div className="w-[75%]">
          <div className="w-full h-8 bg-gray-200 rounded-md" />
        </div>
      </div>
    );
  }

  // Next 5: from–to range style
  for (let i = 0; i < Math.min(limit - 5, 5); i++) {
    skeletons.push(
      <div
        key={`range-${i}`}
        className="flex items-start gap-2 animate-pulse mb-3"
      >
        <div className="w-[25%] h-4 bg-gray-300 rounded-sm mt-2" />
        <div className="w-[75%] flex gap-2">
          <div className="w-1/2 h-8 bg-gray-200 rounded-md" />
          <div className="w-1/2 h-8 bg-gray-200 rounded-md" />
        </div>
      </div>
    );
  }

  return skeletons;
};




const FreshListings = ({ listings = [], isLoading = false, selectedLocation = "" }) => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Function to extract specific values from productValues array
  // const getProductValue = (productValues, attributeName) => {
  //   const attribute = productValues?.find(attr => attr.attribute_name === attributeName);
  //   return attribute ? attribute.value : null;
  // };

  // Filter products based on active category if we have subcategory data
  const filteredListings = activeCategory === 'all' 
    ? listings 
    : listings.filter(listing => {
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
  
  

  return (
    <div className="bg-white pb-8 w-full">
      {/* Full width gradient header */}
      <div className="w-full bg-[linear-gradient(to_right,_rgba(0,108,84,0.1)_0%,_rgba(255,255,255,0.1)_100%)] mb-6 md:mb-8 py-8 ps-5">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-3xl font-[400] text-gray-800 px-4">
            Fresh Listings {selectedLocation && `in ${selectedLocation}`}
          </h2>
        </div>
      </div>
      
      {/* Full width product grid with container only for the grid itself */}
      <div className="container mx-auto px-3 md:px-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {isLoading ? (
            renderSkeletons()
          ) : filteredListings.length > 0 ? (
            filteredListings.map((listing) => {
              // Extract necessary data from the listing
              // const title = getProductValue(listing.productValues, "Title");
              // const price = getProductValue(listing.productValues, "Price");
              // const photos = getProductValue(listing.productValues, "Photos");
              // const imageUrl = photos && photos.length > 0 
              //   ? `${BASE_URL}/${photos[0]}`
              //   : null;
              
              return (
                <ProductCard
                key={listing.id}
                productId={listing.id}
                image={listing.productValues.Photos[0]}
                title={listing.productValues.Title}
                price={listing.productValues.Price}
                location={`${listing.productLocation.city}`}
                date= {new Date(listing.created_at).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                })}
                featured={listing.is_sponsored}
                />
              );
            })
          ) : (
            <div className="col-span-full py-8 text-center text-gray-500">
              {selectedLocation ? `No fresh listings available in ${selectedLocation}.` : 'No fresh listings available.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreshListings;
