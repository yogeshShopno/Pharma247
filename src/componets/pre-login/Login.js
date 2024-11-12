import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
const Login = () => {
    const logo = process.env.PUBLIC_URL + 'pharmalogo.png';
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPasswordIcon, setShowPasswordIcon] = useState(false)

    const history = useHistory();
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleClickPassword = () => setShowPasswordIcon((show) => !show);

    const handleLogin = () => {
        const newErrors = {};

        if (!mobileNumber) {
            newErrors.mobileNumber = 'mobile No is required';
            toast.error('Mobile Number is required');
        }
        if (!password) {
            newErrors.password = 'Password is required';
            toast.error('Password is required');
        }
        else if (!/^\d{10}$/.test(mobileNumber)) {
            newErrors.mobileNumber = 'mobile number must be 10 digits';
            toast.error('Mobile number must be 10 digits');
        }
        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            //console.log('add')
            handleSubmit();
        }
    };


    const handleSubmit = async () => {
        let data = new FormData();
        data.append('mobile_number', mobileNumber)
        data.append('password', password)
        try {
            await axios.post('login', data, {
            }).then((response) => {
                if (response.data.status === 200) {
                    localStorage.setItem('token', response.data.data.token);
                    localStorage.setItem('userId', response.data.data.id);
                    localStorage.setItem('UserName', response.data.data.name);
                    toast.success(response.data.message)
                    setTimeout(() => {
                        history.push('/admindashboard');
                    }, 3000);
                }
                else {
                    toast.error(response.data.message)
                    console.error(response.data.message)

                }
            });
        } 
        catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message)
            }
            console.error('API error:', error);
        }
    };

 
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
                <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
                    <div
                        className="hidden md:block lg:w-1/2 bg-cover bg-white-700"
                        style={{
                            backgroundColor: '#e6e6e6'
                        }}
                    >
                        <div className='flex justify-center mt-20'>

                            <img src={logo} ></img>
                        </div>
                    </div>
                    <div className="w-full p-8 lg:w-1/2">
                        <p className="text-xl text-gray-600 text-center">Welcome back!</p>
                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Mobile No
                            </label>
                            <OutlinedInput
                                type="number"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                className="text-gray-700 border border-gray-300 rounded block w-full focus:outline-2 focus:outline-blue-700"
                                size="small"
                            />
                        </div>
                        <div className="mt-4 flex flex-col justify-between">
                            <div className="flex justify-between">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Password
                                </label>
                            </div>
                            {/* <input
                                className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                                type="password"
                            /> */}

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
                            <a
                                href="#"
                                className="text-x text-gray-500 hover:text-blue-900 text-end w-full mt-2"
                            >
                                <Link to="/forgotpassword" >
                                    Forget Password?
                                </Link>
                            </a>
                        </div>
                        <div className="mt-8">
                            <Button variant="contained" className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600" onClick={handleLogin} >
                                Login
                            </Button>

                            
                        </div>

                        <div className="mt-4 flex items-center w-full text-center">
                            <a
                                href="#"
                                className="text-xxl text-gray-500 capitalize text-center w-full"
                            >
                                Don&apos;t have any account yet?
                                <Link to="/Register">
                                    <span className="text-blue-700"> Sign Up</span></Link>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
        </>
    );
};

export default Login;
