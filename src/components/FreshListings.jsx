import { useState } from "react";
import ProductCard from "./ProductCard";
import { Button, Tabs, Tab } from "@heroui/react";
import { Link } from "react-router-dom";

const FreshListings = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  
  // Sample product data
  const products = [
    {
      id: 1,
      title: "Honda Civic 2022 - Perfect Condition",
      price: 550000,
      image: "https://s3-alpha-sig.figma.com/img/adb9/6f89/70406825b702ee3a292114d73bbfa8d1?Expires=1745193600&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Oi9eJ1LlAECzV3rNQBnq442UgqjAYMTM7YIbBoBhAzFpzbRzg77CiLhIKBSV-jDlKZy3NX~lK92AOnRkgROhfLLCjvZEmYmG4JZcgC~e8U-pomCk7wU7umAsgkZFBjDFFQBnbgIM5if8I-ybJUzna93OfcU0P~m3qkkQBtQPbXwTpz4g9CVSAn4f-Y5fw~cv7X6lF6LEF0lJR99rElEKAuxBjJlS0jxE9OhG9VpndA5n9Kh59d0hiNSR5km3UJAbPSjijB585z-lHI93NHSGK7YzW3jgHX~IITlmuWWcOwM2k4qPqrYCTXMKALKEdQOuv6bwoMetlMl1PjuDmk6GXA__",
      location: "DHA, Karachi",
      date: "Apr 15",
      category: "vehicles",
      featured: true
    },
    {
      id: 2,
      title: "iPhone 13 Pro Max - 256GB - Perfect Condition",
      price: 285000,
      image: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=481&q=80",
      location: "Gulshan-e-Iqbal, Karachi",
      date: "Apr 12",
      category: "mobile",
      featured: true
    },
    {
      id: 3,
      title: "5 Marla House for Sale in Bahria Town",
      price: 2500000,
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "Bahria Town, Lahore",
      date: "Apr 08",
      category: "property"
    },
    {
      id: 4,
      title: "Samsung 55 Inch 4K Smart LED TV",
      price: 120000,
      image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
      location: "Model Town, Lahore",
      date: "Apr 14",
      category: "electronics"
    },
    {
      id: 5,
      title: "Modern Corner Sofa Set - 7 Seater",
      price: 85000,
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "F-10, Islamabad",
      date: "Apr 11",
      category: "furniture",
      featured: true
    },
    {
      id: 6,
      title: "Brand new Cafe, Restaurant office chair",
      price: 1199,
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
      location: "Tilak Nagar, Delhi, Delhi",
      date: "Dec 09",
      category: "furniture",
      featured: true
    },
    {
      id: 7,
      title: "MacBook Pro M1 - 16GB RAM - 512GB SSD",
      price: 325000,
      image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80",
      location: "Clifton, Karachi",
      date: "Apr 15",
      category: "electronics"
    },
    {
      id: 8,
      title: "Oppo Reno 6 - 8GB RAM - 128GB Storage",
      price: 75000,
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80",
      location: "Rawalpindi",
      date: "Apr 10",
      category: "mobile"
    }
  ];

  // Filter products based on active category
  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const categories = [
    { key: "all", label: "All Categories" },
    { key: "vehicles", label: "Vehicles" },
    { key: "property", label: "Property" },
    { key: "mobile", label: "Mobile Phones" },
    { key: "electronics", label: "Electronics" },
    { key: "furniture", label: "Furniture" }
  ];

  return (
    <div className="bg-white pb-8 w-full">
      {/* Full width gradient header */}
      <div className="w-full bg-[linear-gradient(to_right,_rgba(0,108,84,0.1)_0%,_rgba(255,255,255,0.1)_100%)] mb-6 md:mb-8 py-8 ps-5">
        <div className="container mx-auto">
          <h2 className="text-xl md:text-3xl font-[400] text-gray-800 px-4">
            Fresh Listings
          </h2>
        </div>
      </div>
      
      {/* Full width product grid with container only for the grid itself */}
      <div className="container mx-auto px-3 md:px-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              title={product.title}
              price={product.price}
              location={product.location}
              date={product.date}
              featured={product.featured}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreshListings; 