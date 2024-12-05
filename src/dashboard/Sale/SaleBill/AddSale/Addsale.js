import Header from "../../../Header"
import React, { useState, useRef, useEffect } from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import '../../../../App.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import { FaPlusCircle } from "react-icons/fa";
import { Alert, AlertTitle, Box, CircularProgress, Input, MenuItem, Modal, Select, Tooltip } from '@mui/material';
import { BsLightbulbFill } from "react-icons/bs";
import { FiPrinter } from "react-icons/fi";
import HistoryIcon from '@mui/icons-material/History';
import SearchIcon from '@mui/icons-material/Search';
import { Button, InputAdornment, ListItemText, TextField } from "@mui/material";
import ListItem from '@mui/material/ListItem';
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl } from '@mui/material';
import { GoInfo } from "react-icons/go";
import { toast, ToastContainer } from "react-toastify";
import { Prompt } from "react-router-dom/cjs/react-router-dom";
import { VscDebugStepBack } from "react-icons/vsc";
const Addsale = () => {
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
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [isLoading, setIsLoading] = useState(false);
    const [saleItemId, setSaleItemId] = useState(null);
    const [itemId, setItemId] = useState(null);
    const history = useHistory();
    const paymentOptions = [
        { id: 1, label: 'Cash' },
        { id: 2, label: 'UPI' }]
    const pickupOptions = [{ id: 1, label: 'Pickup' }, { id: 2, label: 'Delivery' }]
    const userId = localStorage.getItem("userId");
    const [customer, setCustomer] = useState('')
    const [paymentType, setPaymentType] = useState('cash');
    const [pickup, setPickup] = useState('Pickup')
    const [id, setId] = useState('')
    const [error, setError] = useState({ customer: '' });
    const [expiryDate, setExpiryDate] = useState('');
    const [selectedEditItemId, setSelectedEditItemId] = useState('');
    const [mrp, setMRP] = useState('');
    const [base, setBase] = useState('');
    const [barcode, setBarcode] = useState("");
    const [batchListData, setBatchListData] = useState([]);
    const [doctorName, setDoctorName] = useState('');
    const [customerName, setCustomerName] = useState('')
    const [mobileNo, setMobileNo] = useState('')
    const [randomNumber, setRandomNumber] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [ItemSaleList, setItemSaleList] = useState({ sales_item: [] });
    const [totalAmount, setTotalAmount] = useState(0)
    const [qty, setQty] = useState('');
    const [maxQty, setMaxQty] = useState('');
    const [order, setOrder] = useState('');
    const [roundOff, setRoundOff] = useState(0);
    const [uniqueId, setUniqueId] = useState([])
    const [itemEditID, setItemEditID] = useState(0);
    const [gst, setGst] = useState('');
    const [batch, setBatch] = useState('');
    const [unit, setUnit] = useState('')
    const [finalDiscount, setFinalDiscount] = useState(0)
    const [openAddPopUp, setOpenAddPopUp] = useState(false);
    const [openPurchaseHistoryPopUp, setOpenPurchaseHistoryPopUp] = useState(false);
    const [highlightedRowId, setHighlightedRowId] = useState(null);
    const [openCustomer, setOpenCustomer] = useState(false)
    const [doctor, setDoctor] = useState('');
    const [clinic, setClinic] = useState();
    const [netAmount, setNetAmount] = useState(0)
    const [loc, setLoc] = useState('')
    const [itemAmount, setItemAmount] = useState(null);
    let defaultDate = new Date()
    const [IsDelete, setIsDelete] = useState(false);
    const [searchItem, setSearchItem] = useState('')
    const [itemList, setItemList] = useState([])
    const [customerDetails, setCustomerDetails] = useState([])
    const [doctorData, setDoctorData] = useState([])
    const [value, setValue] = useState('')
    const [address, setAddress] = useState('');
    defaultDate.setDate(defaultDate.getDate() + 3)
    const [selectedEditItem, setSelectedEditItem] = useState(null);
    const [isVisible, setIsVisible] = useState(true);
    const tableRef = useRef(null);
    const [totalgst, setTotalgst] = useState(0);
    const [totalBase, setTotalBase] = useState(0);
    const [marginNetProfit, setMarginNetProfit] = useState(0);
    const [totalMargin, setTotalMargin] = useState(0);
    const [totalNetRate, setTotalNetRate] = useState(0);
    const [dueAmount, setDueAmount] = useState(null);
    const [givenAmt, setGivenAmt] = useState(null);
    const [otherAmt, setOtherAmt] = useState(0);
    const [searchItemID, setSearchItemID] = useState(null);
    const [bankData, setBankData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDoctor, setSearchDoctor] = useState('');
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [discountAmount, setDiscountAmount] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [unsavedItems, setUnsavedItems] = useState(false);
    const [nextPath, setNextPath] = useState("");
    const [ptr, setPtr] = useState();
    const [discount, setDiscount] = useState();
    const [barcodeItemName, setBarcodeItemName] = useState('');

    const LastPurchaseListcolumns = [
        { id: 'supplier_name', label: 'Distributor Name', minWidth: 170, height: 100 },
        { id: 'qty', label: 'QTY', minWidth: 100 },
        { id: 'fr_qty', label: 'Free', minWidth: 100 },
        { id: 'scheme_account', label: 'Sch. Amt', minWidth: 100 },
        { id: 'ptr', label: 'PTR', minWidth: 100 },
        { id: 'mrp', label: 'MRP', minWidth: 100 },
        { id: 'bill_date', label: 'Date', minWidth: 100 },
        { id: 'bill_no', label: 'Bill No', minWidth: 100 },
    ];
    const handleExpiryDateChange = (event) => {
        let inputValue = event.target.value;
        inputValue = inputValue.replace(/\D/g, '');

        if (inputValue.length > 2) {
            const month = inputValue.slice(0, 2);
            const year = inputValue.slice(2, 4);
            if (parseInt(month) > 12) {
                inputValue = 'MM';
            } else if (parseInt(month) < 1) {
                inputValue = '01';
            }
            inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 4)}`;
        }

        setExpiryDate(inputValue);
    };
    const handleOpenDialog = (id) => {
        setOpenPurchaseHistoryPopUp(true)
        lastPurchseHistory()
        setSearchItemID(id)
    }
    useEffect(() => {
        const discount = (totalAmount * finalDiscount) / 100;
        setDiscountAmount(discount.toFixed(2));

        if (otherAmt < 0 && Math.abs(otherAmt) > totalAmount) {
            setOtherAmt('');
        } else {
            let calculatedNetAmount = totalAmount - discount + Number(otherAmt);
            if (calculatedNetAmount < 0) {
                setOtherAmt(-(totalAmount - discount));
                calculatedNetAmount = 0;
            }
            const decimalPart = Number((calculatedNetAmount % 1).toFixed(2));
            const roundedDecimal = decimalPart;
            if (decimalPart < 0.50) {
                setRoundOff((-roundedDecimal).toFixed(2));
                setNetAmount(Math.floor(calculatedNetAmount));
            } else {
                setRoundOff((1 - roundedDecimal).toFixed(2));
                setNetAmount(Math.ceil(calculatedNetAmount));

            }

            const due = givenAmt - calculatedNetAmount;
            setDueAmount(due.toFixed(2));
        }
    }, [totalAmount, finalDiscount, otherAmt, givenAmt]);

    const handleOtherAmtChange = (e) => {
        const value = e.target.value;
        const numericValue = isNaN(value) || value === '' ? '' : Number(value);

        if (numericValue >= 0) {
            setOtherAmt(numericValue);
        } else {
            const negativeLimit = -totalAmount;
            if (numericValue < negativeLimit) {
                setOtherAmt(negativeLimit);
            } else {
                setOtherAmt(numericValue);
            }
        }
    };

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
        if (searchQuery) {
            const customerAllData = async () => {
                let data = new FormData();
                const params = {
                    search: searchQuery ? searchQuery : ""
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
            }, 500); // Debounce to prevent too many API calls

            return () => clearTimeout(delayDebounceFn);
        } else {
            setCustomerDetails([]);
        }
    }, [searchQuery, token]);

    useEffect(() => {
        if (searchDoctor) {
            const ListOfDoctor = async () => {
                let data = new FormData();
                const params = {
                    search: searchDoctor ? searchDoctor : ''
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
        if (itemId) {
            batchList(itemId);
        }
        const totalAmount = (qty / unit);
        const total = parseFloat(base) * totalAmount;
        if (total) {
            setItemAmount(total.toFixed(2));
        } else {
            setItemAmount(0);
        }
    }, [itemId, base, qty]);

    const handleSearch = async () => {
        let data = new FormData();
        data.append("search", searchItem);
        const params = {
            search: searchItem ? searchItem : ''
        };
        try {
            const res = await axios.post("item-search?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setItemList(response.data.data.data);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const customerAllData = async (searchQuery) => {
        let data = new FormData();
        const params = {
            search: searchQuery ? searchQuery : ""
        }
        setIsLoading(true);
        try {
            await axios.post("list-customer?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setCustomerDetails(response.data.data)
                setIsLoading(false);
            })
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);
        }
    }

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
    const handleInputChange = (event, newInputValue) => {
        setSearchItem(newInputValue);
        handleSearch(newInputValue);
        setUnsavedItems(true);

    };

    const handleCustomerOption = (event, newValue) => {
        setCustomer(newValue);
        setUnsavedItems(true);

    };

    const handleOptionChange = (event, newValue) => {
        setUnsavedItems(true);

        setValue(newValue);
        const itemName = newValue ? newValue.iteam_name : '';

        setSearchItem(itemName);
        setItemId(newValue?.id);
        setIsVisible(true);
        handleSearch(itemName);
        if (!itemName) {
            setExpiryDate('');
            setMRP('');
            setBase('');
            setGst('');
            setQty('');
            setLoc('');
            setUnit('');
            setBatch('');
        }

        if (isVisible && value && !batch) {
            const element = tableRef.current
            element.focus()
        }
    };

    const handlePassData = (event) => {
        setSearchItem(event.iteam_name)
        setBatch(event.batch_number);
        setItem(event.iteam_name);
        setUnit(event.unit);
        setExpiryDate(event.expiry_date);
        setMRP(event.mrp);
        setMaxQty(event.stock);
        setBase(event.mrp);
        setGst(event.gst_name);
        setQty(event.qty);
        setLoc(event.location)
    }

    const handleDoctorOption = (event, newValue) => {
        setDoctor(newValue);
        setUnsavedItems(true);

    };

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
        }
    }
    const AddDoctorRecord = async () => {
        let data = new FormData();
        data.append('name', doctorName ? doctorName : "");
        data.append('clinic', clinic ? clinic : '');
        try {
            await axios.post("doctor-create", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setOpenAddPopUp(false);
                setDoctorName('');
                setClinic('');
                toast.success(response.data.message);
            })
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.status == 400) {

                toast.error(error.response.data.message)
            }
        }
    }
    const AddCustomerRecord = async () => {
        let data = new FormData();
        data.append('name', customerName ? customerName : '');
        data.append('mobile_no', mobileNo ? mobileNo : '');
        try {
            await axios.post("create-customer", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {

                setOpenCustomer(false);
                setCustomerName('');
                setMobileNo('');
                toast.success(response.data.message);
            })
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.status == 400) {

                toast.error(error.response.data.message)
            }
        }
    }
    const lastPurchseHistory = async () => {
        let data = new FormData()
        const params = {
            item_id: itemId ? itemId : '',
        }
        setIsLoading(true);
        try {
            await axios.post('online-order-item?', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setPurchaseHistory(response.data.data)
                setIsLoading(false);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const handleDraft = () => {
        const newErrors = {};
        if (!customer) {
            newErrors.customer = 'Please select Customer';
        }
        else if (ItemSaleList?.sales_item.length == 0) {
            newErrors.item = 'Please Add any Item in Sale Bill';
            toast.error('Please Add any Item in Sale Bill')
        }
        setError(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        draftSaleData();
    }

    const handleEditClick = (item) => {
        if (!item) return; // Ensure the item is valid.

        // const existingItem = uniqueId.find((obj) => obj.id === item.id);
        // if (!existingItem) {
        //     setUniqueId((prevUniqueIds) => [...prevUniqueIds, { id: item.id, qty: item.qty }]);
        //     setMaxQty(item.qty);
        // } else {
        //     setMaxQty(existingItem.qty);
        // }

        setSelectedEditItem(item);
        setIsEditMode(true);
        setSelectedEditItemId(item.id);
        setBarcodeItemName(item.iteam_name);
        setSearchItem(item.iteam_name);
        setItemEditID(item.item_id);
        setLoc(item.location);

        if (selectedEditItem) {
            // setSearchItem(selectedEditItem.iteam_name);
            setUnit(selectedEditItem.unit);
            setBatch(selectedEditItem.batch);
            setExpiryDate(selectedEditItem.exp);
            setMRP(selectedEditItem.mrp);
            setQty(item.qty);
            setBase(item.base);
            setGst(selectedEditItem.gst_name);
            setOrder(selectedEditItem.order);
            setItemAmount(selectedEditItem.net_rate);
        }
    };

    const saleItemList = async () => {
        let data = new FormData();
        const params = {
            random_number: localStorage.getItem('RandomNumber') || ''
        };
        try {
            const res = await axios.post("sales-item-list?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                console.log('response-------- :>> ', response.data.data.sales_item);
                setItemSaleList(response.data.data);
                setTotalAmount(response.data.data.sales_amount)
                setTotalBase(response.data.data.total_base)
                setTotalgst(response.data.data.total_gst)
                setMarginNetProfit(response.data.data.margin_net_profit)
                setTotalMargin(response.data.data.total_margin)
                setTotalNetRate(response.data.data.total_net_rate)
            })
        } catch (error) {
            console.error("API error:", error);
        }

    }
    const handleBarcode = async () => {
        if (!barcode) {
            return;
        }
        try {
            const res = axios
                .post("barcode-batch-list?", { "barcode": barcode }, {
                    // params: params,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log('response.data.data :>> ', response.data.data);

                    setUnit(response?.data?.data[0]?.batch_list[0]?.unit)
                    setBatch(response?.data?.data[0]?.batch_list[0]?.batch_name)
                    setExpiryDate(response?.data?.data[0]?.batch_list[0]?.expiry_date)
                    setMRP(response?.data?.data[0]?.batch_list[0]?.mrp)
                    setQty(response?.data?.data[0]?.batch_list[0]?.qty)
                    setMaxQty(response?.data?.data[0]?.batch_list[0]?.stock)
                    setPtr(response?.data?.data[0]?.batch_list[0]?.ptr)
                    setDiscount(response?.data?.data[0]?.batch_list[0]?.discount)
                    setBase(response?.data?.data[0]?.batch_list[0]?.base)
                    setGst(response?.data?.data[0]?.batch_list[0]?.gst_name);
                    setLoc(response?.data?.data[0]?.batch_list[0]?.location)
                    setTotalMargin(response?.data?.data[0]?.batch_list[0]?.margin)
                    setTotalNetRate(response?.data?.data[0]?.batch_list[0]?.net_rate)
                    setBarcodeItemName(response?.data?.data[0]?.batch_list[0]?.iteam_name)
                    setId(response?.data?.data[0]?.batch_list[0]?.id)
                    setItemId(response?.data?.data[0]?.batch_list[0]?.item_id)
                    console.log(response?.data?.data[0]?.batch_list[0], itemId)

                    setSelectedEditItemId(response?.data?.data[0]?.batch_list[0]?.id)

                    setItemEditID(response.data.data[0]?.id)

                    setUnsavedItems(true)

                    // const batch = response?.data?.data[0]?.batch_list[0];
                    // if (batch) {
                    //     setUnit(batch.unit);
                    //     setBatch(batch.batch_name);
                    //     setExpiryDate(batch.expiry_date);
                    //     setMRP(batch.mrp);
                    //     setQty(batch.purchase_qty);
                    //     setPtr(batch.ptr);
                    //     setDiscount(batch.discount);
                    //     setBase(batch.base);
                    //     setGst(batch.gst_name);
                    //     setLoc(batch.location);
                    //     setTotalMargin(batch.margin);
                    //     setTotalNetRate(batch.net_rate);
                    //     setSearchItem(batch.iteam_name);
                    //     setItemId(batch.item_id);
                    //     setSelectedEditItemId(batch.id);
                    // }
                    // setIsEditMode(true)
                });
        } catch (error) {
            console.error("API error:", error);
        }
    };
    const handleSubmit = () => {
        setUnsavedItems(false);
        const newErrors = {};
        if (!customer) {
            newErrors.customer = 'Please select Customer';
        }
        else if (ItemSaleList?.sales_item.length == 0) {
            newErrors.item = 'Please Add any Item in Sale Bill';
            toast.error('Please Add any Item in Sale Bill')
        }
        setError(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        submitSaleData();
    }
    const submitSaleData = async () => {
        let data = new FormData();
        data.append("bill_no", localStorage.getItem('BillNo') ? localStorage.getItem('BillNo') : '');
        data.append("customer_id", customer?.id ? customer?.id : '');
        data.append("status", 'Completed');
        data.append("bill_date", selectedDate.format('YYYY-MM-DD') ? selectedDate.format('YYYY-MM-DD') : '')
        data.append("customer_address", address || '')
        data.append("doctor_id", doctor?.id ? doctor?.id : '');
        data.append('igst', ItemSaleList?.igst || '')
        data.append('cgst', ((ItemSaleList?.cgst).toFixed(2)) ? ((ItemSaleList?.cgst).toFixed(2)) : '')
        data.append('sgst', ((ItemSaleList?.sgst).toFixed(2)) ? ((ItemSaleList?.sgst).toFixed(2)) : '')
        data.append('given_amount', givenAmt || 0)//no
        data.append('due_amount', dueAmount || 0)//no
        data.append('total_base', totalBase || 0)
        data.append('round_off', roundOff || 0)
        data.append('pickup', pickup ? pickup : '')
        data.append('owner_name', '0')
        data.append('payment_name', paymentType ? paymentType : '')
        data.append('product_list', JSON.stringify(ItemSaleList.sales_item) ? JSON.stringify(ItemSaleList.sales_item) : '')
        data.append('net_amount', netAmount.toFixed(2) || 0)
        data.append('other_amount', otherAmt || 0)
        data.append('total_discount', finalDiscount || '')
        data.append('discount_amount', discountAmount ? discountAmount : '')
        data.append('total_amount', totalAmount || 0)
        data.append('other_amount', otherAmt || 0)
        data.append('margin_net_profit', marginNetProfit || 0)
        data.append('margin', totalMargin || 0)
        data.append('net_rate', totalNetRate || 0)
        data.append("mrp", mrp ? mrp : '')
        data.append("ptr", ptr ? ptr : '')
        data.append("discount", discount ? discount : '')
        data.append("total_gst", totalgst || '')

        try {
            await axios.post("create-sales", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {

                localStorage.removeItem('RandomNumber');
                toast.success(response.data.message);
                setTimeout(() => {
                    history.push('/salelist');
                }, 2000);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }
    useEffect(() => {
        generateRandomNumber()
        let data = new FormData();
        data.append("random_number", localStorage.getItem('RandomNumber') || '')

        axios.post("all-sales-item-delete", data, {
            headers: { Authorization: `Bearer ${token}` }
        })
    }, [])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleBarcode();
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [barcode]);

    const handleNavigation = (path) => {
        setOpenModal(true);
        setOpenCustomer(false);
        setOpenAddPopUp(false);
        setNextPath(path);
    };

    const handleLeavePage = () => {
        let data = new FormData();
        data.append('random_number', localStorage.getItem('RandomNumber') || '')
        setOpenModal(false);
        setUnsavedItems(false);

        // const params = {
        //     random_number: localStorage.getItem('RandomNumber')
        // };
        axios.post("all-sales-item-delete", data, {
            // params: params,
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                setOpenModal(false);
                setUnsavedItems(false);
                history.push(nextPath);
            })
            .catch(error => {
                console.error("Error deleting items:", error);
            });
    };

    const draftSaleData = async () => {
        let data = new FormData();
        data.append("bill_no", localStorage.getItem('BillNo') ? localStorage.getItem('BillNo') : "");
        data.append("customer_id", customer.id ? customer.id : "");
        data.append("status", 'Draft');
        data.append("bill_date", selectedDate.format('YYYY-MM-DD') ? selectedDate.format('YYYY-MM-DD') : '')
        data.append("customer_address", address || '')
        data.append("doctor_id", doctor.id ? doctor.id : "");
        data.append('igst', '0')
        data.append('cgst', '0')
        data.append('sgst', '0')
        data.append('given_amount', givenAmt || 0)
        data.append('due_amount', dueAmount || 0)
        data.append('total_base', totalBase)
        data.append('pickup', pickup ? pickup : "")
        data.append('owner_name', '0')
        data.append('payment_name', paymentType ? paymentType : "")
        data.append('product_list', JSON.stringify(ItemSaleList.sales_item) ? JSON.stringify(ItemSaleList.sales_item) : '')
        data.append('net_amount', netAmount.toFixed(2))
        data.append('other_amount', otherAmt || 0)
        data.append('total_discount', finalDiscount ? finalDiscount : '')
        data.append('other_amount', otherAmt || 0)
        data.append('total_amount', totalAmount || 0)
        try {
            await axios.post("create-sales", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                localStorage.removeItem('RandomNumber');
                toast.success(response.data.message);
                setTimeout(() => {
                    history.push('/salelist');
                }, 2000);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const batchList = async () => {
        let data = new FormData();
        data.append("iteam_id", itemId || '');
        const params = {
            iteam_id: itemId ? itemId : ''
        };
        try {
            const res = await axios.post("batch-list?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setBatchListData(response.data.data);
                if (Array.isArray(response.data.data)) {
                    response.data.data.forEach((item) => {
                        setMRP(item.mrp)
                        setPtr(item.ptr);
                        setDiscount(item.discount);
                    });
                } else {
                    setMRP(response.data.data.mrp)
                    setPtr(response.data.data.ptr);
                    setDiscount(response.data.data.discount);
                }
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const generateRandomNumber = () => {
        if (localStorage.getItem("RandomNumber") == null) {
            const number = Math.floor(Math.random() * 100000) + 1;
            setRandomNumber(number);
            localStorage.setItem("RandomNumber", number);
        } else {
            return;
        }
    };

    const addItemValidation = () => {
        setUnsavedItems(true);
        if (!mrp) {
            toast.error('Please Select any Item Name')
        } else {
            addSaleItem();
            setIsVisible(false);
            setSearchItem('')
            setBarcodeItemName('')
        }
    }

    const addSaleItem = async () => {
        generateRandomNumber();
        let data = new FormData();

        if (isEditMode === true) {
            data.append("item_id", itemEditID)
        }
        else {
            if (barcode) {
                data.append('item_id', itemId)
            } else {
                data.append('item_id', value && value.id ? value.id : '')
            }
        }

        // data.append("id", selectedEditItemId ? selectedEditItemId : '')
        data.append("user_id", userId);
        // data.append("item_id", barcode ? itemId : value?.id || '');
        data.append("id", selectedEditItemId || '');
        data.append("qty", qty || '')
        data.append("exp", expiryDate ? expiryDate : '')
        data.append('gst', gst ? gst : "")
        data.append("mrp", mrp ? mrp : '')
        data.append("unit", unit ? unit : '');
        data.append("random_number", Number(localStorage.getItem('RandomNumber')) || '');
        data.append("batch", batch ? batch : '')
        data.append('location', loc ? loc : '')
        data.append("base", base ? base : '')
        data.append('amt', itemAmount ? itemAmount : '')
        data.append('net_rate', itemAmount ? itemAmount : '')
        data.append('total_amount', totalAmount)
        data.append("order", order ? order : '')
        data.append("ptr", ptr ? ptr : '')
        data.append("discount", discount ? discount : '')
        data.append("total_gst", totalgst || '')

        const params = {
            id: selectedEditItemId || ''
        };

        try {
            const response = isEditMode
                ? await axios.post("sales-item-edit?", data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                : await axios.post('sales-item-add', data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            saleItemList();
            setUnit('')
            setBatch('')
            setExpiryDate('');
            setMRP('')
            setQty('')
            setBase('')
            setGst('')
            setBatch('')
            setBarcode("")
            setLoc('')
            setIsEditMode(false);
        }
        catch (e) {
        }
    }

    const handleQtyChange = (e) => {
        console.log('maxQt***', maxQty);


        const enteredValue = Number(e.target.value, 10);
        if (enteredValue <= maxQty) {
            console.log('if***');
            setQty(enteredValue);
        } else {
            console.log('else***');
            toast.error("can't add qty more than stock")
            setQty(maxQty);
        }
    }

    const deleteOpen = (Id) => {
        setIsDelete(true);
        setSaleItemId(Id);
    };

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
        setItemAmount(0);
        if (isNaN(itemAmount)) {
            setItemAmount(0);
        }
        setIsEditMode(false)
    }

    const handleDeleteItem = async (saleItemId) => {
        if (!saleItemId) return;
        let data = new FormData();
        data.append("id", saleItemId ? saleItemId : '');
        const params = {
            id: saleItemId ? saleItemId : ''
        };
        try {
            await axios.post("sales-item-delete?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                saleItemList();
                setIsDelete(false);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const handleMouseEnter = (e) => {
        const hoveredRow = e.currentTarget;
        setHighlightedRowId(hoveredRow);
    };

    const handleTableKeyDown = (e) => {

        const rows = Array.from(tableRef.current?.querySelectorAll("tr.cursor-pointer") || []);
        let currentIndex = rows.findIndex(row => row === document.activeElement);
        if (e.key === "ArrowDown") {
            e.preventDefault();
            if (rows.length > 0) {
                const nextIndex = currentIndex + 1 < rows.length ? currentIndex + 1 : 0;
                rows[nextIndex]?.focus();
                setHighlightedRowId(rows[nextIndex]?.dataset.id);
            }
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            if (rows.length > 0) {
                const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : rows.length - 1;
                rows[prevIndex]?.focus();
                setHighlightedRowId(rows[prevIndex]?.dataset.id);
            }
        }

        if (e.key === "Enter") {
            e.preventDefault();
            if (currentIndex >= 0 && rows[currentIndex]) {
                const itemId = rows[currentIndex].getAttribute("data-id");
                const item = batchListData.find((item) => String(item.id) === String(itemId));
                if (item) {
                    handlePassData(item);
                    setHighlightedRowId(itemId);
                }
            }
        }
    };

    useEffect(() => {
        if (isVisible && tableRef.current) {
            const firstRow = tableRef.current.querySelector("tr.cursor-pointer");
            if (firstRow) {
                firstRow.focus();
                setHighlightedRowId(firstRow.getAttribute("data-id"));
            }
        }
    }, [isVisible, batchListData]);



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
                <div style={{ backgroundColor: '#f0f0f0', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                    <div>
                        <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ display: 'flex', gap: '7px', }}>
                                <span style={{ color: 'rgba(12, 161, 246, 1)', fontWeight: 700, fontSize: '20px', cursor: 'pointer', width: "50px" }} onClick={() => { history.push('/salelist') }} >Sales</span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', marginTop: '8px', color: "rgba(4, 76, 157, 1)" }} />
                                <span style={{ color: 'rgba(4, 76, 157, 1)', fontWeight: 700, fontSize: '20px' }}>New</span>
                                <BsLightbulbFill className="mt-1 w-6 h-6 sky_text hover-yellow" />
                            </div>
                            <div className="headerList">
                                <Select
                                    labelId="dropdown-label"
                                    id="dropdown"
                                    value={paymentType}
                                    sx={{ minWidth: '200px' }}
                                    onChange={(e) => {
                                        setPaymentType(e.target.value);
                                        setUnsavedItems(true);

                                    }}
                                    size="small"
                                >
                                    <MenuItem value="cash">Cash</MenuItem>
                                    <MenuItem value="credit">Credit</MenuItem>
                                    {bankData?.map(option => (
                                        <MenuItem key={option.id} value={option.id}>{option.bank_name}</MenuItem>
                                    ))}
                                </Select>
                                <Select
                                    labelId="dropdown-label"
                                    id="dropdown"
                                    value={pickup}
                                    sx={{ minWidth: '150px' }}
                                    onChange={(e) => {
                                        setPickup(e.target.value);
                                        setUnsavedItems(true);

                                    }}
                                    size="small"
                                >
                                    {pickupOptions.map(option => (
                                        <MenuItem key={option.id} value={option.label}>{option.label}</MenuItem>
                                    ))}
                                </Select>
                                <Button variant="contained" sx={{ textTransform: 'none', background: "rgb(4, 76, 157)" }} onClick={handleSubmit}> Submit</Button>

                            </div>
                        </div>
                        <div className="border-b">
                            <div className="firstrow flex" >
                                <div className="detail mt-1" >
                                    <div className="detail  p-2 rounded-md" style={{ background: "#044c9d", width: "100%" }} >
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <div className="heading" style={{ color: 'white', fontWeight: "500", alignItems: "center", marginLeft: "15px" }}>Bill No <span style={{ marginLeft: '35px' }}> Bill Date</span> </div>
                                            <div className="flex gap-1">
                                                <div style={{ color: 'white', fontWeight: "500", alignItems: "center", marginTop: '8px', marginLeft: "15px", fontWeight: "bold", width: '19%' }}>{localStorage.getItem('BillNo')}  </div>
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
                                                        '& .MuiAutocomplete-input': {
                                                            padding: "0.5px 4px 7.5px 5px"
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </LocalizationProvider>

                                    </div>
                                </div>
                                <div className="detail" style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "rgba(4, 76, 157, 1)" }}>Customer Mobile / Name <FaPlusCircle className="icon darkblue_text" onClick={() => { setOpenCustomer(true); setUnsavedItems(true); }} /></span>

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
                                            minWidth: {
                                                xs: '320px',
                                                sm: '400px',
                                            },
                                            '& .MuiInputBase-root': {
                                                height: 20,
                                                fontSize: '1.10rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                padding: '8px 8px',
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
                                <div className="detail">
                                    <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "rgba(4, 76, 157, 1)" }}>Doctor <FaPlusCircle className="icon darkblue_text" onClick={() => { setOpenAddPopUp(true); setUnsavedItems(true); }} /></span>
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
                                            minWidth: {
                                                xs: '320px',
                                                sm: '400px',
                                            },
                                            '& .MuiInputBase-root': {
                                                height: 20,
                                                fontSize: '1.10rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                padding: '8px 8px',
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

                                </div>
                                <table >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 2,
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                flex: '1 1 auto',
                                                minWidth: {
                                                    xs: '350px',
                                                    sm: '500px',
                                                    md: '1000px',
                                                },
                                                width: '100%',
                                                background: '#ceecfd',
                                                borderRadius: '7px',
                                            }}
                                        >
                                            <Autocomplete
                                                value={searchItem?.iteam_name}
                                                blurOnSelect
                                                size="small"
                                                sx={{ fontSize: "1.5rem" }}
                                                onChange={handleOptionChange}
                                                onInputChange={handleInputChange}
                                                options={itemList}
                                                getOptionLabel={(option) => `${option.iteam_name || ''} `}
                                                renderOption={(props, option) => (
                                                    <ListItem {...props}
                                                    >

                                                        <ListItemText
                                                            primary={`${option.iteam_name},(${option.company})`}
                                                            secondary={`Stock:${option.stock}, ₹:${option.mrp},Location:${option.location}`}
                                                            sx={{
                                                                '& .MuiTypography-root': { fontSize: '1.1rem' }
                                                            }}
                                                        />
                                                    </ListItem>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        variant="outlined"
                                                        id="searchResults"
                                                        placeholder="Search Item Name..."
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            style: { height: 45, fontSize: '1.2rem' },

                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon sx={{ color: "rgba(9, 161, 246)", cursor: "pointer" }} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
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
                                                                borderBottom: '1px solid ',
                                                            },
                                                            '& .MuiInputBase-input::placeholder': {
                                                                fontSize: '1rem',
                                                                color: 'black',
                                                            },
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Box>
                                    </Box>
                                    {isVisible && value && !batch &&
                                        <Box sx={{
                                            minWidth: {
                                                xs: '200px',
                                                sm: '500px',
                                                md: '1000px',
                                            },
                                            backgroundColor: 'white',
                                            position: 'absolute',
                                            zIndex: 1
                                        }}
                                            id="tempId"
                                        >
                                            <div className="custom-scroll-sale" style={{ width: '100%' }} tabIndex={0} onKeyDown={handleTableKeyDown}
                                                ref={tableRef}
                                            >
                                                <table ref={tableRef} style={{ width: '100%', borderCollapse: 'collapse' }}>
                                                    <thead>
                                                        <tr className="customtable">
                                                            <th>Item Name</th>
                                                            <th>Batch Number</th>
                                                            <th>Unit</th>
                                                            <th>Expiry Date</th>
                                                            <th>QTY</th>
                                                            <th>Loc</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {batchListData.length > 0 ?
                                                            <>
                                                                {batchListData.map(item => (
                                                                    <tr
                                                                        className={`cursor-pointer saleTable custom-hover ${highlightedRowId === String(item.id) ? "highlighted-row" : ""}`}
                                                                        key={item.id}
                                                                        data-id={item.id}
                                                                        tabIndex={0}
                                                                        style={{
                                                                            border: "1px solid rgba(4, 76, 157, 0.1)", padding: '10px', outline: "none"
                                                                        }}
                                                                        onClick={() => handlePassData(item)}
                                                                        onMouseEnter={handleMouseEnter}
                                                                    >
                                                                        <td className="text-base font-semibold">{item.iteam_name}</td>
                                                                        <td className="text-base font-semibold">{item.batch_number}</td>
                                                                        <td className="text-base font-semibold">{item.unit}</td>
                                                                        <td className="text-base font-semibold">{item.expiry_date}</td>
                                                                        <td className="text-base font-semibold">{item.qty}</td>
                                                                        <td className="text-base font-semibold">{item.location}</td>
                                                                    </tr>
                                                                ))}
                                                            </> :
                                                            <tr>
                                                                <td colSpan={6} style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>No record found</td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Box>

                                    }

                                </table>

                                <div className="scroll-two">
                                    <table className="saleTable">
                                        <thead>
                                            <tr>
                                                <th className="w-1/4">Item Name</th>
                                                <th >Unit</th>
                                                <th >Batch</th>
                                                <th >Expiry</th>
                                                <th >MRP</th>
                                                <th>Base</th>
                                                <th >GST%</th>
                                                <th >QTY </th>
                                                <th  >Order
                                                    <Tooltip title="Please Enter only (o)" arrow>
                                                        <Button ><GoInfo className='absolute' style={{ fontSize: "1rem" }} /></Button>
                                                    </Tooltip>
                                                </th>
                                                <th >Loc.</ th>
                                                <th >Amount </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td >
                                                    <DeleteIcon className="delete-icon" onClick={resetValue} />
                                                    {searchItem || barcodeItemName}
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
                                                        onChange={handleExpiryDateChange}
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
                                                        onKeyPress={(e) => {
                                                            if (!/[0-9]/.test(e.key) && e.key !== 'Backspace') {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                        onChange={(e) => {
                                                            handleQtyChange(e)
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        sx={{ width: '80px' }}
                                                        size="small"
                                                        value={order}
                                                        onChange={(e) => {
                                                            const value = e.target.value.toUpperCase();
                                                            if (value === '' || value === 'O') {
                                                                setOrder(value);
                                                            }
                                                        }}
                                                    />
                                                </td>

                                                <td>
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
                                            <td>
                                                <TextField
                                                    id="outlined-number"
                                                    type="number"
                                                    size="small"
                                                    value={barcode}
                                                    placeholder="scan barcode"
                                                    // inputRef={inputRef10}
                                                    // onKeyDown={handleKeyDown}
                                                    sx={{ width: "250px" }}
                                                    onChange={(e) => {
                                                        setBarcode(e.target.value)

                                                    }}

                                                />
                                            </td>
                                            <tr>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td >
                                                    <Button variant="contained" color="success" marginRight="20px" onClick={addItemValidation}><ControlPointIcon />Add</Button>
                                                </td>
                                            </tr>
                                            {ItemSaleList?.sales_item?.map(item => (
                                                <tr key={item.id} className="item-List border-b border-gray-400 "
                                                    onClick={() => handleEditClick(item)}
                                                >
                                                    <td style={{
                                                        display: 'flex', gap: '8px',
                                                    }}>
                                                        <BorderColorIcon color="primary" className="cursor-pointer" onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditClick(item)
                                                        }} />
                                                        <DeleteIcon className="delete-icon" onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteOpen(item.id)
                                                        }} />
                                                        {item.iteam_name || barcodeItemName}
                                                    </td>
                                                    <td>{item.unit}</td>
                                                    <td>{item.batch}</td>
                                                    <td>{item.exp}</td>
                                                    <td>{item.mrp}</td>
                                                    <td>{item.base}</td>
                                                    <td>{item.gst}</td>
                                                    <td>{item.qty}</td>
                                                    <td>{item.order}</td>
                                                    <td>{item.location}</td>
                                                    <td>{item.net_rate}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* } */}

                            </div>
                            {ItemSaleList.sales_item.length > 0 && (
                                <div className="flex gap-10 justify-end mt-4 flex-wrap "  >
                                    <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                        <label className="font-bold">Total GST : </label>
                                        <label className="font-bold">Total Base : </label>
                                        <label className="font-bold">Profit : </label>
                                        <label className="font-bold">Total Net Rate : </label>
                                    </div>
                                    <div class="totals mr-5" style={{ display: 'flex', gap: '25px', flexDirection: 'column', alignItems: "end" }}>
                                        <span style={{ fontWeight: 600 }}> {totalgst} </span>
                                        <span style={{ fontWeight: 600 }}>{totalBase} </span>
                                        <span style={{ fontWeight: 600 }}>₹ {marginNetProfit} ({Number(totalMargin).toFixed(2)}%)</span>
                                        <span style={{ fontWeight: 600 }}>₹ {totalNetRate}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                        <div>
                                            <label className="font-bold">Total Amount : </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">Discount (%) : </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">Other Amount : </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">Discount Amount : </label>
                                        </div>
                                        <div>
                                            <label className="font-bold">Round Off: </label>
                                        </div>
                                        <div>
                                            <label className="font-bold" >Net Amount : </label>
                                        </div>
                                    </div>

                                    <div class="totals mr-5" style={{ display: 'flex', gap: '20px', flexDirection: 'column', alignItems: "end" }}>
                                        <div>
                                            <span style={{ fontWeight: 600 }}>{totalAmount}</span>
                                        </div>
                                        <div className="">
                                            <Input type="number"
                                                value={finalDiscount}
                                                onKeyPress={(e) => {
                                                    if (!/[0-9.]/.test(e.key) && e.key !== 'Backspace') {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    let newValue = e.target.value

                                                    if (newValue > 100) {

                                                        setFinalDiscount(100)
                                                    } else if (newValue >= 0) {
                                                        setFinalDiscount(newValue)

                                                    }

                                                }}
                                                size="small" style={{
                                                    width: "70px",
                                                    background: "none",
                                                    borderBottom: "1px solid gray",
                                                    outline: "none",
                                                    justifyItems: "end"
                                                }} sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: '35px'
                                                    },
                                                    "& .MuiInputBase-input": { textAlign: "end" }

                                                }} />
                                        </div>

                                        <div>
                                            <Input type="number" value={otherAmt}
                                                onKeyPress={(e) => {
                                                    const value = e.target.value;
                                                    const isMinusKey = e.key === '-';

                                                    if (!/[0-9.-]/.test(e.key) && e.key !== 'Backspace') {
                                                        e.preventDefault();
                                                    }

                                                    if (isMinusKey && value.includes('-')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={handleOtherAmtChange} size="small" style={{
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

                                        <div className="mt-1">
                                            <span>-{discountAmount}</span>

                                        </div>
                                        <div>
                                            <span >{!roundOff ? 0 : roundOff}</span>
                                        </div>
                                        <div>
                                            <span style={{ fontWeight: 800, fontSize: '22px' }}>{netAmount}</span>
                                        </div>
                                    </div>
                                </div>)}
                        </div>
                    </div>
                </div>
                <Dialog open={openAddPopUp}>
                    <DialogTitle id="alert-dialog-title" className="sky_text">
                        Add Doctor
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => { setOpenAddPopUp(false); setDoctorName(''); setClinic('') }}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <div className="flex" style={{ flexDirection: 'column', gap: '19px' }}>
                                <div className="flex gap-10">
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className="mb-2" >
                                            <span className="label darkblue_text mb-4" >Doctor Name</span>
                                            <span className="text-red-600 ml-1">*</span>
                                        </div>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={doctorName}
                                            onChange={(e) => { setDoctorName(e.target.value); setUnsavedItems(true) }}
                                            style={{ minWidth: 340 }}
                                            variant="outlined"
                                        />
                                        <div className="mb-2" >
                                            <span className="label darkblue_text" >Clinic Name</span>
                                            <span className="text-red-600 ml-1">*</span>
                                        </div>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={clinic}
                                            onChange={(e) => { setClinic(e.target.value); setUnsavedItems(true) }}
                                            style={{ minWidth: 340 }}
                                            variant="outlined"
                                        />
                                    </div>
                                </div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" disabled={!(doctorName && clinic)} color="success" onClick={AddDoctorRecord} >
                            Save
                        </Button>

                    </DialogActions>
                </Dialog>
                {/* add Customer */}
                <Dialog open={openCustomer}>
                    <DialogTitle id="alert-dialog-title" className="sky_text">
                        Add Customer
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => { setOpenCustomer(false); setCustomerName(''); setMobileNo('') }}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <div className="flex" style={{ flexDirection: 'column', gap: '19px' }}>
                                <div className="flex gap-10">
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <div className="mb-2" >
                                            <span className="label darkblue_text mb-4" >Customer Name</span>
                                            <span className="text-red-600 ml-1">*</span>
                                        </div>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={customerName}
                                            onChange={(e) => { setCustomerName(e.target.value); setUnsavedItems(true) }}
                                            style={{ minWidth: 340 }}
                                            variant="outlined"
                                        />
                                        <div className="mb-2" >
                                            <span className="label darkblue_text" >Mobile Number</span>
                                            <span className="text-red-600 ml-1">*</span>
                                        </div>
                                        <TextField
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={mobileNo}
                                            onChange={(e) => { setMobileNo(e.target.value); setUnsavedItems(true) }}
                                            style={{ minWidth: 340 }}
                                            variant="outlined"
                                        />
                                    </div>
                                </div>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button autoFocus variant="contained" disabled={!(customerName && mobileNo)} color="success" onClick={AddCustomerRecord} >
                            Save
                        </Button>

                    </DialogActions>
                </Dialog>
                <Dialog open={openPurchaseHistoryPopUp}
                    sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                width: "65%",
                                maxWidth: "1900px",
                            },
                        },
                    }}>
                    <DialogTitle id="alert-dialog-title" className="sky_text">
                        Item Purchase History
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenPurchaseHistoryPopUp(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <div className="flex" style={{ flexDirection: 'column', gap: '19px' }}>
                                <table className="custom-table" style={{ background: "none" }}>
                                    <thead>
                                        <tr>
                                            {LastPurchaseListcolumns.map((column, index) => (
                                                <th key={column.id} >

                                                    <div className='headerStyle'>
                                                        <span>{column.label}</span><SwapVertIcon />
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {purchaseHistory
                                            .map((row, index) => {
                                                return (
                                                    <tr hover tabIndex={-1} key={row.code} onClick={(() => setOpenPurchaseHistoryPopUp(true))} >
                                                        {LastPurchaseListcolumns.map((column) => {
                                                            const value = row[column.id];

                                                            return (
                                                                <td key={column.id} align={column.align}
                                                                >
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
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
            </div >

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
export default Addsale