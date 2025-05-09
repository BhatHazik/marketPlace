import React, { useState, useEffect } from "react";
import UseAPI from "../hooks/UseAPI";
import { Avatar, Button, Card, Divider, Tabs, Tab, Pagination, CardBody, CardHeader, CardFooter, User, Skeleton } from "@heroui/react";
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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { requestAPI, loading } = UseAPI();
  const navigate = useNavigate();
  const {pathname} = useLocation();
  // State for user data and listings
  const [userData, setUserData] = useState({});
  const {id} = useParams();
  const [listings, setListings] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
  },[id])

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
      const response = await requestAPI('GET', `/users/listing/${id || localStorage.getItem("userId")}`);
      if (response && response.status === "success") {
        setUserData(response.data.userDetails);
        console.log(response.data)
        // Transform API response to match our existing structure
        const transformedListings = response?.data?.listings?.map(item => ({
          id: item.id,
          title: item.productValues.Title || "Untitled",
          price: item.productValues.Price || 0,
          image: item?.productValues?.Photos?.length === 1
  ? item.productValues.Photos
  : item?.productValues?.Photos?.length > 1
    ? item.productValues.Photos[0]
    : "https://via.placeholder.com/300"
,
          location: item.productLocation ? `${item.productLocation.city}, ${item.productLocation.state}` : "Unknown",
          date: new Date(item.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          status: item.status || "pending",
          featured: item.is_sponsored || false,
          wishlisted: item.isWishlisted,
          sponsored_until: new Date(item.sponsored_until || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        }));
        console.log("error?",transformedListings)
        setListings(transformedListings);
      }
    };
    
    fetchUserProfileData();
  }, [id]);

  const [selectedTab, setSelectedTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  const getFilteredListings = (status) => {
    if (status === "all") {
      return listings;
    }
    if (status === "sponsored"){
      return listings.filter(listing => listing?.featured === true);
    }
    if (status === "wishlist"){
      return wishlistItems;
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

  // Add a function to fetch wishlist items
  const fetchWishlistItems = async () => {
    if (selectedTab !== "wishlist") return;
    
    setLoadingWishlist(true);
    try {
      console.log("Fetching wishlist data for profile...");
      const response = await requestAPI("GET", "/listings/wishlist/all", null, { 
        showErrorToast: false 
      });
      
      if (response && response.status === "success") {
        // Transform wishlist items to match the listing format
        const transformedItems = response.data.map(item => {
          const product = item.Product;
          if (!product) return null;
          
          const productValues = product.productValues;
          const location = product.productLocation;
          
          return {
            id: product.id,
            title: productValues?.Title || "Untitled",
            price: productValues?.Price || 0,
            image: productValues?.Photos?.length > 0 
              ? productValues.Photos[0] 
              : "https://via.placeholder.com/300",
            location: location ? `${location.city}, ${location.state}` : "Unknown",
            date: new Date(item.addedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            status: product.status || "active",
            featured: product.is_sponsored || false,
            wishlisted: true,
            wishlist: true,
            wishlistId: item.id
          };
        }).filter(item => item !== null);
        
        setWishlistItems(transformedItems);
      } else {
        setWishlistItems([]);
      }
    } catch (error) {
      console.error("Error fetching wishlist for profile:", error);
      setWishlistItems([]);
    } finally {
      setLoadingWishlist(false);
    }
  };

  // Add effect to fetch wishlist when tab changes
  useEffect(() => {
    if (selectedTab === "wishlist") {
      fetchWishlistItems();
    }
  }, [selectedTab]);

  return (
    <div className="min-h-screen bg-white">
      {/* User Profile Section */}
      <div className="w-full bg-[#002118] shadow-md text-white">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:min-h-[250px]">
            {/* Left - User Avatar */}
            <div className="w-full md:w-1/4 flex justify-center md:justify-start">
              {loading ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-[#006035] blur-3xl rounded-full"></div>
                  <Skeleton className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full relative z-10" />
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute inset-0 bg-[#006035] blur-3xl rounded-full"></div>
                  <Avatar 
                    src={userData.avatar}
                    size="lg" 
                    className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 text-large rounded-full relative z-10"
                    alt={userData.name}
                  />
                </div>
              )}
            </div>
            
            {/* Middle - User Info and Action Buttons */}
            <div className="w-full md:w-2/5 flex flex-col space-y-6 mt-4 md:mt-0">
              {loading ? (
                <>
                  <Skeleton className="h-8 w-48 rounded-lg" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-36 rounded-lg" />
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </div>
                  <div className="flex align-items-center gap-4">
                    <Skeleton className="h-10 w-28 rounded-lg" />
                    <Skeleton className="h-10 w-28 rounded-lg" />
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
                  
                  <div className="flex items-center gap-4">
                    <span className="flex items-center text-gray-200">
                      <FontAwesomeIcon icon={faCheckCircle} className={`${userData.is_verified ? "text-green-500" : "text-gray-500"} mr-2`} />
                      {userData.is_verified ? "Verified User" : "Unverified User"}
                    </span>
                    {!userData?.isOnline ? (
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2 bg-[#CCCCCC]"></div>
                        <span className="text-[#CCCCCC]">Offline</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                        <span className="text-gray-200">Online</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex align-items-center gap-4">
                    <Button     
                      className="bg-[#006C54] text-white hover:bg-[#005743] m-0"
                      startContent={<FontAwesomeIcon icon={faMessage} />}
                      onPress={() => {
                        if(localStorage.getItem("userId").toString() === userData?.id?.toString()){
                          toast.info("You can't message your self.")
                        }
                        else{
                          console.log("its happening", userData?.id.toString(), localStorage.getItem("userId").toString())
                          // navigate(`/messages/${userData?.id}`)
                          handleMessageClick(userData?.id)
                        }
                      }}
                    >
                      Message
                    </Button>
                    
                    <Button 
                      className="bg-white text-green-500"
                      startContent={<FontAwesomeIcon icon={faWhatsapp} className="font-bold text-xl"/>}
                      onPress={() =>
                        window.open(
                          `https://wa.me/${userData?.phone_number}`,
                          "_blank"
                        )
                      }
                    >
                      WhatsApp
                    </Button>
                  </div>
                </>
              )}
            </div>
            
            {/* Right - Stats and Social Links */}
            <div className="w-full md:w-1/3 flex justify-center items-center self-center md:self-auto py-4 md:py-0">
              {/* Stats Section */}
              <div className="flex justify-center items-center w-full">
                {loading ? (
                  <>
                    <div className="flex flex-col items-center justify-center mx-4">
                      <Skeleton className="h-7 w-10 rounded-lg mb-1" />
                      <Skeleton className="h-5 w-16 rounded-lg" />
                    </div>
                    <div className="flex flex-col items-center justify-center mx-4">
                      <Skeleton className="h-7 w-10 rounded-lg mb-1" />
                      <Skeleton className="h-5 w-16 rounded-lg" />
                    </div>
                    <div className="flex flex-col items-center justify-center mx-4">
                      <Skeleton className="h-7 w-10 rounded-lg mb-1" />
                      <Skeleton className="h-5 w-16 rounded-lg" />
                    </div>
                    <div className="flex flex-col items-center justify-center mx-4">
                      <Skeleton className="h-6 w-24 rounded-lg mb-1" />
                      <Skeleton className="h-5 w-20 rounded-lg" />
                    </div>
                  </>
                ) : (
                  <>
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
                      {/* <div className="flex items-center text-gray-200 ">
                        <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                        <span className="text-sm font-light">{userData.location}</span>
                      </div> */}
                    </div>
                  </>
                )}
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
            {/* {loading ? (
              <>
                <Skeleton className="h-8 w-64 rounded-lg mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-10 w-20 rounded-lg" />
                  <Skeleton className="h-10 w-20 rounded-lg" />
                  <Skeleton className="h-10 w-20 rounded-lg" />
                  <Skeleton className="h-10 w-20 rounded-lg" />
                </div>
              </>
            ) : ( */}
              <>
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
                  {
                    pathname.includes(`/user-profile/${localStorage.getItem("userId")}`)  &&
                    <>
                    <Tab key="sold" title="Sold" />
                    <Tab key="rejected" title="Rejected" />
                    <Tab key="pending" title="Pending" />
                    <Tab key="wishlist" title="Wishlist" />
                    </>
                  }
                </Tabs>
              </>
            {/* )} */}
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mt-4">
            {loading || (selectedTab === "wishlist" && loadingWishlist) ? (
              // Skeleton for product cards - show when either main loading or wishlist loading (only when wishlist tab is active)
              Array(8).fill().map((_, index) => (
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
              getPaginatedListings().map((listing) => (
                <ProductCard
                  key={listing.id}
                  productId={listing.id}
                  image={listing.image}
                  title={listing.title}
                  price={listing.price}
                  location={listing.location}
                  date={listing.date}
                  featured={listing.featured}
                  sponsoredUntil={listing.sponsored_until}
                  wishlisted={listing.wishlisted}
                />
              ))
            )}
          </div>
          
          {!loading && filteredListings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No listings found in this category.</p>
            </div>
          )}
          
          {/* Pagination - only show when not loading and listings exist */}
          {!loading && filteredListings.length > 0 && (
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
                {loading ? (
                  <>
                    <div>
                      <Skeleton className="h-6 w-48 rounded-lg mb-2" />
                      <Skeleton className="h-10 w-56 rounded-lg" />
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <Skeleton className="h-10 w-10 rounded-lg" />
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
            
            {/* Review Cards */}
            {loading ? (
              // Skeleton for review cards
              Array(3).fill().map((_, index) => (
                <Card 
                  key={index}
                  className="w-full md:w-[calc(25%-24px)] border border-gray-200 shadow-sm"
                  radius="lg"
                >
                  <CardBody className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full rounded-lg" />
                      <Skeleton className="h-4 w-full rounded-lg" />
                      <Skeleton className="h-4 w-2/3 rounded-lg" />
                    </div>
                    
                    <div className="flex items-center gap-1 pt-1">
                      <Skeleton className="h-6 w-32 rounded-lg" />
                    </div>
                    
                    <div className="pt-3 flex items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-4 w-28 rounded-lg mb-1" />
                        <Skeleton className="h-3 w-20 rounded-lg" />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              visibleReviews.map(review => (
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
              ))
            )}
            
            {/* Mobile Navigation */}
            <div className="flex justify-center w-full mt-6 md:hidden">
              {loading ? (
                <div className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-10 w-10 rounded-lg" />
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
