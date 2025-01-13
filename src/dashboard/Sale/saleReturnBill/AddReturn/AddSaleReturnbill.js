import Header from "../../../Header"
import React, { useState, useRef, useEffect } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, Checkbox, CircularProgress, Input, InputAdornment, ListItemText, TextField } from "@mui/material";
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
import { VscDebugStepBack } from "react-icons/vsc";
import { IoMdClose } from "react-icons/io";
import { FaCaretUp } from "react-icons/fa6";
import { Modal } from "flowbite-react";

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
    const [tempQty, setTempQty] = useState('')
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
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalMargin, setTotalMargin] = useState(0)
    const [totalNetRate, setTotalNetRate] = useState(0);
    const [marginNetProfit, setMarginNetProfit] = useState(0);
    const [itemAmount, setItemAmount] = useState(null);
    const [selectedEditItemId, setSelectedEditItemId] = useState(null);
    const [IsDelete, setIsDelete] = useState(false);
    let defaultDate = new Date();
    const [cgst, setCgst] = useState('');
    const [sgst, setSgst] = useState('');
    const [searchItem, setSearchItem] = useState('');
    const [itemList, setItemList] = useState([]);
    defaultDate.setDate(defaultDate.getDate() + 3);
    const [saleItems, setSaleItems] = useState([]);
    const [totalGst, setTotalGst] = useState(0);
    const [totalBase, setTotalBase] = useState(0);
    const [givenAmt, setGivenAmt] = useState(null);
    const [otherAmt, setOtherAmt] = useState('');
    const [roundOff, setRoundOff] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const [finalDiscount, setFinalDiscount] = useState(0);
    const [dueAmount, setDueAmount] = useState(null);
    const [startDate, setStartDate] = useState(dayjs().subtract(3, 'month'));
    const [endDate, setEndDate] = useState(dayjs());
    const [saleItemId, setSaleItemId] = useState('');
    const [selectedEditItem, setSelectedEditItem] = useState(null);
    const [bankData, setBankData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [search, setSearch] = useState('');
    const [searchDoctor, setSearchDoctor] = useState('');
    const [selectedItem, setSelectedItem] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [unsavedItems, setUnsavedItems] = useState(false);
    const [nextPath, setNextPath] = useState("");
    const [errors, setErrors] = useState({});
    const [uniqueId, setUniqueId] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        if (searchDoctor) {
            const ListOfDoctor = async () => {
                const params = {
                    search: searchDoctor
                };
                setIsLoading(true);
                try {
                    const response = await axios.post(
                        "doctor-list?",

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
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else {
            setDoctorData([]);
        }
    }, [searchDoctor]);
    useEffect(() => {
        // ListOfDoctor();
        const RandomNumber = localStorage.getItem('RandomNumber')
        setRandomNumber(RandomNumber)

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
        if (totalAmount < -otherAmt) {
            setOtherAmt('');
        }
        const finalAmount = Number(totalAmount) + Number(otherAmt || 0);
        const decimalPart = Number((finalAmount % 1).toFixed(2));
        const roundedDecimal = decimalPart;
        if (decimalPart < 0.50) {
            setRoundOff(-roundedDecimal);
            setNetAmount(Math.floor(finalAmount));
        } else {
            setRoundOff(1 - roundedDecimal);
            setNetAmount(Math.ceil(finalAmount));

        }
    }, [totalAmount, otherAmt]);

    const handleCustomerOption = (event, newValue) => {
        setUnsavedItems(true)
        setCustomer(newValue);
    };

    const BankList = async () => {
        try {
            await axios.post('bank-list', {
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

        setIsLoading(true);
        try {
            await axios.post("doctor-list", {
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
        }
    }, [selectedEditItem]);

    useEffect(() => {
        if (searchQuery) {
            const customerAllData = async () => {
                const params = {
                    search: searchQuery
                };
                setIsLoading(true);
                try {
                    const response = await axios.post(
                        "list-customer?",
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
    };

    const handleChecked = async (itemId, checked) => {
        setUnsavedItems(true);
        let data = new FormData();
        data.append("id", itemId ? itemId : '');
        data.append("type", 0);

        try {
            const response = await axios.post("sales-return-iteam-select", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                setSelectedItem((prevSelected) => {
                    if (checked) {
                        return [...prevSelected, itemId];
                    } else {
                        return prevSelected.filter((id) => id !== itemId);
                    }
                });
                // const allSelected = returnItemList?.item_list.every(item => item.iss_check) || false;
                // setSelectAll(allSelected);
                validfilter()

            }
        } catch (error) {
            console.error("API error:", error);

        }
    };

    const validfilter = () => {
        setUnsavedItems(true)
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
        data.append('customer_id', customer.id ? customer.id : '');
        data.append('start_date', startDate.format('YYYY-MM-DD') ? endDate.format('YYYY-MM-DD') : '');
        data.append('end_date', endDate.format('YYYY-MM-DD') ? endDate.format('YYYY-MM-DD') : '');
        data.append('search', value ? value : '');
        const params = {
            customer_id: customer.id ? customer.id : '',
            start_date: startDate ? startDate : '',
            end_date: endDate ? endDate : ''
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
                setTotalGst(response.data.data.total_gst)
                setSgst(response.data.data.sgst)
                setCgst(response.data.data.cgst)
                setTotalAmount(response.data.data.sales_amount)
                setTotalMargin(response.data.data.total_margin)
                setTotalNetRate(response.data.data.total_net_rate)
                setMarginNetProfit(response.data.data.margin_net_profit)
                setIsLoading(false);
            })
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);

        }
    }

    const editReturnItem = async () => {
        const newErrors = {};
        setUnsavedItems(true);

        if (Number(tempQty) < Number(qty)) {
            newErrors.greatqty = 'Quantity should not be greater than purchase quantity ';
            toast.error('Quantity should not be greater than purchase quantity ')
            return
        }

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            let data = new FormData();
            data.append("id", selectedEditItemId ? selectedEditItemId : '')
            data.append('item_id', searchItemID ? searchItemID : '')
            data.append("qty", qty ? qty : '')
            data.append("exp", expiryDate ? expiryDate : '')
            data.append('gst', gst ? gst : '')
            data.append("mrp", mrp ? mrp : '')
            data.append("unit", unit);
            data.append("unit", unit ? unit : '')
            data.append("batch", batch ? batch : '')
            data.append('location', loc ? loc : '')
            data.append("base", base ? base : '')
            data.append('amt', itemAmount ? itemAmount : '')
            data.append('net_rate', itemAmount ? itemAmount : '')
            data.append("total_gst", totalGst || '')

            // data.append("order", order)
            const params = {
                id: selectedEditItemId || ''
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
                    setQty(0)
                    setBase('')
                    setGst('')
                    setLoc('')
                })
            }
            catch (e) {
            }
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
        // if (selectedItem === 0) {
        //     newErrors.ItemId = 'Please select at least one item';
        //     toast.error('Please select at least one item');
        // }
        setError(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        submitSaleReturnData();
    }

    const submitSaleReturnData = async () => {
        const hasUncheckedItems = saleItems?.sales_item.every(item => item.iss_check === false)
        if (hasUncheckedItems) {
            toast.error('Please select at least one item');;

        } else {
            let data = new FormData();
            data.append("bill_no", localStorage.getItem('SaleRetunBillNo') ? localStorage.getItem('SaleRetunBillNo') : '');
            data.append("bill_date", (selectedDate ? selectedDate.format('YYYY-MM-DD') : ''));
            data.append("customer_id", (customer && customer.id) ? customer.id : '');
            data.append("customer_address", address ? address : '');
            data.append("doctor_id", (doctor && doctor.id) ? doctor.id : '');
            data.append('payment_name', paymentType ? paymentType : '');
            data.append('mrp_total', totalAmount ? totalAmount : '');
            data.append('total_discount', finalDiscount ? finalDiscount : '');
            data.append('other_amount', otherAmt ? otherAmt : '');
            data.append('net_amount', netAmount ? netAmount : '');
            data.append('total_base', totalBase ? totalBase : '');
            data.append('total_gst', totalGst ? totalGst : '');
            data.append('round_off', roundOff ? roundOff : '');
            data.append('net_amount', netAmount ? netAmount : '');
            data.append('margin', totalMargin ? totalMargin : '');
            data.append('net_rate', totalNetRate ? totalNetRate : '');
            data.append('margin_net_profit', marginNetProfit)

            data.append('igst', '0');
            data.append('cgst', '0');
            data.append('sgst', '0');
            data.append('product_list', JSON.stringify(saleItems.sales_item) ? JSON.stringify(saleItems.sales_item) : '');

            try {
                await axios.post("sales-return-create", data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                ).then((response) => {
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

    }

    const handleDoctorOption = (event, newValue) => {
        setDoctor(newValue);
        setUnsavedItems(true)
    };

    const deleteOpen = (Id) => {
        setIsDelete(true);
        setSaleItemId(Id);

    };

    const handleDeleteItem = async (saleItemId) => {
        if (!saleItemId) return;
        let data = new FormData();
        data.append("id", saleItemId ? saleItemId : '');
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
        setQty(0)
        setOrder('')
        setLoc('');
        setItemAmount(0);
        if (isNaN(itemAmount)) {
            setItemAmount(0);
        }
    }

    const handleEditClick = (item) => {
        // const existingItem = uniqueId.find((obj) => obj.id === item.id);
        // if (!existingItem) {
        //     setUniqueId((prevUniqueIds) => [...prevUniqueIds, { id: item.id, qty: item.total_stock}]);
        //     setTempQty(item.total_stock);
        // } else {
        //     setTempQty(existingItem.total_stock);
        // }
        setTempQty(item.total_stock);

        setSelectedEditItem(item);
        setIsEditMode(true);
        setSelectedEditItemId(item.id);
        setSearchItem(item.iteam_name)
    };

    const handleQty = (value) => {
        const newQty = Number(value);
        if (newQty > tempQty) {
            setQty(tempQty);
            toast.error(`Quantity exceeds the allowed limit. Max available: ${tempQty}`);
        } else if (newQty < 0) {
            setQty(tempQty);
            toast.error(`Quantity should not be less than 0`);
        } else {
            setQty(newQty)
        }
    }

    useEffect(() => {
        const savedState = localStorage.getItem("unsavedItems");
        if (savedState === "false") {
            setUnsavedItems(true);
        }

        return () => {
            localStorage.setItem("unsavedItems", unsavedItems.toString());
        };
    }, [unsavedItems]);

    const handleNavigation = (path) => {
        setOpenModal(true);
        setNextPath(path);
    };

    const handleLeavePage = async () => {

        const randomNumber = Number(localStorage.getItem("RandomNumber"));
        let data = new FormData();
        data.append('customer_id', customer.id ? customer.id : '');
        data.append('start_date', startDate.format('YYYY-MM-DD') ? endDate.format('YYYY-MM-DD') : '');
        data.append('end_date', endDate.format('YYYY-MM-DD') ? endDate.format('YYYY-MM-DD') : '');

        try {
            const response = await axios.post("sales-return-delete-history", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                setUnsavedItems(false);
                setOpenModal(false);
                localStorage.setItem("unsavedItems", unsavedItems.toString());
                setTimeout(() => {
                    history.push(nextPath);
                }, 0);
            }
        } catch (error) {
            console.error("Error deleting items:", error);
        }
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
                <div className="sale_rtn_add" style={{ padding: "0px 20px 0px", overflow: "auto" }} >
                    <div>
                        <div className='py-3 header_sale_divv' style={{ display: 'flex', gap: '4px', alignItems: "center" }}>
                            <div style={{ display: 'flex', gap: '7px', alignItems: "center" }}>
                                <span className="cursor-pointer" style={{ color: 'var(--color2)', alignItems: 'center', fontWeight: 700, fontSize: '20px', minWidth: "117px", cursor: "pointer", whiteSpace: "nowrap", flexWrap: "nowrap" }} onClick={() => { history.push('/saleReturn/list') }} >Sales Return</span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', color: "var(--color1)" }} />
                                <span style={{ color: 'var(--color1)', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>New</span>
                                <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow" />
                            </div>
                            <div className="headerList">
                                <Select
                                    labelId="dropdown-label"
                                    id="dropdown"
                                    className="payment_divv"
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
                                {/* <Button variant="contained" sx={{ textTransform: 'none', background: "var(--color1)" }}> <FiPrinter className="w-4 h-4 mr-1" />Save & Print</Button> */}
                                <Button variant="contained" className="payment_btn_divv" sx={{ textTransform: 'none', background: "var(--color1)" }} onClick={handleSubmit}> Submit</Button>

                            </div>
                        </div>
                        <div className="border-b">
                            <div className="firstrow flex">
                                <div className="detail mt-1 custommedia" >
                                    <div className="detail  p-2 rounded-md" style={{ background: "var(--color1)", width: "100%" }} >
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
                                                            backgroundColor: "#6aa420",
                                                            padding: "10px",
                                                            borderRadius: "50%",
                                                            alignItems: "center"
                                                        },
                                                        '& .MuiAutocomplete-input': {
                                                            padding: "0.5px 4px 7.5px 5px"
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </LocalizationProvider>

                                    </div>
                                </div>
                                <div className="detail custommedia" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                    <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "var(--color1)", whiteSpace: "nowrap" }}>Customer Mobile / Name</span>
                                    <Autocomplete
                                        value={customer}
                                        onChange={handleCustomerOption}
                                        inputValue={searchQuery}
                                        onInputChange={(event, newInputValue) => {
                                            setSearchQuery(newInputValue);
                                            // setUnsavedItems(true);
                                        }}
                                        options={customerDetails}
                                        getOptionLabel={(option) => option.name ? `${option.name} [${option.phone_number}]` : option.phone_number || ''}
                                        isOptionEqualToValue={(option, value) => option.phone_number === value.phone_number}
                                        loading={isLoading}
                                        sx={{
                                            width: '100%',
                                            // minWidth: '400px',
                                            '& .MuiInputBase-root': {
                                                // height: 20,
                                                fontSize: '1.10rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                padding: '8px 8px',
                                            },

                                            // '& .MuiInputBase-root': {

                                            // fontSize: '1.10rem',
                                            // },
                                            // '& .MuiAutocomplete-inputRoot': {
                                            // padding: '10px 14px',
                                            // },
                                            // '@media (max-width:600px)': {
                                            //     minWidth: '300px',
                                            // },
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
                                                autoComplete="off"
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
                                                    style: { height: 53 },
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
                                <div className="detail custommedia" style={{ display: 'flex', width: '100%' }}>
                                    <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "var(--color1)", whiteSpace: "nowrap" }}>Doctor </span>
                                    <Autocomplete
                                        value={doctor}
                                        onChange={handleDoctorOption}
                                        inputValue={searchDoctor}
                                        onInputChange={(event, newInputValue) => {
                                            setSearchDoctor(newInputValue);
                                            // setUnsavedItems(true);

                                        }}
                                        options={doctorData}
                                        getOptionLabel={(option) => option.name ? `${option.name} [${option.clinic}]` : option.clinic || ''}
                                        isOptionEqualToValue={(option, value) => option.clinic === value.clinic}
                                        loading={isLoading}
                                        sx={{
                                            width: '100%',
                                            // minWidth: '400px',
                                            '& .MuiInputBase-root': {
                                                // height: 20,
                                                // fontSize: '1.10rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                // padding: '10px 14px',
                                            },
                                            '@media (max-width:600px)': {
                                                // minWidth: '300px',
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
                                                autoComplete="off"
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
                                                    style: { height: 53 },
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

                                <div className='flex items-center sale_dates_divv_main '>
                                    <div className='flex pb-4 sale_dates_divv'>
                                        <div style={{ padding: "0 5px", width: '100%' }}>
                                            <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "var(--color1)" }}>Start Date</span>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    value={startDate}
                                                    onChange={(newDate) => {
                                                        setStartDate(newDate);
                                                        setUnsavedItems(true);
                                                    }}
                                                    format="DD/MM/YYYY"
                                                    sx={{
                                                        width: "100%",
                                                        "& .MuiInputBase-root": {
                                                            height: "53px", // Set height here
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </div>

                                        <div style={{ padding: "0 5px", width: '100%' }}>
                                            <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "var(--color1)" }}>End Date</span>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                                <DatePicker
                                                    value={endDate}
                                                    onChange={(newDate) => {
                                                        setEndDate(newDate);
                                                        setUnsavedItems(true);
                                                    }}
                                                    format="DD/MM/YYYY"
                                                    sx={{
                                                        width: "100%",
                                                        "& .MuiInputBase-root": {
                                                            height: "53px", // Set height here
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </div>
                                    </div>
                                    <div className="mt-2 main_fltr_btn" style={{ padding: "0 5px" }}>
                                        <Button
                                            variant="contained"
                                            className="gap-2 sale_dates_divv_btn filter_btn_add"
                                            size="small"
                                            style={{
                                                // minHeight: '41px',
                                                alignItems: "center",
                                                height: '53px',
                                                // marginTop: "7px",
                                                background: "var(--color1)"
                                            }}
                                            onClick={validfilter}
                                        >
                                            <FilterAltIcon size='large' style={{ color: "white", fontSize: '20px' }} /> Filter
                                        </Button>
                                    </div>
                                </div>

                                {/* <div className="detail" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "var(--color1)" }}>Address</span>

                                    <TextField
                 autoComplete="off" id="outlined-basic"
                                        value={address}
                                        onChange={(e) => { setAddress(e.target.value) }}
                                        sx={{
                                            width: 300,
                                            '& .MuiInputBase-root': {
                                                // height: 55,
                                                // fontSize: '1.25rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                // padding: '10px 14px',
                                            },
                                        }} variant="outlined" />
                                </div> */}


                                <div className="scroll-two">
                                    <table className="saleTable ">
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid lightgray', background: 'rgba(63, 98, 18, 0.09)' }}>
                                                <th className="w-1/4 " style={{ textAlign: "center" }}>Item Name</th>
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
                                                <tr className="item-List border-b border-gray-400" >

                                                    <td  >
                                                        <DeleteIcon className="delete-icon" onClick={resetValue} />
                                                        {searchItem}
                                                    </td>

                                                    <td className="td-up " >

                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            disabled
                                                            type="number"
                                                            inputRef={inputRef1}
                                                            onKeyDown={handleKeyDown}
                                                            size="small"
                                                            value={unit}
                                                            sx={{ width: '130px', textAlign: 'right', }}
                                                            onChange={(e) => { setUnit(e.target.value) }}

                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="td-up "  >
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            type="string"
                                                            sx={{ width: '130px' }}
                                                            size="small"
                                                            disabled
                                                            value={batch}
                                                            // onChange={(e) => { setBatch(e.target.value) }}
                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="td-up " >
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            disabled
                                                            size="small"
                                                            sx={{ width: '130px' }}
                                                            inputRef={inputRef3}
                                                            onKeyDown={handleKeyDown}
                                                            value={expiryDate}
                                                            placeholder="MM/YY"
                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="td-up ">
                                                        <TextField
                                                            autoComplete="off"
                                                            disabled
                                                            id="outlined-number"
                                                            type="number"
                                                            sx={{ width: '130px' }}
                                                            size="small"
                                                            inputRef={inputRef4}
                                                            onKeyDown={handleKeyDown}
                                                            value={mrp}
                                                            onChange={(e) => { setMRP(e.target.value) }}
                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="td-up " >
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            type="number"
                                                            sx={{ width: '130px' }}
                                                            size="small"
                                                            inputRef={inputRef5}
                                                            onKeyDown={handleKeyDown}
                                                            value={base}
                                                            onChange={(e) => { setBase(e.target.value) }}
                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="td-up ">
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            type="number"
                                                            disabled
                                                            size="small"
                                                            inputRef={inputRef8}
                                                            onKeyDown={handleKeyDown}
                                                            sx={{ width: '130px' }}
                                                            value={gst}
                                                            onChange={(e) => { setGst(e.target.value) }}
                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="td-up ">

                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            type="number"
                                                            sx={{ width: '130px' }}
                                                            size="small"
                                                            inputRef={inputRef5}
                                                            onKeyDown={handleKeyDown}
                                                            value={qty}
                                                            onKeyPress={(e) => {
                                                                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            onChange={(e) => { handleQty(e.target.value) }}
                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td >
                                                    {/* <td>
                                                    <TextField
                 autoComplete="off"
                                                        id="outlined-number"
                                                        sx={{ width: '80px' }}
                                                        size="small"
                                                        inputRef={inputRef6}
                                                        onKeyDown={handleKeyDown}
                                                        value={order}
                                                        onChange={(e) => { setOrder(e.target.value) }}
                                                    />
                                                </td> */}

                                                    <td className="td-up ">
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            size="small"
                                                            inputRef={inputRef9}
                                                            onKeyDown={handleKeyDown}
                                                            disabled
                                                            sx={{ width: '130px' }}
                                                            value={loc}
                                                            onChange={(e) => { setLoc(e.target.value) }}
                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td style={{ textAlign: "right" }} className="total">{itemAmount}</td>
                                                </tr>
                                                <tr className="item-List border-b border-gray-400 ">
                                                    <td>
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-basic"
                                                            size="small"
                                                            sx={{ width: "415px", marginLeft: "20px", marginBlock: "10px" }}
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
                                                    </td>
                                                    <td colSpan={8}></td>
                                                    <td style={{ textAlign: "right" }} >
                                                        <Button variant="contained" marginRight="20px" onClick={editReturnItem} style={{ backgroundColor: "var(--color1)" }}>< BorderColorIcon className="w-7 h-6 text-white  p-1 cursor-pointer" />Edit</Button>
                                                    </td>
                                                </tr>
                                                {saleItems.sales_item.length > 0 ?
                                                    <>
                                                        {saleItems?.sales_item?.map(item => (
                                                            <tr key={item.id} className="item-List border-b border-gray-400 "
                                                                onClick={(event) => handleEditClick(item, event.target)} style={{ whiteSpace: 'nowrap' }}                        >
                                                                <td style={{
                                                                    display: 'flex', gap: '8px', alignItems: "center"
                                                                }}>
                                                                    <td>
                                                                        <Checkbox
                                                                            sx={{
                                                                                color: "var(--color2)", // Color for unchecked checkboxes
                                                                                '&.Mui-checked': {
                                                                                    color: "var(--color1)", // Color for checked checkboxes
                                                                                },
                                                                            }}
                                                                            key={item.id}
                                                                            checked={item?.iss_check}
                                                                            onClick={(event) => {
                                                                                event.stopPropagation();
                                                                            }}
                                                                            onChange={(event) => {
                                                                                handleChecked(item.id, event.target.unc);

                                                                            }}
                                                                        />
                                                                    </td>
                                                                    < BorderColorIcon color="primary" className="cursor-pointer" onClick={() => handleEditClick(item)} />
                                                                    {/* <DeleteIcon className="delete-icon" onClick={() => deleteOpen(item.id)} /> */}
                                                                    {item.iteam_name}
                                                                </td>
                                                                <td className="td-bottom"  >{item.unit}</td>
                                                                <td className="td-bottom"> {item.batch}</td>
                                                                <td className="td-bottom"> {item.exp}</td>
                                                                <td className="td-bottom"> {item.mrp}</td>
                                                                <td className="td-bottom"> {item.base}</td>
                                                                <td className="td-bottom"> {item.gst}</td>
                                                                <td className="td-bottom"> {item.qty}</td>
                                                                {/* className="td-bottom"  <td>{item.order}</td> */}
                                                                <td className="td-bottom"> {item.location}</td>
                                                                <td className="td-bottom">{item.net_rate}</td>
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

                            {/* {saleItems?.sales_item?.length > 0 && (
                                <div className="flex gap-10 justify-end mt-4 flex-wrap mr-5"  >
                                    <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                        <div>
                                            <label className="font-bold">Total GST : </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">Total Base : </label>
                                        </div>

                                        <div>
                                            <label className="font-bold">Profit: </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">Total Net Rate : </label>
                                        </div>
                                    </div>
                                    <div class="totals mr-5" style={{ display: 'flex', gap: '25px', flexDirection: 'column', alignItems: "end" }}>

                                        <div class="totals mr-5" style={{ display: 'flex', gap: '25px', flexDirection: 'column', alignItems: "end" }}>
                                            <span style={{ fontWeight: 600 }}>{totalGst || 0}</span>
                                            <span style={{ fontWeight: 600 }}>{totalBase}</span>
                                            <span style={{ fontWeight: 600 }}>₹ {marginNetProfit} ({Number(totalMargin).toFixed(2)} %) </span>
                                            <span style={{ fontWeight: 600 }}>₹ {totalNetRate} </span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                        <div>
                                            <label className="font-bold">Total Amount : </label>
                                        </div>

                                        <div>
                                            <label className="font-bold">Other Amount: </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">Round Off  : </label>
                                        </div>
                                        <div>
                                            <label className="font-bold" >Net Amount : </label>
                                        </div>
                                    </div>
                                    <div class="totals mr-5" style={{ display: 'flex', gap: '20px', flexDirection: 'column', alignItems: "end" }}>

                                        <div>
                                            <span style={{ fontWeight: 600 }}>{totalAmount}</span>
                                        </div>
                                      
                                        <div>
                                            <Input
                                                value={otherAmt}
                                                onKeyPress={(e) => {
                                                    const value = e.target.value;
                                                    const isMinusKey = e.key === '-';

                                                    // Allow Backspace and numeric keys
                                                    if (!/[0-9.-]/.test(e.key) && e.key !== 'Backspace') {
                                                        e.preventDefault();
                                                    }

                                                    // Allow only one '-' at the beginning of the input value
                                                    if (isMinusKey && value.includes('-')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setUnsavedItems(true);
                                                    const x = e.target.value
                                                    const y = (x)

                                                    if (-y >= totalAmount) {
                                                        setOtherAmt((-totalAmount))
                                                    } else {
                                                        setOtherAmt(y)
                                                    }
                                                }}
                                                size="small"
                                                style={{
                                                    width: "70px",
                                                    background: "none",
                                                    borderBottom: "1px solid gray",
                                                    justifyItems: "end",
                                                    outline: "none",
                                                }} sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: '35px',
                                                    },
                                                    "& .MuiInputBase-input": { textAlign: "end" }

                                                }} />
                                        </div>
                                        <div>
                                            <span >{!roundOff ? 0 : roundOff.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 800, fontSize: '22px' }}>{!netAmount ? 0 : netAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            )} */}

                            {saleItems?.sales_item?.length > 0 && (
                                <div className="sale_filtr_add" style={{ background: 'var(--color1)', color: 'white', display: "flex", position: 'fixed', width: '100%', bottom: '0', left: '0', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div className="" style={{ display: 'flex', whiteSpace: 'nowrap', position: 'sticky', left: '0', overflow: 'auto', padding: '20px' }}>
                                        <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                                            <label className="font-bold">Total GST : </label>

                                            <span style={{ fontWeight: 600 }}>{totalGst || 0}</span>
                                        </div>
                                        <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                                            <label className="font-bold">Total Base : </label>
                                            <span style={{ fontWeight: 600 }}>{totalBase}</span>
                                        </div>
                                        <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                                            <label className="font-bold">Profit : </label>
                                            <span style={{ fontWeight: 600 }}>₹ {marginNetProfit} ({Number(totalMargin).toFixed(2)} %) </span>
                                        </div>
                                        <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                                            <label className="font-bold">Total Net Rate : </label>
                                            <span style={{ fontWeight: 600 }}>₹ {totalNetRate} </span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="gap-2 invoice_total_fld" onClick={toggleModal} style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
                                            <label className="font-bold">Net Amount : </label>
                                            <span style={{ fontWeight: 800, fontSize: '22px' }}>{!netAmount ? 0 : netAmount}</span>
                                            <FaCaretUp />

                                        </div>

                                        <Modal
                                            show={isModalOpen}
                                            onClose={toggleModal}
                                            size="lg"
                                            position="bottom-center"
                                            className="modal_amount"
                                        // style={{ width: "50%" }}
                                        >
                                            <div style={{ backgroundColor: 'var(--COLOR_UI_PHARMACY)', color: 'white', padding: '20px', fontSize: 'larger', display: "flex", justifyContent: "space-between" }}>
                                                <h2 style={{ textTransform: "uppercase" }}>invoice total</h2>
                                                <IoMdClose onClick={toggleModal} cursor={"pointer"} size={30} />

                                            </div>
                                            <div
                                                style={{
                                                    background: "white",
                                                    padding: "20px",
                                                    width: "100%",
                                                    maxWidth: "600px",
                                                    margin: "0 auto",
                                                    lineHeight: "2.5rem"
                                                }}
                                            >

                                                <div className="" style={{ display: 'flex', justifyContent: "space-between" }}>
                                                    <label className="font-bold">Total Amount : </label>
                                                    <span style={{ fontWeight: 600 }}>{totalAmount}</span>
                                                </div>

                                                <div className="" style={{ display: 'flex', justifyContent: "space-between", paddingBottom: '5px' }}>
                                                    <label className="font-bold">Other Amount : </label>
                                                    <Input
                                                        value={otherAmt}
                                                        onKeyPress={(e) => {
                                                            const value = e.target.value;
                                                            const isMinusKey = e.key === '-';

                                                            // Allow Backspace and numeric keys
                                                            if (!/[0-9.-]/.test(e.key) && e.key !== 'Backspace') {
                                                                e.preventDefault();
                                                            }

                                                            // Allow only one '-' at the beginning of the input value
                                                            if (isMinusKey && value.includes('-')) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            setUnsavedItems(true);
                                                            const x = e.target.value
                                                            const y = (x)

                                                            if (-y >= totalAmount) {
                                                                setOtherAmt((-totalAmount))
                                                            } else {
                                                                setOtherAmt(y)
                                                            }
                                                        }}
                                                        size="small"
                                                        style={{
                                                            width: "70px",
                                                            background: "none",
                                                            // borderBottom: "1px solid gray",
                                                            justifyItems: "end",
                                                            outline: "none",

                                                        }} sx={{
                                                            '& .MuiInputBase-root': {
                                                                height: '35px',
                                                            },
                                                            "& .MuiInputBase-input": { textAlign: "end" }

                                                        }} />
                                                </div>

                                                <div className="" style={{ display: 'flex', justifyContent: "space-between", paddingBottom: '5px', borderTop: '1px solid var(--toastify-spinner-color-empty-area)', paddingTop: '5px' }}>
                                                    <label className="font-bold">Round Off : </label>
                                                    <span >{!roundOff ? 0 : roundOff.toFixed(2)}</span>
                                                </div>

                                                <div className="" style={{ display: "flex", alignItems: "center", cursor: "pointer", justifyContent: "space-between", borderTop: '2px solid var(--COLOR_UI_PHARMACY)', paddingTop: '5px' }}>
                                                    <label className="font-bold">Net Amount: </label>
                                                    <span style={{ fontWeight: 800, fontSize: "22px", color: "var(--COLOR_UI_PHARMACY)" }}>{netAmount}</span>
                                                </div>
                                            </div>
                                        </Modal>
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
                when={unsavedItems}
                message={(location) => {
                    handleNavigation(location.pathname);
                    return false;
                }}
            />
            <div
                id="modal"
                value={openModal}
                className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${openModal ? "block" : "hidden"}`}
            >
                <div />
                <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                    <div className="my-4 logout-icon">
                        <VscDebugStepBack className=" h-12 w-14" style={{ color: "#628A2F" }} />
                        <h4 className="text-lg font-semibold mt-6 text-center" style={{ textTransform: "none" }}>Are you sure you want to leave this page ?</h4>
                    </div>
                    <div className="flex gap-5 justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-blue-600 hover:bg-blue-600 active:bg-blue-500"
                            onClick={handleLeavePage}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-400 hover:text-black"
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