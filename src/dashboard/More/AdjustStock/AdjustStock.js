import { BsLightbulbFill } from "react-icons/bs"
import Header from "../../Header"
import { Autocomplete, Button, IconButton, InputAdornment, ListItem } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DatePicker from 'react-datepicker';
import { format, subDays } from 'date-fns';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';
import Loader from "../../../componets/loader/Loader";
import { toast, ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const AdjustStock = () => {
    const history = useHistory()

    const stockList = [
        { id: 'adjusted_by', label: 'Adjust By', minWidth: 10 },
        { id: 'adjustment_date', label: 'Adjustment Date', minWidth: 10 },
        { id: 'iteam_name', label: 'Item Name', minWidth: 100 },
        { id: 'batch_name', label: 'Batch', minWidth: 100 },
        { id: 'unite', label: 'Unit', minWidth: 100 },
        { id: 'expriy', label: 'Expiry', minWidth: 100 },
        { id: 'company_name', label: 'Company Name', minWidth: 100 },
        { id: 'mrp', label: 'MRP', minWidth: 100 },
        { id: 'stock', label: 'Total Stock', minWidth: 100 },
        { id: 'stock_adjust', label: 'Stock Adjusted', minWidth: 100 },
        { id: 'remaining_stock', label: 'Remaining Stock', minWidth: 100 },
    ];
    const [stock, setStock] = useState('')
    const [adjustStockListData, setAdjustStockListData] = useState([]);
    const [openAddPopUp, setOpenAddPopUp] = useState(false);
    const [selectedItem, setSelectedItem] = useState()
    const [search, setSearch] = useState('')
    const [batch, setBatch] = useState()
    const [batchList, setBatchList] = useState([]);
    const token = localStorage.getItem("token");
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const initialSearchTerms = stockList.map(() => '');
    const [isLoading, setIsLoading] = useState(false);
    const startIndex = (currentPage - 1) * rowsPerPage + 1;
    const totalPages = Math.ceil(adjustStockListData.length / rowsPerPage);
    const [searchTerms, setSearchTerms] = useState(initialSearchTerms);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [itemId, setItemId] = useState(null);
    const [errors, setErrors] = useState({});
    const [stockAdjust, setStockAdjust] = useState('')
    const [companyList, setCompanyList] = useState([]);
    const [purchaseItemData, setpurchaseItemData] = useState([]);
    const [unit, setUnit] = useState('')
    const [remainingStock, setRemainingStock] = useState('')
    const [batchListData, setBatchListData] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [adjustmentDate, setAdjustDate] = useState(new Date())
    const [expiry, setExpiry] = useState('')
    const [mrp, setMrp] = useState('')

    const handlePrevious = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            adjustStockList(newPage);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            adjustStockList();
        }
    };
    const handleClick = (pageNum) => {
        setCurrentPage(pageNum);
        adjustStockList(pageNum);
    };

    const handleNext = () => {
        const newPage = currentPage + 1;
        setCurrentPage(newPage);
        adjustStockList(newPage);
    };

    const resetAddDialog = () => {
        setOpenAddPopUp(false);
        setBatch();
        setSelectedCompany(null);
        setSelectedItem()
        setUnit('')
        setExpiry('')
        setMrp('')
        setStock('')
        setStockAdjust('')
        setRemainingStock('')
        setAdjustDate(new Date())
    }

    useEffect(() => {
        listOfCompany()
        adjustStockList();
        purchaseItemList()
    }, [])

    useEffect(() => {
        const x = parseFloat(stock) + parseFloat(stockAdjust);
        setRemainingStock(x);
    }, [stockAdjust])
    let listOfCompany = () => {
        axios
            .get("company-list",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            .then((response) => {
                //console.log("API Response Pharma:===", response);
                setCompanyList(response.data.data);
            })
            .catch((error) => {
                //console.log("API Error:", error);
            });
    };

    let purchaseItemList = () => {
        axios
            .post("purches-iteam-list",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            .then((response) => {
                //console.log("API Response Pharma:===", response);
                setpurchaseItemData(response.data.data);
            })
            .catch((error) => {
                //console.log("API Error:", error);
            });
    };

    const adjustStockList = async (currentPage) => {
        let data = new FormData();
        setIsLoading(true);
        const params = {
            search: search,
            page: currentPage
        };
        try {
            const res = await axios.post("adjust-stock-list", data, {
                params: params,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
            ).then((response) => {
                setAdjustStockListData(response.data.data.data);
                setIsLoading(false);
                if(response.data.status === 401){ 
                    history.push('/');
                    localStorage.clear();
                }
            })
           
        } catch (error) {
            console.error("API error:", error);
        }
    }

    const ItemvisebatchList = async (itemId) => {
        let data = new FormData();
        data.append("iteam_id", itemId);
        const params = {
            iteam_id: itemId
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
                const data = response.data.data
                setBatchListData(response.data.data);
                if(response.data.status === 401){ 
                    history.push('/');
                    localStorage.clear();
                }

            })
            
        } catch (error) {
            console.error("API error:", error);
        }
    }

    // const ItemvisebatchList = async (itemId) => {
    //     let data = new FormData();
    //     data.append("item_id", itemId); // Corrected the typo from "iteam_id" to "item_id"
    //     const params = {
    //         item_id: itemId, // Corrected the typo from "iteam_id" to "item_id"
    //     };
    //     try {
    //         const res = await axios.post("batch-list?", data, {
    //             params: params,
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         });

    //         const data = res.data.data;
    //         setBatchListData(data);

    //         // Find the company from the companyList based on the company_id in the response data
    //         const company = companyList.find(x => x.id === data[0]?.company_id);

    //         if (company) {
    //             setSelectedCompany(company);
    //         } else {
    //             console.warn("Company not found in companyList");
    //         }
    //     } catch (error) {
    //         console.error("API error:", error);
    //     }
    // };


    const filteredList = adjustStockListData.filter(row => {
        return searchTerms.every((term, index) => {
            const value = row[stockList[index].id];
            return String(value).toLowerCase().includes(term.toLowerCase());
        });
    });

    const handleOptionChange = (event, newValue) => {
        const itemName = newValue ? newValue.iteam_name : '';
        setSelectedItem(itemName);
        setItemId(newValue?.id);
        ItemvisebatchList(newValue?.id)

    };

    const handleBatchData = (event, newValue) => {
        const batch = newValue ? newValue.batch_name : '';
        setBatch(batch)
        setUnit(newValue?.unit)
        setExpiry(newValue?.expiry_date)
        setMrp(newValue?.mrp)
        setStock(newValue?.qty)
        const company = companyList.find(x => x.id == batchListData[0]?.company_id)
        setSelectedCompany(company)
        //console.log('company', company);
    };

    const validateForm = async () => {
        const newErrors = {};

        if (!selectedItem) {
            newErrors.selectedItem = 'select any Item Name.';
            toast.error(newErrors.selectedItem);
        }
        else if (!batch) {
            newErrors.batch = 'Batch Number is required';
            toast.error(newErrors.batch);
        }
        // else if (!selectedCompany) {
        //     newErrors.selectedCompany = 'select any Company Name'
        //     toast.error(newErrors.selectedCompany);
        // }
        else if (!stockAdjust) {
            newErrors.stockAdjust = 'please Enter any Adjust Stock Number'
            toast.error(newErrors.stockAdjust);
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            adjustStockAddData();
        } else {
            return Object.keys(newErrors).length === 0;
        }
    }

    const adjustStockAddData = async () => {
        let data = new FormData()
        setIsLoading(true);
        data.append('adjustment_date', adjustmentDate ? format(adjustmentDate, 'yyyy-MM-dd') : '');
        data.append('item_name', selectedItem);
        data.append('batch', batch);
        data.append('company', selectedCompany?.id);
        data.append('unite', unit);
        data.append('expiry', expiry);
        data.append('mrp', mrp);
        data.append('stock', stock);
        data.append('stock_adjust', stockAdjust);
        data.append('remaining_stock', remainingStock);

        try {
            await axios.post('adjust-stock', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
            ).then((response) => {
                setIsLoading(false);
                setOpenAddPopUp(false);
                setBatch();
                toast.success(response.data.message);
                setSelectedCompany(null);
                adjustStockList();
                setSelectedItem()
                setUnit('')
                setExpiry('')
                setMrp('')
                setStock('')
                setStockAdjust('')
                setRemainingStock('')
                setAdjustDate(new Date())
                if(response.data.status === 401){ 
                    history.push('/');
                    localStorage.clear();
                }
            })
          
        } catch (error) {
            console.error("API error:", error);
        }
    }


    const handleSearchChange = (index, value) => {
        const newSearchTerms = [...searchTerms];
        newSearchTerms[index] = value;
        setSearchTerms(newSearchTerms);
    };

    const sortByColumn = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedData = [...adjustStockListData].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
            return 0;
        });
        setAdjustStockListData(sortedData);
    };
    const handelAddOpen = () => {
        setOpenAddPopUp(true);
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

                <div style={{ background: "rgba(153, 153, 153, 0.1)", height: 'calc(99vh - 55px)', padding: "0px 20px 0px" }}>
                    <div className='py-3' style={{ display: 'flex', gap: '4px' }}  >
                        <div style={{ display: 'flex', gap: '7px', }}>
                            <span style={{ color: 'var(--color2)', display: 'flex', alignItems: 'center', fontWeight: 700, fontSize: '20px', minWidth: "130px", textWrap: "nowrap" }}  > Adjust Stock</span>
                            <BsLightbulbFill className="mt-1 w-6 h-6 secondary hover-yellow" />
                        </div>
                        <div className="headerList">
                            <Button variant="contained" style={{ display: 'flex', gap: '0px', background: "var(--color1)" }} onClick={handelAddOpen}><AddIcon className="ml-2" />  Adjust Stock</Button>
                        </div>
                    </div>

                    <div className="firstrow p-4">
                        <div className="flex flex-col gap-2 lg:flex-row lg:gap-2">
                            <div className="detail" >
                                <TextField
                 autoComplete="off"
                                    id="outlined-basic"
                                    value={search}
                                    sx={{ width: 'auto' }}
                                    size="small"
                                    onChange={(e) => setSearch(e.target.value)}
                                    variant="outlined"
                                    onKeyPress={handleKeyPress}
                                    placeholder="Search by Item name,Batch No"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" >
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                        type: 'search'
                                    }}
                                />
                            </div>
                            <div>
                                <Button
                                    style={{ background: "var(--color1)" }}
                                    variant="contained" onClick={adjustStockList}
                                    className="min-h-[41px] h-[41px] mt-6 bg-[#044C9D] text-white flex items-center justify-center"
                                >
                                    Go
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full border-collapse custom-table">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 ">SR. No</th>
                                        {stockList.map((column, index) => (
                                            <th key={column.id} className="">
                                                <div >
                                                    <span>{column.label}</span>
                                                    <SwapVertIcon style={{ cursor: 'pointer' }} onClick={() => sortByColumn(column.id)} />
                                                    {/* <TextField
                 autoComplete="off"
                                                            label={`Search ${column.label}`}
                                                            id="filled-basic"
                                                            // className="w-[150px]"
                                                            size="small"
                                                            value={searchTerms[index]}
                                                            onChange={(e) => handleSearchChange(index, e.target.value)}
                                                            className="ml-2"
                                                        />   */}
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredList.length === 0 ? (
                                        <tr>
                                            <td colSpan={stockList.length + 1} className=" text-gray-500 py-4">
                                                No data found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredList.map((row, index) => (
                                            <tr key={row.code} className="hover:bg-gray-100 cursor-pointer">
                                                <td className="px-4 py-2">{startIndex + index}</td>
                                                {stockList.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <td key={column.id} >
                                                            {column.format && typeof value === 'number'
                                                                ? column.format(value)
                                                                : value}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* <table className="custom-table">
                                <thead>
                                    <tr>
                                        <th>SR. No</th>
                                        {stockList.map((column, index) => (
                                            <th key={column.id}  >
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredList.length === 0 ? (
                                        <tr>
                                            <td colSpan={stockList.length + 2} style={{ textAlign: 'center', color: 'gray' }}>
                                                No data found
                                            </td>
                                        </tr>
                                    ) : (filteredList
                                        .map((row, index) => {
                                            return (
                                                <tr hover role="checkbox" tabIndex={-1} key={row.code} className="cursor-pointer">
                                                    <td>
                                                        {startIndex + index}
                                                    </td>
                                                    {stockList.map((column, index) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <>
                                                                <td key={column.id} align={column.align} >
                                                                    {column.format && typeof value === 'number'
                                                                        ? column.format(value)
                                                                        : value}
                                                                </td>

                                                            </>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        }))}
                                </tbody>
                            </table> */}
                        <div className='mt-4 space-x-1' style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                            <button
                                onClick={handlePrevious}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-700' : 'secondary-bg text-white'
                                    }`}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
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
                            <button
                                onClick={handleNext}
                                className={`mx-1 px-3 py-1 rounded ${currentPage === rowsPerPage ? 'bg-gray-200 text-gray-700' : 'secondary-bg text-white'
                                    }`}
                                disabled={filteredList.length === 0}
                            >
                                Next
                            </button>
                        </div>
                    </div>


                    <Dialog open={openAddPopUp} >
                        <DialogTitle id="alert-dialog-title" className="secondary">
                            Stock Adjustment
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={resetAddDialog}
                            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <div className="flex" style={{ flexDirection: 'column', gap: '19px' }}>
                                    <div className="flex gap-4">
                                        <div>
                                            <span className="title mb-2">Adjustment Date</span>
                                            <DatePicker
                                                className='custom-datepicker '
                                                selected={adjustmentDate}
                                                onChange={(newDate) => setAdjustDate(newDate)}
                                                dateFormat="dd/MM/yyyy"
                                                minDate={subDays(new Date(), 15)}//
                                            />
                                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    sx={{ width: 250 }}
                                                    value={adjustmentDate}
                                                    onChange={(newDate) => setAdjustDate(newDate)}
                                                    format="DD/MM/YYYY"
                                                />
                                            </LocalizationProvider> */}
                                        </div>
                                        <div>
                                            <span className="title mb-2">Item Name</span>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={purchaseItemData}
                                                size="small"
                                                value={selectedItem}
                                                onChange={handleOptionChange}
                                                sx={{ width: 200 }}
                                                getOptionLabel={(option) => option.iteam_name}
                                                renderInput={(params) => (
                                                    <TextField
                 autoComplete="off"
                                                        {...params}
                                                        label="Select Item"
                                                    />
                                                )} />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div>
                                            <span className="title mb-2">Batch</span>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={batchListData}
                                                size="small"
                                                value={batch}
                                                onChange={handleBatchData}
                                                sx={{ width: 200 }}
                                                getOptionLabel={(option) => option.batch_number}
                                                renderInput={(params) => (
                                                    <TextField
                 autoComplete="off"
                                                        {...params}
                                                        label="Select Batch"
                                                    />
                                                )} />

                                        </div>

                                        <div >
                                            <span className="title mb-2">Company</span>
                                            <Autocomplete
                                                disablePortal
                                                id="combo-box-demo"
                                                options={companyList}
                                                size="small"
                                                value={selectedCompany}
                                                onChange={(e, value) => setSelectedCompany(value)}
                                                sx={{ width: 200 }}
                                                disabled
                                                getOptionLabel={(option) => option.company_name}
                                                renderInput={(params) => (
                                                    <TextField
                 autoComplete="off" autoComplete="off"{...params} />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div>
                                            <span className="title mb-2">Unit</span>
                                            <TextField
                 autoComplete="off"
                                                disabled
                                                required
                                                id="outlined-number"
                                                sx={{ width: '130px' }}
                                                size="small"
                                                value={unit}
                                                onChange={(e) => setUnit(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <span className="title mb-2">Expiry</span>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-number"
                                                sx={{ width: '130px' }}
                                                size="small"
                                                disabled
                                                value={expiry}
                                                onChange={(e) => { setExpiry(e.target.value) }}
                                            />
                                        </div>
                                        <div>
                                            <span className="title mb-2">MRP</span>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-number"
                                                type="number"
                                                sx={{ width: '130px' }}
                                                size="small"
                                                disabled
                                                value={mrp}
                                                onChange={(e) => { setMrp(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div>
                                            <span className="title mb-2">Stock </span>
                                            <TextField
                 autoComplete="off"
                                                id="outlined-number"
                                                type="number"
                                                sx={{ width: '130px' }}
                                                size="small"
                                                disabled
                                                value={stock}
                                                onChange={(e) => { setStock(e.target.value) }}
                                            />
                                        </div>
                                        <div>
                                            <span className="title mb-2">Stock Adjusted </span>
                                            {/* <TextField
                 autoComplete="off"
                                                id="outlined-number"
                                                type="number"
                                                sx={{ width: '130px' }}
                                                size="small"
                                                value={stockAdjust}
                                                onChange={(e) => { setStockAdjust(e.target.value) }}
                                            /> */}
                                            <TextField
                 autoComplete="off"
                                                id="outlined-number"
                                                type="number"
                                                sx={{ width: '130px' }}
                                                size="small"
                                                value={stockAdjust}
                                                onChange={(e) => {
                                                    const value = parseFloat(e.target.value);
                                                    setStockAdjust(value > 0 ? -value : value);
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <span className="title mb-2">Remaining Stock  </span>
                                            <TextField
                 autoComplete="off"
                                                disabled
                                                id="outlined-number"
                                                type="number"
                                                sx={{ width: '130px' }}
                                                size="small"
                                                value={remainingStock}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button style={{ background: "#3f6212" }} autoFocus variant="contained" className="p-5" onClick={validateForm}>
                                Save
                            </Button>
                            <Button style={{ background: "#F31C1C" }} autoFocus variant="contained" onClick={resetAddDialog} color="error"  >
                                Cancel
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div >
            }
        </>
    )
}
export default AdjustStock