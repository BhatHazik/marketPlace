import { HeroUIProvider } from "@heroui/react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

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
import PreviewAd from "./pages/PreviewAd";
import Messages from "./pages/Messages";
import About from "./pages/About";
import TermsAndConditions from "./pages/TermsAndConditions";
import Privacy from "./pages/Privacy";
import Help from "./pages/Help";
import Settings from "./pages/Settings";

import { SocketService } from './services/socket.service';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/OTP", "/about", "/terms", "/privacy", "/help"];
  const hideFooterRoutes = ["/login", "/OTP", "/postAd", "/post-ad/form", "/messages", "/terms", "/privacy", "/help"];
  const shouldHideFooter = hideFooterRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div
        className={`flex-grow ${
          !hideNavbarRoutes.includes(location.pathname) ? "main-content" : ""
        }`}
      >
        {children}
      </div>
      {/* <MobileNavbar /> */}
      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      SocketService.connectSocket(token);
    }
    
    return () => {
      SocketService.disconnectSocket();
    };
  }, []);

  return (
    <HeroUIProvider>
      <style jsx global>{`
        /* Fix for double inputs */
        .heroui-input-base-input {
          background: transparent !important;
          box-shadow: none !important;
          border: none !important;
        }
        /* Ensure HeroUI styles take precedence */
        .heroui-input-wrapper {
          z-index: 2;
          position: relative;
        }
      `}</style>
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
            <Route path="/previewAd" element={<PreviewAd />} />
            <Route path="/user-profile/:id" element={<UserProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<Messages />} />
            <Route path="/about" element={<About/>}/>
            <Route path="/terms" element={<TermsAndConditions/>}/>
            <Route path="/privacy" element={<Privacy/>}/>
            <Route path="/help" element={<Help/>}/>
            <Route path="/listings" element={<Listings/>}/>
            <Route path="/settings" element={<Settings/>}/>
            {/* Catch-all route for 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HeroUIProvider>
  );
}
