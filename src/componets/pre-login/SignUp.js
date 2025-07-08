import React, { useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "react-router-dom";

const SignUp = () => {
  const inputRefs = useRef([]);

  const logo = process.env.PUBLIC_URL + "/pharmalogo.webp";
  const { referralCode } = useParams();

  const [userID, setUserID] = useState();
  const [formData, setFormData] = useState({
    pharmacy_name: "",
    mobile_number: "",
    email: "",
    zip_code: "",
    referral_code: referralCode || "",
    type: 0,
  });
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPasswordIcon, setShowPasswordIcon] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [resendEnabled, setResendEnabled] = useState(false);
  const [timer, setTimer] = useState(30);
  
  {/*<============================================================================ handle enter functionality  ===================================================================> */}

  const handleKeyDown = (event, index) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission

      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus(); // Move to next input
      }
    }
  };
  {/*<============================================================================== get referral code  =====================================================================> */}

  useEffect(() => {
    if (referralCode) {
      setFormData((prev) => ({ ...prev, referral_code: referralCode }));
    }
  }, [referralCode]);
  {/*<============================================================================== resend  code  =====================================================================> */}

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setResendEnabled(true);
    }
  }, [timer]);

  {
    /*<================================================================================== handle form submit =========================================================================> */
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validationOTP = () => {
    const newErrors = {};

    if (!otp) {
      newErrors.otp = "OTP is required";
      toast.error(newErrors.otp);
    }

    if (!password) {
      newErrors.password = "Password is required";
      toast.error(newErrors.password);
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      toast.error(newErrors.password);
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
      toast.error(newErrors.password);
    } else if (!/[a-z]/.test(password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
      toast.error(newErrors.password);
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Password must contain at least one digit";
      toast.error(newErrors.password);
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password =
        "Password must contain at least one special character";
      toast.error(newErrors.password);
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      handleSubmitOTP();
    }
    return;
  };

  const handleRegister = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.pharmacy_name) {
      newErrors.pharmacy_name = "pharmacy Name is required";
      toast.error("Pharmacy Name is required");
    }
    if (!formData.mobile_number) {
      newErrors.mobile_number = "mobile No is required";
      toast.error("Mobile Number is required");
    } else if (!/^\d{10}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = "Mobile number must be 10 digits";
      toast.error("Mobile number must be 10 digits");
    }
    if (!formData.email) {
      newErrors.email = "Email Id is required";
      toast.error("Email Id is required");
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      toast.error("Enter a valid email address");
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      handleSubmit();
    }
    return;
  };

  const handleSubmit = async () => {
    try {
      let data = new FormData();
      data.append("pharmacy_name", formData.pharmacy_name);
      data.append("mobile_number", formData.mobile_number);
      data.append("email", formData.email);
      data.append("zip_code", formData.zip_code);
      data.append("referral_code", formData.referral_code);
      data.append("coupon_code", formData.referral_code);

      data.append("type", formData.type);
      const response = await axios.post("resgiter", data);
      if (response.data.status === 200) {
        toast.success(response.data.message);
        setUserID(response.data.data.id);
        setShowOTP(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
        console.error("API error:", error);
      }
    }
  };

  const handleSubmitOTP = async () => {
    const userData = new FormData();
    userData.append("type", 1);
    userData.append("otp", otp);
    userData.append("user_id", userID);
    userData.append("password", password);

    try {
      const response = await axios.post("resgiter", userData);

      if (response.data.status === 200 && response.data.message) {
        toast.success(response.data.message);
        localStorage.setItem("userId", userID);

        setTimeout(() => {
          history.push("/", { NewUser: "NewUser" });
        }, 3000);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      console.error("API error:", error);
    }
  };

  const handleResendOtp = () => {
    setTimer(30);
    setResendEnabled(false);
    handleOtpsend();
  };

  const handleOtpsend = async () => {
    const data = new FormData();
    data.append("mobile_number", formData.mobile_number);
    try {
      const response = await axios.post("otp-resend", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.status == 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
        console.error("Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleClickPassword = () => setShowPasswordIcon((show) => !show);

  const handleBack = () => {
    setShowOTP(false);
  };

  {
    /*<======================================================================================== ui ===============================================================================> */
  }

  return (
    <>
        <ToastContainer

        position="top-right"
        autoClose={5000}
        hideProgressBar={false} 
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
 {/*<==================================================================================== register ===========================================================================> */}

        {showOTP == false ? (
          <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
            <div
              className="hidden md:block lg:w-1/2 bg-cover bg-white-700"
              style={{
                backgroundColor: "#e6e6e6",
              }}
            >
              <div className="flex justify-center mt-32">
                <img src={logo}></img>
              </div>
            </div>
            <div className="w-full p-8 lg:w-1/2">
              <p className="text-xl text-gray-600 text-center">Welcome !</p>
              <>
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Pharmacy Name <span className="text-red-600">*</span>
                  </label>
                  <OutlinedInput
                    value={formData.pharmacy_name}
                    name="pharmacy_name"
                    onChange={handleChange}
                    className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                    size="small"
                    inputRef={(el) => (inputRefs.current[0] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 0)}
                    autoFocus
                  />
                </div>

                <div className="mt-2 flex flex-col justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <OutlinedInput
                    type="number"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    startAdornment={
                      <InputAdornment position="start">+91</InputAdornment>
                    }
                    className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                    size="small"
                    inputRef={(el) => (inputRefs.current[1] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 1)}
                  />
                </div>

                <div className="mt-2 flex flex-col justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Email ID <span className="text-red-600">*</span>
                  </label>
                  <OutlinedInput
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                    size="small"
                    inputRef={(el) => (inputRefs.current[2] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                  />
                </div>

                <div className="mt-2 flex flex-col justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Zip Code
                  </label>
                  <OutlinedInput
                    type="number"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                    size="small"
                    inputRef={(el) => (inputRefs.current[3] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                  />
                </div>

                <div className="mt-2 flex flex-col justify-between">
                  <label
                    htmlFor="referral_code"
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    Referral Code (Optional)
                  </label>
                  <OutlinedInput
                    type="text"
                    id="referral_code"
                    name="referral_code"
                    size="small"
                    className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                    value={formData.referral_code}
                    onChange={handleChange}
                    inputRef={(el) => (inputRefs.current[4] = el)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleRegister();
                    }}
                  />
                </div>

                <div className="mt-4">
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "var(--color1)" }}
                    className="text-white font-bold py-2 px-4 w-full rounded "
                    onClick={handleRegister}
                  >
                    Next
                  </Button>
                </div>
                <div className="mt-4 flex items-center w-full text-center">
                  <a
                    href="#"
                    className="text-xxl text-gray-500 capitalize text-center w-full"
                  >
                    Already have an account?
                    <Link to="/">
                      <span className="secondary"> Login</span>
                    </Link>
                  </a>
                </div>
              </>
            </div>
          </div>
        ) : (
          <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">

{/*<==================================================================================== verify OTP ===========================================================================> */}

            <div
              className="hidden md:block lg:w-1/2 bg-cover bg-white-700"
              style={{
                backgroundColor: "#e6e6e6",
              }}
            >
              <div className="flex justify-center mt-10">
                <img src={logo}></img>
              </div>
            </div>
            <div className="w-full p-8 lg:w-1/2">
              <p className="text-xl text-gray-600 text-center"> Verify OTP !</p>
              <>
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    OTP <span className="text-red-600">*</span>
                  </label>
                  <OutlinedInput
                    type="number"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                    size="small"
                    autoFocus
                    inputRef={(el) => (inputRefs.current[5] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 5)}
                  />
                </div>

                <div className="mt-2 flex flex-col justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Password <span className="text-red-600">*</span>
                  </label>

                  <FormControl
                    sx={{ width: "600", height: "42px" }}
                    variant="outlined"
                  >
                    <OutlinedInput
                      value={password}
                      className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                      id="outlined-basic"
                      type={showPasswordIcon ? "text" : "password"}
                      onChange={(e) => setPassword(e.target.value)}
                      inputRef={(el) => (inputRefs.current[6] = el)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") validationOTP();
                      }}
                      endAdornment={
                        <InputAdornment position="end" sx={{ size: "small" }}>
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPasswordIcon ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      sx={{ height: "42px" }}
                    />
                  </FormControl>
                </div>
                <div>
                  <div className="flex justify-end mt-2">
                    <span
                      style={{
                        color: resendEnabled ? "blue" : "gray",
                        fontWeight: 500,
                        cursor: "pointer",
                      }}
                      onClick={resendEnabled ? handleResendOtp : null}
                    >
                      {resendEnabled
                        ? "Re-send otp"
                        : `Re-send otp in ${timer}s`}
                    </span>
                  </div>
                </div>

                <div className=" flex mt-4 gap-4">
                  <div className="w-1/2">
                    <Button
                      variant="outlined"
                      className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                      onClick={() => handleBack()}
                    >
                      Back
                    </Button>
                  </div>
                  <div className="w-1/2">
                    <Button
                      variant="contained"
                      className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                      onClick={() => validationOTP()}
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SignUp;
