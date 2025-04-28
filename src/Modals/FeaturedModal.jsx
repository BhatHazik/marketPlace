import React, { useState } from "react";
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

/**
 * A reusable featured ad modal component
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {function} props.onClose Callback when modal is closed
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

const FeaturedModal = ({ isOpen, onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState("premium");
    const [isPackagesModal, setIsPackagesModal] = useState(false);

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
      <ModalContent className="mt-16 max-h-[90vh] overflow-y-auto md:mt-16 sm:mt-16 max-sm:mt-4 max-sm:max-h-[85vh]">
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
            <RadioGroup label="Plans" value={selectedPlan} className="w-full" color="default" onValueChange={setSelectedPlan}>
              <CustomRadio description="Reach Upto 10 times more buyers" value="premium">
              <span className="flex gap-4">Featured Ad For 30 Days <p className="font-semibold">($2099)</p></span>
              </CustomRadio>
              <CustomRadio
                description="Reach Upto 4 times more buyers"
                value="pro"
                
              >
              <span className="flex gap-4">Featured Ad For 30 Days <p className="font-semibold">($1290)</p></span>
              </CustomRadio>
              
            </RadioGroup>
          </div>

          {/* Additional Green Backgrounded Section */}
          <div className="bg-green-100 w-full py-2 px-3 rounded-md text-gray-700 flex gap-2 items-center justify-between">
            <p className="text-sm">Heavy Discount on Business Packages</p>
            <button onClick={setIsPackagesModal} className="px-2 py-1 text-sm   border border-gray-500 text-gray-500  rounded hover:bg-green-200">
              View Package
            </button>
          </div>

          {/* Final Action Button */}
          <div className="text-center">
            <button className="px-6 py-2 bg-[#006C54] text-white font-semibold rounded">
              Pay $2,099
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>

    <PackagesModal
    isOpen={isPackagesModal}
    onClose={()=>setIsPackagesModal(false)}
    />
    </>

  );
};

export default FeaturedModal;
