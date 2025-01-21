import { BsLightbulbFill } from "react-icons/bs";
import Header from "../../Header"
import React, { useEffect, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import { AlertTitle, Autocomplete, Box, Button, Collapse, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, Select, TablePagination, TextField } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from "axios";
import DatePicker from 'react-datepicker';
import { format, subDays } from 'date-fns';
// import dayjs from 'dayjs';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FaArrowUp } from "react-icons/fa";
import Alert from '@mui/material/Alert';
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const ManageExpense = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState(subDays(new Date(), 15));
    const [endDate, setEndDate] = useState(new Date());
    const [expenseDate, setExpenseDate] = useState(new Date());
    const [paymentdate, setPaymentDate] = useState(new Date());
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedGSTOption, setSelectedGSTOption] = useState('withOut_GST');
    const [party, setParty] = useState('');
    const [gst, setGST] = useState('');
    const [gstIN, setGstIN] = useState('');
    const [total, setTotal] = useState(0);
    const [amount, setAmount] = useState(0);
    const [refNo, setRefNo] = useState('');
    const [remark, setRemark] = useState('');
    const [paymentType, setPaymentType] = useState('cash');
    const pdfIcon = process.env.PUBLIC_URL + '/pdf.png';

    const paymentOptions = [
        { id: 1, label: 'Cash' },
        { id: 2, label: 'Credit' },
        { id: 3, label: 'UPI' },
        { id: 4, label: 'Cheque' },
        { id: 5, label: 'Paytm' },
        { id: 6, label: 'CC/DC' },
        { id: 7, label: 'RTGS/NEFT' }]

    const token = localStorage.getItem("token");

    const expenseColumns = [
        { id: 'expense_date', label: 'Expense Date ', minWidth: 100 },
        { id: 'category', label: 'Category', minWidth: 100 },
        { id: 'payment_mode', label: 'Payment Mode', minWidth: 100 },
        { id: 'reference_no', label: 'Ref.No', minWidth: 100 },
        { id: 'remark', label: 'Remark', minWidth: 100 },
        { id: 'amount', label: 'Amount', minWidth: 100 },
        { id: 'gst', label: 'GST (%)', minWidth: 100 },
        { id: 'total', label: 'Total', minWidth: 100 },
    ];
    const [errors, setErrors] = useState({});
    const [expenseData, setExpenseData] = useState([])
    const [openAddPopUp, setOpenAddPopUp] = useState(false);
    const [openAddPopUpDownload, setOpenAddPopUpDownload] = useState(false);
    const [catagory, setCatagory] = useState('');
    const [catagoryList, setCatagoryList] = useState([]);
    const [bankData, setBankData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const ManageData = expenseData?.expense_list?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    useEffect(() => {
        CatagoryList();
        BankList();

    }, [])

    useEffect(() => {
        expenseList();
    }, [page, rowsPerPage, catagory]);

    const CatagoryList = async () => {
        let data = new FormData()
        setIsLoading(true);
        try {
            await axios.post('cash-category-list', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setCatagoryList(response.data.data)
                setIsLoading(false);


            })
        } catch (error) {
            console.error("API error:", error);

        }
    }


    const BankList = async () => {
        let data = new FormData()
        setIsLoading(true);
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
                setIsLoading(false);
            })
        } catch (error) {
            console.error("API error:", error);

        }
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    const handlePdf = () => {
        setOpenAddPopUpDownload(true)
        pdfGenerator();
    }
    const handleCloseDialog = () => {
        setOpenAddPopUp(false);
        setSelectedOption(null);
        setExpenseDate(new Date());
        setPaymentDate(new Date());
        setSelectedGSTOption('withOut_GST');
        setGST(null);
        setGstIN(null);
        setParty(null);
        setAmount(null);
        setTotal(null);
        setPaymentType(null);
        setRefNo(null);
        setErrors('')
        setRemark(null);
    }

    const handleGSTOption = (e) => {
        setSelectedGSTOption(e.target.value);
        setGST(null);
        setGstIN(null);
        setParty(null);
        setErrors('')
    }

    const handleGSTChange = (e) => {
        const value = e.target.value;
        if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
            setGST(value);
        }
    };

    const handleCategoryFilter = (e) => {
        setCatagory(e.target.value);
    }

    useEffect(() => {
        if (selectedGSTOption == 'with_GST') {
            const gstAmount = (parseFloat(amount) * parseFloat(gst)) / 100;
            const total = parseFloat(amount) + parseFloat(gstAmount);
            setTotal(total);
        } else {
            setTotal(amount)
        }
    }, [gst, amount])

    const handleStartDate = (newDate) => {
        setStartDate(newDate);
        expenseList();
    }

    const handleEndDate = (newDate) => {
        setEndDate(newDate);
        expenseList();
    }

    const validateForm = () => {
        const newErrors = {};
        if (!selectedOption) newErrors.selectedOption = 'Category is required';
        if (selectedGSTOption === 'with_GST') {
            if (!gst) newErrors.gst = 'GST is required';
            if (!gstIN) newErrors.gstIN = 'GSTN Number is required';
            if (!party) newErrors.party = 'Party Name is required';
            if (!amount) newErrors.amount = 'Amount is required';
        } else {
            if (!amount) newErrors.amount = 'Amount is required';
        }
        if (!paymentType) newErrors.paymentType = 'Payment Mode is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const pdfGenerator = async () => {
        let data = new FormData();

        try {
            const response = await axios.post("pdf-expense", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                // responseType: 'blob', // Ensure the response is in blob format
            });
            if (response.data.status === 401) {
                history.push('/');
                localStorage.clear();
            }

            // Create a Blob from the PDF Stream
            // const file = new Blob([response.data], { type: 'application/pdf' });

            // Create a URL for the Blob
            // const fileURL = URL.createObjectURL(file);

            // Open the URL in a new window
            // window.open(fileURL);

        } catch (error) {
            console.error("API error:", error);

        }
    };

    const expenseList = () => {
        let data = new FormData()

        const params = {
            start_date: startDate ? format(startDate, 'yyyy-MM-dd') : '',
            end_date: endDate ? format(endDate, 'yyyy-MM-dd') : '',
            category: catagory,
            page: page + 1,
            limit: rowsPerPage
        }
        setIsLoading(true);

        try {
            axios.post("list-expense", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                // setOpenAddPopUp(false);
                setExpenseData(response.data.data)
                setIsLoading(false);

            })
        } catch (error) {
            console.error("API error:", error);

        }
    }

    const handleAddExpense = async () => {
        if (validateForm()) {
            // Proceed with saving the expense
            let data = new FormData();
            data.append("category", selectedOption);
            data.append("expense_date", expenseDate ? format(expenseDate, 'yyyy-MM-dd') : '')
            data.append("payment_date", paymentdate ? format(paymentdate, 'yyyy-MM-dd') : '',)
            data.append("gst_type", selectedGSTOption);
            data.append('gst', gst)
            data.append('gstn_number', gstIN)
            data.append('party', party)
            data.append('amount', amount)
            data.append("total", total);
            data.append("payment_mode", paymentType);
            data.append("reference_no", refNo);
            data.append("remark", remark);

            try {
                await axios.post("add-expense", data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
                ).then((response) => {
                    expenseList();
                    setOpenAddPopUp(false);
                    setSelectedOption(null);
                    setExpenseDate(new Date());
                    setPaymentDate(new Date());
                    setSelectedGSTOption('withOut_GST');
                    setGST(null);
                    setGstIN(null);
                    setParty(null);
                    setAmount(null);
                    setTotal(null);
                    setPaymentType(null);
                    setRefNo(null);
                    setErrors('')
                    setRemark(null);
                    toast.success(response.data.message);
                    setTimeout(() => {
                        setOpenAddPopUp(false);
                    }, 2000);
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
                {isLoading ? <div className="loader-container ">
                    <Loader />
                </div> :
                    <div>
                        <div style={{ backgroundColor: 'rgb(239 239 239)', height: "calc(100vh - 225px)", padding: '0px 20px 0px' }}>
                            <div className='py-3 mng_expnse_main_hdr' style={{ display: 'flex', gap: '4px' }}>
                                <div style={{ display: 'flex', gap: '7px', marginBottom: "10px", alignItems: 'center' }}>
                                    <span style={{ color: 'var(--color1)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px', whiteSpace: "nowrap" }} >Manage Expense
                                    </span>
                                    <BsLightbulbFill className="w-6 h-6 secondary hover-yellow" />
                                </div>
                                <div className="headerList both_btn_expn" style={{ marginBottom: "10px" }}>
                                    <Button variant="contained" className="gap-2 add_btn_expn" style={{ textTransform: 'none', background: "var(--color1)" }} onClick={() => setOpenAddPopUp(true)}> <AddIcon className="" />Add</Button>
                                    <Button
                                        variant="contained"
                                        className="gap-7 add_btn_expn"
                                        style={{
                                            background: "var(--color1)",
                                            color: "white",
                                            // paddingLeft: "35px",
                                            textTransform: "none",
                                            display: "flex",
                                        }}
                                        onClick={handlePdf}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <img src="/csv-file.png"
                                                className="report-icon absolute mr-10"
                                                alt="csv Icon"
                                            />
                                        </div>
                                        Download
                                    </Button>
                                </div>
                            </div>
                            <div className="firstrow flex flex-col md:flex-row justify-between gap-4 md:gap-0">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div >
                                        <span className="text-gray-500 py-2" >Start Date</span>
                                        <div >
                                            <DatePicker
                                                className='md:mt-0 min-h-[41px] h-[41px] flex items-center justify-center custom-datepicker_mn'
                                                selected={startDate}
                                                onChange={handleStartDate}
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500" >End Date</span>
                                        <div >
                                            <DatePicker
                                                className='md:mt-0 min-h-[41px] h-[41px] flex items-center justify-center custom-datepicker_mn'
                                                selected={endDate}
                                                onChange={handleEndDate}
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                    </div>

                                    <div >
                                        <span className="text-gray-500" >Category</span>
                                        <div>
                                            <Select
                                                labelId="dropdown-label"
                                                className="category_fld"
                                                id="dropdown"
                                                value={catagory}
                                                sx={{ width: '100%' }}
                                                onChange={handleCategoryFilter}
                                                size="small"
                                                displayEmpty
                                            >
                                                <MenuItem value="">All</MenuItem>
                                                {catagoryList?.map(option => (
                                                    <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="total_mng_expn" style={{ background: "#f3f3f3", padding: "12px", borderRadius: "10px", whiteSpace: "nowrap" }}  >
                                        <div>
                                            <div className="relative" >
                                                <h2 className="primary font-medium text-xl ">Total </h2>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <div>
                                                <h2 className="secondary font-bold text-xl ">Rs.{Number(expenseData.total).toFixed(2)}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto mt-4" >
                                <table className="w-full border-collapse custom-table" style={{ whiteSpace: "nowrap", borderCollapse: "separate", borderSpacing: "0 6px" }}>
                                    <thead >
                                        <tr>
                                            {expenseColumns.map((column) => (
                                                <th key={column.id} style={{ minWidth: column.minWidth }}>
                                                    {column.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody style={{ backgroundColor: "#3f621217" }}>
                                        {ManageData?.map((item, index) => (
                                            <tr key={index} >
                                                {expenseColumns.map((column, colIndex) => (
                                                    <td key={column.id} style={colIndex === 0 ? { borderRadius: "10px 0 0 10px" } : expenseColumns.length - 1 === colIndex ? { borderRadius: "0 10px 10px 0" } : {}}>
                                                        {item[column.id]}
                                                    </td>
                                                ))}

                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 12]}
                                component="div"
                                count={expenseData?.expense_list?.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </div>

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

                        {/* <Dialog open={openAddPopUp}
                        sx={{
                            "& .MuiDialog-container": {
                                "& .MuiPaper-root": {
                                    width: "40%",
                                    maxWidth: "1500px",  // Set your width here
                                },
                            },
                        }}
                        >
                            <DialogTitle id="alert-dialog-title" className="secondary">
                                Add Expense
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
                                    <div className="flex gap-8 mb-3">
                                        <div style={{ width: '30%', borderRight: "1px solid #1565c0" }}>
                                            <span className="ExpenseBoxTitle">Category</span>
                                            <div className="pl-5">
                                                <FormControl>
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        defaultValue="items"
                                                        name="radio-buttons-group"
                                                        value={selectedOption}
                                                        onChange={(e) => setSelectedOption(e.target.value)}
                                                        sx={{ color: 'black' }}
                                                    >
                                                        {catagoryList.map((category) => (
                                                            <FormControlLabel
                                                                key={category.id}
                                                                value={category.id}
                                                                control={<Radio />}
                                                                label={capitalizeFirstLetter(category.name)}
                                                            />
                                                        ))}
                                                    </RadioGroup>
                                                </FormControl>
                                                {errors.selectedOption && <div className="error">{errors.selectedOption}</div>}
                                            </div>
                                        </div>
                                        <div className="flex gap-5 flex-col">
                                            <div className="flex gap-5">
                                                <div className="detail">
                                                    <span className="ExpenseBoxSubTitle">Expense Date</span>
                                                    <DatePicker
                                                        className='custom-datepicker '
                                                        selected={expenseDate}
                                                        onChange={(newDate) => setExpenseDate(newDate)}
                                                        dateFormat="dd/MM/yyyy"
                                                    />
                                                    {errors.expenseDate && <div className="error">{errors.expenseDate}</div>}
                                                </div>
                                                <div className="detail">
                                                    <span className="ExpenseBoxSubTitle">Payment Date</span>
                                                    <DatePicker
                                                        className='custom-datepicker '
                                                        selected={paymentdate}
                                                        onChange={(newDate) => setPaymentDate(newDate)}
                                                        dateFormat="dd/MM/yyyy"
                                                    />
                                                    {errors.paymentdate && <div className="error">{errors.paymentdate}</div>}
                                                </div>
                                            </div>

                                            <div>
                                                <FormControl>
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        defaultValue="items"
                                                        name="radio-buttons-group"
                                                        value={selectedGSTOption}
                                                        onChange={handleGSTOption}
                                                        style={{ flexDirection: "row", gap: 20 }}
                                                        className="ExpenseBoxTitle"
                                                    >
                                                        <FormControlLabel value="with_GST" control={<Radio />} label="With GST" />
                                                        <FormControlLabel value="withOut_GST" control={<Radio />} label="Without GST" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>

                                            {selectedGSTOption === 'with_GST' &&
                                                <>
                                                    <div className="flex gap-5">
                                                        <div className="detail">
                                                            <span className="ExpenseBoxSubTitle">GST(%)</span>
                                                            <TextField
                 autoComplete="off"
                                                                required
                                                                id="outlined-number"
                                                                type="number"
                                                                style={{ width: '150px' }}
                                                                size="small"
                                                                value={gst}
                                                                onChange={handleGSTChange}
                                                                inputProps={{ min: 0, max: 100 }}
                                                            />
                                                            {errors.gst && <div className="error">{errors.gst}</div>}
                                                        </div>
                                                        <div className="detail">
                                                            <span className="ExpenseBoxSubTitle">GSTN Number</span>
                                                            <TextField
                 autoComplete="off"
                                                                required
                                                                id="outlined-number"
                                                                // type="number"
                                                                style={{ width: '250px', textTransform: "uppercase" }}
                                                                size="small"
                                                                value={gstIN}
                                                                onChange={(e) => setGstIN(e.target.value.toUpperCase())}
                                                            />
                                                            {errors.gstIN && <div className="error">{errors.gstIN}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="detail">
                                                        <span className="ExpenseBoxSubTitle">Party Name</span>
                                                        <TextField
                 autoComplete="off"
                                                            required
                                                            id="outlined-number"
                                                            style={{ width: '420px' }}
                                                            size="small"
                                                            value={party}
                                                            onChange={(e) => setParty(e.target.value)}
                                                        />
                                                        {errors.party && <div className="error">{errors.party}</div>}
                                                    </div>
                                                </>
                                            }



                                            <div className="flex gap-5">
                                                <div className="detail">
                                                    <span className="ExpenseBoxSubTitle">Amount (Excluding GST)</span>
                                                    <TextField
                 autoComplete="off"
                                                        required
                                                        id="outlined-number"
                                                        type="number"
                                                        style={{ width: '200px' }}
                                                        size="small"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                    />
                                                    {errors.amount && <div className="error">{errors.amount}</div>}
                                                </div>
                                                <div className="detail">
                                                    <span className="ExpenseBoxSubTitle">Total</span>
                                                    <TextField
                 autoComplete="off"
                                                        required
                                                        id="outlined-number"
                                                        type="number"
                                                        style={{ width: '200px' }}
                                                        size="small"
                                                        value={total}
                                                        onChange={(e) => setTotal(e.target.value)}
                                                    />
                                                    {errors.total && <div className="error">{errors.total}</div>}
                                                </div>
                                            </div>

                                            <div className="flex gap-5">
                                                <div className="detail">
                                                    <span className="ExpenseBoxSubTitle">Payment Mode</span>
                                                    <Select
                                                        labelId="dropdown-label"
                                                        id="dropdown"
                                                        value={paymentType}
                                                        sx={{ minWidth: '200px' }}
                                                        onChange={(e) => setPaymentType(e.target.value)}
                                                        size="small"
                                                    >
                                                        <MenuItem value="cash">Cash</MenuItem>
                                                        {bankData?.map(option => (
                                                            <MenuItem key={option.id} value={option.id}>{option.bank_name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                    {errors.paymentType && <div className="error">{errors.paymentType}</div>}
                                                </div>
                                                <div className="detail">
                                                    <span className="ExpenseBoxSubTitle">Reference No.</span>
                                                    <TextField
                 autoComplete="off"
                                                        required
                                                        id="outlined-number"
                                                        type="number"
                                                        style={{ width: '200px' }}
                                                        size="small"
                                                        value={refNo}
                                                        onChange={(e) => setRefNo(e.target.value)}
                                                    />
                                                    {errors.refNo && <div className="error">{errors.refNo}</div>}
                                                </div>


                                            </div>
                                            <div className="detail">
                                                <span className="ExpenseBoxSubTitle">Remark</span>
                                                <TextField
                 autoComplete="off"
                                                    required
                                                    id="outlined-number"
                                                    style={{ width: '200px' }}
                                                    size="small"
                                                    value={remark}
                                                    onChange={(e) => setRemark(e.target.value)}
                                                />
                                                {errors.remark && <div className="error">{errors.remark}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus variant="contained" color="success" onClick={handleAddExpense}>
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog> */}

                        <Dialog open={openAddPopUp}>
                            <DialogTitle id="alert-dialog-title" className="primary">
                                Add Expense
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
                                    <div className="flex flex-col sm:flex-col md:flex-row gap-4 mb-3">
                                        <div className="w-full lg:w-1/3 border-b md:border-b-0 md:border-r" style={{ display: 'flex', flexDirection: 'column', lineHeight: '2rem', width: 'inherit' }}>
                                            <span className="primary">Category</span>
                                            <FormControl style={{ whiteSpace: 'nowrap' }}>
                                                <RadioGroup
                                                    aria-labelledby="demo-radio-buttons-group-label"
                                                    defaultValue="items"
                                                    name="radio-buttons-group"
                                                    sx={{
                                                        color: "var(--color1)", // Apply color to labels
                                                        '& .MuiRadio-root': {
                                                            color: "var(--color2)", // Unchecked radio button color
                                                        },
                                                        '& .Mui-checked': {
                                                            color: "var(--color1)", // Checked radio button color
                                                        },
                                                    }}
                                                    value={selectedOption}
                                                    onChange={(e) => setSelectedOption(e.target.value)}
                                                >
                                                    {catagoryList.map((category) => (
                                                        <FormControlLabel
                                                            style={{ color: 'var(--COLOR_UI_PHARMACY)' }}
                                                            key={category.id}
                                                            value={category.id}
                                                            control={<Radio />}
                                                            label={capitalizeFirstLetter(category.name)}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            {errors.selectedOption && <div className="error">{errors.selectedOption}</div>}

                                        </div>
                                        <div className="w-full lg:w-2/3 flex flex-col gap-5">
                                            <div className="flex flex-col md:flex-row gap-5">
                                                <div className="w-full md:w-1/2">
                                                    <span className="" style={{ color: 'var(--COLOR_UI_PHARMACY)' }}>Expense Date</span>
                                                    <DatePicker
                                                        className='custom-datepicker_mn w-[170px]'
                                                        selected={expenseDate}
                                                        onChange={(newDate) => setExpenseDate(newDate)}
                                                        dateFormat="dd/MM/yyyy"
                                                    />
                                                    {errors.expenseDate && <div className="error">{errors.expenseDate}</div>}
                                                </div>
                                                <div className="w-full md:w-1/2">
                                                    <span className="" style={{ color: 'var(--COLOR_UI_PHARMACY)' }}>Payment Date</span>
                                                    <DatePicker
                                                        className='custom-datepicker_mn w-[170px]'
                                                        selected={paymentdate}
                                                        onChange={(newDate) => setPaymentDate(newDate)}
                                                        dateFormat="dd/MM/yyyy"
                                                    />
                                                    {errors.paymentdate && <div className="error">{errors.paymentdate}</div>}
                                                </div>
                                            </div>
                                            <div >
                                                <FormControl className="flex">
                                                    <RadioGroup
                                                        aria-labelledby="demo-radio-buttons-group-label"
                                                        defaultValue="items"
                                                        name="radio-buttons-group"
                                                        value={selectedGSTOption}
                                                        onChange={handleGSTOption}
                                                        className="flex"
                                                        sx={{
                                                            color: "var(--color1)", // Apply color to labels
                                                            '& .MuiRadio-root': {
                                                                color: "var(--color2)", // Unchecked radio button color
                                                            },
                                                            '& .Mui-checked': {
                                                                color: "var(--color1)", // Checked radio button color
                                                            },
                                                        }}
                                                    >
                                                        <FormControlLabel value="with_GST" style={{ color: 'var(--COLOR_UI_PHARMACY)' }} control={<Radio />} label="With GST" />
                                                        <FormControlLabel value="withOut_GST" style={{ color: 'var(--COLOR_UI_PHARMACY)' }} control={<Radio />} label="Without GST" />
                                                    </RadioGroup>
                                                </FormControl>
                                            </div>

                                            {selectedGSTOption === 'with_GST' && (
                                                <>
                                                    <div className="flex flex-col md:flex-row gap-5">
                                                        <div className="w-full md:w-1/2" style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span className="" style={{ color: 'var(--COLOR_UI_PHARMACY)' }}>GST(%)</span>
                                                            <TextField
                                                                autoComplete="off"
                                                                required

                                                                type="number"
                                                                size="small"
                                                                value={gst}
                                                                onChange={handleGSTChange}
                                                            // inputProps={{ min: 0, max: 100 }}
                                                            />
                                                            {errors.gst && <div className="error">{errors.gst}</div>}
                                                        </div>
                                                        <div className="w-full md:w-1/2" style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span className="" style={{ color: 'var(--COLOR_UI_PHARMACY)' }}>GSTN Number</span>
                                                            <TextField
                                                                autoComplete="off"
                                                                required
                                                                size="small"
                                                                value={gstIN}
                                                                onChange={(e) => setGstIN(e.target.value.toUpperCase())}
                                                            />
                                                            {errors.gstIN && <div className="error">{errors.gstIN}</div>}
                                                        </div>
                                                    </div>
                                                    <div className="w-full md:w-1/2" style={{ display: 'flex', flexDirection: 'column' }}>
                                                        <span className="" style={{ color: 'var(--COLOR_UI_PHARMACY)' }}>Party Name</span>
                                                        <TextField
                                                            autoComplete="off"
                                                            required
                                                            size="small"
                                                            value={party}
                                                            onChange={(e) => setParty(e.target.value)}
                                                        />
                                                        {errors.party && <div className="error">{errors.party}</div>}
                                                    </div>
                                                </>
                                            )}

                                            <div className="flex flex-col md:flex-row gap-5">
                                                <div className="w-full md:w-1/2" style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className="" style={{ color: 'var(--COLOR_UI_PHARMACY)' }}>without GST Amount</span>
                                                    {/* <span className="ExpenseBoxSubTitle">Amount(Excluding GST)</span> */}
                                                    <TextField
                                                        autoComplete="off"
                                                        required
                                                        type="number"
                                                        size="small"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                    />
                                                    {errors.amount && <div className="error">{errors.amount}</div>}
                                                </div>
                                                <div className="w-full md:w-1/2" style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className="" style={{ color: 'var(--COLOR_UI_PHARMACY)' }}>Total</span>
                                                    <TextField
                                                        autoComplete="off"
                                                        required
                                                        type="number"
                                                        size="small"
                                                        value={total}
                                                        onChange={(e) => setTotal(e.target.value)}
                                                    />
                                                    {errors.total && <div className="error">{errors.total}</div>}
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-5">
                                                <div className="w-full md:w-1/2" style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className="" style={{ color: 'var(--COLOR_UI_PHARMACY)' }}>Payment Mode</span>
                                                    <Select
                                                        className="w-full md:w-full"
                                                        value={paymentType}
                                                        onChange={(e) => setPaymentType(e.target.value)}
                                                        size="small"
                                                    >
                                                        <MenuItem value="cash">Cash</MenuItem>
                                                        {bankData?.map(option => (
                                                            <MenuItem key={option.id} value={option.id}>{option.bank_name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                    {errors.paymentType && <div className="error">{errors.paymentType}</div>}
                                                </div>
                                                <div className="w-full md:w-1/2" style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className="" style={{ color: 'var(--COLOR_UI_PHARMACY)' }}>Reference No.</span>
                                                    <TextField
                                                        autoComplete="off"
                                                        required
                                                        type="number"
                                                        size="small"
                                                        value={refNo}
                                                        onChange={(e) => setRefNo(e.target.value)}
                                                    />
                                                    {errors.refNo && <div className="error">{errors.refNo}</div>}
                                                </div>
                                            </div>
                                            <div className="flex flex-col md:flex-row gap-5">
                                                <div className="w-full md:w-1/2" style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span className="" style={{ color: 'var(--COLOR_UI_PHARMACY)' }}>Remark</span>
                                                    <TextField
                                                        autoComplete="off"
                                                        required
                                                        size="small"
                                                        value={remark}
                                                        onChange={(e) => setRemark(e.target.value)}
                                                    />
                                                    {errors.remark && <div className="error">{errors.remark}</div>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions style={{ padding: '20px 24px' }}>
                                <Button autoFocus variant="contained" style={{ background: "var(--COLOR_UI_PHARMACY)" }} onClick={handleAddExpense}>
                                    Save
                                </Button>
                            </DialogActions>
                        </Dialog>

                    </div>
                }
            </div>
        </>
    )
}
export default ManageExpense