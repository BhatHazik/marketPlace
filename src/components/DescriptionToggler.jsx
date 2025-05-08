import React, { useState } from "react";

const DescriptionToggler = ({ description, className = "text-gray-700 whitespace-pre-line" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to toggle "See More"
  const handleToggle = () => {
    setIsExpanded((prev) => !prev);
  };

  console.log("description", description);

  // Safeguard for undefined or null description
  const descriptionToShow = description || ""; // If description is undefined or null, use an empty string

  return (
    <div className={`${className} relative`}>
      <p
        className={`${
          !isExpanded ? "line-clamp-4" : "line-clamp-none"
        } overflow-hidden transition-all duration-300`}
      >
        {descriptionToShow}
      </p>

      {/* Show "See More" only if the description is longer than 4 lines */}
      <button
        onClick={handleToggle}
        className="absolute bottom-0 right-0 text-blue-500 mt-2"
        style={{ display: descriptionToShow.split("\n").length > 4 ? "block" : "none" }}
      >
        {isExpanded ? "See Less" : "See More"}
      </button>
    </div>
  );
};

export default DescriptionToggler;
