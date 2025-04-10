import React from "react";
import { Modal, ModalContent, ModalBody, Spinner } from "@heroui/react";

/**
 * A reusable loading modal component
 * @param {Object} props Component props
 * @param {boolean} props.isOpen Whether the modal is open
 * @param {function} props.onClose Callback when modal is closed (optional)
 * @param {string} props.message Custom message to display (default: "Loading...")
 * @param {boolean} props.isDismissable Whether the modal can be dismissed (default: false)
 * @param {string} props.spinnerColor Color of the spinner (default: "success")
 * @param {string} props.spinnerSize Size of the spinner (default: "lg")
 */
const LoadingModal = ({
  isOpen,
  onClose,
  message = "Loading...",
  isDismissable = false,
  spinnerColor = "success",
  spinnerSize = "lg"
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton={!isDismissable}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
      backdrop="blur"
      placement="center"
      className="z-50"
    >
      <ModalContent>
        <ModalBody className="py-10 px-8 flex flex-col items-center">
          <div className="mb-3">
            <Spinner
              size={spinnerSize}
              variant="spinner"
              color={spinnerColor}
              className="w-20 h-20"
            />
          </div>
          <h2 className="text-2xl font-semibold mb-2 text-center">{message}</h2>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LoadingModal; 