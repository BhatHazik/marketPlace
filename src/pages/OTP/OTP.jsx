import { Button, Card, InputOtp } from "@heroui/react";
import "./OTP.css";
import FlagSelect from "../../components/FlagSelect";
import PhoneCountry from "../../components/PhoneCountry";
import PhoneInput from "../../components/PhoneCountry";
import LoginBackground from "../../assets/LoginBackground.png";
import Google from "../../assets/google.png";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import olxLogo from "../../assets/olx_logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import UseAPI from "../../hooks/UseAPI";
import { toast } from "react-toastify";

const OTP = () => {
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(0);
  const { requestAPI, loading, error } = UseAPI();

  const location = useLocation();
  const navigate = useNavigate();
  const phone = location?.state?.phone;
  const country = location?.state?.country;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await requestAPI("POST", "/auth/verifyOTP", {
      phone_number: phone,
      country_code: country,
      otp: value,
    });

    if (response.status === "success") {
      // Store token in localStorage as backup
      localStorage.setItem("token", response.token);
      localStorage.setItem("userCountry", country);
      localStorage.setItem("userId", response.user.id);
      
      toast.success(response.message);
      return navigate("/");
    }
    return;
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = () => {
    setTimer(59);
  };

  return (
    <>
      <div className="relative">
        <div className="absolute background-OTP inset-0 bg-cover bg-center opacity-50"></div>
        <div className="absolute top-8 left-8">
          <img src={olxLogo} alt="Logo" className="w-20 h-auto" />
        </div>
        <div className=" flex min-h-screen items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8">
          <Card className="max-w-md w-full space-y-8 p-6 shadow-xl">
            <div className="flex justify-center items-center flex-col gap-2">
              <h2 className="text-3xl font-bold app-text-green">
                OTP Verification
              </h2>
              <p>
                Enter OTP sent to {country} {phone}
              </p>
            </div>

            <form className="mt-0 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <div className="flex flex-col items-center justify-center gap-2">
                    <InputOtp
                      length={5}
                      value={value}
                      onValueChange={setValue}
                      isRequired
                      className="flex justify-center items-center text-center"
                    />
                    <p className="text-xs font-medium flex gap-1">
                      Didn't receive OTP ?
                      <span
                        className={`app-text-green cursor-pointer ${
                          timer > 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={timer === 0 ? handleResend : null}
                      >
                        {timer > 0 ? `Resend in ${timer}s` : "Resend"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div>
              <Button
                  type="submit"
                  fullWidth
                  radius="sm"
                  className="app-bg-green text-white"
                  isLoading={loading}
                  spinner={
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                >
                  {!loading && "Continue"}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-black font-semibold">
                    OR
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button variant="bordered" className="">
                  <img src={Google} alt="Google" className="w-5" />
                  Google
                </Button>
                <Button variant="bordered">
                  <FontAwesomeIcon
                    icon={faFacebook}
                    className="text-lg text-[#1877F2]"
                  />
                  Facebook
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default OTP;
