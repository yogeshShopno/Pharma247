import React, { useState} from 'react'

import { TextField } from "@mui/material";

import axios from 'axios';

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../../../Header';
import { toast, ToastContainer } from 'react-toastify';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';


const AddDistributer = () => {
    // const [isLoading, setIsLoading] = useState(true);
    const history = useHistory()
    const [error, setError] = useState(null);

    const [GSTNumber, setGSTNumber] = useState('');
    const [distributorName, setDistributorName] = useState('');
    const [email, setEmail] = useState('');
    const [mobileno, setMobileno] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [state, setState] = useState('');
    const [address, setAddress] = useState('');
    const [area, setArea] = useState('');
    const [pincode, setPincode] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [foodLicence, setFoodLicence] = useState('');
    const [durgLicence, setDurgLicence] = useState('');
    const [dueDays, setDueDays] = useState('');
    
    // const [isEditMode, setIsEditMode] = useState('');

    const handleSubmit = () => {

            const newErrors = {};
            if (!distributorName) {
                newErrors.distributorName = 'Distributor is required'
                toast.error('Distributor is required');

            };
            if (!GSTNumber){ 
                newErrors.GSTNumber = 'GST Number is required'
                toast.error('GST Number is required')
            };
          
            if (!mobileno) {
                newErrors.mobileno = 'Mobile No is required';
                toast.error('Mobile No is required');

            } else if (!/^\d{10}$/.test(mobileno)) {
                newErrors.mobileno = 'Mobile number must be 10 digits';
                toast.error('Mobile number must be 10 digits');

            }

            setError(newErrors);
            const isValid = Object.keys(newErrors).length === 0;
            if (isValid) {
                AddDistributor();
            }
        

    };

    const AddDistributor = async () => {
        const token = localStorage.getItem("token");
        const data = new FormData()
        data.append("gst_number", GSTNumber)
        data.append("distributor_name", distributorName)
        data.append("email", email)
        data.append("mobile_no", mobileno)
        data.append("whatsapp", whatsapp)
        data.append("state", state)
        data.append("address", address)
        data.append("area", area)
        data.append("pincode", pincode)
        data.append("bank_name", bankName)
        data.append("account_no", accountNo)
        data.append("ifsc_code", ifsc)
        data.append("food_licence_no", foodLicence)
        data.append("distributor_durg_distributor", durgLicence)
        data.append("payment_due_days", dueDays)

        try {
            await axios.post("create-distributer", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {

                toast.success(response.data.message);

                setGSTNumber('');
                setDistributorName('');
                setEmail('');
                setMobileno('');
                setWhatsapp('');
                setState('');
                setAddress('');
                setArea('');
                setPincode('');
                setBankName('');
                setAccountNo('');
                setIfsc('');
                setFoodLicence('');
                setDurgLicence('');
                setDueDays('');


                setTimeout(() => {
                    history.push('/more/DistributorList');
                }, 1000);
               
            })
        } catch (error) {
            // setIsLoading(false);
            if (error.response.data.status == 400) {

                toast.error(error.response.data.message)
            }
            // console.error("API error:", error);

        }
    }

    return (
        <div>

            <Header />
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
            <div>
                <div>
                    <div className=' rounded-md shadow-md md:p-12 lg:px-16 h-full'>
                        <div className='mb-12 flex justify-between'>
                            <h1 className="text-2xl font-bold primary">Add New Distributor</h1>
                            <h1 className="text-xl font-bold primary cursor-pointer" onClick={() => history.push('/more/DistributorList')}> <ReplyAllIcon className='mb-2 mr-2' />Distributor List</h1>
                        </div>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-4 mb-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                            <div >
                                <label
                                    className="block  text-gray-700 font-bold mb-2"
                                    htmlFor="gst_number"
                                >
                                    Distributor GST/IN Number
                                </label>

                                <div class="relative w-full">

                                    <TextField
                                    
                                    variant="outlined"
                                    autoComplete="off"
                                        sx={{
                                            '.MuiInputBase-input': {
                                                padding: '10px 12px', // Remove padding from the input field
                                            }
                                        }}
                                        className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline uppercase"
                                        name="gst_number"
                                        type="text"
                                        value={GSTNumber}
                                        onChange={(e) => {
                                            const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                            setGSTNumber(value);
                                        }}/>


                                    <div class="absolute top-0 cursor-pointer end-0 h-full p-2.5 text-sm font-medium text-white rounded-e-lg border border-var(--color1)-700  hover:secondary-bg focus:ring-4 primary-bg">
                                        <span>Change</span>
                                        <span class="sr-only">Search</span>
                                    </div>

                                </div>

                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="distributor_name"
                                >
                                    Distributor Name
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    value={distributorName}
                                    className="appearance-none border rounded-lg px-0 py-0 w-full leading-tight focus:outline-none focus:shadow-outline uppercase"
                                    name="distributor_name"
                                    type="text"
                                    onChange={(e) => {
                                  
                                        setDistributorName((e.target.value).toUpperCase());
                                    }}
                                />
                                <div name="distributor_name" />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="mobile_no"
                                >
                                    Mobile No.
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                                    name='mobile_no'
                                    type="number"
                                    value={mobileno}
                                    onChange={(e) => setMobileno(e.target.value)}
                                />
                                <div
                                    name="mobile_no"

                                />
                            </div>


                        </div>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-4 mb-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">

                            {/* <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="phone"
                                >
                                    Phone
                                </label>
                                <TextField
                 autoComplete="off" 
sx={{
                                            '.MuiInputBase-input': {
                                                padding: '10px 12px' , // Remove padding from the input field
                                            }
                                          
                                        }}
                                    className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
                                    name="phone"
                                    type="number"
                                />
                                <div name="phone" />
                            </div> */}
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="email"
                                >
                                    Email ID
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    className="appearance-none border rounded-lg lowercase w-full leading-tight focus:outline-none focus:shadow-outline"
                                    name="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div name="email" />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="whatsapp"
                                >
                                    Whatsapp No.
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                                    name="whatsapp"
                                    type="number"
                                    value={whatsapp}
                                    onChange={(e) => { setWhatsapp(e.target.value) }}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="state"
                                >
                                    state
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                                    name="state"
                                    type="text"
                                    value={state}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/[^a-zA-Z]/g, ''); // Remove non-alphabetic characters
                                        const formattedValue = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
                                        setState(formattedValue);
                                    }}

                                   
                                    
                                />
                                <div
                                    name="state"

                                />

                            </div>

                        </div>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-4 mb-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="address"
                                >
                                    Address
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                                    name='address'
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                                <div
                                    name="address"

                                />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="area"
                                >
                                    Area
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                                    name="area"
                                    type="text"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                />
                                <div name="area" />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="pincode"
                                >
                                    Pincode
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                                    name="pincode"
                                    type="number"
                                    value={pincode}
                                    onChange={(e) => setPincode(e.target.value)}
                                />
                                <div name="pincode" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-4 mb-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="distributor_durg_distributor"
                                >
                                    Distributor Drug License No.
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline uppercase"
                                    name="distributor_durg_distributor"
                                    type="text"
                                    value={durgLicence}
                                    onChange={(e) => {
                                        const value = e.target.value.toUpperCase(); // Convert to uppercase for uniformity
                                        setDurgLicence(value);
                                    }}
                                />
                                <div name="distributor_durg_distributor" />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="food_licence_no"
                                >
                                    Food Licence No.
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline"
                                    name='food_licence_no'
                                    type="text"
                                    value={foodLicence}
                                    onChange={(e) => {
                                        const value = e.target.value.toUpperCase(); // Convert to uppercase for uniformity
                                        setFoodLicence(value);
                                    }}
                                />
                                <div
                                    name="food_licence_no"

                                />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="payment_due_days"
                                >
                                    Credit Due Days
                                </label>
                                <TextField
                                    variant="outlined"

                                    autoComplete="off"
                                    sx={{
                                        '.MuiInputBase-input': {
                                            padding: '10px 12px', // Remove padding from the input field
                                        }

                                    }}
                                    className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                                    name="payment_due_days"
                                    type="number"
                                    value={dueDays}
                                    onChange={(e) => setDueDays(Number(e.target.value))}
                                />
                                <div name="payment_due_days" />
                            </div>

                        </div>
                        <div className="border-b-2 border-blue-400 my-8 "></div>
                        <div>
                            <h1 className="text-2xl font-bold mb-12 primary">Add Bank Details</h1>
                            <div>
                                <div className="grid grid-cols-1 gap-x-8 gap-y-4 mb-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label
                                            className="block text-gray-700 font-bold mb-2"
                                            htmlFor="bank_name"
                                        >
                                            Bank Name
                                        </label>


                                        <div class="relative w-full">
                                            <TextField
                                    variant="outlined"

                                                autoComplete="off"
                                                sx={{
                                                    '.MuiInputBase-input': {
                                                        padding: '10px 12px', // Remove padding from the input field
                                                    }

                                                }}
                                                className="appearance-none border rounded-lg w-full leading-tight focus:outline-none focus:shadow-outline"
                                                name='bank_name'
                                                type="text"
                                                value={bankName}
                                                onChange={(e) => {
                                                    const uppercasedValue = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                                                    setBankName(uppercasedValue);
                                                }}
                                            />

                                            <div class="absolute top-0 end-0 h-full p-2.5  px-4 text-sm font-medium text-white  border-var(--color1)-700  hover:secondary-bg focus:ring-4 primary-bg rounded-e-lg border  cursor-pointer">
                                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                </svg>
                                            </div>

                                        </div>
                                        <div
                                            name="bank_name"

                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-gray-700 font-bold mb-2"
                                            htmlFor="account_no"
                                        >
                                            Account No.
                                        </label>
                                        <TextField
                                    variant="outlined"

                                            autoComplete="off"
                                            sx={{
                                                '.MuiInputBase-input': {
                                                    padding: '10px 12px', // Remove padding from the input field
                                                }

                                            }}
                                            className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline"
                                            name="account_no"
                                            type="number"
                                            value={accountNo}
                                            onChange={(e) => setAccountNo(e.target.value)}
                                        />
                                        <div name="account_no" />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-gray-700 font-bold mb-2"
                                            htmlFor="ifsc_code"
                                        >
                                            IFSC Code
                                        </label>
                                        <TextField
                                    variant="outlined"

                                            autoComplete="off"
                                            sx={{
                                                '.MuiInputBase-input': {
                                                    padding: '10px 12px', // Remove padding from the input field
                                                }

                                            }}
                                            className="appearance-none border rounded-lg w-full  leading-tight focus:outline-none focus:shadow-outline uppercase"
                                            name="ifsc_code"
                                            type="text"
                                            value={ifsc}
                                            onChange={(e) => {
                                                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                                setIfsc(value);
                                            }}
                                        />
                                        <div name="ifsc_code" />
                                    </div>

                                </div>

                                <div className="text-center my-8">
                                    <button
                                        type="submit"
                                        className="py-2 min-w-16 px-5 h-10  text-white rounded-lg primary-bg ml-2"
                                        onClick={handleSubmit}
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className="py-2 min-w-16 px-5 h-10 text-white rounded-lg bg-red-600 ml-2"

                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDistributer