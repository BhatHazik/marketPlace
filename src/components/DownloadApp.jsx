import { Image } from "@heroui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileAlt, faShoppingCart, faLocationArrow, faComments } from "@fortawesome/free-solid-svg-icons";

const DownloadApp = () => {
  return (
    <div className="bg-green-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Download the OLX App
            </h2>
            <p className="text-gray-600 mb-6">
              Buy, sell, and find just about anything using the app on your mobile.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FontAwesomeIcon icon={faMobileAlt} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Easy to Use</h3>
                  <p className="text-sm text-gray-600">Simple, fast, and user-friendly interface</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Quick Selling</h3>
                  <p className="text-sm text-gray-600">Post ads and start selling in minutes</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FontAwesomeIcon icon={faLocationArrow} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location Based</h3>
                  <p className="text-sm text-gray-600">Find products near your location</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FontAwesomeIcon icon={faComments} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Real-time Chat</h3>
                  <p className="text-sm text-gray-600">Connect directly with buyers and sellers</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-72 h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-600 rounded-[40px] shadow-xl transform -rotate-6"></div>
              <div className="absolute inset-0 bg-white rounded-[40px] shadow-lg border-8 border-gray-800 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-6 bg-gray-800 flex justify-center items-center">
                  <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
                </div>
                <div className="pt-6">
                  <Image
                    src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                    alt="OLX Mobile App"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadApp; 