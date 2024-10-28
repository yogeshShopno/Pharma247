import Header from "../../../Header"
import React, { useState, useRef, useEffect } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, Checkbox, CircularProgress, InputAdornment, ListItemText, TextField } from "@mui/material";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import ListItem from '@mui/material/ListItem';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { MenuItem, Select } from '@mui/material';
import { BsLightbulbFill } from "react-icons/bs";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import SearchIcon from "@mui/icons-material/Search";
import { Prompt } from "react-router-dom/cjs/react-router-dom";

import '../../../Purchase/ReturnBill/Add-ReturnBill/AddReturnbill.css'

const Salereturn = () => {
    const token = localStorage.getItem("token")
    const inputRef1 = useRef();
    const inputRef2 = useRef();
    const inputRef3 = useRef();
    const inputRef4 = useRef();
    const inputRef5 = useRef();
    const inputRef6 = useRef();
    const inputRef7 = useRef();
    const inputRef8 = useRef();
    const inputRef9 = useRef();
    const inputRef10 = useRef();

    const [item, setItem] = useState('')
    const [billNo, setbillNo] = useState('')
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const options = ['Option 1', 'Option 2', 'Option 3'];

    const history = useHistory();
    const paymentOptions = [
        { id: 1, label: 'Cash' },
        { id: 3, label: 'UPI' },]
    const [customer, setCustomer] = useState('')
    const [isVisible, setIsVisible] = useState(true);
    const [address, setAddress] = useState('');
    const [billing, setBilling] = useState('')
    const [doctor, setDoctor] = useState('')
    const [selectedOption, setSelectedOption] = useState(1);
    const [paymentType, setPaymentType] = useState('cash');
    const [error, setError] = useState({ customer: '' });
    const [expiryDate, setExpiryDate] = useState('');
    const [mrp, setMRP] = useState('');
    const [searchItemID, setSearchItemID] = useState(null);
    const [qty, setQty] = useState('');
    const [gst, setGst] = useState('');
    const [batch, setBatch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState([])
    const [doctorData, setDoctorData] = useState([])
    const [ItemSaleList, setItemSaleList] = useState({ sales_item: [] });
    const [order, setOrder] = useState('');
    const [loc, setLoc] = useState('')
    const [randomNumber, setRandomNumber] = useState(null);
    const [base, setBase] = useState('')
    const tableRef = useRef(null);
    const [unit, setUnit] = useState('')
    const [isEditMode, setIsEditMode] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0)
    const [itemAmount, setItemAmount] = useState(null);
    const [selectedEditItemId, setSelectedEditItemId] = useState(null);
    const [IsDelete, setIsDelete] = useState(false);
    let defaultDate = new Date()
    const [cgst, setCgst] = useState('')
    const [sgst, setSgst] = useState('')
    const [searchItem, setSearchItem] = useState('')
    const [itemList, setItemList] = useState([])
    defaultDate.setDate(defaultDate.getDate() + 3)
    const [saleItems, setSaleItems] = useState([]);
    const [totalBase, setTotalBase] = useState(0);
    const [givenAmt, setGivenAmt] = useState(null);
    const [otherAmt, setOtherAmt] = useState(0);
    const [netAmount, setNetAmount] = useState(0)
    const [finalDiscount, setFinalDiscount] = useState(0)
    const [dueAmount, setDueAmount] = useState(null);
    const [startDate, setStartDate] = useState(dayjs().subtract(3, 'month'));
    const [endDate, setEndDate] = useState(dayjs());
    const [saleItemId, setSaleItemId] = useState('')
    const [selectedEditItem, setSelectedEditItem] = useState(null);
    const [bankData, setBankData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [search, setSearch] = useState('');

    const [searchDoctor, setSearchDoctor] = useState('');
    const [selectedItem, setSelectedItem] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [unsavedItems, setUnsavedItems] = useState(false);
    const [nextPath, setNextPath] = useState("");
    
    useEffect(() => {
        if (searchDoctor) {
            const ListOfDoctor = async () => {
                let data = new FormData();
                const params = {
                    search: searchDoctor
                };
                setIsLoading(true);
                try {
                    const response = await axios.post(
                        "doctor-list?",
                        data,
                        {
                            params: params,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setDoctorData(response.data.data);
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    console.error("API error:", error);
                }
            };

            const delayDebounceFn = setTimeout(() => {
                ListOfDoctor();
            }, 500); // Debounce to prevent too many API calls

            return () => clearTimeout(delayDebounceFn);
        } else {
            setDoctorData([]);
        }
    }, [searchDoctor]);
    useEffect(() => {
        // ListOfDoctor();
        BankList();
        const handleClickOutside = (event) => {
            if (tableRef.current && !tableRef.current.contains(event.target)) {
                setIsVisible(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const totalAmount = (qty / unit);
        const total = parseFloat(base) * totalAmount;
        if (total) {
            setItemAmount(total.toFixed(2));
        } else {
            setItemAmount(0);
        }
    }, [base, qty]);

    useEffect(() => {
        const discountAmount = (totalAmount * finalDiscount) / 100;
        const finalAmount = totalAmount - discountAmount;
        setNetAmount(finalAmount.toFixed(2));
    }, [totalAmount, finalDiscount]);

    const handleCustomerOption = (event, newValue) => {
        setCustomer(newValue);
        // customerAllData(newValue);
    };
    // const handleCustomerInput = (event, newInputValue) => {
    //     setCustomer(newInputValue);
    //     //console.log(searchItem)
    //     customerAllData(newInputValue);
    // };

    const BankList = async () => {
        let data = new FormData()
        try {
            await axios.post('bank-list', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setBankData(response.data.data)
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }
    const ListOfDoctor = async () => {
        let data = new FormData();
        setIsLoading(true);
        try {
            await axios.post("doctor-list", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setDoctorData(response.data.data)
                setIsLoading(false);
            })
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);
        }
    }

    useEffect(() => {
        if (searchQuery) {
            const customerAllData = async () => {
                let data = new FormData();
                const params = {
                    search: searchQuery
                };
                setIsLoading(true);
                try {
                    const response = await axios.post(
                        "list-customer?",
                        data,
                        {
                            params: params,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    setCustomerDetails(response.data.data);
                    setIsLoading(false);
                } catch (error) {
                    setIsLoading(false);
                    console.error("API error:", error);
                }
            };

            const delayDebounceFn = setTimeout(() => {
                customerAllData();
            }, 500); 

            return () => clearTimeout(delayDebounceFn);
        } else {
            setCustomerDetails([]);
        }
    }, [searchQuery, token]);
    
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        getSaleItemList(value);
        ; 
    };


    const handleChecked = async (itemId, checked) => {
        let data = new FormData();
        data.append("id", itemId);
        data.append("type", 0);

        try {
            const response = await axios.post("sales-return-iteam-select", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            validfilter()
            console.log(response, "response")
            // if (response.data) {
            //     setSelectedItem((prevSelected) => {
            //         if (checked) {
            //             return [...prevSelected, itemId];
            //         } else {
            //             return prevSelected.filter((id) => id !== itemId);
            //         }
            //     });
            //     const allSelected = returnItemList?.item_list.every(item => item.iss_check) || false;
            //     setSelectAll(allSelected);
            //     validfilter()
            // }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const validfilter = () => {
        const newErrors = {};

        if (!customer) { newErrors.customer = 'Customer is required'; toast.error('Customer is required'); }
        if (!startDate) { newErrors.startDate = 'startDate is required'; toast.error('Start Date is required'); }
        if (!endDate) { newErrors.endDate = 'endDate is required'; toast.error('End Date is required'); }
        // setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            getSaleItemList();
        }
    }

    const getSaleItemList = async (value) => {
        let data = new FormData();
        data.append('customer_id', customer.id || '');
        data.append('start_date', startDate.format('YYYY-MM-DD') || '');
        data.append('end_date', endDate.format('YYYY-MM-DD') || '');
        data.append('search', value || '');


        const params = {
            customer_id: customer.id,
            start_date: startDate,
            end_date: endDate
        }
        setIsLoading(true);
        try {
            await axios.post("sales-return-iteam-list", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setSaleItems(response.data.data)
                setTotalBase(response.data.data.total_base)
                setSgst(response.data.data.sgst)
                setCgst(response.data.data.cgst)
                setTotalAmount(response.data.data.sales_amount)
                setIsLoading(false);
            })
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);
        }
    }

    const editReturnItem = async () => {
        setUnsavedItems(true);

        let data = new FormData();
        data.append("id", selectedEditItemId)
        data.append('item_id', searchItemID)
        data.append("qty", qty)
        data.append("exp", expiryDate)
        data.append('gst', gst)
        data.append("mrp", mrp)
        data.append("unit", unit);
        data.append("random_number", randomNumber);
        data.append("unit", unit)
        data.append("batch", batch)
        data.append('location', loc)
        data.append("base", base)
        data.append('amt', itemAmount)
        data.append('net_rate', itemAmount)
        // data.append("order", order)
        const params = {
            id: selectedEditItemId
        };
        try {
            await axios.post("sales-return-edit-iteam?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                getSaleItemList();
                setSearchItem(null)
                setUnit('')
                setBatch('')
                setExpiryDate('');
                setMRP('')
                setQty('')
                setBase('')
                setGst('')
                setBatch('')
                setLoc('')
            })
        }
        catch (e) {
            //console.log(e)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (event.target === inputRef1.current) {
                inputRef2.current.focus();
            } else if (event.target === inputRef2.current) {
                inputRef3.current.focus();
            } else if (event.target === inputRef3.current) {
                inputRef4.current.focus();
            } else if (event.target === inputRef4.current) {
                inputRef5.current.focus();
            } else if (event.target === inputRef5.current) {
                inputRef6.current.focus();
            } else if (event.target === inputRef6.current) {
                inputRef7.current.focus();
            } else if (event.target === inputRef7.current) {
                inputRef8.current.focus();
            } else if (event.target === inputRef8.current) {
                inputRef9.current.focus();
            } else if (event.target === inputRef9.current) {
                inputRef10.current.focus();
            }
        };
    }


    const handleSubmit = () => {

        const newErrors = {};
        if (!customer) {
            newErrors.customer = 'Please select customer';
        }
        // if (selectedItem.length === 0) {
        //     newErrors.ItemId = 'Please select at least one item';
        //     toast.error('Please select at least one item');
        // }
        setError(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        submitSaleReturnData()
    }

    const submitSaleReturnData = async () => {
        let data = new FormData();
        data.append("bill_no", localStorage.getItem('SaleRetunBillNo') || '');
        data.append("bill_date", (selectedDate ? selectedDate.format('YYYY-MM-DD') : ''));
        data.append("customer_id", (customer && customer.id) ? customer.id : '');
        data.append("customer_address", address || '');
        data.append("doctor_id", (doctor && doctor.id) ? doctor.id : '');
        data.append('payment_name', paymentType || '');
        data.append('mrp_total', totalAmount || '');
        data.append('total_discount', finalDiscount || '');
        data.append('other_amount', otherAmt || '');
        data.append('net_amount', netAmount || '');
        data.append('total_base', totalBase || '');
        data.append('igst', '0');  // Assuming IGST is always 0
        data.append('cgst', cgst || '');
        data.append('sgst', sgst || '');
        data.append('product_list', JSON.stringify(saleItems.sales_item) || '');

        try {
            await axios.post("sales-return-create", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                //console.log(response.data);
                //console.log("response===>", response.data);
                toast.success(response.data.message);
                setUnsavedItems(false);

                setTimeout(() => {
                    history.push('/saleReturn/list');
                }, 2000);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const handleDoctorOption = (event, newValue) => {
        setDoctor(newValue);
    };

    const deleteOpen = (Id) => {
        setIsDelete(true);
        setSaleItemId(Id);

    };

    const handleDeleteItem = async (saleItemId) => {
        if (!saleItemId) return;
        let data = new FormData();
        data.append("id", saleItemId);
        const params = {
            id: saleItemId,
        };
        try {
            await axios.post("sales-return-delete-iteam?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                getSaleItemList();
                setIsDelete(false);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const resetValue = () => {
        setUnit('');
        setBatch('');
        setSearchItem(' ')
        setExpiryDate('');
        setMRP('');
        setBase('');
        setGst('');
        setQty('')
        setOrder('')
        setLoc('');
        if (isNaN(itemAmount)) {
            setItemAmount(0);
        }
    }

    const handleEditClick = (item) => {
        setSelectedEditItem(item);
        setIsEditMode(true);
        setSelectedEditItemId(item.id);
        setSearchItem(item.iteam_name)

        if (selectedEditItem) {
            setUnit(selectedEditItem.unit);
            setSearchItemID(selectedEditItem.item_id)
            setBatch(selectedEditItem.batch);
            setExpiryDate(selectedEditItem.exp);
            setMRP(selectedEditItem.mrp);
            setQty(selectedEditItem.qty);
            setBase(selectedEditItem.base);
            setGst(selectedEditItem.gst);
            setLoc(selectedEditItem.location);
            setOrder(selectedEditItem.order);
            setItemAmount(selectedEditItem.net_rate);
            setRandomNumber(selectedEditItem.random_number)
        }
    };

    const handleNavigation = (path) => {
        setOpenModal(true); // Show modal
        setNextPath(path);   // Save the next path to navigate after confirmation
    };

    // Handle leaving page after user confirms in modal
    const handleLeavePage = () => {
        let data = new FormData();

        const params = {
            random_number: localStorage.getItem('RandomNumber')
        };
        axios.post("sales-return-delete-history", data, {
            params: params,
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                setOpenModal(false);
                setUnsavedItems(false); // Reset unsaved changes
                history.push(nextPath); // Navigate to the saved path
            })
            .catch(error => {
                console.error("Error deleting items:", error);
            });
    };

    return (
        <>
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
                <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                    <div>
                        <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <span className="cursor-pointer" style={{ color: 'rgba(12, 161, 246, 1)', alignItems: 'center', fontWeight: 700, fontSize: '20px', minWidth: "115px", cursor: "pointer" }} onClick={() => { history.push('/saleReturn/list') }} >Sales Return</span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', marginTop: '8px', color: "rgba(4, 76, 157, 1)" }} />
                                <span style={{ color: 'rgba(4, 76, 157, 1)', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>New</span>
                                <BsLightbulbFill className="mt-1 w-6 h-6 sky_text hover-yellow" />
                            </div>
                            <div className="headerList">
                                <Select
                                    labelId="dropdown-label"
                                    id="dropdown"
                                    value={paymentType}
                                    sx={{ minWidth: '150px' }}
                                    onChange={(e) => { setPaymentType(e.target.value) }}
                                    size="small"
                                >
                                    <MenuItem value="cash">Cash</MenuItem>
                                    <MenuItem value="credit">Credit</MenuItem>
                                    {bankData?.map(option => (
                                        <MenuItem key={option.id} value={option.id}>{option.bank_name}</MenuItem>
                                    ))}
                                </Select>
                                {/* <Button variant="contained" sx={{ textTransform: 'none', background: "rgb(4, 76, 157)" }}> <FiPrinter className="w-4 h-4 mr-1" />Save & Print</Button> */}
                                <Button variant="contained" sx={{ textTransform: 'none', background: "rgb(4, 76, 157)" }} onClick={handleSubmit}> Submit</Button>

                            </div>
                        </div>
                        <div className="border-b">
                            <div className="firstrow flex">
                                <div className="detail mt-1" >
                                    <div className="detail  p-2 rounded-md" style={{ background: "#044c9d", width: "100%" }} >
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <div className="heading" style={{ color: 'white', fontWeight: "500", alignItems: "center", marginLeft: "15px" }}>Bill No <span style={{ marginLeft: '35px' }}> Bill Date</span> </div>
                                            <div className="flex gap-1">
                                                <div style={{ color: 'white', fontWeight: "500", alignItems: "center", marginTop: '8px', marginLeft: "15px", fontWeight: "bold", width: '19%' }}>{localStorage.getItem('SaleRetunBillNo')}  </div>
                                                <div style={{ color: 'white', fontWeight: "500", alignItems: "center", marginTop: '8px', fontWeight: "bold" }}>|</div>
                                                <DatePicker
                                                    color="white"
                                                    width="100%"
                                                    value={selectedDate}
                                                    onChange={(newDate) => setSelectedDate(newDate)}
                                                    format="DD/MM/YYYY"
                                                    maxDate={dayjs()}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': {
                                                                border: 'none',
                                                            },
                                                            '&:hover fieldset': {
                                                                border: 'none',
                                                            },
                                                            '&.Mui-focused fieldset': {
                                                                border: 'none',
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                color: 'white',
                                                                fontWeight: "bold"
                                                            },
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            color: 'white',
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: "#0ca1f6",
                                                            padding: "10px",
                                                            borderRadius: "50%",
                                                            alignItems: "center"
                                                        },
                                                    }}
                                                />
                                            </div>
                                        </LocalizationProvider>

                                    </div>
                                </div>
                                <div className="detail" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "rgba(4, 76, 157, 1)" }}>Customer Mobile / Name</span>
                                    <Autocomplete
                                        value={customer}
                                        onChange={handleCustomerOption}
                                        inputValue={searchQuery}
                                        onInputChange={(event, newInputValue) => {
                                            setSearchQuery(newInputValue);
                                        }}
                                        options={customerDetails}
                                        getOptionLabel={(option) => option.name ? `${option.name} [${option.phone_number}]` : option.phone_number || ''}
                                        isOptionEqualToValue={(option, value) => option.phone_number === value.phone_number}
                                        loading={isLoading}
                                        sx={{
                                            width: '100%',
                                            minWidth: '400px',
                                            '& .MuiInputBase-root': {
                                                height: 20,
                                                fontSize: '1.10rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                padding: '10px 14px',
                                            },
                                            '@media (max-width:600px)': {
                                                minWidth: '300px',
                                            },
                                        }}

                                        renderOption={(props, option) => (
                                            <ListItem {...props}>
                                                <ListItemText
                                                    primary={`${option.name} `}
                                                    secondary={`Mobile No: ${option.phone_number}`}
                                                />
                                            </ListItem>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                placeholder="Search by Mobile, Name"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                    style: { height: 55 },
                                                }}
                                                sx={{
                                                    '& .MuiInputBase-input::placeholder': {
                                                        fontSize: '1rem',
                                                        color: 'black',
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                    {error.customer && <span style={{ color: 'red', fontSize: '14px' }}>{error.customer}</span>}
                                </div>

                                <div className='flex items-center gap-4'>
                                    <div className='flex gap-8 pb-4'>
                                        <div >
                                            <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "rgba(4, 76, 157, 1)" }}>Start Date</span>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    value={startDate}
                                                    onChange={(newDate) => setStartDate(newDate)}
                                                    format="DD/MM/YYYY"
                                                />
                                            </LocalizationProvider>
                                        </div>

                                        <div>
                                            <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "rgba(4, 76, 157, 1)" }}>End Date</span>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    value={endDate}
                                                    onChange={(newDate) => setEndDate(newDate)}
                                                    format="DD/MM/YYYY"
                                                />
                                            </LocalizationProvider>
                                        </div>
                                    </div>

                                    <Button
                                        variant="contained"
                                        size="small"
                                        style={{
                                            minHeight: '41px',
                                            alignItems: "center",
                                            height: '41px',
                                            marginTop: "7px",
                                            background: "rgba(4, 76, 157, 1)"
                                        }}
                                        onClick={validfilter}
                                    >
                                        <FilterAltIcon size='large' style={{ color: "white", fontSize: '20px' }} /> Filter
                                    </Button>
                                </div>

                                <div className="detail">
                                    <span className="heading mb-2" style={{ fontWeight: "500", fontSize: "17px", color: "rgba(4, 76, 157, 1)" }}>Address</span>

                                    <TextField id="outlined-basic"
                                        value={address}
                                        onChange={(e) => { setAddress(e.target.value) }}
                                        sx={{
                                            width: 300,
                                            '& .MuiInputBase-root': {
                                                height: 55,
                                                fontSize: '1.25rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                padding: '10px 14px',
                                            },
                                        }} variant="outlined" />
                                </div>

                                <div className="detail">
                                    <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "rgba(4, 76, 157, 1)" }}>Doctor </span>
                                    <Autocomplete
                                        value={doctor}
                                        onChange={handleDoctorOption}
                                        inputValue={searchDoctor}
                                        onInputChange={(event, newInputValue) => {
                                            setSearchDoctor(newInputValue);
                                        }}
                                        options={doctorData}
                                        getOptionLabel={(option) => option.name ? `${option.name} [${option.clinic}]` : option.clinic || ''}
                                        isOptionEqualToValue={(option, value) => option.clinic === value.clinic}
                                        loading={isLoading}
                                        sx={{
                                            width: '100%',
                                            minWidth: '400px',
                                            '& .MuiInputBase-root': {
                                                height: 20,
                                                fontSize: '1.10rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                padding: '10px 14px',
                                            },
                                            '@media (max-width:600px)': {
                                                minWidth: '300px',
                                            },
                                        }}
                                        renderOption={(props, option) => (
                                            <ListItem {...props}>
                                                <ListItemText
                                                    primary={`${option.name} `}
                                                    secondary={`Mobile No: ${option.clinic}`}
                                                />
                                            </ListItem>
                                        )}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                placeholder="Search by DR. Name, Clinic Name"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <>
                                                            {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </>
                                                    ),
                                                    style: { height: 45 },
                                                }}
                                                sx={{
                                                    '& .MuiInputBase-input::placeholder': {
                                                        fontSize: '1rem',
                                                        color: 'black',
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="scroll-two">
                                    <table className="saleTable">
                                        <thead>
                                            <tr>
                                                <th className="w-1/4">Item Name</th>
                                                <th >Unit </th>
                                                <th >Batch </th>
                                                <th >Expiry</ th>
                                                <th >MRP</th>
                                                <th>Base</th>
                                                <th >GST%  </th>
                                                <th >QTY </th>
                                                {/* <th >Order</th> */}
                                                <th >Loc.</ th>
                                                <th >Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {saleItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan={12} style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>No record found</td>
                                                </tr>
                                            ) : (<>
                                                <tr  className="item-List border-b border-gray-400" >

                                                    <td >
                                                        <DeleteIcon className="delete-icon" onClick={resetValue} />
                                                        {searchItem}
                                                    </td>
                                                    
                                                    <td>

                                                        <TextField
                                                            id="outlined-number"
                                                            disabled
                                                            type="number"
                                                            inputRef={inputRef1}
                                                            onKeyDown={handleKeyDown}
                                                            size="small"
                                                            value={unit}
                                                            sx={{ width: '90px' }}
                                                            onChange={(e) => { setUnit(e.target.value) }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            id="outlined-number"
                                                            type="number"
                                                            sx={{ width: '110px' }}
                                                            size="small"
                                                            disabled
                                                            value={batch}
                                                            onChange={(e) => { setBatch(e.target.value) }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            id="outlined-number"
                                                            disabled
                                                            size="small"
                                                            sx={{ width: '100px' }}
                                                            inputRef={inputRef3}
                                                            onKeyDown={handleKeyDown}
                                                            value={expiryDate}
                                                            placeholder="MM/YY"
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            disabled
                                                            id="outlined-number"
                                                            type="number"
                                                            sx={{ width: '100px' }}
                                                            size="small"
                                                            inputRef={inputRef4}
                                                            onKeyDown={handleKeyDown}
                                                            value={mrp}
                                                            onChange={(e) => { setMRP(e.target.value) }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            id="outlined-number"
                                                            type="number"
                                                            sx={{ width: '120px' }}
                                                            size="small"
                                                            inputRef={inputRef5}
                                                            onKeyDown={handleKeyDown}
                                                            value={base}
                                                            onChange={(e) => { setBase(e.target.value) }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            id="outlined-number"
                                                            type="number"
                                                            disabled
                                                            size="small"
                                                            inputRef={inputRef8}
                                                            onKeyDown={handleKeyDown}
                                                            sx={{ width: '80px' }}
                                                            value={gst}
                                                            onChange={(e) => { setGst(e.target.value) }}
                                                        />
                                                    </td>
                                                    <td>

                                                        <TextField
                                                            id="outlined-number"
                                                            type="number"
                                                            sx={{ width: '70px' }}
                                                            size="small"
                                                            inputRef={inputRef5}
                                                            onKeyDown={handleKeyDown}
                                                            value={qty}
                                                            onChange={(e) => { setQty(e.target.value) }}
                                                        />
                                                    </td>
                                                    {/* <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        sx={{ width: '80px' }}
                                                        size="small"
                                                        inputRef={inputRef6}
                                                        onKeyDown={handleKeyDown}
                                                        value={order}
                                                        onChange={(e) => { setOrder(e.target.value) }}
                                                    />
                                                </td> */}

                                                    <td >
                                                        <TextField
                                                            id="outlined-number"
                                                            size="small"
                                                            inputRef={inputRef9}
                                                            onKeyDown={handleKeyDown}
                                                            disabled
                                                            sx={{ width: '100px' }}
                                                            value={loc}
                                                            onChange={(e) => { setLoc(e.target.value) }}
                                                        />
                                                    </td>
                                                    <td className="total">{itemAmount}</td>
                                                </tr>
                                              <tr className="item-List border-b border-gray-400 ">
                                                <td>
                                                    <TextField
                                                        id="outlined-basic"
                                                        size="small"
                                                        sx={{ width: "90%",marginLeft: "20px",marginBlock:"10px" }}
                                                        value={search}
                                                        onChange={handleInputChange}
                                                        variant="outlined"
                                                        placeholder="Please search any items.."
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon />
                                                                </InputAdornment>
                                                            ),
                                                            type: "search",
                                                        }}
                                                    />
                                                </td>                                                    <td></td>
                                                    <td></td>
                                                    {/* <td></td> */}
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td >
                                                        <Button variant="contained" color="success" marginRight="20px" onClick={editReturnItem}>< BorderColorIcon className="w-7 h-6 text-white  p-1 cursor-pointer" />Edit</Button>
                                                    </td>
                                                </tr>
                                                {saleItems.sales_item.length > 0 ?
                                                    <>
                                                        {saleItems?.sales_item?.map(item => (
                                                            <tr key={item.id} className="item-List border-b border-gray-400  "
                                                                onClick={(event) => handleEditClick(item, event.target)}                                                            >
                                                                <td style={{
                                                                    display: 'flex', gap: '8px',alignItems:"center"
                                                                }}>
                                                                    <td>
                                                                        <Checkbox
                                                                            key={item.id}
                                                                            checked={item?.iss_check}
                                                                            onClick={(event) => {
                                                                                event.stopPropagation();
                                                                            }}
                                                                            onChange={(event) => handleChecked(item.id, event.target.checked)}
                                                                        />
                                                                    </td>
                                                                    < BorderColorIcon color="primary" className="cursor-pointer" onClick={() => handleEditClick(item)} />
                                                                    <DeleteIcon className="delete-icon" onClick={() => deleteOpen(item.id)} />
                                                                    {item.iteam_name}
                                                                </td>
                                                                <td>{item.unit}</td>
                                                                <td>{item.batch}</td>
                                                                <td>{item.exp}</td>
                                                                <td>{item.mrp}</td>
                                                                <td>{item.base}</td>
                                                                <td>{item.gst}</td>
                                                                <td>{item.qty}</td>
                                                                {/* <td>{item.order}</td> */}
                                                                <td>{item.location}</td>
                                                                <td>{item.net_rate}</td>
                                                            </tr>
                                                        ))}
                                                    </> :
                                                    <tr>
                                                        <td colSpan={12} style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>No record found</td>
                                                    </tr>
                                                }

                                            </>)}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {saleItems?.sales_item?.length > 0 && (
                                <div className="flex gap-10 justify-end mt-4 "  >
                                    <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                        <div>
                                            <label className="font-bold">Total Base: </label>
                                        </div>
                                    </div>
                                    <div class="totals">
                                        <span style={{ fontWeight: 600 }}>{totalBase} /-</span>
                                    </div>

                                    <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
                                        <div>
                                            <label className="font-bold">SGST : </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">CGST: </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">IGST: </label>
                                        </div>

                                    </div>
                                    <div class="totals">
                                        <div className="font-bold">
                                            {sgst}
                                        </div>
                                        <div className="font-bold">
                                            {cgst}
                                        </div>
                                        <div>
                                            <TextField size="small" style={{ width: '105px' }} sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '35px',
                                                },
                                            }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '22px', flexDirection: 'column' }}>
                                        <div>
                                            <label className="font-bold">Total Amount : </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">Discount % : </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">Other Amount: </label>
                                        </div>
                                        <div>
                                            <label className="font-bold" >Net Amount % : </label>
                                        </div>
                                    </div>
                                    <div class="totals">
                                        <div>
                                            <span style={{ fontWeight: 600 }}>{totalAmount}/-</span>
                                        </div>
                                        <div>
                                            <TextField value={finalDiscount} onChange={(e) => { setFinalDiscount(e.target.value) }} size="small" style={{ width: '105px' }} sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '35px'
                                                },
                                            }} />
                                        </div>
                                        <div>
                                            <TextField value={otherAmt} onChange={(e) => { setOtherAmt(e.target.value) }} size="small" style={{ width: '105px' }} sx={{
                                                '& .MuiInputBase-root': {
                                                    height: '35px',
                                                },
                                            }} />
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 800, fontSize: '22px', borderBottom: "2px solid rgb(12, 161, 246)" }}>{netAmount}/-</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Delete PopUP */}
                            <div id="modal" value={IsDelete}
                                className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
                                    }`}>
                                <div />
                                <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
                                        viewBox="0 0 24 24" onClick={() => setIsDelete(false)}>
                                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
                                    </svg>
                                    <div className="my-4 text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 fill-red-500 inline" viewBox="0 0 24 24">
                                            <path
                                                d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                                                data-original="#000000" />
                                            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                                                data-original="#000000" />
                                        </svg>
                                        <h4 className="text-lg font-semibold mt-6">Are you sure you want to delete it?</h4>
                                    </div>
                                    <div className="flex gap-5 justify-center">
                                        <button type="submit"
                                            className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                                            onClick={() => handleDeleteItem(saleItemId)}
                                        >Delete</button>
                                        <button type="button"
                                            className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                                            onClick={() => setIsDelete(false)}
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
            <Prompt
                when={unsavedItems} // Triggers only if there are unsaved changes
                message={(location) => {
                    handleNavigation(location.pathname);
                    return false; // Prevent automatic navigation
                }}
            />
            <div id="modal" value={openModal}
                className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${openModal ? "block" : "hidden"}`}>

                <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                    {/* Close button */}
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500"
                        viewBox="0 0 24 24" onClick={() => setOpenModal(false)}>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
                    </svg>

                    <div className="my-4 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-12 fill-red-500 inline" viewBox="0 0 24 24">
                            <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                            <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
                        </svg>
                        <h5 className="text-lg font-semibold mt-9" style={{ fontSize: "0.9rem" }}> You have unsaved changes. Are you sure you want to leave? All added items will be deleted.</h5>
                    </div>

                    <div className="flex gap-5 justify-center mt-10">
                        <button
                            className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
                            onClick={handleLeavePage}
                        >
                            Delete
                        </button>
                        <button
                            className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                            onClick={() => setOpenModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Salereturn