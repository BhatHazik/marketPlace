import { Image } from "@heroui/react";
import carTradeTech from "../assets/carTradeTech.png";
import carTrade from "../assets/carTrade.png";
import mobility from "../assets/mobility.png";
import carWale from "../assets/carWale.png";
import bikeWale from "../assets/bikeWale.png";

const BrandSection = () => {
  const brands = [
    { id: 1, name: "CarTradeTech", logo: carTradeTech },
    { id: 2, name: "CarTrade", logo: carTrade },
    { id: 3, name: "Mobility", logo: mobility },
    { id: 4, name: "CarWale", logo: carWale },
    { id: 5, name: "BikeWale", logo: bikeWale },
  ];

  return (
    <div className="bg-white py-10">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
          Trusted by Leading Brands
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-center justify-items-center">
          {brands.map((brand) => (
            <div key={brand.id} className="h-16 flex items-center">
              <Image
                src={brand.logo}
                alt={brand.name}
                className="max-h-10 max-w-[120px] object-contain grayscale hover:grayscale-0 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandSection; 