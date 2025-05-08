import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  RadioGroup,
  useRadio,
  VisuallyHidden,
  cn,
  Select,
  SelectItem,
  Card
} from "@heroui/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PackagesModal from "./PackagesModal";
import FeaturedModal from "./FeaturedModal";
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

const ActivePlansModal = ({ isOpen, onClose, productId }) => {
    const [selectedPlan, setSelectedPlan] = useState("premium");
    const [isPackagesModal, setIsPackagesModal] = useState(false);
    const [viewMode, setViewMode] = useState("active-plans");
    const [activePlans, setActivePlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const { requestAPI } = UseAPI();

    console.log(productId);

    // Fetch active plans when the modal opens and viewMode is 'active-plans'
    useEffect(() => {
      const fetchActivePlans = async () => {
        if (isOpen && viewMode === "active-plans") {
          setLoading(true);
          try {
            const response = await requestAPI('GET', '/packages/user/packages');
            if (!response.error && response.data) {
              // Filter out packages with 0 remaining ads
              const availablePlans = response.data.filter(plan => plan.remaining_ads > 0);
              setActivePlans(availablePlans);
            }
          } catch (error) {
            console.error("Error fetching active plans:", error);
          } finally {
            setLoading(false);
          }
        }
      };

      fetchActivePlans();
    }, [isOpen, viewMode]);

    // Format date to "Month Day" format
    const formatExpiryDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return new Date(dateString || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      } catch (error) {
        return dateString;
      }
    };

    // Apply package to product
    const applyPackage = async (userPackageId) => {
      setLoading(true);
      try {
        const response = await requestAPI('POST', '/packages/boost-product', {
          product_id: productId,
          user_package_id: userPackageId
        });
        
        if (!response.error) {
          // Success, close the modal
          onClose();
          // Show success message
          toast.success("Your ad has been successfully boosted!");
          // Refresh the page to update the UI
          window.location.reload();
        }
      } catch (error) {
        console.error("Error applying package:", error);
        toast.error("Failed to apply package. Please try again.");
      } finally {
        setLoading(false);
      }
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

          {/* Selection Mode */}
          <div className="my-3">
            <Select 
              label="Select Option" 
              placeholder="Active Plans"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="w-full"
            >
              <SelectItem key="active-plans" value="active-plans">
                Active Plans
              </SelectItem>
              <SelectItem key="purchase" value="purchase">
                Purchase
              </SelectItem>
            </Select>
          </div>

          {viewMode === "active-plans" ? (
            <>
              {loading ? (
                <div className="py-8 text-center text-gray-600">Loading your active plans...</div>
              ) : activePlans.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-2">Your Active Plans</h3>
                  
                  {activePlans.map((plan) => (
                    <Card key={plan.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{plan.package.package_name}</h4>
                          <p className="text-sm text-gray-600">
                            {plan.package.package_type === "business" ? "Business" : "Basic"} Package
                          </p>
                          <p className="text-sm text-gray-600">
                            Expires on {formatExpiryDate(plan.expiry_date)}
                          </p>
                          <p className="text-sm font-medium text-[#006C54]">
                            {plan.remaining_ads} ad{plan.remaining_ads > 1 ? 's' : ''} remaining
                          </p>
                        </div>
                        <button 
                          onClick={() => applyPackage(plan.id)}
                          className="px-4 py-2 bg-[#006C54] text-white rounded-lg text-sm"
                        >
                          Apply
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-600">
                  <p>You don't have any active plans with remaining ads.</p>
                  <button 
                    onClick={() => setViewMode("purchase")}
                    className="mt-4 px-4 py-2 bg-[#006C54] text-white rounded-lg text-sm"
                  >
                    Purchase a Plan
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center mt-6 mb-4">
              <p className="mb-4">Proceed with your purchase to boost your ad visibility.</p>
              <button onClick={() => setIsPackagesModal(true)} className="px-6 py-2 bg-[#006C54] text-white font-semibold rounded">
                Continue
              </button>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>

    <FeaturedModal
      isOpen={isPackagesModal}
      onClose={() => setIsPackagesModal(false)}
      productId={productId}
    />
    </>

  );
};

export default ActivePlansModal;
