import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter, faYoutube, faGooglePlay, faApple } from "@fortawesome/free-brands-svg-icons";
import googlePlayIcon from "../assets/google_play.png";
import appStoreIcon from "../assets/app_store.png";
import olxLogo from "../assets/olx_logo.png";
import carTradeTechLogo from "../assets/carTradeTech.png";
import carTradeLogo from "../assets/carTrade.png";
import mobilityLogo from "../assets/mobility.png";
import carWaleLogo from "../assets/carWale.png";
import bikeWaleLogo from "../assets/bikeWale.png";
import { Image } from "@heroui/react";

const Footer = () => {
  return (
    <>
      <footer className="w-full bg-gray-100 py-8 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Popular Locations */}
            <div>
              <h3 className="text-sm font-bold uppercase mb-4">POPULAR LOCATIONS</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Kolkata</Link></li>
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Mumbai</Link></li>
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Chennai</Link></li>
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Pune</Link></li>
              </ul>
            </div>

            {/* Trending Locations */}
            <div>
              <h3 className="text-sm font-bold uppercase mb-4">TRENDING LOCATIONS</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Bhubaneshwar</Link></li>
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Hyderabad</Link></li>
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Chandigarh</Link></li>
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Nashik</Link></li>
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h3 className="text-sm font-bold uppercase mb-4">ABOUT US</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Tech@olx</Link></li>
                <li><Link to="/help" className="text-sm text-gray-600 hover:text-gray-900">Help</Link></li>
                <li><Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">Sitemap</Link></li>
                <li><Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Legal & Privacy Information</Link></li>
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Vulnerability Disclosure Program</Link></li>
              </ul>
            </div>

            {/* OLX */}
            <div>
              <h3 className="text-sm font-bold uppercase mb-4">OLX</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Blog</Link></li>
                <li><Link to="/" className="text-sm text-gray-600 hover:text-gray-900">Help</Link></li>
                <li><Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">Sitemap</Link></li>
                <li><Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms and Conditions</Link></li>
              </ul>
            </div>

            {/* Follow Us and Download */}
            <div className="flex flex-col">
              {/* Follow Us */}
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase mb-4">FOLLOW US</h3>
                <div className="flex space-x-4">
                  <Link to="/" className="text-gray-600 hover:text-gray-900">
                    <FontAwesomeIcon icon={faFacebook} size="lg" />
                  </Link>
                  <Link to="/" className="text-gray-600 hover:text-gray-900">
                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                  </Link>
                  <Link to="/" className="text-gray-600 hover:text-gray-900">
                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                  </Link>
                  <Link to="/" className="text-gray-600 hover:text-gray-900">
                    <FontAwesomeIcon icon={faYoutube} size="lg" />
                  </Link>
                </div>
              </div>
                
              {/* App Store Links */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="Download on App Store" 
                  className="h-12" 
                />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-12" 
                />
              </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Dark Footer with Company Logos */}
      <div className="w-full bg-[#002118] text-white py-20 relative">
        <div className="container mx-auto px-4">
          {/* Brand Logos Section */}
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 mb-12">
            {/* CarTrade Tech */}
            <div>
              <img src={carTradeTechLogo} alt="CarTrade Tech" className="h-16 brightness-0 invert" />
            </div>
            
            {/* BikeWale */}
            <div>
              <img src={bikeWaleLogo} alt="BikeWale" className="h-12 brightness-0 invert" />
            </div>
            
            {/* OLX */}
            <div className="mx-6">
              <img src={olxLogo} alt="OLX" className="h-16 brightness-0 invert" />
            </div>
            
            {/* CarWale */}
            <div>
              <img src={carWaleLogo} alt="CarWale" className="h-16 brightness-0 invert" />
            </div>
            
            {/* Mobility Outlook */}
            <div>
              <img src={mobilityLogo} alt="Mobility Outlook" className="h-12 brightness-0 invert" />
            </div>
            
            {/* CarTrade */}
            <div>
              <img src={carTradeLogo} alt="CarTrade" className="h-16 brightness-0 invert" />
            </div>
          </div>
          
          {/* Bottom Links */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 py-4 bg-[#002118]">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center text-sm font-semibold">
                <div className="flex items-center gap-1">
                  <Link to="/" className="hover:text-gray-300 underline">Help</Link>
                  <p>-</p>
                  <Link to="/" className="hover:text-gray-300 underline">Sitemap</Link>
                </div>
                <p className="mt-2 md:mt-0">All rights reserved © 2000-2024 OLX</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer; 