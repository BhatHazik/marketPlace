import CategoryCard from "./CategoryCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCar, 
  faHome, 
  faMobile, 
  faCouch, 
  faLaptop, 
  faTshirt, 
  faBriefcase, 
  faBicycle
} from "@fortawesome/free-solid-svg-icons";

const CategoriesSection = () => {
  const categories = [
    {
      id: 1,
      title: "Vehicles",
      icon: <FontAwesomeIcon icon={faCar} className="text-green-600 text-xl" />,
      link: "/category/vehicles"
    },
    {
      id: 2,
      title: "Property",
      icon: <FontAwesomeIcon icon={faHome} className="text-blue-600 text-xl" />,
      link: "/category/property"
    },
    {
      id: 3,
      title: "Mobile Phones",
      icon: <FontAwesomeIcon icon={faMobile} className="text-red-600 text-xl" />,
      link: "/category/mobile-phones"
    },
    {
      id: 4,
      title: "Furniture",
      icon: <FontAwesomeIcon icon={faCouch} className="text-yellow-600 text-xl" />,
      link: "/category/furniture"
    },
    {
      id: 5,
      title: "Electronics",
      icon: <FontAwesomeIcon icon={faLaptop} className="text-purple-600 text-xl" />,
      link: "/category/electronics"
    },
    {
      id: 6,
      title: "Fashion",
      icon: <FontAwesomeIcon icon={faTshirt} className="text-pink-600 text-xl" />,
      link: "/category/fashion"
    },
    {
      id: 7,
      title: "Jobs",
      icon: <FontAwesomeIcon icon={faBriefcase} className="text-indigo-600 text-xl" />,
      link: "/category/jobs"
    },
    {
      id: 8,
      title: "Sports",
      icon: <FontAwesomeIcon icon={faBicycle} className="text-orange-600 text-xl" />,
      link: "/category/sports"
    }
  ];

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Popular Categories
        </h2>
        <p className="text-gray-600 text-center mb-8">
          Browse through the most popular categories
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              icon={category.icon}
              title={category.title}
              link={category.link}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesSection; 