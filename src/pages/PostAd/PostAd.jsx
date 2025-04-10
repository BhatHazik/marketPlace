import React, { useEffect, useState } from "react";
import { Card, Accordion, AccordionItem, CardHeader, CardBody, CardFooter, Skeleton, Button } from "@heroui/react";
import "./PostAd.css";
import UseAPI from "../../hooks/UseAPI";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import notfound from "../../assets/notfound.svg";
import Empty from "../../components/Empty";
import { useNavigate } from "react-router-dom";

// Skeleton loading component
const SkeletonLoading = () => {
  return (
    <Card className="overflow-hidden flex-grow pt-2 mb-10" style={{ maxWidth: "600px" }}>
      <CardHeader className="flex items-center justify-center">
        <h2 className="text-center font-bold text-3xl app-text-green">Post Your Ad</h2>
      </CardHeader>
      <CardBody className="overflow-y-auto no-scrollbar">
        {/* Visual skeleton that mimics accordion appearance without using Accordion component */}
        <div className="border rounded-md overflow-hidden">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index} 
              className="py-3 px-4 border-b last:border-b-0 flex items-center justify-between"
            >
              <Skeleton className="h-6 w-40 rounded-md" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

const PostAd = () => {
  const {requestAPI, loading, error} = UseAPI();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await requestAPI('GET', '/categories');
      console.log("Categories API response:", response);
      
      if (response.status === "success") {
        setCategories(response.data || []);
      }
    };
    
    fetchCategories();
  }, []);

  const goToPostAdForm = (e, subcat, category) => {
    e.preventDefault();
    navigate("/post-ad/form", { state: { subcat, category } });
  };

  return (
    <div className="wrapper-postAd w-100 min-h-screen flex items-center justify-center">
      {loading ? (
        <SkeletonLoading />
      ) : categories.length ? (
        <Card className="overflow-hidden flex-grow pt-2 mb-10" style={{ maxWidth: "600px" }}>
          <CardHeader className="flex items-center justify-center">
            <h2 className="text-center font-bold text-3xl app-text-green">Post Your Ad</h2>
          </CardHeader>
          <CardBody className="overflow-y-auto no-scrollbar">
            <Accordion variant="bordered" className="overflow-hidden">
              {categories.map((category) => (
                <AccordionItem key={category.id} title={category.name}>
                  {category.subcategories && category.subcategories.length > 0 ? (
                    <div className="flex flex-col gap-2 pl-2">
                      {category.subcategories.map((subcat, index) => (
                        // Using a div wrapper with onClick to ensure click event works
                        <div 
                          key={index} 
                          onClick={(e)=>goToPostAdForm(e, subcat, category)}
                          className="cursor-pointer"
                        >
                          <Card
                            radius="sm"
                            className="p-3 border-0 pl-4 hover:bg-gray-50"
                          >
                            {typeof subcat === 'string' ? subcat : subcat.name}
                          </Card>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="cursor-pointer">
                      <Card
                        radius="sm"
                        className="p-3 border-0 pl-4 text-gray-500 hover:bg-gray-50"
                        
                      >
                        No subcategories found
                      </Card>
                    </div>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </CardBody>
        </Card>
      ) : (
        <Empty/>
      )}
    </div>
  );
};

export default PostAd;
