import { useEffect, useRef, useState } from "react";
import Header from "../../../Header"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { Button, Checkbox, Input, ListItemText, TextField } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import dayjs from 'dayjs';
import { MenuItem, Select } from '@mui/material';
import { BsLightbulbFill } from "react-icons/bs";
import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import DeleteIcon from '@mui/icons-material/Delete';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useParams } from 'react-router-dom';
import Loader from "../../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { Prompt } from "react-router-dom/cjs/react-router-dom";
import { VscDebugStepBack } from "react-icons/vsc";
import { IoMdClose } from "react-icons/io";
import { FaCaretUp } from "react-icons/fa6";
import { Modal } from "flowbite-react";

const EditSaleReturn = () => {
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
    const history = useHistory();
    const paymentOptions = [
        { id: 1, label: 'Cash' },

        { id: 3, label: 'UPI' },]
    const [customer, setCustomer] = useState(null)

    const [isVisible, setIsVisible] = useState(true);
    const { id, randomNumber } = useParams();
    const [selectedEditItem, setSelectedEditItem] = useState(null);
    const [saleItemId, setSaleItemId] = useState(null);
    const [address, setAddress] = useState('');
    const [doctor, setDoctor] = useState('')
    const [error, setError] = useState({ customer: '' });
    const [expiryDate, setExpiryDate] = useState('');
    const [mrp, setMRP] = useState('');
    const [qty, setQty] = useState('');
    const [tempQty, setTempQty] = useState('')
    const [selectedItem, setSelectedItem] = useState([]);
    const [randomNum, setRandomNum] = useState('')

    const [gst, setGst] = useState('');
    const [batch, setBatch] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customerDetails, setCustomerDetails] = useState([])
    const [pickup, setPickup] = useState(1)
    const [doctorData, setDoctorData] = useState([])
    const [searchItemID, setSearchItemID] = useState(null);
    const [order, setOrder] = useState('');
    const [loc, setLoc] = useState('')
    const [base, setBase] = useState('')
    const tableRef = useRef(null);
    const [unit, setUnit] = useState('')
    const [totalAmount, setTotalAmount] = useState(0)
    const [itemAmount, setItemAmount] = useState(0);
    const [selectedEditItemId, setSelectedEditItemId] = useState(null);
    const [IsDelete, setIsDelete] = useState(false);
    let defaultDate = new Date()
    const [searchItem, setSearchItem] = useState('')
    const [saleReturnItems, setSaleReturnItems] = useState([]);
    defaultDate.setDate(defaultDate.getDate() + 3)
    const [cgst, setCgst] = useState('')
    const [sgst, setSgst] = useState('')
    const [igst, setIgst] = useState('')
    const [totalBase, setTotalBase] = useState(0);
    const [totalGst, setTotalGst] = useState('');
    const [totalMargin, setTotalMargin] = useState(0);
    const [totalNetRate, setTotalNetRate] = useState(0);
    const [marginNetProfit, setMarginNetProfit] = useState(0);

    const [netAmount, setNetAmount] = useState(0)
    const [roundOff, setRoundOff] = useState(0)

    const [finalDiscount, setFinalDiscount] = useState(0)
    const [otherAmt, setOtherAmt] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const [bankData, setBankData] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [unsavedItems, setUnsavedItems] = useState(false);
    const [nextPath, setNextPath] = useState("");
    const [uniqueId, setUniqueId] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    useEffect(() => {
        const totalAmount = qty / unit;
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

    useEffect(() => {
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
        const initializeData = async () => {
            const doctorData = await ListOfDoctor();
            const customerData = await customerAllData();
            await saleBillGetBySaleID(doctorData, customerData);
        };
        initializeData();
        BankList();
    }, []);

    useEffect(() => {
        if (selectedEditItem) {
            setSearchItem(selectedEditItem.iteam_name)
            setSearchItemID(selectedEditItem.item_id)
            setUnit(selectedEditItem.unit);
            setBatch(selectedEditItem.batch);
            setExpiryDate(selectedEditItem.exp);
            setMRP(selectedEditItem.mrp);
            setQty(selectedEditItem.qty);
            setBase(selectedEditItem.base);
            setOrder(selectedEditItem.order)
            setGst(selectedEditItem.gst);
            setLoc(selectedEditItem.location);
            setItemAmount(selectedEditItem.net_rate);
        }

    }, [selectedEditItem]);

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
    const saleBillGetBySaleID = async (doctorData, customerData) => {
        let data = new FormData();
        data.append("id", id);
        const params = {
            id: id,
        };
        try {
            const response = await axios.post("sales-return-edit-details?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const record = response.data.data;

            // setCustomer(response.data.data.customer_name)
            const foundCustomer = customerData.find(
                (option) => option.name === record.customer_name
            );
            setCustomer(foundCustomer || '');
            // const foundCustomer = customerData.find(
            //     (option) => option.name === record.customer_name
            // );
            // setCustomer(foundCustomer || "");

            setSaleReturnItems(response.data.data);
            setTotalBase(response.data.data.total_base)
            setTotalMargin(response.data.data.total_margin)
            setTotalNetRate(response.data.data.total_net_rate)
            setMarginNetProfit(response.data.data.margin_net_profit)
            setSgst(response.data.data.sgst)
            setIgst(response.data.data.igst)
            setCgst(response.data.data.cgst)
            setAddress(response.data.data.customer_name)
            setTotalAmount(response.data.data.sales_amount)
            setTotalGst(response.data.data.total_gst)

            const salesItem = response.data.data.sales_iteam;
            if (salesItem && salesItem.length > 0) {
                setRandomNum(salesItem[0].random_number)
            }

            // const foundCustomer = customerData.find(option => option.id == record.customer_id);
            // setCustomer(foundCustomer);
            if (record.doctor_name && record.doctor_name !== "-") {
                // Find the doctor in doctorData
                const foundDoctor = doctorData.find(
                    (option) => option.name === record.doctor_name
                );
                // If a doctor is found, set it, otherwise set doctor to null
                setDoctor(foundDoctor || "");
            } else {
                // If doctor_name is "-" or missing, set doctor to ""
                setDoctor("");
            }
            setNetAmount((response.data.data.net_amount))

            setOtherAmt((response.data.data.other_amount))
        } catch (error) {
            console.error("API error fetching purchase data:", error);
            setIsLoading(false);
        }
    }

    const ListOfDoctor = async () => {
        let data = new FormData();
        setIsLoading(true);
        try {
            const response = await axios.post("doctor-list", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const doctorData = response.data.data;
            setDoctorData(response.data.data);
            setDoctor(response.data.data[0] || null)

            setIsLoading(false);
            return doctorData;
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);

            return [];
        }
    }

    const customerAllData = async () => {
        let data = new FormData();
        setIsLoading(true);
        try {
            const response = await axios.post("list-customer", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // setCustomerDetails(customerData);
            const customerData = response.data.data;
            setCustomerDetails(response.data.data);
            setCustomer(response.data.data[0] || '');


            setIsLoading(false);
            return customerData;
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);

            return [];
        }
    }

    const editSaleReturnBill = async () => {

        const hasUncheckedItems = saleReturnItems?.sales_iteam?.every(item => item.iss_check === false)
        if (hasUncheckedItems) {
            toast.error('Please select at least one item');;

        } else {
            let data = new FormData();
            data.append("bill_no", saleReturnItems?.bill_no);
            data.append("bill_date", saleReturnItems?.bill_date)
            data.append("customer_id", customer?.id);
            data.append("customer_address", address)
            data.append("customer_name", customer.name)
            data.append("doctor_id", doctor?.id || '');
            data.append('mrp_total', totalAmount)
            data.append('total_discount', finalDiscount)
            data.append('other_amount', otherAmt)
            data.append('net_amount', netAmount)
            data.append('total_base', totalBase)
            data.append('total_gst', totalGst)
            data.append('igst', igst)
            data.append('cgst', cgst)
            data.append('sgst', sgst)
            data.append('round_off', roundOff)
            data.append('net_rate', totalNetRate)
            data.append('margin', totalMargin)
            data.append('margin_net_profit', marginNetProfit)
            data.append('payment_name', paymentType)
            data.append('product_list', JSON.stringify(saleReturnItems?.sales_iteam))

            const params = {
                id: id
            }
            try {
                await axios.post("sales-return-update", data, {
                    params: params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                ).then((response) => {
                    setUnsavedItems(false);
                    toast.success(response.data.message);
                    localStorage.removeItem("RandomNumber");
                    setTimeout(() => {
                        history.push('/saleReturn/list');
                    }, 2000);
                })
            } catch (error) {
                console.error("API error:", error);

            }
        }
    }

    const editSaleReturnItem = async () => {
        setUnsavedItems(true);
        localStorage.setItem('RandomNumber', randomNumber)

        let data = new FormData();
        data.append('item_id', searchItemID)
        data.append("qty", qty)
        data.append("exp", expiryDate)
        data.append('gst', gst)
        data.append("mrp", mrp)
        data.append("unit", unit);
        data.append("random_number", randomNumber);
        // data.append("random_number", localStorage.getItem('RandomNumber'));
        data.append("unit", unit)
        data.append("batch", batch)
        data.append('location', loc)
        data.append("base", base)
        data.append('amt', itemAmount)
        data.append('net_rate', itemAmount)
        data.append("order", order)
        const params = {
            id: selectedEditItemId
        };

        try {
            await axios.post("sales-return-edit-iteam-second?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {

                saleBillGetBySaleID();
                setSearchItem(null)
                setUnit('')
                setBatch('')
                setExpiryDate('');
                setMRP('')
                setQty(0)
                setBase('')
                setGst('')
                setBatch('')
                setLoc('')
            })

        }
        catch (e) {
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

    useEffect(() => {
        const unsaved = localStorage.getItem("unsavedEditReturnItems");
        if (unsaved === "true") {
            setUnsavedItems(true);
        }
    }, []);

    const handleUpdate = () => {
        setUnsavedItems(false);

        const newErrors = {};
        if (!customer) {
            newErrors.customer = 'Please select customer';
        }
        setError(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }
        editSaleReturnBill();
    }

    const handleDoctorOption = (event, newValue) => {
        setDoctor(newValue);
    };



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
        setQty(0)
        setOrder('')
        setLoc('');
        setItemAmount(0)
        if (isNaN(itemAmount)) {
            setItemAmount(0);
        }
    }

    const handleDeleteItem = async (saleItemId) => {
        if (!saleItemId) return;
        let data = new FormData();
        data.append("id", saleItemId ? saleItemId : '');
        const params = {
            id: saleItemId
        };
        try {
            await axios.post("sales-return-edit-iteam-delete?", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                saleBillGetBySaleID();
                setIsDelete(false);
            })
        } catch (error) {
            console.error("API error:", error);

        }
    }

    const handleChecked = async (itemId, checked) => {
        let data = new FormData();
        setUnsavedItems(true);
        data.append("id", itemId ? itemId : '');
        data.append("type", 0);

        try {
            const response = await axios.post("sales-return-iteam-select", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data) {
                // Toggle the selected item's iss_check state
                setSelectedItem((prevSelected) => {
                    // Check if the item is already in the selected list
                    if (checked) {
                        return [...prevSelected, itemId]; // Add item to selected
                    } else {
                        return prevSelected.filter((id) => id !== itemId); // Remove item from selected
                    }
                });

                // Optionally, update the state of the item to reflect the checked state
                saleReturnItems.sales_iteam = saleReturnItems.sales_iteam.map(item => {
                    if (item.id === itemId) {
                        item.iss_check = checked; // Toggle the checkbox state
                    }
                    return item;
                });
            }
        } catch (error) {
            console.error("API error:", error);

        }
    };



    const handleEditClick = (item) => {

        const existingItem = uniqueId.find((obj) => obj.id === item.id);

        if (!existingItem) {
            setUniqueId((prevUniqueIds) => [...prevUniqueIds, { id: item.id, qty: item.qty }]);
            setTempQty(item.qty);
        } else {
            setTempQty(existingItem.qty);

        }

        setSelectedEditItem(item);
        setSelectedEditItemId(item.id);

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



    const handleNavigation = (path) => {
        setOpenModal(true);
        setNextPath(path);
    };

    const handleLeavePage = async () => {
        let data = new FormData();
        data.append("id", id); // Append `id` to the FormData object
        data.append('random_number', randomNum)
        setOpenModal(false); // Close the modal
        setUnsavedItems(false)
        localStorage.removeItem("unsavedItems");

        try {

            // Wait for the response from the server
            const response = await axios.post("sales-return-edit-history", data, {
                // params, // Uncomment if `random_number` is required in the request
                headers: { Authorization: `Bearer ${token}` },
            });

            // Check for a successful response
            if (response.status === 200) {
                setOpenModal(false); // Close the modal
                setUnsavedItems(false); // Mark items as saved
                history.replace(nextPath); // Redirect to the next page
            }
        } catch (error) {
            console.error("Error deleting items:", error);

            // Optional: Provide user feedback if there’s an error
            alert("Failed to save changes. Please try again.");
        }
    };



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
                <div>
                    <div style={{ height: 'calc(100vh - 120px)', padding: "0px 20px 0px", overflow: 'auto' }} >
                        <div>
                            <div className='py-3 header_sale_divv' style={{ display: 'flex', gap: '4px', alignItems: "center" }}>
                                <div style={{ display: 'flex', gap: '5px', alignItems: "center" }}>
                                    <span className="cursor-pointer" style={{ color: 'var(--color2)', alignItems: 'center', fontWeight: 700, fontSize: '20px', minWidth: "125px" }} onClick={() => { history.push('/saleReturn/list') }} >Sales Return</span>
                                    <ArrowForwardIosIcon style={{ fontSize: '18px', color: "var(--color1)" }} />
                                    <span style={{ color: 'var(--color1)', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>Edit </span>
                                    <ArrowForwardIosIcon style={{ fontSize: '18px', color: "var(--color1)" }} />
                                    <BsLightbulbFill className="w-6 h-6 secondary hover-yellow" />
                                </div>

                                <div className="headerList">
                                    <Select
                                        labelId="dropdown-label"
                                        className="payment_divv"
                                        id="dropdown"
                                        disabled
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
                                    <Button variant="contained" className="payment_btn_divv" style={{ background: "var(--color1)" }} onClick={handleUpdate}> Update</Button>
                                </div>
                            </div>
                            <div className="border-b">
                                <div className="firstrow flex">
                                    <div className="detail mt-1 custommedia" style={{ width: '250px' }}>
                                        <div className="detail  p-2 rounded-md" style={{ background: "var(--color1)", width: "100%" }} >
                                            <div className="heading" style={{ color: 'white', fontWeight: "500", alignItems: "center", marginLeft: "15px" }}>Bill No <span style={{ marginLeft: '35px' }}> Bill Date</span> </div>
                                            <div className="flex gap-5">
                                                <div style={{ color: 'white', fontWeight: "500", alignItems: "center", marginTop: '8px', marginLeft: "15px", fontWeight: "bold", width: '19%' }}>{saleReturnItems.bill_no}  </div>
                                                <div style={{ color: 'white', fontWeight: "500", alignItems: "center", marginTop: '8px', fontWeight: "bold" }}>|</div>
                                                <div style={{ color: 'white', fontWeight: "500", alignItems: "center", marginTop: '8px', fontWeight: "bold" }}>{saleReturnItems.bill_date}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail custommedia" style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                        <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "var(--color1)" }}>Customer Mobile / Name</span>

                                        <Autocomplete
                                            value={customer}
                                            options={customerDetails}
                                            disabled
                                            getOptionLabel={(option) => option.name || ''}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            sx={{
                                                width: '100%',
                                                // minWidth: '400px',
                                                '& .MuiInputBase-root': {
                                                    // height: 20,
                                                    fontSize: '1.10rem',
                                                },
                                                '& .MuiAutocomplete-inputRoot': {
                                                    padding: '10px 14px',
                                                },
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
                                                    value={customer}

                                                    variant="outlined"
                                                    placeholder="Search by Mobile, Name"
                                                    InputProps={{
                                                        ...params.InputProps,
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
                                        {/* <input
                                            labelId="dropdown-label"
                                            id="dropdown"
                                            value={customer}
                                            sx={{
                                                width: "100%",
                                                minWidth: {
                                                    xs: "320px",
                                                    sm: "400px",
                                                },
                                                "& .MuiInputBase-root": {
                                                    height: 20,
                                                    fontSize: "1.10rem",
                                                },
                                                "& .MuiAutocomplete-inputRoot": {
                                                    padding: "10px 14px",
                                                },
                                            }}
                                            disabled
                                            size="small"
                                            className="Payment_Value"
                                            style={{ height: "100%" }}
                                        >
                                        </input> */}
                                        {error.customer && <span style={{ color: 'red', fontSize: '14px' }}>{error.customer}</span>}
                                    </div>
                                    {/* <div className="detail">
                                        <span className="heading mb-2" style={{ fontWeight: "500", fontSize: "17px", color: "var(--color1)" }}>Address</span>

                                        <TextField
                 autoComplete="off" id="outlined-basic"
                                            value={address}
                                            onChange={(e) => { setAddress(e.target.value) }}
                                            sx={{
                                                width: 300,
                                                '& .MuiInputBase-root': {
                                                    height: 45,
                                                    fontSize: '1.25rem',
                                                },
                                                '& .MuiAutocomplete-inputRoot': {
                                                    padding: '10px 14px',
                                                },
                                            }} variant="outlined" />
                                    </div> */}

                                    <div className="detail custommedia" style={{ display: 'flex', width: '100%' }}>
                                        <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "var(--color1)", whiteSpace: "nowrap" }}>Doctor </span>
                                        <Autocomplete
                                            value={doctor || ''}
                                            onChange={handleDoctorOption}
                                            options={doctorData}
                                            // disabled
                                            getOptionLabel={(option) => option.name || ''}
                                            isOptionEqualToValue={(option, value) => option.name === value.name}
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
                                                // '@media (max-width:600px)': {
                                                //     minWidth: '300px',
                                                // },
                                            }}
                                            renderOption={(props, option) => (
                                                <ListItem {...props}>
                                                    <ListItemText
                                                        primary={`${option.name} `}
                                                        secondary={`Clinic Name: ${option.clinic} `}
                                                    />
                                                </ListItem>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    autoComplete="off"
                                                    {...params}
                                                    variant="outlined"
                                                    placeholder="Search by DR. Name"
                                                    InputProps={{
                                                        ...params.InputProps,
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
                                    <div>
                                    </div>

                                    <div className="scroll-two">
                                        <table className="saleTable">
                                            <thead>
                                                <tr style={{ borderBottom: '1px solid lightgray', background: 'rgba(63, 98, 18, 0.09)' }}>
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
                                                <tr style={{ borderBottom: '1px solid lightgray' }}>
                                                    <td >
                                                        <DeleteIcon className="delete-icon" onClick={resetValue} />
                                                        {searchItem}
                                                    </td>
                                                    <td>

                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            disabled
                                                            type="number"
                                                            inputRef={inputRef1}
                                                            onKeyDown={handleKeyDown}
                                                            size="small"
                                                            value={unit}
                                                            sx={{ width: '90px', textAlign: 'right', }}
                                                            onChange={(e) => { setUnit(e.target.value) }}

                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            type="string"
                                                            sx={{ width: '110px', textAlign: 'right' }}
                                                            size="small"
                                                            disabled
                                                            value={batch}
                                                            onChange={(e) => { setBatch(e.target.value) }}

                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            disabled
                                                            size="small"
                                                            sx={{ width: '100px' }}
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
                                                    <td>
                                                        <TextField
                                                            autoComplete="off"
                                                            disabled
                                                            id="outlined-number"
                                                            type="number"
                                                            sx={{ width: '100px', textAlign: 'right' }}
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
                                                    <td>
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            type="number"
                                                            sx={{ width: '120px', textAlign: 'right' }}
                                                            size="small"
                                                            inputRef={inputRef5}
                                                            onKeyDown={handleKeyDown}
                                                            value={base}
                                                            onChange={(e) => {
                                                                setBase(e.target.value);
                                                                localStorage.setItem("unsavedEditReturnItems", "true");

                                                            }}

                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            type="number"
                                                            disabled
                                                            size="small"
                                                            inputRef={inputRef8}
                                                            onKeyDown={handleKeyDown}
                                                            sx={{ width: '80px', textAlign: 'right' }}
                                                            value={gst}
                                                            onChange={(e) => { setGst(e.target.value) }}

                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td>

                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            type="number"
                                                            sx={{ width: '70px', textAlign: 'right' }}
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
                                                                handleQty(e.target.value);
                                                                localStorage.setItem("unsavedEditReturnItems", "true");

                                                            }}

                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>

                                                    <td>
                                                        <TextField
                                                            autoComplete="off"
                                                            id="outlined-number"
                                                            size="small"
                                                            inputRef={inputRef9}
                                                            onKeyDown={handleKeyDown}
                                                            disabled
                                                            sx={{ width: '100px', textAlign: 'right' }}
                                                            value={loc}
                                                            onChange={(e) => { setLoc(e.target.value) }}

                                                            InputProps={{
                                                                inputProps: { style: { textAlign: 'right' } },
                                                                disableUnderline: true
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="total ">{itemAmount}</td>
                                                </tr>
                                                <tr style={{ borderBottom: '1px solid lightgray' }}>

                                                    <td colSpan={9}></td>

                                                    <td >
                                                        <Button variant="contained" className="gap-2" style={{ backgroundColor: 'var(--color1)' }} marginRight="20px" onClick={editSaleReturnItem}>< BorderColorIcon className="w-7 h-6 text-white p-1 cursor-pointer" />Edit</Button>
                                                    </td>
                                                </tr>
                                                {saleReturnItems?.sales_iteam?.map(item => (
                                                    <tr key={item.id} className="item-List border-b border-gray-400 "
                                                        onClick={() => handleEditClick(item)}
                                                    >
                                                        <td style={{
                                                            display: 'flex', gap: '8px', alignItems: "center",
                                                            whiteSpace: 'nowrap'
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
                                                                    checked={item?.iss_check} // Use the item’s iss_check value to control the checkbox state
                                                                    onClick={(event) => {
                                                                        event.stopPropagation(); // Prevent triggering other events
                                                                    }}
                                                                    onChange={(event) => {
                                                                        handleChecked(item.id, event.target.checked);
                                                                        setUnsavedItems(true)
                                                                    }} // Pass checked state to handleChecked
                                                                />
                                                            </td>

                                                            < BorderColorIcon color="primary" className="cursor-pointer" onClick={() => handleEditClick(item)} />
                                                            {/* <DeleteIcon className="delete-icon" onClick={() => deleteOpen(item.id)} /> */}
                                                            {item.iteam_name}
                                                        </td>
                                                        <td>{item.unit}</td>
                                                        <td>{item.batch}</td>
                                                        <td>{item.exp}</td>
                                                        <td>{item.mrp}</td>
                                                        <td>{item.base}</td>
                                                        <td>{item.gst}</td>
                                                        <td>{item.qty}</td>
                                                        <td>{item.location}</td>
                                                        <td>{item.net_rate}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* {saleReturnItems?.sales_iteam?.length > 0 && (
                                    <div className="flex gap-10 justify-end mt-4 mr-10 flex-wrap"  >
                                        <div style={{ display: 'flex', gap: '25px', flexDirection: 'column' }}>
                                            <div>
                                                <label className="font-bold">Total GST : </label>
                                            </div>
                                            <div>
                                                <label className="font-bold">Total Base : </label>
                                            </div>

                                            <div>
                                                <label className="font-bold">Profit : </label>
                                            </div>
                                            <div>
                                                <label className="font-bold">Total Net Rate : </label>
                                            </div>
                                        </div>
                                        <div class="totals mr-3"
                                            style={{
                                                display: "flex",
                                                gap: "25px",
                                                flexDirection: "column",
                                                alignItems: "end"

                                            }}>
                                            <div>
                                                <span style={{ fontWeight: 600 }}>{totalGst} </span>     </div>
                                            <div>
                                                <span style={{ fontWeight: 600 }}>{totalBase} </span>     </div>
                                            <div>
                                                <span style={{ fontWeight: 600 }}>
                                                    ₹ {marginNetProfit}({Number(totalMargin).toFixed(2)} %)  </span>
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 600 }}>
                                                    ₹ {totalNetRate}  </span>
                                            </div>


                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "25px",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <div>
                                                <label className="font-bold">Total Amount : </label>
                                            </div>
                                            <div>
                                                <label className="font-bold">Other Amount : </label>
                                            </div>

                                            <div>
                                                <label className="font-bold">Round Off : </label>
                                            </div>

                                            <div>
                                                <label className="font-bold" >Net Amount : </label>
                                            </div>
                                        </div>
                                        <div class="totals">
                                            <div className="" style={{
                                                display: "flex",
                                                gap: "20px",
                                                flexDirection: "column",
                                                alignItems: "end"
                                            }}>
                                                <div>
                                                    <span style={{ fontWeight: 600 }}>{totalAmount}</span>
                                                </div>
                                                <Input
                                                    type="number"
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
                                                        outline: "none",
                                                        justifyItems: "end"

                                                    }}
                                                    sx={{
                                                        "& .MuiInputBase-root": {
                                                            height: "35px",
                                                        },
                                                        "& .MuiInputBase-input": { textAlign: "end" },
                                                    }}
                                                />
                                                <div>
                                                    <span style={{ fontWeight: 800, fontSize: '22px' }}> {Number(!roundOff ? 0 : roundOff).toFixed(2)}</span>
                                                </div>
                                                <div>
                                                    <span style={{ fontWeight: 800, fontSize: '22px' }}>{Number(!netAmount ? 0 : netAmount).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                 */}
                                {saleReturnItems?.sales_iteam?.length > 0 && (

                                    <div className="" style={{ background: 'var(--color1)', color: 'white', display: "flex", justifyContent: 'space-between', position: 'fixed', width: '100%', bottom: '0', left: '0' }}>

                                        <div className="" style={{ display: 'flex', gap: '40px', whiteSpace: 'nowrap', position: 'sticky', left: '0', overflow: 'auto', padding: '20px' }}>
                                            <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                                                <label className="font-bold">Total GST : </label>

                                                <span style={{ fontWeight: 600 }}>{totalGst} </span>
                                            </div>
                                            <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                                                <label className="font-bold">Total Base : </label>
                                                <span style={{ fontWeight: 600 }}>{totalBase} </span>
                                            </div>
                                            <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                                                <label className="font-bold">Profit : </label>
                                                <span style={{ fontWeight: 600 }}>
                                                    ₹ {marginNetProfit}({Number(totalMargin).toFixed(2)} %)  </span>
                                            </div>
                                            <div className="gap-2 invoice_total_fld" style={{ display: 'flex' }}>
                                                <label className="font-bold">Total Net Rate : </label>
                                                <span style={{ fontWeight: 600 }}>
                                                    ₹ {totalNetRate}  </span>

                                            </div>
                                        </div>

                                        <div style={{ display: 'flex' }}>
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
                                                onClick={() => { handleDeleteItem(saleItemId); setUnsavedItems(true) }}
                                            >Delete</button>
                                            <button type="button"
                                                className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-900 hover:text-white"
                                                onClick={() => setIsDelete(false)}
                                            >Cancel
                                            </button>
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
                                    onClick={handleLeavePage}>
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    className="px-6 py-2.5 w-44 rounded-md text-black text-sm font-semibold border-none outline-none bg-gray-200 hover:bg-gray-400 hover:text-black"
                                    onClick={() => setOpenModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
export default EditSaleReturn