import Loader from "../../../../componets/loader/Loader"
import Header from "../../../Header"
import React, { useEffect, useState } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { BsLightbulbFill } from "react-icons/bs";
import { Button, Checkbox, Chip, InputAdornment, OutlinedInput, TextField } from "@mui/material";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { toast, ToastContainer } from "react-toastify";
import usePermissions, { hasPermission } from "../../../../componets/permission";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const CustomerList = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [openUpload, setOpenUpload] = useState(false);
    const [openAddPopUp, setOpenAddPopUp] = useState(false);
    const [paymentMode, setPaymentMode] = useState([])
    const [customer, setCustomer] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [amount, setAmount] = useState(0);
    const [area, setArea] = useState('');
    const [address, setAddress] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [emailId, setEmailId] = useState('');
    const history = useHistory();
    const rowsPerPage = 12;
    const token = localStorage.getItem("token");
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [buttonLabel, setButtonLabel] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [header, setHeader] = useState('');
    const [customerID, setCustomerID] = useState(null);
    const permissions = usePermissions();
    const [chipState, setChipState] = useState({
        variant: 'default',
        value: '',
    });
    const columns = [
        { id: 'name', label: 'Customer Name', minWidth: 100 },
        { id: 'phone_number', label: 'Mobile No', minWidth: 100 },
        { id: 'email', label: 'Email ID', minWidth: 100 },
        { id: 'area', label: 'Area', minWidth: 100 },
        { id: 'total_amount', label: 'Amount', minWidth: 100 },
        { id: 'state', label: 'state', minWidth: 100 },

        // { id: 'due_amount', label: 'Due Amount', minWidth: 100 },
    ];
    const initialSearchTerms = columns.map(() => '');
    const [searchTerms, setSearchTerms] = useState(initialSearchTerms);

    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    const paginatedData = tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const excelIcon = process.env.PUBLIC_URL + '/excel.png';
    const handlePrint = () => {
        window.print('/return/add');
    };
    const goIntoAdd = () => {
        history.push('/return/add')
    }
    const allOptions = [
        'dueOnly',
        'active',
        'deactivate',
        // ...tableData.map(bank => bank.id),
        // 'loyaltyPoints'
    ];
    const exportToExcel = async () => {
        let data = new FormData();
        setIsLoading(true);
        data.append('page', currentPage);
        data.append('iss_value', 'download');
        const params = {
            page: currentPage
        }
        try {
            await axios.post("list-customer?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                const csvData = response.data.data;
                if (csvData) {
                    const csvString = convertToCSV(csvData);
                    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
                    saveAs(blob, 'customers.csv');
                }

                setTableData(response.data.data)
                setIsLoading(false);
               
            })
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);

        }
    };

    const convertToCSV = (data) => {
        const array = [Object.keys(data[0])].concat(data);

        return array.map(it => {
            return Object.values(it).toString();
        }).join('\n');
    };

    const handleChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10) {
            setMobileNo(value);
        }
    };

    const resetAddDialog = () => {
        setCustomer('');
        setMobileNo('');
        setEmailId('');
        setAddress('');
        setAmount(0);
        setArea('');
        setCity('');
        setState('')
        setErrors({});
        setOpenAddPopUp(false);
    }

    const handleEditOpen = (row) => {
        setOpenAddPopUp(true);
        setCustomerID(row.id);
        setIsEditMode(true);
        setHeader('Edit Customer');
        setButtonLabel('Update')
        setCustomer(row.name);
        setMobileNo(row.phone_number);
        setEmailId(row.email);
        setAmount(row.balance);
        setArea(row.area);
        setCity(row.city);
        setState(row.state);

        setAddress(row.address);
    }

    const handelAddOpen = () => {
        setOpenAddPopUp(true);
        setHeader('Add Customer');
        setButtonLabel('Save')
    }

    const Addcustomer = () => {
        if (isEditMode == false) {
            //  Add Customer 
            const newErrors = {};
            if (!customer) newErrors.customer = 'Customer is required';
            if (!state) newErrors.customer = 'State is required';

            if (!mobileNo) {
                newErrors.mobileNo = 'Mobile No is required';
            } else if (!/^\d{10}$/.test(mobileNo)) {
                newErrors.mobileNo = 'Mobile number must be 10 digits';
            }
            setErrors(newErrors);
            const isValid = Object.keys(newErrors).length === 0;
            if (isValid) {
                AddCustomerRecord();
            }
            return isValid;
        }
        else {
            const newErrors = {};
            if (!customer) newErrors.customer = 'Customer is required';
            if (!mobileNo) {
                newErrors.mobileNo = 'Mobile No is required';
            } else if (!/^\d{10}$/.test(mobileNo)) {
                newErrors.mobileNo = 'Mobile number must be 10 digits';
            }
            setErrors(newErrors);
            const isValid = Object.keys(newErrors).length === 0;
            if (isValid) {
                EditCustomerRecord();
            }
            return isValid;
        }
    };

    const AddCustomerRecord = async () => {
        let data = new FormData();
        data.append('name', customer);
        data.append('email', emailId);
        data.append('mobile_no', mobileNo);
        data.append('city', city);
        data.append('area', area);
        data.append('amount', amount);
        data.append('address', address);
        data.append('state', state);

        try {
            await axios.post("create-customer", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                customerAllData();
                setOpenAddPopUp(false);
                setCustomer('');
                setEmailId('');
                setMobileNo('');
                setCity('');
                setState('');

                setArea('');
                setAmount('');
                setAddress('');
                toast.success(response.data.message);
               
            })
        } catch (error) {
            setIsLoading(false);
            if (error.response.data.status == 400) {

                toast.error(error.response.data.message)
            }
            // console.error("API error:", error);

        }
    }

    const uploadCustomerFile = async () => {
        let data = new FormData();
        data.append('file', file);
        try {
            await axios.post("import-customer", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                //console.log(response.data.data)
                customerAllData();
                setOpenUpload(false);
                toast.success(response.data.message)
               
            })
        } catch (error) {
            if (error.response && error.response.status === 500) {
                toast.error('Please Select file');
            }
            // toast.error(error.data.message)
            console.error("API error:", error);

        }

    }

    const EditCustomerRecord = async () => {
        let data = new FormData();
        data.append('id', customerID);
        data.append('name', customer);
        data.append('email', emailId);
        data.append('mobile_no', mobileNo);
        data.append('city', city);
        data.append('area', area);
        data.append('amount', amount);
        data.append('address', address);
        try {
            await axios.post("update-customer", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                //console.log(response.data.data)
                customerAllData();
                setOpenAddPopUp(false);
                toast.success(response.data.message);
                setCustomer('');
                setIsEditMode(false)
                setEmailId('');
                setMobileNo('');
                setCity('');
                setState('');

                setArea('');
                setAmount('');
                setAddress('');
               
            })
        } catch (error) {
            if (error.response.data.status == 400) {

                toast.error(error.response.data.message)
            }
            console.error("API error:", error);

        }
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            customerAllData(newPage);
        }
    };

    const handleNext = () => {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        customerAllData(newPage);
    };

    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        customerAllData(pageNum);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type;
            if (fileType === 'text/csv') {
                setFile(selectedFile);
            } else {
                toast.error('Please select an Excel or CSV file.');
            }
        }
    };

    const handleDownload = () => {
        //console.log('Download function called');
        const link = document.createElement('a');
        link.href = '/Customer_Sample_Data.csv';
        link.download = 'Customer_Sample_Data.csv';
        //console.log('Link href:', link.href);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const openFilePopUP = () => {
        setOpenUpload(true);
    }

    const handleChipClick = () => {
        if (chipState.value === '') {
            setChipState({
                variant: 'outlined',
                value: 'due_only',
            });
            customerAllData();
            //console.log('purchase', 'due_Only');
        } else {
            setChipState({
                variant: 'default',
                value: '',
            });
            customerAllData();
            //console.log('purchase', '');
        }
    };


    const filteredList = paginatedData.filter(row => {
        return searchTerms.every((term, index) => {
            const value = row[columns[index].id];
            return String(value).toLowerCase().includes(term.toLowerCase());
        });
    });

    const sortByColumn = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...tableData].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setTableData(sortedData);
    };

    const handleSearchChange = (index, value) => {
        const newSearchTerms = [...searchTerms];
        newSearchTerms[index] = value;
        setSearchTerms(newSearchTerms);
    };

    useEffect(() => {
        customerAllData();
    }, []);

    const customerAllData = async (currentPage) => {
        let data = new FormData();
        setIsLoading(true);
        data.append('page', currentPage);
        data.append('due_only', chipState?.value);

        const params = {
            page: currentPage
        }
        try {
            await axios.post("list-customer?", data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setTableData(response.data.data)
                setIsLoading(false);
               
            })
        } catch (error) {
            setIsLoading(false);
            console.error("API error:", error);

        }
    }

    const bankIdToNameMap = tableData.reduce((map, bank) => {
        map[bank.id] = bank.bank_name;
        return map;
    }, {});

    const handleChangeFilter = (event) => {
        const { value } = event.target;

        if (value.includes('all')) {
            if (paymentMode.length === allOptions.length) {
                // Deselect all options
                setPaymentMode([]);
            } else {
                // Select all options
                setPaymentMode(allOptions);
            }
        } else {
            setPaymentMode(value);
        }

        // setPaymentMode(event.target.value);
    };
    const renderValue = (selected) => {
        return selected.map((value) => {
            if (value === 'dueOnly') return 'Due Only';
            if (value === 'active') return 'Active';
            if (value === 'deactivate') return 'Deactivate';
            return bankIdToNameMap[value] || value;
        }).join(', ');
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
                <div style={{ backgroundColor: 'rgba(153, 153, 153, 0.1)', height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }}>
                    <div className='py-3' style={{ display: 'flex', gap: '4px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', width: '500px', gap: '7px' }}>
                            <span style={{ color: 'var(--color1)', display: 'flex', fontWeight: 700, fontSize: '20px' }}>Customers</span>
                            <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow" />
                        </div>
                        <div className="headerList">
                            {hasPermission(permissions, "customer import") &&
                                <Button variant="contained" style={{ background: 'var(--color1)', display: 'flex', gap: '10px', }} onClick={openFilePopUP} ><CloudUploadIcon /> Import</Button>}
                            {hasPermission(permissions, "customer create") &&
                                <Button variant="contained" color="primary" style={{ background: 'var(--color1)', display: 'flex', gap: '0px' }} onClick={handelAddOpen}><AddIcon /> Add</Button>}
                            {hasPermission(permissions, "customer download") &&
                                <Button variant="contained" style={{ background: 'var(--color1)', color: 'white', paddingLeft: "35px", textTransform: 'none' }} onClick={exportToExcel}>
                                    <img src="/csv-file.png"
                                        className="report-icon absolute mr-10"
                                        alt="csv Icon"
                                    />Download</Button>}
                        </div>
                    </div>
                    <div className="bg-white p-4">
                        <div className="flex flex-wrap gap-6">
                            <Chip label="Due Only" style={{ backgroundColor: "#3f6212", color: "white" }}
                                value={chipState.value}
                                variant={chipState.variant}
                                onClick={handleChipClick} />

                            {/* <FormControl sx={{ minWidth: 240 }} size="small">
                                <InputLabel id="demo-select-small-label">All Payment Mode</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    multiple
                                    value={paymentMode}
                                    onChange={handleChangeFilter}
                                    renderValue={renderValue}
                                    label="All Payment Mode"
                                >
                                    <MenuItem value="" disabled >
                                        Customer Due Payment
                                    </MenuItem>
                                    <MenuItem value="dueOnly">
                                        <Checkbox 
sx={{
    color: "var(--color2)", // Color for unchecked checkboxes
    '&.Mui-checked': {
      color: "var(--color1)", // Color for checked checkboxes
    },
  }} checked={paymentMode.indexOf('dueOnly') > -1} />
                                        <ListItemText primary="Due Only" />
                                    </MenuItem>
                                    <MenuItem value="active">
                                        <Checkbox 
sx={{
    color: "var(--color2)", // Color for unchecked checkboxes
    '&.Mui-checked': {
      color: "var(--color1)", // Color for checked checkboxes
    },
  }} checked={paymentMode.indexOf('active') > -1} />
                                        <ListItemText primary="Active" />
                                    </MenuItem>
                                    <MenuItem value="deactivate">
                                        <Checkbox 
sx={{
    color: "var(--color2)", // Color for unchecked checkboxes
    '&.Mui-checked': {
      color: "var(--color1)", // Color for checked checkboxes
    },
  }} checked={paymentMode.indexOf('deactivate') > -1} />
                                        <ListItemText primary="Deactivate" />
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <div>
                                <Button
                                    variant="contained"
                                    size="small"
                                    style={{
                                        minHeight: '38px',
                                        alignItems: "center",
                                        background: "var(--color1)"
                                    }}
                                // onClick={filterData}
                                >
                                    <FilterAltIcon size='large' style={{ color: "white", fontSize: '20px' }} /> Filter
                                </Button>
                            </div> */}
                        </div>
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full border-collapse custom-table">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th>SR. No
                                        </th>
                                        {columns.map((column, index) => (
                                            <th key={column.id} >

                                                <div className='headerStyle'>
                                                    <span>{column.label}</span><SwapVertIcon style={{ cursor: 'pointer' }} onClick={() => sortByColumn(column.id)} />
                                                    <TextField
                 autoComplete="off"
                                                        label={`Search ${column.label}`}
                                                        id="filled-basic"
                                                        size="small"
                                                        value={searchTerms[index]}
                                                        onChange={(e) => handleSearchChange(index, e.target.value)}
                                                    />
                                                </div>
                                            </th>

                                        ))}
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredList.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length + 2} style={{ textAlign: 'center', color: 'gray' }}>
                                                No data found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredList.map((row, index) => {
                                            return (
                                                <tr hover role="checkbox" tabIndex={-1} key={row.code}>
                                                    <td>
                                                        {startIndex + index}
                                                    </td>
                                                    {columns.map((column) => {
                                                        let value = row[column.id];
                                                        let style = {};

                                                        // Apply red color if the column is 'due_amount' and status is 'due'
                                                        if (column.id === 'total_amount' && row.status === 'due') {
                                                            style.color = 'var(--color6)';
                                                        } else if (column.id === 'total_amount' && row.status === '') {
                                                            style.color = 'var(--color2)';
                                                        }

                                                        // Lowercase email if it's not already in lowercase
                                                        if (column.id === 'email') {
                                                            if (value && value[0] !== value[0].toLowerCase()) {
                                                                value = value.toLowerCase();
                                                            }
                                                            style.textTransform = 'none';
                                                        }

                                                        return (
                                                            <td key={column.id} align={column.align} onClick={() => { history.push(`/more/customerView/${row.id}`) }} style={style}>
                                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                                            </td>
                                                        );
                                                    })}

                                                    <td style={{ fontSize: '15px', display: 'flex', gap: '5px', color: 'gray', cursor: 'pointer' }}>
                                                        <VisibilityIcon style={{ color: "var(--color1)" }} onClick={() => { history.push(`/more/customerView/${row.id}`) }} />
                                                        {hasPermission(permissions, "customer edit") && row.name !== 'Direct Customers' && (
                                                            <BorderColorIcon
                                                                style={{ color: "var(--color1)" }} onClick={() => handleEditOpen(row)} disabled={row.name == 'Direct Customers'} />)}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>

                                {/* <tbody>

                                    {filteredList.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length + 2} style={{ textAlign: 'center', color: 'gray' }}>
                                                No data found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredList.map((row, index) => {
                                            return (
                                                <tr hover role="checkbox" tabIndex={-1} key={row.code} >
                                                    <td>
                                                        {startIndex + index}
                                                    </td>
                                                    {columns.map((column) => {
                                                        let value = row[column.id];
                                                        if (column.id === 'email') {
                                                            if (value && value[0] !== value[0].toLowerCase()) {
                                                                value = value.toLowerCase();
                                                            }
                                                        } 
                                                        return (
                                                            <td key={column.id} align={column.align} onClick={() => { history.push(`/more/customerView/${row.id}`) }} style={column.id === 'email' ? { textTransform: 'none' } : {}}>
                                                                {column.format && typeof value === 'number' ? column.format(value) : value}
                                                            </td>
                                                        );
                                                    })}

                                                    <td style={{ fontSize: '15px', display: 'flex', gap: '5px', color: 'gray', cursor: 'pointer' }}>
                                                        <VisibilityIcon style={{ color: "#1976d2" }} onClick={() => { history.push(`/more/customerView/${row.id}`) }} />
                                                        {hasPermission(permissions, "customer edit") && (
                                                            <BorderColorIcon
                              style={{ color: "var(--color1)" }} color="primary" onClick={() => handleEditOpen(row)} />)}
                                                    </td>
                                                </tr>
                                            );
                                        }))}


                                </tbody> */}
                            </table>
                        </div>
                        <div className='mt-4 space-x-1' style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <button onClick={handlePrevious} className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'secondary-bg text-white'}`} disabled={currentPage === 1} >Previous </button>
                            {currentPage > 2 && (
                                <button
                                    onClick={() => handleClick(currentPage - 2)}
                                    className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                                >
                                    {currentPage - 2}
                                </button>
                            )}
                            {currentPage > 1 && (
                                <button
                                    onClick={() => handleClick(currentPage - 1)}
                                    className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                                >
                                    {currentPage - 1}
                                </button>
                            )}
                            <button
                                onClick={() => handleClick(currentPage)}
                                className="mx-1 px-3 py-1 rounded secondary-bg text-white"
                            >
                                {currentPage}
                            </button>
                            {currentPage < totalPages && (
                                <button
                                    onClick={() => handleClick(currentPage + 1)}
                                    className="mx-1 px-3 py-1 rounded bg-gray-200 text-gray-700"
                                >
                                    {currentPage + 1}
                                </button>
                            )}
                            <button onClick={handleNext} className={`mx-1 px-3 py-1 rounded ${currentPage === rowsPerPage ? 'bg-gray-200 text-gray-700' : 'secondary-bg text-white'}`}
                                disabled={filteredList.length === 0}>
                                Next </button>
                        </div>
                    </div>

                    {/* File Upload Popup */}
                    <Dialog open={openUpload} className="custom-dialog">
                        <DialogTitle id="alert-dialog-title " className="primary">
                            Import Customer
                        </DialogTitle>
                        <div className="px-6 ">
                            <Alert severity="warning">
                                <AlertTitle>Warning</AlertTitle>
                                Please Make Sure Repeated Email ID record is not accepted.
                            </Alert>
                        </div>
                        <IconButton
                            aria-label="close"
                            onClick={() => setOpenUpload(false)}
                            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent>

                            <DialogContentText id="alert-dialog-description">
                                <div className="primary">Item File Upload</div>
                                <div style={{ display: 'flex', gap: '15px', flexDirection: 'column' }}>
                                    <div>

                                        <input className="File-upload" type="file" accept=".csv" id="file-upload" onChange={handleFileChange} />
                                        <span className='errorFile'>*select only .csv File</span>
                                    </div>
                                    <div>

                                        <Button onClick={handleDownload} style={{ backgroundColor: "#3f6212", color: "white" }} className='downloadFile'>
                                            <CloudDownloadIcon className="mr-2" />

                                            Sample File Download
                                        </Button>
                                    </div>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus variant="contained" color="success" onClick={uploadCustomerFile}>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={openAddPopUp}
                    // sx={{
                    //     "& .MuiDialog-container": {
                    //         "& .MuiPaper-root": {
                    //             width: "36%",
                    //             maxWidth: "600px",  // Set your width here
                    //         },
                    //     },
                    // }}
                    >
                        <div className="flex justify-center items-center h-auto">
                            <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
                                <div className="flex justify-between items-center">
                                    <DialogTitle id="alert-dialog-title" className="primary">
                                        {header}
                                    </DialogTitle>
                                    <IconButton
                                        aria-label="close"
                                        onClick={resetAddDialog}
                                        className="text-gray-500"
                                    // sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </div>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                                                    <div className="mb-2" >
                                                        <span className="label primary mb-4" >Customer Name</span>
                                                        <span className="text-red-600 ml-1">*</span>
                                                    </div>
                                                    <TextField
                 autoComplete="off"
                                                        id="outlined-multiline-static"
                                                        size="small"
                                                        value={customer}
                                                        onChange={(e) => { setCustomer(e.target.value) }}
                                                        style={{ minWidth: 250 }}
                                                        variant="outlined"
                                                    />
                                                    {errors.customer && <span style={{ color: 'red', fontSize: '12px' }}>{errors.customer}</span>}
                                                </div>
                                                <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                                                    <div className="mb-2" >
                                                        <span className="label primary mb-4" >Mobile No</span>
                                                        <span className="text-red-600 ml-1">*</span>
                                                    </div>
                                                    <OutlinedInput
                                                        type="number"
                                                        value={mobileNo}
                                                        onChange={handleChange}
                                                        startAdornment={<InputAdornment position="start">+91</InputAdornment>}
                                                        style={{ minWidth: 250 }}
                                                        size="small"
                                                    />
                                                    {errors.mobileNo && <span style={{ color: 'red', fontSize: '12px' }}>{errors.mobileNo}</span>}
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                                                    <span className="label primary">Email ID</span>
                                                    <TextField
                 autoComplete="off"
                                                        id="outlined-multiline-static"
                                                        size="small"
                                                        value={emailId}
                                                        onChange={(e) => { setEmailId(e.target.value) }}
                                                        style={{ minWidth: 250 }}
                                                        variant="outlined"
                                                    />
                                                </div>
                                                <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                                                    <span className="label primary">Amount</span>
                                                    <TextField
                 autoComplete="off"
                                                        id="outlined-multiline-static"
                                                        size="small"
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e) => { setAmount(e.target.value) }}
                                                        style={{ minWidth: 250 }}
                                                        variant="outlined"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                                                    <span className="label primary">Area</span>
                                                    <TextField
                 autoComplete="off"
                                                        id="outlined-multiline-static"
                                                        size="small"
                                                        value={area}
                                                        onChange={(e) => { setArea(e.target.value) }}
                                                        style={{ minWidth: 250 }}
                                                        variant="outlined"
                                                    />
                                                </div>
                                                <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                                                    <span className="label primary">City</span>
                                                    <TextField
                 autoComplete="off"
                                                        id="outlined-multiline-static"
                                                        size="small"
                                                        value={city}
                                                        onChange={(e) => { setCity(e.target.value) }}
                                                        style={{ minWidth: 250 }}
                                                        variant="outlined"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                                                    <span className="label primary">Address</span>
                                                    <TextField
                 autoComplete="off"
                                                        id="outlined-multiline-static"
                                                        size="small"
                                                        value={address}
                                                        onChange={(e) => { setAddress(e.target.value) }}
                                                        style={{ minWidth: 250 }}

                                                        variant="outlined"
                                                    />
                                                </div>
                                                <div className="flex flex-col w-full md:w-1/2 lg:w-1/2">
                                                    <span className="label primary">State</span>
                                                    <TextField
                 autoComplete="off"
                                                        id="outlined-multiline-static"
                                                        size="small"
                                                        value={state}
                                                        onChange={(e) => { setState(e.target.value) }}
                                                        style={{ minWidth: 250 }}

                                                        variant="outlined"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button variant="contained" style={{ backgroundColor: "#3f6212", color: "white" }} autoFocus className="p-5" onClick={Addcustomer}>
                                        {buttonLabel}
                                    </Button>
                                    <Button autoFocus variant="contained" onClick={resetAddDialog} color="error"  >
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </div>
                        </div>
                    </Dialog >
                </div >


            }
        </>
    )
}

export default CustomerList