import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import { Button, FormControl, IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";

const SignUp = () => {
  const logo = process.env.PUBLIC_URL + 'pharmalogo.webp';

  const [userID, setUserID] = useState();
  const [formData, setFormData] = useState({
    pharmacy_name: "",
    mobile_number: "",
    email: "",
    zip_code: "",
    referral_code: "",
    type: 0,
  });
  const [showCode, setShowCode] = useState(false);
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPasswordIcon, setShowPasswordIcon] = useState(false)
  const [showOTP, setShowOTP] = useState(false);
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [resendEnabled, setResendEnabled] = useState(false);
  const [timer, setTimer] = useState(30);


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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validationOTP = () => {
    let valid = true;
    const newErrors = { otp: '', password: '' };

    if (!otp) {
      newErrors.otp = 'OTP is required';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
      valid = false;
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
      valid = false;
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one digit';
      valid = false;
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = 'Password must contain at least one special character';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  }

  const handleRegister = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.pharmacy_name) {
      newErrors.pharmacy_name = 'pharmacy Name is required';
      toast.error('Pharmacy Name is required');
    }
    if (!formData.mobile_number) {
      newErrors.mobile_number = 'mobile No is required';
      toast.error('Mobile Number is required');
    }
    else if (!/^\d{10}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = 'Mobile number must be 10 digits';
      toast.error('Mobile number must be 10 digits');
    }
    if (!formData.email) {
      newErrors.email = 'Email Id is required';
      toast.error('Email Id is required');
    }
    else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
      toast.error('Enter a valid email address');
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (isValid) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      let data = new FormData();
      data.append("pharmacy_name", formData.pharmacy_name);
      data.append("mobile_number", formData.mobile_number);
      data.append("email", formData.email);
      data.append("zip_code", formData.zip_code);
      data.append("referral_code", formData.referral_code);
      data.append("type", formData.type);
      const response = await axios.post('resgiter', data);
      if (response.data.status === 200) {
        toast.success(response.data.message);
        setUserID(response.data.data.id);
        setShowOTP(true)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error('An unexpected error occurred. Please try again later.');
        console.error('API error:', error);
      }
    }
  };

  const handleSubmitOTP = async (e) => {
    e.preventDefault();
    if (validationOTP()) {
      const userData = new FormData();
      userData.append('type', 1);
      userData.append('otp', otp);
      userData.append('userid', userID);
      userData.append('password', password);

      try {
        const response = await axios.post('resgiter', {
          otp,
          password,
          type: 1,
          user_id: userID,
        });


        if (response.data.status === 200) {
          toast.success(response.data.message);
          localStorage.setItem('userId', userID)
          setTimeout(() => {
           
            history.push('/', { NewUser: 'NewUser' });

          }, 3000);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          toast.error(error.response.data.message);
        }
        console.error('API error:', errors);
      }
    } else {
        console.error('API error:', errors);
    }
  };


  const handleResendOtp = () => {
    setTimer(30);
    setResendEnabled(false);
    handleOtpsend();
  };

  const handleOtpsend = async () => {
    const data = new FormData();
    data.append('mobile_number', formData.mobile_number);
    try {
      const response = await axios.post('otp-resend', data, {
        headers: {
          'Content-Type': 'application/json',
        },

      });
      if (response.data.status == 200) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
        console.error('Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleMouseDownPassword = (event) => event.preventDefault();


  const handleClickPassword = () => setShowPasswordIcon((show) => !show);

  const handleBack = () => {
    setShowOTP(false)
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

        {showOTP == false ?
          <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
            <div
              className="hidden md:block lg:w-1/2 bg-cover bg-white-700"
              style={{
                backgroundColor: '#e6e6e6'
              }}
            >
              <div className='flex justify-center mt-32'>

                <img src={logo} ></img>
              </div>
            </div>
            <div className="w-full p-8 lg:w-1/2">
              <p className="text-xl text-gray-600 text-center">Welcome !</p>
              <>
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Pharmacy Name
                  </label>
                  <OutlinedInput
                    value={formData.pharmacy_name}
                    name="pharmacy_name"
                    onChange={handleChange}
                    className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                    size="small"
                  />
                </div>

                <div className="mt-2 flex flex-col justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Mobile Number
                  </label>
                  <OutlinedInput
                    type="number"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    startAdornment={<InputAdornment position="start">+91</InputAdornment>}
                    className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                    size="small"
                  />
                </div>

                <div className="mt-2 flex flex-col justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Email ID
                  </label>
                  <OutlinedInput
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                    size="small"
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
                  />
                </div>

                {showCode && (
                  <div className="mt-2 flex flex-col justify-between">
                    <label htmlFor="referral_code" className="block text-gray-700 text-sm font-bold mb-1">Referral Code (Optional)</label>
                    <OutlinedInput
                      type="text"
                      id="referral_code"
                      name="referral_code"
                      size="small"
                      className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                      value={formData.referral_code}
                      onChange={handleChange}
                    />
                  </div>
                )}
                {!showCode && (
                  <label htmlFor="referral_code" onClick={() => setShowCode(true)} className="text-x secondary  text-end w-full mt-2">
                    Have a Referral code?
                  </label>
                )}
                <div className="mt-4">
                  <Button variant="contained"  style={{backgroundColor:"var(--color1)"}} className="text-white font-bold py-2 px-4 w-full rounded "
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
                      <span className="secondary"> Login</span></Link>
                  </a>
                </div>
              </>
            </div>
          </div>
          :
          <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
            <div
              className="hidden md:block lg:w-1/2 bg-cover bg-white-700"
              style={{
                backgroundColor: '#e6e6e6'
              }}
            >
              <div className='flex justify-center mt-10'>

                <img src={logo} ></img>
              </div>
            </div>
            <div className="w-full p-8 lg:w-1/2">
              <p className="text-xl text-gray-600 text-center"> Verify OTP !</p>
              <>
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    OTP
                  </label>
                  <OutlinedInput
                    type="number"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                    size="small"
                  />
                </div>

                <div className="mt-2 flex flex-col justify-between">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    Password
                  </label>
                  {/* <FormControl sx={{ width: '600', height: '42px' }} variant="outlined">
                    <OutlinedInput
                      value={password}
                      sx={{ minWidth: 370 }}
                      id="outlined-basic"
                      type={showPasswordIcon ? 'text' : 'password'}
                      onChange={(e) => setPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPasswordIcon ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      sx={{ height: '42px' }}
                    />
                  </FormControl> */}
                  <FormControl sx={{ width: '600', height: '42px' }} variant="outlined">
                    <OutlinedInput
                      value={password}
                      className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                      id="outlined-basic"
                      type={showPasswordIcon ? 'text' : 'password'}
                      onChange={(e) => setPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end" sx={{ size: "small" }}>
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPasswordIcon ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      sx={{ height: '42px' }}
                    />
                  </FormControl>
                </div>
                <div>

                  <div className='flex justify-end mt-2'>
                    <span
                      style={{ color: resendEnabled ? 'blue' : "gray", fontWeight: 500, cursor: "pointer" }}
                      onClick={resendEnabled ? handleResendOtp : null}
                    >
                      {resendEnabled ? 'Re-send otp' : `Re-send otp in ${timer}s`}

                    </span>
                  </div>
                </div>

                <div className=" flex mt-4 gap-4">
                  <div className="w-1/2">

                    <Button variant="outlined" className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                      onClick={handleBack}
                    >
                      Back
                    </Button>
                  </div>
                  <div className="w-1/2">

                    <Button variant="contained" className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                      onClick={handleSubmitOTP}
                    >
                      Register
                    </Button>
                  </div>
                </div>

              </>
              {/* } */}


            </div>
          </div>
        }
      </div >


      {/* <div className="relative flex flex-col items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${medicalImage})` }}>
        {showPopup && <PopUpRed message={popupMessage} onClose={() => setShowPopup(false)} type={popupType} />}

        <div className="w-full mx-auto max-w-md p-12 bg-white bg-opacity-100 rounded-md border border-gray-200 shadow sm:p-8 md:p-8 dark:border-gray-700">
          {showOTP == false ?
            <form onSubmit={handleSubmit}>
              <h5 className="text-3xl font-semibold text-center text-blue-400 my-4">Register</h5>
              <div>
                <label htmlFor="pharmacy_name" className="block my-2 text-sm text-blue-600">Pharmacy Name</label>
                <input
                  id="pharmacy_name"
                  name="pharmacy_name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={formData.pharmacy_name}
                  onChange={handleChange}
                />
                {errors.pharmacy_name && <p style={{ color: 'red', fontSize: '14px' }}>{errors.pharmacy_name}</p>}
              </div>
              <div>
                <label htmlFor="mobile_number" className="block text-sm my-2 text-blue-600">Mobile number</label>
                <input
                  id="mobile_number"
                  name="mobile_number"
                  type="number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={formData.mobile_number}
                  onChange={handleChange}
                />
                {errors.mobile_number && <p style={{ color: 'red', fontSize: '14px' }}>{errors.mobile_number}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm my-2 text-blue-600">Email</label>
                <input
                  id="email"
                  name="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 lowercase text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p style={{ color: 'red', fontSize: '14px' }}>{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="zip_code" className="block text-sm my-2 text-blue-600">Zip code</label>
                <input
                  id="zip_code"
                  name="zip_code"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={formData.zip_code}
                  onChange={handleChange}
                />
                {errors.zip_code && <p style={{ color: 'red', fontSize: '14px' }}>{errors.zip_code}</p>}
              </div>
              {showCode && (
                <div>
                  <label htmlFor="referral_code" className="block text-sm my-2 text-blue-600">Referral Code (Optional)</label>
                  <input
                    type="text"
                    id="referral_code"
                    name="referral_code"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={formData.referral_code}
                    onChange={handleChange}
                  />
                </div>
              )}
              {!showCode && (
                <label htmlFor="referral_code" onClick={() => setShowCode(true)} className="block text-sm my-2 text-blue-600 cursor-pointer">
                  Have a Referral code?
                </label>
              )}
              <button type="submit" className="w-full text-white mb-5 bg-blue-900 hover:bg-blue-600 focus:ring-4 rounded-lg focus:outline-none focus:ring-blue-100 font-medium text-lg px-5 py-3 text-center mt-5">
                Request OTP
              </button>
              <div className="text-sm font-medium w-full h-full bg-blue-200 p-6 text-center mt-5">
                Already have an account?
                <Link to="/" className="text-blue-700 ml-2 dark:text-blue-500">Login Now</Link>
              </div>
            </form> :
            <form onSubmit={handleSubmitOTP}>
              <h5 className="text-3xl font-semibold text-center secondary my-3">Verify OTP</h5>
              <div>
                <div>
                  <label htmlFor="otp" className="block my-2 text-sm font-semibold primary">OTP</label>
                  <OutlinedInput
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    sx={{ minWidth: 370 }}
                    size="small"
                  />
                  {errors.otp && <p style={{ color: 'red', fontSize: '14px' }}>{errors.otp}</p>}

                </div>
                <div>
                  <span className="flex primary font-semibold my-2 font-medium">Password</span>
                  <FormControl variant="outlined">
                    <OutlinedInput
                      value={password}
                      sx={{ minWidth: 370 }}
                      id="outlined-basic"
                      type={showPasswordIcon ? 'text' : 'password'}
                      onChange={(e) => setPassword(e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPasswordIcon ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {errors.password && <p style={{ color: 'red', fontSize: '14px' }}>{errors.password}</p>}

                  </FormControl>
                </div>
                <div className='flex justify-end'>
                  <button type="button" className='primary my-2'>Resend OTP</button>
                </div>
                <button
                  type="submit"
                  className="w-full text-white mb-5 secondary-bg hover:bg-blue-500 rounded-md text-lg px-5 py-3 text-center mt-5"
                >
                  Register
                </button>
              </div>
              <div className="text-sm font-medium w-full h-full bg-blue-200 p-6 text-center mt-5 ">
                Already have an account? <a href="/" className="text-blue-700 ml-2 dark:text-blue-500">Back</a>
              </div>
            </form>
          }
        </div>
      </div> */}

    </>
  );
};

export default SignUp;
