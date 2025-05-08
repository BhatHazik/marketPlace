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
import PackagesModal from "./PackagesModal";
import UseAPI from "../hooks/UseAPI";
import { toast } from "react-toastify";

/**
 * A reusable featured ad modal component
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {function} props.onClose Callback when modal is closed
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

const FeaturedModal = ({ isOpen, onClose, productId }) => {
    const [selectedPlan, setSelectedPlan] = useState("premium");
    const [isPackagesModal, setIsPackagesModal] = useState(false);
    const [packages, setPackages] = useState({
      basicPackages: [],
      businessPackages: {}
    });
    const [isLoading, setIsLoading] = useState(false);
    const { requestAPI, loading } = UseAPI();

    useEffect(() => {
      const fetchPackages = async () => {
        if (isOpen) {
          const response = await requestAPI('GET', '/packages');
          if (!response.error) {
            setPackages(response);
            // Default to first package if available
            if (response.basicPackages && response.basicPackages.length > 0) {
              setSelectedPlan(response.basicPackages[0].id.toString());
            }
          }
        }
      };
      
      fetchPackages();
    }, [isOpen]);

    // Find the selected package details
    const selectedPackageDetails = packages.basicPackages.find(pkg => pkg.id.toString() === selectedPlan.toString());

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
      // if (!selectedPackageDetails || !productId) {
      //   toast.error("Please select a package or try again later");
      //   return;
      // }

      setIsLoading(true);
      try {
        const orderData = {
          package_id: parseInt(selectedPlan),
          currency: selectedPackageDetails.currency,
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
        console.log("payment res",response)
        
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
        key: "rzp_test_c4VrwehUSLESCP", // Replace with your actual Razorpay key
        amount: orderData.amount, // Razorpay expects amount in paise
        currency: orderData.currency,
        name: "OLX Featured Ad",
        description: `Boost your ${selectedPackageDetails.package_name} for ${selectedPackageDetails.number_of_days} days`,
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
    <>
    
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
            Reach More Buyers And Sell Faster
          </h2>

          {/* Subtitle */}
          <p className="text-center text-gray-500 text-sm mb-0">
            Upgrade Your Ad To A Top Position
          </p>

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

          {/* Two Package Options */}
          <div className="flex flex-col w-full gap-4">
            {loading ? (
              <p className="text-center py-4">Loading packages...</p>
            ) : (
              <RadioGroup 
                label="Plans" 
                value={selectedPlan} 
                className="w-full" 
                color="default" 
                onValueChange={setSelectedPlan}
              >
                {packages.basicPackages.map((pkg) => (
                  <CustomRadio 
                    key={pkg.id}
                    description={`Reach Upto ${pkg.number_of_days === 30 ? '10' : '4'} times more buyers`} 
                    value={pkg.id.toString()}
                  >
                    <span className="flex gap-4">
                      Featured Ad For {pkg.number_of_days} Days 
                      <p className="font-semibold">
                        ({pkg.currencySymbol}{pkg.price_after_discount.toLocaleString()})
                      </p>
                    </span>
                  </CustomRadio>
                ))}
              </RadioGroup>
            )}
          </div>

          {/* Additional Green Backgrounded Section */}
          <div className="bg-green-100 w-full py-2 px-3 rounded-md text-gray-700 flex gap-2 items-center justify-between">
            <p className="text-sm">Heavy Discount on Business Packages</p>
            <button onClick={() => setIsPackagesModal(true)} className="px-2 py-1 text-sm border border-gray-500 text-gray-500 rounded hover:bg-green-200">
              View Package
            </button>
          </div>

          {/* Final Action Button */}
          <div className="text-center">
            <button 
              className="px-6 py-2 bg-[#006C54] text-white font-semibold rounded disabled:bg-gray-400"
              onClick={handlePayment}
              disabled={isLoading || loading || !selectedPackageDetails}
            >
              {isLoading 
                ? "Processing..." 
                : selectedPackageDetails 
                  ? `Pay ${selectedPackageDetails.currencySymbol}${selectedPackageDetails.price_after_discount.toLocaleString()}` 
                  : 'Pay'}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>

    <PackagesModal
      isOpen={isPackagesModal}
      onClose={() => setIsPackagesModal(false)}
      businessPackages={packages.businessPackages}
      productId={productId}
    />
    </>

  );
};

export default FeaturedModal;
