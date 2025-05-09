import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  RadioGroup,
  useRadio,
  VisuallyHidden,
  cn,
} from "@heroui/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Checkbox } from "@heroui/checkbox";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UseAPI from "../hooks/UseAPI";
import { toast } from "react-toastify";

/**
 * A reusable featured ad modal component
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {function} props.onClose Callback when modal is closed
 * @param {Object} props.businessPackages Business packages data from API
 * @param {number} props.productId ID of the product being boosted
 */

export const CustomRadio = (props) => {
  const {
    Component,
    children,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
        " cursor-pointer border-2 rounded-lg gap-4 p-4",
        "data-[selected=true]:border-[#006C54]"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      {/* <span {...getWrapperProps()}> */}
      <span {...getControlProps()} />
      {/* </span> */}
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};

const PackagesModal = ({ isOpen, onClose, businessPackages = {}, productId }) => {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { requestAPI } = UseAPI();
  
  // Create a mapping of package ID to day category
  const [packageDayMap, setPackageDayMap] = useState({});
  
  // Process business packages to create a map of packageId -> dayCategory
  useEffect(() => {
    const dayMap = {};
    
    // Process each day category
    Object.keys(businessPackages).forEach(days => {
      if (businessPackages[days] && Array.isArray(businessPackages[days])) {
        businessPackages[days].forEach(pkg => {
          dayMap[pkg.id] = days;
        });
      }
    });
    
    setPackageDayMap(dayMap);
  }, [businessPackages]);

  // Simple function to handle package selection
  const handleSelection = (id) => {
    // If the same package is clicked again, deselect it
    if (selectedPackageId === id) {
      setSelectedPackageId(null);
    } else {
      // Otherwise select this package
      setSelectedPackageId(id);
    }
  };

  // Get the selected package details
  const getSelectedPackage = () => {
    if (!selectedPackageId) return null;
    
    // Search through all categories for the selected package
    for (const days in businessPackages) {
      if (businessPackages[days] && Array.isArray(businessPackages[days])) {
        const found = businessPackages[days].find(pkg => pkg.id === selectedPackageId);
        if (found) return found;
      }
    }
    return null;
  };
  
  const selectedPackage = getSelectedPackage();

  // Function to initialize Razorpay
  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      
      script.onload = () => {
        resolve(true);
      };
      
      script.onerror = () => {
        resolve(false);
      };
      
      document.body.appendChild(script);
    });
  };

  // Function to create order
  const createOrder = async () => {
    // if (!selectedPackage || !productId) {
    //   toast.error("Please select a package to continue");
    //   return;
    // }

    setIsLoading(true);
    try {
      const orderData = {
        package_id: selectedPackageId,
        currency: selectedPackage.currency,
        product_id: productId
      };

      const response = await requestAPI('POST', '/packages/create-order', orderData);
      
      if (response.error) {
        toast.error("Failed to create order. Please try again.");
        return;
      }

      return response.data;
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Order creation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to verify payment
  const verifyPayment = async (transactionId, paymentId, orderId, signature) => {
    try {
      const verifyData = {
        transaction_id: transactionId,
        product_id: productId,
        razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature
      };

      const response = await requestAPI('POST', '/packages/verify-payment', verifyData);
      
      if (response.error) {
        toast.error("Payment verification failed. Please contact support.");
        return false;
      }

      toast.success("Payment successful! Your ad has been boosted.");
      onClose(); // Close the modal after successful payment
      return true;
    } catch (error) {
      toast.error("Payment verification failed. Please contact support.");
      console.error("Payment verification error:", error);
      return false;
    }
  };

  // Function to handle payment
  const handlePayment = async () => {
    const res = await initializeRazorpay();
    
    if (!res) {
      toast.error("Razorpay SDK failed to load. Please check your connection.");
      return;
    }
    
    const orderData = await createOrder();
    if (!orderData) return;

    const options = {
      key: VITE_RAZORPAY, // Replace with your actual Razorpay key
      amount: orderData.amount, // Razorpay expects amount in paise
      currency: orderData.currency,
      name: "OLX Business Package",
      description: `${selectedPackage.number_of_ads} Ad(s) for ${selectedPackage.number_of_days} days`,
      order_id: orderData.order_id,
      handler: async function (response) {
        // Handle successful payment with Razorpay response parameters
        const isVerified = await verifyPayment(
          orderData.transaction_id,
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature
        );
        if (isVerified) {
          // Any additional UI updates after successful payment
        }
      },
      prefill: {
        name: "User Name", // Can be fetched from user profile if available
        email: "user@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#006C54"
      }
    };
    
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton={false}
      isDismissable={true}
      isKeyboardDismissDisabled={false}
      backdrop="blur"
      placement="center"
      className="z-50"
      scrollBehavior="inside"
    >
      <ModalContent 
        className="mt-16 max-h-[90vh] overflow-y-auto md:mt-16 sm:mt-16 max-sm:mt-4 max-sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalBody className="">
          {/* Lottie Animation */}
          <div className="flex justify-center mt-2">
            <div className="w-32 h-32">
              <DotLottieReact
                src="https://lottie.host/d4df1133-8271-4edb-a0da-62f9da5b5fef/uNRjl1n8dh.lottie"
                autoplay
                loop
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-center">
          Heavy Discount On Packages
          </h2>


          {/* Light Green Info Section */}
          <div className="bg-green-50 w-full py-2 px-3 rounded-md text-gray-700 text-center mb-1">
            <p>Applicable for Car Category in Singapore</p>
          </div>

          {/* Featured Ad Section */}
          <h3 className="text-lg font-semibold m-0 mb-0">Featured Ad</h3>
          <ul className="list-disc list-inside text-gray-600 mb-0 text-sm">
            <li>Get noticed with the 'FEATURED' tag in a top position</li>
            <li>Highlighted to top positions</li>
          </ul>

          {/* 30 Days Plans */}
          {businessPackages['30'] && businessPackages['30'].length > 0 && (
            <div className="w-full border-t-1">
              <h3 className="text-md font-normal m-0 mb-0 mt-2">
                Featured Ad for 30 Days
              </h3>
              <ul className="list-disc list-inside text-gray-600 mb-0 text-sm">
                <li>Reach Upto 10 times more Buyers</li>
              </ul>
              <div className="grid grid-cols-1 rounded-md mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {businessPackages['30'].map((pkg) => (
                  <div key={pkg.id} className="relative border w-full rounded-md shadow-md overflow-hidden">
                    {pkg.discount_percentage !== "0%" && (
                      <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                        {pkg.discount_percentage}
                      </div>
                    )}

                    <div className="border-b flex justify-center items-center py-2">
                      <Checkbox 
                        isSelected={selectedPackageId === pkg.id}
                        onValueChange={() => handleSelection(pkg.id)}
                      >
                        {pkg.number_of_ads} {pkg.number_of_ads > 1 ? 'Ads' : 'Ad'}
                      </Checkbox>
                    </div>
                    <div className="flex flex-col items-center py-3">
                      <h3 className="font-semibold text-xl">{pkg.currencySymbol}{pkg.price_after_discount.toLocaleString()}</h3>
                      {pkg.price !== pkg.price_after_discount && (
                        <h3 className="line-through text-gray-400 font-light">
                          {pkg.currencySymbol}{pkg.price.toLocaleString()}
                        </h3>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7 Days Plans */}
          {businessPackages['7'] && businessPackages['7'].length > 0 && (
            <div className="w-full border-t-1">
              <h3 className="text-md font-normal m-0 mb-0 mt-2">
                Featured Ad for 7 Days
              </h3>
              <ul className="list-disc list-inside text-gray-600 mb-0 text-sm">
                <li>Reach Upto 4 times more Buyers</li>
              </ul>
              <div className="grid grid-cols-1 rounded-md mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {businessPackages['7'].map((pkg) => (
                  <div key={pkg.id} className="relative border w-full rounded-md shadow-md overflow-hidden">
                    {pkg.discount_percentage !== "0%" && (
                      <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                        {pkg.discount_percentage}
                      </div>
                    )}

                    <div className="border-b flex justify-center items-center py-2">
                      <Checkbox 
                        isSelected={selectedPackageId === pkg.id}
                        onValueChange={() => handleSelection(pkg.id)}
                      >
                        {pkg.number_of_ads} {pkg.number_of_ads > 1 ? 'Ads' : 'Ad'}
                      </Checkbox>
                    </div>
                    <div className="flex flex-col items-center py-3">
                      <h3 className="font-semibold text-xl">{pkg.currencySymbol}{pkg.price_after_discount.toLocaleString()}</h3>
                      {pkg.price !== pkg.price_after_discount && (
                        <h3 className="line-through text-gray-400 font-light">
                          {pkg.currencySymbol}{pkg.price.toLocaleString()}
                        </h3>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2 Days Plans */}
          {businessPackages['2'] && businessPackages['2'].length > 0 && (
            <div className="w-full border-t-1">
              <h3 className="text-md font-normal m-0 mb-0 mt-2">
                Featured Ad for 2 Days
              </h3>
              <ul className="list-disc list-inside text-gray-600 mb-0 text-sm">
                <li>Reach Upto 3 times more Buyers</li>
              </ul>
              <div className="grid grid-cols-1 rounded-md mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {businessPackages['2'].map((pkg) => (
                  <div key={pkg.id} className="relative border w-full rounded-md shadow-md overflow-hidden">
                    {pkg.discount_percentage !== "0%" && (
                      <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                        {pkg.discount_percentage}
                      </div>
                    )}

                    <div className="border-b flex justify-center items-center py-2">
                      <Checkbox 
                        isSelected={selectedPackageId === pkg.id}
                        onValueChange={() => handleSelection(pkg.id)}
                      >
                        {pkg.number_of_ads} {pkg.number_of_ads > 1 ? 'Ads' : 'Ad'}
                      </Checkbox>
                    </div>
                    <div className="flex flex-col items-center py-3">
                      <h3 className="font-semibold text-xl">{pkg.currencySymbol}{pkg.price_after_discount.toLocaleString()}</h3>
                      {pkg.price !== pkg.price_after_discount && (
                        <h3 className="line-through text-gray-400 font-light">
                          {pkg.currencySymbol}{pkg.price.toLocaleString()}
                        </h3>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t-1 mt-1">
            <h2 className="text-xl font-semibold ms-2 mt-2">Need Help ?</h2>
            <div className="bg-green-50 p-4 pt-2 mt-2">
            <ul className="list-inside list-none text-gray-600 mb-0 text-sm my-2 flex flex-col gap-4">
            <li className="flex gap-2 items-center"><FontAwesomeIcon icon={faPhone} />Call us on - 1860-258-3333</li>
            <li className="flex gap-2 items-center"> <FontAwesomeIcon icon={faEnvelope} />Email on - support@olx.in</li>
          </ul>
            </div>
          </div>

          {/* Purchase Button */}
          <div className="text-center my-4">
            <button 
              className={`px-6 py-2 ${selectedPackage ? 'bg-[#006C54] text-white' : 'bg-gray-300 text-gray-600'} font-semibold rounded`}
              disabled={!selectedPackage || isLoading}
              onClick={handlePayment}
            >
              {isLoading 
                ? "Processing..." 
                : selectedPackage 
                  ? `Purchase for ${selectedPackage.currencySymbol}${selectedPackage.price_after_discount.toLocaleString()}` 
                  : 'Select a package to purchase'
              }
            </button>
          </div>

        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PackagesModal;
