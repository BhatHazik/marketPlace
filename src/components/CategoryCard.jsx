import { Card, CardBody, Image } from "@heroui/react";
import { Link } from "react-router-dom";

const CategoryCard = ({ icon, title, link }) => {
  return (
    <Link to={link}>
      <Card 
        className="hover:shadow-md transition-shadow text-center cursor-pointer border border-gray-200"
        radius="lg"
      >
        <CardBody className="flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            {typeof icon === 'string' ? (
              <Image 
                src={icon} 
                alt={title} 
                className="w-8 h-8 object-contain"
              />
            ) : (
              icon
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
        </CardBody>
      </Card>
    </Link>
  );
};

export default CategoryCard; 