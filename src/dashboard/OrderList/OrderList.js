import Header from "../Header"
import { BsLightbulbFill } from "react-icons/bs";
import { Alert, AlertTitle, Autocomplete, Button, Checkbox, DialogActions, FormControl, InputLabel, ListItemText, MenuItem, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Loader from "../../componets/loader/Loader";
import AddIcon from '@mui/icons-material/Add';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const OrderList = () => {
    const history = useHistory()

    const rowsPerPage = 10;
    const OnlineOrdercolumns = [
        { id: 'company_name', label: 'Company Name', minWidth: 170, height: 100 },
        { id: 'iteam_name', label: 'Item Name', minWidth: 100 },
        { id: 'y_n', label: 'Status', minWidth: 100 },
        { id: 'supplier_name', label: 'Last Purchase', minWidth: 100 },
        { id: 'stock', label: 'Stock', minWidth: 100 }
    ];
    const LastPurchaseListcolumns = [
        { id: 'supplier_name', label: 'Distributor Name', minWidth: 170, height: 100 },
        { id: 'qty', label: 'QTY', minWidth: 100 },
        { id: 'fr_qty', label: 'Free', minWidth: 100 },
        { id: 'scheme_account', label: 'Sch. Amt', minWidth: 100 },
        { id: 'margin', label: 'Margin%', minWidth: 100 },
        { id: 'ptr', label: 'PTR', minWidth: 100 },
        { id: 'mrp', label: 'MRP', minWidth: 100 },
        { id: 'bill_date', label: 'Date', minWidth: 100 },
        { id: 'bill_no', label: 'Bill No', minWidth: 100 },
    ];
    const [distributor, setDistributor] = useState(null)
    const [itemName, setItemName] = useState(null)
    const [items, setItems] = useState([])
    const [onlineOrder, setOnlineOrder] = useState([])
    const [statusName, setStatusName] = useState({ id: 2, name: 'Order' })
    const [distributorList, setDistributorList] = useState([]);
    const [statusOption, setStatusOpation] = useState([]);
    const initialSearchTerms = OnlineOrdercolumns.map(() => '');
    const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
    const [company, setCompany] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const totalPages = Math.ceil(onlineOrder.length === 0 ? 0 : onlineOrder.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const token = localStorage.getItem("token")
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const paginatedData = onlineOrder.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
    const [openAddPopUp, setOpenAddPopUp] = useState(false);
    const [openAddPopUpPlaceOrder, setOpenAddPopUpPlaceOrder] = useState(false);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [orderId, setOrderId] = useState(null);
    // const pendingStatusData = onlineOrder.filter(x => x?.y_n == 'Pending');



    const handelAddOpen = () => {
        setOpenAddPopUpPlaceOrder(true);
    }


    // const handelEditOpen = (row) => {
    //     const x = row;
    //     //console.log(row);
    //     setStatusName({
    //         // id:,
    //         name: row?.y_n
    //     })
    //     setOpenAddPopUpPlaceOrder(true);
    // }
    useEffect(() => {
        OnlineOrderList()
        listDistributor();
        listOnlineSaleStatus();

    }, [])

    const PlaceOrder = async () => {
        let data = new FormData()
        // setIsLoading(true);
        const params = {
            id: items.join(','),
            status: statusName,
        }
        try {
            await axios.post('online-sales-status-changes?', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                toast.success(response.data.meassage);
                OnlineOrderList();
                setOpenAddPopUpPlaceOrder(false)
                setItems([])
                setStatusName({ id: 2, name: 'Order' })
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }

            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const OnlineOrderList = async (currentPage) => {
        let data = new FormData()
        setIsLoading(true);
        const params = {
            company_id: company,
            distributor_id: distributor?.name,
            item_id: itemName?.iteam_name,
            page: currentPage
        }
        try {
            await axios.post('online-sales-order?', data, {
                params: params,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setOnlineOrder(response.data.data)
                setItemName(response.data.data)
                setIsLoading(false);
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    let listDistributor = async () => {
        try {
            await axios.get("list-distributer", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                localStorage.setItem("distributor", response.data.data.distributor)
                setDistributorList(response.data.data);
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            //console.log("API Error:", error);
        }
    };

    let listOnlineSaleStatus = async () => {
        try {
            await axios.get("order-status-list", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((response) => {
                setStatusOpation(response.data.data);
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            //console.log("API Error:", error);
        }
    };

    const lastPurchseHistory = async (orderId) => {
        let data = new FormData()
        const params = {
            item_id: orderId,
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
                if (response.data.status === 401) {
                    history.push('/');
                    localStorage.clear();
                }
            })
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const handleOpenDialog = (id) => {
        setOpenAddPopUp(true)
        setOrderId(id);
        lastPurchseHistory(id)
    }

    const resetAddDialog = () => {
        setOpenAddPopUpPlaceOrder(false);
        setItems([])
        setStatusName({ id: 2, name: 'Order' })
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            OnlineOrderList(newPage);
        }
    };

    const handleNext = () => {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        OnlineOrderList(newPage);
    };

    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        OnlineOrderList(pageNum);
    };

    const sortByColumn = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...onlineOrder].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setOnlineOrder(sortedData);
    };

    const filteredList = paginatedData.filter(row => {
        return searchTerms.every((term, index) => {
            const value = row[OnlineOrdercolumns[index].id];
            return String(value).toLowerCase().includes(term.toLowerCase());
        });
    });

    const handleSearchChange = (index, value) => {
        const newSearchTerms = [...searchTerms];
        newSearchTerms[index] = value;
        setSearchTerms(newSearchTerms);
    };

    const handleChangeFilter = (event) => {
        let value = event.target.value;

        // Check if the value is a string and contains commas
        if (typeof value === 'string' && value.includes(',')) {
            // Split the string by commas and convert to an array of strings
            value = value.split(',').map((item) => item.trim());
        }

        if (value.includes('select-all')) {
            if (items.length === onlineOrder.length) {
                setItems([]);
            } else {
                setItems(onlineOrder.map((item) => item.item_id));
            }
        } else {
            setItems(value);
        }

        //console.log('items', items);
    };


    const itemIdToNameMap = onlineOrder.reduce((map, item) => {
        map[item.item_id] = item.iteam_name;
        return map;
    }, {});

    const renderValue = (selected) => {
        return selected.map((value) => {
            return itemIdToNameMap[value] || value;
        }).join(', ');
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
                {isLoading ? <div className="loader-container ">
                    <Loader />
                </div> :
                    <div style={{ background: "rgba(153, 153, 153, 0.1)", height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }}>
                        <div className='py-3' style={{ display: 'flex', gap: '4px' }}  >
                            <div style={{ display: 'flex', gap: '7px', }}>
                                <span style={{ color: 'var(--color2)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px', minWidth: "100px" }}  >Order List</span>
                                <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow" />
                            </div>
                            <div className="headerList">
                                <Button variant="contained" style={{ display: 'flex', gap: '0px', background: "var(--color1)" }} onClick={handelAddOpen}><AddIcon className="ml-2" /> Place Order</Button>
                            </div>
                        </div>

                        <div className="firstrow p-4">
                            <div className="flex flex-col gap-8 lg:flex-row lg:gap-8">
                                <div className="detail flex flex-col">
                                    <span className="text-gray-500">Distributor</span>
                                    {/* <TextField
                 autoComplete="off"
                                        id="outlined-basic"
                                        value={distributor}
                                        onChange={(e) => setDistributor(e.target.value)}
                                        sx={{
                                            width: 'full',
                                            '& .MuiInputBase-root': {
                                                height: 45,
                                                fontSize: '1.10rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                padding: '10px 14px',
                                            },
                                        }}
                                        variant="outlined"
                                        fullWidth
                                    /> */}
                                    <Autocomplete
                                        value={distributor}
                                        sx={{
                                            width: 'full',
                                            '& .MuiInputBase-root': {
                                                width: 350,
                                                height: 45,
                                                fontSize: '1.10rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                padding: '10px 14px',
                                            },
                                        }}
                                        variant="outlined"
                                        fullWidth
                                        onChange={(e, value) => setDistributor(value)}
                                        options={distributorList}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => <TextField
                                            autoComplete="off"
                                            {...params}
                                            name={distributor?.name || ''}
                                        />}
                                    />
                                </div>
                                <div className="detail flex flex-col">
                                    <span className="text-gray-500">Company Name</span>
                                    <TextField
                                        autoComplete="off"
                                        id="outlined-basic"
                                        value={company}
                                        onChange={(e) => setCompany(e.target.value)}
                                        sx={{
                                            width: 'full',
                                            '& .MuiInputBase-root': {
                                                height: 45,
                                                fontSize: '1.10rem',
                                            },
                                            '& .MuiAutocomplete-inputRoot': {
                                                padding: '10px 14px',
                                            },
                                        }}
                                        variant="outlined"
                                        fullWidth
                                    />
                                </div>
                                <div className="flex flex-col  space-x-1">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={OnlineOrderList}
                                        style={{
                                            minHeight: '45px',
                                            alignItems: "center",
                                            marginTop: "25px",
                                            background: "var(--color1)"
                                        }}
                                    >
                                        <FilterAltIcon size='large' className="text-white text-lg" /> Filter
                                    </Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto mt-4">
                                <table className="w-full bg-transparent border-collapse custom-table">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="py-2 px-4 text-left">SR. No</th>
                                            {OnlineOrdercolumns.map((column, index) => (
                                                <th
                                                    key={column.id}
                                                    onClick={() => sortByColumn(column.id)}
                                                    className="py-2 px-4 text-left cursor-pointer"
                                                >
                                                    <div className='flex items-center gap-2'>
                                                        <span>{column.label}</span>
                                                        <SwapVertIcon style={{ cursor: 'pointer' }} onClick={() => sortByColumn(column.id)} />
                                                        <TextField
                                                            autoComplete="off"
                                                            label={`Search ${column.label}`}
                                                            id="filled-basic"
                                                            // className="w-[150px]"
                                                            size="small"
                                                            value={searchTerms[index]}
                                                            onChange={(e) => handleSearchChange(index, e.target.value)}
                                                            className="ml-2"
                                                        />
                                                    </div>
                                                </th>
                                            ))}
                                            <th className="py-2 px-4 text-left">Action</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredList.length === 0 ? (
                                            <tr>
                                                <td colSpan={OnlineOrdercolumns.length + 1} className="text-center py-4 text-gray-500">
                                                    No data found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredList.map((row, index) => (
                                                <tr key={row.code} className="hover:bg-gray-100">
                                                    <td className="py-2 px-4">{startIndex + index}</td>
                                                    {OnlineOrdercolumns.map((column) => {
                                                        const value = row[column.id];
                                                        const isStatus = column.id === 'y_n';
                                                        const statuscolor = isStatus && value === 'Order' ? 'orderStatus' : isStatus && value === 'Pending' ? 'pendingStatus' : 'text-black';
                                                        return (
                                                            <td key={column.id} className="py-2 px-4" align={column.align}>
                                                                <span className={`text ${isStatus && statuscolor}`}>
                                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                                </span>
                                                            </td>
                                                        );
                                                    })}
                                                    <td >
                                                        <VisibilityIcon
                                                            className='cursor-pointer'
                                                            onClick={() => handleOpenDialog(row.item_id)}
                                                            color="primary"
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
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
                        </div>

                        <Dialog open={openAddPopUp}
                            sx={{
                                "& .MuiDialog-container": {
                                    "& .MuiPaper-root": {
                                        width: "65%",
                                        maxWidth: "1900px",  // Set your width here
                                    },
                                },
                            }}>
                            <DialogTitle id="alert-dialog-title" className="secondary">
                                Item Purchase History
                            </DialogTitle>
                            <div className="px-6 " >
                                <Alert severity="info">
                                    <AlertTitle>Info</AlertTitle>
                                    Lastest 5 Purchase History.
                                </Alert>
                            </div>
                            <IconButton
                                aria-label="close"
                                onClick={() => setOpenAddPopUp(false)}
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
                                                        <th key={column.id} onClick={() => sortByColumn(column.id)}>

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
                                                            <tr hover tabIndex={-1} key={row.code} onClick={(() => setOpenAddPopUp(true))} >
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

                        <Dialog open={openAddPopUpPlaceOrder}>
                            <DialogTitle id="alert-dialog-title" className="primary">
                                Place Order
                            </DialogTitle>
                            <IconButton
                                aria-label="close"
                                onClick={() => setOpenAddPopUpPlaceOrder(false)}
                                sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500], }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    <div className="flex flex-col gap-5">
                                        <FormControl size="small">
                                            <InputLabel id="demo-select-small-label">Item Name</InputLabel>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                multiple
                                                value={items}
                                                sx={{ minWidth: '250px' }}
                                                onChange={handleChangeFilter}
                                                renderValue={renderValue}
                                                label="Item Name"
                                                MenuProps={{
                                                    PaperProps: {
                                                        style: {
                                                            maxHeight: 200, // Adjust the max height as needed
                                                            overflowY: 'auto',
                                                        },
                                                    },
                                                }}
                                            >
                                                <MenuItem key="select-all" value="select-all">
                                                    <Checkbox
                                                        sx={{
                                                            color: "var(--color2)", // Color for unchecked checkboxes
                                                            '&.Mui-checked': {
                                                                color: "var(--color1)", // Color for checked checkboxes
                                                            },
                                                        }}
                                                        checked={items.length === onlineOrder.length}
                                                        indeterminate={items.length > 0 && items.length < onlineOrder.length}
                                                    />
                                                    <ListItemText primary="Select All" />
                                                </MenuItem>
                                                {onlineOrder?.map((option) => (
                                                    <MenuItem key={option.item_id} value={option.item_id}>
                                                        <Checkbox
                                                            sx={{
                                                                color: "var(--color2)", // Color for unchecked checkboxes
                                                                '&.Mui-checked': {
                                                                    color: "var(--color1)", // Color for checked checkboxes
                                                                },
                                                            }} checked={items.indexOf(option.item_id) > -1} />
                                                        <ListItemText primary={option.iteam_name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>


                                        <FormControl size="small">
                                            {/* <InputLabel id="demo-select-small-label">Status</InputLabel> */}
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small-label"
                                                value={statusName}
                                                sx={{ minWidth: '250px' }}
                                                onChange={(e) => setStatusName(e.target.value)}
                                                size="small"
                                                // label="Status"
                                                displayEmpty
                                            >
                                                {/* <MenuItem value="" disabled>Select All</MenuItem> */}
                                                {statusOption.map(option => (
                                                    <MenuItem key={option.id} value={option.id}>{option.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button autoFocus variant="contained" className="p-5" style={{ textTransform: 'none', backgroundColor: "#3f6212" }} onClick={PlaceOrder} >
                                    Place Order
                                </Button>
                                <Button autoFocus variant="contained" style={{ textTransform: 'none', backgroundColor: "#F31C1C" }} onClick={resetAddDialog}  >
                                    Cancel
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                }

            </div>
        </>
    )
}
export default OrderList