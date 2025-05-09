import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Image,
  Button,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  Skeleton,
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faCalendarAlt,
  faShare,
  faHeart,
  faFlag,
  faAngleRight,
  faUser,
  faChevronLeft,
  faChevronRight,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import ProductCard from "../components/ProductCard";
import { initFlowbite } from "flowbite";
import FeaturedListings from "../components/FeaturedListings";
import FreshListings from "../components/FreshListings";
import { useNavigate, useParams } from "react-router-dom";
import DescriptionToggler from "../components/DescriptionToggler";
import UseAPI from "../hooks/UseAPI";
import BASE_URL from "../config/url.config";
import { toast } from "react-toastify";
import defaultImage from "../assets/placeholder-image.jpg";

const PreviewAd = () => {
  const [hearted, setHearted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState("right");
  const [isAnimating, setIsAnimating] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [productValues, setProductValues] = useState(null);
  const [productData, setProductData] = useState(null);
  const [productLocation, setProductLocation] = useState(null);
  const [productUser, setProductUser] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [moreProducts, setMoreProducts] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const { id } = useParams();
  const { requestAPI, loading } = UseAPI();
  const navigate = useNavigate();

  // Initialize Flowbite and get location
  useEffect(() => {
    initFlowbite();
    const location = localStorage.getItem("selectedLocation");
    setSelectedLocation(location);
  }, []);

  const handleGetListing = async () => {
    const response = await requestAPI("GET", `/listings/${id}`);
    if (response && response.status === "success" && response.data) {
      console.log("Product Details", response);
      setActiveIndex(0);

      const specialKeys = ["Title", "Description", "Price", "Photos"];
      const alwaysArrayKeys = ["Photos"];

      // Separate special keys into an object
      const specialData = {};
      const attributesArray = [];

      for (const [key, value] of Object.entries(response.data.productValues)) {
        if (specialKeys.includes(key)) {
          // Keep Photos as array; unwrap others if needed
          specialData[key] =
            Array.isArray(value) &&
            !alwaysArrayKeys.includes(key) &&
            value.length === 1
              ? value[0]
              : value;
        } else {
          // Format remaining into key/value array, unwrap if single-item
          attributesArray.push({
            key,
            value:
              Array.isArray(value) && value.length === 1 ? value[0] : value,
          });
        }
      }
      setProductValues(attributesArray);
      console.log("Product specialData", specialData );
      setProductDetails(specialData);
      setProductUser(response.userData);
      setProductLocation(response.data.productLocation);
      setProductData(response.data);
      setMoreProducts(response.RecentProducts);
      console.log("Product User", response.userData);
    } else {
      console.log("Error fetching product details");
    }

    console.log(response.data);
  };

  useEffect(() => {
    handleGetListing();
  }, [id]);

  // Function to handle next image
  const handleNext = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSlideDirection("right");

    setTimeout(() => {
      setActiveIndex((prev) =>
        prev === productDetails?.Photos?.length - 1 ? 0 : prev + 1
      );
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  // Function to handle previous image
  const handlePrev = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setSlideDirection("left");

    setTimeout(() => {
      setActiveIndex((prev) =>
        prev === 0 ? productDetails?.Photos?.length - 1 : prev - 1
      );
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  // Function to handle thumbnail clicks
  const handleThumbnailClick = (index) => {
    if (isAnimating || index === activeIndex) return;

    setIsAnimating(true);
    setSlideDirection(index > activeIndex ? "right" : "left");

    setTimeout(() => {
      setActiveIndex(index);
      setTimeout(() => setIsAnimating(false), 50);
    }, 300);
  };

  // Handle image errors
  const handleImageError = (index) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };

  // Sample data
  const adData = {
    title: "BMW 525i Bmw 5 Series - 2.5 petrol, LPG - 2006",
    price: 48000,
    category: "Vehicles",
    brand: "BMW",
    model: "525i",
    year: 2006,
    date: "Posted at Aug 20, 2024",
    location: "Bengaluru, Karnataka",
    description:
      "This BMW 525i from 2006 is in excellent condition with low mileage. It features a 2.5L petrol engine with LPG conversion for better fuel economy. The exterior is well maintained with no major scratches or dents. Interior is clean with leather seats. All maintenance records available. Recent service completed.",
    attributes: [
      { name: "Year", value: "2006" },
      { name: "Fuel Type", value: "Petrol, LPG" },
      { name: "KM Driven", value: "75,000" },
      { name: "Engine", value: "2.5L" },
      { name: "Transmission", value: "Automatic" },
      { name: "Color", value: "Green" },
      { name: "Registration", value: "KA-01" },
      { name: "Insurance", value: "Valid until Dec 2024" },
    ],
    images: [
      "https://images.pexels.com/photos/100650/pexels-photo-100650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/100654/pexels-photo-100654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/7663129/pexels-photo-7663129.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/17019057/pexels-photo-17019057/free-photo-of-convertible-on-road.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "https://images.pexels.com/photos/9846079/pexels-photo-9846079.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
  };

  const seller = {
    name: "Briana",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isOnline: true,
    isActiveMember: true,
    joinDate: "Member since Jul 2022",
  };

  const sellerAds = [
    {
      image:
        "https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "AirPods Pro 2nd Generation",
      price: 22000,
      location: "Bengaluru",
      date: "3 days ago",
    },
    {
      image:
        "https://images.pexels.com/photos/4482932/pexels-photo-4482932.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Apple Watch Series 8",
      price: 38000,
      location: "Bengaluru",
      date: "5 days ago",
    },
  ];


  const handleMessageClick = async (receiverId) => {
    const chatId = await requestAPI('POST', `/chats/create`, { receiverId }, { showErrorToast: false });
    console.log(chatId)
    if (chatId && chatId.chat && chatId.chat.id) {
      console.log(chatId.chat.id)
      navigate(`/messages/${chatId.chat.id}`);
    }
  };

  const getSlideClass = () => {
    if (!isAnimating) return "";
    return slideDirection === "right"
      ? "animate-slide-right"
      : "animate-slide-left";
  };

  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
  },[id])

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="lg:w-2/2 w-full">
          {/* Title and Price */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
            {loading ? (
              <>
                <Skeleton className="w-2/3 h-8 rounded-lg mb-2" />
                <Skeleton className="w-1/4 h-8 rounded-lg" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">
                  {productDetails?.Title}
                </h1>
                <div className="text-2xl font-bold text-gray-900">
                  ₹ {productDetails?.Price}
                </div>
              </>
            )}
          </div>

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600">
            {loading ? (
              <>
                <Skeleton className="w-1/3 h-6 rounded-lg" />
                <Skeleton className="w-1/3 h-6 rounded-lg" />
              </>
            ) : (
              <>
                <span className="flex items-center">
                  <Chip className="mb-0" variant="flat">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                    {productLocation?.state} - {productLocation?.city}
                  </Chip>
                </span>
                <span className="flex">
                  <Chip variant="flat">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                    {productData?.created_at && (
                      <>
                        Posted On{" "}
                        {new Date(productData.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </>
                    )}
                  </Chip>
                </span>
              </>
            )}
          </div>

          {/* Custom Image Carousel */}
          <div className="mb-8">
            <div className="relative w-full mb-4 rounded-lg overflow-hidden">
              {/* Main image display with animation */}
              {loading ? (
                <Skeleton className="h-56 md:h-[36rem] rounded-lg w-full" />
              ) : (
                <div className="relative h-56 md:h-[36rem] transition-all duration-500 ease-in-out">
                  <div className={`w-full h-full ${getSlideClass()}`}>
                    <img
                      src={imageErrors[activeIndex] ? defaultImage : `${BASE_URL}/${productDetails?.Photos[activeIndex]}`}
                      onError={() => handleImageError(activeIndex)}
                      className="absolute w-full h-full object-cover"
                      alt={productDetails?.Title || "Product image"}
                    />
                  </div>
                </div>
              )}

              {/* Slider controls - only show when not loading */}
              {!loading && (
                <>
                  <button
                    type="button"
                    className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={handlePrev}
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                      <FontAwesomeIcon
                        icon={faChevronLeft}
                        className="w-4 h-4 text-gray-800"
                      />
                      <span className="sr-only">Previous</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={handleNext}
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white group-focus:outline-none">
                      <FontAwesomeIcon
                        icon={faChevronRight}
                        className="w-4 h-4 text-gray-800"
                      />
                      <span className="sr-only">Next</span>
                    </span>
                  </button>

                  {/* Slider indicators */}
                  <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
                    {productDetails?.Photos?.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full ${
                          activeIndex === index
                            ? "bg-[#006C54]"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                        aria-current={activeIndex === index ? "true" : "false"}
                        aria-label={`Slide ${index + 1}`}
                        onClick={() => handleThumbnailClick(index)}
                      ></button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex overflow-x-auto gap-2 p-4">
              {loading ? (
                <>
                  {[1, 2, 3, 4].map((_, index) => (
                    <Skeleton key={index} className="flex-shrink-0 w-28 h-28 rounded-md" />
                  ))}
                </>
              ) : (
                productDetails?.Photos?.map((img, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-28 h-28 cursor-pointer border-2 rounded-md overflow-hidden transition-all duration-200 ${
                      activeIndex === index
                        ? "border-[#006C54] scale-105"
                        : "border-transparent"
                    }`}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={imageErrors[index] ? defaultImage : `${BASE_URL}/${img}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <div className="w-full border-b-1 mb-2 pb-2">
              <h2 className="text-xl font-semibold">Description</h2>
            </div>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-full h-4 rounded-lg" />
                <Skeleton className="w-3/4 h-4 rounded-lg" />
                <Skeleton className="w-5/6 h-4 rounded-lg" />
              </div>
            ) : (
              <DescriptionToggler description={productDetails?.Description} />
            )}
          </div>

          {/* Attributes */}
          <div className="mb-8">
            <div className="w-full border-b-1 mb-4 pb-2">
              <h2 className="text-xl font-semibold">About</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
              {loading ? (
                // Skeleton for attributes
                Array(8).fill().map((_, index) => (
                  <div key={index} className="flex flex-row">
                    <Skeleton className="w-1/2 h-6 rounded-lg" />
                    <Skeleton className="w-1/2 h-6 rounded-lg ml-2" />
                  </div>
                ))
              ) : (
                productValues?.map((attr, index) => (
                  <div key={index} className="flex flex-row">
                    <span className="w-1/2 flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className="text-[#CFE9DC]"
                      />
                      <div className="font-normal">{attr.key}</div>
                    </span>
                    <div className="w-1/2 text-gray-600 ">
                      <Chip
                        color="default"
                        variant="flat"
                        size="sm"
                        className="px-2 py-1"
                      >
                        <p>{attr.value}</p>
                      </Chip>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:w-1/3 w-full">
          {/* Seller Profile */}
          <Card
            className="mb-6 p-4 bg-white/80 border border-gray-200"
            shadow="none"
          >
            {loading ? (
              // Skeleton for seller profile
              <div>
                <div className="mb-11">
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-1/3 h-5 rounded-lg" />
                    <Skeleton className="w-1/4 h-5 rounded-lg" />
                  </div>
                </div>
                <div className="flex flex-col items-center mb-4">
                  <Skeleton className="w-28 h-28 rounded-full mb-3" />
                  <Skeleton className="w-32 h-6 rounded-lg mb-1" />
                  <Skeleton className="w-40 h-6 rounded-lg" />
                </div>
                <div className="flex gap-2 mb-4 w-full justify-center">
                  <Skeleton className="w-1/3 h-10 rounded-lg" />
                  <Skeleton className="w-1/3 h-10 rounded-lg" />
                </div>
                <div className="flex justify-center gap-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="mb-11">
                  <div className="flex items-center justify-between">
                    <Tooltip
                      content={`User is currently ${
                        productUser?.is_verified ? "active" : "inactive"
                      }`}
                      showArrow={true}
                      className="bg-[#CFE9DC]"
                    >
                      <Chip
                        color="default"
                        variant="flat"
                        size="sm"
                        className="px-2 py-1 cursor-pointer"
                      >
                        {productUser?.is_verified ? "Active Member" : "Inactive"}
                      </Chip>
                    </Tooltip>

                    {!productUser?.isOnline ? (
                      <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-gray-600 inline-block mr-1"></span>
                        <span className="text-sm text-gray-600">Offline</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="h-3 w-3 rounded-full bg-[#006C54] inline-block mr-1"></span>
                        <span className="text-sm text-gray-600">Online</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center mb-4">
                  <Avatar
                    src={productUser?.profilePic}
                    className="w-28 h-28 mb-3 text-[#006C54]"
                    isBordered
                    color="success"
                  />
                  <h3 className="text-lg font-semibold">{productUser?.name}</h3>
                  <Button
                    variant=""
                    onPress={() => navigate(`/user-profile/${productUser?.id}`)}
                    endContent={<FontAwesomeIcon icon={faAngleRight} />}
                    className="w-max hover:bg-[#CFE9DC] text-[#006C54]"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    View all ads
                  </Button>
                </div>

                <div className="flex gap-2 mb-4 w-full justify-center">
                  <Button
                    className="w-1/3 bg-[#006C54] text-white"
                    onPress={() => {
                      if(localStorage.getItem("userId").toString() === productUser?.id.toString()){
                        toast.info("You can't message your self.")
                      }
                      else{
                        console.log("its happening", productUser?.id.toString(), localStorage.getItem("userId").toString())
                        handleMessageClick(productUser?.id)
                      }
                    }}
                  >
                    Message
                  </Button>
                  {
                    localStorage.getItem("userId") && 
<Button
                    onPress={() =>
                      window.open(
                        `https://wa.me/${productUser?.phone_number}`,
                        "_blank"
                      )
                    }
                    variant="bordered"
                    className="w-1/3 border-[#006C54] text-[#006C54]"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className=" text-lg" />
                    <p className="font-medium">WhatsApp</p>
                  </Button>
                  }
                  
                </div>

                <div className="flex justify-center gap-4">
                  <FontAwesomeIcon
                    icon={faFacebook}
                    aria-label="Facebook"
                    className="text-[#006C54] cursor-pointer hover:text-[#CFE9DC]"
                  />
                  <FontAwesomeIcon
                    icon={faTwitter}
                    aria-label="Twitter"
                    className="text-[#006C54] cursor-pointer hover:text-[#CFE9DC]"
                  />
                  <FontAwesomeIcon
                    icon={faInstagram}
                    aria-label="Instagram"
                    className="text-[#006C54] cursor-pointer hover:text-[#CFE9DC]"
                  />
                </div>
              </>
            )}
          </Card>

          {/* Seller's other ads */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              More ads from this seller
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {loading ? (
                // Skeleton for seller's other ads
                Array(2).fill().map((_, index) => (
                  <Card key={index} className="w-full p-4 space-y-5" radius="sm">
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
                ))
              ) : (
                Array.isArray(moreProducts) && moreProducts.length > 0 ? (
                  moreProducts.map((listing, index) => (
                    <ProductCard
                    key={listing.id}
                    productId={listing.id}
                    image={listing.productValues.Photos[0]}
                    title={listing.productValues.Title}
                    price={listing.productValues.Price}
                    location={`${listing.productLocation.city}`}
                    date={new Date(listing.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                    })}
                    featured={listing.is_sponsored}
                    wishlisted={listing?.isWishlisted}
                    />
                  ))
                ) : (
                  <p>No other ads from this seller</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <FeaturedListings 
        listings={[]} 
        isLoading={loading} 
        selectedLocation={selectedLocation} 
      />
      <FreshListings 
        listings={[]} 
        isLoading={loading} 
        selectedLocation={selectedLocation} 
      />

      <style jsx global>{`
        @keyframes slideRight {
          0% {
            transform: translateX(0%);
            opacity: 1;
          }
          40% {
            transform: translateX(-10%);
            opacity: 0;
          }
          60% {
            transform: translateX(10%);
            opacity: 0;
          }
          100% {
            transform: translateX(0%);
            opacity: 1;
          }
        }

        @keyframes slideLeft {
          0% {
            transform: translateX(0%);
            opacity: 1;
          }
          40% {
            transform: translateX(10%);
            opacity: 0;
          }
          60% {
            transform: translateX(-10%);
            opacity: 0;
          }
          100% {
            transform: translateX(0%);
            opacity: 1;
          }
        }

        .animate-slide-right {
          animation: slideRight 0.6s ease-in-out;
        }

        .animate-slide-left {
          animation: slideLeft 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PreviewAd;
