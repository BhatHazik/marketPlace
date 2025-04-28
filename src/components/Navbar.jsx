import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarIcon, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import olxLogo from "../assets/olx_logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faBars, faXmark, faMessage, faInbox } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${navbarRef.current.offsetHeight}px`
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateNavbarHeight);
    updateNavbarHeight(); // Set initially

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateNavbarHeight);
      // Ensure body scroll is restored on unmount
      document.body.style.overflow = "";
    };
  }, []);

  // Effect to handle body scroll when mobile menu opens/closes
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Lock body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll when menu is closed
      document.body.style.overflow = "";
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSellButtonClick = () => {
    if (token) {
      navigate("/postAd");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav
      ref={navbarRef}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isSticky
          ? "bg-white backdrop-blur-lg shadow-[0_4px_10px_#006c554e]"
          : "bg-white"
      }`}
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-2">
          {/* Mobile Menu Toggle Button - Left side on mobile */}
          <div className="md:hidden flex items-center order-first">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-[#006C54] focus:outline-none"
            >
              <FontAwesomeIcon 
                icon={isMobileMenuOpen ? faXmark : faBars} 
                className="h-6 w-6" 
              />
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 ml-0 md:ml-0">
            <Link to="/">
              <img src={olxLogo} alt="OLX" className="w-16 md:w-20" />
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center mx-auto">
            {/* Dropdown 1 */}
            <div className="relative group mx-4">
              <button className="flex items-center text-gray-700 hover:text-[#006C54] font-bold">
                Explore
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-48 mt-2 origin-top-center bg-white backdrop-blur-xl rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-2 px-4 space-y-2">
                  <Link
                    to="/category/electronics"
                    className="block px-2 py-2 rounded-md text-gray-700 hover:bg-[#006c554e] hover:text-white"
                  >
                    Electronics
                  </Link>
                  <Link
                    to="/category/vehicles"
                    className="block px-2 py-2 rounded-md text-gray-700 hover:bg-[#006c554e] hover:text-white"
                  >
                    Vehicles
                  </Link>
                  <Link
                    to="/category/property"
                    className="block px-2 py-2 rounded-md text-gray-700 hover:bg-[#006c554e] hover:text-white"
                  >
                    Property
                  </Link>
                  <Link
                    to="/category/furniture"
                    className="block px-2 py-2 rounded-md text-gray-700 hover:bg-[#006c554e] hover:text-white"
                  >
                    Furniture
                  </Link>
                </div>
              </div>
            </div>

            {/* Dropdown 2 */}
            <div className="relative group mx-4">
              <button className="flex items-center text-gray-700 hover:text-[#006C54] font-bold">
                Todays Deals
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-48 mt-2 origin-top-center bg-white backdrop-blur-xl rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="py-2 px-4 space-y-2">
                  <Link
                    to="/location/newyork"
                    className="block px-2 py-2 rounded-md text-gray-700 hover:bg-[#006c554e] hover:text-white"
                  >
                    New York
                  </Link>
                  <Link
                    to="/location/losangeles"
                    className="block px-2 py-2 rounded-md text-gray-700 hover:bg-[#006c554e] hover:text-white"
                  >
                    Los Angeles
                  </Link>
                  <Link
                    to="/location/chicago"
                    className="block px-2 py-2 rounded-md text-gray-700 hover:bg-[#006c554e] hover:text-white"
                  >
                    Chicago
                  </Link>
                  <Link
                    to="/location/houston"
                    className="block px-2 py-2 rounded-md text-gray-700 hover:bg-[#006c554e] hover:text-white"
                  >
                    Houston
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Spacer to push buttons to the right */}
          <div className="flex-grow md:flex-grow-0"></div>

          {/* Buttons Section - Now only on right side */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {!token && (
                <Button
                  onPress={() => navigate("/login")}
                  className="bg-[#CFE9DC] h-12 "
                  size="lg"
                  radius="full"
                >
                  <p className="px-5 text-[#006C54] font-sm text-md">Login</p>
                </Button>
              )}
              <Button
                onPress={handleSellButtonClick}
                color="primary"
                className="bg-[#006C54] h-12"
                size="lg"
                radius="full"
              >
                <FontAwesomeIcon icon={faPlus} className="text-md font-md" />
                <p className="pe-3 font-md text-md">Sell</p>
              </Button>
              {token && ( 
                <>
                  <Link to="/messages">
                  <Avatar
                        onPress={() => navigate("/messages")}
                        isBordered
                        radius="lg"
                        className="cursor-pointer h-10 w-10 bg-[#CFE9DC]"
                        // classNames={{
                        //   base: "bg-gradient-to-br from-[#FFFFFF] to-[#FFFFFF]",
                        //   icon: "app-text-green",
                        // }}
                        icon={<FontAwesomeIcon icon={faInbox} className="text-[#006C54] text-xl font-md" />}
                      />
                  </Link>
                  <Dropdown>
                    <DropdownTrigger>
                      <Avatar
                        isBordered
                        radius="lg"
                        className="cursor-pointer h-10 w-10"
                        classNames={{
                          base: "bg-gradient-to-br from-[#FFFFFF] to-[#FFFFFF]",
                          icon: "app-text-green",
                        }}
                        icon={<AvatarIcon />}
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions">
                    <DropdownItem key="profile" textValue="My Profile"> <Link className="w-full h-full flex items-center justify-start" to="/user-profile/1">My Profile</Link></DropdownItem>
                    <DropdownItem key="settings" textValue="Settings"> <Link className="w-full h-full flex items-center justify-start" to="/settings">Settings</Link></DropdownItem>
                    <DropdownItem key="my_ads" textValue="My Ads">My Ads</DropdownItem>
                    <DropdownItem key="saved" textValue="Saved">Saved Items</DropdownItem>
                    <DropdownItem 
                      key="logout" 
                      textValue="Logout"
                      className="bg-[#006C54] text-white font-bold"
                      onPress={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                      }}
                    >
                      Logout
                    </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </>
              )}
            </div>

            {/* Mobile Buttons */}
            <div className="md:hidden flex items-center gap-3">
              {!token && (
                <Button
                  onPress={() => navigate("/login")}
                  className="bg-[#CFE9DC] h-8"
                  size="sm"
                  radius="full"
                >
                  <p className="px-2">Login</p>
                </Button>
              )}
              <Button
                onPress={handleSellButtonClick}
                color="primary"
                className="bg-[#006C54] h-8"
                size="sm"
                radius="full"
              >
                <FontAwesomeIcon icon={faPlus} className="" />
                <p className="pe-2">Sell</p>
              </Button>
              {token && (
                <>
                <Link to="/messages">
                  <Avatar
                        isBordered
                        radius="lg"
                        size="sm"
                        className="cursor-pointer h-8 w-8 bg-[#CFE9DC]"
                        // classNames={{
                        //   base: "bg-gradient-to-br from-[#FFFFFF] to-[#FFFFFF]",
                        //   icon: "app-text-green",
                        // }}
                        icon={<FontAwesomeIcon icon={faInbox} className="text-[#006C54] text-xl font-md" />}
                      />
                  </Link>
                  <Dropdown>
                    <DropdownTrigger>
                      <Avatar
                        isBordered
                        radius="lg"
                        size="sm"
                        className="cursor-pointer h-8 w-8"
                        classNames={{
                          base: "bg-gradient-to-br from-[#FFFFFF] to-[#FFFFFF]",
                          icon: "app-text-green",
                        }}
                        icon={<AvatarIcon />}
                      />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions">
                    <DropdownItem key="profile" textValue="My Profile"> <Link className="w-full h-full flex items-center justify-start" to="/user-profile/1">My Profile</Link></DropdownItem>
                    <DropdownItem key="settings" textValue="Settings"> <Link className="w-full h-full flex items-center justify-start" to="/settings">Settings</Link></DropdownItem>
                    <DropdownItem key="my_ads" textValue="My Ads">My Ads</DropdownItem>
                    <DropdownItem key="saved" textValue="Saved">Saved Items</DropdownItem>
                    <DropdownItem 
                      key="logout" 
                      textValue="Logout"
                      className="bg-[#006C54] text-white font-bold"
                      onPress={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                      }}
                    >
                      Logout
                    </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Now scrollable when needed */}
      <div 
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-lg fixed left-0 w-full overflow-y-auto`}
        style={{ 
          maxHeight: isMobileMenuOpen ? 'calc(100vh - 64px)' : '0', 
          top: '64px',
          zIndex: 40
        }}
      >
        <div className="px-4 pt-2 pb-4 space-y-2">
          {/* {!token && (
            <Link 
              to="/login" 
              className="block py-2 px-4 text-gray-700 hover:bg-[#006c554e] hover:text-white rounded-md"
            >
              Login
            </Link>
          )} */}
          {/* <div className="py-1 border-t border-gray-200"></div> */}
          <div className="font-bold text-gray-700 py-2">Explore</div>
          <Link 
            to="/category/electronics" 
            className="block py-2 px-4 text-gray-700 hover:bg-[#006c554e] hover:text-white rounded-md"
          >
            Electronics
          </Link>
          <Link 
            to="/category/vehicles" 
            className="block py-2 px-4 text-gray-700 hover:bg-[#006c554e] hover:text-white rounded-md"
          >
            Vehicles
          </Link>
          <Link 
            to="/category/property" 
            className="block py-2 px-4 text-gray-700 hover:bg-[#006c554e] hover:text-white rounded-md"
          >
            Property
          </Link>
          <Link 
            to="/category/furniture" 
            className="block py-2 px-4 text-gray-700 hover:bg-[#006c554e] hover:text-white rounded-md"
          >
            Furniture
          </Link>
          <div className="py-1 border-t border-gray-200"></div>
          <div className="font-bold text-gray-700 py-2">Today's Deals</div>
          <Link 
            to="/location/newyork" 
            className="block py-2 px-4 text-gray-700 hover:bg-[#006c554e] hover:text-white rounded-md"
          >
            New York
          </Link>
          <Link 
            to="/location/losangeles" 
            className="block py-2 px-4 text-gray-700 hover:bg-[#006c554e] hover:text-white rounded-md"
          >
            Los Angeles
          </Link>
          <Link 
            to="/location/chicago" 
            className="block py-2 px-4 text-gray-700 hover:bg-[#006c554e] hover:text-white rounded-md"
          >
            Chicago
          </Link>
          <Link 
            to="/location/houston" 
            className="block py-2 px-4 text-gray-700 hover:bg-[#006c554e] hover:text-white rounded-md"
          >
            Houston
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
