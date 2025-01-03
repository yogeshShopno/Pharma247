import React, { useEffect, useState } from 'react';
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
    const [role, setRole] = useState("");

    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleClickPassword = () => setShowPasswordIcon((show) => !show);

    useEffect(() => {
       const roles = localStorage.getItem('role')
        if (roles == "Owner") {
            history.push("/admindashboard")
        } else if (roles == "Staff") {
            history.push("/more/reconciliation")
        }

    }, [])

    const handleLogin = (event) => {
        if (event.key === 'Enter') {
            validateAndSubmit();
        }
    };

    const validateAndSubmit = (event) => {

        const newErrors = {};

        if (!mobileNumber) {
            newErrors.mobileNumber = 'Mobile Number is required';
            toast.error('Mobile Number is required');
        }
        if (!password) {
            newErrors.password = 'Password is required';
            toast.error('Password is required');
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            newErrors.mobileNumber = 'Mobile Number must be 10 digits';
            toast.error('Mobile Number must be 10 digits');
        }

        setErrors(newErrors);

        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            handleSubmit();
        }
    };


    const handleSubmit = async () => {

        let data = new FormData();
        data.append('mobile_number', mobileNumber)
        data.append('password', password)
        try {
            const response = await axios.post('login', data);

            if (response.data.status === 200) {
                const { token, id, name, role, iss_audit,status } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('userId', id);
                localStorage.setItem('UserName', name);
                localStorage.setItem('role', role)
                toast.success(response.data.message)

                setRole(role)

                if (role === "Owner") {
                    setTimeout(() => {
                        history.push('/admindashboard');
                    }, 3000);
                } else if (role === "Staff" && iss_audit === "true" && status === false) {
                    setTimeout(() => {
                        history.push('/more/reconciliation');
                    }, 3000);
                }else{
                    history.push('/admindashboard');
                    

                }
            } else {

                toast.error(response.data.message);
            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message)
            }
            console.error('API error:', error);
        }
    };

    useEffect(() => {
        const inputElements = document.querySelectorAll('input');
        inputElements.forEach((input) => {
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        document.addEventListener('keydown', handleLogin);
        return () => {
            document.removeEventListener('keydown', handleLogin);
        };
    }, [mobileNumber, password]);

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
                                className="text-x red text-end w-full mt-2"
                            >
                                <Link to="/forgotpassword" >
                                    Forget Password?
                                </Link>
                            </a>
                        </div>
                        <div className="mt-8">
                            <Button variant="contained" style={{backgroundColor:"var(--color1)"}} className="primary-bg text-white font-bold py-2 px-4 w-full rounded hover:primary-bg"
                                onClick={validateAndSubmit}
                            >
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
                                    <span className="secondary"> Sign Up</span></Link>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Login;
