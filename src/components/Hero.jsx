import { Button } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMobile, faHouse, faTv, faCouch, faBicycle } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import loginBackground from "../assets/loginBackground.png";

const Hero = () => {
  return (
    <div className="relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-50 z-0" 
        style={{ backgroundImage: `url(${loginBackground})` }}
      ></div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
        <div className="text-center mb-8">
          {/* Title and Subtitle with Blur Background */}
          <div className=" mx-auto p-6 backdrop-blur-sm bg-white/30 rounded-lg mb-10">
            <h1 className="text-3xl md:text-6xl font-bold text-[#054537] mb-4">
              Sell Your Home & Unused Products
              <br />Effortlessly on OLX
            </h1>
            <p className="text-[#054537] text-lg max-w-sm mx-auto">
              Declutter Your Space and Earn Extra Income by Selling
              Unused Items on OLX.
            </p>
          </div>
          
          {/* Post Ads Button */}
          <div className="flex justify-center mb-8">
            <Link to="/postAd">
              <Button 
                // size="sm" 
                color="success" 
                className="bg-[#006C54]  text-white px-5 py-4 text-lg font-semibold"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                Post Ads Now
              </Button>
            </Link>
          </div>
          
          {/* Search Bar */}
          <SearchBar />
        </div>
      </div>
      
      {/* Categories Section */}
      <div className="bg-[#006C54] py-6 md:py-8 relative z-10">
        <div className="container mx-auto px-2">
          {/* For larger screens - horizontal row */}
          <div className="hidden md:flex justify-center items-center flex-nowrap gap-4">
            <div className="w-[15%] flex flex-col items-center text-white border-r-2 border-white/30 px-2">
              <FontAwesomeIcon icon={faMobile} className="text-2xl mb-1" />
              <span className="text-xs font-medium">Smartphone</span>
            </div>
            <div className="w-[15%] flex flex-col items-center text-white border-r-2 border-white/30 px-2">
              <FontAwesomeIcon icon={faHouse} className="text-2xl mb-1" />
              <span className="text-xs font-medium">Houses</span>
            </div>
            <div className="w-[15%] flex flex-col items-center text-white border-r-2 border-white/30 px-2">
              <FontAwesomeIcon icon={faTv} className="text-2xl mb-1" />
              <span className="text-xs font-medium">Electronics</span>
            </div>
            <div className="w-[15%] flex flex-col items-center text-white border-r-2 border-white/30 px-2">
              <FontAwesomeIcon icon={faCouch} className="text-2xl mb-1" />
              <span className="text-xs font-medium">Furniture</span>
            </div>
            <div className="w-[15%] flex flex-col items-center text-white px-2">
              <FontAwesomeIcon icon={faBicycle} className="text-2xl mb-1" />
              <span className="text-xs font-medium">Bikes</span>
            </div>
          </div>
          
          {/* For mobile - grid layout */}
          <div className="grid grid-cols-3 justify-center gap-4 md:hidden">
            <div className="flex flex-col items-center text-white px-1">
              <FontAwesomeIcon icon={faMobile} className="text-2xl mb-1" />
              <span className="text-xs font-medium">Smartphone</span>
            </div>
            <div className="flex flex-col items-center text-white px-1">
              <FontAwesomeIcon icon={faHouse} className="text-2xl mb-1" />
              <span className="text-xs font-medium">Houses</span>
            </div>
            <div className="flex flex-col items-center text-white px-1">
              <FontAwesomeIcon icon={faTv} className="text-2xl mb-1" />
              <span className="text-xs font-medium">Electronics</span>
            </div>
            <div className="flex flex-col items-center text-white px-1">
              <FontAwesomeIcon icon={faCouch} className="text-2xl mb-1" />
              <span className="text-xs font-medium">Furniture</span>
            </div>
            <div className="flex flex-col items-center text-white px-1">
              <FontAwesomeIcon icon={faBicycle} className="text-2xl mb-1" />
              <span className="text-xs font-medium">Bikes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Separator - positioned to overlap with the next section */}
      <div className="relative z-20 mb-[-50px]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#ffffff" className="w-full h-auto">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default Hero; 