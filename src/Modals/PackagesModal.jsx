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
import { Checkbox } from "@heroui/checkbox";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const PackagesModal = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState("premium");

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

          <div className="w-full border-t-1">
            <h3 className="text-md font-normal m-0 mb-0 mt-2">
              Featured Ad for 30 Days
            </h3>
            <ul className="list-disc list-inside text-gray-600 mb-0 text-sm">
              <li>Reach Upto 10 times more Buyers</li>
            </ul>
            <div className="grid grid-cols-1 rounded-md mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div className="relative border w-full rounded-md shadow-md overflow-hidden">
                {/* Ribbon */}
                <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                  95%
                </div>

                {/* Main Content */}
                <div className="border-b flex justify-center items-center py-2">
                  <Checkbox>5 Ads</Checkbox>
                </div>
                <div className="flex flex-col items-center py-3">
                  <h3 className="font-semibold text-xl">$2,199</h3>
                  <h3 className="line-through text-gray-400 font-light">
                    $2,950
                  </h3>
                </div>
              </div>

              <div className="relative border w-full rounded-md shadow-md overflow-hidden">
                {/* Ribbon */}
                <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                  95%
                </div>

                {/* Main Content */}
                <div className="border-b flex justify-center items-center py-2">
                  <Checkbox>3 Ads</Checkbox>
                </div>
                <div className="flex flex-col items-center py-3">
                  <h3 className="font-semibold text-xl">$1,799</h3>
                  <h3 className="line-through text-gray-400 font-light">
                    $1,950
                  </h3>
                </div>
              </div>

              <div className="relative border w-full rounded-md shadow-md overflow-hidden">
                {/* Ribbon */}
                <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                  95%
                </div>

                {/* Main Content */}
                <div className="border-b flex justify-center items-center py-2">
                  <Checkbox>1 Ads</Checkbox>
                </div>
                <div className="flex flex-col items-center py-3">
                  <h3 className="font-semibold text-xl">$2,199</h3>
                  <h3 className="line-through text-gray-400 font-light">
                    $2,950
                  </h3>
                </div>
              </div>

            </div>
          </div>


          <div className="w-full border-t-1">
            <h3 className="text-md font-normal m-0 mb-0 mt-2">
              Featured Ad for 7 Days
            </h3>
            <ul className="list-disc list-inside text-gray-600 mb-0 text-sm">
              <li>Reach Upto 4 times more Buyers</li>
            </ul>
            <div className="grid grid-cols-1 rounded-md mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div className="relative border w-full rounded-md shadow-md overflow-hidden">
                {/* Ribbon */}
                <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                  95%
                </div>

                {/* Main Content */}
                <div className="border-b flex justify-center items-center py-2">
                  <Checkbox>5 Ads</Checkbox>
                </div>
                <div className="flex flex-col items-center py-3">
                  <h3 className="font-semibold text-xl">$2,199</h3>
                  <h3 className="line-through text-gray-400 font-light">
                    $2,950
                  </h3>
                </div>
              </div>

              <div className="relative border w-full rounded-md shadow-md overflow-hidden">
                {/* Ribbon */}
                <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                  95%
                </div>

                {/* Main Content */}
                <div className="border-b flex justify-center items-center py-2">
                  <Checkbox>3 Ads</Checkbox>
                </div>
                <div className="flex flex-col items-center py-3">
                  <h3 className="font-semibold text-xl">$1,799</h3>
                  <h3 className="line-through text-gray-400 font-light">
                    $1,950
                  </h3>
                </div>
              </div>

              <div className="relative border w-full rounded-md shadow-md overflow-hidden">
                {/* Ribbon */}
                <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                  95%
                </div>

                {/* Main Content */}
                <div className="border-b flex justify-center items-center py-2">
                  <Checkbox>1 Ads</Checkbox>
                </div>
                <div className="flex flex-col items-center py-3">
                  <h3 className="font-semibold text-xl">$2,199</h3>
                  <h3 className="line-through text-gray-400 font-light">
                    $2,950
                  </h3>
                </div>
              </div>

            </div>
          </div>


          <div className="w-full border-t-1">
            <h3 className="text-md font-normal m-0 mb-0 mt-2">
              Featured Ad for 2 Days
            </h3>
            <ul className="list-disc list-inside text-gray-600 mb-0 text-sm">
              <li>Reach Upto 3 times more Buyers</li>
            </ul>
            <div className="grid grid-cols-1 rounded-md mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div className="relative border w-full rounded-md shadow-md overflow-hidden">
                {/* Ribbon */}
                <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                  95%
                </div>

                {/* Main Content */}
                <div className="border-b flex justify-center items-center py-2">
                  <Checkbox>5 Ads</Checkbox>
                </div>
                <div className="flex flex-col items-center py-3">
                  <h3 className="font-semibold text-xl">$2,199</h3>
                  <h3 className="line-through text-gray-400 font-light">
                    $2,950
                  </h3>
                </div>
              </div>

              <div className="relative border w-full rounded-md shadow-md overflow-hidden">
                {/* Ribbon */}
                <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                  95%
                </div>

                {/* Main Content */}
                <div className="border-b flex justify-center items-center py-2">
                  <Checkbox>3 Ads</Checkbox>
                </div>
                <div className="flex flex-col items-center py-3">
                  <h3 className="font-semibold text-xl">$1,799</h3>
                  <h3 className="line-through text-gray-400 font-light">
                    $1,950
                  </h3>
                </div>
              </div>

              <div className="relative border w-full rounded-md shadow-md overflow-hidden">
                {/* Ribbon */}
                <div className="absolute -right-6 -top-2 rotate-45 bg-[#006C54] text-white text-xs font-semibold px-5 py-1 pt-3 shadow-md rounded-md flex justify-center items-center">
                  95%
                </div>

                {/* Main Content */}
                <div className="border-b flex justify-center items-center py-2">
                  <Checkbox>1 Ads</Checkbox>
                </div>
                <div className="flex flex-col items-center py-3">
                  <h3 className="font-semibold text-xl">$2,199</h3>
                  <h3 className="line-through text-gray-400 font-light">
                    $2,950
                  </h3>
                </div>
              </div>

            </div>
          </div>

          <div className="border-t-1 mt-1">
            <h2 className="text-xl font-semibold ms-2 mt-2">Need Help ?</h2>
            <div className="bg-green-50 p-4 pt-2 mt-2">
            <ul className="list-inside list-none text-gray-600 mb-0 text-sm my-2 flex flex-col gap-4">
            <li className="flex gap-2 items-center"><FontAwesomeIcon icon={faPhone} />Call us on - 1860-258-3333</li>
            <li className="flex gap-2 items-center"> <FontAwesomeIcon icon={faEnvelope} />Email on - support@olx.in</li>
          </ul>
            </div>
          </div>

        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PackagesModal;
