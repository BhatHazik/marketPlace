import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";

// Import components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import MobileNavbar from "./components/MobileNavbar";

// Import pages
import Home from "./pages/Home";
import Listings from "./pages/Listings";
import Login from "./pages/Login/Login";
import FlagSelect from "./components/FlagSelect";
import OTP from "./pages/OTP/OTP";
import { Bounce, ToastContainer } from "react-toastify";
import PostAd from "./pages/PostAd/PostAd";
import PostAdForm from "./pages/PostAd/PostAdForm";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/OTP"];
  const hideFooterRoutes = ["/login", "/OTP", "/postAd", "/post-ad/form"];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className={`flex-grow ${!hideNavbarRoutes.includes(location.pathname) ? "main-content" : ""}`}>
        {children}
      </div>
      {/* <MobileNavbar /> */}
      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <HeroUIProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/OTP" element={<OTP />} />
            <Route path="/" element={<Home />} />
            <Route path="/postAd" element={<PostAd />} />
            <Route path="/post-ad/form" element={<PostAdForm />} />
            <Route path="/FlagSelect" element={<FlagSelect />} />
            <Route path="/user-profile/:id" element={<UserProfile />} />
            {/* Catch-all route for 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HeroUIProvider>
  );
}
