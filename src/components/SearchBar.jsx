import { Input, Select, SelectItem, Button, Spinner } from "@heroui/react";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import UseAPI from "../hooks/UseAPI";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const SearchBar = ({ className = "", containerClassName = "", width, onLocationChange, onLocationIdChange, detectedLocation }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [states, setStates] = useState([]);
  const [isLoadingStates, setIsLoadingStates] = useState(true);
  const { requestAPI } = UseAPI();
  const navigate = useNavigate();
  const site = useLocation();
  const {search, category, catId} = useParams();

  // Generate dynamic width style
  const getWidthStyle = () => {
    if (width) {
      return { width };
    }
    return {};
  };

  useEffect(()=>{
    setSearchTerm(search);
    console.log("searchTerm",search);
  },[search]);

  // Fetch states from API when component mounts
  useEffect(() => {
    const fetchStates = async () => {
      setIsLoadingStates(true);
      try {
        const countryId = localStorage.getItem("countryId") || "101"; 
        const response = await requestAPI(
          "GET", 
          `/location/countries/${countryId}/states`,
          null,
          { showErrorToast: false } // Don't show error toast for this request
        );
        console.log("countryId",countryId)
        console.log("response from states",response)
        if (response && response.data) {
          console.log("response.data",response.data)
          // Transform the API response into the format needed for the dropdown
          const stateOptions = response.data.map(state => ({
            key: state.name, // Use state name as key for API request
            label: state.name, // Display name to user
            id: state.id      // Keep ID for reference if needed
          }));
          console.log("stateOptions",stateOptions)
          
          setStates(stateOptions);
          
          // If states are loaded and either detected from geolocation or default selection
          if (stateOptions.length > 0) {
            // First check for geolocation-detected state
            if (detectedLocation) {
              // Find the matching state in our list
              const matchingState = stateOptions.find(
                state => state.key.toLowerCase() === detectedLocation.toLowerCase()
              );
              
              if (matchingState) {
                setLocation(matchingState.key);
                localStorage.setItem("selectedLocation", matchingState.key);
                localStorage.setItem("selectedLocationId", matchingState.id);
                
                if (onLocationChange) {
                  console.log("Location set from geolocation:", matchingState.key);
                  onLocationChange(matchingState.key);
                  onLocationIdChange(matchingState.id);
                }
                return; // Exit early as we've set the location
              }
            }
            
            // If no geolocation match or no detectedLocation, use stored or default
            const selectedLocation = localStorage.getItem("selectedLocation") || stateOptions[0].key;
            const selectedLocationID = localStorage.getItem("selectedLocationId") || stateOptions[0].id;
            setLocation(selectedLocation);
            
            if (onLocationChange) {
              console.log("got changed id");
              onLocationChange(selectedLocation);
              onLocationIdChange(selectedLocationID);
            }
          }
        } else {
          // If API fails, set some default states
          setStates([
            { key: "Delhi", label: "Delhi" },
            { key: "Maharashtra", label: "Maharashtra" },
            { key: "Karnataka", label: "Karnataka" },
            { key: "Tamil Nadu", label: "Tamil Nadu" },
            { key: "Jammu and Kashmir", label: "Jammu and Kashmir" }
          ]);
          
          // Set default location
          if (!location) {
            setLocation("Jammu and Kashmir");
            if (onLocationChange) {
              onLocationChange("Jammu and Kashmir");

            }
          }
        }
      } catch (err) {
        console.error("Error fetching states:", err);
        // Fallback states if API fails
        setStates([
          { key: "Delhi", label: "Delhi" },
          { key: "Maharashtra", label: "Maharashtra" },
          { key: "Karnataka", label: "Karnataka" },
          { key: "Tamil Nadu", label: "Tamil Nadu" },
          { key: "Jammu and Kashmir", label: "Jammu and Kashmir" }
        ]);
        
        // Set default location
        if (!location) {
          setLocation("Jammu and Kashmir");
          if (onLocationChange) {
            onLocationChange("Jammu and Kashmir");
          }
        }
      } finally {
        setIsLoadingStates(false);
      }
    };

    fetchStates();
  }, [detectedLocation]);

  const handleSearch = () => {
    const term = searchTerm.trim();
    if (!term) {
      navigate("/listings/search");
      return;
    }
  
    if (category) {
      navigate(`/listings/${term}/${category}/${catId}`);
    } else {
      navigate(`/listings/search/${term}`);
    }
  };

  const handleLocationChange = (value) => {
    const selectedLocation = value.target ? value.target.value : value.currentKey;
    console.log("Location changed to:", selectedLocation);
    setLocation(selectedLocation);
  
    const selectedState = states.find(state => state.key === selectedLocation);
    if (onLocationChange) {
      onLocationChange(selectedLocation);
    }
    if (onLocationIdChange && selectedState) {
      onLocationIdChange(selectedState.id);
    }
  };

  return (
    <div className={`flex px-4 sm:px-0 ${containerClassName}`}>
      {/* Desktop Version - Horizontal layout */}
      <div 
        className={`hidden md:flex items-center bg-white rounded-full shadow overflow-hidden border border-[#006C54] ${className}`}
        style={getWidthStyle()}
      >
        {/* Search Input Side */}
        <div className="flex-grow flex items-center pe-2">
          <div className="pl-5">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-400 text-xl"
            />
          </div>
          <Input
            color="default"
            type="text"
            placeholder="Search to buy"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full pl-2 border-0 shadow-none focus:ring-0 text-base "
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e.target.value)}
            
          />
        </div>
        
        {/* Divider - making sure it's the full height */}
        <div className="h-full w-px bg-gray-300"></div>
        
        {/* Location Dropdown */}
        <div className="flex items-center w-[25%] py-1 px-2">
          <Select
            selectedKeys={location ? [location] : []}
            selectionMode="single"
            onChange={handleLocationChange}
            className="border-0 shadow-none focus:ring-0"
            classNames={{
              trigger: "h-full flex items-center",
              value: "text-gray-700 font-medium",
              listboxWrapper: "rounded-xl mt-1",
            }}
            listboxProps={{
              itemClasses: {
                base: "text-sm",
              }
            }}
            placeholder={isLoadingStates ? "Loading..." : "Select location"}
            startContent={isLoadingStates ? <Spinner size="sm" /> : null}
            aria-label="Select location"
            isDisabled={isLoadingStates}
            indicator={<FontAwesomeIcon icon={faChevronDown} className="text-gray-700 ml-2" />}
          >
            {states.map((state) => (
              <SelectItem key={state.key} value={state.key} textValue={state.label}>
                {state.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Mobile Version - Vertical layout */}
      <div className="md:hidden flex flex-col w-full max-w-[400px] gap-2" style={getWidthStyle()}>
        {/* Search Input with icon */}
        <div className="flex items-center bg-white rounded-2xl shadow border border-[#006C54] overflow-hidden py-1 pe-1">
          <div className="pl-4">
            <FontAwesomeIcon
              icon={faSearch}
              className="text-gray-400 text-lg"
            />
          </div>
          <Input
            color="default"
            type="text"
            placeholder="Search to buy"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full pl-2 border-0 shadow-none focus:ring-0 text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        {/* Location Dropdown */}
        <div className="flex bg-white rounded-xl shadow border border-[#006C54] overflow-hidden">
          <Select
            selectedKeys={location ? [location] : []}
            selectionMode="single"
            onChange={handleLocationChange}
            className="w-full border-0 shadow-none focus:ring-0"
            classNames={{
              trigger: "h-full py-2 px-4 flex items-center",
              value: "text-gray-700 font-medium",
              listboxWrapper: "rounded-xl mt-1",
            }}
            listboxProps={{
              itemClasses: {
                base: "text-sm",
              }
            }}
            placeholder={isLoadingStates ? "Loading..." : "Select location"}
            startContent={isLoadingStates ? <Spinner size="sm" /> : null}
            aria-label="Select location"
            isDisabled={isLoadingStates}
            indicator={<FontAwesomeIcon icon={faChevronDown} className="text-gray-700 ml-2" />}
          >
            {states.map((state) => (
              <SelectItem key={state.key} value={state.key} textValue={state.label}>
                {state.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Search Button */}
        <Button 
          color="primary" 
          className="bg-[#006C54] rounded-lg h-10 mt-1 text-md font-[400]"
          onPress={handleSearch}
        >
          {/* <FontAwesomeIcon icon={faSearch} className="mr-2" /> */}
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;