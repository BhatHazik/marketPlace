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
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import ProductCard from "../components/ProductCard";
import loginBackground from "../assets/loginBackground.png";
import SearchBar from "../components/SearchBar";
import { useNavigate, useParams } from "react-router-dom";
import UseAPI from "../hooks/UseAPI";
import {
  renderAccordionSkeletons,
  renderFilterSkeletons,
  renderSkeletons,
} from "../components/FreshListings";

const Listings = () => {
  // State variables
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
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
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedAdPostedTime, setSelectedAdPostedTime] = useState("this_week");

  // Ad posted time options
  const adPostedTimeOptions = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "This Year", value: "this_year" },
    { label: "2 years", value: "2_year" },
    { label: "3 years", value: "3_year" },
  ];

  const { search, category, catId } = useParams();
  // at the top of Listings.jsx
  const {
    requestAPI: fetchCategories,
    loading: loadingCategories,
    error: categoriesError,
  } = UseAPI();

  const {
    requestAPI: fetchCities,
    loading: loadingCities,
    error: citiesError,
  } = UseAPI();

  const {
    requestAPI: fetchAttributes,
    loading: loadingAttributes,
    error: attributesError,
  } = UseAPI();

  const {
    requestAPI: fetchProducts,
    loading: loadingProducts,
    error: productsError,
  } = UseAPI();

  const stateId = localStorage.getItem("selectedLocationId");
  const navigate = useNavigate();
  console.log("searchTerm", search);

  useEffect(() => {
    setSelectedCategory(catId);
    setSelectedSubcategory(category);
    console.log("category", category);
  }, [category, catId]);

  useEffect(() => {
    if (category || catId || selectedCategory || selectedSubcategory) {
      setOnlyInCategory(true);
    }
  }, [category, catId, selectedCategory, selectedSubcategory]);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  // Filter products based on selected filters
  // const filteredProducts = products.filter((product) => {
  //   // Filter by category
  //   if (selectedCategory !== "all" && product.category !== selectedCategory) {
  //     return false;
  //   }

  //   // Filter by subcategory if selected
  //   if (selectedSubcategory && product.subcategory !== selectedSubcategory) {
  //     return false;
  //   }

  //   // Filter by location
  //   if (
  //     selectedLocation !== "all" &&
  //     !product.location.toLowerCase().includes(selectedLocation.toLowerCase())
  //   ) {
  //     return false;
  //   }

  //   // Filter by price range
  //   if (product.price < priceRange[0] || product.price > priceRange[1]) {
  //     return false;
  //   }

  //   // Filter by search term
  //   if (
  //     searchTerm &&
  //     !product.title.toLowerCase().includes(searchTerm.toLowerCase())
  //   ) {
  //     return false;
  //   }

  //   return true;
  // });

  // Pagination
  // const itemsPerPage = 8; // 2 rows of 4 cards
  // const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // const paginatedProducts = filteredProducts.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

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
    const response = await fetchCities(
      "GET",
      `/location/countries/states/${stateId}/cities`
    );
    setcities(response.data);

    console.log("cities recieved", response.data);
  };

  const handleGetCategories = async () => {
    const response = await fetchCategories("GET", "/categories", null, {
      showErrorToast: false,
    });
    console.log(response);
    setCategories(response.data);
  };

  const handleGetAttributes = async () => {
    const response = await fetchAttributes(
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
    console.log("changed", filterName, value);
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

  const handleFetchListing = async () => {
    const location = localStorage.getItem("selectedLocation");
    let url = `/listings/search`;

    // Build path parts
    if (location) url += `/${location}`;
    if (selectedCity) url += `,${selectedCity}`;

    if (selectedSubcategory && onlyInCategory) url += `/${selectedSubcategory}`;
    if (searchTerm) url += `?searchQuery=${searchTerm}`;
    // Build query params
    let queryParams = `${searchTerm ? "&" : "?"}filter=price_between_${
      priceRange[0]
    }_to_${priceRange[1]}`;
    
    // Add ad posted time filter if selected
    if (selectedAdPostedTime) {
      queryParams += `,ads_posted_${selectedAdPostedTime}`;
    }
    
    // Add pagination
    queryParams += `&page=${currentPage}&limit=9`;
    
    // Add other filters
    if (query && onlyInCategory) queryParams += `,${query}`;

    url += queryParams;

    const response = await fetchProducts("GET", url, null, {
      showErrorToast: false,
    });

    console.log("productId",response.data);
    setProducts(response.data);
    setTotalPages(response?.pagination?.totalPages);

    console.log(selectedLocation);
    console.log(selectedSubcategory);
    console.log(url);
  };

  useEffect(() => {
    if (location) {
      handleFetchListing();
    }
  }, [
    priceRange,
    query,
    selectedCategory,
    selectedCity,
    selectedLocation,
    searchTerm,
    onlyInCategory,
    currentPage,
    selectedAdPostedTime,
  ]);

  useEffect(() => {
    setSelectedCity("");
  }, [selectedLocation]);

  useEffect(() => {
    setQuery("");
  }, [selectedSubcategory, selectedCategory]);

  useEffect(() => {
    if (!onlyInCategory) {
      setIsTopFilterVisible(false);
    } else {
      setIsTopFilterVisible(true);
    }
  }, [onlyInCategory]);

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
                {categories?.map((category) => (
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

            {/* Ad Posted Time Accordion */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Ads Posted Time
              </h3>
              <Accordion
                selectionMode="single"
                defaultExpandedKeys={["adPostedTime"]}
                variant="splitted"
                className="w-full"
              >
                <AccordionItem
                  key="adPostedTime"
                  title="Select Time Period"
                  startContent={
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-gray-500"
                    />
                  }
                >
                  <ScrollShadow className="max-h-36 overflow-y-auto category-scrollbar">
                    <RadioGroup
                      value={selectedAdPostedTime}
                      onValueChange={(value) => setSelectedAdPostedTime(value)}
                      className="gap-1"
                      orientation="vertical"
                    >
                      {adPostedTimeOptions.map((option) => (
                        <Radio key={option.value} value={option.value}>
                          {option.label}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </ScrollShadow>
                </AccordionItem>
              </Accordion>
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
                      onValueChange={(value) => setSelectedCity(value)}
                      className="gap-1"
                      orientation="vertical"
                    >
                      {cities?.map((location) => (
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
                {loadingCategories || !categories?.length
                  ? renderAccordionSkeletons(4) // show 4 skeleton accordion items while loading
                  : categories.map((category) => (
                      <AccordionItem
                        key={category.id}
                        title={`${category.name}`}
                        className="bg-[#F1F2F6] border-none shadow-none py-0"
                      >
                        <ScrollShadow className="max-h-40 overflow-y-auto category-scrollbar ">
                          <RadioGroup
                            value={selectedCategory}
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
                                value={String(sub.id)}
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

            {/* Ad Posted Time Accordion */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">
                Ad Posted Time
              </h3>
              <Accordion
                selectionMode="single"
                defaultExpandedKeys={["adPostedTime"]}
                variant="splitted"
                className="w-full"
              >
                <AccordionItem
                  key="adPostedTime"
                  title="Select Time Period"
                  startContent={
                    <FontAwesomeIcon
                      icon={faClock}
                      className="text-gray-500"
                    />
                  }
                >
                  <ScrollShadow className="max-h-36 overflow-y-auto category-scrollbar">
                    <RadioGroup
                      value={selectedAdPostedTime}
                      onValueChange={(value) => setSelectedAdPostedTime(value)}
                      className="gap-1"
                      orientation="vertical"
                    >
                      {adPostedTimeOptions.map((option) => (
                        <Radio key={option.value} value={option.value}>
                          {option.label}
                        </Radio>
                      ))}
                    </RadioGroup>
                  </ScrollShadow>
                </AccordionItem>
              </Accordion>
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
                {loadingCategories ? (
                  renderAccordionSkeletons(1)
                ) : (
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
                        onValueChange={(value) => setSelectedCity(value)}
                        className="gap-1"
                        orientation="vertical"
                      >
                        {cities?.map((location) => (
                          <Radio key={location.id} value={location.name}>
                            {location.name}
                            {/* <span className="text-gray-500 text-xs">({location.count})</span> */}
                          </Radio>
                        ))}
                      </RadioGroup>
                    </ScrollShadow>
                  </AccordionItem>
                )}
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

                      {selectedCategory && onlyInCategory && (
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
                    {selectedCategory && onlyInCategory && (
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
                  {loadingAttributes ? (
  renderFilterSkeletons(6)
) : (
  filter?.map((filter) => {
    if (filter.type === "text") return null;

    return (
      <div key={filter.id} className="flex items-start gap-2 mb-3">
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
  })
)}

                    
                  </div>
                </div>
              )}
            </div>

            {/* Product Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* {paginatedProducts.length > 0 ? ( */}
              {loadingProducts ? (
                renderSkeletons(9)
              ) : products?.length > 0 ? (
                
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    productId={product.id}
                    image={product.productValues.Photos[0]}
                    title={product.productValues.Title}
                    price={product.productValues.Price}
                    location={`${product.productLocation.city}`}
                    date={new Date(product.created_at).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                      }
                    )}
                    featured={product.is_sponsored}
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
            {/* {filteredProducts.length > 0 && ( */}
            {products?.length > 0 && (
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

            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
