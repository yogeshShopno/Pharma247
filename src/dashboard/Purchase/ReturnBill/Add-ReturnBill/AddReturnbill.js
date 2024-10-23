
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import React, { useState, useRef, useEffect } from 'react';
import { Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputAdornment, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DatePicker from 'react-datepicker';
import { addMonths, format, set, subDays, subMonths } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import Autocomplete from '@mui/material/Autocomplete';
import { Button, TextField } from "@mui/material";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { BsLightbulbFill } from "react-icons/bs";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axios from "axios";
import '../Add-ReturnBill/AddReturnbill.css'
import Header from '../../../Header';
import Loader from '../../../../componets/loader/Loader';
import { toast, ToastContainer } from 'react-toastify';
import SearchIcon from "@mui/icons-material/Search";
import { FaPowerOff } from "react-icons/fa";
import { VscDebugStepBack } from "react-icons/vsc";




const AddReturnbill = () => {
    const token = localStorage.getItem("token")
    const history = useHistory();
    const unblockRef = useRef(null);
    const [isOpenBox, setIsOpenBox] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(addMonths(new Date(), 6));
    const [isLoading, setIsLoading] = useState(false);
    const [mrp, setMRP] = useState()
    const [ptr, setPTR] = useState()
    const [billNo, setBillNo] = useState()
    const [gst, setGst] = useState({ id: '', name: '' });
    const [selectedEditItemId, setSelectedEditItemId] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(1);
    const [returnType, setReturnType] = useState(null);
    const [ItemId, setItemId] = useState('')
    const [IsDelete, setIsDelete] = useState(false);
    // const inputRef1 = useRef();
    // const inputRef2 = useRef();
    // const inputRef3 = useRef();
    // const inputRef4 = useRef();
    // const inputRef5 = useRef();
    // const inputRef6 = useRef();
    // const inputRef7 = useRef();
    // const inputRef8 = useRef();
    // const inputRef9 = useRef();
    // const inputRef10 = useRef();
    // const inputRef12 = useRef();
    const [unit, setUnit] = useState('');
    const [schAmt, setSchAmt] = useState('');
    const [disc, setDisc] = useState('');
    const [selectedEditItem, setSelectedEditItem] = useState(null);
    const [isDeleteAll, setIsDeleteAll] = useState(false);
    const [errors, setErrors] = useState({});
    const [batchList, setBatchList] = useState([]);
    const [gstList, setGstList] = useState([]);
    const [ItemTotalAmount, setItemTotalAmount] = useState(0);
    const [loc, setLoc] = useState('');
    const [distributorList, setDistributorList] = useState([]);
    const [returnItemList, setReturnItemList] = useState([])
    const [distributor, setDistributor] = useState(null);
    const [remark, setRemark] = useState('')
    const [expiryDate, setExpiryDate] = useState('');

    const [free, setFree] = useState('')
    const [error, setError] = useState({ distributor: '', returnType: '', billNo: '', startDate: '', endDate: '' });
    const staffOptions = [{ value: 'Owner', id: 1 }, { value: localStorage.getItem('UserName'), id: 2 },]
    const [batch, setBatch] = useState('')
    const [searchItem, setSearchItem] = useState('')
    const [itemPurchaseId, setItemPurchaseId] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [bankData, setBankData] = useState([]);
    // const [roundOff, setRoundOff] = useState(0)
    // const [otherAmt, setOtherAmt] = useState("")
    // const [netAmount, setNetAmount] = useState(0)
    // const [finalAmount, setFinalAmount] = useState(0)
    const [selectedItem, setSelectedItem] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [saveValue, setSaveValue] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0)
    const [netAmount, setNetAmount] = useState(0);
    const [roundOff, setRoundOff] = useState(0.00)
    const [otherAmount, setOtherAmount] = useState(0)
    const [finalAmount, setFinalAmount] = useState(0)
    const [editQty, setEditQty] = useState('')

    const [qty, setQty] = useState(0)
    const [tempQty, setTempQty] = useState(0)

    // const handleKeyDown = (event) => {
    //     if (event.key === 'Enter') {
    //         if (event.target === inputRef1.current) {
    //         event.preventDefault();
    //             inputRef2.current.focus();
    //         } else if (event.target === inputRef2.current) {
    //             inputRef3.current.focus();
    //         } else if (event.target === inputRef3.current) {
    //             inputRef4.current.focus();
    //         } else if (event.target === inputRef4.current) {
    //             inputRef5.current.focus();
    //         } else if (event.target === inputRef5.current) {
    //             inputRef6.current.focus();
    //         } else if (event.target === inputRef6.current) {
    //             inputRef7.current.focus();
    //         } else if (event.target === inputRef7.current) {
    //             inputRef8.current.focus();
    //         } else if (event.target === inputRef8.current) {
    //             inputRef9.current.focus();
    //         }
    //     };
    // }

    useEffect(() => {
        if (saveValue === false) {
            unblockRef.current = history.block((location) => {
                if (!isOpenBox) {
                    setPendingNavigation(location);
                    setIsOpenBox(true);
                    setSaveValue(false);
                    return false;
                }
            });
            return () => {
                if (unblockRef.current) {
                    unblockRef.current();
                }
            };
        }
    }, [saveValue, history, isOpenBox]);

    useEffect(() => {
        if (otherAmount !== '') {
            const x = parseFloat(finalAmount) + parseFloat(otherAmount)
            setRoundOff((x % 1).toFixed(2))
            roundOff > 0.49 ? setNetAmount(parseInt(x) + 1) : setNetAmount(parseInt(x))

        } else {
            const x = parseFloat(finalAmount).toFixed(2)
            setRoundOff((x % 1).toFixed(2))
            roundOff > 0.49 ? setNetAmount(parseInt(x) + 1) : setNetAmount(parseInt(x))

        }

        if (netAmount < 0) {
            setOtherAmount(0)
        }

    }, [otherAmount, totalAmount, roundOff, netAmount, finalAmount]);

    useEffect(() => {
        // console.log(editQty, "Updated editQty");
        // console.log(selectedEditItemId, "selectedEditItemId");

        // You can perform any additional action here after the state updates
    }, [editQty, selectedEditItemId]);

    useEffect(() => {
        if (selectedEditItem) {
            setSearchItem(selectedEditItem.item_name);
            setUnit(selectedEditItem.weightage);
            setBatch(selectedEditItem.batch_number);
            setExpiryDate(selectedEditItem.expiry);
            setMRP(selectedEditItem.mrp);
            setQty(selectedEditItem.qty);
            setFree(selectedEditItem.fr_qty);
            setPTR(selectedEditItem.ptr);
            setDisc(selectedEditItem.disocunt);
            setGst(gstList.find(option => option.name === selectedEditItem.gst_name) || {});
            setLoc(selectedEditItem.location);
            setItemTotalAmount(selectedEditItem.amount);
        }

    }, [selectedEditItem]);

    const LogoutClose = () => {
        setIsOpenBox(false);
        setPendingNavigation(null);
    };

    const handleLogout = async () => {
        await restoreData();

        if (pendingNavigation) {
            if (unblockRef.current) {
                unblockRef.current();
            }
            history.push(pendingNavigation.pathname);
        }
        setIsOpenBox(false);
        window.location.reload();
    };

    const paymentOptions = [
        { id: 1, label: 'Cash' },
        { id: 2, label: 'Credit' },
        { id: 3, label: 'UPI' },
        { id: 4, label: 'Cheque' },
        { id: 5, label: 'Paytm' },
        { id: 6, label: 'CC/DC' },
        { id: 7, label: 'RTGS/NEFT' }]

    useEffect(() => {
        listOfGst();
        listDistributor();
        BankList();
        restoreData()
        setBillNo(localStorage.getItem('Purchase_Return_BillNo'));
    }, [])

    useEffect(() => {
        const totalSchAmt = parseFloat((((ptr * disc) / 100) * qty).toFixed(2));
        const totalBase = parseFloat(((ptr * qty) - totalSchAmt).toFixed(2));
        const totalAmount = parseFloat((totalBase + (totalBase * gst.name / 100)).toFixed(2));
        if (totalAmount) {
            setItemTotalAmount(totalAmount);
        } else {
            setItemTotalAmount(0)
        }
        if (isDeleteAll == false) {
            // restoreData();
        }
    }, [ptr, qty, disc, gst.name])

    // useEffect(() => {
    //     const adjustedTotalAmount = finalAmount - otherAmt;
    //     const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    //     let netAmountCal;
    //     let roundOffAmountCal;

    //     if (decimalPart >= 0.50) {
    //         netAmountCal = Math.ceil(adjustedTotalAmount);
    //         roundOffAmountCal = netAmountCal - adjustedTotalAmount;
    //     } else {
    //         netAmountCal = Math.floor(adjustedTotalAmount);
    //         roundOffAmountCal = netAmountCal - adjustedTotalAmount;
    //     }
    //     setNetAmount(netAmountCal);
    //     setRoundOff(roundOffAmountCal);
    //     const x = otherAmt + parseInt(finalAmount)
    //     setNetAmount(x);
    // }, [finalAmount, otherAmt]);

    // useEffect(() => {
    //     let adjustedTotalAmount = finalAmount - otherAmt;
    //     const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

    //     let netAmountCal;
    //     let roundOffAmountCal;

    //     if (finalAmount <= 49) {
    //         netAmountCal = finalAmount;
    //         roundOffAmountCal = 0;
    //     }
    //     else {
    //         if (decimalPart >= 0.50) {
    //             // Round up
    //             netAmountCal = Math.ceil(adjustedTotalAmount);
    //             roundOffAmountCal = netAmountCal - adjustedTotalAmount;
    //         } else {
    //             // Round down
    //             netAmountCal = Math.floor(adjustedTotalAmount);
    //             roundOffAmountCal = netAmountCal - adjustedTotalAmount;
    //         }
    //     }
    //     setNetAmount(netAmountCal);
    //     setRoundOff(roundOffAmountCal);
    //     const x = otherAmt + parseInt(finalAmount)
    //     setNetAmount(x);
    // }, [finalAmount, otherAmt]);


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

    let listOfGst = () => {
        axios.get("gst-list", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                //console.log("API Response item Catagory:===", response);
                setGstList(response.data.data);
            })
            .catch((error) => {
                //console.log("API Error:", error);
            });
    }

    let listDistributor = () => {
        axios.get("list-distributer", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            localStorage.setItem("distributor", response.data.data.distributor)
            setDistributorList(response.data.data);
        }).catch((error) => {
            //console.log("API Error:", error);
        });
    };
    const isDateDisabled = (date) => {
        const today = new Date();
        // Set time to 00:00:00 to compare only date part
        today.setHours(0, 0, 0, 0);


        // Disable dates that are greater than today
        return date > today;
    };
    const deleteOpen = (Id) => {
        setIsDelete(true);
        setItemId(Id);
    };


    const handleDeleteItem = async (ItemId) => {
        if (!ItemId) return;
        let data = new FormData();
        data.append("purches_return_id", ItemId);
        const params = {
            purches_return_id: ItemId,
            type: 0
        };
        try {
            await axios.post("purches-return-iteam-delete?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                purcheseReturnFilter();
                setIsDelete(false);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }


    const filterData = async (searchItem) => {
        const newErrors = {};
        if (!distributor) newErrors.distributor = 'distributor is required';
        if (!startDate) newErrors.startDate = 'start date is required';
        if (!endDate) newErrors.endDate = 'end date is required';


        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            await purcheseReturnFilter(); // Call handleAddItem if validation passes
        }
        return isValid;
    }


    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value); // Update the state first
        purcheseReturnFilter(value); // Call the filter function with the updated value
    };

    const purcheseReturnFilter = async (value) => {
        let data = new FormData();
        // setIsLoading(true);
        data.append("start_date", startDate ? format(startDate, 'MM/yy') : '');
        data.append("end_date", endDate ? format(endDate, 'MM/yy') : '');
        data.append("distributor_id", distributor.id);
        data.append("search", value ? value : "");
        // console.log(searchQuery,"value")

        try {
            await axios.post("purches-return-filter?", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setReturnItemList(response.data.data)
                setFinalAmount(response.data.data?.final_amount)
                setNetAmount(response.data.data?.final_amount)


                // batchListAPI();
                // setIsLoading(false);
                //console.log(response.data.data.item_list)
            })
            localStorage.setItem('StartFilterDate', format(startDate, 'MM/yy'));
            localStorage.setItem('EndFilterDate', format(endDate, 'MM/yy'));
            localStorage.setItem('DistributorId', distributor.id);


        } catch (error) {
            console.error("API error:", error);
        }
    }

    const handleChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSchAmt = (e) => {
        const inputDiscount = parseFloat(e.target.value);
        setDisc(inputDiscount);


        const totalSchAmt = parseFloat((((ptr * inputDiscount) / 100) * qty).toFixed(2));
        setSchAmt(totalSchAmt);

        console.log(schAmt, "schAmt")



        const totalBase = parseFloat(((ptr * qty) - totalSchAmt).toFixed(2));
        // setBase(totalBase);
    };

    const removeItem = () => {
        setUnit('')
        setBatch('')
        setSearchItem('');
        setExpiryDate('');
        setMRP('')
        setQty('')
        setFree('')
        setPTR('')
        setDisc('')
        setGst('')
        setLoc('')
        setItemTotalAmount(0)
    }
    const handleSubmit = () => {
        const newErrors = {};
        if (!distributor) {
            newErrors.distributor = 'Please select Distributor';
        }
        if (!billNo) {
            newErrors.billNo = 'Bill No is Required';
        }
        if (selectedItem.length === 0) {
            newErrors.ItemId = 'Please select at least one item';
            toast.error('Please select at least one item');
        }
        setError(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        submitPurchaseData();
        setIsOpenBox(false)
        setPendingNavigation(null);
    }

    const submitPurchaseData = async () => {
        let data = new FormData();
        const selectedItems = returnItemList.item_list.filter(item => selectedItem.includes(item.id));
        setIsLoading(true)
        data.append("distributor_id", distributor.id);
        data.append("bill_no", billNo);
        data.append("bill_date", selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
        data.append('remark', remark);
        data.append("owner_type", localStorage.getItem('UserName'));
        data.append("purches_return", JSON.stringify(selectedItems));
        data.append('final_amount', returnItemList.final_amount);
        data.append('payment_type', paymentType);
        // data.append('other_amount', otherAmt || 0);
        data.append('other_amount', otherAmount || 0);

        data.append('net_amount', netAmount);
        data.append('round_off', roundOff);
        data.append('start_date', startDate ? format(startDate, 'MM/yy') : '');
        data.append('end_date', endDate ? format(endDate, 'MM/yy') : '');
        try {
            await axios.post("purches-return-store", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                //console.log(response.data)
                setIsLoading(false)
                setSaveValue(true);
                toast.success(response.data.message);
                setTimeout(() => {
                    history.push('/purchase/return');
                }, 2000);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

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

    const handleEditClick = (item, value) => {
        // console.log(value,"value")
        setSelectedEditItem(item);
        setSelectedEditItemId(item.id);
        setItemPurchaseId(item.item_id);
        setTempQty(item.qty)

        console.log(item.qty, "qty")
    };

    const handleQtyChange = (value) => {
        console.log(value, 'value')
        const inputQty = Number(value); // Convert the input to a number
        console.log(inputQty, "inputQty")
        if (inputQty <= editQty) {
            setQty(inputQty);  // Update the qty if it's valid
        } else {
            setQty(editQty);   // Limit the value to the initial editQty
            toast.error("Quantity exceeds the allowed limit");
        }


    };



    const EditReturn = async () => {
        const newErrors = {};
        if (!unit) newErrors.unit = 'Unit is required';
        if (!batch) newErrors.batch = 'Batch is required';
        if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';
        if (!mrp) newErrors.mrp = 'MRP is required';
        if (!qty) newErrors.qty = 'Quantity is required';
     
        if (Number(tempQty) < Number(qty)){
            console.log(tempQty,qty,"")
            newErrors.greatqty = 'Quantity should not be greater than purchase quantity ';
            toast.error('Quantity should not be greater than purchase quantity ')
            return
        }

        if (!free) newErrors.free = 'Free quantity is required';
        if (!ptr) newErrors.ptr = 'PTR is required';
        if (!disc) newErrors.disc = 'Discount is required';
        if (!gst.name) newErrors.gst = 'GST is required';
        if (!loc) newErrors.loc = 'Location is required';

        setErrors(newErrors);
        const isValid = Object.keys(newErrors).length === 0;
        if (isValid) {
            await handleEditItem(); // Call handleEditItem if validation passes
        }
        return isValid;


    }

    const restoreData = () => {
        let data = new FormData();
        const params = {
            start_date: localStorage.getItem('StartFilterDate'),
            end_date: localStorage.getItem('EndFilterDate'),
            distributor_id: localStorage.getItem('DistributorId'),
            type: 0
        };
        try {
            const res = axios.post("purches-return-iteam-histroy?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                //console.log(response);
                localStorage.removeItem('StartFilterDate')
                localStorage.removeItem('EndFilterDate')
                localStorage.removeItem('DistributorId')
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    // const handleChecked = async (ItemId) => {
    //     setSelectedItem(
    //         (prevSelected) => prevSelected.includes(ItemId) ? prevSelected.filter(id => id !== ItemId)
    //             : [...prevSelected, ItemId]);
    //     let data = new FormData();
    //     data.append("id", ItemId);

    //     try {
    //         await axios.post("purchase-return-iteam-select", data, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         }
    //         ).then((response) => {
    //             //console.log(response.data, "data item select")
    //             purcheseReturnFilter()
    //             // setIsLoading(false)
    //         })
    //     } catch (error) {
    //         console.error("API error:", error);
    //     }
    // }
    const handleChecked = async (itemId, checked) => {
        let data = new FormData();
        data.append("id", itemId);
        try {
            const response = await axios.post("purchase-return-iteam-select", data, {
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
                const allSelected = returnItemList?.item_list.every(item => item.iss_check) || false;
                // setSelectAll(allSelected);
                purcheseReturnFilter();
            }
        } catch (error) {
            console.error("API error:", error);
        }
    };

    const handleSelectAll = async (checked) => {
        for (let i = 0; i < returnItemList?.item_list?.length; i++) {
            handleChecked(returnItemList?.item_list[i].id, checked);
        }
    };

    const handleEditItem = async () => {
        let data = new FormData();
        data.append('purches_return_id', selectedEditItemId)
        data.append('iteam_id', itemPurchaseId)
        data.append("batch", batch)
        data.append("exp_dt", expiryDate)
        data.append("mrp", mrp)
        data.append("ptr", ptr)
        data.append("fr_qty", free)
        data.append("qty", qty)
        data.append("disocunt", disc)
        data.append('gst', gst.id)
        data.append('location', loc)
        data.append('amount', ItemTotalAmount)
        data.append("weightage", unit)
        const params = {
            id: selectedEditItemId
        };
        try {
            const response = await axios.post("purches-return-edit-iteam?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            //console.log("response", response);
            setIsDeleteAll(true);
            purcheseReturnFilter();
            setSearchItem('');
            setUnit('')
            setBatch('')
            setExpiryDate('');
            setMRP('')
            setQty('')
            setFree('')
            setPTR('')
            setGst('')
            setDisc('')
            setBatch('')
            setLoc('')
            setItemTotalAmount(0);
        }
        catch (e) {
            //console.log(e)
        }
    }


    const handleOtherAmount = (event) => {
        let value = parseFloat(event.target.value) || "";
        if (value < -finalAmount) {
            value = -finalAmount;
        }
        setOtherAmount(value);
    };


    const handleMinQty = (e) => {
        console.log(e, "event")
        if (qty > e) {
            setQty(e)
        }
    }


    return (
        <>
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
            {isLoading ? <div className="loader-container ">
                <Loader />
            </div> :
                <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 75px)', padding: "0px 20px 0px" }} >
                    <div>
                        <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', width: '600px', gap: '7px' }}>
                                <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px', cursor: "pointer" }} onClick={() => history.push('/purchase/return')}>Purchase</span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', marginTop: '10px', alignItems: 'center', color: "rgba(4, 76, 157, 1)" }} />
                                <span className='hover:text-blue-900' style={{ color: '#044c9d', display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '18px', cursor: "pointer" }} onClick={() => history.push('/purchase/return')} >Purchase Return</span>
                                <ArrowForwardIosIcon style={{ fontSize: '18px', marginTop: '10px', alignItems: 'center', color: "rgba(4, 76, 157, 1)" }} />
                                <span className='darkblue_text' style={{ display: 'flex', alignItems: 'center', alignItems: 'center', fontWeight: 600, fontSize: '18px' }}>New </span>
                                <BsLightbulbFill className="mt-1 w-6 h-6 sky_text hover-yellow" />
                            </div>
                            <div className="headerList">
                                <Select
                                    labelId="dropdown-label"
                                    id="dropdown"
                                    value={paymentType}
                                    sx={{ minWidth: '200px' }}
                                    onChange={(e) => { setPaymentType(e.target.value) }}
                                    size="small"
                                >
                                    <MenuItem value="cash">Cash</MenuItem>
                                    <MenuItem value="credit">Credit</MenuItem>
                                    {bankData?.map(option => (
                                        <MenuItem key={option.id} value={option.id}>{option.bank_name}</MenuItem>
                                    ))}
                                </Select>
                                <Button variant="contained" style={{ background: "rgb(4, 76, 157)" }} onClick={handleSubmit}>Save</Button>
                            </div>
                        </div>
                        <div className="bg-white">
                            <div className="firstrow flex">
                                <div className="detail">
                                    <span className="title mb-2">Distributor</span>
                                    <Autocomplete
                                        value={distributor}
                                        sx={{
                                            width: '100%',
                                            minWidth: '300px',
                                            '@media (max-width:600px)': {
                                                minWidth: '250px',
                                            },
                                        }}
                                        size='small'
                                        onChange={(e, value) => setDistributor(value)}
                                        options={distributorList}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    {error.distributor && <span style={{ color: 'red', fontSize: '12px' }}>{error.distributor}</span>}
                                    {errors.distributor && <span style={{ color: 'red', fontSize: '12px' }}>{errors.distributor}</span>}
                                </div>
                                <div className="detail">
                                    <span className="title mb-2">Bill Date</span>
                                    <div>
                                        <DatePicker
                                            className='custom-datepicker '
                                            selected={selectedDate}
                                            onChange={(newDate) => setSelectedDate(newDate)}
                                            dateFormat="dd/MM/yyyy"
                                            filterDate={(date) => !isDateDisabled(date)}
                                        />
                                    </div>
                                </div>
                                <div className="detail">
                                    <span className="title mb-2">Bill No</span>
                                    <TextField
                                        id="outlined-number"
                                        type='number'
                                        size="small"
                                        sx={{ width: '150px' }}
                                        value={billNo}
                                        disabled
                                    />
                                    {error.billNo && <span style={{ color: 'red', fontSize: '12px' }}>{error.billNo}</span>}


                                </div>
                                <div className="detail">
                                    <span className="title mb-2">Start Date</span>
                                    <div >
                                        <DatePicker
                                            className='custom-datepicker '
                                            selected={startDate}
                                            error={!!errors.startDate}
                                            onChange={(newDate) => setStartDate(newDate)}
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                        />
                                    </div>
                                </div>
                                <div className="detail">
                                    <span className="title mb-2">End Date</span>
                                    <div >
                                        <DatePicker
                                            className='custom-datepicker '
                                            selected={endDate}
                                            onChange={(newDate) => setEndDate(newDate)}
                                            dateFormat="MM/yyyy"
                                            showMonthYearPicker
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        style={{
                                            minHeight: '38px',
                                            alignItems: "center",
                                            marginTop: "24px",
                                            background: "rgba(4, 76, 157, 1)"
                                        }}
                                        onClick={() => filterData(searchItem)}
                                    >
                                        <FilterAltIcon size='large' style={{ color: "white", fontSize: '20px' }} /> Filter
                                    </Button>
                                </div>
                                <div>
                                </div>
                                <div>
                                </div>
                            </div>
                            <div className='firstrow flex' style={{ paddingTop: "0" }}>
                                <div className="detail">
                                    <span className="title mb-2">Remark</span>
                                    <TextField
                                        id="outlined-number"
                                        size="small"
                                        sx={{
                                            width: '100%',
                                            minWidth: '300px',
                                            '@media (max-width:600px)': {
                                                minWidth: '250px',
                                            },
                                        }}
                                        value={remark}
                                        onChange={(e) => { setRemark(e.target.value) }}
                                    />
                                </div>
                            </div>
                            <div className='overflow-x-auto mt-4 '>
                                <table className="w-full border-collapse custom-table">
                                    <thead>
                                        <tr>
                                            <th >Item Name</th>
                                            <th >Unit</th>
                                            <th >Batch  </th>
                                            <th >Expiry </ th>
                                            <th >MRP  </th>
                                            <th >Qty. </th>
                                            <th >Free </th>
                                            <th >PTR </ th>
                                            <th >CD%</th>
                                            <th >GST%  </th>
                                            <th >Loc.</th>
                                            <th >Amount </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {returnItemList.length === 0 ? (
                                            <tr>
                                                <td colSpan={12} style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>No record found</td>
                                            </tr>
                                        ) : (<>
                                            <tr>
                                                <td style={{ width: '500px' }}>
                                                    <div >
                                                        <DeleteIcon className='delete-icon' onClick={removeItem}
                                                        />
                                                        {searchItem}
                                                    </div>
                                                </td>
                                                <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        type="number"
                                                        // inputRef={inputRef1}
                                                        // onKeyDown={handleKeyDown}
                                                        size="small"
                                                        error={!!errors.unit}
                                                        value={unit}
                                                        sx={{ width: '80px' }}
                                                        onChange={(e) => { setUnit(e.target.value) }}
                                                    />
                                                </td>
                                                <td>


                                                    <TextField
                                                        id="outlined-number"
                                                        type="number"
                                                        // inputRef={inputRef1}
                                                        // onKeyDown={handleKeyDown}
                                                        size="small"
                                                        disabled
                                                        error={!!errors.batch}
                                                        value={batch}
                                                        sx={{ width: '80px' }}
                                                        onChange={(e) => { setBatch(e.target.value) }}
                                                    />
                                                </td>
                                                <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        disabled
                                                        size="small"
                                                        sx={{ width: '100px' }}
                                                        // inputRef={inputRef3}
                                                        // onKeyDown={handleKeyDown}
                                                        error={!!errors.expiryDate}
                                                        value={expiryDate}
                                                        onChange={handleExpiryDateChange}
                                                        placeholder="MM/YY"
                                                    />
                                                </td>
                                                <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        type="number"
                                                        sx={{ width: '100px' }}
                                                        size="small"
                                                        disabled
                                                        // inputRef={inputRef4}
                                                        // onKeyDown={handleKeyDown}
                                                        error={!!errors.mrp}
                                                        value={mrp}
                                                        onChange={(e) => { setMRP(e.target.value) }}
                                                    />
                                                </td>
                                                <td>

                                                    <TextField
                                                        id="outlined-number"
                                                        type="number"
                                                        sx={{ width: '100px' }}
                                                        size="small"
                                                        // inputRef={inputRef5}
                                                        // onKeyDown={handleKeyDown}
                                                        error={!!errors.qty}
                                                        value={qty}
                                                        onChange={(e) => {e.target.value>tempQty?setQty(tempQty): setQty(e.target.value) }}

                                                    // onChange={(e) => {
                                                    //     const inputQty = Number(e.target.value); // Convert the input value to a number
                                                    //     if (inputQty <= editQty) {
                                                    //         setQty(inputQty);  // Set the value if it's less than or equal to `editQty`
                                                    //     } else {
                                                    //         setQty(editQty);   // Limit the value to `editQty`
                                                    //         toast.error("Quantity exceeds the allowed limit"); // Show the error message
                                                    //     }
                                                    // }}

                                                    />

                                                </td>
                                                <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        size="small"
                                                        type="number"
                                                        sx={{ width: '100px' }}
                                                        value={free}
                                                        // inputRef={inputRef6}
                                                        // onKeyDown={handleKeyDown}
                                                        error={!!errors.free}
                                                        onChange={(e) => { setFree(e.target.value) }}
                                                    />


                                                </td>
                                                <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        type="number"
                                                        sx={{ width: '100px' }}
                                                        size="small"
                                                        // inputRef={inputRef7}
                                                        // onKeyDown={handleKeyDown}
                                                        value={ptr}
                                                        error={!!errors.ptr}
                                                        onChange={(e) => setPTR(e.target.value)}
                                                    />
                                                </td>
                                                <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        sx={{ width: '100px' }}
                                                        size="small"
                                                        type="number"
                                                        // inputRef={inputRef8}
                                                        // onKeyDown={handleKeyDown}
                                                        value={disc}
                                                        error={!!errors.disc}
                                                        onChange={handleSchAmt} />
                                                </td>
                                                <td>
                                                    <Select
                                                        labelId="dropdown-label"
                                                        id="dropdown"
                                                        value={gst.name}
                                                        sx={{ minWidth: '80px' }}
                                                        onChange={(e) => {
                                                            const selectedOption = gstList.find(option => option.name === e.target.value);
                                                            setGst(selectedOption);
                                                        }}
                                                        size="small"
                                                        displayEmpty
                                                        error={!!errors.gst}
                                                    >
                                                        {gstList.map(option => (
                                                            <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </td>
                                                <td>
                                                    <TextField
                                                        id="outlined-number"
                                                        // inputRef={inputRef12}
                                                        // onKeyDown={handleKeyDown}
                                                        size="small"
                                                        value={loc}
                                                        error={!!errors.loc}
                                                        sx={{ width: '100px' }}
                                                        onChange={(e) => { setLoc(e.target.value) }}
                                                    />
                                                </td>
                                                <td className="total"><span>{ItemTotalAmount}</span></td>
                                            </tr>
                                            <tr >
                                                <td>
                                                    <TextField
                                                        id="outlined-basic"
                                                        size="small"
                                                        sx={{ width: "75%", marginTop: "5px" }}
                                                        value={searchQuery}
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
                                                <td><Button variant="contained" color="success" onClick={EditReturn}><ControlPointIcon />Update</Button>
                                                </td>
                                            </tr>

                                            {/* all select */}
                                            {/* {returnItemList?.item_list?.length > 0 && (
                                                <Checkbox
                                                    checked={returnItemList?.item_list?.every(item => item.iss_check)}
                                                    onChange={(event) => handleSelectAll(event.target.checked)}
                                                />
                                            )} */}
                                            {returnItemList?.item_list.map(item => (
                                                <tr key={item.id} className="item-List" onClick={(event) => handleEditClick(item, event.target)}  >
                                                    <td style={{
                                                        display: 'flex', gap: '8px', alignItems: 'center'
                                                    }}>
                                                        <td>
                                                            <Checkbox
                                                                // key={item.id}
                                                                checked={item?.iss_check}
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                }}
                                                                onChange={(event) => handleChecked(item.id, event.target.checked)}
                                                            />
                                                        </td>
                                                        < BorderColorIcon color="primary" />
                                                        <DeleteIcon className='delete-icon' onClick={() => deleteOpen(item.id)} />{item.item_name}
                                                    </td>
                                                    <td>{item.weightage}</td>
                                                    <td>{item.batch_number}</td>
                                                    <td>{item.expiry}</td>
                                                    <td>{item.mrp}</td>
                                                    <td>{item.qty}</td>
                                                    <td>{item.fr_qty}</td>
                                                    <td>{item.ptr}</td>
                                                    <td>{item.disocunt}</td>
                                                    <td>{item.gst_name}</td>
                                                    <td>{item.location}</td>
                                                    <td>{item.amount}</td>
                                                </tr>
                                            ))}
                                            < tr >
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal">Total</td>
                                                <td className="amounttotal">{finalAmount}</td>
                                            </tr>
                                            <tr>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal">Other Amount</td>
                                                <td className="amounttotal">
                                                    <TextField
                                                        id="outlined-number"
                                                        size="small"
                                                        // value={otherAmt}
                                                        value={otherAmount}
                                                        type="number"
                                                        sx={{ width: '100px' }}
                                                        onChange={handleOtherAmount}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal">Round Off</td>
                                                <td className="amounttotal">

                                                    {roundOff < 0.49 ? `-${roundOff}` : parseFloat(1 - roundOff)?.toFixed(2)}

                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal"></td>
                                                <td className="amounttotal">Net Amount</td>
                                                {/* <td className="amounttotal">{netAmount ? parseInt(Number(netAmount).toFixed(2)) : 0} */}
                                                <td className="amounttotal">{netAmount}

                                                </td>
                                            </tr>
                                        </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div >
                </div >
            }
            <Dialog open={open}>
                <DialogContent style={{ fontSize: '20px', }}>
                    <h2>Please select Return Type.</h2>
                </DialogContent>
                <DialogActions style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button onClick={() => setOpen(false)} variant="contained">
                        OK !
                    </Button>
                </DialogActions>
            </Dialog>
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
                            onClick={() => handleDeleteItem(ItemId)}
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
            <div
                id="modal"
                value={isOpenBox}
                className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${isOpenBox ? "block" : "hidden"}`}
            >
                <div />
                <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
                    <div className="my-4 logout-icon">
                        <VscDebugStepBack className=" h-12 w-14" style={{ color: "#628A2F" }} />
                        <h4 className="text-lg font-semibold mt-6 text-center">Are you sure you want to leave this page ?</h4>
                    </div>
                    <div className="flex gap-5 justify-center">
                        <button
                            type="submit"
                            className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-blue-600 hover:bg-blue-600 active:bg-blue-500"
                            onClick={handleLogout}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-400 hover:text-black"
                            onClick={LogoutClose}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default AddReturnbill




// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import React, { useState, useRef, useEffect } from 'react';
// import { Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputAdornment, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import DatePicker from 'react-datepicker';
// import { addMonths, format, subDays, subMonths } from 'date-fns';
// import 'react-datepicker/dist/react-datepicker.css';
// import Autocomplete from '@mui/material/Autocomplete';
// import { Button, TextField } from "@mui/material";
// import ControlPointIcon from '@mui/icons-material/ControlPoint';
// import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min";
// import BorderColorIcon from '@mui/icons-material/BorderColor';
// import { BsLightbulbFill } from "react-icons/bs";
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
// import axios from "axios";
// import '../Add-ReturnBill/AddReturnbill.css'
// import Header from '../../../Header';
// import Loader from '../../../../componets/loader/Loader';
// import { toast, ToastContainer } from 'react-toastify';
// import SearchIcon from "@mui/icons-material/Search";
// import { FaPowerOff } from "react-icons/fa";
// import { VscDebugStepBack } from "react-icons/vsc";
// const AddReturnbill = () => {
//     const token = localStorage.getItem("token")
//     const history = useHistory();
//     const unblockRef = useRef(null);
//     const [isOpenBox, setIsOpenBox] = useState(false);
//     const [pendingNavigation, setPendingNavigation] = useState(null);
//     const [selectedDate, setSelectedDate] = useState(new Date());
//     const [startDate, setStartDate] = useState(new Date());
//     const [endDate, setEndDate] = useState(addMonths(new Date(), 6));
//     const [isLoading, setIsLoading] = useState(false);
//     const [mrp, setMRP] = useState()
//     const [ptr, setPTR] = useState()
//     const [billNo, setBillNo] = useState()
//     const [gst, setGst] = useState({ id: '', name: '' });
//     const [selectedEditItemId, setSelectedEditItemId] = useState(null);
//     const [open, setOpen] = useState(false);
//     const [selectedOption, setSelectedOption] = useState(1);
//     const [returnType, setReturnType] = useState(null);
//     const [ItemId, setItemId] = useState('')
//     const [IsDelete, setIsDelete] = useState(false);
//     // const inputRef1 = useRef();
//     // const inputRef2 = useRef();
//     // const inputRef3 = useRef();
//     // const inputRef4 = useRef();
//     // const inputRef5 = useRef();
//     // const inputRef6 = useRef();
//     // const inputRef7 = useRef();
//     // const inputRef8 = useRef();
//     // const inputRef9 = useRef();
//     // const inputRef10 = useRef();
//     // const inputRef12 = useRef();
//     const [unit, setUnit] = useState('');
//     const [schAmt, setSchAmt] = useState('');
//     const [disc, setDisc] = useState('');
//     const [selectedEditItem, setSelectedEditItem] = useState(null);
//     const [isDeleteAll, setIsDeleteAll] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [batchList, setBatchList] = useState([]);
//     const [gstList, setGstList] = useState([]);
//     const [ItemTotalAmount, setItemTotalAmount] = useState(0);
//     const [loc, setLoc] = useState('');
//     const [distributorList, setDistributorList] = useState([]);
//     const [returnItemList, setReturnItemList] = useState([])
//     const [distributor, setDistributor] = useState(null);
//     const [remark, setRemark] = useState('')
//     const [expiryDate, setExpiryDate] = useState('');
//     const [qty, setQty] = useState('')
//     const [free, setFree] = useState('')
//     const [error, setError] = useState({ distributor: '', returnType: '', billNo: '', startDate: '', endDate: '' });
//     const staffOptions = [{ value: 'Owner', id: 1 }, { value: localStorage.getItem('UserName'), id: 2 },]
//     const [batch, setBatch] = useState('')
//     const [searchItem, setSearchItem] = useState('')
//     const [itemPurchaseId, setItemPurchaseId] = useState('');
//     const [paymentType, setPaymentType] = useState('cash');
//     const [bankData, setBankData] = useState([]);
//     // const [roundOff, setRoundOff] = useState(0)
//     // const [otherAmt, setOtherAmt] = useState("")
//     // const [netAmount, setNetAmount] = useState(0)
//     // const [finalAmount, setFinalAmount] = useState(0)
//     const [selectedItem, setSelectedItem] = useState([]);
//     const [selectAll, setSelectAll] = useState(false);
//     const [isOpen, setIsOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const [saveValue, setSaveValue] = useState(false);
//     const [totalAmount, setTotalAmount] = useState(0)
//     const [netAmount, setNetAmount] = useState(0);
//     const [roundOff, setRoundOff] = useState(0.00)
//     const [otherAmount, setOtherAmount] = useState(0)
//     const [finalAmount, setFinalAmount] = useState(0)

//     // const handleKeyDown = (event) => {
//     //     if (event.key === 'Enter') {
//     //         if (event.target === inputRef1.current) {
//     //         event.preventDefault();
//     //             inputRef2.current.focus();
//     //         } else if (event.target === inputRef2.current) {
//     //             inputRef3.current.focus();
//     //         } else if (event.target === inputRef3.current) {
//     //             inputRef4.current.focus();
//     //         } else if (event.target === inputRef4.current) {
//     //             inputRef5.current.focus();
//     //         } else if (event.target === inputRef5.current) {
//     //             inputRef6.current.focus();
//     //         } else if (event.target === inputRef6.current) {
//     //             inputRef7.current.focus();
//     //         } else if (event.target === inputRef7.current) {
//     //             inputRef8.current.focus();
//     //         } else if (event.target === inputRef8.current) {
//     //             inputRef9.current.focus();
//     //         }
//     //     };
//     // }

//     useEffect(() => {
//         if (saveValue === false) {
//             unblockRef.current = history.block((location) => {
//                 if (!isOpenBox) {
//                     setPendingNavigation(location);
//                     setIsOpenBox(true);
//                     setSaveValue(false);
//                     return false;
//                 }
//             });
//             return () => {
//                 if (unblockRef.current) {
//                     unblockRef.current();
//                 }
//             };
//         }
//     }, [saveValue, history, isOpenBox]);

//     useEffect(() => {
//         if (otherAmount !== '') {
//             const x = parseFloat(finalAmount) + parseFloat(otherAmount)
//             setRoundOff((x % 1).toFixed(2))
//             roundOff > 0.49 ? setNetAmount(parseInt(x) + 1) : setNetAmount(parseInt(x))

//         } else {
//             const x = parseFloat(finalAmount).toFixed(2)
//             setRoundOff((x % 1).toFixed(2))
//             roundOff > 0.49 ? setNetAmount(parseInt(x) + 1) : setNetAmount(parseInt(x))
//         }

//     }, [otherAmount, totalAmount, roundOff, netAmount]);

//     const LogoutClose = () => {
//         setIsOpenBox(false);
//         setPendingNavigation(null);
//     };

//     const handleLogout = async () => {
//         await restoreData();

//         if (pendingNavigation) {
//             if (unblockRef.current) {
//                 unblockRef.current();
//             }
//             history.push(pendingNavigation.pathname);
//         }
//         setIsOpenBox(false);
//         window.location.reload();
//     };

//     const paymentOptions = [
//         { id: 1, label: 'Cash' },
//         { id: 2, label: 'Credit' },
//         { id: 3, label: 'UPI' },
//         { id: 4, label: 'Cheque' },
//         { id: 5, label: 'Paytm' },
//         { id: 6, label: 'CC/DC' },
//         { id: 7, label: 'RTGS/NEFT' }]
//     useEffect(() => {
//         listOfGst();
//         listDistributor();
//         BankList();
//         restoreData()
//         setBillNo(localStorage.getItem('Purchase_Return_BillNo'));
//     }, [])

//     useEffect(() => {
//         const totalSchAmt = parseFloat((((ptr * disc) / 100) * qty).toFixed(2));
//         const totalBase = parseFloat(((ptr * qty) - totalSchAmt).toFixed(2));
//         const totalAmount = parseFloat((totalBase + (totalBase * gst.name / 100)).toFixed(2));
//         if (totalAmount) {
//             setItemTotalAmount(totalAmount);
//         } else {
//             setItemTotalAmount(0)
//         }
//         if (isDeleteAll == false) {
//             // restoreData();
//         }
//     }, [ptr, qty, disc, gst.name])

//     // useEffect(() => {
//     //     const adjustedTotalAmount = finalAmount - otherAmt;
//     //     const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

//     //     let netAmountCal;
//     //     let roundOffAmountCal;

//     //     if (decimalPart >= 0.50) {
//     //         netAmountCal = Math.ceil(adjustedTotalAmount);
//     //         roundOffAmountCal = netAmountCal - adjustedTotalAmount;
//     //     } else {
//     //         netAmountCal = Math.floor(adjustedTotalAmount);
//     //         roundOffAmountCal = netAmountCal - adjustedTotalAmount;
//     //     }
//     //     setNetAmount(netAmountCal);
//     //     setRoundOff(roundOffAmountCal);
//     //     const x = otherAmt + parseInt(finalAmount)
//     //     setNetAmount(x);
//     // }, [finalAmount, otherAmt]);

//     // useEffect(() => {
//     //     let adjustedTotalAmount = finalAmount - otherAmt;
//     //     const decimalPart = adjustedTotalAmount - Math.floor(adjustedTotalAmount);

//     //     let netAmountCal;
//     //     let roundOffAmountCal;

//     //     if (finalAmount <= 49) {
//     //         netAmountCal = finalAmount;
//     //         roundOffAmountCal = 0;
//     //     }
//     //     else {
//     //         if (decimalPart >= 0.50) {
//     //             // Round up
//     //             netAmountCal = Math.ceil(adjustedTotalAmount);
//     //             roundOffAmountCal = netAmountCal - adjustedTotalAmount;
//     //         } else {
//     //             // Round down
//     //             netAmountCal = Math.floor(adjustedTotalAmount);
//     //             roundOffAmountCal = netAmountCal - adjustedTotalAmount;
//     //         }
//     //     }
//     //     setNetAmount(netAmountCal);
//     //     setRoundOff(roundOffAmountCal);
//     //     const x = otherAmt + parseInt(finalAmount)
//     //     setNetAmount(x);
//     // }, [finalAmount, otherAmt]);


//     const BankList = async () => {
//         let data = new FormData()
//         try {
//             await axios.post('bank-list', data, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 }
//             }
//             ).then((response) => {
//                 setBankData(response.data.data)
//             })
//         } catch (error) {
//             console.error("API error:", error);
//         }
//     }

//     let listOfGst = () => {
//         axios.get("gst-list", {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         })
//             .then((response) => {
//                 //console.log("API Response item Catagory:===", response);
//                 setGstList(response.data.data);
//             })
//             .catch((error) => {
//                 //console.log("API Error:", error);
//             });
//     }

//     let listDistributor = () => {
//         axios.get("list-distributer", {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         }).then((response) => {
//             localStorage.setItem("distributor", response.data.data.distributor)
//             setDistributorList(response.data.data);
//         }).catch((error) => {
//             //console.log("API Error:", error);
//         });
//     };
//     const isDateDisabled = (date) => {
//         const today = new Date();
//         // Set time to 00:00:00 to compare only date part
//         today.setHours(0, 0, 0, 0);


//         // Disable dates that are greater than today
//         return date > today;
//     };
//     const deleteOpen = (Id) => {
//         setIsDelete(true);
//         setItemId(Id);
//     };


//     const handleDeleteItem = async (ItemId) => {
//         if (!ItemId) return;
//         let data = new FormData();
//         data.append("purches_return_id", ItemId);
//         const params = {
//             purches_return_id: ItemId,
//             type: 0
//         };
//         try {
//             await axios.post("purches-return-iteam-delete?", data, {
//                 params: params,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//             ).then((response) => {
//                 purcheseReturnFilter();
//                 setIsDelete(false);
//             })
//         } catch (error) {
//             console.error("API error:", error);
//         }
//     }


//     const filterData = async (searchItem) => {
//         console.log(searchItem, "searchItem")
//         const newErrors = {};
//         if (!distributor) newErrors.distributor = 'distributor is required';
//         if (!startDate) newErrors.startDate = 'start date is required';
//         if (!endDate) newErrors.endDate = 'end date is required';


//         setErrors(newErrors);
//         const isValid = Object.keys(newErrors).length === 0;
//         if (isValid) {
//             await purcheseReturnFilter(); // Call handleAddItem if validation passes
//         }
//         return isValid;
//     }


//     const handleInputChange = (e) => {
//         const value = e.target.value;
//         setSearchQuery(value); // Update the state first
//         purcheseReturnFilter(value); // Call the filter function with the updated value
//     };

//     const purcheseReturnFilter = async (value) => {
//         let data = new FormData();
//         // setIsLoading(true);
//         data.append("start_date", startDate ? format(startDate, 'MM/yy') : '');
//         data.append("end_date", endDate ? format(endDate, 'MM/yy') : '');
//         data.append("distributor_id", distributor.id);
//         data.append("search", value ? value : "");
//         // console.log(searchQuery,"value")

//         try {
//             await axios.post("purches-return-filter?", data, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//             ).then((response) => {
//                 setReturnItemList(response.data.data)
//                 setFinalAmount(response.data.data?.final_amount)
//                 setNetAmount(response.data.data?.final_amount)


//                 console.log(response, "response")
//                 // batchListAPI();
//                 // setIsLoading(false);
//                 //console.log(response.data.data.item_list)
//             })
//             localStorage.setItem('StartFilterDate', format(startDate, 'MM/yy'));
//             localStorage.setItem('EndFilterDate', format(endDate, 'MM/yy'));
//             localStorage.setItem('DistributorId', distributor.id);


//         } catch (error) {
//             console.error("API error:", error);
//         }
//     }

//     const handleChange = (event) => {
//         setSelectedOption(event.target.value);
//     };

//     const handleSchAmt = (e) => {
//         const inputDiscount = parseFloat(e.target.value);
//         setDisc(inputDiscount);


//         const totalSchAmt = parseFloat((((ptr * inputDiscount) / 100) * qty).toFixed(2));
//         setSchAmt(totalSchAmt);


//         const totalBase = parseFloat(((ptr * qty) - totalSchAmt).toFixed(2));
//         // setBase(totalBase);
//     };

//     const removeItem = () => {
//         setUnit('')
//         setBatch('')
//         setSearchItem('');
//         setExpiryDate('');
//         setMRP('')
//         setQty('')
//         setFree('')
//         setPTR('')
//         setDisc('')
//         setGst('')
//         setLoc('')
//         setItemTotalAmount(0)
//     }
//     const handleSubmit = () => {
//         const newErrors = {};
//         if (!distributor) {
//             newErrors.distributor = 'Please select Distributor';
//         }
//         if (!billNo) {
//             newErrors.billNo = 'Bill No is Required';
//         }
//         if (selectedItem.length === 0) {
//             newErrors.ItemId = 'Please select at least one item';
//             toast.error('Please select at least one item');
//         }
//         setError(newErrors);
//         if (Object.keys(newErrors).length > 0) {
//             return;
//         }
//         submitPurchaseData();
//         setIsOpenBox(false)
//         setPendingNavigation(null);
//     }

//     const submitPurchaseData = async () => {
//         let data = new FormData();
//         const selectedItems = returnItemList.item_list.filter(item => selectedItem.includes(item.id));
//         setIsLoading(true)
//         data.append("distributor_id", distributor.id);
//         data.append("bill_no", billNo);
//         data.append("bill_date", selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
//         data.append('remark', remark);
//         data.append("owner_type", localStorage.getItem('UserName'));
//         data.append("purches_return", JSON.stringify(selectedItems));
//         data.append('final_amount', returnItemList.final_amount);
//         data.append('payment_type', paymentType);
//         // data.append('other_amount', otherAmt || 0);
//         data.append('other_amount', otherAmount || 0);

//         data.append('net_amount', netAmount);
//         data.append('round_off', roundOff);
//         data.append('start_date', startDate ? format(startDate, 'MM/yy') : '');
//         data.append('end_date', endDate ? format(endDate, 'MM/yy') : '');
//         try {
//             await axios.post("purches-return-store", data, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//             ).then((response) => {
//                 //console.log(response.data)
//                 setIsLoading(false)
//                 setSaveValue(true);
//                 toast.success(response.data.message);
//                 setTimeout(() => {
//                     history.push('/purchase/return');
//                 }, 2000);
//             })
//         } catch (error) {
//             console.error("API error:", error);
//         }
//     }

//     const handleExpiryDateChange = (event) => {
//         let inputValue = event.target.value;
//         inputValue = inputValue.replace(/\D/g, '');


//         if (inputValue.length > 2) {
//             const month = inputValue.slice(0, 2);
//             const year = inputValue.slice(2, 4);
//             if (parseInt(month) > 12) {
//                 inputValue = 'MM';
//             } else if (parseInt(month) < 1) {
//                 inputValue = '01';
//             }
//             inputValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2, 4)}`;
//         }
//         setExpiryDate(inputValue);
//     };

//     const handleEditClick = (item) => {
//         setSelectedEditItem(item);
//         setSelectedEditItemId(item.id);
//         setItemPurchaseId(item.item_id);
//         if (selectedEditItem) {
//             setSearchItem(selectedEditItem.item_name)
//             setUnit(selectedEditItem.weightage);
//             setBatch(selectedEditItem.batch_number);
//             setExpiryDate(selectedEditItem.expiry);
//             setMRP(selectedEditItem.mrp);
//             setQty(selectedEditItem.qty);
//             setFree(selectedEditItem.fr_qty);
//             setPTR(selectedEditItem.ptr);
//             setDisc(selectedEditItem.disocunt);
//             setGst(gstList.find(option => option.name === selectedEditItem.gst_name) || {});
//             setLoc(selectedEditItem.location);
//             setItemTotalAmount(selectedEditItem.amount)
//         }
//     };


//     const EditReturn = async () => {
//         const newErrors = {};
//         if (!unit) newErrors.unit = 'Unit is required';
//         if (!batch) newErrors.batch = 'Batch is required';
//         if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';
//         if (!mrp) newErrors.mrp = 'MRP is required';
//         if (!qty) newErrors.qty = 'Quantity is required';
//         if (!free) newErrors.free = 'Free quantity is required';
//         if (!ptr) newErrors.ptr = 'PTR is required';
//         if (!disc) newErrors.disc = 'Discount is required';
//         if (!gst.name) newErrors.gst = 'GST is required';
//         if (!loc) newErrors.loc = 'Location is required';
//         setErrors(newErrors);
//         const isValid = Object.keys(newErrors).length === 0;
//         if (isValid) {
//             await handleEditItem(); // Call handleEditItem if validation passes
//         }
//         return isValid;


//     }

//     const restoreData = () => {
//         let data = new FormData();
//         const params = {
//             start_date: localStorage.getItem('StartFilterDate'),
//             end_date: localStorage.getItem('EndFilterDate'),
//             distributor_id: localStorage.getItem('DistributorId'),
//             type: 0
//         };
//         try {
//             const res = axios.post("purches-return-iteam-histroy?", data, {
//                 params: params,
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${token}`,
//                 },
//             }
//             ).then((response) => {
//                 //console.log(response);
//                 localStorage.removeItem('StartFilterDate')
//                 localStorage.removeItem('EndFilterDate')
//                 localStorage.removeItem('DistributorId')
//             })
//         } catch (error) {
//             console.error("API error:", error);
//         }
//     }

//     // const handleChecked = async (ItemId) => {
//     //     setSelectedItem(
//     //         (prevSelected) => prevSelected.includes(ItemId) ? prevSelected.filter(id => id !== ItemId)
//     //             : [...prevSelected, ItemId]);
//     //     let data = new FormData();
//     //     data.append("id", ItemId);

//     //     try {
//     //         await axios.post("purchase-return-iteam-select", data, {
//     //             headers: {
//     //                 Authorization: `Bearer ${token}`,
//     //             },
//     //         }
//     //         ).then((response) => {
//     //             //console.log(response.data, "data item select")
//     //             purcheseReturnFilter()
//     //             // setIsLoading(false)
//     //         })
//     //     } catch (error) {
//     //         console.error("API error:", error);
//     //     }
//     // }
//     const handleChecked = async (itemId, checked) => {
//         let data = new FormData();
//         data.append("id", itemId);
//         try {
//             const response = await axios.post("purchase-return-iteam-select", data, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });
//             if (response.data) {
//                 setSelectedItem((prevSelected) => {
//                     if (checked) {
//                         return [...prevSelected, itemId];
//                     } else {
//                         return prevSelected.filter((id) => id !== itemId);
//                     }
//                 });
//                 const allSelected = returnItemList?.item_list.every(item => item.iss_check) || false;
//                 // setSelectAll(allSelected);
//                 purcheseReturnFilter();
//             }
//         } catch (error) {
//             console.error("API error:", error);
//         }
//     };
//     const handleSelectAll = async (checked) => {
//         for (let i = 0; i < returnItemList?.item_list?.length; i++) {
//             handleChecked(returnItemList?.item_list[i].id, checked);
//         }
//     };

//     const handleEditItem = async () => {
//         let data = new FormData();
//         data.append('purches_return_id', selectedEditItemId)
//         data.append('iteam_id', itemPurchaseId)
//         data.append("batch", batch)
//         data.append("exp_dt", expiryDate)
//         data.append("mrp", mrp)
//         data.append("ptr", ptr)
//         data.append("fr_qty", free)
//         data.append("qty", qty)
//         data.append("disocunt", disc)
//         data.append('gst', gst.id)
//         data.append('location', loc)
//         data.append('amount', ItemTotalAmount)
//         data.append("weightage", unit)
//         const params = {
//             id: selectedEditItemId
//         };
//         try {
//             const response = await axios.post("purches-return-edit-iteam?", data, {
//                 params: params,
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             })
//             //console.log("response", response);
//             setIsDeleteAll(true);
//             purcheseReturnFilter();
//             setSearchItem('');
//             setUnit('')
//             setBatch('')
//             setExpiryDate('');
//             setMRP('')
//             setQty('')
//             setFree('')
//             setPTR('')
//             setGst('')
//             setDisc('')
//             setBatch('')
//             setLoc('')
//             setItemTotalAmount(0);
//         }
//         catch (e) {
//             //console.log(e)
//         }
//     }

//     // const handleOtherAmount = (event) => {
//     //     let value = parseFloat(event.target.value) || "";
//     //     if (value < -finalAmount) {
//     //         value = -finalAmount;
//     //     }
//     //     setOtherAmt(value);
//     //     const x = value + parseInt(finalAmount)
//     //     setNetAmount(x);
//     //     //console.log("xx", x);
//     // };

//     const handleOtherAmount = (event) => {
//         let value = parseFloat(event.target.value) || "";
//         console.log(value, 'value')
//         if (value < -finalAmount) {
//             value = -finalAmount;
//         }
//         setOtherAmount(value);
//         // console.log("xx", x);
//     };

//     return (
//         <>
//             <Header />
//             <ToastContainer
//                 position="top-right"
//                 autoClose={5000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//             />
//             {isLoading ? <div className="loader-container ">
//                 <Loader />
//             </div> :
//                 <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 75px)', padding: "0px 20px 0px" }} >
//                     <div>
//                         <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
//                             <div style={{ display: 'flex', flexWrap: 'wrap', width: '600px', gap: '7px' }}>
//                                 <span style={{ color: 'rgba(12, 161, 246, 1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px', cursor: "pointer" }} onClick={() => history.push('/purchase/return')}>Purchase</span>
//                                 <ArrowForwardIosIcon style={{ fontSize: '18px', marginTop: '10px', alignItems: 'center', color: "rgba(4, 76, 157, 1)" }} />
//                                 <span className='hover:text-blue-900' style={{ color: '#044c9d', display: 'flex', alignItems: 'center', fontWeight: 600, fontSize: '18px', cursor: "pointer" }} onClick={() => history.push('/purchase/return')} >Purchase Return</span>
//                                 <ArrowForwardIosIcon style={{ fontSize: '18px', marginTop: '10px', alignItems: 'center', color: "rgba(4, 76, 157, 1)" }} />
//                                 <span className='darkblue_text' style={{ display: 'flex', alignItems: 'center', alignItems: 'center', fontWeight: 600, fontSize: '18px' }}>New </span>
//                                 <BsLightbulbFill className="mt-1 w-6 h-6 sky_text hover-yellow" />
//                             </div>
//                             <div className="headerList">
//                                 <Select
//                                     labelId="dropdown-label"
//                                     id="dropdown"
//                                     value={paymentType}
//                                     sx={{ minWidth: '200px' }}
//                                     onChange={(e) => { setPaymentType(e.target.value) }}
//                                     size="small"
//                                 >
//                                     <MenuItem value="cash">Cash</MenuItem>
//                                     <MenuItem value="credit">Credit</MenuItem>
//                                     {bankData?.map(option => (
//                                         <MenuItem key={option.id} value={option.id}>{option.bank_name}</MenuItem>
//                                     ))}
//                                 </Select>
//                                 <Button variant="contained" style={{ background: "rgb(4, 76, 157)" }} onClick={handleSubmit}>Save</Button>
//                             </div>
//                         </div>
//                         <div className="bg-white">
//                             <div className="firstrow flex">
//                                 <div className="detail">
//                                     <span className="title mb-2">Distributor</span>
//                                     <Autocomplete
//                                         value={distributor}
//                                         sx={{
//                                             width: '100%',
//                                             minWidth: '300px',
//                                             '@media (max-width:600px)': {
//                                                 minWidth: '250px',
//                                             },
//                                         }}
//                                         size='small'
//                                         onChange={(e, value) => setDistributor(value)}
//                                         options={distributorList}
//                                         getOptionLabel={(option) => option.name}
//                                         renderInput={(params) => <TextField {...params} />}
//                                     />
//                                     {error.distributor && <span style={{ color: 'red', fontSize: '12px' }}>{error.distributor}</span>}
//                                     {errors.distributor && <span style={{ color: 'red', fontSize: '12px' }}>{errors.distributor}</span>}
//                                 </div>
//                                 <div className="detail">
//                                     <span className="title mb-2">Bill Date</span>
//                                     <div>
//                                         <DatePicker
//                                             className='custom-datepicker '
//                                             selected={selectedDate}
//                                             onChange={(newDate) => setSelectedDate(newDate)}
//                                             dateFormat="dd/MM/yyyy"
//                                             filterDate={(date) => !isDateDisabled(date)}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="detail">
//                                     <span className="title mb-2">Bill No</span>
//                                     <TextField
//                                         id="outlined-number"
//                                         type='number'
//                                         size="small"
//                                         sx={{ width: '150px' }}
//                                         value={billNo}
//                                         disabled
//                                     />
//                                     {error.billNo && <span style={{ color: 'red', fontSize: '12px' }}>{error.billNo}</span>}


//                                 </div>
//                                 <div className="detail">
//                                     <span className="title mb-2">Start Date</span>
//                                     <div >
//                                         <DatePicker
//                                             className='custom-datepicker '
//                                             selected={startDate}
//                                             error={!!errors.startDate}
//                                             onChange={(newDate) => setStartDate(newDate)}
//                                             dateFormat="MM/yyyy"
//                                             showMonthYearPicker
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="detail">
//                                     <span className="title mb-2">End Date</span>
//                                     <div >
//                                         <DatePicker
//                                             className='custom-datepicker '
//                                             selected={endDate}
//                                             onChange={(newDate) => setEndDate(newDate)}
//                                             dateFormat="MM/yyyy"
//                                             showMonthYearPicker
//                                         />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <Button
//                                         variant="contained"
//                                         size="small"
//                                         style={{
//                                             minHeight: '38px',
//                                             alignItems: "center",
//                                             marginTop: "24px",
//                                             background: "rgba(4, 76, 157, 1)"
//                                         }}
//                                         onClick={() => filterData(searchItem)}
//                                     >
//                                         <FilterAltIcon size='large' style={{ color: "white", fontSize: '20px' }} /> Filter
//                                     </Button>
//                                 </div>
//                                 <div>
//                                 </div>
//                                 <div>
//                                 </div>
//                             </div>
//                             <div className='firstrow flex' style={{ paddingTop: "0" }}>
//                                 <div className="detail">
//                                     <span className="title mb-2">Remark</span>
//                                     <TextField
//                                         id="outlined-number"
//                                         size="small"
//                                         sx={{
//                                             width: '100%',
//                                             minWidth: '300px',
//                                             '@media (max-width:600px)': {
//                                                 minWidth: '250px',
//                                             },
//                                         }}
//                                         value={remark}
//                                         onChange={(e) => { setRemark(e.target.value) }}
//                                     />
//                                 </div>
//                             </div>
//                             <div className='overflow-x-auto mt-4 '>
//                                 <table className="w-full border-collapse custom-table">
//                                     <thead>
//                                         <tr>
//                                             <th >Item Name</th>
//                                             <th >Unit</th>
//                                             <th >Batch  </th>
//                                             <th >Expiry </ th>
//                                             <th >MRP  </th>
//                                             <th >Qty. </th>
//                                             <th >Free </th>
//                                             <th >PTR </ th>
//                                             <th >CD%</th>
//                                             <th >GST%  </th>
//                                             <th >Loc.</th>
//                                             <th >Amount </th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {returnItemList.length === 0 ? (
//                                             <tr>
//                                                 <td colSpan={12} style={{ textAlign: 'center', fontSize: '16px', fontWeight: 600 }}>No record found</td>
//                                             </tr>
//                                         ) : (<>
//                                             <tr>
//                                                 <td style={{ width: '500px' }}>
//                                                     <div >
//                                                         <DeleteIcon className='delete-icon' onClick={removeItem}
//                                                         />
//                                                         {searchItem}
//                                                     </div>
//                                                 </td>
//                                                 <td>
//                                                     <TextField
//                                                         id="outlined-number"
//                                                         type="number"
//                                                         // inputRef={inputRef1}
//                                                         // onKeyDown={handleKeyDown}
//                                                         size="small"
//                                                         error={!!errors.unit}
//                                                         value={unit}
//                                                         sx={{ width: '80px' }}
//                                                         onChange={(e) => { setUnit(e.target.value) }}
//                                                     />
//                                                 </td>
//                                                 <td>


//                                                     <TextField
//                                                         id="outlined-number"
//                                                         type="number"
//                                                         // inputRef={inputRef1}
//                                                         // onKeyDown={handleKeyDown}
//                                                         size="small"
//                                                         disabled
//                                                         error={!!errors.batch}
//                                                         value={batch}
//                                                         sx={{ width: '80px' }}
//                                                         onChange={(e) => { setBatch(e.target.value) }}
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <TextField
//                                                         id="outlined-number"
//                                                         disabled
//                                                         size="small"
//                                                         sx={{ width: '100px' }}
//                                                         // inputRef={inputRef3}
//                                                         // onKeyDown={handleKeyDown}
//                                                         error={!!errors.expiryDate}
//                                                         value={expiryDate}
//                                                         onChange={handleExpiryDateChange}
//                                                         placeholder="MM/YY"
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <TextField
//                                                         id="outlined-number"
//                                                         type="number"
//                                                         sx={{ width: '100px' }}
//                                                         size="small"
//                                                         disabled
//                                                         // inputRef={inputRef4}
//                                                         // onKeyDown={handleKeyDown}
//                                                         error={!!errors.mrp}
//                                                         value={mrp}
//                                                         onChange={(e) => { setMRP(e.target.value) }}
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <TextField
//                                                         id="outlined-number"
//                                                         type="number"
//                                                         sx={{ width: '100px' }}
//                                                         size="small"
//                                                         // inputRef={inputRef5}
//                                                         // onKeyDown={handleKeyDown}
//                                                         error={!!errors.qty}
//                                                         value={qty}
//                                                         onChange={(e) => { setQty(e.target.value) }}
//                                                     />


//                                                 </td>
//                                                 <td>
//                                                     <TextField
//                                                         id="outlined-number"
//                                                         size="small"
//                                                         type="number"
//                                                         sx={{ width: '100px' }}
//                                                         value={free}
//                                                         // inputRef={inputRef6}
//                                                         // onKeyDown={handleKeyDown}
//                                                         error={!!errors.free}
//                                                         onChange={(e) => { setFree(e.target.value) }}
//                                                     />


//                                                 </td>
//                                                 <td>
//                                                     <TextField
//                                                         id="outlined-number"
//                                                         type="number"
//                                                         sx={{ width: '100px' }}
//                                                         size="small"
//                                                         // inputRef={inputRef7}
//                                                         // onKeyDown={handleKeyDown}
//                                                         value={ptr}
//                                                         error={!!errors.ptr}
//                                                         onChange={(e) => setPTR(e.target.value)}
//                                                     />
//                                                 </td>
//                                                 <td>
//                                                     <TextField
//                                                         id="outlined-number"
//                                                         sx={{ width: '100px' }}
//                                                         size="small"
//                                                         type="number"
//                                                         // inputRef={inputRef8}
//                                                         // onKeyDown={handleKeyDown}
//                                                         value={disc}
//                                                         error={!!errors.disc}
//                                                         onChange={handleSchAmt} />
//                                                 </td>
//                                                 <td>
//                                                     <Select
//                                                         labelId="dropdown-label"
//                                                         id="dropdown"
//                                                         value={gst.name}
//                                                         sx={{ minWidth: '80px' }}
//                                                         onChange={(e) => {
//                                                             const selectedOption = gstList.find(option => option.name === e.target.value);
//                                                             setGst(selectedOption);
//                                                         }}
//                                                         size="small"
//                                                         displayEmpty
//                                                         error={!!errors.gst}
//                                                     >
//                                                         {gstList.map(option => (
//                                                             <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
//                                                         ))}
//                                                     </Select>
//                                                 </td>
//                                                 <td>
//                                                     <TextField
//                                                         id="outlined-number"
//                                                         // inputRef={inputRef12}
//                                                         // onKeyDown={handleKeyDown}
//                                                         size="small"
//                                                         value={loc}
//                                                         error={!!errors.loc}
//                                                         sx={{ width: '100px' }}
//                                                         onChange={(e) => { setLoc(e.target.value) }}
//                                                     />
//                                                 </td>
//                                                 <td className="total"><span>{ItemTotalAmount}</span></td>
//                                             </tr>
//                                             <tr >
//                                                 <td>
//                                                     <TextField
//                                                         id="outlined-basic"
//                                                         size="small"
//                                                         sx={{ width: "75%", marginTop: "5px" }}
//                                                         value={searchQuery}
//                                                         onChange={handleInputChange}
//                                                         variant="outlined"
//                                                         placeholder="Please search any items.."
//                                                         InputProps={{
//                                                             endAdornment: (
//                                                                 <InputAdornment position="start">
//                                                                     <SearchIcon />
//                                                                 </InputAdornment>
//                                                             ),
//                                                             type: "search",
//                                                         }}
//                                                     />
//                                                 </td>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td></td>
//                                                 <td><Button variant="contained" color="success" onClick={EditReturn}><ControlPointIcon />Update</Button>
//                                                 </td>
//                                             </tr>

//                                             {/* all select */}
//                                             {/* {returnItemList?.item_list?.length > 0 && (
//                                                 <Checkbox
//                                                     checked={returnItemList?.item_list?.every(item => item.iss_check)}
//                                                     onChange={(event) => handleSelectAll(event.target.checked)}
//                                                 />
//                                             )} */}
//                                             {returnItemList?.item_list.map(item => (
//                                                 <tr key={item.id} className="item-List" onClick={() => handleEditClick(item)} >
//                                                     <td style={{
//                                                         display: 'flex', gap: '8px', alignItems: 'center'
//                                                     }}>
//                                                         <td>
//                                                             <Checkbox
//                                                                 // key={item.id}
//                                                                 checked={item?.iss_check}
//                                                                 onChange={(event) => handleChecked(item.id, event.target.checked)}
//                                                             />
//                                                         </td>
//                                                         < BorderColorIcon color="primary" />
//                                                         <DeleteIcon className='delete-icon' onClick={() => deleteOpen(item.id)} />{item.item_name}
//                                                     </td>
//                                                     <td>{item.weightage}</td>
//                                                     <td>{item.batch_number}</td>
//                                                     <td>{item.expiry}</td>
//                                                     <td>{item.mrp}</td>
//                                                     <td>{item.qty}</td>
//                                                     <td>{item.fr_qty}</td>
//                                                     <td>{item.ptr}</td>
//                                                     <td>{item.disocunt}</td>
//                                                     <td>{item.gst_name}</td>
//                                                     <td>{item.location}</td>
//                                                     <td>{item.amount}</td>
//                                                 </tr>
//                                             ))}
//                                             < tr >
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal">Total</td>
//                                                 <td className="amounttotal">{finalAmount}</td>
//                                             </tr>
//                                             <tr>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal">Other Amount</td>
//                                                 <td className="amounttotal">
//                                                     <TextField
//                                                         id="outlined-number"
//                                                         size="small"
//                                                         // value={otherAmt}
//                                                         value={otherAmount}
//                                                         type="number"
//                                                         sx={{ width: '100px' }}
//                                                         onChange={handleOtherAmount}
//                                                     />
//                                                 </td>
//                                             </tr>
//                                             <tr>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal">Round Off</td>
//                                                 <td className="amounttotal">

//                                                     {roundOff < 0.49 ? `-${roundOff}` : parseFloat(1 - roundOff)?.toFixed(2)}

//                                                 </td>
//                                             </tr>
//                                             <tr>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal"></td>
//                                                 <td className="amounttotal">Net Amount</td>
//                                                 {/* <td className="amounttotal">{netAmount ? parseInt(Number(netAmount).toFixed(2)) : 0} */}
//                                                 <td className="amounttotal">{netAmount}

//                                                 </td>
//                                             </tr>
//                                         </>
//                                         )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div >
//                 </div >
//             }
//             <Dialog open={open}>
//                 <DialogContent style={{ fontSize: '20px', }}>
//                     <h2>Please select Return Type.</h2>
//                 </DialogContent>
//                 <DialogActions style={{ display: 'flex', justifyContent: 'space-around' }}>
//                     <Button onClick={() => setOpen(false)} variant="contained">
//                         OK !
//                     </Button>
//                 </DialogActions>
//             </Dialog>
//             {/* Delete PopUP */}
//             <div id="modal" value={IsDelete}
//                 className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${IsDelete ? "block" : "hidden"
//                     }`}>
//                 <div />
//                 <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
//                     <svg xmlns="http://www.w3.org/2000/svg"
//                         className="w-6 h-6 cursor-pointer absolute top-4 right-4 fill-current text-gray-600 hover:text-red-500 "
//                         viewBox="0 0 24 24" onClick={() => setIsDelete(false)}>
//                         <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" />
//                     </svg>
//                     <div className="my-4 text-center">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="w-12 fill-red-500 inline" viewBox="0 0 24 24">
//                             <path
//                                 d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
//                                 data-original="#000000" />
//                             <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
//                                 data-original="#000000" />
//                         </svg>
//                         <h4 className="text-lg font-semibold mt-6">Are you sure you want to delete it?</h4>
//                     </div>
//                     <div className="flex gap-5 justify-center">
//                         <button type="submit"
//                             className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-red-500 hover:bg-red-600 active:bg-red-500"
//                             onClick={() => handleDeleteItem(ItemId)}
//                         >Delete</button>
//                         <button type="button"
//                             className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
//                             onClick={() => setIsDelete(false)}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             </div>
//             <div
//                 id="modal"
//                 value={isOpenBox}
//                 className={`fixed inset-0 p-4 flex flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif] ${isOpenBox ? "block" : "hidden"}`}
//             >
//                 <div />
//                 <div className="w-full max-w-md bg-white shadow-lg rounded-md p-4 relative">
//                     <div className="my-4 logout-icon">
//                         <VscDebugStepBack className=" h-12 w-14" style={{ color: "#628A2F" }} />
//                         <h4 className="text-lg font-semibold mt-6 text-center">Are you sure you want to leave this page ?</h4>
//                     </div>
//                     <div className="flex gap-5 justify-center">
//                         <button
//                             type="submit"
//                             className="px-6 py-2.5 w-44 items-center rounded-md text-white text-sm font-semibold border-none outline-none bg-blue-600 hover:bg-blue-600 active:bg-blue-500"
//                             onClick={handleLogout}
//                         >
//                             Yes
//                         </button>
//                         <button
//                             type="button"
//                             className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-400 hover:text-black"
//                             onClick={LogoutClose}
//                         >
//                             No
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }
// export default AddReturnbill



