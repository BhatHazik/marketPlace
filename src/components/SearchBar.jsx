import { Input, Select, SelectItem, Button } from "@heroui/react";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faChevronDown } from "@fortawesome/free-solid-svg-icons";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("srinagar");

  const locations = [
    { key: "all", label: "All India" },
    { key: "srinagar", label: "Srinagar" },
    { key: "delhi", label: "Delhi" },
    { key: "mumbai", label: "Mumbai" },
    { key: "bangalore", label: "Bangalore" },
    { key: "chennai", label: "Chennai" },
    { key: "kolkata", label: "Kolkata" },
    { key: "hyderabad", label: "Hyderabad" },
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchTerm, "in", location);
    // Implementation for search functionality
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-0">
      {/* Desktop Version - Horizontal layout */}
      <div className="hidden md:flex w-full max-w-[600px] lg:w-[45%] items-center bg-white rounded-full shadow overflow-hidden border border-[#006C54]">
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
            className="w-full h-full pl-2 border-0 shadow-none focus:ring-0 text-base"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        {/* Divider - making sure it's the full height */}
        <div className="h-full w-px bg-gray-300"></div>
        
        {/* Location Dropdown */}
        <div className="flex items-center w-[25%] py-1 px-2">
          <Select
            defaultSelectedKeys={["srinagar"]}
            selectionMode="single"
            onChange={(value) => setLocation(value.currentKey)}
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
            aria-label="Select location"
            indicator={<FontAwesomeIcon icon={faChevronDown} className="text-gray-700 ml-2" />}
          >
            {locations.map((loc) => (
              <SelectItem key={loc.key} value={loc.key} textValue={loc.label}>
                {loc.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      {/* Mobile Version - Vertical layout */}
      <div className="md:hidden flex flex-col w-full max-w-[400px] gap-2">
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
            defaultSelectedKeys={["srinagar"]}
            selectionMode="single"
            onChange={(value) => setLocation(value.currentKey)}
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
            aria-label="Select location"
            indicator={<FontAwesomeIcon icon={faChevronDown} className="text-gray-700 ml-2" />}
          >
            {locations.map((loc) => (
              <SelectItem key={loc.key} value={loc.key} textValue={loc.label}>
                {loc.label}
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