import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom';
import axios from 'axios';
import { Button, FormControl, IconButton, InputAdornment, OutlinedInput } from '@mui/material';
import medicalImage from '../Images/medical.png';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';

const Forgot = () => {
    const logo = process.env.PUBLIC_URL + 'pharmalogo.png';
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [showPasswordIcon, setShowPasswordIcon] = useState(false)
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const [otpSent, setOtpSent] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [resendTimeout, setResendTimeout] = useState(null);
    const [resendEnabled, setResendEnabled] = useState(false);
    const [timer, setTimer] = useState(30);
    const [countdown, setCountdown] = useState(0); // Countdown timer value

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

    const togglePopup = (message, type) => {
        setPopupMessage(message);
        setPopupType(type);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
    };

    useEffect(() => {
        if (resendTimeout !== null) {
            // Start the countdown
            const timer = setInterval(() => {
                setCountdown((prevCountdown) => {
                    if (prevCountdown === 1) {
                        clearInterval(resendTimeout);
                        setResendTimeout(null);
                        setResendDisabled(false); // Enable resend button
                    }
                    return prevCountdown - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [resendTimeout]);
    const handleResendOtp = () => {
        setTimer(30);
        setResendEnabled(false);
        handleOtpsend();
    };

    const handleOtpsend = async () => {
        const data = new FormData();
        data.append('mobile_number', mobileNumber);
        try {
            const response = await axios.post('otp-resend', data, {
                headers: {
                    'Content-Type': 'application/json',
                },

            });
            // Handle response if needed
            if (response.data.status == 200) {
                setOtpSent(true);
                setResendDisabled(true);
                setCountdown(60);
                setResendTimeout(setInterval(() => { }, 1000));
            } else {
                console.error('Failed to resend OTP');
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };


    const validate = () => {
        const errors = {};
        if (!mobileNumber) errors.mobileNumber = 'Mobile number is required';
        if (!email) {
            errors.email = 'Email is required';

        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'Email is invalid';

        }
        return errors;
    };

    const handleForgotDetails = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!mobileNumber) {
            newErrors.mobileNumber = 'mobile No is required';
            toast.error('Mobile Number is required');
        }
        else if (!/^\d{10}$/.test(mobileNumber)) {
            newErrors.mobileNumber = 'Mobile number must be 10 digits';
            toast.error('Mobile number must be 10 digits');
        }
        if (!email) {
            newErrors.email = 'Email Id is required';
            toast.error('Email Id is required');
        }
        else if (!emailRegex.test(email)) {
            newErrors.email = 'Enter a valid email address';
            toast.error('Enter a valid email address');
        }

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            //console.log('add')
            handleSubmit();
        }
    };

    const handleSubmit = async (event) => {
        const userData = new FormData();
        userData.append('mobile_number', mobileNumber);
        userData.append('email', email);
        userData.append('type', 0);
        userData.append('userId', localStorage.getItem('useId'));
        try {
            const response = await axios.post('forget-password', userData);
            //console.log('API response==>:', response.data.data);
            localStorage.setItem('userId', response.data.data.user_id);
            if (response.data.status === 200) {
                toast.success(response.data.message);
                setShowOTP(true);
                // setTimeout(() => {
                //     history.push('/otpforgot');
                // }, 3000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            }
            console.error('API error:', error);
        }
    };

    const validatePassword = () => {
        const errors = {};
        if (!otp) errors.otp = 'OTP is required';
        if (!password) {
            errors.password = 'Password is required';
            toast.error(errors.password);
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
            toast.error(errors.password);
        } else if (!/[A-Z]/.test(password)) {
            errors.password = 'Password must contain at least one uppercase letter';
            toast.error(errors.password);
        } else if (!/[a-z]/.test(password)) {
            errors.password = 'Password must contain at least one lowercase letter';
            toast.error(errors.password);
        } else if (!/[0-9]/.test(password)) {
            errors.password = 'Password must contain at least one digit';
            toast.error(errors.password);
        } else if (!/[!@#$%^&*]/.test(password)) {
            errors.password = 'Password must contain at least one special character';
            toast.error(errors.password);
        }
        setErrors(errors);
        const isValid = Object.keys(errors).length === 0;
        if (isValid) {
            //console.log('add')
            handleUpdatePassword();
        }
        // return errors;
    };

    const handleUpdatePassword = async (event) => {
        // event.preventDefault();
        // const validationErrors = validatePassword();
        // if (Object.keys(validationErrors).length > 0) {
        //     setErrors(validationErrors);
        //     return;
        // }
        const userData = new FormData();
        userData.append('otp', otp);
        userData.append('password', password);
        userData.append('type', 1);
        userData.append('user_id', localStorage.getItem('userId'));

        try {
            const response = await axios.post('forget-password', userData);
            //console.log('API response==>:', response.data.data);
            // localStorage.setItem('userId', response.data.data.user_id);
            if (response.data.status === 200) {
                toast.success(response.data.message);
                setShowOTP(true);
                setTimeout(() => {
                    history.push('/');
                }, 3000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message);
            }
            console.error('API error:', error);
        }
    };

    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleBack = () => {
        setShowOTP(false)
    }

    const handleClickPassword = () => setShowPasswordIcon((show) => !show);
    return (
        <div>
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
                            <div className='flex justify-center mt-14'>

                                <img src={logo} ></img>
                            </div>
                        </div>
                        <div className="w-full p-8 lg:w-1/2">
                            <p className="text-xl text-gray-600 text-center">Forgot Password !</p>
                            <>
                                <div className="mt-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-1">
                                        Mobile Number
                                    </label>
                                    <OutlinedInput
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        startAdornment={<InputAdornment position="start">+91</InputAdornment>}
                                        name="pharmacy_name"
                                        className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                                        size="small"
                                    />
                                </div>

                                <div className="mt-4 flex flex-col justify-between">
                                    <label className="block text-gray-700 text-sm font-bold mb-1">
                                        Email ID
                                    </label>
                                    <OutlinedInput
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                                        size="small"
                                    />
                                </div>

                                <div className="mt-4">
                                    <Button variant="contained" className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                                        onClick={handleForgotDetails}
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
                                            <span className="text-blue-700"> Login</span></Link>
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
                                            onClick={validatePassword}
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
        </div>
    )
}

export default Forgot