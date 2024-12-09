import React, { useState, useRef } from 'react'
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from 'axios';

import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Header from '../../../Header';
import { toast, ToastContainer } from 'react-toastify';
import ReplyAllIcon from '@mui/icons-material/ReplyAll';

const validate = Yup.object().shape({
    gst_number: Yup.string()
        .required("Gst Number  is required"),
    distributor_name: Yup.string().required("Distributor Name is required"),
    // email: Yup.string().email("Invalid email").required("Email is Required"),
    mobile_no: Yup.string()
        .min(10, "Too Short!")
        .max(10, "Too Long!")
        .required("Mobile No is Required"),
    // address: Yup.string().required("Address is required"),
    area: Yup.string().required("Area is required"),
    // pincode: Yup.string()
    //     .min(6, "Too Short!")
    //     .max(6, "Too Long!")
    //     .required("Pincode  is required"),
    // area: Yup.string().required("Area is required"),
    // pincode: Yup.string()
    //     .min(6, "Too Short!")
    //     .max(6, "Too Long!"),
    // .required("Pincode  is required"),
    // bank_name: Yup.string()
    //     .min(2, "Too Short!")
    //     .max(50, "Too Long!")
    //     .required("Bank Name is required"),
    // account_no: Yup.string().required("Account No is required"),
    // ifsc_code: Yup.string().required("IFSC code is required"),
    // food_licence_no: Yup.string().required("Food Licence No is required"),
    // distributor_durg_distributor: Yup.string().required("Distributor Durg Distributor is required"),
    payment_due_days: Yup.string().required("Payment Due Days is required"),

});
const AddDistributer = () => {
    // const [isLoading, setIsLoading] = useState(true);
    const history = useHistory()
    const [error, setError] = useState(null);

    const ErrorMessageComponent = ({ children }) => {
        return <p className="text-red-500 mt-2">{children}</p>;
    };
    const [apiError, setApiError] = useState(null);
    const formRef = useRef("");
    const handleReset = () => {
        if (formRef.current) {
            formRef.current.reset();
        }
    };
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
            <Formik
                initialValues={{
                    gst_number: "",
                    distributor_name: "",
                    email: "",
                    mobile_no: "",
                    whatsapp: "",
                    address: "",
                    area: "",
                    pincode: "",
                    bank_name: "",
                    account_no: "",
                    ifsc_code: "",
                    state: "",
                    food_licence_no: "",
                    distributor_durg_distributor: "",
                    payment_due_days: 15
                }}
                validationSchema={validate}
                onSubmit={async (values, action) => {
                    const token = localStorage.getItem("token");
                    const data = new FormData()
                    data.append("gst_number", values.gst_number)
                    data.append("distributor_name", values.distributor_name)
                    data.append("email", values.email)
                    data.append("mobile_no", values.mobile_no)
                    data.append("whatsapp", values.whatsapp)
                    data.append("state", values.state)
                    data.append("address", values.address)
                    data.append("area", values.area)
                    data.append("pincode", values.pincode)
                    data.append("bank_name", values.bank_name)
                    data.append("account_no", values.account_no)
                    data.append("ifsc_code", values.ifsc_code)
                    data.append("food_licence_no", values.food_licence_no)
                    data.append("distributor_durg_distributor", values.distributor_durg_distributor)
                    data.append("payment_due_days", values.payment_due_days)
                    try {
                        const response = await axios.post(
                            "create-distributer",
                            data,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        ).then((response) => {
                            //console.log("response===>", response.data);
                            toast.success(response.data.message);
                            setTimeout(() => {
                                history.push('/more/DistributorList');
                            }, 2000);
                        })
                    } catch (error) {
                        if (error.response && (error.response.status === 404 || error.response.status === 400)) {
                            toast.error(error.response.data.message);

                        } else {
                            toast.error('An error occurred');
                            setApiError('An error occurred');
                            //console.log('Error:', error);
                        }
                    }
                }}
            >
                <Form ref={formRef}>
                    <div className=' p-12 rounded-md shadow-md md:p-12 lg:px-16 h-full'>
                        <div className='mb-12 flex justify-between'>
                            <h1 className="text-2xl font-bold primary">Add New Distributor</h1>
                            <h1 className="text-xl font-bold primary cursor-pointer" onClick={() => history.push('/more/DistributorList')}> <ReplyAllIcon className='mb-2 mr-2' />Distributor List</h1>
                        </div>

                        <div className="grid grid-cols-1 gap-x-8 gap-y-4 mb-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                            <div >
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="gst_number"
                                >
                                    Distributor GST/IN Number
                                </label>

                                <div class="relative w-full">
                                    <Field
                                        className="appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline uppercase"
                                        name='gst_number'
                                        type="text"
                                    />

                                    <div class="absolute top-0 cursor-pointer end-0 h-full p-2.5 text-sm font-medium text-white rounded-e-lg border border-var(--color1)-700  hover:secondary-bg focus:ring-4 primary-bg">
                                        <span>Change</span>
                                        <span class="sr-only">Search</span>
                                    </div>

                                </div>
                                <ErrorMessage
                                    name="gst_number"
                                    component={ErrorMessageComponent}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="distributor_name"
                                >
                                    Distributor Name
                                </label>
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline uppercase"
                                    name="distributor_name"
                                    type="text"
                                />
                                <ErrorMessage name="distributor_name" component={ErrorMessageComponent} />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="mobile_no"
                                >
                                    Mobile No.
                                </label>
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    name='mobile_no'
                                    type="number"
                                />
                                <ErrorMessage
                                    name="mobile_no"
                                    component={ErrorMessageComponent}
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
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
                                    name="phone"
                                    type="number"
                                />
                                <ErrorMessage name="phone" component={ErrorMessageComponent} />
                            </div> */}
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="email"
                                >
                                    Email ID
                                </label>
                                <Field
                                    className="appearance-none border rounded-lg lowercase w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
                                    name="email"
                                    type="email"
                                />
                                <ErrorMessage name="email" component={ErrorMessageComponent} />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="whatsapp"
                                >
                                    Whatsapp No.
                                </label>
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
                                    name="whatsapp"
                                    type="number"
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="state"
                                >
                                    state
                                </label>
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
                                    name="state"
                                    type="number"
                                />
                                  <ErrorMessage
                                    name="state"
                                    component={ErrorMessageComponent}
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
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    name='address'
                                    type="text"
                                />
                                <ErrorMessage
                                    name="address"
                                    component={ErrorMessageComponent}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="area"
                                >
                                    Area
                                </label>
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
                                    name="area"
                                    type="text"
                                />
                                <ErrorMessage name="area" component={ErrorMessageComponent} />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="pincode"
                                >
                                    Pincode
                                </label>
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
                                    name="pincode"
                                    type="number"
                                />
                                <ErrorMessage name="pincode" component={ErrorMessageComponent} />
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
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline uppercase"
                                    name="distributor_durg_distributor"
                                    type="text"
                                />
                                <ErrorMessage name="distributor_durg_distributor" component={ErrorMessageComponent} />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="food_licence_no"
                                >
                                    Food Licence No.
                                </label>
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                    name='food_licence_no'
                                    type="text"
                                />
                                <ErrorMessage
                                    name="food_licence_no"
                                    component={ErrorMessageComponent}
                                />
                            </div>
                            <div>
                                <label
                                    className="block text-gray-700 font-bold mb-2"
                                    htmlFor="payment_due_days"
                                >
                                    Credit Due Days
                                </label>
                                <Field
                                    className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
                                    name="payment_due_days"
                                    type="text"
                                />
                                <ErrorMessage name="payment_due_days" component={ErrorMessageComponent} />
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
                                            <Field
                                                className="appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
                                                name='bank_name'
                                                type="text"
                                            />

                                            <div class="absolute top-0 end-0 h-full p-2.5  px-4 text-sm font-medium text-white  border-var(--color1)-700  hover:secondary-bg focus:ring-4 primary-bg rounded-e-lg border  cursor-pointer">
                                                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                                </svg>
                                            </div>

                                        </div>
                                        <ErrorMessage
                                            name="bank_name"
                                            component={ErrorMessageComponent}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-gray-700 font-bold mb-2"
                                            htmlFor="account_no"
                                        >
                                            Account No.
                                        </label>
                                        <Field
                                            className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline"
                                            name="account_no"
                                            type="number"
                                        />
                                        <ErrorMessage name="account_no" component={ErrorMessageComponent} />
                                    </div>
                                    <div>
                                        <label
                                            className="block text-gray-700 font-bold mb-2"
                                            htmlFor="ifsc_code"
                                        >
                                            IFSC Code
                                        </label>
                                        <Field
                                            className="appearance-none border rounded-lg w-full py-2 px-2 leading-tight focus:outline-none focus:shadow-outline uppercase"
                                            name="ifsc_code"
                                            type="text"
                                        />
                                        <ErrorMessage name="ifsc_code" component={ErrorMessageComponent} />
                                    </div>

                                </div>

                                <div className="text-center my-8">
                                    <button
                                        type="submit"
                                        className="py-2 min-w-16 px-5 h-10  text-white rounded-lg primary-bg ml-2"
                                    >
                                        Add
                                    </button>
                                    <button
                                        type="button"
                                        className="py-2 min-w-16 px-5 h-10 text-white rounded-lg bg-red-600 ml-2"
                                        onClick={handleReset}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </Formik>
        </div>
    )
}

export default AddDistributer