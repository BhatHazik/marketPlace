import { Button, Card, Image } from "@heroui/react";
import guyWithLaptop from "../assets/guyWithLaptop.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

const PostAdSection = () => {
  return (
    <div className="px-4 sm:px-8 py-4 sm:py-6">
      <Card 
        shadow="sm"
        radius="lg"
        className="w-full bg-[#002118] rounded-2xl sm:rounded-3xl">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            {/* Left side - Image */}
            <div className="w-full md:w-2/5 relative">
              <div className="relative flex justify-center items-center">
                <div className="absolute inset-0 bg-[#006035] blur-3xl rounded-full"></div>
                <Image
                  src={guyWithLaptop}
                  width={400}
                  alt="Guy with laptop"
                  className="w-full h-auto rounded-lg object-cover object-center relative z-10"
                />
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-lg"></div>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="w-full md:w-3/5 text-white space-y-8 sm:space-y-20">
              <div className="space-y-3 sm:space-y-4 ps-4 sm:ps-6">
                <h2 className="text-3xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center md:text-left">
                  Post your ad now
                </h2>
                <p className="text-gray-200 w-full sm:w-[80%] md:w-[63%] text-xl sm:text-lg md:text-xl space-y-1 text-center md:text-left">
                  Do you have any extra product lying around your home
                  that you're not using? Why not sell them to make some
                  extra cash?
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-1 px-4 sm:ps-6 justify-center md:justify-start pb-6 sm:pb-0">
                <Button
                  className="bg-[#006C54] text-white font-[400] hover:bg-white hover:text-[#000] w-full sm:w-auto py-6 sm:py-4 md:text-lg text-xl"
                  size="lg"
                  radius="full"
                >
                  <FontAwesomeIcon icon={faPlusCircle} className="font-[300] mr-1" />
                  Post Ads
                </Button>
                <Button
                  className="text-white hover:bg-white/10 p-1 pe-3 font-[300] hover:text-[#000] hover:bg-white w-full sm:w-auto py-6 sm:py-4 md:text-lg text-lg"
                  size="lg"
                  variant="bordered"
                  radius="full"
                >
                  <div className="border-2 border-white hidden md:flex rounded-full ps-3 p-2 w-9 h-9 items-center justify-center">
                    <FontAwesomeIcon icon={faPlay} className="font-[200]" />
                  </div>

                    <FontAwesomeIcon icon={faPlay} className="font-[300] ps-6 mr-1 md:hidden" />
                 
                  Play Tutorial
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PostAdSection; 