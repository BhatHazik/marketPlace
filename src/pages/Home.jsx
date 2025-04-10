import Hero from "../components/Hero";
import CategoriesSection from "../components/CategoriesSection";
import FeaturedListings from "../components/FeaturedListings";
import BrandSection from "../components/BrandSection";
import FreshListings from "../components/FreshListings";
import PostAdSection from "../components/PostAdSection";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeaturedListings />
      <FreshListings />
      <PostAdSection />
    </div>
  );
};

export default Home; 