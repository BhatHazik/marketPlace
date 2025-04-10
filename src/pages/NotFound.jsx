import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@heroui/react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        {/* TV Set container */}
        <div className="tv-container relative mx-auto mb-8">
          {/* TV Set */}
          <div className="tv">
            {/* TV Screen with 404 static effect */}
            <div className="tv-screen">
              <div className="static-effect"></div>
              <div className="error-text">
                <div className="error-num">404</div>
                <div className="error-message">Page Not Found</div>
              </div>
            </div>
            {/* TV Details */}
            <div className="tv-base"></div>
            <div className="tv-buttons">
              <div className="tv-btn"></div>
              <div className="tv-btn"></div>
              <div className="tv-btn"></div>
            </div>
            <div className="tv-antenna-left"></div>
            <div className="tv-antenna-right"></div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-4">Oops! Looks like you're lost</h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Button 
          as={Link}
          to="/"
          className="px-6 py-3 bg-[#006C54] text-white rounded-md hover:bg-[#005743] transition-colors"
          size="lg"
        >
          Back to Home
        </Button>
      </div>

      {/* CSS for the TV */}
      <style jsx>{`
        .tv-container {
          width: 280px;
          height: 300px;
          position: relative;
        }

        .tv {
          width: 220px;
          height: 180px;
          background-color: #333;
          border-radius: 10px;
          position: relative;
          margin: 0 auto;
          padding: 15px;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3);
        }

        .tv-screen {
          width: 100%;
          height: 150px;
          background-color: #111;
          border-radius: 5px;
          overflow: hidden;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .static-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.2;
          animation: static 0.5s infinite alternate;
        }

        @keyframes static {
          0% { opacity: 0.2; }
          100% { opacity: 0.3; }
        }

        .error-text {
          position: relative;
          z-index: 1;
          text-align: center;
          color: white;
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
          animation: flicker 2s infinite alternate;
        }

        .error-num {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .error-message {
          font-size: 14px;
        }

        @keyframes flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
            opacity: 0.99;
          }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
            opacity: 0.4;
          }
        }

        .tv-base {
          width: 80px;
          height: 20px;
          background-color: #333;
          position: absolute;
          bottom: -20px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 0 0 10px 10px;
        }

        .tv-buttons {
          position: absolute;
          bottom: 15px;
          right: 15px;
          display: flex;
        }

        .tv-btn {
          width: 8px;
          height: 8px;
          background-color: #666;
          border-radius: 50%;
          margin-left: 5px;
        }

        .tv-antenna-left, .tv-antenna-right {
          position: absolute;
          width: 4px;
          height: 40px;
          background-color: #222;
          top: -40px;
        }

        .tv-antenna-left {
          left: 50px;
          transform: rotate(-20deg);
        }

        .tv-antenna-right {
          right: 50px;
          transform: rotate(20deg);
        }

        /* Responsive adjustments */
        @media (min-width: 640px) {
          .tv-container {
            width: 360px;
            height: 380px;
          }
          
          .tv {
            width: 300px;
            height: 240px;
          }
          
          .tv-screen {
            height: 210px;
          }
          
          .error-num {
            font-size: 72px;
          }
          
          .error-message {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFound; 