import React, { useEffect, useState } from "react";
import {
  Input,
  Textarea,
  Button,
  Select,
  SelectItem,
  RadioGroup,
  Radio,
  Checkbox,
  CheckboxGroup,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Avatar,
  Chip,
} from "@heroui/react";
import "./PostAd.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCross, faInfoCircle, faXmark } from "@fortawesome/free-solid-svg-icons";
import UseAPI from "../../hooks/UseAPI";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import LoadingModal from "../../Modals/LoadingModal";
import FeaturedModal from "../../Modals/FeaturedModal";
import axios from "axios";
import BASE_URL from "../../config/url.config";
import { toast } from "react-toastify";
import ActivePlansModal from "../../Modals/ActivePlansModal";

const PostAdForm = () => {
  const { requestAPI, loading: apiLoading, error } = UseAPI();
  const navigate = useNavigate();
  // State for form data
  const [formData, setFormData] = useState({
    price: "",
    title: "",
    description: "",
    state: "",
    city: "",
  });
  const [attributes, setAttributes] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [countryId, setCountryId] = useState(null);
  const [countryName, setCountryName] = useState(null);
  const [imagesError, setImagesError] = useState(false);
  const [createdListing, setCreatedListing] = useState({});
  const [attributesLoading, setAttributesLoading] = useState(true);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // State for dynamic attribute values
  const [dynamicValues, setDynamicValues] = useState({});

  // State for cities dropdown
  const [cityData, setCityData] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // State for images
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // State for modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [createdAdId, setCreatedAdId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFeaturedModal, setIsFeaturedModal] = useState(false);

  const { state } = useLocation();
  const { subcat, category } = state || {};

  const getCountries = async () => {
    setLoadingCountries(true);
    try {
      const response = await requestAPI("GET", "/location/countries", null, {
        showErrorToast: false,
      });

      if (response.status === "success") {
        console.log("Countries response:", response);
        const rawData = response.data || [];
        // Log the first country to debug
        if (rawData.length > 0) {
          console.log("First country example:", rawData[0]);
        }
        setCountryData(rawData);

        // Deduplicate currency codes for backward compatibility
        const uniqueMap = new Map();
        rawData.forEach((country) => {
          const code = country.currency;
          if (code && !uniqueMap.has(code)) {
            uniqueMap.set(code, {
              id: country.id,
              name: country.name,
              code: country.currency,
              symbol: country.currency_symbol || "",
              name: country.currency_name || "",
            });
          }
        });

        const uniqueCurrencies = Array.from(uniqueMap.values());
        setCurrencies(uniqueCurrencies);
      } else {
        setCountryData([]);
        setCurrencies([]);
        setSelectedCurrency("USD");
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setCountryData([]);
      setCurrencies([]);
      setSelectedCurrency("USD");
    } finally {
      setLoadingCountries(false);
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  const getStates = async (id) => {
    try {
      const response = await requestAPI(
        "GET",
        `/location/countries/${countryId ? countryId : id}/states`,
        null,
        {
          showErrorToast: false,
        }
      );
      if (response.status === "success") {
        console.log("States response:", response);
        setStateData(response.data || []);
      } else {
        setStateData([]);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setStateData([]);
    }
  };
  useEffect(() => {
    console.log(countryId);
    if (countryId) {
      getStates();
    }
  }, [countryId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle country selection
  const handleCountryChange = (selectedCountryId) => {
    const selectedCountry = countryData.find(
      (country) => country.id.toString() === selectedCountryId
    );
    
    if (selectedCountry) {
      console.log("Selected Country:", selectedCountry);
      setCountryId(selectedCountry.id);
      setCountryName(selectedCountry.name);
      setSelectedCurrency(selectedCountry.currency);
      
      // Reset state and city
      setFormData({
        ...formData,
        state: "",
        city: "",
      });
      
      // Fetch states for the selected country
      getStates(selectedCountry.id);
    }
  };

  // Handle dynamic input changes
  const handleDynamicInputChange = (attributeId, value) => {
    console.log(`Setting value for attribute ${attributeId}:`, value);
    setDynamicValues((prev) => ({
      ...prev,
      [attributeId]: value,
    }));
  };

  // Handle state selection
  const handleStateChange = (value) => {
    // Find the state object to get its ID
    const selectedState = stateData.find(
      (state) => state.id.toString() === value
    );

    if (selectedState) {
      setFormData({
        ...formData,
        state: value,
        city: "",
      });

      // Fetch cities for the selected state
      fetchCities(selectedState.id);
    }
  };

  // Handle city selection
  const handleCityChange = (value) => {
    setFormData({
      ...formData,
      city: value,
    });
  };

  // Fetch cities for a state
  const fetchCities = async (stateId) => {
    setLoadingCities(true);
    try {
      const response = await requestAPI(
        "GET",
        `/location/countries/states/${stateId}/cities`,
        null,
        { showErrorToast: false }
      );
      if (response.status === "success") {
        setCityData(response.data || []);
      } else {
        setCityData([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCityData([]);
    } finally {
      setLoadingCities(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    console.log("Image files selected:", e.target.files);
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      console.log("No files selected");
      return;
    }

    if (imageFiles.length + files.length > 10) {
      alert("You can only upload up to 10 images");
      return;
    }

    // Add new files to existing ones
    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);

    // Generate previews for all images
    const newPreviews = [...imagePreviews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index) => {
    const newImageFiles = [...imageFiles];
    const newImagePreviews = [...imagePreviews];

    newImageFiles.splice(index, 1);
    newImagePreviews.splice(index, 1);

    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required dynamic fields
    let hasErrors = false;
    const missingFields = [];

    attributes.forEach((attr) => {
      if (
        attr.is_required &&
        (!dynamicValues[attr.id] ||
          (Array.isArray(dynamicValues[attr.id]) &&
            dynamicValues[attr.id].length === 0))
      ) {
        hasErrors = true;
        missingFields.push(attr.name);
      }
    });

    if (hasErrors) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }
    if (imageFiles.length === 0) {
      toast.error("Please add at least one image");
      setImagesError(true);
      return;
    } else {
      setImagesError(false);
    }

    // Format the data as required by the API
    const formattedAttributes = Object.keys(dynamicValues).map(
      (attributeId) => ({
        attribute_id: parseInt(attributeId),
        value: Array.isArray(dynamicValues[attributeId])
          ? dynamicValues[attributeId]
          : [dynamicValues[attributeId]],
      })
    );

    // Find state and city names from their IDs
    const selectedState = stateData.find(
      (state) => state.id.toString() === formData.state
    );
    const selectedCity = cityData.find(
      (city) => city.id.toString() === formData.city
    );

    const requestData = {
      subcategory_id: subcat?.id.toString(),
      attributes: formattedAttributes,
      normalDetails: {
        price: parseFloat(formData.price),
        title: formData.title,
        description: formData.description,
      },
      locationDetails: {
        country: countryName || "India",
        state: selectedState?.name || "",
        city: selectedCity?.name || "",
      },
    };
    const formDataToSend = new FormData();
    formDataToSend.append("data", JSON.stringify(requestData));

    // Append each image
    imageFiles.forEach((file) => {
      formDataToSend.append("photos", file);
    });
    console.log("Form data to submit:", requestData);

    // Show loading modal
    setIsSubmitting(true);
    setShowLoadingModal(true);
    const token = localStorage.getItem("token");

    try {
      // Send the data to the backend using axios instead of requestAPI
      const response = await axios.post(
        `${BASE_URL}/listings`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.data.status === "success") {
        console.log("Listing created successfully:", response.data);
        setCreatedAdId(response.data.data?.id || null);
        setCreatedListing(response.data.product);
        console.log(response.data.product.id)
        // Reset all form data
        resetFormData();

        // Show success modal after hiding loading modal
        setShowLoadingModal(false);
        setShowSuccessModal(true);
      } else {
        // Hide loading modal on error
        setShowLoadingModal(false);
        alert(response.data.message || "Error creating listing");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setShowLoadingModal(false);
      alert("There was an error posting your ad. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to reset all form data
  const resetFormData = () => {
    // Reset form fields
    setFormData({
      price: "",
      title: "",
      description: "",
      state: "",
      city: "",
    });

    // Reset dynamic values - either clear completely or reinitialize with defaults
    const initialValues = {};
    if (attributes.length > 0) {
      attributes.forEach((attr) => {
        if (attr.type.toLowerCase() === "checkbox") {
          initialValues[attr.id] = [];
        } else if (
          attr.type.toLowerCase() === "radio" &&
          attr.options &&
          attr.options.length > 0
        ) {
          initialValues[attr.id] = attr.options[0];
        } else {
          initialValues[attr.id] = "";
        }
      });
    }
    setDynamicValues(initialValues);

    // Clear images
    setImageFiles([]);
    setImagePreviews([]);
  };

  // Handle preview ad button click
  const handlePreviewAd = () => {
    if (createdAdId) {
      navigate(`/listings/${createdAdId}`);
    }
    setShowSuccessModal(false);
  };

  // Handle sell faster button click
  const handleSellFaster = () => {
    setIsFeaturedModal(true);

    setShowSuccessModal(false);
  };

  // Close the modal and go to home
  const handleSkipNow = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  // Render a dynamic form field based on its type
  const renderDynamicField = (attribute) => {
    const { id, name, type, options, is_required } = attribute;

    switch (type.toLowerCase()) {
      case "dropdown":
        return (
          <div className="py-1" key={id}>
            <Select
              label={name}
              placeholder={`Select ${name.toLowerCase()}`}
              onChange={(e) => {
                const selectedValue = e.target.value;
                console.log(`Selected ${name}:`, selectedValue);
                handleDynamicInputChange(id, selectedValue);
              }}
              variant="bordered"
              isRequired={is_required}
              className="w-full text-sm font-medium mb-0"
              value={dynamicValues[id] || ""}
              labelPlacement="outside"
              defaultSelectedKeys={dynamicValues[id] ? [dynamicValues[id]] : []}
            >
              {options.map((option, index) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </Select>
          </div>
        );

      case "radio":
        return (
          <div className="py-3" key={id}>
            <RadioGroup
              value={dynamicValues[id] || ""}
              onValueChange={(value) => handleDynamicInputChange(id, value)}
              orientation="horizontal"
              isRequired={is_required}
              label={name}
              classNames={{
                wrapper: "flex flex-wrap -mx-1 w-full",
                label: "text-sm font-medium mb-2 text-black",
              }}
            >
              {options.map((option, index) => (
                <div
                  key={index}
                  className="w-1/9 px-1 mb-2 border-2 border-gray-200 rounded-lg"
                >
                  <Radio
                    value={option}
                    required={is_required}
                    classNames={{
                      base: "m-0 w-full",
                      label:
                        "rounded-md cursor-pointer hover:border-gray-300 w-full flex justify-center text-center data-[selected=true]:border-primary-500 data-[selected=true]:bg-primary-50 transition-colors",
                    }}
                  >
                    {option}
                  </Radio>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "checkbox":
        return (
          <div className="py-1" key={id}>
            <p className="text-sm font-medium mb-2">{name}</p>
            <CheckboxGroup
              value={dynamicValues[id] || []}
              onValueChange={(values) => handleDynamicInputChange(id, values)}
            >
              {options.map((option, index) => (
                <Checkbox key={index} value={option}>
                  {option}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </div>
        );

      case "text":
      default:
        return (
          <div className="py-1" key={id}>
            <Input
              type="text"
              label={name}
              placeholder={`${options[0]}`}
              value={dynamicValues[id] || ""}
              onChange={(e) => handleDynamicInputChange(id, e.target.value)}
              variant="bordered"
              isRequired={is_required}
              className="w-full text-sm font-medium mb-2"
              labelPlacement="outside"
            />
          </div>
        );
    }
  };

  useEffect(() => {
    const getAttributes = async () => {
      setAttributesLoading(true);
      try {
        const response = await requestAPI(
          "GET",
          `/categories/subcategory/${subcat.id}/attributes`,
          null,
          { showErrorToast: false }
        );
        if (response.status === "success") {
          setAttributes(response.data);
          // Initialize dynamic values with empty defaults
          const initialValues = {};
          response.data.forEach((attr) => {
            if (attr.type.toLowerCase() === "checkbox") {
              initialValues[attr.id] = [];
            } else if (
              attr.type.toLowerCase() === "radio" &&
              attr.options &&
              attr.options.length > 0
            ) {
              // Set first radio option as default
              initialValues[attr.id] = attr.options[0];
            } else {
              initialValues[attr.id] = "";
            }
          });

          setDynamicValues(initialValues);
          console.log(response);
        }
      } catch (error) {
        console.error("Error fetching attributes:", error);
      } finally {
        setAttributesLoading(false);
      }
    };
    getAttributes();
  }, []);

  // Helper function to get country flag URL
  const getCountryFlagUrl = (countryCode) => {
    // Use country code to fetch flag from a flag API
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  };

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Header */}
      <div className="p-4 max-w-3xl mx-auto text-start">
        <h1 className="text-2xl font-bold text-gray-800">Selected Category</h1>
        <div className="text-md text-gray-500 flex items-start justify-start mt-1 w-full">
          <span>{category?.name}</span>
          <span className="mx-1">/</span>
          <span>{subcat?.name}</span>
          <button
            className="ml-2 text-[#006C54]"
            onClick={() => navigate("/postAd")}
          >
            Change
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 max-w-3xl mx-auto border border-gray-200 rounded-md"
      >
        {/* Dynamic attributes */}
        {(attributes.length > 0 || attributesLoading) && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-3 border-b pb-2">
              Include some details
            </h2>

            {/* Render dynamic form fields based on attributes from API */}
            {attributesLoading ? (
              <div className="flex justify-center items-center py-8 flex-col">
                <Spinner size="lg" color="success" className="mb-4" />
                <p>Loading attributes...</p>
              </div>
            ) : (
              <div className="space-y-1">
                {attributes.map((attribute) => renderDynamicField(attribute))}
              </div>
            )}
          </div>
        )}

        {/* Set price and title */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">
            Set a Price and Title
          </h2>

          <div className="mb-4">
            <Input
              type="number"
              label="Price"
              placeholder="Enter Price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              variant="bordered"
              isRequired={true}
              className="w-full"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">
                    {countryData?.find(c => c.id === countryId)?.currency_symbol || "$"}
                  </span>
                </div>
              }
            />
          </div>

          <div className="mb-4">
            <Input
              type="text"
              label="Title"
              placeholder="Enter a descriptive title for your ad"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              variant="bordered"
              required
              className="w-full"
            />
          </div>
        </div>

        {/* Images */}
        <div className="mb-8">
          {imagesError ? (
            <h2 id="imageErr" className="text-lg font-semibold text-danger mb-3 border-b pb-2">
              Add photos of Your Item *
            </h2>
          ) : (
            <h2 id="imageErr" className="text-lg font-semibold mb-3 border-b pb-2">
              Add photos of Your Item
            </h2>
          )}

          <div className="grid grid-cols-4 gap-2">
            {/* Image previews */}
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative aspect-square border border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-white"
              >
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="h-full w-full object-contain"
                />
                <Button
                  type="button"
                  size="sm"
                  isIconOnly
                  onPress={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                >
                  <FontAwesomeIcon icon={faXmark}/>
                </Button>
              </div>
            ))}

            {/* Add image button */}
            {imagePreviews.length < 10 && (
              <label className="aspect-square border border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                <FontAwesomeIcon
                  icon={faCamera}
                  className="text-3xl text-gray-400"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  multiple={true}
                  key={imagePreviews.length}
                />
                <p className="text-xs text-gray-500 mt-1">Add Photos</p>
              </label>
            )}

            {/* Empty boxes to fill the row */}
            {Array.from({
              length: Math.max(
                0,
                4 - imagePreviews.length - (imagePreviews.length < 10 ? 1 : 0)
              ),
            }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="aspect-square border border-gray-300 border-dashed rounded-md flex items-center justify-center bg-white"
              ></div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Photos will help sell your item faster. Add high-quality photos and
            more views.
          </p>
        </div>

        {/* More information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 border-b pb-2">
            More Information
          </h2>

          <div className="mb-4">
            <Textarea
              label="Description"
              placeholder="Describe your item's condition, features, and any other details"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              variant="bordered"
              required
              className="w-full"
              minRows={3}
            />
          </div>
          
          {/* Country Selection */}
          <div className="mb-4">
            <Select 
              label="Country"
              placeholder={loadingCountries ? "Loading countries..." : "Select country"}
              onChange={(e) => handleCountryChange(e.target.value)}
              variant="bordered"
              isRequired={true}
              className="w-full"
              isDisabled={loadingCountries}
              startContent={
                countryId ? (
                  <Avatar
                    alt="Country flag"
                    className="w-6 h-6"
                    src={`https://flagcdn.com/w40/${countryData?.find(c => c.id === countryId)?.iso2?.toLowerCase()}.png`}
                  />
                ) : null
              }
            >
              {countryData?.length > 0 ? (
                countryData.map((country) => (
                  <SelectItem 
                    key={country.id} 
                    value={country.id.toSt}
                    startContent={
                      <Avatar
                        alt={country.name}
                        className="w-6 h-6"
                        src={`https://flagcdn.com/w40/${country.iso2?.toLowerCase()}.png`}
                      />
                    }
                  >
                    {country.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key="no-countries" value="none" isDisabled>
                  No countries available
                </SelectItem>
              )}
            </Select>
          </div>

          {/* Location */}
          <div className="mb-4">
            <Select
              label="State"
              placeholder={!countryId ? `Select country first` : stateData.length === 0 ? "No states available" : "Select State"}
              onChange={(e) => handleStateChange(e.target.value)}
              variant="bordered"
              isRequired={true}
              errorMessage={() => {
                if (!formData.state) {
                  return "Please select a state";
                }
                return null;
              }}
              className="w-full"
              isDisabled={!countryId || stateData.length === 0}
            >
              {stateData.map((state) => (
                <SelectItem key={state.id} value={state.id.toString()}>
                  {state.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* City Dropdown (appears when state is selected) */}
          {formData.state && (
            <div className="mb-4">
              <Select
                label="City"
                placeholder={
                  loadingCities ? "Loading cities..." : cityData.length === 0 ? "No cities available" : "Select city"
                }
                onChange={(e) => handleCityChange(e.target.value)}
                variant="bordered"
                isRequired={true}
                className="w-full"
                isDisabled={loadingCities || cityData.length === 0}
              >
                {cityData?.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}
        </div>

        {/* Submit button - at the end of the form */}
        <div className="flex justify-center mt-8 mb-4">
          <Button
            type="submit"
            className="bg-[#006C54] text-white font-semibold hover:bg-[#005743] px-8"
            size="lg"
            disabled={attributesLoading || apiLoading || loadingCountries}
          >
            Post Your Ad
          </Button>
        </div>
      </form>

      <ActivePlansModal
        isOpen={isFeaturedModal}
        productId={createdListing?.id}
        onClose={() => setIsFeaturedModal(false)}
      />

      {/* Reusable Loading Modal */}
      <LoadingModal
        isOpen={apiLoading}
        message="Loading attributes..."
        spinnerColor="success"
      />

      {/* Loading Modal */}
      <Modal
        isOpen={showLoadingModal}
        hideCloseButton={true}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        backdrop="blur"
        placement="center"
        className="z-50"
      >
        <ModalContent>
          <ModalBody className="py-10 px-8 flex flex-col items-center">
            <div className="mb-3 ">
              <Spinner
                size="lg"
                variant="spinner"
                color="success"
                className="w-20 h-20"
              />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-center">
              Uploading Your Ad......
            </h2>
            <p className="text-gray-600 text-sm text-center">
              Your ad is being prepared. Please stay on this screen and do not
              exit.
            </p>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        backdrop="blur"
        placement="center"
        className="z-50"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 items-center border-b pb-4">
            <h2 className="text-2xl font-bold">Congratulations !</h2>
            <p className="text-gray-600 text-sm font-normal">
              Your Ad will go live shortly ....
            </p>
          </ModalHeader>
          <ModalBody className="py-6">
            <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-md mb-6">
              <FontAwesomeIcon icon={faInfoCircle} className="text-gray-500" />
              <p className="text-sm text-gray-600">
                OLX allows 1 free ad in 30 days for cars
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div style={{ width: "180px", height: "180px" }}>
                <DotLottieReact
                  src="https://lottie.host/d4df1133-8271-4edb-a0da-62f9da5b5fef/uNRjl1n8dh.lottie"
                  autoplay
                  loop
                />
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="font-semibold text-xl mb-2">
                Reach more buyers and sell faster
              </p>
              <p className="text-gray-600">Upgrade your Ad to a top position</p>
            </div>
          </ModalBody>
          <ModalFooter className="flex flex-col items-center">
            <div className="flex gap-3 w-full mb-4">
              <Button
                onPress={handleSellFaster}
                className="bg-[#006C54] text-white hover:bg-[#005743] flex-1"
              >
                Sell Faster Now
              </Button>
              <Button
                onClick={handlePreviewAd}
                variant="bordered"
                className="border-gray-300 flex-1"
              >
                Preview Ad
              </Button>
            </div>
            <button
              onClick={handleSkipNow}
              className="text-sm text-gray-500 hover:underline"
            >
              Skip for now
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PostAdForm;
