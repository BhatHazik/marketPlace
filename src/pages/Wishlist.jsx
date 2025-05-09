import { useState, useEffect } from "react";
import { 
  Card, 
  CardBody, 
  Button, 
  Skeleton, 
  Divider,
  Chip
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart, 
  faTrash, 
  faLocationDot, 
  faCalendarAlt, 
//   faMagnifyingGlassExclamation
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import UseAPI from "../hooks/UseAPI";
import BASE_URL from "../config/url.config";
import { toast } from "react-toastify";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import defaultImage from "../assets/placeholder-image.jpg";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const { requestAPI } = UseAPI();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        console.log("Fetching wishlist data...");
        const response = await requestAPI("GET", "/listings/wishlist/all", null, { 
          showErrorToast: true 
        });
        
        console.log("Wishlist response:", response);
        
        if (response && response.status === "success") {
          setWishlistItems(response.data || []);
        } else {
          toast.error(response?.message || "Failed to fetch wishlist items");
          setWishlistItems([]);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        toast.error("Could not load wishlist data. Please try again.");
        setWishlistItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const handleImageError = (productId) => {
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const removeFromWishlist = async (wishlistId) => {
    try {
      const response = await requestAPI("DELETE", `/listings/wishlist/${wishlistId}`, null, { 
        showErrorToast: true 
      });
      
      if (response && response.status === "success") {
        // Remove item from local state
        setWishlistItems(prev => prev.filter(item => item.id !== wishlistId));
        toast.success("Item removed from wishlist");
      } else {
        toast.error(response?.message || "Failed to remove from wishlist");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  const navigateToProduct = (productId) => {
    navigate(`/listings/${productId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  // Format wishlist items to match ProductCard props
  const formatWishlistItems = () => {
    return wishlistItems.map(item => {
      const product = item.Product;
      if (!product) return null;
      
      const productValues = product.productValues;
      const location = product.productLocation;
      
      return {
        productId: product.id,
        id: product.id,
        image: productValues?.Photos?.[0],
        title: productValues?.Title || "Untitled Product",
        price: productValues?.Price || 0,
        location: location ? `${location.city}, ${location.state}` : "Unknown location",
        date: formatDate(item.addedAt),
        featured: product.is_sponsored || false,
        wishlistId: item.id // Store the wishlist ID for removal
        
      };
    }).filter(item => item !== null);
  };

  // Render loading skeletons
  const renderSkeletons = () => {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {Array(8).fill().map((_, index) => (
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
        ))}
      </div>
    );
  };

  // Render empty wishlist state
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-10 my-6">
        <div className="w-40 h-40 mb-4">
          <DotLottieReact
            src="https://lottie.host/6b0e1a4c-9dee-4662-aa30-59c698fa790b/2fk9l4y5C3.lottie"
            autoplay
            loop
          />
        </div>
        <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Looks like you haven't added any items to your wishlist yet. Browse listings and click the heart icon to add items.
        </p>
        <Button 
          className="bg-[#006C54] text-white"
          onPress={() => navigate("/")}
        >
          Browse Listings
        </Button>
      </div>
    );
  };

  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated
  }

  const formattedItems = formatWishlistItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Wishlist</h1>
      
      {isLoading ? (
        renderSkeletons()
      ) : wishlistItems.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="mb-4">
            <p className="text-gray-500">{wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved</p>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {formattedItems.map((item) => (
              <ProductCard
                key={item.productId}
                productId={item.productId}
                image={item.image}
                title={item.title}
                price={item.price}
                location={item.location}
                date={item.date}
                wishlisted={true}
                featured={item.featured}
                // Add a custom action to remove from wishlist
                customActions={
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    className="text-rose-500 absolute right-2 top-2 bg-white/80 z-10"
                    onPress={() => removeFromWishlist(item.wishlistId)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist; 