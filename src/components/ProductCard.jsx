import { Card, Image, Button, Badge } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import defaultImage from "../assets/placeholder-image.jpg";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BASE_URL from "../config/url.config";
import ActivePlansModal from "../Modals/ActivePlansModal";
import UseAPI from "../hooks/UseAPI";

export const HeartIcon = ({
  fill = "#FF0000",
  filled,
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill={filled ? fill : "none"}
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.62 20.81c-.34.12-.9.12-1.24 0C8.48 19.82 2 15.69 2 8.69 2 5.6 4.49 3.1 7.56 3.1c1.82 0 3.43.88 4.44 2.24a5.53 5.53 0 0 1 4.44-2.24C19.51 3.1 22 5.6 22 8.69c0 7-6.48 11.13-9.38 12.12Z"
        stroke={filled ? "none" : "#000"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

const ProductCard = ({
  productId,
  image,
  title,
  price,
  location,
  date,
  featured = false,
  isSameUser = false,
  sponsoredUntil,
  wishlisted = false,
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [hearted, sethearted] = useState(wishlisted);
  const [isFeaturedModal, setIsFeaturedModal] = useState(false);
  const { id: userId } = useParams();
  const { pathname } = useLocation();
  const { requestAPI } = UseAPI();

  console.log(
    "product",
    productId,
    title,
    price,
    date,
    location,
    featured,
    image,
    sponsoredUntil
  );

  const handleCardPress = (e) => {
    console.log("Navigating to: ", `/previewAd/${productId}`);
    navigate(`/previewAd/${productId}`);
  };

  const handleWishlistToggle = async () => {
    // HeroUI Button doesn't pass a standard event object to onPress
    try {
      if (!hearted) {
        // Add to wishlist
        sethearted(true);
        const response = await requestAPI(
          "POST",
          `/listings/wishlist/add/${productId}`,
          {},
          { showErrorToast: false }
        );
      } else {
        // Remove from wishlist
        sethearted(false);
        const response = await requestAPI(
          "DELETE",
          `/listings/wishlist/remove/${productId}`,
          {},
          { showErrorToast: false }
        );
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  return (
    <div onClick={handleCardPress}>
      <Card
        radius="sm"
        className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${
          featured ? "border-l-4 border-l-green-600" : ""
        } border border-gray-200 relative`}
        onPress={handleCardPress}
      >
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={imageError ? defaultImage : `${BASE_URL}/${image}`}
            alt={title}
            className="w-full h-48 object-cover"
            style={{ display: "block" }}
            radius="none"
            removeWrapper
            onError={() => setImageError(true)}
            loading="lazy"
          />

          {localStorage.getItem("userId") && (
            <div
              className="absolute top-2 right-2 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                onPress={handleWishlistToggle}
                isIconOnly
                aria-label="Like"
                size="sm"
                radius="full"
                color="default"
              >
                <HeartIcon filled={hearted} size={"18"} />
              </Button>
            </div>
          )}
        </div>

        {/* Featured tag - below image, overlapping card content */}
        {featured && (
          <div className="absolute bottom-[calc(100%-205px)] left-4 z-20">
            <div className="bg-[#006C54] text-white px-3 py-1 text-sm font-medium rounded-md shadow-md">
              Featured
            </div>
          </div>
        )}

        <div
          className={`p-0 relative ${
            localStorage.getItem("userId") === userId
              ? "h-[180px]"
              : "h-[150px]"
          } flex flex-col`}
        >
          {featured && (
            <div className="absolute h-[90%] py-2 bg-[#006C54] w-1 bottom-0"></div>
          )}

          <div className="p-4 pt-6 pb-2 flex-grow">
            <p className="text-lg sm:text-xl font-bold text-gray-900">
              ₹ {price.toLocaleString()}
            </p>
            <h3 className="text-sm sm:text-base font-medium line-clamp-2 mt-1 text-gray-800">
              {title}
            </h3>
          </div>

          {pathname.includes(
            `/user-profile/${localStorage.getItem("userId")}`
          ) && (
            <div className="flex items-center justify-between px-4 py-2 border-y mb-2">
              {!featured && localStorage.getItem("userId") === userId ? (
                <Button
                  variant="text"
                  color="default"
                  size="sm"
                  className={`text-xs sm:text-sm font-medium bg-[#006C54] text-white ${
                    isSameUser ? "hidden" : ""
                  }`}
                  onPress={(e) => {
                    e && e.stopPropagation && e.stopPropagation();
                    setIsFeaturedModal(true);
                  }}
                >
                  Boost Ad
                </Button>
              ) : (
                <p>
                  Sponsored Until{" "}
                  <span className="font-bold">{sponsoredUntil}</span>
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between items-center px-4 pb-3 mt-auto">
            <div className="flex items-center text-gray-600 text-xs sm:text-sm">
              <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
              <span className="truncate max-w-[100px] sm:max-w-[150px]">
                {location}
              </span>
            </div>
            <div className="text-gray-500 text-xs sm:text-sm font-medium">
              {date}
            </div>
          </div>
        </div>
      </Card>

      <ActivePlansModal
        isOpen={isFeaturedModal}
        onClose={() => setIsFeaturedModal(false)}
        productId={productId}
      />
    </div>
  );
};

export default ProductCard;
