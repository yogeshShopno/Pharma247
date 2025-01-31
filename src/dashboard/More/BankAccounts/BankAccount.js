import React, { useEffect, useState } from "react";
import Header from "../../Header"
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DatePicker from 'react-datepicker';
import { addDays, format, subDays } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import { MdOutlineDoDisturb } from "react-icons/md";
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs';
import { Alert, InputAdornment, MenuItem, OutlinedInput, Select, TextField, useMediaQuery, useTheme } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import RemoveIcon from '@mui/icons-material/Remove';
import axios from "axios";
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const BankAccount = () => {
    const history = useHistory()


    const PassbookColumns = [
        { id: 'date', label: 'Date', minWidth: 150 },
        { id: 'party_name', label: 'Party Name', minWidth: 150 },
        { id: 'deposit', label: 'Credit', minWidth: 150 },
        { id: 'withdraw', label: 'Debit', minWidth: 150 },
        { id: 'balance', label: 'Balance', minWidth: 150 },
        { id: 'remark', label: 'Remark', minWidth: 150 },
    ];
    const PaymentInitiatedColumns = [
        { id: 'bill_no', label: 'Cheque Date  ' },
        { id: 'bill_date', label: 'Party Name' },
        { id: 'customer_name', label: 'Entry By' },
        { id: 'phone_number', label: 'Cheque/Ref. No.' },
        { id: 'qty', label: 'Amount' },
    ];
    const [openAddPopUpDownload, setOpenAddPopUpDownload] = useState(false);
    const token = localStorage.getItem("token");
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [enterAmt, setEnterAmt] = useState(null)
    const [bankData, setBankData] = useState([]);
    const [errors, setErrors] = useState({})
    const [switchCheck, setSwitchChecked] = useState(false);
    const label = { inputProps: { 'aria-label': 'Size switch demo' } };
    const [passbookDetails, setPassbookDetails] = useState('')
    const [openAddPopUp, setOpenAddPopUp] = useState(false);
    const [openAddPopUpAdjust, setOpenAddPopUpAdjust] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    // const [startdate, setStartDate] = useState(dayjs().add(-30, 'day'));
    // const [enddate, setEndDate] = useState(dayjs());
    const [startDate, setStartDate] = useState(subDays(new Date(), 30));
    const [endDate, setEndDate] = useState((new Date()));
    const [search, setSearch] = useState('')
    const [remarks, setRemarks] = useState('')
    const [bankName, setBankName] = useState('')
    const [accountType, setAccountType] = useState('')
    const [openingBalance, setOpeningBalance] = useState(0)
    const [asOfDate, setAsOfDate] = useState((new Date()))
    const [adjustDate, setAdjustDate] = useState((new Date()))
    const [accountNumber, setAccountNumber] = useState('')
    const [reEnterAccountNumber, setReEnterAccountNumber] = useState('')
    const [ifscCode, setIfscCode] = useState('')
    const [latestAmt, setLatestAmt] = useState('')
    const [currentBalance, setCurrentBalance] = useState('')
    const [branchName, setBranchName] = useState('')
    const [accountHolderName, setAccountHolderName] = useState('')
    const [upiId, setUpiId] = useState('')
    const [finalValue, setFinalValue] = useState('')
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const [paymentType, setPaymentType] = useState('');
    const [bankDetails, setBankDetails] = useState([]);
    const [details, setDetails] = useState({});
    const pdfIcon = process.env.PUBLIC_URL + '/pdf.png';
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const [clicked, setClicked] = useState(false);

    const [reduceclicked, setReduceClicked] = useState(false);
    const Reducebutton = reduceclicked
        ? { color: 'white', background: '#F31C1C', textTransform: 'none', borderRadius: 50 }
        : { color: '#F31C1C', border: '1px solid #F31C1C', textTransform: 'none', borderRadius: 50 };

    const Addbutton = clicked
        ? { color: 'white', background: '#628A2F', textTransform: 'none', borderRadius: 50 }
        : { color: '#628A2F', border: '1px solid #628A2F', textTransform: 'none', borderRadius: 50 };

    const handleAddBtn = () => {
        setClicked(prevState => !prevState);
        setReduceClicked(false)
    };

    const handleReduceBtn = () => {
        setReduceClicked(prevState => !prevState);
        setClicked(false);
    };

    useEffect(() => {
        if (bankData.length > 0 && selectedAccountId === null) {
            setSelectedAccountId(bankData[0].id);
            setHighlightedIndex(0);
            BankDetailgetByID(selectedAccountId);
            const selectedDetails = bankData.find(x => x.id === selectedAccountId);
            setDetails(selectedDetails);
        }
        BankDetailgetByID(selectedAccountId);
        const selectedDetails = bankData.find(x => x.id === selectedAccountId);
        setDetails(selectedDetails);
    }, [bankData, selectedAccountId, startDate, endDate]);

    // useEffect(() => {
    //     if (selectedAccountId !== null) {
    //         BankDetailgetByID(selectedAccountId);
    //     }
    // }, [selectedAccountId]);

    // useEffect(() => {
    //     if (selectedAccountId !== null) {
    //         BankDetailgetByID(selectedAccountId);

    //         if (bankData && bankData.length > 0) {
    //             const selectedDetails = bankData.find(x => x.id === selectedAccountId);
    //             setDetails(selectedDetails);
    //         }
    //     }

    //     if (bankData && bankData.length > 0) {
    //         setSelectedAccountId(bankData[0].id);
    //     }
    // }, [selectedAccountId, bankData]);


    useEffect(() => {
        if (clicked) {
            setFinalValue(0);
            const x = parseFloat(currentBalance) + parseFloat(enterAmt);
            setLatestAmt(x);
        } else if (reduceclicked) {
            const x = parseFloat(currentBalance) - parseFloat(enterAmt);
            setLatestAmt(x);
            setFinalValue(1)
        }
    }, [enterAmt, clicked, reduceclicked, currentBalance])


    useEffect(() => {
        BankList();
        if (highlightedIndex == 0) {
            BankDetailgetByID(selectedAccountId);
        }
    }, [])

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const validateAddForm = () => {
        const newErrors = {};
        if (!paymentType) newErrors.paymentType = 'Payment Type is required';
        if (!(clicked || reduceclicked)) {
            newErrors.reduceclicked = 'Select any Credit/Debit method';
        } else if (clicked && reduceclicked) {
            newErrors.reduceclicked = 'Only one method can be selected';
        }
        if (!enterAmt) newErrors.enterAmt = 'Please Enter Any Amount';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAdjustBalance = async () => {
        if (validateAddForm()) {
            let data = new FormData();
            data.append("payment_type", paymentType);
            data.append("add_or_reduce", finalValue)
            // data.append("opening_balance", openingBalance);
            data.append("date", adjustDate ? format(adjustDate, 'yyyy-MM-dd') : '')
            data.append('amount', enterAmt)
            data.append('total_amount', latestAmt)
            data.append('remark', remarks)
            try {
                await axios.post("add-balance", data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                ).then((response) => {
                    BankList();
                    BankDetailgetByID();
                    toast.success(response.data.message);
                    setPaymentType('');
                    setClicked(false);
                    setOpenAddPopUpAdjust(false)
                    setReduceClicked(false)
                    setCurrentBalance('');
                    setAdjustDate((new Date()));
                    setEnterAmt('');
                    setLatestAmt('');
                    setRemarks('');
                    setTimeout(() => {
                        setOpenAddPopUpAdjust(false);
                    }, 3000);
                    if (response.data.status === 401) {
                        history.push('/');
                        localStorage.clear();
                    }
                })
            } catch (error) {
                console.error("API error:", error);

            }
        }
    }

    const validateForm = () => {
        const newErrors = {};

        if (!bankName) newErrors.bankName = 'Bank Name is required';
        if (!accountType) newErrors.accountType = 'Account Type is required';
        if (switchCheck) {
            if (!accountNumber) {
                newErrors.accountNumber = 'Account Number is required';
            } else if (!reEnterAccountNumber) {
                newErrors.reEnterAccountNumber = 'Re Enter Account Number is required';
            } else if (accountNumber !== reEnterAccountNumber) {
                newErrors.accountNumber = 'Account Numbers do not match';
                newErrors.reEnterAccountNumber = 'Account Numbers do not match';
            }
            if (!ifscCode) newErrors.ifscCode = 'IFSC Code is required';
            if (!accountHolderName) newErrors.accountHolderName = 'Account Holder Name is required';
            if (!branchName) newErrors.branchName = 'Branch Name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const BankList = async () => {
        let data = new FormData()
        setIsLoading(true)
        try {
            await axios.post('bank-list', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setBankData(response.data.data);
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
                setIsLoading(false)
            })

        } catch (error) {
            console.error("API error:", error);

        }
    }

    const BankDetailgetByID = async (selectedAccountId) => {
        let data = new FormData()
        setIsLoading(true);
        const params = {
            bank_id: selectedAccountId,
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : ''
        }
        try {
            await axios.post('bank-details', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setBankDetails(response.data.data)
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
                setIsLoading(false)

            })
        } catch (error) {
            console.error("API error:", error);

        }
    }
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const handleAddBank = async () => {
        if (validateForm()) {
            let data = new FormData();
            data.append("bank_name", bankName);
            data.append("bank_account_name", accountType)
            data.append("opening_balance", openingBalance);
            data.append("date", asOfDate ? format(asOfDate, 'yyyy-MM-dd') : '')
            data.append('bank_account_number', accountNumber)
            data.append('reenter_bank_account_number', reEnterAccountNumber)
            data.append('ifsc_code', ifscCode)
            data.append('bank_branch_name', branchName)
            data.append("account_holder_name", accountHolderName);
            data.append("upi_id", upiId);
            try {
                await axios.post("add-bank", data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                ).then((response) => {
                    BankList();
                    setOpenAddPopUp(false);
                    toast.success(response.data.message);
                    setBankName('');
                    setAccountType('');
                    setSwitchChecked(false)
                    setOpeningBalance(0);
                    setAsOfDate((new Date()));
                    setAccountHolderName('');
                    setAccountNumber('');
                    setReEnterAccountNumber('');
                    setIfscCode('');
                    setBranchName('');
                    setUpiId('');
                    setTimeout(() => {
                        setOpenAddPopUp(false);
                    }, 3000);
                    if (response.data.status === 401) {
                        history.push('/');
                        localStorage.clear();
                    }
                })
            } catch (error) {
                console.error("API error:", error);

            }
        }
    }

    const handleCloseDialog = () => {
        setOpenAddPopUp(false);
        setBankName('');
        setAccountType('');
        setSwitchChecked(false)
        setOpeningBalance(0);
        setAsOfDate((new Date()));
        setAccountHolderName('');
        setAccountNumber('');
        setReEnterAccountNumber('');
        setIfscCode('');
        setBranchName('');
        setUpiId('');
        setErrors('')
    }

    const resetAdjustDialog = () => {
        setOpenAddPopUpAdjust(false)
        setPaymentType('');
        setClicked(false);
        setReduceClicked(false)
        setCurrentBalance('');
        setAdjustDate((new Date()));
        setEnterAmt('');
        setLatestAmt('');
        setErrors({})
        setRemarks('');
    }

    const handlePaymentTypeChange = async (e) => {
        const selectedPaymentType = e.target.value;

        setPaymentType(selectedPaymentType);
        const selectedBankData = bankData.find(bank => bank.id === selectedPaymentType);
        if (selectedPaymentType == 'cash') {
            const selectedBankData = bankData[0];
            setCurrentBalance(selectedBankData.cash_amount)
        } else {
            setCurrentBalance(selectedBankData.total_amount)
        }
    }


    const handleAccountClick = (id, index) => {
        setHighlightedIndex(index);
        setSelectedAccountId(id);
        BankDetailgetByID(id);
        const selectedDetails = bankData.find(x => x.id === id);
        setDetails(selectedDetails);
    };

    const handlePdf = () => {
        setOpenAddPopUpDownload(true)
        pdfGenerator();
    }
    const isDateDisabled = (date) => {
        const today = new Date();
        // Set time to 00:00:00 to compare only date part
        today.setHours(0, 0, 0, 0);

        // Disable dates that are greater than today
        return date > today;
    };
    const pdfGenerator = async () => {
        let data = new FormData();
        data.append('bank_id', selectedAccountId);
        const params = {
            bank_id: selectedAccountId
        }
        try {
            const response = await axios.post("pdf-bank", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },

            });
            if (response.data.status === 401) {
                history.push('/');
                localStorage.clear();
            }
        } catch (error) {
            console.error("API error:", error);

        }
    };

    const handleStartDate = (newDate) => {
        setStartDate(newDate);
        BankDetailgetByID(selectedAccountId)
    }


    const handleEndDate = (newDate) => {
        setEndDate(newDate);
        BankDetailgetByID(selectedAccountId)
    }

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
                {/* <Box className='flex'>
                    <Box
                        className="custom-scroll"
                        sx={{
                            width: {
                                xs: 270,
                                sm: 270,
                            },
                            height: {
                                xs: 'calc(100vh - 100px)',
                                sm: 800,
                            },
                            overflowY: 'auto',
                            padding: {
                                xs: '10px',
                                sm: '15px',
                            },
                        }}
                        role="presentation"
                        onClick={() => toggleDrawer(false)}
                    >
                        <Box>
                            <h1 className="text-2xl flex justify-center p-2" style={{ color: "black" }}>Bank Accounts</h1>
                        </Box>
                        <List>
                            {bankData.map((account, index) => (
                                <ListItem key={account.id} className={`list-bank  ${highlightedIndex === index ? 'highlighted' : ''}`} disablePadding>
                                    <ListItemButton style={{ width: '100%' }} >
                                        <div onClick={() => handleAccountClick(account.id, index)} className="w-44">
                                            <p className="text-gray-700">{account.bank_account_number ? account.bank_account_number : 'Empty'}</p>
                                            <h6 className="font-semibold">{account.bank_name}</h6>
                                        </div>
                                        <MdOutlineDoDisturb color="red" size={20} />

                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                    </Box>
                    <Box className='flex-grow'>
                        <Box sx={{ width: "100%", bgcolor: 'background.paper', padding: "0px 20px 0px" }}>
                            <div className="flex justify-end py-3 flex-wrap gap-2" >
                                <div className="mr-4">
                                    <Button
                                        variant="contained"
                                        sx={{
                                            textTransform: "none",
                                        }}
                                        className="mr-auto" 
                                        onClick={() => { setOpenAddPopUpAdjust(true) }}
                                    >
                                        <AddIcon />Add/Reduce Money
                                    </Button>
                                </div>
                                <div className="mr-4">
                                    <Button
                                        variant="contained"
                                        style={{ textTransform: 'none' }}
                                        onClick={() => { setOpenAddPopUp(true) }}
                                    >
                                        <AddIcon />Add New Bank
                                    </Button>
                                </div>
                                <Button variant="contained" style={{ background: 'rgb(12 246 75 / 16%)', fontWeight: 900, color: 'black', textTransform: 'none', paddingLeft: "35px" }} onClick={handlePdf} > <img src={pdfIcon} className="report-icon absolute mr-10" alt="excel Icon" />Download</Button>
                            </div>
                            {isLoading ? <div className="loader-container ">
                                <Loader />
                            </div> :
                                <>
                                    <Box sx={{ marginTop: "20px" }}>
                                        <div>
                                            <div className="firstrow flex" style={{ background: "none" }} >
                                                <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                    <span className="primary font-bold ">Bank Name</span>
                                                    <span className="font-bold">{!details?.bank_name ? '-' : details?.bank_name}</span>
                                                </div>
                                                <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                    <span className="primary font-bold">Bank Account Number</span>
                                                    <span className="font-bold">{!details?.bank_account_number ? '-' : details?.bank_account_number}</span>
                                                </div>
                                                <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                    <span className="primary font-bold">Account Type</span>
                                                    <span className="font-bold" style={{ textTransform: 'lowercase' }}>{!details?.bank_account_name ? '-' : details?.bank_account_name}</span>
                                                </div>
                                                <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                    <span className="primary font-bold">IFSC Code</span>
                                                    <span className="font-bold">{!details?.ifsc_code ? '-' : details?.ifsc_code}</span>
                                                </div>
                                                <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                    <span className="primary font-bold">Branch Name</span>
                                                    <span className="font-bold">{!details?.bank_branch_name ? '-' : details?.bank_branch_name}</span>

                                                </div>
                                                <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                    <span className="primary font-bold">Account Holder Name</span>
                                                    <span className="font-bold">{!details?.account_holder_name ? '-' : details?.account_holder_name}</span>
                                                </div>
                                                <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                    <span className="primary font-bold">Current Balance</span>
                                                    <span className="font-bold">{!details?.current_balance ? '-' : details?.current_balance}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Box>

                                    {tabValue === 0 && (
                                        <div>
                                            <div className="flex gap-6 ml-12 mt-6 flex-wrap">
                                                <div className="detail mt-6" >
                                                    <TextField
                 autoComplete="off"
                                                        id="outlined-basic"
                                                        value={search}
                                                        size="small"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        variant="outlined"
                                                        placeholder="Type Here..."
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                                <div className="detail">
                                                    <span className="text-gray-500">Start Date</span>
                                                    <div style={{ width: "215px" }}>
                                                        <DatePicker
                                                            label="Start Date"
                                                            className='custom-datepicker '
                                                            selected={startDate}
                                                            onChange={handleStartDate}
                                                            dateFormat="dd/MM/yyyy"
                                                            filterDate={(date) => !isDateDisabled(date)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="detail">
                                                    <span className="text-gray-500">End Date</span>
                                                    <div style={{ width: "215px" }}>
                                                        <DatePicker
                                                            label="End Date"
                                                            className='custom-datepicker '
                                                            selected={endDate}
                                                            onChange={handleEndDate}
                                                            dateFormat="dd/MM/yyyy"
                                                            filterDate={(date) => !isDateDisabled(date)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto mt-4">
                                                <table className="table-cashManage w-full border-collapse">
                                                    <thead>
                                                        <tr>
                                                            {PassbookColumns.map((column) => (
                                                                <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                                    {column.label}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bankDetails?.map((item, index) => (
                                                            <tr key={index}>
                                                                {PassbookColumns.map((column) => (
                                                                    <td key={column.id}
                                                                        className={column.id === 'withdraw' ? 'debit-cell' : column.id === 'deposit' ? 'credit-cell' : ''}>
                                                                        {item[column.id]}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                    )}
                                </>
                            }
                            {tabValue === 1 && (
                                <div>
                                    <div className="firstrow">
                                        <table className="table-cashManage">
                                            <thead>
                                                <tr>
                                                    {PaymentInitiatedColumns.map((column) => (
                                                        <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                            {column.label}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {passbookDetails?.sales_return?.map((item, index) => (
                                                    <tr key={index}>
                                                        {PaymentInitiatedColumns.map((column) => (
                                                            <td key={column.id}>
                                                                {item[column.id]}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </Box>
                    </Box>
                </Box> */}
                <Box className="flex flex-col sm:flex-row">
                    <Box
                        className="custom-scroll fst_mdl_bnk"
                        sx={{
                            width: {
                                xs: '100%',
                                sm: '100%',
                                md: '25%',
                                lg: '18%',
                                xl: '15%',
                            },
                            // height: {
                            //     xs: 'calc(100vh - 56px)',
                            //     sm: 'calc(100vh - 56px)',
                            //     md: 'calc(100vh - 56px)',
                            //     lg: 'calc(100vh - 56px)',
                            // },
                            overflowY: 'auto',
                            padding: {
                                xs: '10px',
                                sm: '15px',
                                md: '15px',
                            },
                        }}
                        role="presentation"
                        onClick={() => toggleDrawer(false)}
                    >
                        <Box>
                            <h1 className="text-2xl sm:text-xl md:text-2xl flex justify-start p-2" style={{ color: "var(--color1)" }}>Bank Accounts</h1>
                        </Box>
                        <List>
                            {bankData.map((account, index) => (
                                <ListItem key={account.id} className={`list-bank ${highlightedIndex === index ? 'highlighted' : ''}`} disablePadding>
                                    <ListItemButton style={{ width: '100%', borderRadius: '10px' }}>
                                        <div onClick={() => handleAccountClick(account.id, index)} className="w-44">
                                            <p className="text-gray-700">{account.bank_account_number ? account.bank_account_number : 'Empty'}</p>
                                            <h6 className="font-semibold">{account.bank_name}</h6>
                                        </div>
                                        {/* <MdOutlineDoDisturb color="red" size={20} /> */}
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <Divider style={{ borderColor: 'var(--color2) !important' }} />
                    </Box>
                    <Box className="flex-grow bnk_acc_mdl" style={{ width: '71%' }}>
                        <Box sx={{ width: "100%", bgcolor: 'background.paper', padding: "0px 20px 0px" }}>
                            <div className="flex justify-end py-3 bnk_acc_hdr gap-2">
                                <Button
                                    variant="contained"
                                    className='gap-2 add_rdc_btn'
                                    style={{ background: 'var(--color1)', display: 'flex' }}
                                    onClick={() => { setOpenAddPopUpAdjust(true) }}
                                >
                                    <AddIcon />Add/Reduce Money
                                </Button>
                                <Button
                                    variant="contained"
                                    className='gap-2 add_rdc_btn'
                                    style={{ background: 'var(--color1)', display: 'flex' }}
                                    onClick={() => { setOpenAddPopUp(true) }}
                                >
                                    <AddIcon />Add New Bank
                                </Button>
                                <Button variant="contained"
                                    className="gap-7 downld_btn_csh"
                                    style={{
                                        background: "var(--color1)",
                                        color: "white",
                                        // paddingLeft: "35px",
                                        textTransform: "none",
                                        display: "flex",
                                    }}  >
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <img src="/csv-file.png"
                                            className="report-icon absolute mr-10"
                                            alt="csv Icon"
                                        />
                                    </div>
                                    Download</Button>
                            </div>
                            {isLoading ? (
                                <div className="loader-container">
                                    <Loader />
                                </div>
                            ) : (
                                <>
                                    <Box sx={{ marginTop: "20px", backgroundColor: 'rgba(63, 98, 18, 0.09)', borderRadius: '10px' }}>
                                        <div className="firstrow flex flex-wrap justify-between" style={{ background: "none" }}>
                                            <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                <span className="primary ">Bank Name</span>
                                                <span className="primary font-bold">{!details?.bank_name ? '-' : details?.bank_name}</span>
                                            </div>
                                            <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                <span className="primary ">Bank Account Number</span>
                                                <span className="primary font-bold">{!details?.bank_account_number ? '-' : details?.bank_account_number}</span>
                                            </div>
                                            <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                <span className="primary ">Account Type</span>
                                                <span className="primary font-bold" style={{ textTransform: 'lowercase' }}>{!details?.bank_account_name ? '-' : details?.bank_account_name}</span>
                                            </div>
                                            <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                <span className="primary ">IFSC Code</span>
                                                <span className="primary font-bold">{!details?.ifsc_code ? '-' : details?.ifsc_code}</span>
                                            </div>
                                            <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                <span className="primary ">Branch Name</span>
                                                <span className="primary font-bold">{!details?.bank_branch_name ? '-' : details?.bank_branch_name}</span>
                                            </div>
                                            <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                <span className="primary ">Account Holder Name</span>
                                                <span className="primary font-bold">{!details?.account_holder_name ? '-' : details?.account_holder_name}</span>
                                            </div>
                                            <div className="distributor-detail" style={{ minWidth: "190px" }}>
                                                <span className="primary">Current Balance</span>
                                                <span className="primary font-bold">{!details?.current_balance ? '-' : details?.current_balance}</span>
                                            </div>
                                        </div>
                                    </Box>

                                    {tabValue === 0 && (
                                        <div>
                                            <div className="flex flex-row detail_st_ed_dt gap-6 mt-5" style={{ alignItems: 'end' }}>
                                                <div className="detail" style={{ width: '100%' }}>
                                                    <TextField
                                                        autoComplete="off"
                                                        id="outlined-basic"
                                                        value={search}
                                                        size="small"
                                                        onChange={(e) => setSearch(e.target.value)}
                                                        variant="outlined"
                                                        placeholder="Type Here..."
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <SearchIcon />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </div>
                                                <div className="detail" style={{ width: '100%' }}>
                                                    <span className="primary">Start Date</span>
                                                    <DatePicker
                                                        label="Start Date"
                                                        className='custom-datepicker_mn'
                                                        selected={startDate}
                                                        onChange={handleStartDate}
                                                        dateFormat="dd/MM/yyyy"
                                                        filterDate={(date) => !isDateDisabled(date)}
                                                    />
                                                </div>
                                                <div className="detail" style={{ width: '100%' }}>
                                                    <span className="primary">End Date</span>
                                                    <DatePicker
                                                        label="End Date"
                                                        className='custom-datepicker_mn'
                                                        selected={endDate}
                                                        onChange={handleEndDate}
                                                        dateFormat="dd/MM/yyyy"
                                                        filterDate={(date) => !isDateDisabled(date)}
                                                    />
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto mt-4">
                                                <table className="table-cashManage w-full border-collapse" style={{ whiteSpace: "nowrap", borderCollapse: "separate", borderSpacing: "0 6px" }}>
                                                    <thead>
                                                        <tr>
                                                            {PassbookColumns.map((column) => (
                                                                <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                                    {column.label}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody style={{ backgroundColor: "#3f621217" }}>
                                                        {bankDetails?.map((item, index) => (
                                                            <tr key={index}>
                                                                {PassbookColumns.map((column, colIndex) => (
                                                                    <td key={column.id}
                                                                        style={
                                                                            colIndex === 0 ? {
                                                                                borderRadius: "10px 0 0 10px",
                                                                            } : colIndex === PassbookColumns.length - 1 ? {
                                                                                borderRadius: "0 10px 10px 0",
                                                                            } : {}
                                                                        }
                                                                        className={column.id === 'withdraw' ? 'debit-cell' : column.id === 'deposit' ? 'credit-cell' : ''}
                                                                    >
                                                                        {item[column.id]}
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>


                {/* <Dialog open={openAddPopUp}
                    sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                width: "30%",
                                minWidth: "300px",
                            },
                        },
                    }}
                >
                    <DialogTitle id="alert-dialog-title" className="secondary">
                        Add Bank Account
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <div className="flex my-4" style={{ flexDirection: 'column', gap: '19px' }}>
                                <div className="flex gap-5 ">
                                    <div  >
                                        <div className="mb-2" >
                                            <span className="label primary mb-4" >Bank Name</span>
                                            <span className="text-red-600 ml-1">*</span>
                                        </div>
                                        <TextField
                 autoComplete="off"
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={bankName}
                                            onChange={(e) => { setBankName(e.target.value) }}
                                           style={{width:"100%"}}
                                            variant="outlined"

                                        />
                                        {errors.bankName && <span className="error">{errors.bankName}</span>}
                                    </div>
                                    <div>
                                        <div className="mb-2" >
                                            <span className="label primary" >Account Type</span>
                                            <span className="text-red-600 ml-1">*</span>
                                        </div>
                                        <TextField
                 autoComplete="off"
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={accountType}
                                            onChange={(e) => { setAccountType(e.target.value) }}
                                           style={{width:"100%"}}
                                            variant="outlined"

                                        />
                                        {errors.accountType && <span className="error">{errors.accountType}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-5">
                                    <div >
                                        <div className="mb-2" >
                                            <span className="label primary mb-4" >Opening Balance</span>
                                        </div>
                                        <TextField
                 autoComplete="off"
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={openingBalance}
                                            onChange={(e) => { setOpeningBalance(e.target.value) }}
                                           style={{width:"100%"}}
                                            variant="outlined"
                                        />
                                    </div>
                                    <div>
                                        <div className="mb-2" >
                                            <span className="label primary" >As of Date</span>
                                        </div>
                                        <div className="detail">
                                            <div style={{ width: "215px" }}>
                                                <DatePicker
                                                    className='custom-datepicker '
                                                    selected={asOfDate}
                                                    onChange={(newDate) => setAsOfDate(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-1 text-black font-bold flex justify-between items-center" >
                                Add Bank Details
                                <Switch {...label} checked={switchCheck} onChange={(e) => setSwitchChecked(e.target.checked)} />
                            </div>
                            {switchCheck == true &&

                                <>
                                    <div className="flex gap-5 my-4">
                                        <div >
                                            <div className="mb-2" >
                                                <span className="label primary mb-4" >Bank Account Number</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={accountNumber}
                                                onChange={(e) => { setAccountNumber(e.target.value) }}
                                               style={{width:"100%"}}
                                                variant="outlined"

                                            />
                                            {errors.accountNumber && <span className="error">{errors.accountNumber}</span>}
                                        </div>
                                        <div>
                                            <div className="mb-2" >
                                                <span className="label primary" >Re-Enter Account Number</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={reEnterAccountNumber}
                                                onChange={(e) => { setReEnterAccountNumber(e.target.value) }}
                                               style={{width:"100%"}}
                                                variant="outlined"

                                            />
                                            {errors.reEnterAccountNumber && <span className="error">{errors.reEnterAccountNumber}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-5 my-4">
                                        <div >
                                            <div className="mb-2" >
                                                <span className="label primary mb-4" >IFSC Code</span>
                                                <span className="text-red-600 ml-1">*</span>

                                            </div>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={ifscCode}
                                                onChange={(e) => { setIfscCode(e.target.value) }}
                                               style={{width:"100%"}}
                                                variant="outlined"

                                            />
                                            {errors.ifscCode && <span className="error">{errors.ifscCode}</span>}
                                        </div>
                                        <div>
                                            <div className="mb-2" >
                                                <span className="label primary" >Branch Name</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <div className="detail">
                                                <TextField
                 autoComplete="off"
                                                    id="outlined-multiline-static"
                                                    size="small"
                                                    value={branchName}
                                                    onChange={(e) => { setBranchName(e.target.value) }}
                                                   style={{width:"100%"}}
                                                    variant="outlined"

                                                />
                                                {errors.branchName && <span className="error">{errors.branchName}</span>}
                                            </div>
                                        </div>

                                    </div>


                                    <div className="flex gap-5">
                                        <div >
                                            <div className="mb-2" >
                                                <span className="label primary mb-4" >Account Holder Name</span>
                                                <span className="text-red-600 ml-1">*</span>

                                            </div>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={accountHolderName}
                                                onChange={(e) => { setAccountHolderName(e.target.value) }}
                                               style={{width:"100%"}}
                                                variant="outlined"
                                            />
                                            {errors.accountHolderName && <span className="error">{errors.accountHolderName}</span>}
                                        </div>
                                        <div>
                                            <div className="mb-2" >
                                                <span className="label primary" >UPI ID</span>
                                            </div>
                                            <div className="detail">
                                                <TextField
                 autoComplete="off"
                                                    id="outlined-multiline-static"
                                                    size="small"
                                                    value={upiId}
                                                    onChange={(e) => { setUpiId(e.target.value) }}
                                                   style={{width:"100%"}}
                                                    variant="outlined"

                                                />
                                            </div>
                                        </div>

                                    </div>
                                </>
                            }
                        </DialogContentText>

                    </DialogContent>

                    <DialogActions>
                        <Button autoFocus variant="contained" onClick={handleAddBank} >
                            Save
                        </Button>

                    </DialogActions>
                </Dialog> */}
                <Dialog
                    open={openAddPopUp}
                    onClose={handleCloseDialog}

                >
                    <DialogTitle id="alert-dialog-title" className="primary">
                        Add Bank Account
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <div className="flex my-4" style={{ flexDirection: 'column', gap: '19px' }}>
                                <div className="flex flex-col md:flex-row gap-5 ">
                                    <div style={{ width: "100%" }}>
                                        <div className="mb-2">
                                            <span className="label primary mb-4">Bank Name</span>
                                            <span className="text-red-600 ml-1">*</span>
                                        </div>
                                        <TextField
                                            autoComplete="off"
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={bankName}

                                            onChange={(e) => {
                                                // Transform to uppercase
                                                const uppercasedValue = e.target.value.toUpperCase();
                                                setBankName(uppercasedValue);
                                            }}
                                            style={{ width: "100%" }}
                                            variant="outlined"
                                            fullWidth={fullScreen}
                                        />
                                        {errors.bankName && <span className="error">{errors.bankName}</span>}
                                    </div>
                                    <div style={{ width: "100%" }}>
                                        <div className="mb-2">
                                            <span className="label primary">Account Type</span>
                                            <span className="text-red-600 ml-1">*</span>
                                        </div>
                                        <TextField
                                            autoComplete="off"
                                            id="outlined-multiline-static"
                                            size="small"
                                            type="text"
                                            value={accountType}
                                            onChange={(e) => {
                                                const capitalizedValue = e.target.value
                                                    .toLowerCase()
                                                    .replace(/\b\w/g, (char) => char.toUpperCase()); setAccountType(capitalizedValue)
                                            }}
                                            style={{ width: "100%" }}
                                            variant="outlined"
                                            fullWidth={fullScreen}
                                        />
                                        {errors.accountType && <span className="error">{errors.accountType}</span>}
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row gap-5">
                                    <div style={{ width: "100%" }}>
                                        <div className="mb-2">
                                            <span className="label primary mb-4">Opening Balance</span>
                                        </div>
                                        <TextField
                                            autoComplete="off"
                                            id="outlined-multiline-static"
                                            size="small"
                                            value={openingBalance}
                                            onChange={(e) => { setOpeningBalance(e.target.value) }}
                                            style={{ width: "100%" }}
                                            variant="outlined"
                                            fullWidth={fullScreen}
                                        />
                                    </div>
                                    <div style={{ width: "100%" }}>
                                        <div className="mb-2">
                                            <span className="label primary">As of Date</span>
                                        </div>
                                        <div className="detail">
                                            <div style={{ width: "100%" }}>
                                                <DatePicker
                                                    className='custom-datepicker_mn'
                                                    selected={asOfDate}
                                                    onChange={(newDate) => setAsOfDate(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                    minDate={new Date()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-1 text-black font-bold secondary flex justify-between items-center">
                                Add Bank Details
                                <Switch checked={switchCheck} onChange={(e) => setSwitchChecked(e.target.checked)} sx={{
                                    "& .MuiSwitch-track": {
                                        backgroundColor: "var(--COLOR_UI_PHARMACY)",
                                    },
                                    "&.Mui-checked .MuiSwitch-track": {
                                        backgroundColor: "var(--COLOR_UI_PHARMACY) !important",
                                    },
                                    "& .MuiSwitch-thumb": {
                                        backgroundColor: "var(--COLOR_UI_PHARMACY)",
                                    },
                                    "&.Mui-checked .MuiSwitch-thumb": {
                                        backgroundColor: "var(--COLOR_UI_PHARMACY)",
                                    },
                                    "& .css-byenzh-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
                                        backgroundColor: "var(--COLOR_UI_PHARMACY) !important",

                                    }
                                }} />
                            </div>
                            {switchCheck && (
                                <>
                                    <div className="flex flex-col md:flex-row gap-5 my-4">
                                        <div style={{ width: "100%" }}>
                                            <div className="mb-2">
                                                <span className="label primary mb-4">Bank Account Number</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <TextField
                                                autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={accountNumber}
                                                onChange={(e) => {
                                                    const numericValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters

                                                    setAccountNumber(numericValue)
                                                }}
                                                style={{ width: "100%" }}
                                                variant="outlined"
                                                fullWidth={fullScreen}
                                            />
                                            {errors.accountNumber && <span className="error">{errors.accountNumber}</span>}
                                        </div>
                                        <div style={{ width: "100%" }}>
                                            <div className="mb-2">
                                                <span className="label primary">Re-Enter Account Number</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <TextField
                                                autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={reEnterAccountNumber}
                                                onChange={(e) => {
                                                    // Allow only numeric input
                                                    const numericValue = e.target.value.replace(/[^0-9]/g, ""); // Remove non-numeric characters
                                                    setReEnterAccountNumber(numericValue);
                                                }}
                                                style={{ width: "100%" }}
                                                variant="outlined"
                                                fullWidth={fullScreen}
                                            />
                                            {errors.reEnterAccountNumber && <span className="error">{errors.reEnterAccountNumber}</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-5 my-4">
                                        <div style={{ width: "100%" }}>
                                            <div className="mb-2">
                                                <span className="label primary mb-4">IFSC Code</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <TextField
                                                autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={ifscCode}
                                                onChange={(e) => { const uppercasedValue = e.target.value.toUpperCase(); setIfscCode(uppercasedValue) }}
                                                style={{ width: "100%" }}
                                                variant="outlined"
                                                fullWidth={fullScreen}
                                            />
                                            {errors.ifscCode && <span className="error">{errors.ifscCode}</span>}
                                        </div>
                                        <div style={{ width: "100%" }}>
                                            <div className="mb-2">
                                                <span className="label primary">Branch Name</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <div className="detail">
                                                <TextField
                                                    autoComplete="off"
                                                    id="outlined-multiline-static"
                                                    size="small"
                                                    value={branchName}
                                                    onChange={(e) => { setBranchName(e.target.value) }}
                                                    style={{ width: "100%" }}
                                                    variant="outlined"
                                                    fullWidth={fullScreen}
                                                />
                                                {errors.branchName && <span className="error">{errors.branchName}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-5">
                                        <div style={{ width: "100%" }}>
                                            <div className="mb-2">
                                                <span className="label primary mb-4">Account Holder Name</span>
                                                <span className="text-red-600 ml-1">*</span>
                                            </div>
                                            <TextField
                                                autoComplete="off"
                                                id="outlined-multiline-static"
                                                size="small"
                                                value={accountHolderName}
                                                onChange={(e) => {
                                                    const capitalizedValue = e.target.value
                                                        .toLowerCase()
                                                        .replace(/\b\w/g, (char) => char.toUpperCase());
                                                    setAccountHolderName(capitalizedValue)
                                                }}
                                                style={{ width: "100%" }}
                                                variant="outlined"
                                                fullWidth={fullScreen}
                                            />
                                            {errors.accountHolderName && <span className="error">{errors.accountHolderName}</span>}
                                        </div>
                                        <div style={{ width: "100%" }}>
                                            <div className="mb-2">
                                                <span className="label primary">UPI ID</span>
                                            </div>
                                            <div className="detail">
                                                <TextField
                                                    autoComplete="off"
                                                    id="outlined-multiline-static"
                                                    size="small"
                                                    value={upiId}
                                                    onChange={(e) => { setUpiId(e.target.value) }}
                                                    style={{ width: "100%" }}
                                                    variant="outlined"
                                                    fullWidth={fullScreen}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ padding: '20px 24px' }}>
                        <Button style={{ background: "var(--COLOR_UI_PHARMACY)",width:"100%" }} autoFocus variant="contained" onClick={handleAddBank}>
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
                {/* className="custom-dialog" */}
                {/* Add Fund Dialog Box */}
                <Dialog open={openAddPopUpAdjust} >
                    <DialogTitle id="alert-dialog-title" className="primary">
                        Adjust Balance
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        // onClick={handleCloseDialog}
                        onClick={resetAdjustDialog}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">

                            <div className="detail mb-4">
                                <span className="label  primary ">Payment Mode</span>
                                <Select
                                    labelId="dropdown-label"
                                    id="dropdown"
                                    className="mb-2"
                                    value={paymentType}
                                    sx={{ width: '100%' }}
                                    onChange={handlePaymentTypeChange}
                                    size="small"
                                >

                                    <MenuItem value="cash">Cash</MenuItem>
                                    {bankData?.map(option => (
                                        <MenuItem key={option.id} value={option.id}>{option.bank_name}</MenuItem>
                                    ))}
                                </Select>
                                {errors.paymentType && <div className="error">{errors.paymentType}</div>}
                            </div>
                            <div className="detail mb-4">
                                <span className="label primary mb-2">Add or Reduce</span>
                                <div className="flex flex-col sm:flex-row gap-5 mb-4">
                                    <div className="">
                                        <Button autoFocus style={Addbutton} onClick={handleAddBtn} >
                                            <AddIcon /> Add Money
                                        </Button>
                                    </div>
                                    <div>
                                        <Button autoFocus style={Reducebutton} onClick={handleReduceBtn}>
                                            <RemoveIcon />  Reduce Money
                                        </Button>
                                    </div>

                                </div>
                                {errors.reduceclicked && <div className="error">{errors.reduceclicked}</div>}
                            </div>
                            <div className="detail mb-4 ">
                                <div className="flex flex-col md:flex-row justify-between gap-5">
                                    <div className="mb-2" style={{ width: "100%" }}>
                                        <span className="label primary">Current Balance</span>
                                        <div >
                                            <OutlinedInput
                                                type="number"
                                                value={currentBalance}
                                                disabled
                                                startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
                                                sx={{ width: '100%' }}
                                                size="small"
                                            />

                                        </div>
                                    </div>
                                    <div className="mb-2" style={{ width: "100%" }}>
                                        <span className="label primary">Date</span>
                                        <div >
                                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    sx={{ width: "200px" }}
                                                    value={adjustDate}
                                                    onChange={(newDate) => setAdjustDate(newDate)}
                                                    format="DD/MM/YYYY"
                                                    maxDate={dayjs()}
                                                />
                                            </LocalizationProvider> */}
                                            <div style={{ width: "100%" }}>
                                                <DatePicker
                                                    className='custom-datepicker_mn '
                                                    selected={adjustDate}
                                                    onChange={(newDate) => setAdjustDate(newDate)}
                                                    dateFormat="dd/MM/yyyy"
                                                // minDate={new Date()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="detail mb-4 ">
                                <div className="flex flex-col md:flex-row justify-between gap-5">
                                    <div className="mb-2" style={{ width: "100%" }}>
                                        <span className="label primary">Enter Amount</span>
                                        <div>
                                            <OutlinedInput
                                                type="number"
                                                value={enterAmt}
                                                onChange={(e) => setEnterAmt(e.target.value)}
                                                startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
                                                sx={{ width: '100%' }}
                                                size="small"
                                            />
                                            {errors.enterAmt && <div className="error">{errors.enterAmt}</div>}
                                        </div>
                                    </div>
                                    <div className="mb-2" style={{ width: "100%" }}>
                                        <span className="label primary">Latest Balance</span>
                                        <div>
                                            <OutlinedInput
                                                type="number"
                                                value={latestAmt}
                                                disabled
                                                startAdornment={<InputAdornment position="start">Rs.</InputAdornment>}
                                                sx={{ width: '100%' }}
                                                size="small"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="detail mb-2" style={{ width: "100%" }}>
                                <span className="label primary">Remarks</span>
                                <div>
                                    <OutlinedInput
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        sx={{ width: '100%' }}
                                        size="small"
                                    />
                                    {/* {errors.paymentType && <div className="error">{errors.paymentType}</div>} */}
                                </div>
                            </div>
                        </DialogContentText>

                    </DialogContent>

                    <DialogActions style={{ padding: '20px 24px' }}>
                        <Button style={{ backgroundColor: "var(--COLOR_UI_PHARMACY)", color: "white",width:"100%" }} autoFocus variant="contained" onClick={handleAdjustBalance} >
                            Save
                        </Button>

                    </DialogActions>
                </Dialog>

                <Dialog open={openAddPopUpDownload}
                    sx={{
                        "& .MuiDialog-container": {
                            "& .MuiPaper-root": {
                                width: "600px",
                                maxWidth: "1500px",
                                backgroundColor: 'none',
                                boxShadow: 'none',
                                marginBottom: "0"
                            },
                        },
                    }}>
                    <Alert

                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={(() => { setOpenAddPopUpDownload(false) })}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                        sx={{ mb: 2 }}
                    >
                        <h4 className="font-bold text-lg">  Please check your email. </h4>
                        <span className="text-base">You will receive a maill from us within the next few minutes.</span>
                    </Alert>
                </Dialog>

            </div>

        </>
    )
}
export default BankAccount 