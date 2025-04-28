import React, { useState, useRef } from "react";
import { 
  Button, 
  Input,
  Avatar,
  Tabs,
  Tab,
  Divider
} from "@heroui/react";
import PhoneInput from "../components/PhoneCountry";

const Settings = () => {
  // State for user profile data
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("johndoe@example.com");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150?img=3");
  const fileInputRef = useRef(null);

  // Handle profile image click
  const handleProfileClick = () => {
    fileInputRef.current.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save changes to backend (placeholder)
    console.log("Saving changes:", { name, email, phone, countryCode, profileImage });
    // Show success message or handle accordingly
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 flex flex-col justify-start">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8 ms-5">Settings</h1>
        
        {/* Navigation Tabs */}
        <div className="mb-5">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button className="px-6 py-3 ms-6 text-gray-800 font-medium border-b-2 border-[#006C54]">
                Account
              </button>
              {/* <button className="px-6 py-3 text-gray-500 font-medium">
                Notifications
              </button>
              <button className="px-6 py-3 text-gray-500 font-medium">
                Privacy
              </button>
              <button className="px-6 py-3 text-gray-500 font-medium">
                Security
              </button> */}
            </div>
          </div>
        </div>
        
        {/* Settings Content */}
        <div className="bg-white p-6 md:w-[80%] w-full py-1">
          <form onSubmit={handleSubmit}>
            {/* Profile Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Your Profile</h2>
                  <p className="text-gray-500 mt-1">This is how others will see you on the site.</p>
                </div>
                
                {/* Profile Picture */}
                <div className="mt-4 md:mt-0 flex flex-col items-center">
                  <Avatar 
                    src={"https://s3-alpha-sig.figma.com/img/20bf/abf6/655da099786b5b0c095035cfcc6a5b4f?Expires=1745798400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=PT8drDQxq~5qh7YvA13bJOnf6miQ3GjyfEJD2dh-IjdXCVi5vObQbAT-EAn328eJsqhS~8mseXDDvIzVe3JB9GHKDnz9tZj1IJhriXEoshlLQGM2qRj9wIq-jXagpY47Tc~lqJJ2CG6cEVQtT6AnT2Lr0gYoDZxITic1swOTQjTAy9Cy0K4FbSRwQIcV9un3uPhz8u7aAdGx3O9cPzvzQIgZS-mAFI8goqnQLRfAAAAXAlAqWSn6Krq1XitAKdzhpEsayu-RWWBbfS0mGbjCCa3i2nKej004Nk4z5KEPfVT4o7BqhmsFU9Gm0QsEqIwp~0JnQHDE0wGUMiQbSd-T0Q__"} 
                    className="w-44 h-44 cursor-pointer hover:opacity-80 transition-opacity object-cover"
                    onClick={handleProfileClick}
                  />
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                  {/* <span className="text-sm text-gray-500 mt-2">Click to change</span> */}
                </div>
              </div>
              
              {/* <Divider className="my-6" /> */}
            </div>
            
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="md:w-[48%] w-full"
                  variant="bordered"
                  placeholder="Your full name"
                  required
                />
              </div>
              
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="md:w-[48%] w-full"
                  variant="bordered"
                  placeholder="Your email address"
                  required
                />
              </div>
              
              {/* Phone Input */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <PhoneInput
                  phoneValue={phone}
                  onPhoneChange={setPhone}
                  countryValue={countryCode}
                  onCountryChange={setCountryCode}
                  inputClassName="md:w-[40%] w-full"
                />
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-10">
              <Button 
                type="submit" 
                color="primary"
                className="bg-[#006C54] text-white px-6 py-2"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings; 