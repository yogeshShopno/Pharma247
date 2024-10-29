import { useEffect, useRef, useState } from "react";
import Header from "../../../Header"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { Button, ListItemText, TextField } from "@mui/material";
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
    const [customer, setCustomer] = useState('')
    const [isVisible, setIsVisible] = useState(true);
    const { id } = useParams();
    const [selectedEditItem, setSelectedEditItem] = useState(null);
    const [saleItemId, setSaleItemId] = useState(null);
    const [address, setAddress] = useState('');
    const [doctor, setDoctor] = useState('')
    const [error, setError] = useState({ customer: '' });
    const [expiryDate, setExpiryDate] = useState('');
    const [mrp, setMRP] = useState('');
    const [qty, setQty] = useState(0);
    const [tempQty, setTempQty] = useState(0)

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
    const [itemAmount, setItemAmount] = useState(null);
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
    const [totalMargine, setTotalMargine] = useState(0);
    const [totalNetRate, setTotalNetRate] = useState(0);
    const [netAmount, setNetAmount] = useState(0)
    const [roundOff, setRoundOff] = useState(0)

    const [finalDiscount, setFinalDiscount] = useState(0)
    const [otherAmt, setOtherAmt] = useState(0);
    const [paymentType, setPaymentType] = useState('cash');
    const [bankData, setBankData] = useState([]);

    const [openModal, setOpenModal] = useState(false);
    const [unsavedItems, setUnsavedItems] = useState(false);
    const [nextPath, setNextPath] = useState("");
    const [uniqueId, setUniqueId] = useState([])

    // useEffect(() => {
    //     const totalAmount = (qty / unit);
    //     const total = parseFloat(base) * totalAmount;
    //     setItemAmount(total.toFixed(2));
    // }, [base, qty]);

    // useEffect(() => {
    //     const discountAmount = (totalAmount * finalDiscount) / 100;
    //     const finalAmount = totalAmount - discountAmount;
    //     setNetAmount(finalAmount.toFixed(2));
    // }, [totalAmount, finalDiscount]);

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
            setSaleReturnItems(response.data.data);
            setTotalBase(response.data.data.total_base)
            setTotalMargine(response.data.data.total_margin)
            setTotalNetRate(response.data.data.total_net_rate)
            setSgst(response.data.data.sgst)
            setIgst(response.data.data.igst)
            setCgst(response.data.data.cgst)
            setAddress(response.data.data.customer_address)
            setTotalAmount(response.data.data.sales_amount)
            const foundCustomer = customerData.find(option => option.id == record.customer_id);
            setCustomer(foundCustomer);
            const foundDoctor = doctorData.find(option => option.id == record.doctor_id);
            setDoctor(foundDoctor);
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
            setDoctorData(doctorData);
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
            const customerData = response.data.data;
            setCustomerDetails(customerData);
            setIsLoading(false);
            return customerData;
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);
            return [];
        }
    }

    const editSaleReturnBill = async () => {
        let data = new FormData();
        data.append("bill_no", saleReturnItems.bill_no);
        data.append("bill_date", saleReturnItems.bill_date)
        data.append("customer_id", customer.id);
        data.append("customer_address", address)
        data.append("doctor_id", doctor.id);
        data.append('mrp_total', totalAmount)
        data.append('total_discount', finalDiscount)
        data.append('other_amount', otherAmt)
        data.append('net_amount', netAmount)
        data.append('total_base', totalBase)
        data.append('igst', igst)
        data.append('cgst', cgst)
        data.append('sgst', sgst)
        data.append('product_list', JSON.stringify(saleReturnItems.sales_iteam))
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
                //console.log(response.data);
                //console.log("response===>", response.data);
                toast.success(response.data.message);
                setTimeout(() => {
                    history.push('/saleReturn/list');
                }, 2000);
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const editSaleReturnItem = async () => {
        setUnsavedItems(true);

        let data = new FormData();
        data.append('item_id', searchItemID)
        data.append("qty", qty)
        data.append("exp", expiryDate)
        data.append('gst', gst)
        data.append("mrp", mrp)
        data.append("unit", unit);
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

                //console.log("response", response);
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
        if (isNaN(itemAmount)) {
            setItemAmount(0);
        }
    }

    const handleDeleteItem = async (saleItemId) => {
        if (!saleItemId) return;
        let data = new FormData();
        data.append("id", saleItemId);
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

    const handleEditClick = (item) => {

        const existingItem = uniqueId.find((obj) => obj.id === item.id);
        console.log(existingItem,"existingItem")

        if (!existingItem) {
            // If the ID is unique, add the item to uniqueId and set tempQty
            setUniqueId((prevUniqueIds) => [...prevUniqueIds, { id: item.id, qty: item.qty }]);
            setTempQty(item.qty);
        } else {
            setTempQty(existingItem.qty);
            
        }

        setSelectedEditItem(item);
        setSelectedEditItemId(item.id);
       
    };

    const handleQty = (value) =>{

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
        setOpenModal(true); // Show modal
        setNextPath(path);   // Save the next path to navigate after confirmation
    };

    // Handle leaving page after user confirms in modal
    const handleLeavePage = () => {
        let data = new FormData();

        const params = {
            random_number: localStorage.getItem('RandomNumber')
        };
        axios.post("sales-return-edit-history", data, {
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
                    <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }} >
                        <div>
                            <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <span className="cursor-pointer" style={{ color: 'rgba(12, 161, 246, 1)', alignItems: 'center', fontWeight: 700, fontSize: '20px', minWidth: "125px" }} onClick={() => { history.push('/saleReturn/list') }} >Sales Return</span>
                                    <ArrowForwardIosIcon style={{ fontSize: '18px', marginTop: '11px', color: "rgba(4, 76, 157, 1)" }} />
                                    <span style={{ color: 'rgba(4, 76, 157, 1)', alignItems: 'center', fontWeight: 700, fontSize: '20px' }}>Edit </span>
                                    <ArrowForwardIosIcon style={{ fontSize: '18px', marginTop: '11px', color: "rgba(4, 76, 157, 1)" }} />
                                    <BsLightbulbFill className="mt-1 w-6 h-6 sky_text hover-yellow" />
                                </div>

                                <div className="headerList">
                                    <Select
                                        labelId="dropdown-label"
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
                                    <Button variant="contained" sx={{ textTransform: 'none', background: "rgb(4, 76, 157)" }} onClick={handleUpdate}> Update</Button>

                                </div>
                            </div>
                            <div className="border-b">
                                <div className="firstrow flex">
                                    <div className="detail mt-1" style={{ width: '250px' }}>
                                        <div className="detail  p-2 rounded-md" style={{ background: "#044c9d", width: "100%" }} >
                                            <div className="heading" style={{ color: 'white', fontWeight: "500", alignItems: "center", marginLeft: "15px" }}>Bill No <span style={{ marginLeft: '35px' }}> Bill Date</span> </div>
                                            <div className="flex gap-5">
                                                <div style={{ color: 'white', fontWeight: "500", alignItems: "center", marginTop: '8px', marginLeft: "15px", fontWeight: "bold", width: '19%' }}>{saleReturnItems.bill_no}  </div>
                                                <div style={{ color: 'white', fontWeight: "500", alignItems: "center", marginTop: '8px', fontWeight: "bold" }}>|</div>
                                                <div style={{ color: 'white', fontWeight: "500", alignItems: "center", marginTop: '8px', fontWeight: "bold" }}>{saleReturnItems.bill_date}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="detail" style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "rgba(4, 76, 157, 1)" }}>Customer Mobile / Name</span>
                                        <Autocomplete
                                            value={customer}
                                            options={customerDetails}
                                            disabled
                                            getOptionLabel={(option) => option.name || ''}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
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
                                        {error.customer && <span style={{ color: 'red', fontSize: '14px' }}>{error.customer}</span>}
                                    </div>
                                    <div className="detail">
                                        <span className="heading mb-2" style={{ fontWeight: "500", fontSize: "17px", color: "rgba(4, 76, 157, 1)" }}>Address</span>

                                        <TextField id="outlined-basic"
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
                                    </div>

                                    <div className="detail">
                                        <span className="heading mb-2 title" style={{ fontWeight: "500", fontSize: "17px", color: "rgba(4, 76, 157, 1)" }}>Doctor </span>
                                        <Autocomplete
                                            value={doctor || {}}
                                            onChange={handleDoctorOption}
                                            options={doctorData}
                                            disabled
                                            getOptionLabel={(option) => option.name || ''}
                                            isOptionEqualToValue={(option, value) => option.name === value.name}
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
                                                        secondary={`Clinic Name: ${option.clinic} `}
                                                    />
                                                </ListItem>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
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
                                                <tr>
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
                                                            onChange={(e) => { handleQty(e.target.value) }}
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
                                                    <td >
                                                        <Button variant="contained" color="success" marginRight="20px" onClick={editSaleReturnItem}>< BorderColorIcon className="w-7 h-6 text-white  p-1 cursor-pointer" />Edit</Button>
                                                    </td>
                                                </tr>
                                                {saleReturnItems?.sales_iteam?.map(item => (
                                                    <tr key={item.id} className="item-List border-b border-gray-400 "
                                                        onClick={() => handleEditClick(item)}
                                                    >
                                                        <td style={{
                                                            display: 'flex', gap: '8px',
                                                        }}>
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
                                                        <td>{item.location}</td>
                                                        <td>{item.net_rate}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {saleReturnItems?.sales_iteam?.length > 0 && (
                                    <div className="flex gap-10 justify-end mt-4 flex-wrap"  >
                                        <div style={{ display: 'flex', gap: '22px', flexDirection: 'column' }}>
                                            <div>
                                                <label className="font-bold">Total Base: </label>
                                            </div>

                                            <div>
                                                <label className="font-bold">Total Margin: </label>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '22px', flexDirection: 'column' }}>
                                             <div>
                                            <span style={{ fontWeight: 600 }}>{totalBase} /-</span>     </div>
                                              <div>
                                            <span style={{ fontWeight: 600 }}>({totalMargine} %) {totalNetRate} /-</span>
                                            </div>
                                           
                                          
                                        </div>

                                        <div style={{ display: 'flex', gap: '22px', flexDirection: 'column' }}>
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
                                        <div style={{ display: 'flex', gap: '22px', flexDirection: 'column' }}>
                                            <div className="font-bold">
                                                {sgst}
                                            </div>
                                            <div className="font-bold">
                                                {cgst}
                                            </div>
                                            <div className="font-bold">
                                                {igst}
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '22px', flexDirection: 'column' }}>
                                            <div>
                                                <label className="font-bold">Total Amount : </label>
                                            </div>
                                            {/* <div>
                                                <label className="font-bold">Discount % : </label>
                                            </div> */}
                                            <div>
                                                <label className="font-bold">Other Amount: </label>
                                            </div>

                                            <div>
                                                <label className="font-bold">Round Off: </label>
                                            </div>

                                            <div>
                                                <label className="font-bold" >Net Amount  : </label>
                                            </div>
                                        </div>
                                        <div class="totals" style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
                                            <div>
                                                <span style={{ fontWeight: 600 }}>{totalAmount}/-</span>
                                            </div>
                                            {/* <div>
                                                <TextField value={finalDiscount} onChange={(e) => { setFinalDiscount(e.target.value) }} size="small" style={{ width: '105px' }} sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: '35px'
                                                    },
                                                }} />
                                            </div> */}
                                            <div>
                                                <TextField value={otherAmt} onChange={(e) => { setOtherAmt(e.target.value) }} size="small" style={{ width: '105px' }} sx={{
                                                    '& .MuiInputBase-root': {
                                                        height: '35px',
                                                    },
                                                }} />
                                            </div>
                                            <div>
                                                <TextField value={roundOff} onChange={(e) => { setOtherAmt(e.target.value) }} size="small" style={{ width: '105px' }} sx={{
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
                </div>
                
            }
        </>
    )
}
export default EditSaleReturn