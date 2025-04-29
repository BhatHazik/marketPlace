import React, { useState, useEffect } from "react";
import UseAPI from "../hooks/UseAPI";
import { Avatar, Button, Card, Divider, Tabs, Tab, Pagination, CardBody, CardHeader, CardFooter, User } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMessage, 
  faCheckCircle, 
  faLocationDot,
  faStar,
  faChevronLeft,
  faChevronRight 
} from "@fortawesome/free-solid-svg-icons";
import {
  faWhatsapp, 
  faFacebook, 
  faTwitter, 
  faInstagram
} from "@fortawesome/free-brands-svg-icons";
import PostAdSection from "../components/PostAdSection";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { requestAPI, loading } = UseAPI();
  const navigate = useNavigate();
  
  // State for user data and listings
  const [userData, setUserData] = useState({
    name: "User",
    is_verified: false,
    total_products: 0,
    sold_products: 0
  });
  
  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Honda Civic 2022 - Perfect Condition",
      price: 550000,
      image: "https://s3-alpha-sig.figma.com/img/adb9/6f89/70406825b702ee3a292114d73bbfa8d1?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Oi9eJ1LlAECzV3rNQBnq442UgqjAYMTM7YIbBoBhAzFpzbRzg77CiLhIKBSV-jDlKZy3NX~lK92AOnRkgROhfLLCjvZEmYmG4JZcgC~e8U-pomCk7wU7umAsgkZFBjDFFQBnbgIM5if8I-ybJUzna93OfcU0P~m3qkkQBtQPbXwTpz4g9CVSAn4f-Y5fw~cv7X6lF6LEF0lJR99rElEKAuxBjJlS0jxE9OhG9VpndA5n9Kh59d0hiNSR5km3UJAbPSjijB585z-lHI93NHSGK7YzW3jgHX~IITlmuWWcOwM2k4qPqrYCTXMKALKEdQOuv6bwoMetlMl1PjuDmk6GXA__",
      location: "DHA, Karachi",
      date: "Apr 15",
      status: "active",
      featured: true
    },
    {
      id: 2,
      title: "iPhone 13 Pro Max - 256GB - Perfect Condition",
      price: 285000,
      image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=481&q=80",
      location: "Gulshan-e-Iqbal, Karachi",
      date: "Apr 12",
      status: "sponsored",
      featured: true
    },
    {
      id: 3,
      title: "5 Marla House for Sale in Bahria Town",
      price: 2500000,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "Bahria Town, Lahore",
      date: "Apr 08",
      status: "sold"
    },
    {
      id: 4,
      title: "Samsung 55 Inch 4K Smart LED TV",
      price: 120000,
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      location: "Model Town, Lahore",
      date: "Apr 14",
      status: "rejected"
    },
    {
      id: 5,
      title: "Modern Corner Sofa Set - 7 Seater",
      price: 85000,
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "F-10, Islamabad",
      date: "Apr 11",
      status: "active",
      featured: true
    },
    {
      id: 6,
      title: "Brand new Cafe, Restaurant office chair",
      price: 1199,
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
      location: "Tilak Nagar, Delhi, Delhi",
      date: "Dec 09",
      status: "sponsored",
      featured: true
    },
    {
      id: 7,
      title: "MacBook Pro M1 - 16GB RAM - 512GB SSD",
      price: 325000,
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "Clifton, Karachi",
      date: "Apr 15",
      status: "active"
    },
    {
      id: 8,
      title: "Oppo Reno 6 - 8GB RAM - 128GB Storage",
      price: 75000,
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80",
      location: "Rawalpindi",
      date: "Apr 10",
      status: "active"
    },
    {
      id: 9,
      title: "Toyota Corolla 2020 - Excellent Condition",
      price: 420000,
      image: "https://images.unsplash.com/photo-1619767886558-efdc259fd9b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "Johar Town, Lahore",
      date: "Apr 18",
      status: "active"
    },
    {
      id: 10,
      title: "Dell XPS 15 - i7 11th Gen - 16GB RAM",
      price: 280000,
      image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80",
      location: "DHA, Lahore",
      date: "Apr 17",
      status: "active"
    },
    {
      id: 11,
      title: "Sony PlayStation 5 - Brand New - With Extra Controller",
      price: 140000,
      image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
      location: "Gulberg, Lahore",
      date: "Apr 16",
      status: "sponsored"
    },
    {
      id: 12,
      title: "Canon EOS R5 - Professional Camera - With 2 Lenses",
      price: 520000,
      image: "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "Clifton, Karachi",
      date: "Apr 15",
      status: "sponsored"
    },
    {
      id: 13,
      title: "Apple Watch Series 7 - GPS + Cellular",
      price: 85000,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
      location: "Model Town, Lahore",
      date: "Apr 14",
      status: "sold"
    },
    {
      id: 14,
      title: "Samsung Galaxy Tab S8 Ultra - 256GB",
      price: 180000,
      image: "https://images.unsplash.com/photo-1585790050227-1e3973f1a0a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80",
      location: "Bahria Town, Islamabad",
      date: "Apr 13",
      status: "sold"
    },
    {
      id: 15,
      title: "Designer L-Shaped Sofa - Imported - Luxury Fabric",
      price: 120000,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "Defence, Karachi",
      date: "Apr 12",
      status: "rejected"
    },
    {
      id: 16,
      title: "BMW X5 2021 - Only 10,000 KM Driven",
      price: 15000000,
      image: "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "DHA, Karachi",
      date: "Apr 11",
      status: "rejected"
    },
    {
      id: 17,
      title: "DJI Mavic Air 2 - Drone with 4K Camera",
      price: 220000,
      image: "https://images.unsplash.com/photo-1579829366248-204fe8413f31?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "Gulshan-e-Iqbal, Karachi",
      date: "Apr 10",
      status: "sold"
    },
    {
      id: 18,
      title: "Nintendo Switch OLED - With 5 Games",
      price: 85000,
      image: "https://images.unsplash.com/photo-1591182136289-7940eed178f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "Johar Town, Lahore",
      date: "Apr 09",
      status: "active"
    }
  ]);


  const handleMessageClick = async (receiverId) => {
    const chatId = await requestAPI('POST', `/chats/create`, { receiverId }, { showErrorToast: false });
    console.log(chatId)
    if (chatId && chatId.chat && chatId.chat.id) {
      console.log(chatId.chat.id)
      navigate(`/messages/${chatId.chat.id}`);
    }
  };
  
  // Fetch user profile and listings data
  useEffect(() => {
    const fetchUserProfileData = async () => {
      const response = await requestAPI('GET', '/users/listing');
      if (response && response.status === "success") {
        setUserData(response.data.userDetails);
        
        // Transform API response to match our existing structure
        const transformedListings = response.data.listings.map(item => ({
          id: item.id,
          title: item.productValues.Title || "Untitled",
          price: item.productValues.Price || 0,
          image: item.productValues.Image || "https://via.placeholder.com/300",
          location: item.productLocation ? `${item.productLocation.city}, ${item.productLocation.country}` : "Unknown",
          date: new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: item.status || "pending",
          featured: item.is_sponsored || false
        }));
        
        setListings(transformedListings);
      }
    };
    
    fetchUserProfileData();
  }, []);

  const [selectedTab, setSelectedTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const getFilteredListings = (status) => {
    if (status === "all") {
      return listings;
    }
    return listings.filter(listing => listing.status === status);
  };

  // Calculate total pages based on filtered listings (8 items per page - 2 rows of 4)
  const itemsPerPage = 8;
  const filteredListings = getFilteredListings(selectedTab);
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  
  // Get paginated listings
  const getPaginatedListings = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredListings.slice(startIndex, endIndex);
  };
  
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of listings section
    window.scrollTo({ top: document.getElementById('listings-section').offsetTop - 100, behavior: 'smooth' });
  };

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      title: "Selling my old car was so easy with Offersale.",
      description: "I'm so glad I found Offersale!! I was trying to sell my old car, and I had no idea where to start.",
      rating: 5.0,
      user: {
        name: "Owasim Akbar",
        role: "Marketer",
        avatar: "https://i.pravatar.cc/150?img=32"
      }
    },
    {
      id: 2,
      title: "Excellent platform for buying electronics",
      description: "Found exactly what I was looking for at a great price. The seller was responsive and shipping was fast.",
      rating: 4.8,
      user: {
        name: "Sarah Johnson",
        role: "Software Engineer",
        avatar: "https://i.pravatar.cc/150?img=5"
      }
    },
    {
      id: 3,
      title: "Smooth transaction process",
      description: "The payment system is secure and the platform makes it easy to communicate with buyers. Will use again!",
      rating: 4.9,
      user: {
        name: "Michael Chen",
        role: "Business Owner",
        avatar: "https://i.pravatar.cc/150?img=11"
      }
    },
    {
      id: 4,
      title: "Great deals on furniture",
      description: "I furnished my entire apartment through this platform. Found some amazing second-hand items in great condition.",
      rating: 4.7,
      user: {
        name: "Priya Sharma",
        role: "Interior Designer",
        avatar: "https://i.pravatar.cc/150?img=20"
      }
    },
    {
      id: 5,
      title: "Trustworthy sellers",
      description: "I've had consistently good experiences with sellers on this platform. Items are as described and fairly priced.",
      rating: 5.0,
      user: {
        name: "James Wilson",
        role: "Teacher",
        avatar: "https://i.pravatar.cc/150?img=15"
      }
    }
  ];

  const [reviewsPage, setReviewsPage] = useState(0);
  const maxReviewsPage = Math.ceil(reviews.length / 3) - 1;
  
  const handleNextReviews = () => {
    setReviewsPage(prev => Math.min(prev + 1, maxReviewsPage));
  };
  
  const handlePrevReviews = () => {
    setReviewsPage(prev => Math.max(prev - 1, 0));
  };
  
  const visibleReviews = reviews.slice(reviewsPage * 3, reviewsPage * 3 + 3);

  return (
    <div className="min-h-screen bg-white">
      {/* User Profile Section */}
      <div className="w-full bg-[#002118] shadow-md text-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:min-h-[250px]">
            {/* Left - User Avatar */}
            <div className="w-full md:w-1/4 flex justify-center md:justify-start">
              <div className="relative">
                <div className="absolute inset-0 bg-[#006035] blur-3xl rounded-full"></div>
                <Avatar 
                  src={userData.avatar}
                  size="lg" 
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 text-large rounded-full relative z-10"
                  alt={userData.name}
                />
              </div>
            </div>
            
            {/* Middle - User Info and Action Buttons */}
            <div className="w-full md:w-2/5 flex flex-col space-y-6 mt-4 md:mt-0">
              <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
              
              <div className="flex items-center gap-4">
                <span className="flex items-center text-gray-200">
                  <FontAwesomeIcon icon={faCheckCircle} className={`${userData.is_verified ? "text-green-500" : "text-gray-500"} mr-2`} />
                  {userData.is_verified ? "Verified User" : "Unverified User"}
                </span>
                <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                <span className="text-gray-200">Online</span>
              </div>
              </div>
              
              
              
              <div className="flex align-items-center gap-4">
                <Button     
                  className="bg-[#006C54] text-white hover:bg-[#005743] m-0"
                  startContent={<FontAwesomeIcon icon={faMessage} />}
                  onPress={() => handleMessageClick(49)}
                >
                  Message
                </Button>
                
                <Button 
                  className="bg-white text-green-500"
                  startContent={<FontAwesomeIcon icon={faWhatsapp} className="font-bold text-xl"/>}
                >
                  WhatsApp
                </Button>
              </div>
            </div>
            
            {/* Right - Stats and Social Links */}
            <div className="w-full md:w-1/3 flex justify-center items-center self-center md:self-auto py-4 md:py-0">
              {/* Stats Section */}
              <div className="flex justify-center items-center w-full">
                <div className="flex flex-col items-center justify-center mx-4">
                  <p className="text-gray-200 text-xl text-center">{userData.sold_products}</p>
                  <h3 className="text-white font-bold text-sm mt-1 text-center">Sold</h3>
                </div>
                <div className="flex flex-col items-center justify-center mx-4">
                  <p className="text-gray-200 text-xl text-center">{userData.total_products}</p>
                  <h3 className="text-white font-bold text-sm mt-1 text-center">Listings</h3>
                </div>
                <div className="flex flex-col items-center justify-center mx-4">
                  <p className="text-gray-200 text-xl text-center">23</p>
                  <h3 className="text-white font-bold text-sm mt-1 text-center">Reviews</h3>
                </div>
                
                <div className="flex flex-col items-center justify-center mx-4">
                  
                  <div className="flex gap-2 ml-4">
                    <FontAwesomeIcon icon={faFacebook} className="text-gray-200 cursor-pointer text-sm" />
                    <FontAwesomeIcon icon={faInstagram} className="text-gray-200 cursor-pointer text-sm" />
                    <FontAwesomeIcon icon={faTwitter} className="text-gray-200 cursor-pointer text-sm" />
                  </div>
                  <div className="flex items-center text-gray-200 ">
                    <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                    <span className="text-sm font-light">{userData.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Post Ad Section */}
      <div className="mt-8">
        <PostAdSection />
      </div>
      
      {/* User's Listings Section */}
      <div id="listings-section" className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">{userData.name}'s Listings</h2>
            
            <Tabs 
              selectedKey={selectedTab}
              onSelectionChange={(key) => {
                setSelectedTab(key);
                setCurrentPage(1); // Reset to first page when tab changes
              }}
              color="primary" 
              variant="solid"
              classNames={{
                tab: "data-[selected=true]:text-[#006C54] data-[selected=true]:border-[#006C54]",
                cursor: "bg-[#006C54]"
              }}
            >
              <Tab key="all" title="All Ads" />
              <Tab key="active" title="Active" />
              <Tab key="sponsored" title="Sponsored" />
              <Tab key="sold" title="Sold" />
              <Tab key="rejected" title="Rejected" />
              <Tab key="pending" title="Pending" />
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4">
            {getPaginatedListings().map((listing) => (
              <ProductCard
                key={listing.id}
                image={listing.image}
                title={listing.title}
                price={listing.price}
                location={listing.location}
                date={listing.date}
                featured={listing.featured}
              />
            ))}
          </div>
          
          {filteredListings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No listings found in this category.</p>
            </div>
          )}
          
          {/* Pagination */}
          {filteredListings.length > 0 && (
            <div className="flex justify-center mt-8">
              <Pagination
                total={totalPages}
                initialPage={1}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                showControls
                size="lg"
                radius="full"
                classNames={{
                  item: "bg-gray-100 text-gray-800",
                  cursor: "bg-[#006C54] text-white font-semibold"
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="md:py-10 pb-8">
        <div className="container mx-auto px-4">
          
          <div className="flex items-center gap-6 md:flex-row flex-col">
            {/* Navigation Arrows */}
            <div className="hidden md:flex flex-col items-center justify-center w-[calc(25%-24px)] h-64">
            <div className="flex flex-col gap-4 ">
            <div>
            
            <h6 className="font-semibold">What people say about us</h6>
            <h2 className="font-semibold text-4xl">{userData.name}</h2>
            </div>
              <div className="flex gap-4">
                <Button 
                  isIconOnly 
                  radius="lg"
                  className={` bg-[#CFE9DC] border-2 border-gray-200 ${reviewsPage === 0 ? 'text-gray-300' : 'text-gray-700'}`}
                  onClick={handlePrevReviews}
                  isDisabled={reviewsPage === 0}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <Button 
                  isIconOnly 
                  radius="lg"
                  className={` bg-[#006C54] text-white border-2  ${reviewsPage === maxReviewsPage ? 'text-gray-300' : 'text-white'}`}
                  onClick={handleNextReviews}
                  isDisabled={reviewsPage === maxReviewsPage}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </div>
            </div>
            </div>
            
            {/* Review Cards */}
            {visibleReviews.map(review => (
              <Card 
                key={review.id}
                className="w-full md:w-[calc(25%-24px)] border border-gray-200 shadow-sm"
                radius="lg"
              >
                <CardBody className="p-6 space-y-3">
                  <h3 className="text-lg font-semibold text-gray-800">{review.title}</h3>
                  <p className="text-gray-600 text-sm">{review.description}</p>
                  
                  <div className="flex items-center gap-1 pt-1">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon 
                        key={i} 
                        icon={faStar} 
                        className="text-yellow-400 text-lg"
                      />
                    ))}
                    <span className="ml-2 text-lg font-medium text-gray-700">{review.rating.toFixed(1)}</span>
                  </div>
                  
                  <div className="pt-3">
                    <User
                      name={review.user.name}
                      description={review.user.role}
                      avatarProps={{
                        src: review.user.avatar,
                        size: "sm"
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            ))}
            
            {/* Mobile Navigation */}
            <div className="flex justify-center w-full mt-6 md:hidden">
              <div className="flex gap-4">
                <Button 
                  isIconOnly 
                  radius="lg"
                  className={` bg-[#CFE9DC] border-2 border-gray-200 ${reviewsPage === 0 ? 'text-gray-300' : 'text-gray-700'}`}
                  onClick={handlePrevReviews}
                  isDisabled={reviewsPage === 0}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
                <Button 
                  isIconOnly 
                  radius="lg"
                  className={` bg-[#006C54] text-white border-2  ${reviewsPage === maxReviewsPage ? 'text-gray-300' : 'text-white'}`}
                  onClick={handleNextReviews}
                  isDisabled={reviewsPage === maxReviewsPage}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
