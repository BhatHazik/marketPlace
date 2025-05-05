import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Accordion,
  AccordionItem,
  RadioGroup,
  Radio,
  Slider,
  Checkbox,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Pagination,
  ScrollShadow,
  Select,
  SelectItem,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faLocationDot,
  faChevronDown,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import ProductCard from "../components/ProductCard";
import loginBackground from "../assets/loginBackground.png";
import SearchBar from "../components/SearchBar";
import { useNavigate, useParams } from "react-router-dom";
import UseAPI from "../hooks/UseAPI";

const Listings = () => {
  // State variables
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [onlyInCategory, setOnlyInCategory] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTopFilterVisible, setIsTopFilterVisible] = useState(true);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cities, setcities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [filter, setfilter] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [numericFilters, setNumericFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  const { search, category, catId } = useParams();
  const { requestAPI, loading } = UseAPI();
  const stateId = localStorage.getItem("selectedLocationId");
  const navigate = useNavigate();
  console.log("searchTerm", search);

  useEffect(() => {
    setSelectedCategory(catId);
    setSelectedSubcategory(category);
  }, [category]);

  // // Sample product data - in a real app, this would come from an API
  // const products = [
  //   {
  //     id: 1,
  //     title: "Honda Civic 2022 - Perfect Condition",
  //     price: 550000,
  //     image:
  //       "https://s3-alpha-sig.figma.com/img/adb9/6f89/70406825b702ee3a292114d73bbfa8d1?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Oi9eJ1LlAECzV3rNQBnq442UgqjAYMTM7YIbBoBhAzFpzbRzg77CiLhIKBSV-jDlKZy3NX~lK92AOnRkgROhfLLCjvZEmYmG4JZcgC~e8U-pomCk7wU7umAsgkZFBjDFFQBnbgIM5if8I-ybJUzna93OfcU0P~m3qkkQBtQPbXwTpz4g9CVSAn4f-Y5fw~cv7X6lF6LEF0lJR99rElEKAuxBjJlS0jxE9OhG9VpndA5n9Kh59d0hiNSR5km3UJAbPSjijB585z-lHI93NHSGK7YzW3jgHX~IITlmuWWcOwM2k4qPqrYCTXMKALKEdQOuv6bwoMetlMl1PjuDmk6GXA__",
  //     location: "DHA, Karachi",
  //     date: "Apr 15",
  //     category: "vehicles",
  //     subcategory: "cars",
  //     featured: true,
  //   },
  //   {
  //     id: 2,
  //     title: "iPhone 13 Pro Max - 256GB - Perfect Condition",
  //     price: 285000,
  //     image:
  //       "https://images.unsplash.com/photo-1616348436168-de43ad0db179?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=481&q=80",
  //     location: "Gulshan-e-Iqbal, Karachi",
  //     date: "Apr 12",
  //     category: "electronics",
  //     subcategory: "mobile_phones",
  //     featured: true,
  //   },
  //   {
  //     id: 3,
  //     title: "5 Marla House for Sale in Bahria Town",
  //     price: 2500000,
  //     image:
  //       "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  //     location: "Bahria Town, Lahore",
  //     date: "Apr 08",
  //     category: "property",
  //     subcategory: "houses",
  //   },
  //   {
  //     id: 4,
  //     title: "Samsung 55 Inch 4K Smart LED TV",
  //     price: 120000,
  //     image:
  //       "https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  //     location: "Model Town, Lahore",
  //     date: "Apr 14",
  //     category: "electronics",
  //     subcategory: "tv_video_audio",
  //   },
  //   {
  //     id: 5,
  //     title: "Modern Corner Sofa Set - 7 Seater",
  //     price: 85000,
  //     image:
  //       "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  //     location: "F-10, Islamabad",
  //     date: "Apr 11",
  //     category: "furniture",
  //     subcategory: "sofa_chairs",
  //     featured: true,
  //   },
  //   {
  //     id: 6,
  //     title: "Brand new Cafe, Restaurant office chair",
  //     price: 1199,
  //     image:
  //       "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
  //     location: "Tilak Nagar, Delhi, Delhi",
  //     date: "Dec 09",
  //     category: "furniture",
  //     subcategory: "office_furniture",
  //     featured: true,
  //   },
  //   {
  //     id: 7,
  //     title: "MacBook Pro M1 - 16GB RAM - 512GB SSD",
  //     price: 325000,
  //     image:
  //       "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  //     location: "Clifton, Karachi",
  //     date: "Apr 15",
  //     category: "electronics",
  //     subcategory: "computers_accessories",
  //   },
  //   {
  //     id: 8,
  //     title: "Oppo Reno 6 - 8GB RAM - 128GB Storage",
  //     price: 75000,
  //     image:
  //       "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80",
  //     location: "Rawalpindi",
  //     date: "Apr 10",
  //     category: "electronics",
  //     subcategory: "mobile_phones",
  //   },
  //   {
  //     id: 9,
  //     title: "Toyota Corolla 2020 - Excellent Condition",
  //     price: 420000,
  //     image:
  //       "https://images.unsplash.com/photo-1619767886558-efdc259fd9b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  //     location: "Johar Town, Lahore",
  //     date: "Apr 18",
  //     category: "vehicles",
  //     subcategory: "cars",
  //   },
  //   {
  //     id: 10,
  //     title: "Dell XPS 15 - i7 11th Gen - 16GB RAM",
  //     price: 280000,
  //     image:
  //       "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1032&q=80",
  //     location: "DHA, Lahore",
  //     date: "Apr 17",
  //     category: "electronics",
  //     subcategory: "computers_accessories",
  //   },
  //   {
  //     id: 11,
  //     title: "Sony PlayStation 5 - Brand New - With Extra Controller",
  //     price: 140000,
  //     image:
  //       "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80",
  //     location: "Gulberg, Lahore",
  //     date: "Apr 16",
  //     category: "electronics",
  //     subcategory: "games_entertainment",
  //   },
  //   {
  //     id: 12,
  //     title: "Canon EOS R5 - Professional Camera - With 2 Lenses",
  //     price: 520000,
  //     image:
  //       "https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
  //     location: "Clifton, Karachi",
  //     date: "Apr 15",
  //     category: "electronics",
  //     subcategory: "cameras_accessories",
  //   },
  // ];


  // Filter products based on selected filters
  const filteredProducts = products.filter((product) => {
    // Filter by category
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }

    // Filter by subcategory if selected
    if (selectedSubcategory && product.subcategory !== selectedSubcategory) {
      return false;
    }

    // Filter by location
    if (
      selectedLocation !== "all" &&
      !product.location.toLowerCase().includes(selectedLocation.toLowerCase())
    ) {
      return false;
    }

    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    // Filter by search term
    if (
      searchTerm &&
      !product.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Pagination
  const itemsPerPage = 8; // 2 rows of 4 cards
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get selected category name
  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return "All Categories";
    const category = categories.find((cat) => cat.id === selectedCategory);
    return category ? category.name : "All Categories";
  };

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle subcategory selection
  const handleSubcategorySelect = (categoryId, newSubcatId) => {
    // find the category and subcat object
    const cat = categories.find((c) => c.id === categoryId);
    const sub = cat?.subcategories.find((sc) => String(sc.id) === newSubcatId);
    if (!sub) return;

    setSelectedCategory(newSubcatId); // subcategory ID (string)
    setSelectedSubcategory(sub.name); // subcategory name
    setCurrentPage(1);
  };

  // Toggle only top filters
  const toggleTopFilters = () => {
    setIsTopFilterVisible(!isTopFilterVisible);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const handleLocationChange = (location) => {
    console.log("Location changed in Home:", location);
    localStorage.setItem("selectedLocation", location);

    setSelectedLocation(location);
  };

  const handleLocationIdChange = (location) => {
    console.log("Location changed in Home:", location);
    localStorage.setItem("selectedLocationId", location);

    setSelectedLocationId(location);
  };

  const handleGetCities = async () => {
    const response = await requestAPI(
      "GET",
      `/location/countries/states/${stateId}/cities`
    );
    setcities(response.data);

    console.log("cities recieved", response.data);
  };

  const handleGetCategories = async () => {
    const response = await requestAPI("GET", "/categories", null, {
      showErrorToast: false,
    });
    console.log(response);
    setCategories(response.data);
  };

  const handleGetAttributes = async () => {
    const response = await requestAPI(
      "GET",
      `/categories/subcategory/${selectedCategory}/attributes`,
      null,
      { showErrorToast: false }
    );
    console.log(response.data);
    setfilter(response.data);
  };

  useEffect(() => {
    handleGetAttributes();
  }, [selectedCategory]);

  useEffect(() => {
    handleGetCities();
    handleGetCategories();
  }, [selectedLocationId]);

// Helper: Build the query string
const updateQuery = (options, numeric) => {
  const queryParts = [];

  // Non-numeric filters
  Object.entries(options).forEach(([key, value]) => {
    if (value) queryParts.push(`${key}-${value}`);
  });

  // Numeric filters (only when both min and max are present)
  Object.entries(numeric).forEach(([id, values]) => {
    const filterDef = filter.find((f) => f.id === Number(id));
    if (filterDef && values.min && values.max) {
      queryParts.push(
        `attribute_between_${filterDef.name}_${values.min}_to_${values.max}`
      );
    }
  });

  setQuery(queryParts.join(","));
};

// On non-numeric filter change
const handleSelectChange = (filterName, value) => {
  console.log("changed", filterName,value)
  setSelectedOptions((prev) => {
    const updated = { ...prev, [filterName]: value };
    updateQuery(updated, numericFilters);
    return updated;
  });
};

// On numeric input change
const handleMinMaxChange = (filterName, id, key, value) => {
  setNumericFilters((prev) => {
    const updatedFilter = {
      ...prev[id],
      [key]: value,
    };

    const updated = {
      ...prev,
      [id]: updatedFilter,
    };

    updateQuery(selectedOptions, updated);
    return updated;
  });
};


  const handleFetchListing = async() =>{
    const location = localStorage.getItem("selectedLocation");
    const response = await requestAPI("GET", `/listings/search/${location}${selectedCity}${selectedSubcategory && `/${selectedSubcategory}`}?filter=price_between_${priceRange[0]}_to_${priceRange[1]}${query && `,${query}`}` , null, {showErrorToast:false});
    console.log(response.data)
    console.log(selectedLocation)
    console.log(`/listings/search/${selectedLocation}${selectedSubcategory && `/${selectedSubcategory}`}?filter=price_between_${priceRange[0]}_to_${priceRange[1]}${query && `,${query}`}`)
  }

  

  useEffect(()=>{
    
    handleFetchListing();
  }, [priceRange, query, selectedCategory, selectedCity])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modified Hero Section */}
      <div className="relative">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-50 z-0"
          style={{ backgroundImage: `url(${loginBackground})` }}
        ></div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 pt-16 pb-12 relative z-10">
          <div className="text-center mb-4">
            {/* Title and Subtitle with Blur Background */}
            <div className="mx-auto p-4 backdrop-blur-sm bg-white/30 rounded-lg">
              <h1 className="text-2xl md:text-4xl font-bold text-[#054537] mb-2">
                Browse Products & Services
              </h1>
              <p className="text-[#054537] text-sm md:text-base max-w-sm mx-auto">
                Find exactly what you're looking for from trusted sellers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer for Filters */}
      <Drawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        placement="left"
        size="xs"
        motionProps={{
          variants: {
            enter: {
              x: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              x: -300,
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <DrawerContent>
          <DrawerHeader className="border-b">
            <h2 className="text-xl font-semibold">Filters</h2>
          </DrawerHeader>
          <DrawerBody>
            {/* Categories Accordion */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Categories
              </h3>
              <Accordion
                selectionMode="multiple"
                variant="splitted"
                className="w-full flex flex-col gap-2"
                shadow="none"
              >
                {categories.map((category) => (
                  <AccordionItem
                    key={category.id}
                    title={`${category.name}`}
                    className="bg-[#F1F2F6] border-none shadow-none py-0"
                  >
                    <ScrollShadow className="max-h-40 overflow-y-auto category-scrollbar ">
                      <RadioGroup
                        value={selectedCategory} // controls which radio is checked
                        onValueChange={(newSubcatId) =>
                          handleSubcategorySelect(category.id, newSubcatId)
                        }
                        orientation="vertical"
                        className="p-2"
                      >
                        {(!category.subcategories ||
                          category.subcategories.length === 0) && (
                          <span className="text-gray-500 text-xs">
                            No subcategories found!
                          </span>
                        )}
                        {category.subcategories.map((sub) => (
                          <Radio
                            key={sub.id}
                            value={String(sub.id)} // now a string
                            className="data-[selected=true]:text-[#006C54]"
                          >
                            {sub.name}
                          </Radio>
                        ))}
                      </RadioGroup>
                    </ScrollShadow>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Price Range Slider */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Price Range
              </h3>
              <div className="px-2">
                <Slider
                  label="Price"
                  step={5000}
                  minValue={0}
                  maxValue={1000000}
                  size="sm"
                  defaultValue={[0, 1000000]}
                  formatOptions={{ style: "currency", currency: "INR" }}
                  className="max-w-md"
                  value={priceRange}
                  onChange={setPriceRange}
                  showTooltip={true}
                  tooltipValueFormatOptions={{
                    style: "currency",
                    currency: "INR",
                  }}
                  classNames={{
                    base: "w-full gap-3",
                    track: "bg-gray-200",
                    filler: "bg-[#006C54]",
                    thumb: "bg-[#006C54]",
                    value: "text-sm",
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-700">₹0</span>
                  <span className="text-sm text-gray-700">₹1,000,000+</span>
                </div>
              </div>
            </div>

            {/* Locations Accordion */}
            <div className="mb-0">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Location
              </h3>
              <Accordion
                selectionMode="single"
                defaultExpandedKeys={["location"]}
                variant="splitted"
                className="w-full"
              >
                <AccordionItem
                  key="location"
                  title="Select Location"
                  startContent={
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-gray-500"
                    />
                  }
                >
                  <ScrollShadow className="max-h-36 overflow-y-auto category-scrollbar ">
                    <RadioGroup
                      value={selectedCity}
                      onValueChange={(value)=>setSelectedCity(value)}
                      className="gap-1"
                      orientation="vertical"
                    >
                      {cities.map((location) => (
                        <Radio key={location.id} value={location.name}>
                          {location.name}
                          {/* <span className="text-gray-500 text-xs">({location.count})</span> */}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </ScrollShadow>
                </AccordionItem>
              </Accordion>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content - Two Column Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Categories & Filters - Hidden on mobile */}
          <div
            className={`w-full md:w-1/4 bg-white rounded-lg h-max shadow p-4 hidden md:block transition-all duration-300 ease-in-out ${
              isFilterVisible
                ? "md:opacity-100 md:max-w-full"
                : "md:opacity-0 md:max-w-0 md:overflow-hidden md:p-0"
            }`}
          >
            {/* Categories Accordion */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Categories
              </h3>
              <Accordion
                selectionMode="multiple"
                variant="splitted"
                className="w-full flex flex-col gap-2"
                shadow="none"
              >
                {categories.map((category) => (
                  <AccordionItem
                    key={category.id}
                    title={`${category.name}`}
                    className="bg-[#F1F2F6] border-none shadow-none py-0"
                  >
                    <ScrollShadow className="max-h-40 overflow-y-auto category-scrollbar ">
                      <RadioGroup
                        value={selectedCategory} // controls which radio is checked
                        onValueChange={(newSubcatId) =>
                          handleSubcategorySelect(category.id, newSubcatId)
                        }
                        orientation="vertical"
                        className="p-2"
                      >
                        {(!category.subcategories ||
                          category.subcategories.length === 0) && (
                          <span className="text-gray-500 text-xs">
                            No subcategories found!
                          </span>
                        )}
                        {category.subcategories.map((sub) => (
                          <Radio
                            key={sub.id}
                            value={String(sub.id)} // now a string
                            className="data-[selected=true]:text-[#006C54]"
                          >
                            {sub.name}
                          </Radio>
                        ))}
                      </RadioGroup>
                    </ScrollShadow>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Price Range Slider */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Price Range
              </h3>
              <div className="px-2">
                <Slider
                  label="Price"
                  step={5000}
                  minValue={0}
                  maxValue={1000000}
                  size="sm"
                  defaultValue={[0, 1000000]}
                  formatOptions={{ style: "currency", currency: "INR" }}
                  className="max-w-md"
                  value={priceRange}
                  onChange={setPriceRange}
                  showTooltip={true}
                  tooltipValueFormatOptions={{
                    style: "currency",
                    currency: "INR",
                  }}
                  classNames={{
                    base: "w-full gap-3",
                    track: "bg-gray-200",
                    filler: "bg-[#006C54]",
                    thumb: "bg-[#006C54]",
                    value: "text-sm",
                  }}
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-700">₹0</span>
                  <span className="text-sm text-gray-700">₹1,000,000+</span>
                </div>
              </div>
            </div>

            {/* Locations Accordion */}
            <div className="mb-0">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Location
              </h3>
              <Accordion
                selectionMode="single"
                defaultExpandedKeys={["location"]}
                variant="splitted"
                className="w-full"
              >
                <AccordionItem
                  key="location"
                  title="Select Location"
                  startContent={
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-gray-500"
                    />
                  }
                >
                  <ScrollShadow className="max-h-36 overflow-y-auto category-scrollbar ">
                    <RadioGroup
                      value={selectedCity}
                      onValueChange={(value)=>setSelectedCity(value)}
                      className="gap-1"
                      orientation="vertical"
                    >
                      {cities.map((location) => (
                        <Radio key={location.id} value={location.name}>
                          {location.name}
                          {/* <span className="text-gray-500 text-xs">({location.count})</span> */}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </ScrollShadow>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Right Content - Search, Filters and Product Cards */}
          <div
            className={`w-full ${
              isFilterVisible ? "md:w-3/4" : "md:w-full"
            } transition-all duration-300 ease-in-out`}
          >
            {/* Search Bar and Filter Section */}
            <div className="mb-6 bg-white rounded-lg shadow p-4">
              <div
                className={`w-full ${
                  isTopFilterVisible
                    ? `${
                        selectedCategory && "border-b"
                      } mb-4 border-gray-200 pb-4`
                    : "mb-0 pb-0"
                }`}
              >
                {/* Mobile Layout - Stack */}
                <div className="flex flex-col w-full md:hidden">
                  {/* Controls + Checkbox Row */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex">
                      {/* Mobile Drawer Toggle */}
                      <Button
                        isIconOnly
                        variant="solid"
                        className="mr-2 bg-[#CEE9DC]"
                        onPress={() => setIsDrawerOpen(true)}
                      >
                        <FontAwesomeIcon
                          icon={faBars}
                          className="text-gray-700"
                        />
                      </Button>

                      {selectedCategory && (
                        <Button
                          isIconOnly
                          variant="solid"
                          className="bg-[#CEE9DC]"
                          onPress={toggleTopFilters}
                        >
                          <FontAwesomeIcon
                            icon={faFilter}
                            className="text-gray-700"
                          />
                        </Button>
                      )}
                    </div>
                    {selectedCategory && (
                      <Checkbox
                        isSelected={onlyInCategory}
                        onValueChange={setOnlyInCategory}
                        color="success"
                        className="data-[selected=true]:text-white text-nowrap flex justify-center bg-[#CEE9DC] rounded-full py-3"
                      >
                        {/* Only in {getSelectedCategoryName()} */}
                        Only in {selectedSubcategory}
                      </Checkbox>
                    )}
                    {/* Only in Category Checkbox - Mobile */}
                  </div>

                  {/* Search Bar - Full Width on Mobile */}
                  <div className="w-full">
                    <SearchBar
                      onLocationChange={handleLocationChange}
                      onLocationIdChange={handleLocationIdChange}
                      search={searchTerm}
                      className="w-full"
                      containerClassName="justify-center w-full"
                    />
                  </div>
                </div>

                {/* Desktop Layout - Horizontal */}
                <div className="hidden md:flex items-center">
                  <div className="flex items-center mr-4">
                    {/* Sidebar Toggle Button */}
                    <Button
                      isIconOnly
                      variant="solid"
                      className="mr-2 bg-[#CEE9DC]"
                      onPress={toggleSidebar}
                    >
                      <FontAwesomeIcon
                        icon={faBars}
                        className="text-gray-700"
                      />
                    </Button>

                    {/* Filter Toggle Button */}
                    {selectedCategory && (
                      <Button
                        isIconOnly
                        variant="solid"
                        className="bg-[#CEE9DC]"
                        onPress={toggleTopFilters}
                      >
                        <FontAwesomeIcon
                          icon={faFilter}
                          className="text-gray-700"
                        />
                      </Button>
                    )}
                  </div>

                  {/* Search Bar */}
                  <div className="flex-grow w-full">
                    <SearchBar
                      onLocationChange={handleLocationChange}
                      onLocationIdChange={handleLocationIdChange}
                      className="w-[80%]"
                      containerClassName="justify-center w-full bg"
                    />
                  </div>

                  {/* Only in Category Checkbox */}
                  {selectedCategory && (
                    <div className="ml-4 w-[30%]">
                      <Checkbox
                        isSelected={onlyInCategory}
                        onValueChange={setOnlyInCategory}
                        color="success"
                        className="data-[selected=true]:text-white text-nowrap flex justify-center bg-[#CEE9DC] rounded-full py-3 pl-3 pr-4"
                      >
                        {/* Only in {getSelectedCategoryName()} */}
                        Only in {selectedSubcategory}
                      </Checkbox>
                    </div>
                  )}
                </div>
              </div>

              {/* Filter Section - Redesigned */}
              {selectedCategory && (
                <div
                  className={`w-full overflow-hidden transition-all duration-300 ease-in-out ${
                    isTopFilterVisible
                      ? "max-h-[2000px] opacity-100 mt-4"
                      : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                  {filter?.map((filter) => {
        if (filter.type === "text") return null;

        return (
          <div key={filter.id} className="flex items-start gap-2">
            <div className="w-[25%] flex-shrink-0 text-gray-700 font-medium text-sm pt-2">
              {filter.name}:
            </div>

            {filter.isNumeric === false ? (
              <div className="w-[75%]">
                <Select
  selectedKeys={
    selectedOptions[filter.name] 
      ? new Set([selectedOptions[filter.name]]) 
      : new Set()
  }
  onSelectionChange={(keys) => {
    const value = Array.from(keys)[0] || "";
    handleSelectChange(filter.name, value);
  }}
  className="max-w-xs"
  placeholder={`Select ${filter.name}`}
>
  {filter.options.map((option) => (
    <SelectItem key={option} value={option}>
      {option}
    </SelectItem>
  ))}
</Select>
              </div>
            ) : (
              <div className="w-[75%] flex gap-2">
                <Input
                  type="number"
                  placeholder="From"
                  className="w-1/2 text-sm"
                  min={filter.min}
                  max={filter.max}
                  onChange={(e) =>
                    handleMinMaxChange(
                      filter.name,
                      filter.id,
                      "min",
                      e.target.value
                    )
                  }
                />
                <Input
                  type="number"
                  placeholder="To"
                  className="w-1/2 text-sm"
                  min={filter.min}
                  max={filter.max}
                  onChange={(e) =>
                    handleMinMaxChange(
                      filter.name,
                      filter.id,
                      "max",
                      e.target.value
                    )
                  }
                />
              </div>
            )}
            
          </div>
        );
      })}
      <div className="mt-4 text-sm text-blue-600">
        <strong>Generated Query:</strong> {query}
      </div>
                  </div>
                </div>
              )}
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    image={product.image}
                    title={product.title}
                    price={product.price}
                    location={product.location}
                    date={product.date}
                    featured={product.featured}
                  />
                ))
              ) : (
                <div className="col-span-3 py-8 text-center">
                  <p className="text-gray-500">
                    No products found matching your criteria.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredProducts.length > 0 && (
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
                    cursor: "bg-[#006C54] text-white font-semibold",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
